import Papa from 'papaparse'
import type { Item, Pool, RateSheet, RateSheetMetadata } from '../../types/gacha/rateSheet'

export interface ParseError {
  row?: number
  message: string
}

export interface ParseResult {
  ok: boolean
  rateSheet?: RateSheet
  errors: ParseError[]
}

const REQUIRED_CSV_COLUMNS = ['pool_id', 'item_id', 'item_rarity', 'probability', 'name_en']
const OPTIONAL_CSV_COLUMNS = [
  'banner_id',
  'banner_name_en',
  'banner_name_ko',
  'banner_name_ja',
  'banner_name_zh_hans',
  'banner_name_tr',
  'banner_start',
  'banner_end',
  'pity_threshold',
  'pity_type',
  'guarantee_threshold',
  'name_ko',
  'name_ja',
  'name_zh_hans',
  'name_tr',
  'alternative_acquisition',
]

const META_COMMENT_PREFIX = '#'

export function parseRateSheet(input: string): ParseResult {
  const trimmed = input.trim()
  if (trimmed.startsWith('{')) {
    return parseJson(trimmed)
  }
  return parseCsv(trimmed)
}

function parseJson(input: string): ParseResult {
  try {
    const parsed = JSON.parse(input)
    const validation = validateRateSheetShape(parsed)
    if (validation.length > 0) {
      return { ok: false, errors: validation }
    }
    return { ok: true, rateSheet: parsed as RateSheet, errors: [] }
  } catch (err) {
    return {
      ok: false,
      errors: [{ message: `JSON parse error: ${(err as Error).message}` }],
    }
  }
}

function parseCsv(input: string): ParseResult {
  const lines = input.split(/\r?\n/)
  const metaLines: string[] = []
  const dataLines: string[] = []
  for (const line of lines) {
    if (line.startsWith(META_COMMENT_PREFIX)) {
      metaLines.push(line.slice(1).trim())
    } else {
      dataLines.push(line)
    }
  }

  const parsed = Papa.parse<Record<string, string>>(dataLines.join('\n'), {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  })

  const errors: ParseError[] = []
  if (parsed.errors.length > 0) {
    for (const e of parsed.errors) {
      errors.push({ row: e.row !== undefined ? e.row + 2 : undefined, message: e.message })
    }
  }

  const headers = parsed.meta.fields ?? []
  const missingRequired = REQUIRED_CSV_COLUMNS.filter((c) => !headers.includes(c))
  if (missingRequired.length > 0) {
    errors.push({
      message: `CSV missing required column(s): ${missingRequired.join(', ')}. Required: ${REQUIRED_CSV_COLUMNS.join(', ')}.`,
    })
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  const metadata = buildMetadataFromComments(metaLines)

  const poolMap = new Map<string, Pool>()
  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i]
    const rowNumber = i + 2 // header is row 1
    const poolId = row.pool_id?.trim()
    if (!poolId) {
      errors.push({ row: rowNumber, message: 'Missing pool_id' })
      continue
    }
    const probabilityStr = row.probability?.trim()
    const probability = Number(probabilityStr)
    if (probabilityStr === undefined || probabilityStr === '' || Number.isNaN(probability)) {
      errors.push({ row: rowNumber, message: `Invalid probability: ${probabilityStr ?? '(empty)'}` })
      continue
    }

    let pool = poolMap.get(poolId)
    if (!pool) {
      pool = {
        pool_id: poolId,
        items: [],
      }
      const bannerId = row.banner_id?.trim()
      if (bannerId) pool.banner_id = bannerId
      const bannerStart = row.banner_start?.trim()
      const bannerEnd = row.banner_end?.trim()
      if (bannerStart && bannerEnd) {
        pool.banner_period = { start: bannerStart, end: bannerEnd }
      }
      const bn = pickName(row, 'banner_name')
      if (bn.en) pool.banner_name_en = bn.en
      if (bn.ko) pool.banner_name_ko = bn.ko
      if (bn.ja) pool.banner_name_ja = bn.ja
      if (bn.zh) pool.banner_name_zh_hans = bn.zh
      if (bn.tr) pool.banner_name_tr = bn.tr
      const pityThreshold = row.pity_threshold?.trim()
      if (pityThreshold) {
        const n = Number(pityThreshold)
        if (!Number.isNaN(n)) pool.pity_threshold = n
      }
      const pityType = row.pity_type?.trim()
      if (pityType === 'soft' || pityType === 'hard' || pityType === 'none') {
        pool.pity_type = pityType
      }
      const guarantee = row.guarantee_threshold?.trim()
      if (guarantee) {
        const n = Number(guarantee)
        if (!Number.isNaN(n)) pool.guarantee_threshold = n
      }
      poolMap.set(poolId, pool)
    }

    const item: Item = {
      item_id: row.item_id?.trim() ?? '',
      item_rarity: row.item_rarity?.trim() ?? '',
      probability,
      name_en: row.name_en?.trim() ?? '',
    }
    if (row.name_ko?.trim()) item.name_ko = row.name_ko.trim()
    if (row.name_ja?.trim()) item.name_ja = row.name_ja.trim()
    if (row.name_zh_hans?.trim()) item.name_zh_hans = row.name_zh_hans.trim()
    if (row.name_tr?.trim()) item.name_tr = row.name_tr.trim()
    if (row.alternative_acquisition?.trim()) {
      item.alternative_acquisition = row.alternative_acquisition.trim()
    }
    pool.items.push(item)
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  const rateSheet: RateSheet = {
    metadata,
    pools: Array.from(poolMap.values()),
  }

  return { ok: true, rateSheet, errors: [] }
}

