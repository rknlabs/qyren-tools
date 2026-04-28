import { useState } from 'react'
import type { FormEvent } from 'react'
import { Mail, ArrowRight, Check } from 'lucide-react'

interface CaptureFormProps {
  /** Tool slug, or 'directory' for top-level captures */
  capturedFromTool?: string
  /** Locale of the page the form is on */
  sourceLocale?: 'en' | 'tr' | 'cn'
  /** Visual variant. 'inline' for mid-page, 'compact' for footer-style */
  variant?: 'inline' | 'compact'
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const COPY = {
  en: {
    heading: 'Get notified when we ship our own tools',
    sub: 'A few times a month. Tool launches, pain-story posts. No funnel theatre.',
    placeholder: 'you@studio.com',
    button: 'Subscribe',
    submitting: 'Subscribing...',
    success: "You're in. Check your inbox.",
    error: 'Something went wrong. Try again?',
  },
  tr: {
    heading: 'Kendi araçlarımızı yayınladığımızda haberdar ol',
    sub: 'Ayda birkaç kez. Araç lansmanları, sorun-hikaye yazıları.',
    placeholder: 'sen@studyo.com',
    button: 'Abone ol',
    submitting: 'İşleniyor...',
    success: 'Tamam. Gelen kutunuzu kontrol edin.',
    error: 'Bir şeyler ters gitti. Tekrar dener misin?',
  },
  cn: {
    heading: '当我们发布自己的工具时获取通知',
    sub: '每月几次。工具发布、问题分析。',
    placeholder: 'you@studio.com',
    button: '订阅',
    submitting: '提交中...',
    success: '完成。请查看收件箱。',
    error: '出错了。再试一次？',
  },
} as const

export function CaptureForm({
  capturedFromTool = 'directory',
  sourceLocale = 'en',
  variant = 'inline',
}: CaptureFormProps) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const copy = COPY[sourceLocale]

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
          captured_from_tool: capturedFromTool,
          source_locale: sourceLocale,
        }),
      })
      if (!res.ok) {
        setState('error')
        return
      }
      setState('success')
    } catch (err) {
      console.error('Capture submission threw:', err)
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div
        role="status"
        className={`flex items-center gap-2 text-sm text-success ${
          variant === 'inline' ? 'py-3' : ''
        }`}
      >
        <Check size={16} />
        <span>{copy.success}</span>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.placeholder}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-divider bg-surface text-fg placeholder:text-fg-subtle focus:outline-none focus:border-cyan/60"
            disabled={state === 'submitting'}
          />
        </div>
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="text-sm px-3 py-2 rounded-md bg-fg text-bg hover:bg-cyan transition disabled:opacity-50"
        >
          {state === 'submitting' ? copy.submitting : copy.button}
        </button>
        {state === 'error' && (
          <span className="text-xs text-alert">{copy.error}</span>
        )}
      </form>
    )
  }

  return (
    <div className="rounded-lg border border-divider bg-surface/40 p-6">
      <h3 className="text-base font-semibold text-fg mb-1">{copy.heading}</h3>
      <p className="text-sm text-fg-muted mb-4">{copy.sub}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.placeholder}
            className="w-full pl-10 pr-3 py-2.5 text-sm rounded-md border border-divider bg-bg text-fg placeholder:text-fg-subtle focus:outline-none focus:border-cyan/60"
            disabled={state === 'submitting'}
          />
        </div>
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="inline-flex items-center justify-center gap-1.5 text-sm px-4 py-2.5 rounded-md bg-fg text-bg hover:bg-cyan font-medium transition disabled:opacity-50"
        >
          {state === 'submitting' ? (
            copy.submitting
          ) : (
            <>
              {copy.button}
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
      {state === 'error' && (
        <p className="text-xs text-alert mt-2">{copy.error}</p>
      )}
    </div>
  )
}
