import { Link } from 'react-router-dom'
import { ArrowRight, FileText, ExternalLink } from 'lucide-react'
import { Layout } from '../../components/Layout'
import { SEO } from '../../components/SEO'
import { getGachaStrings, type GachaLocale } from '../../i18n/gacha'

const SAMPLES = [
  { file: 'single-banner.csv', label: 'Single banner' },
  { file: 'multi-banner.csv', label: 'Multi-banner' },
  { file: 'soft-pity.csv', label: 'Soft pity (Genshin-style)' },
  { file: 'hard-pity.csv', label: 'Hard pity (FGO-style)' },
]

interface DetailPageProps {
  locale: GachaLocale
}

const PATH_BY_LOCALE: Record<GachaLocale, string> = {
  en: '/gacha-disclosure-pack',
  tr: '/tr/gacha-disclosure-pack',
  cn: '/cn/gacha-disclosure-pack',
}

export function DetailPage({ locale }: DetailPageProps) {
  const strings = getGachaStrings(locale)
  const t = strings.detail
  const path = PATH_BY_LOCALE[locale]
  const runPath = `${path}/run`

  return (
    <Layout>
      <SEO
        title={t.title}
        description={t.tagline}
        path={path}
        locale={locale}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Qyren Gacha Disclosure Pack',
          description: t.tagline,
          url: `https://tools.qyren.ai${path}`,
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
      <div className="px-6 py-16 max-w-3xl mx-auto">
        <div className="mb-2">
          <span className="inline-flex items-center rounded-md bg-gold/10 text-gold text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
            {t.badge}
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3 text-gold">
          {t.title}
        </h1>
        <p className="text-fg-muted leading-relaxed mb-2">{t.tagline}</p>
        <p className="text-fg leading-relaxed mb-8">{t.description}</p>

        <Link
          to={runPath}
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-md bg-fg text-bg hover:bg-cyan font-medium transition mb-10"
        >
          {t.useCta}
          <ArrowRight size={14} />
        </Link>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-fg mb-3">{t.samples}</h2>
          <ul className="space-y-1.5">
            {SAMPLES.map((s) => (
              <li key={s.file}>
                <a
                  href={`/samples/gacha/${s.file}`}
                  download
                  className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-cyan transition"
                >
                  <FileText size={12} />
                  {s.label}
                  <span className="text-xs text-fg-subtle font-mono">{s.file}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-fg mb-2">{t.schemaTitle}</h2>
          <p className="text-sm text-fg-muted leading-relaxed">{t.schemaIntro}</p>
        </section>

        <a
          href="https://github.com/rknlabs/qyren-tools/tree/main/src/lib/gacha"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-cyan transition"
        >
          <ExternalLink size={14} />
          {t.sourceLink}
        </a>
      </div>
    </Layout>
  )
}
