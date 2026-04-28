import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const RESEND_API_KEY = process.env.RESEND_API_KEY!
const FROM_ADDRESS = 'Ramesh from Qyren <ramesh@qyren.ai>'

// Server-side client uses service_role key. Bypasses RLS so we control inserts here.
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

interface CaptureBody {
  email?: string
  captured_from_tool?: string
  source_locale?: 'en' | 'tr' | 'cn'
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS: allow our own origin in production, localhost in dev, vercel preview deploys.
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

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  const body = (req.body || {}) as CaptureBody
  const email = (body.email || '').trim().toLowerCase()
  const captured_from_tool = body.captured_from_tool || 'directory'
  const source_locale = body.source_locale || 'en'

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'invalid email' })
  }

  const { error: insertError } = await supabase.from('leads').insert({
    email,
    captured_from_tool,
    source_locale,
    referrer: req.headers.referer || null,
    user_agent: req.headers['user-agent'] || null,
  })

  // 23505 = unique violation. Treat duplicate as success so the user sees the same UX.
  if (insertError && insertError.code !== '23505') {
    console.error('Supabase insert error:', insertError)
    return res.status(500).json({ error: 'failed to save' })
  }

  // Send welcome email via Resend. Don't fail the request if email fails. Lead is captured.
  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: email,
        subject: 'Welcome to Qyren Tools',
        html: welcomeEmailHtml(source_locale),
        text: welcomeEmailText(source_locale),
        reply_to: 'ramesh@qyren.ai',
      }),
    })
    if (!emailResponse.ok) {
      const detail = await emailResponse.text()
      console.error('Resend send failed:', emailResponse.status, detail)
    }
  } catch (err) {
    console.error('Resend fetch threw:', err)
  }

  return res.status(200).json({ ok: true })
}

// Email templates. Voice rules: no em dashes, no banned words.
// Pragmatic founder voice. Plain text body kept short for replies.

function welcomeEmailHtml(locale: 'en' | 'tr' | 'cn'): string {
  if (locale === 'tr') return welcomeHtmlTr()
  if (locale === 'cn') return welcomeHtmlCn()
  return welcomeHtmlEn()
}

function welcomeEmailText(locale: 'en' | 'tr' | 'cn'): string {
  if (locale === 'tr') return welcomeTextTr()
  if (locale === 'cn') return welcomeTextCn()
  return welcomeTextEn()
}

function welcomeHtmlEn(): string {
  return `
<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #0B1225; max-width: 560px; margin: 0 auto; padding: 24px; line-height: 1.6;">
    <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 16px; color: #0B1225;">Welcome to Qyren Tools</h1>
    <p>Thanks for joining. The directory is the first surface. The interesting part is what we are building on top of it.</p>
    <p>Three things shipping in the next few weeks:</p>
    <ul style="padding-left: 18px;">
      <li><strong>PPP + FX-Drift Price Localizer</strong>. Reprice your IAP catalog by purchasing-power parity, with alerts when target currencies drift against USD. Built with Turkish studios in mind.</li>
      <li><strong>iOS IAP Bulk Editor</strong>. The bulk uploader Apple has not built for nine years. Bring your own ASC API key. Edit in a grid. Dry-run. Commit.</li>
      <li><strong>SKAN Conversion Schema Designer</strong>. Land before SKAN 5 GA.</li>
    </ul>
    <p>If a specific monetization workflow is broken for you and you wish there was a tool that fixed it, hit reply. The roadmap is informed by what operators actually need, not what we guess.</p>
    <p style="margin-top: 24px;">Ramesh<br>Qyren</p>
    <hr style="border: none; border-top: 1px solid #E5E3DA; margin: 32px 0 16px;" />
    <p style="font-size: 12px; color: rgba(11, 18, 37, 0.5);">You received this because you signed up at tools.qyren.ai. Reply with "unsubscribe" if you no longer want to hear from us.</p>
  </body>
</html>`.trim()
}

function welcomeTextEn(): string {
  return [
    'Welcome to Qyren Tools.',
    '',
    'Thanks for joining. The directory is the first surface. The interesting part is what we are building on top of it.',
    '',
    'Three things shipping in the next few weeks:',
    '',
    '- PPP + FX-Drift Price Localizer. Reprice your IAP catalog by purchasing-power parity, with alerts when target currencies drift against USD. Built with Turkish studios in mind.',
    '- iOS IAP Bulk Editor. The bulk uploader Apple has not built for nine years. Bring your own ASC API key. Edit in a grid. Dry-run. Commit.',
    '- SKAN Conversion Schema Designer. Land before SKAN 5 GA.',
    '',
    'If a specific monetization workflow is broken for you and you wish there was a tool that fixed it, hit reply. The roadmap is informed by what operators actually need, not what we guess.',
    '',
    'Ramesh',
    'Qyren',
    '',
    '---',
    'You received this because you signed up at tools.qyren.ai. Reply with "unsubscribe" if you no longer want to hear from us.',
  ].join('\n')
}

// Placeholder. Will be replaced by native-Turkish freelancer in Sprint 1 §D1.
function welcomeHtmlTr(): string {
  return welcomeHtmlEn()
}

function welcomeTextTr(): string {
  return welcomeTextEn()
}

// Placeholder. Will be replaced by native-Chinese freelancer in Sprint 1 §D2.
function welcomeHtmlCn(): string {
  return welcomeHtmlEn()
}

function welcomeTextCn(): string {
  return welcomeTextEn()
}
