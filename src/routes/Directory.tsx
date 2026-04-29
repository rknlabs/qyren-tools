import { useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Sidebar, type QuickView } from '../components/Sidebar'
import { ToolCard } from '../components/ToolCard'
import { CaptureForm } from '../components/CaptureForm'
import { SEO } from '../components/SEO'
import {
  tools,
  WORKFLOW_LABELS,
  WORKFLOW_ICONS,
  SECTION_ORDER,
  type Tool,
  type WorkflowTag,
} from '../content/tools'

const HEADER_OFFSET = 80

function sortTools(list: Tool[]): Tool[] {
  return [...list].sort((a, b) => {
    const ap = a.sortPriority ?? 999
    const bp = b.sortPriority ?? 999
    if (ap !== bp) return ap - bp
    return 0
  })
}

export function Directory() {
  const [quickView, setQuickView] = useState<QuickView>('all')
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowTag | null>(null)

  const builtTools = useMemo(
    () => sortTools(tools.filter((t) => t.kind === 'built')),
    [],
  )

  const sectionGroups = useMemo(() => {
    return SECTION_ORDER.map((workflow) => ({
      workflow,
      tools: sortTools(tools.filter((t) => t.workflows.includes(workflow))),
    })).filter((g) => g.tools.length > 0)
  }, [])

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const showBuilt = quickView !== 'curated'
  const showWorkflows = quickView !== 'built'

  const trackScroll = quickView === 'all'

  useEffect(() => {
    if (!trackScroll) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) {
          const w = (visible.target as HTMLElement).dataset.workflow as WorkflowTag
          setActiveWorkflow(w)
        }
      },
      { rootMargin: `-${HEADER_OFFSET}px 0px -60% 0px`, threshold: 0 },
    )
    for (const el of Object.values(sectionRefs.current)) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [trackScroll])

  const sidebarActiveWorkflow = trackScroll ? activeWorkflow : null

  const scrollToWorkflow = (w: WorkflowTag) => {
    if (quickView === 'built') setQuickView('all')
    requestAnimationFrame(() => {
      const el = sectionRefs.current[w]
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({ top, behavior: 'smooth' })
    })
  }

  const headline =
    quickView === 'built'
      ? 'Tools we built'
      : quickView === 'curated'
        ? 'Tools we curate'
        : 'Free tools for F2P monetization'

  return (
    <Layout
      sidebar={
        <Sidebar
          quickView={quickView}
          onQuickView={setQuickView}
          activeWorkflow={sidebarActiveWorkflow}
          onWorkflowClick={scrollToWorkflow}
        />
      }
    >
      <SEO
        title="Free tools for F2P monetization"
        description="Curated directory of free utilities for IAP catalog work, SKAN attribution, A/B testing, LTV modeling, pricing localization, and LiveOps. Plus tools we build ourselves."
        path="/"
        locale="en"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Qyren Tools',
            description:
              'Curated directory of free utilities for free-to-play monetization operators.',
            url: 'https://tools.qyren.ai/',
            publisher: {
              '@type': 'Organization',
              name: 'Qyren',
              url: 'https://qyren.ai',
            },
          },
          ...tools.map((tool) => ({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tool.name,
            description: tool.description,
            url: tool.kind === 'built' ? `https://tools.qyren.ai${tool.url}` : tool.url,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          })),
        ]}
      />
      <div className="px-6 lg:px-10 py-12">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3 text-gold">
            {headline}
          </h1>
          <p className="text-fg-muted leading-relaxed">
            A curated directory of free utilities for IAP catalog work, SKAN attribution, A/B testing, LTV modeling, pricing localization, and LiveOps. Plus tools we build ourselves when the gaps are too big to point at.
          </p>
        </header>

        {showBuilt && builtTools.length > 0 && (
          <SectionHeader
            id="built"
            title="Built by Qyren"
            count={builtTools.length}
            icon={Sparkles}
            accent
          />
        )}
        {showBuilt && builtTools.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-12">
            {builtTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        )}

        {showWorkflows &&
          sectionGroups.map((group) => {
            const Icon = WORKFLOW_ICONS[group.workflow]
            return (
              <section
                key={group.workflow}
                ref={(el) => {
                  sectionRefs.current[group.workflow] = el
                }}
                data-workflow={group.workflow}
                className="scroll-mt-20"
              >
                <SectionHeader
                  id={group.workflow}
                  title={WORKFLOW_LABELS[group.workflow]}
                  count={group.tools.length}
                  icon={Icon}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-12">
                  {group.tools.map((t) => (
                    <ToolCard key={`${group.workflow}-${t.slug}`} tool={t} />
                  ))}
                </div>
              </section>
            )
          })}

        <div className="mt-12 max-w-2xl">
          <CaptureForm capturedFromTool="directory" sourceLocale="en" variant="inline" />
        </div>
      </div>
    </Layout>
  )
}

function SectionHeader({
  id,
  title,
  count,
  icon: Icon,
  accent,
}: {
  id: string
  title: string
  count: number
  icon: React.ComponentType<{ size?: number; className?: string }>
  accent?: boolean
}) {
  return (
    <div id={id} className="flex items-center gap-3 mb-5 mt-2 scroll-mt-20">
      <span
        className={`inline-flex items-center justify-center size-8 rounded-md ${
          accent ? 'bg-gold/15 text-gold' : 'bg-surface text-fg-muted'
        }`}
      >
        <Icon size={16} />
      </span>
      <h2 className={`text-xl font-semibold tracking-tight ${accent ? 'text-gold' : 'text-fg'}`}>
        {title}
      </h2>
      <span className="text-sm text-fg-subtle">({count})</span>
    </div>
  )
}
