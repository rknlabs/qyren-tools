import type { RateSheet, Region } from '../../types/gacha/rateSheet'
import type { ValidationResult, Validator } from '../../types/gacha/validation'
import { mathValidators } from './validators/math'
import { koreaValidators } from './validators/korea'
import { chinaValidators } from './validators/china'
import { japanValidators } from './validators/japan'
import { westernValidators } from './validators/western'

const REGION_VALIDATORS: Record<Region, Validator[]> = {
  KR: [...mathValidators, ...koreaValidators],
  CN: [...mathValidators, ...chinaValidators],
  JP: [...mathValidators, ...japanValidators],
  EN: [...mathValidators, ...westernValidators],
  TR: [...mathValidators, ...westernValidators],
}

export function validate(rateSheet: RateSheet, regions: Region[]): ValidationResult[] {
  const results: ValidationResult[] = []
  for (const region of regions) {
    for (const pool of rateSheet.pools) {
      for (const validator of REGION_VALIDATORS[region]) {
        results.push(...validator({ pool_id: pool.pool_id, region, rateSheet }))
      }
    }
  }
  return results
}

export function summarizeResults(results: ValidationResult[]) {
  const byRegion = new Map<Region, { pass: number; warn: number; fail: number }>()
  for (const r of results) {
    const cur = byRegion.get(r.region) ?? { pass: 0, warn: 0, fail: 0 }
    cur[r.status]++
    byRegion.set(r.region, cur)
  }
  const regionsPassing: Region[] = []
  const regionsFailing: Region[] = []
  for (const [region, counts] of byRegion) {
    if (counts.fail > 0) regionsFailing.push(region)
    else regionsPassing.push(region)
  }
  const failCounts = new Map<string, number>()
  for (const r of results.filter((r) => r.status === 'fail')) {
    failCounts.set(r.validator_id, (failCounts.get(r.validator_id) ?? 0) + 1)
  }
  let topFailedValidator: string | undefined
  let topCount = 0
  for (const [id, c] of failCounts) {
    if (c > topCount) {
      topCount = c
      topFailedValidator = id
    }
  }
  return { regionsPassing, regionsFailing, topFailedValidator }
}