function pickName(row: Record<string, string>, prefix: string) {
  return {
    en: row[`${prefix}_en`]?.trim(),
    ko: row[`${prefix}_ko`]?.trim(),
    ja: row[`${prefix}_ja`]?.trim(),
    zh: row[`${prefix}_zh_hans`]?.trim(),
    tr: row[`${prefix}_tr`]?.trim(),
  }
}

function buildMetadataFromComments(lines: string[]): RateSheetMetadata {
  const map = new Map<string, string>()
  for (const line of lines) {
    const idx = line.indexOf('=')
    if (idx === -1) continue
    map.set(line.slice(0, idx).trim(), line.slice(idx + 1).trim())
  }
  return {
    studio_name: map.get('studio_name') ?? '',
    game_id: map.get('game_id') ?? '',
    game_name_en: map.get('game_name_en') ?? '',
    game_name_ko: map.get('game_name_ko'),
    game_name_ja: map.get('game_name_ja'),
    game_name_zh_hans: map.get('game_name_zh_hans'),
    game_name_tr: map.get('game_name_tr'),
    rate_sheet_version: map.get('rate_sheet_version') ?? '0.0.0',
    generated_at: map.get('generated_at') ?? new Date().toISOString(),
    operator_name_en: map.get('operator_name_en') ?? map.get('studio_name') ?? '',
    operator_name_ko: map.get('operator_name_ko'),
    operator_name_ja: map.get('operator_name_ja'),
    operator_name_zh_hans: map.get('operator_name_zh_hans'),
    operator_name_tr: map.get('operator_name_tr'),
    domestic_agent_name_ko: map.get('domestic_agent_name_ko'),
    outcome_history_url: map.get('outcome_history_url'),
  }
}

function validateRateSheetShape(input: unknown): ParseError[] {
  const errors: ParseError[] = []
  if (typeof input !== 'object' || input === null) {
    return [{ message: 'Top-level value must be an object' }]
  }
  const obj = input as Record<string, unknown>
  if (typeof obj.metadata !== 'object' || obj.metadata === null) {
    errors.push({ message: 'metadata is required and must be an object' })
  }
  if (!Array.isArray(obj.pools)) {
    errors.push({ message: 'pools is required and must be an array' })
    return errors
  }
  obj.pools.forEach((p, i) => {
    if (typeof p !== 'object' || p === null) {
      errors.push({ message: `pools[${i}] must be an object` })
      return
    }
    const pool = p as Record<string, unknown>
    if (typeof pool.pool_id !== 'string') {
      errors.push({ message: `pools[${i}].pool_id must be a string` })
    }
    if (!Array.isArray(pool.items)) {
      errors.push({ message: `pools[${i}].items must be an array` })
    }
  })
  return errors
}

export const RATE_SHEET_SCHEMA_REFERENCE = {
  required: REQUIRED_CSV_COLUMNS,
  optional: OPTIONAL_CSV_COLUMNS,
}
