import posthog from 'posthog-js'

const TOOL_KEY = 'gacha-disclosure-pack'

// EU defaults: the Qyren PostHog project lives in the EU region. US hosts
// return 401/404 when the EU key is sent there. Override via env if the
// project ever moves regions.
const DEFAULT_API_HOST = 'https://eu.i.posthog.com'
const DEFAULT_UI_HOST = 'https://eu.posthog.com'

let initialized = false

export function initPostHog() {
  if (initialized) return
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined
  if (!key) return
  const apiHost = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? DEFAULT_API_HOST
  const uiHost = (import.meta.env.VITE_POSTHOG_UI_HOST as string | undefined) ?? DEFAULT_UI_HOST
  try {
    posthog.init(key, {
      api_host: apiHost,
      ui_host: uiHost,
      capture_pageview: false,
      // Manual instrumentation only. Auto-capture binds global click listeners
      // that have caused button-handler interception in production.
      autocapture: false,
      disable_session_recording: true,
    })
    initialized = true
  } catch (err) {
    console.error('PostHog init failed; analytics disabled for this session.', err)
  }
}

function capture(event: string, props: Record<string, unknown> = {}) {
  if (!initialized) return
  try {
    posthog.capture(event, { tool: TOOL_KEY, ...props })
  } catch (err) {
    console.error(`PostHog capture failed for ${event}:`, err)
  }
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
