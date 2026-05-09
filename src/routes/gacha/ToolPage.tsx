import { useEffect, useMemo, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Layout } from '../../components/Layout'
import { SEO } from '../../components/SEO'
import { getGachaStrings, type GachaLocale } from '../../i18n/gacha'
import { RateSheetUpload } from '../../components/gacha/RateSheetUpload'
import { LoadedSheetSummary } from '../../components/gacha/LoadedSheetSummary'
import { GameDetailsForm } from '../../components/gacha/GameDetailsForm'
import { RegionSelector } from '../../components/gacha/RegionSelector'
import {
  OutputConfig,
  type OutputConfigState,
} from '../../components/gacha/OutputConfig'
import { ValidationReport } from '../../components/gacha/ValidationReport'
import { DisclosurePreview } from '../../components/gacha/DisclosurePreview'
import { ExportButtons, type ExportKind } from '../../components/gacha/ExportButtons'
import {
  GachaCaptureForm,
  type UsageSummary,
} from '../../components/gacha/GachaCaptureForm'
import { InlineNotice } from '../../components/gacha/ErrorStates'
import type { RateSheet, Region } from '../../types/gacha/rateSheet'
import type { ValidationResult } from '../../types/gacha/validation'
import type { FieldSource, FieldSources } from '../../types/gacha/fieldSource'
import {
  buildEffectiveRateSheet,
  getEffectiveFieldValue,
  type Language,
} from '../../lib/gacha/fieldSources'
import { validate, summarizeResults } from '../../lib/gacha/validate'
import { renderAllBlocks, type RenderedBlock } from '../../lib/gacha/renderTemplate'
import { sha256, sha256Bytes } from '../../lib/gacha/hash'
import { generateAuditTrail } from '../../lib/gacha/generateAuditJson'
import { downloadBlob, exportZip, slugifyGameName } from '../../lib/gacha/exportZip'
import { renderHtmlToPng } from '../../lib/gacha/renderPng'
import {
  initPostHog,
  trackCaptureSubmitted,
  trackDisclosureExported,
  trackExportAttempted,
  trackRateSheetUploaded,
  trackToolLoaded,
  trackValidationCompleted,
  trackValidationFailed,
} from '../../lib/gacha/analytics'

const TOOL_VERSION = '0.1.0'

const PATH_BY_LOCALE: Record<GachaLocale, string> = {
  en: '/gacha-disclosure-pack',
  tr: '/tr/gacha-disclosure-pack',
  cn: '/cn/gacha-disclosure-pack',
}

type Phase = 'input' | 'validating' | 'results' | 'capturing' | 'exporting' | 'complete'

interface State {
  phase: Phase
  rateSheet?: RateSheet
  // User edits and AI-translated overrides layered on top of the parsed rate
  // sheet. They survive re-uploads so a typed Studio name does not get wiped
  // when the operator re-loads a CSV. Source per field tracks whether the
  // value is user-typed, AI-translated and unreviewed, or AI-translated and
  // then user-edited.
  fieldSources: FieldSources
  primaryLanguage: Language
  isOverseasOperator: boolean
  formTouched: boolean
  regions: Region[]
  output: OutputConfigState
  validationResults: ValidationResult[]
  blocks: RenderedBlock[]
  blockHashByKey: Map<string, string>
  pendingExport?: ExportKind
  capturedEmail?: string
  exportFormats: string[]
}

type Action =
  | { type: 'RATE_SHEET_PARSED'; rateSheet: RateSheet }
  | { type: 'RATE_SHEET_CLEARED' }
  | { type: 'REGIONS_CHANGED'; regions: Region[] }
  | { type: 'OUTPUT_CHANGED'; output: OutputConfigState }
  | { type: 'FIELD_CHANGED'; fieldId: string; value: string }
  | { type: 'PRIMARY_LANGUAGE_CHANGED'; language: Language }
  | { type: 'OVERSEAS_TOGGLED'; value: boolean }
  | { type: 'FORM_TOUCHED' }
  | { type: 'START_VALIDATION' }
  | {
      type: 'VALIDATION_DONE'
      results: ValidationResult[]
      blocks: RenderedBlock[]
      blockHashByKey: Map<string, string>
    }
  | { type: 'EXPORT_REQUESTED'; kind: ExportKind }
  | { type: 'CAPTURE_DONE'; email: string }
  | { type: 'CAPTURE_CANCELLED' }
  | { type: 'EXPORT_DONE'; formats: string[] }
  | { type: 'RESET' }

