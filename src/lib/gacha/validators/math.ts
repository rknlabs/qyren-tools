import type { Validator } from '../../../types/gacha/validation'

const TOLERANCE_ABS = 0.001

export const M1_probabilitySum: Validator = (ctx) => {
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  const sum = pool.items.reduce((acc, item) => acc + item.probability, 0)
  const absDiff = Math.abs(sum - 1.0)
  if (absDiff <= TOLERANCE_ABS) {
    return [
      {
        pool_id: ctx.pool_id,
        region: ctx.region,
        validator_id: 'M1',
        status: 'pass',
        message: `Probabilities sum to ${sum.toFixed(6)} (within ±${TOLERANCE_ABS})`,
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: ctx.region,
      validator_id: 'M1',
      status: 'fail',
      message: `Probabilities sum to ${sum.toFixed(6)}, expected 1.0 (tolerance ±${TOLERANCE_ABS})`,
      suggested_fix: `Adjust item probabilities so they sum to 1.0. Current diff: ${absDiff.toFixed(6)}`,
    },
  ]
}

export const M2_noZeroProbability: Validator = (ctx) => {
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  const zeros = pool.items.filter((item) => item.probability === 0)
  if (zeros.length === 0) {
    return [
      {
        pool_id: ctx.pool_id,
        region: ctx.region,
        validator_id: 'M2',
        status: 'pass',
        message: 'No zero-probability items',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: ctx.region,
      validator_id: 'M2',
      status: 'fail',
      message: `${zeros.length} item(s) with zero probability: ${zeros
        .slice(0, 3)
        .map((i) => i.item_id)
        .join(', ')}${zeros.length > 3 ? '…' : ''}`,
      suggested_fix:
        'Remove zero-probability items from the pool, or assign them a non-zero rate.',
    },
  ]
}

export const M3_noNegativeProbability: Validator = (ctx) => {
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  const negs = pool.items.filter((item) => item.probability < 0)
  if (negs.length === 0) {
    return [
      {
        pool_id: ctx.pool_id,
        region: ctx.region,
        validator_id: 'M3',
        status: 'pass',
        message: 'No negative probabilities',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: ctx.region,
      validator_id: 'M3',
      status: 'fail',
      message: `${negs.length} item(s) with negative probability`,
      suggested_fix: 'Probabilities must be in [0, 1].',
    },
  ]
}

export const M4_consistentPrecision: Validator = (ctx) => {
  const pool = ctx.rateSheet.pools.find((p) => p.pool_id === ctx.pool_id)
  if (!pool) return []
  const precisions = pool.items.map((item) => {
    const str = item.probability.toString()
    const decimal = str.split('.')[1]
    return decimal ? decimal.length : 0
  })
  const unique = new Set(precisions)
  if (unique.size <= 2) {
    return [
      {
        pool_id: ctx.pool_id,
        region: ctx.region,
        validator_id: 'M4',
        status: 'pass',
        message: 'Probability precision is consistent',
      },
    ]
  }
  return [
    {
      pool_id: ctx.pool_id,
      region: ctx.region,
      validator_id: 'M4',
      status: 'warn',
      message: `Probability precision varies (${unique.size} different precisions in pool)`,
      suggested_fix:
        'Normalize probabilities to a single precision (e.g. 4 decimal places throughout).',
    },
  ]
}

export const mathValidators = [
  M1_probabilitySum,
  M2_noZeroProbability,
  M3_noNegativeProbability,
  M4_consistentPrecision,
]
