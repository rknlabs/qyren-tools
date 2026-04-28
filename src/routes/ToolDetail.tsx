import { useParams, Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { SEO } from '../components/SEO'
import { tools } from '../content/tools'

export function ToolDetail() {
  const { slug } = useParams()
  const tool = tools.find((t) => t.slug === slug && t.kind === 'built')

  if (!tool) {
    return (
      <Layout>
        <SEO
          title="Tool not found"
          description="The tool you are looking for does not exist."
          path={`/tools/${slug ?? ''}`}
          locale="en"
          noindex
        />
        <div className="px-6 py-16 max-w-3xl">
          <h1 className="text-3xl font-semibold mb-4 text-fg">Tool not found</h1>
          <Link to="/" className="text-cyan hover:underline">Back to the directory</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO
        title={tool.name}
        description={tool.description}
        path={`/tools/${tool.slug}`}
        locale="en"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: tool.name,
          description: tool.description,
          url: `https://tools.qyren.ai/tools/${tool.slug}`,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          creator: {
            '@type': 'Organization',
            name: 'Qyren',
            url: 'https://qyren.ai',
          },
        }}
      />
      <div className="px-6 py-16 max-w-3xl">
        <div className="mb-2">
          <span className="inline-flex items-center rounded-md bg-gold/10 text-gold text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
            Built by Qyren
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4 text-gold">
          {tool.name}
        </h1>
        <p className="text-fg-muted leading-relaxed mb-6">{tool.description}</p>
        {tool.status === 'coming-soon' && (
          <p className="text-sm text-fg-muted">
            This tool is in active development.{' '}
            <Link to="/" className="text-cyan hover:underline">Get notified when it launches</Link>.
          </p>
        )}
      </div>
    </Layout>
  )
}
