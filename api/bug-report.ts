import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const RESEND_API_KEY = process.env.RESEND_API_KEY!
const FROM_ADDRESS = 'Qyren Bug Reports <ramesh@qyren.ai>'
const TO_ADDRESS = 'support@qyren.ai'

// Fixed salt for hashing submitter IPs. Not a secret; the threat model is
// "if the bug_reports table leaks, raw IPs don't leak with it" not "an
// attacker cannot guess the salt." Rotating the salt is a one-line change
// that would reset existing rate-limit windows.
const IP_HASH_SALT = 'qyren-bug-report-v1'

const MAX_REPORTS_PER_HOUR = 5
const WINDOW_MS = 60 * 60 * 1000
const MAX_SCREENSHOT_URLS = 3
const MAX_DESCRIPTION_LENGTH = 5000
const MIN_DESCRIPTION_LENGTH = 20

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

interface BugReportBody {
  tool_id?: string
  description?: string
  reporter_email?: string | null
  screenshot_urls?: unknown
  user_agent?: string
  page_url?: string
  _company_url?: string
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || ''
  const allowed =
    origin === 'https://tools.qyren.ai' ||
    origin.startsWith('http://localhost:') ||
    origin.startsWith('https://qyren-tools-')

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'content-type')
  }
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })

  const body = (req.body || {}) as BugReportBody

  // Honeypot: legitimate clients never populate _company_url. If present,
  // return success-shaped 200 so the bot moves on, and silently drop the
  // report (no row inserted, no email sent).
  if (typeof body._company_url === 'string' && body._company_url.trim() !== '') {
    return res.status(200).json({ ok: true })
  }

  const tool_id = (body.tool_id || '').trim()
  const description = (body.description || '').trim()
  const reporter_email_raw = (body.reporter_email || '').toString().trim().toLowerCase()
  const screenshot_urls = sanitizeScreenshotUrls(body.screenshot_urls)

  if (!tool_id) return res.status(400).json({ error: 'tool_id required' })
  if (description.length < MIN_DESCRIPTION_LENGTH) {
    return res.status(400).json({ error: `description must be at least ${MIN_DESCRIPTION_LENGTH} characters` })
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return res.status(400).json({ error: 'description too long' })
  }

  const reporter_email = reporter_email_raw === '' ? null : reporter_email_raw
  if (reporter_email !== null && !EMAIL_RE.test(reporter_email)) {
    return res.status(400).json({ error: 'invalid email' })
  }

  // Hash the submitter IP for rate-limiting without retaining identifying
  // info. If x-forwarded-for is missing (local dev, weird proxy), skip the
  // rate-limit check rather than treat all such submitters as one bucket.
  const ipHeader = req.headers['x-forwarded-for']
  const rawIp = Array.isArray(ipHeader)
    ? ipHeader[0]
    : (ipHeader || '').split(',')[0].trim()
  const submitter_ip_hash = rawIp
    ? createHash('sha256').update(rawIp + IP_HASH_SALT).digest('hex')
    : null

  if (submitter_ip_hash) {
    const since = new Date(Date.now() - WINDOW_MS).toISOString()
    const { count, error: countError } = await supabase
      .from('bug_reports')
      .select('id', { count: 'exact', head: true })
      .eq('submitter_ip_hash', submitter_ip_hash)
      .gte('created_at', since)
    if (countError) {
      // Don't block submission on a lookup failure — capture the report
      // and let the founder triage via Supabase if abuse later surfaces.
      console.error('Bug report rate-limit count failed:', countError)
    } else if ((count ?? 0) >= MAX_REPORTS_PER_HOUR) {
      return res.status(429).json({ error: 'too many reports from this connection; try again later' })
    }
  }

  const page_url = ((body.page_url || '') as string).slice(0, 1000) || null
  const user_agent =
    ((body.user_agent || req.headers['user-agent'] || '') as string).slice(0, 1000) || null

  const { data: inserted, error: insertError } = await supabase
    .from('bug_reports')
    .insert({
      tool_id,
      description,
      reporter_email,
      screenshot_urls,
      user_agent,
      page_url,
      submitter_ip_hash,
    })
    .select('id, created_at')
    .single()

  if (insertError || !inserted) {
    console.error('Bug report insert failed:', insertError)
    return res.status(500).json({ error: 'failed to save' })
  }

  // Send notification email. Don't fail the request if email fails — the
  // report is already captured in Supabase and the founder can see it via
  // dashboard. Failure paths get logged for follow-up.
  try {
    await sendNotificationEmail({
      id: inserted.id,
      created_at: inserted.created_at,
      tool_id,
      description,
      reporter_email,
      screenshot_urls,
      user_agent,
      page_url,
    })
  } catch (err) {
    console.error('Bug report email fetch threw:', err)
  }

  return res.status(200).json({ ok: true, id: inserted.id })
}

