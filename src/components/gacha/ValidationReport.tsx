import { useMemo } from 'react'
import { Check, AlertTriangle, X } from 'lucide-react'
import type { Region } from '../../types/gacha/rateSheet'
import { REGION_LABELS } from '../../types/gacha/rateSheet'
import type { ValidationResult } from '../../types/gacha/validation'
import type { GachaStrings } from '../../i18n/gacha'

interface ValidationReportProps {
  strings: GachaStrings
  results: ValidationResult[]
}

export function ValidationReport({ strings, results }: ValidationReportProps) {
  const t = strings.tool
  const grouped = useMemo(() => groupResults(results), [results])

  return (
    <div className="rounded-lg border border-divider bg-surface/40 p-6">
      <h2 className="text-base font-semibold text-fg mb-4">{t.resultsHeading}</h2>

      <div className="space-y-5">
        {Array.from(grouped.entries()).map(([region, byPool]) => (
          <div key={region}>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-fg">{REGION_LABELS[region]}</h3>
              <span className="text-xs text-fg-subtle">{region}</span>
              <RegionSummary results={Array.from(byPool.values()).flat()} strings={strings} />
            </div>
            {Array.from(byPool.entries()).map(([poolId, poolResults]) => (
              <div key={poolId} className="mb-3 last:mb-0">
                <p className="text-xs text-fg-subtle mb-1.5 font-mono">{poolId}</p>
                <ul className="space-y-1.5">
                  {poolResults.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm rounded-md border border-divider bg-bg px-3 py-2"
                    >
                      <StatusIcon status={r.status} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-fg-subtle">
                            {r.validator_id}
                          </span>
                          <span className="text-fg">{r.message}</span>
                        </div>
                        {r.suggested_fix && (
                          <p className="text-xs text-fg-muted mt-1">↳ {r.suggested_fix}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusIcon({ status }: { status: ValidationResult['status'] }) {
  if (status === 'pass') return <Check size={14} className="text-success mt-0.5 shrink-0" />
  if (status === 'warn')
    return <AlertTriangle size={14} className="text-gold mt-0.5 shrink-0" />
  return <X size={14} className="text-alert mt-0.5 shrink-0" />
}

function RegionSummary({
  results,
  strings,
}: {
  results: ValidationResult[]
  strings: GachaStrings
}) {
  const counts = { pass: 0, warn: 0, fail: 0 }
  for (const r of results) counts[r.status]++
  return (
    <div className="flex items-center gap-2 text-xs ml-auto">
      <span className="text-success">
        {counts.pass} {strings.tool.statusPass}
      </span>
      {counts.warn > 0 && (
        <span className="text-gold">
          {counts.warn} {strings.tool.statusWarn}
        </span>
      )}
      {counts.fail > 0 && (
        <span className="text-alert">
          {counts.fail} {strings.tool.statusFail}
        </span>
      )}
    </div>
  )
}

function groupResults(results: ValidationResult[]): Map<Region, Map<string, ValidationResult[]>> {
  const out = new Map<Region, Map<string, ValidationResult[]>>()
  for (const r of results) {
    let byPool = out.get(r.region)
    if (!byPool) {
      byPool = new Map()
      out.set(r.region, byPool)
    }
    let arr = byPool.get(r.pool_id)
    if (!arr) {
      arr = []
      byPool.set(r.pool_id, arr)
    }
    arr.push(r)
  }
  return out
}
