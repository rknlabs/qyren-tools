export type WorkflowTag =
  | 'pricing-localization'
  | 'iap-catalog'
  | 'skan-attribution'
  | 'analytics-telemetry'
  | 'ab-testing'
  | 'economy-cohort'
  | 'liveops'
  | 'compliance'

export type RegionTag =
  | 'global'
  | 'china'
  | 'turkey'
  | 'korea'
  | 'sea'
  | 'japan'
  | 'mena'
  | 'russia'

export type LicenseTag =
  | 'mit'
  | 'apache-2.0'
  | 'gpl-3.0'
  | 'free-saas'
  | 'free-tier'
  | 'closed-source'
  | 'other'

export interface Tool {
  slug: string
  name: string
  description: string
  url: string
  license: LicenseTag
  workflows: WorkflowTag[]
  regions: RegionTag[]
  qyrenTake: string
}

export const WORKFLOW_LABELS: Record<WorkflowTag, string> = {
  'pricing-localization': 'Pricing & Localization',
  'iap-catalog': 'IAP & Catalog',
  'skan-attribution': 'SKAN & Attribution',
  'analytics-telemetry': 'Analytics & Telemetry',
  'ab-testing': 'A/B Testing',
  'economy-cohort': 'Economy & Cohort',
  liveops: 'LiveOps',
  compliance: 'Compliance',
}

export const REGION_LABELS: Record<RegionTag, string> = {
  global: 'Global',
  china: 'China',
  turkey: 'Turkey',
  korea: 'Korea',
  sea: 'SEA',
  japan: 'Japan',
  mena: 'MENA',
  russia: 'Russia',
}

export const LICENSE_LABELS: Record<LicenseTag, string> = {
  mit: 'MIT',
  'apache-2.0': 'Apache 2.0',
  'gpl-3.0': 'GPL-3.0',
  'free-saas': 'Free SaaS',
  'free-tier': 'Free tier',
  'closed-source': 'Closed source',
  other: 'Other',
}