const INITIAL: State = {
  phase: 'input',
  fieldSources: {},
  primaryLanguage: 'EN',
  isOverseasOperator: false,
  formTouched: false,
  regions: ['KR', 'JP', 'CN', 'EN'],
  output: {
    formatHtml: true,
    formatPng: true,
    formatJson: true,
    bannerLevel: true,
    pityDisclosure: true,
  },
  validationResults: [],
  blocks: [],
  blockHashByKey: new Map(),
  exportFormats: [],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'RATE_SHEET_PARSED':
      return { ...state, rateSheet: action.rateSheet, phase: 'input' }
    case 'RATE_SHEET_CLEARED':
      return { ...state, rateSheet: undefined }
    case 'REGIONS_CHANGED': {
      // If the current primary's region is no longer selected, fall back to
      // the first selected region (or EN if nothing is selected).
      const primary: Language = action.regions.includes(state.primaryLanguage)
        ? state.primaryLanguage
        : (action.regions[0] ?? 'EN')
      return { ...state, regions: action.regions, primaryLanguage: primary }
    }
    case 'OUTPUT_CHANGED':
      return { ...state, output: action.output }
    case 'FIELD_CHANGED': {
      // Source flip rules: typing in an auto-translated-unreviewed field
      // promotes it to auto_translated_then_edited (preserves forensic).
      // Otherwise the source is plain user_typed.
      const prior = state.fieldSources[action.fieldId]
      const nextSource: FieldSource =
        prior?.source === 'auto_translated_unreviewed'
          ? 'auto_translated_then_edited'
          : 'user_typed'
      return {
        ...state,
        fieldSources: {
          ...state.fieldSources,
          [action.fieldId]: { value: action.value, source: nextSource },
        },
      }
    }
    case 'PRIMARY_LANGUAGE_CHANGED':
      return { ...state, primaryLanguage: action.language }
    case 'OVERSEAS_TOGGLED':
      return { ...state, isOverseasOperator: action.value }
    case 'FORM_TOUCHED':
      return { ...state, formTouched: true }
    case 'START_VALIDATION':
      return { ...state, phase: 'validating' }
    case 'VALIDATION_DONE':
      return {
        ...state,
        phase: 'results',
        validationResults: action.results,
        blocks: action.blocks,
        blockHashByKey: action.blockHashByKey,
      }
    case 'EXPORT_REQUESTED':
      return { ...state, phase: 'capturing', pendingExport: action.kind }
    case 'CAPTURE_DONE':
      return { ...state, phase: 'exporting', capturedEmail: action.email }
    case 'CAPTURE_CANCELLED':
      return { ...state, phase: 'results', pendingExport: undefined }
    case 'EXPORT_DONE':
      return { ...state, phase: 'complete', exportFormats: action.formats }
    case 'RESET':
      return { ...INITIAL, fieldSources: {} }
    default:
      return state
  }
}

function effectiveRateSheet(state: State): RateSheet | undefined {
  if (!state.rateSheet) return undefined
  return buildEffectiveRateSheet(state.rateSheet, state.fieldSources)
}

function nonEmpty(s: string | undefined): boolean {
  return !!s && s.trim() !== ''
}

