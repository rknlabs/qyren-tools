import type { Validator } from '../../../types/gacha/validation'

const KOMPU_KEYWORDS = ['完成', '合成', 'combination', 'complete set', 'コンプリート']

export const JP2_languageCoverage: Validator = (ctx) => {
  if (ctx.region !== 'JP') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  const missing = pool.items.filter((item) => !item.name_ja || item.name_ja.trim() === '')
  if (missing.length === 0) {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'JP',
        validator_id: 'JP2',
        status: 'pass',
        message: 'All items have Japanese names',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: 'JP',
      validator_id: 'JP2',
      status: 'fail',
      message: `${missing.length} item(s) lack Japanese names (name_ja)`,
      suggested_fix: `Add name_ja for: ${missing
        .slice(0, 5)
        .map((m) => m.item_id)
        .join(', ')}${missing.length > 5 ? '…' : ''}`,
    },
  ]
}

export const JP3_kompuGachaCheck: Validator = (ctx) => {
  if (ctx.region !== 'JP') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  const flagged = pool.items.filter((item) => {
    const haystack = `${item.item_id} ${item.name_en} ${item.name_ja ?? ''}`.toLowerCase()
    return KOMPU_KEYWORDS.some((kw) => haystack.includes(kw.toLowerCase()))
  })
  if (flagged.length === 0) {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'JP',
        validator_id: 'JP3',
        status: 'pass',
        message: 'No kompu-gacha-shaped item names detected',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: 'JP',
      validator_id: 'JP3',
      status: 'fail',
      message: `${flagged.length} item(s) match kompu-gacha keywords; kompu gacha is illegal under the Unfair Premium Act (2012 ban).`,
      suggested_fix: `Review items: ${flagged
        .slice(0, 5)
        .map((m) => m.item_id)
        .join(', ')}. If they are not combination-completion items, rename to remove ambiguity.`,
    },
  ]
}

export const JP4_unfairPremiumActNote: Validator = (ctx) => {
  if (ctx.region !== 'JP') return []
  return [
    {
      pool_id: ctx.pool_id,
      region: 'JP',
      validator_id: 'JP4',
      status: 'warn',
      message:
        'Unfair Premium Act caps prize value at the lower of (20× transaction value) or JPY 100,000. The Pack does not validate item nominal values.',
      suggested_fix:
        'Confirm no single rare-tier item exceeds the prize-value cap relative to your gacha ticket price.',
    },
  ]
}

export const japanValidators = [JP2_languageCoverage, JP3_kompuGachaCheck, JP4_unfairPremiumActNote]