function sanitizeScreenshotUrls(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  const urls: string[] = []
  for (const item of input) {
    if (typeof item !== 'string') continue
    const trimmed = item.trim()
    if (trimmed === '') continue
    // Only accept URLs from our own Supabase storage to prevent the email
    // body from becoming an open redirect / link launder.
    if (!trimmed.startsWith(SUPABASE_URL)) continue
    urls.push(trimmed)
    if (urls.length >= MAX_SCREENSHOT_URLS) break
  }
  return urls
}

interface NotificationPayload {
  id: string
  created_at: string
  tool_id: string
  description: string
  reporter_email: string | null
  screenshot_urls: string[]
  user_agent: string | null
  page_url: string | null
}

interface ResendPayload {
  from: string
  to: string
  subject: string
  html: string
  text: string
  reply_to?: string
}

async function sendNotificationEmail(p: NotificationPayload): Promise<void> {
  const subjectDescription = p.description.length > 60
    ? `${p.description.slice(0, 60)}…`
    : p.description
  const subject = `[Qyren Bug] ${p.tool_id}: ${subjectDescription}`

  const screenshotsText = p.screenshot_urls.length > 0
    ? p.screenshot_urls.map((u) => `- ${u}`).join('\n')
    : 'None attached'
  const screenshotsHtml = p.screenshot_urls.length > 0
    ? `<ul>${p.screenshot_urls.map((u) => `<li><a href="${escapeHtml(u)}">${escapeHtml(u)}</a></li>`).join('')}</ul>`
    : '<p>None attached</p>'

  const text = [
    'New bug report filed.',
    '',
    `Tool: ${p.tool_id}`,
    `URL: ${p.page_url ?? '(unknown)'}`,
    `Reporter: ${p.reporter_email ?? 'Anonymous'}`,
    `Browser: ${p.user_agent ?? '(unknown)'}`,
    `Filed: ${p.created_at}`,
    `ID: ${p.id}`,
    '',
    'Description:',
    p.description,
    '',
    'Screenshots:',
    screenshotsText,
  ].join('\n')

  const html = `<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #0B1225; max-width: 600px; margin: 0 auto; padding: 24px; line-height: 1.6;">
    <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 16px;">New bug report</h1>
    <p style="margin: 0 0 8px;"><strong>Tool:</strong> ${escapeHtml(p.tool_id)}</p>
    <p style="margin: 0 0 8px;"><strong>URL:</strong> ${escapeHtml(p.page_url ?? '(unknown)')}</p>
    <p style="margin: 0 0 8px;"><strong>Reporter:</strong> ${escapeHtml(p.reporter_email ?? 'Anonymous')}</p>
    <p style="margin: 0 0 8px;"><strong>Browser:</strong> ${escapeHtml(p.user_agent ?? '(unknown)')}</p>
    <p style="margin: 0 0 8px;"><strong>Filed:</strong> ${escapeHtml(p.created_at)}</p>
    <p style="margin: 0 0 16px;"><strong>ID:</strong> ${escapeHtml(p.id)}</p>
    <h2 style="font-size: 14px; font-weight: 600; margin: 16px 0 6px;">Description</h2>
    <pre style="white-space: pre-wrap; word-break: break-word; background: #F4F1EA; padding: 12px; border-radius: 6px; font-family: inherit; margin: 0 0 16px;">${escapeHtml(p.description)}</pre>
    <h2 style="font-size: 14px; font-weight: 600; margin: 16px 0 6px;">Screenshots</h2>
    ${screenshotsHtml}
  </body>
</html>`

  const payload: ResendPayload = {
    from: FROM_ADDRESS,
    to: TO_ADDRESS,
    subject,
    html,
    text,
  }
  // Reply-To when the reporter included an email, so hitting reply in the
  // support@qyren.ai inbox messages them directly. Omitted entirely when
  // anonymous so Resend does not default it to From.
  if (p.reporter_email) payload.reply_to = p.reporter_email

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!emailResponse.ok) {
    const detail = await emailResponse.text().catch(() => '')
    console.error('Resend send failed:', emailResponse.status, detail)
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
