import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { Upload, FileText, Code2 } from 'lucide-react'
import type { GachaStrings } from '../../i18n/gacha'
import {
  parseRateSheet,
  RATE_SHEET_SCHEMA_REFERENCE,
  type ParseError,
} from '../../lib/gacha/parseRateSheet'
import type { RateSheet } from '../../types/gacha/rateSheet'

interface RateSheetUploadProps {
  strings: GachaStrings
  onParsed: (rateSheet: RateSheet) => void
  onError: (errors: ParseError[]) => void
}

const SAMPLES = [
  { key: 'singleBanner', file: 'single-banner.csv' },
  { key: 'multiBanner', file: 'multi-banner.csv' },
  { key: 'softPity', file: 'soft-pity.csv' },
  { key: 'hardPity', file: 'hard-pity.csv' },
] as const

export function RateSheetUpload({ strings, onParsed, onError }: RateSheetUploadProps) {
  const t = strings.tool
  const fileRef = useRef<HTMLInputElement>(null)
  const [pasteValue, setPasteValue] = useState('')
  const [showSchema, setShowSchema] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [parseErrors, setParseErrors] = useState<ParseError[]>([])

  function handleInput(input: string, opts?: { syncTextarea?: boolean }) {
    const result = parseRateSheet(input)
    if (result.ok && result.rateSheet) {
      setParseErrors([])
      // Show what got loaded in the textarea so the user has visible
      // feedback and an editable representation.
      if (opts?.syncTextarea) {
        setPasteValue(JSON.stringify(result.rateSheet, null, 2))
      }
      onParsed(result.rateSheet)
    } else {
      setParseErrors(result.errors)
      onError(result.errors)
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    file.text().then((text) => handleInput(text, { syncTextarea: true }))
    // Reset so picking the same file again still fires onChange.
    e.target.value = ''
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    file.text().then((text) => handleInput(text, { syncTextarea: true }))
  }

  function handlePasteSubmit() {
    if (!pasteValue.trim()) return
    handleInput(pasteValue)
  }

  async function loadSample(file: string) {
    try {
      const res = await fetch(`/samples/gacha/${file}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      handleInput(text, { syncTextarea: true })
    } catch (err) {
      setParseErrors([{ message: `Failed to load sample: ${(err as Error).message}` }])
      onError([{ message: `Failed to load sample: ${(err as Error).message}` }])
    }
  }

  const sampleLabel: Record<string, string> = {
    singleBanner: t.sampleSingleBanner,
    multiBanner: t.sampleMultiBanner,
    softPity: t.sampleSoftPity,
    hardPity: t.sampleHardPity,
  }

  return (
    <div className="rounded-lg border border-divider bg-surface/40 p-6">
      <h2 className="text-base font-semibold text-fg mb-4">{t.stepUpload}</h2>

      <div
        onDragEnter={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-md border-2 border-dashed p-8 text-center transition cursor-pointer ${
          dragOver ? 'border-cyan bg-cyan/5' : 'border-divider hover:border-cyan/40'
        }`}
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={20} className="mx-auto text-fg-subtle mb-2" />
        <p className="text-sm text-fg-muted mb-3">{t.uploadDrop}</p>
        <button
          type="button"
          className="text-sm px-3 py-1.5 rounded-md border border-divider bg-bg text-fg hover:border-cyan/40 transition"
          onClick={(e) => {
            e.stopPropagation()
            fileRef.current?.click()
          }}
        >
          {t.uploadCta}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv,application/json,.json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="mt-5">
        <label className="text-sm font-medium text-fg-muted block mb-2">{t.pasteJson}</label>
        <textarea
          value={pasteValue}
          onChange={(e) => setPasteValue(e.target.value)}
          placeholder={t.pasteJsonPlaceholder}
          className="w-full h-40 rounded-md border border-divider bg-bg p-3 text-xs font-mono text-fg placeholder:text-fg-subtle focus:outline-none focus:border-cyan/60"
        />
        <button
          type="button"
          onClick={handlePasteSubmit}
          disabled={!pasteValue.trim()}
          className="mt-2 text-sm px-3 py-1.5 rounded-md bg-fg text-bg hover:bg-cyan transition disabled:opacity-40"
        >
          Parse JSON
        </button>
      </div>

      <div className="mt-5">
        <p className="text-sm text-fg-muted mb-2">{t.sampleHeading}</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => void loadSample(s.file)}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-divider bg-bg text-fg-muted hover:text-fg hover:border-cyan/40 transition"
            >
              <FileText size={12} />
              {sampleLabel[s.key]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => setShowSchema((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg transition"
        >
          <Code2 size={12} />
          {t.schemaToggle}
        </button>
        {showSchema && (
          <div className="mt-3 rounded-md border border-divider bg-bg p-3 text-xs text-fg-muted">
            <p className="font-medium text-fg mb-1">Required CSV columns</p>
            <p className="font-mono mb-3">{RATE_SHEET_SCHEMA_REFERENCE.required.join(', ')}</p>
            <p className="font-medium text-fg mb-1">Optional CSV columns</p>
            <p className="font-mono">{RATE_SHEET_SCHEMA_REFERENCE.optional.join(', ')}</p>
          </div>
        )}
      </div>

      {parseErrors.length > 0 && (
        <div className="mt-4 rounded-md border border-alert/40 bg-alert/5 p-3">
          <p className="text-sm font-medium text-alert mb-2">{t.errors.malformed}</p>
          <ul className="text-xs text-alert space-y-1 list-disc pl-5">
            {parseErrors.slice(0, 8).map((e, i) => (
              <li key={i}>
                {e.row !== undefined ? `Row ${e.row}: ` : ''}
                {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
