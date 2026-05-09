import { Check } from 'lucide-react'
import type { GachaStrings } from '../../i18n/gacha'
import type { RateSheet } from '../../types/gacha/rateSheet'

interface LoadedSheetSummaryProps {
  strings: GachaStrings
  rateSheet: RateSheet
}

export function LoadedSheetSummary({ strings, rateSheet }: LoadedSheetSummaryProps) {
  const itemTotal = rateSheet.pools.reduce((acc, p) => acc + p.items.length, 0)
  const game =
    rateSheet.metadata.game_name_en ||
    rateSheet.metadata.game_id ||
    rateSheet.metadata.studio_name ||
    '—'
  const message = strings.tool.loaded.summary
    .replace('{game}', game)
    .replace('{pools}', String(rateSheet.pools.length))
    .replace('{items}', String(itemTotal))

  return (
    <div className="rounded-md border border-success/40 bg-success/5 p-3 flex items-center gap-2">
      <Check size={14} className="text-success shrink-0" />
      <p className="text-sm text-fg flex-1 min-w-0 truncate">{message}</p>
    </div>
  )
}
