import type { ReactNode } from 'react'
import type { GachaStrings } from '../../i18n/gacha'
import type { Pool, Region } from '../../types/gacha/rateSheet'
import type { FieldSource } from '../../types/gacha/fieldSource'
import {
  ALL_LANGUAGES_ORDER,
  REGION_LANGUAGE_LABEL,
  type Language,
} from '../../lib/gacha/fieldSources'
import { LanguageCard } from './LanguageCard'
import { PrimaryLanguageSelector } from './PrimaryLanguageSelector'

interface GameDetailsFormProps {
  strings: GachaStrings
  pools: Pool[]
  selectedRegions: Region[]
  primaryLanguage: Language
  isOverseasOperator: boolean
  formTouched: boolean
  missingRequired: Set<string>
  getValue: (fieldId: string) => string
  getSource: (fieldId: string) => FieldSource | undefined
  onFieldChange: (fieldId: string, value: string) => void
  onPrimaryLanguageChange: (next: Language) => void
  onOverseasToggle: (next: boolean) => void
  onTranslateSection?: (target: Language) => void
  translatingRegion?: Language | null
}

export function GameDetailsForm({
  strings,
  pools,
  selectedRegions,
  primaryLanguage,
  isOverseasOperator,
  formTouched,
  missingRequired,
  getValue,
  getSource,
  onFieldChange,
  onPrimaryLanguageChange,
  onOverseasToggle,
  onTranslateSection,
  translatingRegion,
}: GameDetailsFormProps): ReactNode {
  const t = strings.tool.gameDetails
  const isSinglePool = pools.length === 1
  const studioSource = getSource('studio_name')
  const primaryLabel = REGION_LANGUAGE_LABEL[primaryLanguage]

  // Card order: primary first, then the other selected regions in canonical
  // order. Primary card always renders even if its region was un-selected,
  // so the user retains a place to type the source-of-truth values.
  const nonPrimaryCards = ALL_LANGUAGES_ORDER.filter(
    (r) => r !== primaryLanguage && selectedRegions.includes(r),
  )
  const cardsToRender: Language[] = [primaryLanguage, ...nonPrimaryCards]

  return (
    <div className="rounded-lg border border-divider bg-surface/40 p-6">
      <h2 className="text-base font-semibold text-fg mb-1">
        {strings.tool.stepDetails}
      </h2>
      <p className="text-xs text-fg-subtle mb-5">{t.sub}</p>

      {formTouched && missingRequired.size > 0 && (
        <div className="mb-4 rounded-md border border-alert/40 bg-alert/5 p-3">
          <p className="text-sm font-medium text-alert">{t.missingFieldsHeading}</p>
          <p className="text-xs text-alert/80 mt-1">{t.missingFieldsBody}</p>
        </div>
      )}

      <PrimaryLanguageSelector
        strings={strings}
        primary={primaryLanguage}
        selectedRegions={selectedRegions}
        onChange={onPrimaryLanguageChange}
      />

      <div className="mb-5">
        <p className="text-xs uppercase tracking-wider text-fg-subtle font-semibold mb-3">
          {t.generalSection}
        </p>
        <div className="space-y-3">
          <FieldRow
            fieldId="studio_name"
            label={t.studioName}
            placeholder={t.studioNamePlaceholder}
            required
            value={getValue('studio_name')}
            source={studioSource}
            onChange={(v) => onFieldChange('studio_name', v)}
            error={formTouched && missingRequired.has('studio_name')}
            requiredLabel={t.requiredFieldShort}
            aiBadge={t.aiBadge}
            aiTooltip={t.aiTooltip.replace('{primary}', primaryLabel)}
          />
          {isSinglePool ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldRow
                fieldId="banner_start"
                label={t.bannerStart}
                type="date"
                required
                value={getValue('banner_start')}
                source={getSource('banner_start')}
                onChange={(v) => onFieldChange('banner_start', v)}
                error={formTouched && missingRequired.has('banner_start')}
                requiredLabel={t.requiredFieldShort}
                aiBadge={t.aiBadge}
                aiTooltip=""
              />
              <FieldRow
                fieldId="banner_end"
                label={t.bannerEnd}
                type="date"
                required
                value={getValue('banner_end')}
                source={getSource('banner_end')}
                onChange={(v) => onFieldChange('banner_end', v)}
                error={formTouched && missingRequired.has('banner_end')}
                requiredLabel={t.requiredFieldShort}
                aiBadge={t.aiBadge}
                aiTooltip=""
              />
            </div>
          ) : (
            <p className="text-xs text-fg-muted">{t.multiBannerNote}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {cardsToRender.map((region) => (
          <LanguageCard
            key={region}
            strings={strings}
            region={region}
            isPrimary={region === primaryLanguage}
            isSinglePool={isSinglePool}
            isOverseasOperator={isOverseasOperator}
            formTouched={formTouched}
            missingRequired={missingRequired}
            getValue={getValue}
            getSource={getSource}
            onFieldChange={onFieldChange}
            onOverseasToggle={onOverseasToggle}
            onTranslate={
              onTranslateSection && region !== primaryLanguage
                ? () => onTranslateSection(region)
                : undefined
            }
            isTranslating={translatingRegion === region}
            primaryLanguageLabel={primaryLabel}
          />
        ))}
      </div>
    </div>
  )
}

interface FieldRowProps {
  fieldId: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  value: string
  source: FieldSource | undefined
  onChange: (next: string) => void
  error: boolean
  requiredLabel: string
  aiBadge: string
  aiTooltip: string
}

function FieldRow({
  label,
  type = 'text',
  placeholder,
  required,
  value,
  source,
  onChange,
  error,
  requiredLabel,
  aiBadge,
  aiTooltip,
}: FieldRowProps): ReactNode {
  const isAI = source === 'auto_translated_unreviewed'
  return (
    <div>
      <label className="text-xs font-medium text-fg-muted flex items-center gap-2 mb-1">
        <span>
          {label}
          {required && <span className="text-alert ml-1">*</span>}
        </span>
        {isAI && (
          <span
            title={aiTooltip}
            className="inline-flex items-center rounded bg-cyan/15 text-cyan text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5"
          >
            {aiBadge}
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm rounded-md border bg-surface text-fg placeholder:text-fg-subtle focus:outline-none ${
          isAI ? 'italic' : ''
        } ${
          error ? 'border-alert focus:border-alert' : 'border-divider focus:border-cyan/60'
        }`}
      />
      {error && <p className="text-xs text-alert mt-1">{requiredLabel}</p>}
    </div>
  )
}
