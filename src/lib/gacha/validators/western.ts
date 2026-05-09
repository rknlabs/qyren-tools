import type { Validator } from '../../../types/gacha/validation'

// W2: English name coverage. Hard fail when missing, since Apple App Store
// Review Guideline 3.1.1 and Google Play Developer Policy require per-item
// odds disclosure in English for any randomized-virtual-item mechanism.
export const W2_languageCoverage: Validator = (ctx) => {
  if (ctx.region !== 'EN') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
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

// TR_NAME_COVERAGE: Turkish name coverage. Warn-only because Turkey has no
// gacha-specific disclosure regime — the Turkish disclosure block is an
// optional convenience for studios that publish a TR storefront listing.
// Studios may legitimately choose to keep English item names in their
// Turkish disclosure if their store listing matches.
export const TR_nameCoverage: Validator = (ctx) => {
  if (ctx.region !== 'TR') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  const missing = pool.items.filter((item) => !nonEmpty(item.name_tr))
  if (missing.length === 0) {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'TR',
        validator_id: 'TR_NAME_COVERAGE',
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
      validator_id: 'TR_NAME_COVERAGE',
      status: 'warn',
      message: `${missing.length} item(s) lack Turkish names (name_tr); Turkish block will fall through to English names: ${formatIdList(ids)}`,
      suggested_fix:
        'Add name_tr column values for the items above, or accept English item names in the Turkish disclosure if that matches your store listing.',
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

export const westernValidators = [W2_languageCoverage, TR_nameCoverage]