function getMissingRequired(state: State, sheet: RateSheet): Set<string> {
  const missing = new Set<string>()
  const m = sheet.metadata
  if (!nonEmpty(m.studio_name)) missing.add('studio_name')
  if (!nonEmpty(m.game_name_en)) missing.add('game_name_en')
  if (!nonEmpty(m.operator_name_en)) missing.add('operator_name_en')

  for (const region of state.regions) {
    if (region === 'KR') {
      if (!nonEmpty(m.game_name_ko)) missing.add('game_name_ko')
      if (!nonEmpty(m.operator_name_ko)) missing.add('operator_name_ko')
      if (state.isOverseasOperator && !nonEmpty(m.domestic_agent_name_ko)) {
        missing.add('domestic_agent_name_ko')
      }
    }
    if (region === 'JP') {
      if (!nonEmpty(m.game_name_ja)) missing.add('game_name_ja')
      if (!nonEmpty(m.operator_name_ja)) missing.add('operator_name_ja')
    }
    if (region === 'CN') {
      if (!nonEmpty(m.game_name_zh_hans)) missing.add('game_name_zh_hans')
      if (!nonEmpty(m.operator_name_zh_hans)) missing.add('operator_name_zh_hans')
      if (!nonEmpty(m.outcome_history_url)) missing.add('outcome_history_url')
    }
    if (region === 'TR') {
      if (!nonEmpty(m.game_name_tr)) missing.add('game_name_tr')
      if (!nonEmpty(m.operator_name_tr)) missing.add('operator_name_tr')
    }
  }

  if (sheet.pools.length === 1) {
    const p = sheet.pools[0]
    if (!nonEmpty(p.banner_name_en)) missing.add('banner_name_en')
    if (!nonEmpty(p.banner_period?.start)) missing.add('banner_start')
    if (!nonEmpty(p.banner_period?.end)) missing.add('banner_end')
    for (const region of state.regions) {
      if (region === 'KR' && !nonEmpty(p.banner_name_ko)) missing.add('banner_name_ko')
      if (region === 'JP' && !nonEmpty(p.banner_name_ja)) missing.add('banner_name_ja')
      if (region === 'CN' && !nonEmpty(p.banner_name_zh_hans)) missing.add('banner_name_zh_hans')
      if (region === 'TR' && !nonEmpty(p.banner_name_tr)) missing.add('banner_name_tr')
    }
  }

  return missing
}

interface ToolPageProps {
  locale: GachaLocale
}

