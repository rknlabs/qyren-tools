import { createPortal } from 'react-dom'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  path: string
  locale?: 'en' | 'tr' | 'cn'
  structuredData?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean
}

const SITE_URL = 'https://tools.qyren.ai'
const OG_IMAGE = `${SITE_URL}/_logos/qyren-icon-transparent-256px.png`
const OG_IMAGE_ALT = 'Qyren'

const HREFLANG_MAP: Record<'en' | 'tr' | 'cn', string> = {
  en: 'en',
  tr: 'tr',
  cn: 'zh-Hans',
}

const OG_LOCALE_MAP: Record<'en' | 'tr' | 'cn', string> = {
  en: 'en_US',
  tr: 'tr_TR',
  cn: 'zh_CN',
}

export function SEO({
  title,
  description,
  path,
  locale = 'en',
  structuredData,
  noindex,
}: SEOProps) {
  const fullTitle = title.includes('Qyren') ? title : `${title} · Qyren Tools`
  const canonical = `${SITE_URL}${path}`
  const isLocaleRoot = path === '/' || path === '/tr' || path === '/cn'

  // Escape `<` to defend against `</script>` injection inside any string field
  // of the structured data. `<` is interpreted normally by JSON parsers.
  const ldJson = structuredData
    ? JSON.stringify(
        Array.isArray(structuredData) ? structuredData : [structuredData],
      ).replace(/</g, '\\u003c')
    : null

  return (
    <>
      <Helmet>
        <html lang={HREFLANG_MAP[locale]} />
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        {noindex ? <meta name="robots" content="noindex" /> : null}

        {isLocaleRoot ? (
          <link rel="alternate" hrefLang="en" href={`${SITE_URL}/`} />
        ) : null}
        {isLocaleRoot ? (
          <link rel="alternate" hrefLang="tr" href={`${SITE_URL}/tr`} />
        ) : null}
        {isLocaleRoot ? (
          <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/`} />
        ) : null}

        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Qyren Tools" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content={OG_IMAGE_ALT} />
        <meta property="og:image:width" content="256" />
        <meta property="og:image:height" content="256" />
        <meta property="og:locale" content={OG_LOCALE_MAP[locale]} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      {ldJson
        ? createPortal(
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: ldJson }}
            />,
            document.head,
          )
        : null}
    </>
  )
}
