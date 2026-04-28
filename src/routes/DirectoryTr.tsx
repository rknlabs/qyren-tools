import { Layout } from '../components/Layout'
import { CaptureForm } from '../components/CaptureForm'
import { SEO } from '../components/SEO'

// Placeholder copy. Replaced by native-Turkish freelancer in Sprint 1 Section D1.
export function DirectoryTr() {
  return (
    <Layout>
      <SEO
        title="Türk oyun stüdyoları için ücretsiz monetizasyon araçları"
        description="F2P stüdyoları için ücretsiz monetizasyon araçları. Türk oyun stüdyoları için seçilmiş bir dizin."
        path="/tr"
        locale="tr"
      />
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 gap-10">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4 text-fg">
            Qyren Tools
          </h1>
          <p className="text-fg-muted leading-relaxed">
            Türk oyun stüdyoları için ücretsiz monetizasyon araçları.
          </p>
          <p className="text-fg-subtle text-sm mt-8">
            Çok yakında. Sprint 1 devam ediyor.
          </p>
        </div>
        <div className="w-full max-w-2xl">
          <CaptureForm capturedFromTool="directory" sourceLocale="tr" variant="inline" />
        </div>
      </div>
    </Layout>
  )
}
