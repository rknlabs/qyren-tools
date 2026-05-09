import type { ReactNode } from 'react'
import type { GachaStrings } from '../../i18n/gacha'
import type {
  Pool,
  RateSheetMetadata,
  Region,
} from '../../types/gacha/rateSheet'

export type MetadataField = keyof RateSheetMetadata
export type BannerField =
  | 'banner_name_en'
  | 'banner_name_ko'
  | 'banner_name_ja'
  | 'banner_name_zh_hans'
  | 'banner_name_tr'
  | 'banner_start'
  | 'banner_end'

interface GameDetailsFormProps {
  strings: GachaStrings
  metadata: RateSheetMetadata
  pools: Pool[]
  selectedRegions: Region[]
  isOverseasOperator: boolean
  formTouched: boolean
  missingRequired: Set<string>
  onMetadataChange: (field: MetadataField, value: string) => void
  onBannerChange: (poolId: string, field: BannerField, value: string) => void
  onOverseasToggle: (next: boolean) => void
}

export function GameDetailsForm({
  strings,
  metadata,
  pools,
  selectedRegions,
  isOverseasOperator,
  formTouched,
  missingRequired,
  onMetadataChange,
  onBannerChange,
  onOverseasToggle,
}: GameDetailsFormProps) {
  const t = strings.tool.gameDetails
  const requires = (region: Region) => selectedRegions.includes(region)
  const showError = (key: string) => formTouched && missingRequired.has(key)

  const singlePool = pools.length === 1 ? pools[0] : null

  return (
    <div className="rounded-lg border border-divider bg-surface/40 p-6">
      <h2 className="text-base font-semibold text-fg mb-1">{t.heading}</h2>
      <p className="text-xs text-fg-subtle mb-5">{t.sub}</p>

      {formTouched && missingRequired.size > 0 && (
        <div className="mb-4 rounded-md border border-alert/40 bg-alert/5 p-3">
          <p className="text-sm font-medium text-alert">{t.missingFieldsHeading}</p>
          <p className="text-xs text-alert/80 mt-1">{t.missingFieldsBody}</p>
        </div>
      )}

      <Section>
        <Field
          label={t.studioName}
          required
          error={showError('studio_name')}
          requiredLabel={t.requiredFieldShort}
        >
          <input
            type="text"
            value={metadata.studio_name ?? ''}
            onChange={(e) => onMetadataChange('studio_name', e.target.value)}
            placeholder={t.studioNamePlaceholder}
            className={inputClass(showError('studio_name'))}
          />
        </Field>
      </Section>

      <Section title={t.gameNameSection}>
        <Field label={t.gameNameEn} required error={showError('game_name_en')} requiredLabel={t.requiredFieldShort}>
          <input
            type="text"
            value={metadata.game_name_en ?? ''}
            onChange={(e) => onMetadataChange('game_name_en', e.target.value)}
            className={inputClass(showError('game_name_en'))}
          />
        </Field>
        {requires('KR') && (
          <Field label={t.gameNameKo} required error={showError('game_name_ko')} requiredLabel={t.requiredFieldShort}>
            <input
              type="text"
              value={metadata.game_name_ko ?? ''}
              onChange={(e) => onMetadataChange('game_name_ko', e.target.value)}
              className={inputClass(showError('game_name_ko'))}
            />
          </Field>
        )}
        {requires('JP') && (
          <Field label={t.gameNameJa} required error={showError('game_name_ja')} requiredLabel={t.requiredFieldShort}>
            <input
              type="text"
              value={metadata.game_name_ja ?? ''}
              onChange={(e) => onMetadataChange('game_name_ja', e.target.value)}
              className={inputClass(showError('game_name_ja'))}
            />
          </Field>
        )}
        {requires('CN') && (
          <Field label={t.gameNameZh} required error={showError('game_name_zh_hans')} requiredLabel={t.requiredFieldShort}>
            <input
              type="text"
              value={metadata.game_name_zh_hans ?? ''}
              onChange={(e) => onMetadataChange('game_name_zh_hans', e.target.value)}
              className={inputClass(showError('game_name_zh_hans'))}
            />
          </Field>
        )}
        {requires('TR') && (
          <Field label={t.gameNameTr} required error={showError('game_name_tr')} requiredLabel={t.requiredFieldShort}>
            <input
              type="text"
              value={metadata.game_name_tr ?? ''}
              onChange={(e) => onMetadataChange('game_name_tr', e.target.value)}
              className={inputClass(showError('game_name_tr'))}
            />
          </Field>
        )}
      </Section>

      <Section title={t.bannerSection}>
        {singlePool ? (
          <BannerFields
            t={t}
            pool={singlePool}
            requires={requires}
            showError={showError}
            onBannerChange={onBannerChange}
          />
        ) : (
          <p className="text-xs text-fg-muted">{t.multiBannerNote}</p>
        )}
      </Section>

      <Section title={t.operatorSection}>
        <Field label={t.operatorEn} required error={showError('operator_name_en')} requiredLabel={t.requiredFieldShort}>
          <input
            type="text"
            value={metadata.operator_name_en ?? ''}
            onChange={(e) => onMetadataChange('operator_name_en', e.target.value)}
            className={inputClass(showError('operator_name_en'))}
          />
        </Field>
        {requires('KR') && (
          <Field label={t.operatorKo} required error={showError('operator_name_ko')} requiredLabel={t.requiredFieldShort}>
            <input
              type="text"
              value={metadata.operator_name_ko ?? ''}
              onChange={(e) => onMetadataChange('operator_name_ko', e.target.value)}
              className={inputClass(showError('operator_name_ko'))}
            />
          </Field>
        )}
        {requires('JP') && (
          <Field label={t.operatorJa} required error={showError('operator_name_ja')} requiredLabel={t.requiredFieldShort}>
            <input
              type="text"
              value={metadata.operator_name_ja ?? ''}
              onChange={(e) => onMetadataChange('operator_name_ja', e.target.value)}
              className={inputClass(showError('operator_name_ja'))}
            />
          </Field>
        )}
        {requires('CN') && (
          <Field label={t.operatorZh} required error={showError('operator_name_zh_hans')} requiredLabel={t.requiredFieldShort}>
            <input
              type="text"
              value={metadata.operator_name_zh_hans ?? ''}
              onChange={(e) => onMetadataChange('operator_name_zh_hans', e.target.value)}
              className={inputClass(showError('operator_name_zh_hans'))}
            />
          </Field>
        )}
        {requires('TR') && (
          <Field label={t.operatorTr} required error={showError('operator_name_tr')} requiredLabel={t.requiredFieldShort}>
            <input
              type="text"
              value={metadata.operator_name_tr ?? ''}
              onChange={(e) => onMetadataChange('operator_name_tr', e.target.value)}
              className={inputClass(showError('operator_name_tr'))}
            />
          </Field>
        )}
      </Section>

      {requires('KR') && (
        <Section title={t.koreaSection}>
          <label className="flex items-start gap-2 text-sm text-fg cursor-pointer hover:text-cyan transition mb-3">
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
            <Field
              label={t.domesticAgent}
              required
              error={showError('domestic_agent_name_ko')}
              requiredLabel={t.requiredFieldShort}
            >
              <input
                type="text"
                value={metadata.domestic_agent_name_ko ?? ''}
                onChange={(e) => onMetadataChange('domestic_agent_name_ko', e.target.value)}
                className={inputClass(showError('domestic_agent_name_ko'))}
              />
            </Field>
          )}
        </Section>
      )}

      {requires('CN') && (
        <Section title={t.chinaSection}>
          <Field
            label={t.outcomeHistoryUrl}
            required
            error={showError('outcome_history_url')}
            requiredLabel={t.requiredFieldShort}
          >
            <input
              type="url"
              value={metadata.outcome_history_url ?? ''}
              onChange={(e) => onMetadataChange('outcome_history_url', e.target.value)}
              placeholder={t.outcomeHistoryPlaceholder}
              className={inputClass(showError('outcome_history_url'))}
            />
            <p className="text-xs text-fg-subtle mt-1">{t.outcomeHistoryHelp}</p>
          </Field>
        </Section>
      )}
    </div>
  )
}

