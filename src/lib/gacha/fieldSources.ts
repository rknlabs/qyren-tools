import type {
  Pool,
  RateSheet,
  RateSheetMetadata,
  Region,
} from '../../types/gacha/rateSheet'
import type { FieldSources } from '../../types/gacha/fieldSource'

// One Region = one disclosure-block target language. Use Region as the
// canonical "language" identifier.
export type Language = Region

export const REGION_LANGUAGE_LABEL: Record<Language, string> = {
  EN: 'English',
  KR: 'Korean',
  JP: 'Japanese',
  CN: 'Simplified Chinese',
  TR: 'Turkish',
}

// MyMemory uses BCP 47 / ISO 639-1 codes.
export const REGION_TRANSLATION_LOCALE: Record<Language, string> = {
  EN: 'en',
  KR: 'ko',
  JP: 'ja',
  CN: 'zh-CN',
  TR: 'tr',
}

// Field-name suffix per region. Matches the rate-sheet schema column names.
const SUFFIX_BY_REGION: Record<Language, string> = {
  EN: 'en',
  KR: 'ko',
  JP: 'ja',
  CN: 'zh_hans',
  TR: 'tr',
}

export function suffixForRegion(region: Language): string {
  return SUFFIX_BY_REGION[region]
}

export const ALL_LANGUAGES_ORDER: Language[] = ['EN', 'KR', 'JP', 'CN', 'TR']

// Translatable field types — game name, banner name, operator name. These are
// the ones the "Translate from {Primary}" button reads/writes. Region-specific
// fields like outcome_history_url and domestic_agent_name_ko have no semantic
// counterpart in other languages, so they stay manual.
export const TRANSLATABLE_FIELD_PREFIXES = [
  'game_name',
  'banner_name',
  'operator_name',
] as const

export type TranslatableFieldPrefix = (typeof TRANSLATABLE_FIELD_PREFIXES)[number]

export function fieldId(prefix: TranslatableFieldPrefix, region: Language): string {
  return `${prefix}_${SUFFIX_BY_REGION[region]}`
}

// Per-card rendered fields. Used by LanguageCard to know what to render and
// by AUTO_TRANSLATE_SECTION to know what to translate.
export function translatableFieldsForRegion(region: Language): string[] {
  return TRANSLATABLE_FIELD_PREFIXES.map((p) => fieldId(p, region))
}

// Get the currently effective value for a field id, preferring the
// fieldSources override (user-typed or AI-translated) over the parsed
// rate sheet's data. Returns '' when the field is absent both places.
export function getEffectiveFieldValue(
  fieldId: string,
  rateSheet: RateSheet,
  fieldSources: FieldSources,
): string {
  const override = fieldSources[fieldId]
  if (override !== undefined) return override.value
  return readFromRateSheet(fieldId, rateSheet)
}

function readFromRateSheet(fieldId: string, rateSheet: RateSheet): string {
  const meta = rateSheet.metadata
  switch (fieldId) {
    case 'studio_name':
      return meta.studio_name ?? ''
    case 'outcome_history_url':
      return meta.outcome_history_url ?? ''
    case 'domestic_agent_name_ko':
      return meta.domestic_agent_name_ko ?? ''
    case 'banner_start':
      return rateSheet.pools[0]?.banner_period?.start ?? ''
    case 'banner_end':
      return rateSheet.pools[0]?.banner_period?.end ?? ''
  }
  // Game / operator names live on metadata
  if (fieldId.startsWith('game_name_') || fieldId.startsWith('operator_name_')) {
    return (meta as unknown as Record<string, string | undefined>)[fieldId] ?? ''
  }
  // Banner names live on the first pool
  if (fieldId.startsWith('banner_name_')) {
    const pool = rateSheet.pools[0]
    if (!pool) return ''
    return ((pool as unknown as Record<string, string | undefined>)[fieldId]) ?? ''
  }
  return ''
}

// Returns the operator name to render for a given region, falling back to
// the en value when the locale-specific value is missing or empty. Designed
// for use by the disclosure-block renderer and any future caller that needs
// "what the user / regulator will see" — keeps the en-fallback semantics in
// one place so render paths cannot diverge from audit paths.
//
// Validator behavior is intentionally NOT routed through this accessor:
// missingRequired still flags missing locale-specific operator names so the
// form blocks export until the studio fills them in. The fallback is the
// failsafe for rendering, not a license to skip localization.
export function pickOperatorName(meta: RateSheetMetadata, region: Region): string {
  const en = meta.operator_name_en
  switch (region) {
    case 'KR':
      return meta.operator_name_ko && meta.operator_name_ko.trim() ? meta.operator_name_ko : en
    case 'JP':
      return meta.operator_name_ja && meta.operator_name_ja.trim() ? meta.operator_name_ja : en
    case 'CN':
      return meta.operator_name_zh_hans && meta.operator_name_zh_hans.trim()
        ? meta.operator_name_zh_hans
        : en
    case 'TR':
      return meta.operator_name_tr && meta.operator_name_tr.trim() ? meta.operator_name_tr : en
    default:
      return en
  }
}

// Compose an effective RateSheet from the parsed sheet + field overrides.
// Used by the validators, template renderer, and audit JSON so that
// user-typed and AI-translated values flow through every downstream output.
export function buildEffectiveRateSheet(
  rateSheet: RateSheet,
  fieldSources: FieldSources,
): RateSheet {
  const meta = { ...rateSheet.metadata }
  const META_FIELDS: (keyof RateSheetMetadata)[] = [
    'studio_name',
    'game_name_en',
    'game_name_ko',
    'game_name_ja',
    'game_name_zh_hans',
    'game_name_tr',
    'operator_name_en',
    'operator_name_ko',
    'operator_name_ja',
    'operator_name_zh_hans',
    'operator_name_tr',
    'domestic_agent_name_ko',
    'outcome_history_url',
  ]
  for (const k of META_FIELDS) {
    const override = fieldSources[k]
    if (override !== undefined) {
      ;(meta as unknown as Record<string, string | undefined>)[k] = override.value
    }
  }

  const pools = rateSheet.pools.map((pool, idx) => {
    if (idx > 0) return pool // banner edits only apply to single-pool sheets
    const next: Pool = { ...pool }
    const startOverride = fieldSources['banner_start']
    const endOverride = fieldSources['banner_end']
    if (startOverride !== undefined || endOverride !== undefined) {
      next.banner_period = {
        start: startOverride?.value ?? pool.banner_period?.start ?? '',
        end: endOverride?.value ?? pool.banner_period?.end ?? '',
      }
    }
    const BANNER_FIELDS = [
      'banner_name_en',
      'banner_name_ko',
      'banner_name_ja',
      'banner_name_zh_hans',
      'banner_name_tr',
    ] as const
    for (const k of BANNER_FIELDS) {
      const override = fieldSources[k]
      if (override !== undefined) {
        ;(next as unknown as Record<string, string | undefined>)[k] = override.value
      }
    }
    return next
  })

  return { metadata: meta, pools }
}
