import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { SEO } from '../components/SEO'

export function NotFound() {
  return (
    <Layout>
      <SEO
        title="Page not found"
        description="The page you are looking for does not exist."
        path="/404"
        locale="en"
        noindex
      />
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4 text-fg">404</h1>
          <p className="text-fg-muted leading-relaxed">
            That page doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-block mt-8 text-sm text-fg hover:text-cyan underline underline-offset-4"
          >
            Back to the directory
          </Link>
        </div>
      </div>
    </Layout>
  )
}
