import type { GachaStrings } from '../../i18n/gacha'
import { AlertTriangle } from 'lucide-react'

export interface UnreviewedField {
  id: string
  label: string
  value: string
}

interface AutoTranslationWarningModalProps {
  strings: GachaStrings
  unreviewedFields: UnreviewedField[]
  onConfirm: () => void
  onCancel: () => void
}

export function AutoTranslationWarningModal({
  strings,
  unreviewedFields,
  onConfirm,
  onCancel,
}: AutoTranslationWarningModalProps) {
  const t = strings.tool.gameDetails.attestModal

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Auto-translation review"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-lg rounded-lg border border-divider bg-bg p-6 shadow-xl">
        <div className="flex items-start gap-2 mb-3">
          <AlertTriangle size={18} className="text-gold mt-0.5 shrink-0" />
          <h3 className="text-base font-semibold text-fg">{t.heading}</h3>
        </div>

        <ul className="space-y-1.5 mb-4 max-h-64 overflow-y-auto rounded-md border border-divider bg-surface/40 p-3">
          {unreviewedFields.map((f) => (
            <li key={f.id} className="text-sm text-fg">
              <span className="text-fg-muted">{f.label}:</span>{' '}
              <span className="font-medium italic">{f.value}</span>
            </li>
          ))}
        </ul>

        <p className="text-sm text-fg-muted leading-relaxed mb-2">{t.sub}</p>
        <p className="text-xs text-fg-subtle leading-relaxed mb-4">
          {strings.tool.gameDetails.qualityNotice}
        </p>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm px-3 py-2 rounded-md text-fg-muted hover:text-fg transition"
          >
            {t.editButton}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="text-sm px-4 py-2 rounded-md bg-fg text-bg hover:bg-cyan font-medium transition"
          >
            {t.confirmButton}
          </button>
        </div>
      </div>
    </div>
  )
}
