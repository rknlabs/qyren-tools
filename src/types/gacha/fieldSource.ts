// FieldSource captures the provenance of a Game Details field value, so the
// audit JSON can attest to whether the studio typed it, an LLM auto-translated
// it, or the user reviewed an auto-translation by editing it.
export type FieldSource =
  | 'user_typed'
  | 'auto_translated_unreviewed'
  | 'auto_translated_then_edited'

export interface FieldEntry {
  value: string
  source: FieldSource
}

export type FieldSources = Record<string, FieldEntry>
