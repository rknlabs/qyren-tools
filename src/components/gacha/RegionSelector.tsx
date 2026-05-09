import {
  ALL_REGIONS,
  REGION_LABELS,
  REGION_REGIME,
  type Region,
} from '../../types/gacha/rateSheet'
import type { GachaStrings } from '../../i18n/gacha'

interface RegionSelectorProps {
  strings: GachaStrings
  selected: Region[]
  onChange: (regions: Region[]) => void
}

export function RegionSelector({ strings, selected, onChange }: RegionSelectorProps) {
  const t = strings.tool

  function toggle(region: Region) {
    if (selected.includes(region)) {
      onChange(selected.filter((r) => r !== region))
    } else {
      onChange([...selected, region])
    }
  }

  return (
    <div className="rounded-lg border border-divider bg-surface/40 p-6">
      <h2 className="text-base font-semibold text-fg mb-1">{t.stepRegions}</h2>
      <p className="text-xs text-fg-subtle mb-4">{t.regionsHint}</p>

      <div className="flex flex-wrap gap-2">
        {ALL_REGIONS.map((region) => {
          const active = selected.includes(region)
          return (
            <button
              key={region}
              type="button"
              onClick={() => toggle(region)}
              title={REGION_REGIME[region]}
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border transition ${
                active
                  ? 'border-cyan bg-cyan/10 text-cyan'
                  : 'border-divider bg-bg text-fg-muted hover:text-fg hover:border-cyan/40'
              }`}
            >
              <span>{REGION_LABELS[region]}</span>
              <span className="text-xs opacity-60">{region}</span>
            </button>
          )
        })}
      </div>

      {selected.length === 0 && (
        <p className="mt-3 text-sm text-alert">{t.errors.noRegions}</p>
      )}
    </div>
  )
}
