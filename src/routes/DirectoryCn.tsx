import { Layout } from '../components/Layout'
import { CaptureForm } from '../components/CaptureForm'
import { SEO } from '../components/SEO'

// Placeholder copy. Replaced by native-Simplified-Chinese freelancer in Sprint 1 Section D2.
export function DirectoryCn() {
  return (
    <Layout>
      <SEO
        title="面向出海中国游戏工作室的免费变现工具"
        description="为免费游戏工作室策划的免费变现工具目录。"
        path="/cn"
        locale="cn"
      />
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 gap-10">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4 text-fg">
            Qyren Tools
          </h1>
          <p className="text-fg-muted leading-relaxed">
            面向出海中国游戏工作室的免费变现工具。
          </p>
          <p className="text-fg-subtle text-sm mt-8">
            即将推出。Sprint 1 进行中。
          </p>
        </div>
        <div className="w-full max-w-2xl">
          <CaptureForm capturedFromTool="directory" sourceLocale="cn" variant="inline" />
        </div>
      </div>
    </Layout>
  )
}
