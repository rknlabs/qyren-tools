// Catalogue of tools that accept bug reports. Add an entry when a new
// tool ships; the dropdown auto-pulls from this list and `detectToolId`
// picks the right pre-selection from window.location.pathname.
export interface BugReportTool {
  id: string
  label: string
  // Matches the URL path that the tool serves under. `null` means "this
  // is the catch-all option, never auto-detected to."
  pathPattern: RegExp | null
}

export const REPORT_BUG_TOOLS: readonly BugReportTool[] = [
  {
    id: 'gacha-disclosure-pack',
    label: 'Gacha Disclosure Pack',
    pathPattern: /^\/(?:tr\/|cn\/)?gacha-disclosure-pack(?:\/|$)/,
  },
  {
    id: 'other',
    label: 'Other / Multiple tools',
    pathPattern: null,
  },
]

export function detectToolId(pathname: string): string {
  for (const tool of REPORT_BUG_TOOLS) {
    if (tool.pathPattern && tool.pathPattern.test(pathname)) return tool.id
  }
  return 'other'
}

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export const MAX_SCREENSHOTS = 3
export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024 // 5 MB
export const MIN_DESCRIPTION_LENGTH = 20

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value)
}

export interface BugReportSubmission {
  tool_id: string
  description: string
  reporter_email: string | null
  screenshots: File[]
  // Honeypot — legitimate users never fill this. Non-empty on submit
  // = silently dropped server-side. The field is rendered with aria-hidden
  // and absolute off-screen positioning so screen readers and tabbing
  // skip it but naive bots still see it.
  _company_url: string
}

export type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export interface SubmitResult {
  ok: boolean
  error?: string
}
