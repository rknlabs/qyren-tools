import { Layout } from '../components/Layout'

export function Directory() {
  return (
    <Layout>
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight mb-4">
          Qyren Tools
        </h1>
        <p className="text-zinc-400 leading-relaxed">
          Free tools for free-to-play monetization operators. A curated
          directory plus utilities we build ourselves.
        </p>
        <p className="text-zinc-500 text-sm mt-8">
          Coming soon — Sprint 1 in progress.
        </p>
      </div>
    </Layout>
  )
}
