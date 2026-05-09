import posthog from 'posthog-js'

const TOOL_KEY = 'gacha-disclosure-pack'

let initialized = false

export function initPostHog() {
  if (initialized) return
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined
  if (!key) return
  const host = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com'
  posthog.init(key, { api_host: host, capture_pageview: false })
  initialized = true
}

function capture(event: string, props: Record<string, unknown> = {}) {
  if (!initialized) return
  posthog.capture(event, { tool: TOOL_KEY, ...props })
}

export function trackToolLoaded() {
  capture('tool_loaded')
}

export function trackRateSheetUploaded(
  poolCount: number,
  totalItemCount: number,
  regionsTargeted: string[],
) {
  capture('rate_sheet_uploaded', {
    pool_count: poolCount,
    total_item_count: totalItemCount,
    regions_targeted: regionsTargeted,
  })
}

export function trackValidationCompleted(
  regionsPassing: string[],
  regionsFailing: string[],
  topFailedValidator?: string,
) {
  capture('validation_completed', {
    regions_passing: regionsPassing,
    regions_failing: regionsFailing,
    top_failed_validator: topFailedValidator,
  })
}

export function trackValidationFailed(region: string, validatorId: string) {
  capture('validation_failed', { region, validator_id: validatorId })
}

export function trackExportAttempted() {
  capture('export_attempted')
}

export function trackCaptureSubmitted(usageSummary: Record<string, unknown>) {
  capture('capture_submitted', { source: TOOL_KEY, ...usageSummary })
}

export function trackDisclosureExported(regions: string[], formats: string[]) {
  capture('disclosure_exported', { regions, formats })
}
