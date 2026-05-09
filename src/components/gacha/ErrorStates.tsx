import { AlertTriangle } from 'lucide-react'

interface InlineNoticeProps {
  tone: 'error' | 'warn'
  title: string
  body?: string
  cta?: { label: string; onClick: () => void }
}

export function InlineNotice({ tone, title, body, cta }: InlineNoticeProps) {
  const toneClasses =
    tone === 'error'
      ? 'border-alert/40 bg-alert/5 text-alert'
      : 'border-gold/40 bg-gold/5 text-gold'
  return (
    <div className={`rounded-md border p-3 flex items-start gap-2 ${toneClasses}`}>
      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {body && <p className="text-xs mt-1 opacity-90">{body}</p>}
      </div>
      {cta && (
        <button
          type="button"
          onClick={cta.onClick}
          className="text-xs underline hover:no-underline shrink-0"
        >
          {cta.label}
        </button>
      )}
    </div>
  )
}
