import type { Region } from '../../types/gacha/rateSheet'
import type { GachaStrings } from '../../i18n/gacha'
import { REGION_LANGUAGE_LABEL, type Language } from '../../lib/gacha/fieldSources'

interface PrimaryLanguageSelectorProps {
  strings: GachaStrings
  primary: Language
  selectedRegions: Region[]
  onChange: (next: Language) => void
}

export function PrimaryLanguageSelector({
  strings,
  primary,
  selectedRegions,
  onChange,
}: PrimaryLanguageSelectorProps) {
  const t = strings.tool.gameDetails
  // The Primary card always renders, even if the user un-selected its region;
  // present its option here so the dropdown accurately reflects state.
  const options: Language[] = selectedRegions.includes(primary)
    ? selectedRegions
    : [primary, ...selectedRegions.filter((r) => r !== primary)]

  return (
    <div className="mb-5">
      <label className="text-xs font-medium text-fg-muted block mb-1">
        {t.primaryLanguageLabel}
      </label>
      <select
        value={primary}
        onChange={(e) => onChange(e.target.value as Language)}
        className="w-full sm:w-64 px-3 py-2 text-sm rounded-md border border-divider bg-surface text-fg focus:outline-none focus:border-cyan/60"
      >
        {options.map((r) => (
          <option key={r} value={r}>
            {REGION_LANGUAGE_LABEL[r]}
          </option>
        ))}
      </select>
      <p className="text-xs text-fg-subtle mt-1">{t.primaryLanguageHelp}</p>
    </div>
  )
}
