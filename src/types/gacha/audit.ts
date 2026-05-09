import type { Region, RateSheetMetadata } from './rateSheet'
import type { ValidationResult } from './validation'
import type { FieldSource } from './fieldSource'

export interface GeneratedBlock {
  region: Region
  format: 'html' | 'png' | 'json'
  block_hash: string
  block_uri: string
}

export interface AutoTranslationAttestation {
  // True when the user clicked through the pre-export warning modal that
  // surfaces unreviewed AI-translated fields. False when no unreviewed fields
  // were present at export time, or no attestation was given.
  user_attested_at_export: boolean
  attested_at?: string // ISO 8601 — set when user_attested_at_export is true
}

export interface AuditTrail {
  schema_version: '1.1'
  generated_at: string
  tool_version: string
  rate_sheet_hash: string
  rate_sheet_metadata: RateSheetMetadata
  regions_targeted: Region[]
  validation_results: ValidationResult[]
  generated_blocks: GeneratedBlock[]
  // Per-field provenance for Game Details inputs the user filled out.
  // Keys are field IDs (studio_name, game_name_ko, banner_name_zh_hans, …).
  // Missing keys mean the field was either left empty or came from the
  // parsed rate sheet's CSV/JSON metadata (treated as user-controlled).
  field_sources: Record<string, FieldSource>
  auto_translation_attestation: AutoTranslationAttestation
  disclaimer: string
}
