import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Tool } from '../content/tools'
import { LICENSE_LABELS, REGION_LABELS, WORKFLOW_ICONS } from '../content/tools'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const isBuilt = tool.kind === 'built'
  const Icon = WORKFLOW_ICONS[tool.workflows[0]]

  const cardClasses = `group flex flex-col h-full rounded-lg p-5 transition ${
    isBuilt
      ? 'border-2 border-gold/60 bg-surface hover:bg-surface-2'
      : 'border border-divider bg-surface/40 hover:border-cyan/40 hover:bg-surface'
  }`

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`shrink-0 inline-flex items-center justify-center size-7 rounded-md ${
                isBuilt ? 'bg-gold/15 text-gold' : 'bg-surface-2 text-fg-muted'
              }`}
            >
              <Icon size={14} />
            </span>
            {isBuilt && (
              <span className="inline-flex items-center rounded-md bg-gold/10 text-gold text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
                Built by Qyren
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-fg leading-snug">
            {tool.name}
          </h3>
        </div>
        {isBuilt ? (
          <ArrowRight
            size={16}
            className="shrink-0 text-fg-subtle group-hover:text-gold transition mt-0.5"
            aria-hidden="true"
          />
        ) : (
          <ArrowUpRight
            size={16}
            className="shrink-0 text-fg-subtle group-hover:text-cyan transition mt-0.5"
            aria-hidden="true"
          />
        )}
      </div>
      <p className="text-sm text-fg-muted leading-relaxed mb-4 flex-1">{tool.description}</p>
      <p className="text-sm text-fg leading-relaxed mb-4 font-medium">{tool.qyrenTake}</p>
      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {isBuilt && tool.status === 'coming-soon' && (
          <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/5 text-gold px-2 py-0.5 text-xs">
            Coming soon
          </span>
        )}
        <span className="inline-flex items-center rounded-full border border-divider bg-bg px-2 py-0.5 text-xs text-fg-muted">
          {LICENSE_LABELS[tool.license]}
        </span>
        {tool.regions.map((region) => (
          <span
            key={region}
            className="inline-flex items-center rounded-full border border-divider bg-bg px-2 py-0.5 text-xs text-fg-muted"
          >
            {REGION_LABELS[region]}
          </span>
        ))}
      </div>
    </>
  )

  if (isBuilt) {
    return (
      <Link to={tool.url} className={cardClasses}>
        {inner}
      </Link>
    )
  }
  return (
    <a href={tool.url} target="_blank" rel="noopener noreferrer" className={cardClasses}>
      {inner}
    </a>
  )
}
