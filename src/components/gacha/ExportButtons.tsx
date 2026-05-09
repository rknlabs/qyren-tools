import { Download, FileJson, FileArchive } from 'lucide-react'
import type { GachaStrings } from '../../i18n/gacha'

export type ExportKind = 'all' | 'html' | 'json'

interface ExportButtonsProps {
  strings: GachaStrings
  onExport: (kind: ExportKind) => void
  disabled?: boolean
  pending?: boolean
}

export function ExportButtons({ strings, onExport, disabled, pending }: ExportButtonsProps) {
  const t = strings.tool
  const baseClass =
    'inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-md font-medium transition disabled:opacity-40 disabled:cursor-not-allowed'

  return (
    <div className="rounded-lg border border-divider bg-surface/40 p-6">
      <h2 className="text-base font-semibold text-fg mb-3">{t.exportHeading}</h2>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onExport('all')}
          disabled={disabled || pending}
          className={`${baseClass} bg-fg text-bg hover:bg-cyan`}
        >
          <FileArchive size={14} />
          {t.exportAllZip}
        </button>
        <button
          type="button"
          onClick={() => onExport('html')}
          disabled={disabled || pending}
          className={`${baseClass} border border-divider bg-bg text-fg hover:border-cyan/40`}
        >
          <Download size={14} />
          {t.exportHtmlOnly}
        </button>
        <button
          type="button"
          onClick={() => onExport('json')}
          disabled={disabled || pending}
          className={`${baseClass} border border-divider bg-bg text-fg hover:border-cyan/40`}
        >
          <FileJson size={14} />
          {t.exportJsonOnly}
        </button>
      </div>
    </div>
  )
}
