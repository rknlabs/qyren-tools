import type { Validator } from '../../../types/gacha/validation'

export const W2_languageCoverage: Validator = (ctx) => {
  if (ctx.region !== 'EN' && ctx.region !== 'TR') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  if (ctx.region === 'EN') {
    const missing = pool.items.filter((item) => !nonEmpty(item.name_en))
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
    const ids = missing.map((m) => m.item_id)
    return [
      {
        pool_id: ctx.pool_id,
        region: 'EN',
        validator_id: 'W2',
        status: 'fail',
        message: `${missing.length} item(s) lack English names (name_en): ${formatIdList(ids)}`,
        suggested_fix: 'Apple and Google policies require per-item odds disclosure in English.',
        failed_item_ids: ids,
      },
    ]
  }
  // TR — warn rather than fail because the Turkish block falls through to EN
  // when name_tr is missing. Studios who selected TR as a hard requirement
  // can promote this to fail by editing the rate sheet.
  const missing = pool.items.filter((item) => !nonEmpty(item.name_tr))
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
  const ids = missing.map((m) => m.item_id)
  return [
    {
      pool_id: ctx.pool_id,
      region: 'TR',
      validator_id: 'W2',
      status: 'warn',
      message: `${missing.length} item(s) lack Turkish names (name_tr); Turkish block will fall through to English names: ${formatIdList(ids)}`,
      suggested_fix: 'Add name_tr for items, or remove TR from the region selection.',
      failed_item_ids: ids,
    },
  ]
}

function nonEmpty(s: string | undefined): boolean {
  return typeof s === 'string' && s.trim() !== ''
}

function formatIdList(ids: string[]): string {
  if (ids.length <= 8) return ids.join(', ')
  return `${ids.slice(0, 8).join(', ')}, … (+${ids.length - 8} more)`
}

export const westernValidators = [W2_languageCoverage]
