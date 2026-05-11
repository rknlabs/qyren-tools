import type {
  BugReportSubmission,
  SubmitResult,
} from '../../components/feedback/types'
import { uploadScreenshots } from './uploadScreenshots'

// Orchestrates a bug-report submission: uploads any attached screenshots
// to the public bucket via the anon Supabase client, then POSTs the form
// payload (with the resulting URLs) to /api/bug-report. The Vercel
// function on the other end handles validation, IP-hash rate-limit,
// honeypot, the DB insert, and the Resend notification to support@.
export async function submitBugReport(input: BugReportSubmission): Promise<SubmitResult> {
  const upload = await uploadScreenshots(input.screenshots)
  if (!upload.ok) {
    return { ok: false, error: upload.error ?? 'Screenshot upload failed.' }
  }

  try {
    const res = await fetch('/api/bug-report', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        tool_id: input.tool_id,
        description: input.description,
        reporter_email: input.reporter_email,
        screenshot_urls: upload.urls,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        _company_url: input._company_url,
      }),
    })
    if (res.status === 429) {
      return {
        ok: false,
        error: 'Too many reports from this connection. Please try again later.',
      }
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('Bug report API error:', res.status, detail)
      return { ok: false, error: 'Could not submit. Please try again.' }
    }
    return { ok: true }
  } catch (err) {
    console.error('Bug report submit threw:', err)
    return { ok: false, error: 'Network error. Please try again.' }
  }
}
