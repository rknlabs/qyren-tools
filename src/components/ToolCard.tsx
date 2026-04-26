import type { Tool } from '../content/tools'
import { LICENSE_LABELS, REGION_LABELS } from '../content/tools'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/70"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-base font-semibold text-zinc-100 leading-snug">
          {tool.name}
        </h3>
        <svg
          className="shrink-0 size-4 text-zinc-500 group-hover:text-zinc-300 transition mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 17L17 7M17 7H8M17 7V16" />
        </svg>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed mb-4">
        {tool.description}
      </p>
      <p className="text-sm text-zinc-300 leading-relaxed mb-4 italic">
        {tool.qyrenTake}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-xs text-zinc-400">
          {LICENSE_LABELS[tool.license]}
        </span>
        {tool.regions.map((region) => (
          <span
            key={region}
            className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-xs text-zinc-400"
          >
            {REGION_LABELS[region]}
          </span>
        ))}
      </div>
    </a>
  )
}
