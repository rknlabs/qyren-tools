import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import { X, Upload, AlertTriangle } from 'lucide-react'
import {
  ACCEPTED_IMAGE_TYPES,
  detectToolId,
  isValidEmail,
  MAX_SCREENSHOTS,
  MAX_SCREENSHOT_BYTES,
  MIN_DESCRIPTION_LENGTH,
  REPORT_BUG_TOOLS,
  type BugReportSubmission,
  type SubmitResult,
  type SubmitState,
} from './types'

interface ReportBugModalProps {
  onClose: () => void
  // Submit handler. Commit 2 supplies a stub that logs and resolves with
  // { ok: true }; commit 3 replaces this with a real handler that hits
  // /api/bug-report.
  onSubmit: (input: BugReportSubmission) => Promise<SubmitResult>
}

export function ReportBugModal({ onClose, onSubmit }: ReportBugModalProps) {
  const initialToolId = useMemo(
    () => (typeof window !== 'undefined' ? detectToolId(window.location.pathname) : 'other'),
    [],
  )
  const [toolId, setToolId] = useState(initialToolId)
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [screenshots, setScreenshots] = useState<File[]>([])
  const [honeypot, setHoneypot] = useState('')
  const [screenshotError, setScreenshotError] = useState<string | null>(null)
  const [state, setState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && state !== 'submitting') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, state])

  const descriptionTrimmed = description.trim()
  const descriptionTooShort = descriptionTrimmed.length < MIN_DESCRIPTION_LENGTH
  const emailEmpty = email.trim() === ''
  const emailInvalid = !emailEmpty && !isValidEmail(email.trim())
  const canSubmit =
    !descriptionTooShort && !emailInvalid && toolId !== '' && state !== 'submitting'

  function addFiles(incoming: FileList | File[]) {
    setScreenshotError(null)
    const next: File[] = [...screenshots]
    const remaining = MAX_SCREENSHOTS - next.length
    if (remaining <= 0) {
      setScreenshotError(`Maximum ${MAX_SCREENSHOTS} screenshots.`)
      return
    }
    const toAdd = Array.from(incoming).slice(0, remaining)
    if (Array.from(incoming).length > remaining) {
      setScreenshotError(`Maximum ${MAX_SCREENSHOTS} screenshots.`)
    }
    for (const file of toAdd) {
      if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
        setScreenshotError(`${file.name}: only JPG, PNG, WEBP, GIF are accepted.`)
        continue
      }
      if (file.size > MAX_SCREENSHOT_BYTES) {
        setScreenshotError(`${file.name}: exceeds 5 MB.`)
        continue
      }
      next.push(file)
    }
    setScreenshots(next)
  }

  function removeFile(index: number) {
    setScreenshots(screenshots.filter((_, i) => i !== index))
    setScreenshotError(null)
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDraggingOver(false)
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
  }

  function onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ''
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setState('submitting')
    setErrorMessage(null)
    try {
      const result = await onSubmit({
        tool_id: toolId,
        description: descriptionTrimmed,
        reporter_email: emailEmpty ? null : email.trim(),
        screenshots,
        _company_url: honeypot,
      })
      if (result.ok) {
        setState('success')
      } else {
        setState('error')
        setErrorMessage(result.error ?? 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Bug report submit threw:', err)
      setState('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  function resetForm() {
    setToolId(initialToolId)
    setDescription('')
    setEmail('')
    setScreenshots([])
    setHoneypot('')
    setScreenshotError(null)
    setErrorMessage(null)
    setState('idle')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Report a bug"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && state !== 'submitting') onClose()
      }}
    >
      <div className="w-full max-w-xl rounded-lg border border-divider bg-bg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-fg">Report a bug</h3>
            <p className="text-xs text-fg-subtle mt-1">
              Found something broken? Tell us. We read every report.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={state === 'submitting'}
            aria-label="Close"
            className="text-fg-muted hover:text-fg transition disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {state === 'success' ? (
          <SuccessState onClose={onClose} onFileAnother={resetForm} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-fg-muted block mb-1">
                Tool <span className="text-alert">*</span>
              </label>
              <select
                value={toolId}
                onChange={(e) => setToolId(e.target.value)}
                disabled={state === 'submitting'}
                className="w-full px-3 py-2 text-sm rounded-md border border-divider bg-surface text-fg focus:outline-none focus:border-cyan/60"
              >
                {REPORT_BUG_TOOLS.map((tool) => (
                  <option key={tool.id} value={tool.id}>
                    {tool.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-fg-muted block mb-1">
                Description <span className="text-alert">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what went wrong, what you expected, and any steps to reproduce."
                rows={5}
                disabled={state === 'submitting'}
                className="w-full px-3 py-2 text-sm rounded-md border border-divider bg-surface text-fg placeholder:text-fg-subtle focus:outline-none focus:border-cyan/60 resize-none"
              />
              <div className="flex items-center justify-between mt-1">
                <span className={`text-[11px] ${descriptionTooShort && descriptionTrimmed.length > 0 ? 'text-alert' : 'text-fg-subtle'}`}>
                  {descriptionTooShort && descriptionTrimmed.length > 0
                    ? `Add at least ${MIN_DESCRIPTION_LENGTH - descriptionTrimmed.length} more character${MIN_DESCRIPTION_LENGTH - descriptionTrimmed.length === 1 ? '' : 's'}`
                    : ' '}
                </span>
                <span className="text-[11px] text-fg-subtle">{descriptionTrimmed.length}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-fg-muted block mb-1">
                Your email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                disabled={state === 'submitting'}
                className={`w-full px-3 py-2 text-sm rounded-md border bg-surface text-fg placeholder:text-fg-subtle focus:outline-none ${
                  emailInvalid ? 'border-alert focus:border-alert' : 'border-divider focus:border-cyan/60'
                }`}
              />
              <p className="text-[11px] text-fg-subtle mt-1">
                We will only use this to follow up on your report. Leave blank to file anonymously.
              </p>
              {emailInvalid && (
                <p className="text-[11px] text-alert mt-1">Enter a valid email or leave blank.</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-fg-muted block mb-1">
                Screenshots (optional, up to {MAX_SCREENSHOTS})
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDraggingOver(true)
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={onDrop}
                className={`rounded-md border border-dashed p-4 text-center transition ${
                  isDraggingOver ? 'border-cyan bg-cyan/5' : 'border-divider bg-surface/30'
                }`}
              >
                <Upload size={18} className="mx-auto text-fg-subtle mb-1.5" />
                <p className="text-xs text-fg-muted">
                  Drag images here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={state === 'submitting' || screenshots.length >= MAX_SCREENSHOTS}
                    className="text-cyan hover:underline disabled:opacity-40 disabled:no-underline"
                  >
                    choose files
                  </button>
                </p>
                <p className="text-[11px] text-fg-subtle mt-0.5">
                  JPG, PNG, WEBP, GIF · max 5 MB each
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  onChange={onFileInputChange}
                  className="hidden"
                />
              </div>
              {screenshotError && (
                <p className="text-[11px] text-alert mt-1">{screenshotError}</p>
              )}
              {screenshots.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {screenshots.map((file, idx) => (
                    <li
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between gap-2 text-xs bg-surface/40 border border-divider rounded-md px-2.5 py-1.5"
                    >
                      <span className="text-fg truncate">
                        {file.name}{' '}
                        <span className="text-fg-subtle">
                          ({(file.size / 1024).toFixed(0)} KB)
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        aria-label={`Remove ${file.name}`}
                        className="text-fg-subtle hover:text-alert transition shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-[11px] text-fg-subtle leading-relaxed">
              Screenshots may contain game data. Avoid uploading screenshots that
              include confidential game info you do not want shared with Qyren.
            </p>

            {/* Honeypot — kept off-screen and aria-hidden so real users and screen
                readers do not see it but naive bots auto-filling form fields do. */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
              <label>
                Company URL
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-md border border-alert/40 bg-alert/5 p-3">
                <AlertTriangle size={14} className="text-alert mt-0.5 shrink-0" />
                <p className="text-xs text-alert">{errorMessage}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={state === 'submitting'}
                className="text-sm px-3 py-2 rounded-md text-fg-muted hover:text-fg transition disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="text-sm px-4 py-2 rounded-md bg-fg text-bg hover:bg-cyan font-medium transition disabled:opacity-40"
              >
                {state === 'submitting' ? 'Sending…' : 'Submit report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function SuccessState({
  onClose,
  onFileAnother,
}: {
  onClose: () => void
  onFileAnother: () => void
}) {
  return (
    <div className="py-2">
      <p className="text-sm text-fg leading-relaxed mb-2">
        Thanks. Your bug report has been logged. We will look at it within 24 to
        48 hours.
      </p>
      <p className="text-xs text-fg-subtle leading-relaxed mb-5">
        If you left an email, we will only reply if we need more context or once
        the issue is resolved.
      </p>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onFileAnother}
          className="text-sm px-3 py-2 rounded-md text-fg-muted hover:text-fg transition"
        >
          File another
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-sm px-4 py-2 rounded-md bg-fg text-bg hover:bg-cyan font-medium transition"
        >
          Close
        </button>
      </div>
    </div>
  )
}
