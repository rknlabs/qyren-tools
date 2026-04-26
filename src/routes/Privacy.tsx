import { Layout } from '../components/Layout'

// Stub. Full text drafted in Sprint 1 Section A4.
export function Privacy() {
  return (
    <Layout>
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Privacy</h1>
        <p className="text-zinc-400 leading-relaxed">
          Privacy policy is being drafted. The short version: we capture email
          addresses you choose to give us, log anonymized tool usage to improve
          what we build, and don't sell or share your data with anyone.
        </p>
      </div>
    </Layout>
  )
}
