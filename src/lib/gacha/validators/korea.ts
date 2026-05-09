import type { Validator } from '../../../types/gacha/validation'

export const KR2_pityDisclosure: Validator = (ctx) => {
  if (ctx.region !== 'KR') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  if (!pool.pity_threshold || pool.pity_threshold === 0) {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'KR',
        validator_id: 'KR2',
        status: 'pass',
        message: 'No pity threshold declared (no pity disclosure required)',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: 'KR',
      validator_id: 'KR2',
      status: 'pass',
      message: `Pity threshold ${pool.pity_threshold} (${pool.pity_type ?? 'unspecified'}) will be disclosed in the Korean block`,
    },
  ]
}

export const KR3_guaranteeDisclosure: Validator = (ctx) => {
  if (ctx.region !== 'KR') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  if (!pool.guarantee_threshold) {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'KR',
        validator_id: 'KR3',
        status: 'pass',
        message: 'No guarantee threshold declared',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: 'KR',
      validator_id: 'KR3',
      status: 'pass',
      message: `Guarantee threshold ${pool.guarantee_threshold} will be disclosed in the Korean block`,
    },
  ]
}

export const KR4_languageCoverage: Validator = (ctx) => {
  if (ctx.region !== 'KR') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  const missing = pool.items.filter((item) => !item.name_ko || item.name_ko.trim() === '')
  if (missing.length === 0) {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'KR',
        validator_id: 'KR4',
        status: 'pass',
        message: 'All items have Korean names',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: 'KR',
      validator_id: 'KR4',
      status: 'fail',
      message: `${missing.length} item(s) lack Korean names (name_ko)`,
      suggested_fix: `Add name_ko for: ${missing
        .slice(0, 5)
        .map((m) => m.item_id)
        .join(', ')}${missing.length > 5 ? '…' : ''}`,
    },
  ]
}

export const KR5_refreshDiscipline: Validator = (ctx) => {
  if (ctx.region !== 'KR') return []
  const generatedAt = new Date(ctx.rateSheet.metadata.generated_at)
  if (Number.isNaN(generatedAt.getTime())) {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'KR',
        validator_id: 'KR5',
        status: 'warn',
        message: 'Rate sheet generated_at could not be parsed',
        suggested_fix: 'Set metadata.generated_at to an ISO 8601 timestamp.',
      },
    ]
  }
  const now = new Date()
  const daysAgo = (now.getTime() - generatedAt.getTime()) / (1000 * 60 * 60 * 24)
  if (daysAgo <= 90) {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'KR',
        validator_id: 'KR5',
        status: 'pass',
        message: `Rate sheet generated ${Math.floor(daysAgo)} day(s) ago, within 90-day window`,
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: 'KR',
      validator_id: 'KR5',
      status: 'warn',
      message: `Rate sheet generated ${Math.floor(daysAgo)} day(s) ago, outside 90-day refresh window`,
      suggested_fix: 'Refresh the rate sheet to confirm current rates match disclosed rates.',
    },
  ]
}

export const koreaValidators = [
  KR2_pityDisclosure,
  KR3_guaranteeDisclosure,
  KR4_languageCoverage,
  KR5_refreshDiscipline,
]