function BannerFields({
  t,
  pool,
  requires,
  showError,
  onBannerChange,
}: {
  t: GachaStrings['tool']['gameDetails']
  pool: Pool
  requires: (r: Region) => boolean
  showError: (key: string) => boolean
  onBannerChange: (poolId: string, field: BannerField, value: string) => void
}) {
  return (
    <>
      <Field label={t.bannerNameEn} required error={showError('banner_name_en')} requiredLabel={t.requiredFieldShort}>
        <input
          type="text"
          value={pool.banner_name_en ?? ''}
          onChange={(e) => onBannerChange(pool.pool_id, 'banner_name_en', e.target.value)}
          className={inputClass(showError('banner_name_en'))}
        />
      </Field>
      {requires('KR') && (
        <Field label={t.bannerNameKo} required error={showError('banner_name_ko')} requiredLabel={t.requiredFieldShort}>
          <input
            type="text"
            value={pool.banner_name_ko ?? ''}
            onChange={(e) => onBannerChange(pool.pool_id, 'banner_name_ko', e.target.value)}
            className={inputClass(showError('banner_name_ko'))}
          />
        </Field>
      )}
      {requires('JP') && (
        <Field label={t.bannerNameJa} required error={showError('banner_name_ja')} requiredLabel={t.requiredFieldShort}>
          <input
            type="text"
            value={pool.banner_name_ja ?? ''}
            onChange={(e) => onBannerChange(pool.pool_id, 'banner_name_ja', e.target.value)}
            className={inputClass(showError('banner_name_ja'))}
          />
        </Field>
      )}
      {requires('CN') && (
        <Field label={t.bannerNameZh} required error={showError('banner_name_zh_hans')} requiredLabel={t.requiredFieldShort}>
          <input
            type="text"
            value={pool.banner_name_zh_hans ?? ''}
            onChange={(e) => onBannerChange(pool.pool_id, 'banner_name_zh_hans', e.target.value)}
            className={inputClass(showError('banner_name_zh_hans'))}
          />
        </Field>
      )}
      {requires('TR') && (
        <Field label={t.bannerNameTr} required error={showError('banner_name_tr')} requiredLabel={t.requiredFieldShort}>
          <input
            type="text"
            value={pool.banner_name_tr ?? ''}
            onChange={(e) => onBannerChange(pool.pool_id, 'banner_name_tr', e.target.value)}
            className={inputClass(showError('banner_name_tr'))}
          />
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.bannerStart} required error={showError('banner_start')} requiredLabel={t.requiredFieldShort}>
          <input
            type="date"
            value={pool.banner_period?.start ?? ''}
            onChange={(e) => onBannerChange(pool.pool_id, 'banner_start', e.target.value)}
            className={inputClass(showError('banner_start'))}
          />
        </Field>
        <Field label={t.bannerEnd} required error={showError('banner_end')} requiredLabel={t.requiredFieldShort}>
          <input
            type="date"
            value={pool.banner_period?.end ?? ''}
            onChange={(e) => onBannerChange(pool.pool_id, 'banner_end', e.target.value)}
            className={inputClass(showError('banner_end'))}
          />
        </Field>
      </div>
    </>
  )
}

function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      {title && (
        <p className="text-xs uppercase tracking-wider text-fg-subtle font-semibold mb-3">
          {title}
        </p>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({
  label,
  required,
  error,
  requiredLabel,
  children,
}: {
  label: string
  required?: boolean
  error?: boolean
  requiredLabel: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="text-xs font-medium text-fg-muted block mb-1">
        {label}
        {required && <span className="text-alert ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-alert mt-1">{requiredLabel}</p>}
    </div>
  )
}

function inputClass(error?: boolean) {
  return `w-full px-3 py-2 text-sm rounded-md border bg-surface text-fg placeholder:text-fg-subtle focus:outline-none ${
    error ? 'border-alert focus:border-alert' : 'border-divider focus:border-cyan/60'
  }`
}
