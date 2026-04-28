import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { tools } from '../src/content/tools.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SITE_URL = 'https://tools.qyren.ai'
const TODAY = new Date().toISOString().split('T')[0]

const staticPaths = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/tr', priority: '0.9', changefreq: 'weekly' },
  { path: '/cn', priority: '0.9', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'monthly' },
]

const builtToolPaths = tools
  .filter((t) => t.kind === 'built')
  .map((t) => ({
    path: `/tools/${t.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
  }))

const allPaths = [...staticPaths, ...builtToolPaths]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPaths
  .map(({ path, priority, changefreq }) => {
    const url = `${SITE_URL}${path}`
    const isLocaleRoot = path === '/' || path === '/tr' || path === '/cn'
    const hreflangs = isLocaleRoot
      ? `
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/" />
    <xhtml:link rel="alternate" hreflang="tr" href="${SITE_URL}/tr" />
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${SITE_URL}/cn" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`
      : ''
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${hreflangs}
  </url>`
  })
  .join('\n')}
</urlset>
`

const outputPath = resolve(__dirname, '../public/sitemap.xml')
writeFileSync(outputPath, xml, 'utf-8')
console.log(`Wrote ${allPaths.length} URLs to ${outputPath}`)
