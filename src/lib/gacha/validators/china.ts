import type { Validator } from '../../../types/gacha/validation'

export const CN2_perBannerDisclosure: Validator = (ctx) => {
  if (ctx.region !== 'CN') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  if (!pool.banner_id || pool.banner_id.trim() === '') {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'CN',
        validator_id: 'CN2',
        status: 'fail',
        message: 'Mainland-licensed games require per-banner disclosure (banner_id missing)',
        suggested_fix:
          'Add a banner_id to each pool. Per-game aggregate disclosure does not satisfy MIIT.',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: 'CN',
      validator_id: 'CN2',
      status: 'pass',
      message: `Pool has banner_id ${pool.banner_id}`,
    },
  ]
}

export const CN3_languageCoverage: Validator = (ctx) => {
  if (ctx.region !== 'CN') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  const missing = pool.items.filter(
    (item) => !item.name_zh_hans || item.name_zh_hans.trim() === '',
  )
  if (missing.length === 0) {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'CN',
        validator_id: 'CN3',
        status: 'pass',
        message: 'All items have Simplified Chinese names',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: 'CN',
      validator_id: 'CN3',
      status: 'fail',
      message: `${missing.length} item(s) lack Simplified Chinese names (name_zh_hans)`,
      suggested_fix: `Add name_zh_hans for: ${missing
        .slice(0, 5)
        .map((m) => m.item_id)
        .join(', ')}${missing.length > 5 ? '…' : ''}`,
    },
  ]
}

export const CN4_dailyCapNotice: Validator = (ctx) => {
  if (ctx.region !== 'CN') return []
  return [
    {
      pool_id: ctx.pool_id,
      region: 'CN',
      validator_id: 'CN4',
      status: 'warn',
      message:
        'MIIT daily caps (30 single / 3 ten-pull / 50 total per player per day) must be enforced in-game. The disclosure block references this; the block does not enforce it.',
      suggested_fix:
        'Confirm in-game enforcement of the 30 / 3 / 50 daily-cap rule before publishing.',
    },
  ]
}

export const CN5_outcomeHistoryPointer: Validator = (ctx) => {
  if (ctx.region !== 'CN') return []
  const url = ctx.rateSheet.metadata.outcome_history_url
  if (url && url.trim() !== '') {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'CN',
        validator_id: 'CN5',
        status: 'pass',
        message: `90-day outcome history pointer set: ${url}`,
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: 'CN',
      validator_id: 'CN5',
      status: 'warn',
      message:
        '90-day outcome history pointer (metadata.outcome_history_url) is empty. Block will render a placeholder.',
      suggested_fix:
        'Provide the URL or in-game path where players can review the last 90 days of pull outcomes.',
    },
  ]
}

export const chinaValidators = [
  CN2_perBannerDisclosure,
  CN3_languageCoverage,
  CN4_dailyCapNotice,
  CN5_outcomeHistoryPointer,
]