export function ToolPage({ locale }: ToolPageProps) {
  const strings = getGachaStrings(locale)
  const t = strings.tool
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const [parseFlash, setParseFlash] = useState<string | null>(null)

  useEffect(() => {
    initPostHog()
    trackToolLoaded()
  }, [])

  const effSheet = useMemo(() => effectiveRateSheet(state), [state])
  const missingRequired = useMemo(
    () => (effSheet ? getMissingRequired(state, effSheet) : new Set<string>()),
    [state, effSheet],
  )

  async function runValidation() {
    if (!effSheet || state.regions.length === 0) return
    if (missingRequired.size > 0) {
      dispatch({ type: 'FORM_TOUCHED' })
      return
    }
    dispatch({ type: 'START_VALIDATION' })

    const results = validate(effSheet, state.regions)
    const summary = summarizeResults(results)
    trackValidationCompleted(
      summary.regionsPassing,
      summary.regionsFailing,
      summary.topFailedValidator,
    )
    for (const r of results.filter((r) => r.status === 'fail')) {
      trackValidationFailed(r.region, r.validator_id)
    }

    const blocks = renderAllBlocks(effSheet, state.regions, {
      toolVersion: TOOL_VERSION,
    })
    // HTML hash is sha256 of the exact HTML string the ZIP will contain.
    // PNG hash is computed at export time from the rendered blob bytes.
    const htmlHashByKey = new Map<string, string>()
    for (const block of blocks) {
      const hash = await sha256(block.html)
      htmlHashByKey.set(`${block.region}:${block.pool_id}`, hash)
    }

    dispatch({
      type: 'VALIDATION_DONE',
      results,
      blocks,
      blockHashByKey: htmlHashByKey,
    })
  }

  function handleParsed(rateSheet: RateSheet) {
    setParseFlash(null)
    const itemTotal = rateSheet.pools.reduce((acc, p) => acc + p.items.length, 0)
    trackRateSheetUploaded(rateSheet.pools.length, itemTotal, state.regions)
    dispatch({ type: 'RATE_SHEET_PARSED', rateSheet })
  }

  function buildUsageSummary(): UsageSummary {
    const failedFloors = state.validationResults.filter((r) => r.status === 'fail').length
    const itemTotal =
      state.rateSheet?.pools.reduce((acc, p) => acc + p.items.length, 0) ?? 0
    const formats: string[] = []
    if (state.output.formatHtml) formats.push('html')
    if (state.output.formatPng) formats.push('png')
    if (state.output.formatJson) formats.push('json')
    return {
      regions_covered: state.regions,
      rate_sheet_size: itemTotal,
      disclosure_floors_failed: failedFloors,
      export_formats:
        state.pendingExport === 'html'
          ? ['html']
          : state.pendingExport === 'json'
            ? ['json']
            : formats,
    }
  }

  async function performExport() {
    const sheet = effectiveRateSheet(state)
    if (!sheet || !state.pendingExport) return
    const kind = state.pendingExport
    const include = {
      includeHtml: kind === 'html' || (kind === 'all' && state.output.formatHtml),
      includePng: kind === 'all' && state.output.formatPng,
      includeJson: kind === 'json' || (kind === 'all' && state.output.formatJson),
    }

    let pngBlobByKey: Map<string, Blob> | undefined
    let pngHashByKey: Map<string, string> | undefined
    if (include.includePng) {
      pngBlobByKey = new Map()
      pngHashByKey = new Map()
      for (const block of state.blocks) {
        try {
          const blob = await renderHtmlToPng(block.html)
          const buf = await blob.arrayBuffer()
          const key = `${block.region}:${block.pool_id}`
          pngBlobByKey.set(key, blob)
          pngHashByKey.set(key, await sha256Bytes(buf))
        } catch (err) {
          console.error(`PNG render failed for ${block.region}:${block.pool_id}`, err)
        }
      }
    }

    const audit = await generateAuditTrail({
      rateSheet: sheet,
      regions: state.regions,
      validationResults: state.validationResults,
      blocks: state.blocks,
      htmlHashByKey: state.blockHashByKey,
      pngHashByKey,
      toolVersion: TOOL_VERSION,
      ...include,
    })

    if (kind === 'json') {
      const blob = new Blob([JSON.stringify(audit, null, 2)], { type: 'application/json' })
      const dateStamp = new Date().toISOString().split('T')[0]
      const slug = slugifyGameName(sheet.metadata.game_name_en, sheet.metadata.game_id)
      downloadBlob(blob, `gacha-audit-${slug}-${dateStamp}.json`)
      trackDisclosureExported(state.regions, ['json'])
      dispatch({ type: 'EXPORT_DONE', formats: ['json'] })
      return
    }

    const result = await exportZip({
      rateSheet: sheet,
      regions: state.regions,
      blocks: state.blocks,
      pngBlobByKey,
      auditTrail: audit,
      options: include,
    })
    downloadBlob(result.blob, result.filename)
    trackDisclosureExported(state.regions, result.formats)
    dispatch({ type: 'EXPORT_DONE', formats: result.formats })
  }

  function handleExport(kind: ExportKind) {
    trackExportAttempted()
    dispatch({ type: 'EXPORT_REQUESTED', kind })
  }

  async function handleCaptureSuccess(payload: { email: string }) {
    const summary = buildUsageSummary()
    trackCaptureSubmitted({ ...summary, email_domain: payload.email.split('@')[1] })
    dispatch({ type: 'CAPTURE_DONE', email: payload.email })
    // Run export after a brief delay so the success state is visible.
    setTimeout(() => {
      void performExport()
    }, 600)
  }

  const path = `${PATH_BY_LOCALE[locale]}/run`
  const detailPath = PATH_BY_LOCALE[locale]
  const canValidate =
    state.rateSheet !== undefined && state.regions.length > 0 && state.phase === 'input'

  const failedCount = state.validationResults.filter((r) => r.status === 'fail').length
  const validateBlocked = state.formTouched && missingRequired.size > 0

  return (
    <Layout>
      <SEO
        title={`${strings.detail.title} — Run`}
        description={strings.detail.tagline}
        path={path}
        locale={locale}
        noindex
      />
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <Link
          to={detailPath}
          className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-cyan transition mb-6"
        >
          <ArrowLeft size={14} />
          {strings.detail.title}
        </Link>

        {parseFlash && (
          <div className="mb-4">
            <InlineNotice tone="error" title={parseFlash} />
          </div>
        )}

        {state.phase === 'input' || state.phase === 'validating' ? (
          <div className="space-y-5">
            <RateSheetUpload
              strings={strings}
              onParsed={(rs) => handleParsed(rs)}
              onError={(errors) => setParseFlash(errors[0]?.message ?? t.errors.malformed)}
            />
            {effSheet && <LoadedSheetSummary strings={strings} rateSheet={effSheet} />}
            <RegionSelector
              strings={strings}
              selected={state.regions}
              onChange={(regions) => dispatch({ type: 'REGIONS_CHANGED', regions })}
            />
            {effSheet && state.rateSheet && (
              <GameDetailsForm
                strings={strings}
                pools={effSheet.pools}
                selectedRegions={state.regions}
                primaryLanguage={state.primaryLanguage}
                isOverseasOperator={state.isOverseasOperator}
                formTouched={state.formTouched}
                missingRequired={missingRequired}
                getValue={(fieldId) =>
                  getEffectiveFieldValue(fieldId, state.rateSheet!, state.fieldSources)
                }
                getSource={(fieldId) => state.fieldSources[fieldId]?.source}
                onFieldChange={(fieldId, value) =>
                  dispatch({ type: 'FIELD_CHANGED', fieldId, value })
                }
                onPrimaryLanguageChange={(language) =>
                  dispatch({ type: 'PRIMARY_LANGUAGE_CHANGED', language })
                }
                onOverseasToggle={(value) => dispatch({ type: 'OVERSEAS_TOGGLED', value })}
              />
            )}
            <OutputConfig
              strings={strings}
              value={state.output}
              onChange={(output) => dispatch({ type: 'OUTPUT_CHANGED', output })}
            />
            <div className="flex justify-end items-center gap-3">
              {validateBlocked && (
                <span className="text-xs text-alert">
                  {strings.tool.gameDetails.missingFieldsHeading}
                </span>
              )}
              <button
                type="button"
                onClick={() => void runValidation()}
                disabled={!canValidate || state.phase === 'validating'}
                className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-md bg-fg text-bg hover:bg-cyan font-medium transition disabled:opacity-40"
              >
                {state.phase === 'validating' ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> {t.validateBtn}
                  </>
                ) : (
                  t.validateBtn
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESET' })}
                className="text-xs text-fg-muted hover:text-cyan transition"
              >
                {t.startOver}
              </button>
              <button
                type="button"
                onClick={() => void runValidation()}
                className="inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-cyan transition"
              >
                <RefreshCw size={12} />
                {t.revalidateBtn}
              </button>
            </div>

            <ValidationReport strings={strings} results={state.validationResults} />
            <DisclosurePreview
              strings={strings}
              blocks={state.blocks}
              blockHashByKey={state.blockHashByKey}
            />
            <ExportButtons
              strings={strings}
              onExport={handleExport}
              disabled={state.phase === 'exporting' || state.phase === 'capturing'}
              pending={state.phase === 'exporting'}
            />

            {failedCount > 0 && (
              <InlineNotice
                tone="warn"
                title={`${failedCount} validator(s) failed.`}
                body="You can still export, but the studio is responsible for resolving these before publishing."
              />
            )}

            {state.phase === 'complete' && state.capturedEmail && (
              <InlineNotice
                tone="warn"
                title={`Pack downloaded for ${state.capturedEmail}.`}
                body={`Formats: ${state.exportFormats.join(', ')}.`}
              />
            )}
          </div>
        )}
      </div>

      {state.phase === 'capturing' && (
        <GachaCaptureForm
          strings={strings}
          locale={locale}
          usageSummary={buildUsageSummary()}
          onSuccess={handleCaptureSuccess}
          onCancel={() => dispatch({ type: 'CAPTURE_CANCELLED' })}
        />
      )}
    </Layout>
  )
}
