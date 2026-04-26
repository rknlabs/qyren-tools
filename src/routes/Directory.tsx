import { useState, useMemo } from 'react'
import { Layout } from '../components/Layout'
import { Sidebar, type SidebarFilter } from '../components/Sidebar'
import { ToolCard } from '../components/ToolCard'
import { tools } from '../content/tools'

export function Directory() {
  const [filter, setFilter] = useState<SidebarFilter>({ kind: 'all' })

  const filtered = useMemo(() => {
    let list = tools
    if (filter.kind === 'built') list = list.filter((t) => t.kind === 'built')
    else if (filter.kind === 'curated') list = list.filter((t) => t.kind === 'curated')
    else if (filter.kind === 'workflow')
      list = list.filter((t) => t.workflows.includes(filter.workflow))
    return [...list].sort((a, b) => {
      if (a.kind === b.kind) return 0
      return a.kind === 'built' ? -1 : 1
    })
  }, [filter])

  const headlineByFilter: Record<SidebarFilter['kind'], string> = {
    all: 'Free tools for F2P monetization',
    built: 'Tools we built',
    curated: 'Tools we curate',
    workflow: 'Free tools for F2P monetization',
  }

  return (
    <Layout sidebar={<Sidebar active={filter} onSelect={setFilter} />}>
      <div className="px-6 lg:px-10 py-12">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3 text-gold">
            {headlineByFilter[filter.kind]}
          </h1>
          <p className="text-fg-muted leading-relaxed">
            A curated directory of free utilities for IAP catalog work, SKAN attribution, A/B testing, LTV modeling, pricing localization, and LiveOps. Plus tools we build ourselves when the gaps are too big to point at.
          </p>
          <p className="text-sm text-fg-subtle mt-3">
            {filtered.length} {filtered.length === 1 ? 'tool' : 'tools'} shown.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </div>
    </Layout>
  )
}
