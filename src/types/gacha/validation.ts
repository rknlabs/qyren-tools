import type { Region, RateSheet } from './rateSheet'

export type ValidationStatus = 'pass' | 'warn' | 'fail'

export interface ValidationResult {
  pool_id: string
  region: Region
  validator_id: string
  status: ValidationStatus
  message: string
  suggested_fix?: string
  // For locale-coverage and per-item validators: the specific item IDs that
  // triggered the failure. Empty/undefined when the validator is not
  // per-item (e.g. CN2 banner_id check, M1 sum check).
  failed_item_ids?: string[]
}

export interface ValidatorContext {
  pool_id: string
  region: Region
  rateSheet: RateSheet
}

export type Validator = (ctx: ValidatorContext) => ValidationResult[]
