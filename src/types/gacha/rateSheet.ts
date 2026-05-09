export type Region = 'KR' | 'JP' | 'CN' | 'EN' | 'TR'

export type Rarity = string

export type PityType = 'soft' | 'hard' | 'none'

export interface Item {
  item_id: string
  item_rarity: Rarity
  probability: number
  name_en: string
  name_ko?: string
  name_ja?: string
  name_zh_hans?: string
  name_tr?: string
  alternative_acquisition?: string
}

export interface BannerPeriod {
  start: string
  end: string
}

export interface Pool {
  pool_id: string
  banner_id?: string
  banner_period?: BannerPeriod
  banner_name_en?: string
  banner_name_ko?: string
  banner_name_ja?: string
  banner_name_zh_hans?: string
  banner_name_tr?: string
  pity_threshold?: number
  pity_type?: PityType
  // Pull number where the soft-pity rate ramp begins; below this threshold
  // the listed rate applies, above it the rate increases per pull until
  // hitting 100% at pity_threshold. Required for full disclosure of
  // Genshin-style soft pity; Korean GRAC inspects for partial disclosure.
  soft_pity_start?: number
  guarantee_threshold?: number
  items: Item[]
}

export interface RateSheetMetadata {
  studio_name: string
  game_id: string
  game_name_en: string
  game_name_ko?: string
  game_name_ja?: string
  game_name_zh_hans?: string
  game_name_tr?: string
  rate_sheet_version: string
  generated_at: string
  source_system?: string
  operator_name_en: string
  operator_name_ko?: string
  operator_name_ja?: string
  operator_name_zh_hans?: string
  operator_name_tr?: string
  domestic_agent_name_ko?: string
  outcome_history_url?: string
}

export interface RateSheet {
  metadata: RateSheetMetadata
  pools: Pool[]
}

export const ALL_REGIONS: Region[] = ['KR', 'JP', 'CN', 'EN', 'TR']

export const REGION_LABELS: Record<Region, string> = {
  KR: 'Korea',
  JP: 'Japan',
  CN: 'China (mainland)',
  EN: 'US / EU (Apple, Google)',
  TR: 'Turkey',
}

export const REGION_REGIME: Record<Region, string> = {
  KR: 'Statute (GIPA Article 33, treble damages since Aug 2025)',
  JP: 'Self-regulation (JOGA / CESA, Unfair Premium Act backstop)',
  CN: 'Statute (MIIT 2017 notice, per-banner + daily caps + 90-day history)',
  EN: 'Platform policy (Apple Guideline 3.1.1, Google Play loot box policy)',
  TR: 'No domestic regime (Apple/Google floor only)',
}
