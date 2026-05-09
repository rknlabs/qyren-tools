import { useMemo, useState } from 'react'
import { REGION_LABELS, type Region } from '../../types/gacha/rateSheet'
import type { GachaStrings } from '../../i18n/gacha'
import type { RenderedBlock } from '../../lib/gacha/renderTemplate'

interface DisclosurePreviewProps {
  strings: GachaStrings
  blocks: RenderedBlock[]
  blockHashByKey: Map<string, string>
}

export function DisclosurePreview({ strings, blocks, blockHashByKey }: DisclosurePreviewProps) {
  const t = strings.tool
  const regions = useMemo(() => uniqueRegions(blocks), [blocks])
  const [activeRegion, setActiveRegion] = useState<Region | null>(regions[0] ?? null)
  const [activePool, setActivePool] = useState<string | null>(blocks[0]?.pool_id ?? null)

  const regionBlocks = blocks.filter((b) => b.region === activeRegion)
  const activeBlock = regionBlocks.find((b) => b.pool_id === activePool) ?? regionBlocks[0]
  const hash = activeBlock
    ? blockHashByKey.get(`${activeBlock.region}:${activeBlock.pool_id}`) ?? ''
    : ''

  return (
    <div className="rounded-lg border border-divider bg-surface/40 p-6">
      <h2 className="text-base font-semibold text-fg mb-4">{t.previewHeading}</h2>

      <div className="flex flex-wrap gap-1.5 mb-3 border-b border-divider pb-3">
        {regions.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => {
              setActiveRegion(region)
              const first = blocks.find((b) => b.region === region)?.pool_id ?? null
              setActivePool(first)
            }}
            className={`text-sm px-3 py-1 rounded-md transition ${
              activeRegion === region
                ? 'bg-cyan/10 text-cyan'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            {REGION_LABELS[region]}
          </button>
        ))}
      </div>

      {regionBlocks.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-3 text-xs">
          {regionBlocks.map((b) => (
            <button
              key={b.pool_id}
              type="button"
              onClick={() => setActivePool(b.pool_id)}
              className={`px-2 py-1 rounded font-mono transition ${
                activePool === b.pool_id
                  ? 'bg-fg text-bg'
                  : 'bg-bg text-fg-muted hover:text-fg border border-divider'
              }`}
            >
              {b.pool_id}
            </button>
          ))}
        </div>
      )}

      {activeBlock && (
        <>
          <iframe
            title={`Disclosure preview ${activeBlock.region} ${activeBlock.pool_id}`}
            srcDoc={activeBlock.html}
            sandbox=""
            className="w-full h-[640px] rounded-md border border-divider bg-white"
          />
          <p className="mt-2 text-xs font-mono text-fg-subtle break-all">
            {t.previewHashLabel}: {hash}
          </p>
        </>
      )}
    </div>
  )
}

function uniqueRegions(blocks: RenderedBlock[]): Region[] {
  const set = new Set<Region>()
  for (const b of blocks) set.add(b.region)
  return Array.from(set)
}
