import { useState } from 'react'
import type { FormEvent } from 'react'
import { Mail } from 'lucide-react'
import type { GachaStrings } from '../../i18n/gacha'
import type { GachaLocale } from '../../i18n/gacha'

export interface CapturePayload {
  email: string
  studio_name?: string
  next_tool_idea?: string
}

export interface UsageSummary {
  regions_covered: string[]
  rate_sheet_size: number
  disclosure_floors_failed: number
  export_formats: string[]
}

interface GachaCaptureFormProps {
  strings: GachaStrings
  locale: GachaLocale
  usageSummary: UsageSummary
  onSuccess: (payload: CapturePayload) => void
  onCancel?: () => void
}

type State = 'idle' | 'submitting' | 'success' | 'error'

export function GachaCaptureForm({
  strings,
  locale,
  usageSummary,
  onSuccess,
  onCancel,
}: GachaCaptureFormProps) {
  const t = strings.tool.capture
  const [email, setEmail] = useState('')
  const [studio, setStudio] = useState('')
  const [nextTool, setNextTool] = useState('')
  const [state, setState] = useState<State>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (state === 'submitting') return
    setState('submitting')

    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          captured_from_tool: 'gacha-disclosure-pack',
          source_locale: locale,
          studio_name: studio.trim() || undefined,
          next_tool_idea: nextTool.trim() || undefined,
          usage_summary: usageSummary,
        }),
      })
      if (!res.ok) {
        setState('error')
        return
      }
      setState('success')
      onSuccess({
        email: email.trim(),
        studio_name: studio.trim() || undefined,
        next_tool_idea: nextTool.trim() || undefined,
      })
    } catch (err) {
      console.error('Gacha capture submit threw:', err)
      setState('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-label="Email capture"
        className="w-full max-w-md rounded-lg border border-divider bg-bg p-6 shadow-xl"
      >
        <h3 className="text-base font-semibold text-fg mb-1">{t.heading}</h3>
        <p className="text-sm text-fg-muted mb-4">{t.sub}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-fg-muted block mb-1">
              {t.emailLabel}
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                disabled={state === 'submitting'}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-divider bg-surface text-fg placeholder:text-fg-subtle focus:outline-none focus:border-cyan/60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted block mb-1">
              {t.studioLabel}
            </label>
            <input
              type="text"
              value={studio}
              onChange={(e) => setStudio(e.target.value)}
              placeholder={t.studioPlaceholder}
              disabled={state === 'submitting'}
              className="w-full px-3 py-2 text-sm rounded-md border border-divider bg-surface text-fg placeholder:text-fg-subtle focus:outline-none focus:border-cyan/60"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted block mb-1">
              {t.nextToolLabel}
            </label>
            <textarea
              value={nextTool}
              onChange={(e) => setNextTool(e.target.value)}
              placeholder={t.nextToolPlaceholder}
              rows={3}
              disabled={state === 'submitting'}
              className="w-full px-3 py-2 text-sm rounded-md border border-divider bg-surface text-fg placeholder:text-fg-subtle focus:outline-none focus:border-cyan/60"
            />
          </div>

          {state === 'error' && (
            <p className="text-xs text-alert">{t.error}</p>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={state === 'submitting' || state === 'success'}
              className="flex-1 inline-flex items-center justify-center text-sm px-4 py-2 rounded-md bg-fg text-bg hover:bg-cyan font-medium transition disabled:opacity-50"
            >
              {state === 'submitting'
                ? t.submitting
                : state === 'success'
                  ? t.success
                  : t.submit}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={state === 'submitting'}
                className="text-sm px-3 py-2 rounded-md text-fg-muted hover:text-fg transition disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