// Vertical slice across 8 categories. Sprint 1 Section C1.
// URLs and licenses to verify before publishing — flagged in commit message.
export const tools: Tool[] = [
  {
    slug: 'kenn-app-store-pricing-matrix',
    name: 'kenn/app_store_pricing_matrix',
    description: "Reference table of Apple's price tiers across all currencies, parsed from App Store Connect.",
    url: 'https://github.com/kenn/app_store_pricing_matrix',
    license: 'mit',
    workflows: ['pricing-localization'],
    regions: ['global'],
    qyrenTake:
      "Useful when you're scripting price localization and need a static lookup. Less useful for live work — you'll be rebuilding the data yourself when Apple resets tiers.",
  },
  {
    slug: 'fastlane-deliver',
    name: 'fastlane deliver',
    description: 'CLI for uploading metadata, screenshots, and IAP details to App Store Connect.',
    url: 'https://docs.fastlane.tools/actions/deliver/',
    license: 'mit',
    workflows: ['iap-catalog'],
    regions: ['global'],
    qyrenTake:
      'The workhorse for any iOS metadata or IAP automation. The IAP support specifically is incomplete — no bulk price tier updates, no localization sync — but it remains the most-used CLI in the iOS world and worth knowing before building anything custom.',
  },
  {
    slug: 'dfabulich-node-asc-api',
    name: 'dfabulich/node-app-store-connect-api',
    description: 'Modern Node.js client for the App Store Connect API with built-in JWT signing.',
    url: 'https://github.com/dfabulich/node-app-store-connect-api',
    license: 'mit',
    workflows: ['iap-catalog'],
    regions: ['global'],
    qyrenTake:
      'Best starting point if you are building anything custom against ASC. Sane TypeScript ergonomics, JWT signing handled for you. Does not solve the bulk-IAP-editor problem on its own — that is a UI gap, not an API gap.',
  },
  {
    slug: 'homa-skan-conversion-schema',
    name: 'Homa: SKAN conversion schema in 4 steps',
    description: "Public engineering writeup from Homa Games on building a SKAN conversion-value schema from LTV.",
    url: 'https://medium.com/homa-engineering/navigating-skadnetwork-build-your-games-conversion-schema-in-4-easy-steps-96074acf7f65',
    license: 'free-saas',
    workflows: ['skan-attribution'],
    regions: ['global'],
    qyrenTake:
      'The clearest free reference for the underlying optimization math, with an embedded Deepnote notebook you can fork. You will still need to wire your own LTV data in and validate the schema against your MMP before pushing to production.',
  },
  {
    slug: 'posthog-oss',
    name: 'PostHog',
    description: 'Open-source product analytics with feature flags, A/B testing, and session replay.',
    url: 'https://posthog.com',
    license: 'mit',
    workflows: ['analytics-telemetry', 'ab-testing'],
    regions: ['global'],
    qyrenTake:
      'Heavy for a small studio — a 1–2 person team is better off on the free SaaS tier than self-hosting — but the right pick if you have outgrown a closed analytics vendor and want to own your event data. The OSS license is the unlock.',
  },
  {
    slug: 'gameanalytics-free',
    name: 'GameAnalytics',
    description: 'F2P-specific analytics with cohort, LTV, and ARPDAU dashboards out of the box.',
    url: 'https://gameanalytics.com',
    license: 'free-saas',
    workflows: ['analytics-telemetry'],
    regions: ['global'],
    qyrenTake:
      'Free tier covers most studios under 100k MAU. Less flexible than a general-purpose tool like PostHog, but you do not have to model F2P concepts from scratch — the dashboards already speak DAU, ARPDAU, D1, D7, and the SDK ships defaults that match.',
  },
  {
    slug: 'evan-miller-ab-calculator',
    name: 'Evan Miller A/B sample-size calculator',
    description: 'The canonical browser-based sample-size and significance calculator for A/B tests.',
    url: 'https://www.evanmiller.org/ab-testing/sample-size.html',
    license: 'free-saas',
    workflows: ['ab-testing'],
    regions: ['global'],
    qyrenTake:
      'Good for two-arm tests with binary outcomes (install→purchase, retention rates). Does not handle continuous outcomes (revenue, session length) or sequential testing — for those you want CUPED or a real experimentation platform.',
  },
  {
    slug: 'eseufert-theseus-growth',
    name: 'ESeufert/theseus_growth',
    description: 'Python library for cohort LTV modeling — fits curves to cohort revenue and projects forward.',
    url: 'https://github.com/ESeufert/theseus_growth',
    license: 'mit',
    workflows: ['economy-cohort'],
    regions: ['global'],
    qyrenTake:
      "Eric Seufert's library, the de-facto standard for indie F2P LTV work. Pairs with his published spreadsheet templates if you would rather not write Python. If you are doing serious cohort projection, start here before reinventing the curve-fit.",
  },
  {
    slug: 'firebase-remote-config',
    name: 'Firebase Remote Config + A/B Testing',
    description: 'Free LiveOps config-flag and experimentation layer integrated with Google Analytics.',
    url: 'https://firebase.google.com/docs/remote-config',
    license: 'free-saas',
    workflows: ['liveops', 'ab-testing'],
    regions: ['global'],
    qyrenTake:
      'Solid for first experiments if you are already on Firebase, and the GA4 integration is the killer feature. Becomes limiting once you need server-side targeting or fast iteration without app-update ceremony.',
  },
  {
    slug: 'appinchina-game-license-db',
    name: 'AppInChina Game License Database',
    description: 'Searchable English-language database of Chinese game license (版号 / ISBN) approvals since 2009.',
    url: 'https://game-licenses.appinchina.co/',
    license: 'free-saas',
    workflows: ['compliance'],
    regions: ['china'],
    qyrenTake:
      "Useful for due diligence on Chinese partner publishers and tracking 版号 issuance volumes by quarter. Does not help you get a license — for that you need a Chinese publishing partner with NPPA standing.",
  },
]
