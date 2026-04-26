import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'

export function NotFound() {
  return (
    <Layout>
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight mb-4">404</h1>
        <p className="text-zinc-400 leading-relaxed">
          That page doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block mt-8 text-sm text-zinc-300 hover:text-white underline underline-offset-4"
        >
          Back to the directory
        </Link>
      </div>
    </Layout>
  )
}
