import type { ReactNode } from 'react'
import type { GachaStrings } from '../../i18n/gacha'
import type { FieldSource } from '../../types/gacha/fieldSource'
import {
  REGION_LANGUAGE_LABEL,
  suffixForRegion,
  type Language,
} from '../../lib/gacha/fieldSources'

export interface LanguageCardProps {
  strings: GachaStrings
  region: Language
  isPrimary: boolean
  isSinglePool: boolean
  isOverseasOperator: boolean
  formTouched: boolean
  missingRequired: Set<string>
  getValue: (fieldId: string) => string
  getSource: (fieldId: string) => FieldSource | undefined
  onFieldChange: (fieldId: string, value: string) => void
  onOverseasToggle: (next: boolean) => void
  // Commit 4 plumbs translation in. Optional so commit 3 can ship without it.
  onTranslate?: () => void
  isTranslating?: boolean
  primaryLanguageLabel?: string
}

export function LanguageCard({
  strings,
  region,
  isPrimary,
  isSinglePool,
  isOverseasOperator,
  formTouched,
  missingRequired,
  getValue,
  getSource,
  onFieldChange,
  onOverseasToggle,
  onTranslate,
  isTranslating,
  primaryLanguageLabel,
}: LanguageCardProps) {
  const t = strings.tool.gameDetails
  const langLabel = REGION_LANGUAGE_LABEL[region]
  const suffix = suffixForRegion(region)

  return (
    <div
      className={`rounded-md border p-5 ${
        isPrimary ? 'border-cyan/40 bg-cyan/5' : 'border-divider bg-bg/40'
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
          {langLabel}
          <span className="text-xs text-fg-subtle font-normal">{region}</span>
          {isPrimary && (
            <span className="inline-flex items-center rounded-md bg-cyan/15 text-cyan text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
              {t.primaryBadge}
            </span>
          )}
        </h3>
        {!isPrimary && onTranslate && primaryLanguageLabel && (
          <button
            type="button"
            onClick={onTranslate}
            disabled={isTranslating}
            className="text-xs px-2.5 py-1.5 rounded-md border border-divider bg-bg text-fg-muted hover:text-fg hover:border-cyan/40 transition disabled:opacity-50"
          >
            {isTranslating
              ? t.translating
              : t.translateFrom.replace('{primary}', primaryLanguageLabel)}
          </button>
        )}
      </div>

      <div className="space-y-3">
        <CardField
          fieldId={`game_name_${suffix}`}
          label={t.gameNameLabel}
          required
          formTouched={formTouched}
          missingRequired={missingRequired}
          getValue={getValue}
          getSource={getSource}
          onFieldChange={onFieldChange}
          requiredLabel={t.requiredFieldShort}
          aiBadge={t.aiBadge}
          aiTooltip={t.aiTooltip.replace(
            '{primary}',
            primaryLanguageLabel ?? '',
          )}
        />
        {isSinglePool && (
          <CardField
            fieldId={`banner_name_${suffix}`}
            label={t.bannerNameLabel}
            required
            formTouched={formTouched}
            missingRequired={missingRequired}
            getValue={getValue}
            getSource={getSource}
            onFieldChange={onFieldChange}
            requiredLabel={t.requiredFieldShort}
            aiBadge={t.aiBadge}
            aiTooltip={t.aiTooltip.replace(
              '{primary}',
              primaryLanguageLabel ?? '',
            )}
          />
        )}
        <CardField
          fieldId={`operator_name_${suffix}`}
          label={t.operatorNameLabel}
          required
          formTouched={formTouched}
          missingRequired={missingRequired}
          getValue={getValue}
          getSource={getSource}
          onFieldChange={onFieldChange}
          requiredLabel={t.requiredFieldShort}
          aiBadge={t.aiBadge}
          aiTooltip={t.aiTooltip.replace(
            '{primary}',
            primaryLanguageLabel ?? '',
          )}
        />

        {region === 'KR' && (
          <KoreaSpecificFields
            t={t}
            isOverseasOperator={isOverseasOperator}
            formTouched={formTouched}
            missingRequired={missingRequired}
            getValue={getValue}
            getSource={getSource}
            onFieldChange={onFieldChange}
            onOverseasToggle={onOverseasToggle}
          />
        )}

        {region === 'CN' && (
          <CardField
            fieldId="outcome_history_url"
            label={t.outcomeHistoryUrl}
            type="url"
            required
            placeholder={t.outcomeHistoryPlaceholder}
            help={t.outcomeHistoryHelp}
            formTouched={formTouched}
            missingRequired={missingRequired}
            getValue={getValue}
            getSource={getSource}
            onFieldChange={onFieldChange}
            requiredLabel={t.requiredFieldShort}
            aiBadge={t.aiBadge}
            aiTooltip=""
          />
        )}
      </div>
    </div>
  )
}

interface CardFieldProps {
  fieldId: string
  label: string
  required?: boolean
  type?: string
  placeholder?: string
  help?: string
  formTouched: boolean
  missingRequired: Set<string>
  getValue: (id: string) => string
  getSource: (id: string) => FieldSource | undefined
  onFieldChange: (id: string, value: string) => void
  requiredLabel: string
  aiBadge: string
  aiTooltip: string
}

function CardField({
  fieldId,
  label,
  required,
  type = 'text',
  placeholder,
  help,
  formTouched,
  missingRequired,
  getValue,
  getSource,
  onFieldChange,
  requiredLabel,
  aiBadge,
  aiTooltip,
}: CardFieldProps) {
  const value = getValue(fieldId)
  const source = getSource(fieldId)
  const isError = formTouched && missingRequired.has(fieldId)
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
        onChange={(e) => onFieldChange(fieldId, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm rounded-md border bg-surface text-fg placeholder:text-fg-subtle focus:outline-none ${
          isAI ? 'italic' : ''
        } ${
          isError ? 'border-alert focus:border-alert' : 'border-divider focus:border-cyan/60'
        }`}
      />
      {help && <p className="text-xs text-fg-subtle mt-1">{help}</p>}
      {isError && <p className="text-xs text-alert mt-1">{requiredLabel}</p>}
    </div>
  )
}

