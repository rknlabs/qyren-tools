import { useParams, Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { tools } from '../content/tools'

export function ToolDetail() {
  const { slug } = useParams()
  const tool = tools.find((t) => t.slug === slug && t.kind === 'built')

  if (!tool) {
    return (
      <Layout>
        <div className="px-6 py-16 max-w-3xl">
          <h1 className="text-3xl font-semibold mb-4 text-fg">Tool not found</h1>
          <Link to="/" className="text-cyan hover:underline">Back to the directory</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
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
