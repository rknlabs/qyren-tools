import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { tools, WORKFLOW_LABELS, WORKFLOW_ICONS, type WorkflowTag } from '../content/tools'

export type SidebarFilter =
  | { kind: 'all' }
  | { kind: 'built' }
  | { kind: 'curated' }
  | { kind: 'workflow'; workflow: WorkflowTag }

interface SidebarProps {
  active: SidebarFilter
  onSelect: (filter: SidebarFilter) => void
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  const builtCount = tools.filter((t) => t.kind === 'built').length
  const curatedCount = tools.filter((t) => t.kind === 'curated').length

  const workflowCounts: Record<WorkflowTag, number> = {} as Record<WorkflowTag, number>
  for (const w of Object.keys(WORKFLOW_LABELS) as WorkflowTag[]) {
    workflowCounts[w] = tools.filter((t) => t.workflows.includes(w)).length
  }

  const isActive = (test: SidebarFilter) =>
    JSON.stringify(test) === JSON.stringify(active)

  return (
    <aside className="w-60 shrink-0 border-r border-divider bg-bg sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto py-6 px-4 hidden lg:block">
      <SidebarSection title="Quick views">
        <SidebarItem
          label="All tools"
          count={tools.length}
          active={isActive({ kind: 'all' })}
          onClick={() => onSelect({ kind: 'all' })}
        />
        <SidebarItem
          label="Built by Qyren"
          count={builtCount}
          active={isActive({ kind: 'built' })}
          onClick={() => onSelect({ kind: 'built' })}
          accent
        />
        <SidebarItem
          label="Curated"
          count={curatedCount}
          active={isActive({ kind: 'curated' })}
          onClick={() => onSelect({ kind: 'curated' })}
        />
      </SidebarSection>

      <SidebarSection title="By workflow">
        {(Object.keys(WORKFLOW_LABELS) as WorkflowTag[]).map((w) => (
          <SidebarItem
            key={w}
            icon={WORKFLOW_ICONS[w]}
            label={WORKFLOW_LABELS[w]}
            count={workflowCounts[w]}
            active={isActive({ kind: 'workflow', workflow: w })}
            onClick={() => onSelect({ kind: 'workflow', workflow: w })}
          />
        ))}
      </SidebarSection>
    </aside>
  )
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        {title}
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  count,
  active,
  onClick,
  accent,
}: {
  icon?: LucideIcon
  label: string
  count: number
  active: boolean
  onClick: () => void
  accent?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition text-left ${
        active
          ? 'bg-[var(--color-sidebar-active-bg)] text-[var(--color-sidebar-active-fg)] hover:bg-[var(--color-sidebar-active-bg)] font-medium'
          : accent
            ? 'text-gold hover:bg-surface'
            : 'text-fg-muted hover:bg-surface hover:text-fg'
      }`}
    >
      <span className="flex items-center gap-2">
        {Icon && <Icon size={14} />}
        {label}
      </span>
      <span className="text-xs text-fg-subtle">{count}</span>
    </button>
  )
}
