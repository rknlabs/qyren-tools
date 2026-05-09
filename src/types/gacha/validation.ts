import type { Region, RateSheet } from './rateSheet'

export type ValidationStatus = 'pass' | 'warn' | 'fail'

export interface ValidationResult {
  pool_id: string
  region: Region
  validator_id: string
  status: ValidationStatus
  message: string
  suggested_fix?: string
}

export interface ValidatorContext {
  pool_id: string
  region: Region
  rateSheet: RateSheet
}

export type Validator = (ctx: ValidatorContext) => ValidationResult[]
