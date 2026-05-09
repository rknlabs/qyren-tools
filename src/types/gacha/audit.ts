import type { Region, RateSheetMetadata } from './rateSheet'
import type { ValidationResult } from './validation'

export interface GeneratedBlock {
  region: Region
  format: 'html' | 'png' | 'json'
  block_hash: string
  block_uri: string
}

export interface AuditTrail {
  schema_version: '1.0'
  generated_at: string
  tool_version: string
  rate_sheet_hash: string
  rate_sheet_metadata: RateSheetMetadata
  regions_targeted: Region[]
  validation_results: ValidationResult[]
  generated_blocks: GeneratedBlock[]
  disclaimer: string
}
