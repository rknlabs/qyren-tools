import { Layout } from '../components/Layout'
import { ToolCard } from '../components/ToolCard'
import { tools } from '../content/tools'

export function Directory() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-12 max-w-2xl">
          <h1 className="font-cinzel text-4xl font-semibold tracking-tight mb-4 text-gold">
            Free tools for F2P monetization
          </h1>
          <p className="text-fg/70 leading-relaxed">
            A curated directory of free utilities for IAP catalog work, SKAN
            attribution, A/B testing, LTV modeling, pricing localization, and
            LiveOps. Plus tools we build ourselves when the gaps are too big to
            point at.
          </p>
          <p className="text-sm text-fg/50 mt-4">
            {tools.length} tools curated. Search and filter coming soon.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </Layout>
  )
}
