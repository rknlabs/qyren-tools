import type { Validator } from '../../../types/gacha/validation'

export const W2_languageCoverage: Validator = (ctx) => {
  if (ctx.region !== 'EN' && ctx.region !== 'TR') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  if (ctx.region === 'EN') {
    const missing = pool.items.filter((item) => !item.name_en || item.name_en.trim() === '')
    if (missing.length === 0) {
      return [
        {
          pool_id: ctx.pool_id,
          region: 'EN',
          validator_id: 'W2',
          status: 'pass',
          message: 'All items have English names',
        },
      ]
    }
    return [
      {
        pool_id: ctx.pool_id,
        region: 'EN',
        validator_id: 'W2',
        status: 'fail',
        message: `${missing.length} item(s) lack English names (name_en)`,
        suggested_fix: 'Apple and Google policies require per-item odds disclosure in English.',
      },
    ]
  }
  // TR
  const missing = pool.items.filter((item) => !item.name_tr || item.name_tr.trim() === '')
  if (missing.length === 0) {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'TR',
        validator_id: 'W2',
        status: 'pass',
        message: 'All items have Turkish names',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: 'TR',
      validator_id: 'W2',
      status: 'warn',
      message: `${missing.length} item(s) lack Turkish names (name_tr); the Turkish block will fall through to English names`,
      suggested_fix: 'Add name_tr for items, or remove TR from the region selection.',
    },
  ]
}

export const westernValidators = [W2_languageCoverage]
