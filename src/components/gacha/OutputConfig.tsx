import type { GachaStrings } from '../../i18n/gacha'

export interface OutputConfigState {
  formatHtml: boolean
  formatPng: boolean
  formatJson: boolean
  bannerLevel: boolean
  pityDisclosure: boolean
}

interface OutputConfigProps {
  strings: GachaStrings
  value: OutputConfigState
  onChange: (next: OutputConfigState) => void
}

export function OutputConfig({ strings, value, onChange }: OutputConfigProps) {
  const t = strings.tool

  function set<K extends keyof OutputConfigState>(key: K, v: OutputConfigState[K]) {
    onChange({ ...value, [key]: v })
  }

  return (
    <div className="rounded-lg border border-divider bg-surface/40 p-6">
      <h2 className="text-base font-semibold text-fg mb-3">{t.stepOutput}</h2>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-fg-subtle font-semibold">
          {t.output.formats}
        </p>
        <Checkbox
          label={t.output.formatHtml}
          checked={value.formatHtml}
          onChange={(v) => set('formatHtml', v)}
        />
        <Checkbox
          label={t.output.formatPng}
          checked={value.formatPng}
          onChange={(v) => set('formatPng', v)}
        />
        <Checkbox
          label={t.output.formatJson}
          checked={value.formatJson}
          onChange={(v) => set('formatJson', v)}
        />
      </div>

      <div className="mt-5 space-y-2 pt-4 border-t border-divider">
        <Checkbox
          label={t.output.bannerLevel}
          checked={value.bannerLevel}
          onChange={(v) => set('bannerLevel', v)}
        />
        <Checkbox
          label={t.output.pityToggle}
          checked={value.pityDisclosure}
          onChange={(v) => set('pityDisclosure', v)}
        />
      </div>
    </div>
  )
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-2 text-sm text-fg cursor-pointer hover:text-cyan transition">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-cyan cursor-pointer"
      />
      <span className="flex-1">{label}</span>
    </label>
  )
}