interface KoreaSpecificFieldsProps {
  t: GachaStrings['tool']['gameDetails']
  isOverseasOperator: boolean
  formTouched: boolean
  missingRequired: Set<string>
  getValue: (id: string) => string
  getSource: (id: string) => FieldSource | undefined
  onFieldChange: (id: string, value: string) => void
  onOverseasToggle: (next: boolean) => void
}

function KoreaSpecificFields(props: KoreaSpecificFieldsProps): ReactNode {
  const {
    t,
    isOverseasOperator,
    formTouched,
    missingRequired,
    getValue,
    getSource,
    onFieldChange,
    onOverseasToggle,
  } = props

  return (
    <div className="pt-3 mt-2 border-t border-divider/60 space-y-3">
      <label className="flex items-start gap-2 text-sm text-fg cursor-pointer hover:text-cyan transition">
        <input
          type="checkbox"
          checked={isOverseasOperator}
          onChange={(e) => onOverseasToggle(e.target.checked)}
          className="mt-0.5 size-4 accent-cyan cursor-pointer"
        />
        <span>
          {t.overseasOperator}
          <span className="block text-xs text-fg-subtle mt-0.5">{t.overseasHelp}</span>
        </span>
      </label>
      {isOverseasOperator && (
        <CardField
          fieldId="domestic_agent_name_ko"
          label={t.domesticAgent}
          required
          formTouched={formTouched}
          missingRequired={missingRequired}
          getValue={getValue}
          getSource={getSource}
          onFieldChange={onFieldChange}
          requiredLabel={t.requiredFieldShort}
          aiBadge={t.aiBadge}
          aiTooltip=""
        />
      )}
    </div>
  )
}
