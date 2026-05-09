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
  const missing = pool.items.filter((item) => !nonEmpty(item.name_ko))
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
  const ids = missing.map((m) => m.item_id)
  return [
    {
      pool_id: ctx.pool_id,
      region: 'KR',
      validator_id: 'KR4',
      status: 'fail',
      message: `${missing.length} item(s) lack Korean names (name_ko): ${formatIdList(ids)}`,
      suggested_fix: `Add name_ko column values for the items above before publishing the Korean disclosure.`,
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

export const KR6_pityCompleteness: Validator = (ctx) => {
  if (ctx.region !== 'KR') return []
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  if (!pool.pity_threshold) return []
  if (pool.soft_pity_start && pool.soft_pity_start > 0) {
    return [
      {
        pool_id: ctx.pool_id,
        region: 'KR',
        validator_id: 'KR6',
        status: 'pass',
        message: 'Pity disclosure includes both soft-pity ramp and hard-pity threshold',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: 'KR',
      validator_id: 'KR6',
      status: 'warn',
      message:
        'Pity threshold disclosed but soft-pity ramp is not. Korean GRAC inspects for partial pity disclosure.',
      suggested_fix:
        'If your game uses Genshin-style soft pity (rate increases gradually before the hard threshold), add soft_pity_start to your rate sheet for fuller disclosure.',
    },
  ]
}

export const koreaValidators = [
  KR2_pityDisclosure,
  KR3_guaranteeDisclosure,
  KR4_languageCoverage,
  KR5_refreshDiscipline,
  KR6_pityCompleteness,
]
