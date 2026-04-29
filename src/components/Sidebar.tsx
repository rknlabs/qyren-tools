import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  tools,
  WORKFLOW_LABELS,
  WORKFLOW_ICONS,
  SECTION_ORDER,
  type WorkflowTag,
} from '../content/tools'

export type QuickView = 'all' | 'built' | 'curated'

interface SidebarProps {
  quickView: QuickView
  onQuickView: (qv: QuickView) => void
  activeWorkflow: WorkflowTag | null
  onWorkflowClick: (w: WorkflowTag) => void
}

export function Sidebar({
  quickView,
  onQuickView,
  activeWorkflow,
  onWorkflowClick,
}: SidebarProps) {
  const builtCount = tools.filter((t) => t.kind === 'built').length
  const curatedCount = tools.filter((t) => t.kind === 'curated').length

  const workflowCounts: Record<WorkflowTag, number> = {} as Record<WorkflowTag, number>
  for (const w of SECTION_ORDER) {
    workflowCounts[w] = tools.filter((t) => t.workflows.includes(w)).length
  }

  return (
    <div className="w-60 py-6 px-4">
      <SidebarSection title="Quick views">
        <SidebarItem
          label="All tools"
          count={tools.length}
          active={quickView === 'all'}
          onClick={() => onQuickView('all')}
        />
        <SidebarItem
          label="Built by Qyren"
          count={builtCount}
          active={quickView === 'built'}
          onClick={() => onQuickView('built')}
          accent
        />
        <SidebarItem
          label="Curated"
          count={curatedCount}
          active={quickView === 'curated'}
          onClick={() => onQuickView('curated')}
        />
      </SidebarSection>

      <SidebarSection title="By workflow">
        {SECTION_ORDER.map((w) => (
          <SidebarItem
            key={w}
            icon={WORKFLOW_ICONS[w]}
            label={WORKFLOW_LABELS[w]}
            count={workflowCounts[w]}
            active={activeWorkflow === w}
            onClick={() => onWorkflowClick(w)}
            disabled={quickView === 'built'}
          />
        ))}
      </SidebarSection>
    </div>
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
  disabled,
}: {
  icon?: LucideIcon
  label: string
  count: number
  active: boolean
  onClick: () => void
  accent?: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition text-left ${
        disabled
          ? 'text-fg-subtle/50 cursor-not-allowed'
          : active
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
