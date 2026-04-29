import {
  Coins,
  ShoppingBag,
  BarChart3,
  LineChart,
  GitCompare,
  Users,
  Repeat,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

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

export type ToolKind = 'curated' | 'built'

export interface Tool {
  slug: string
  kind: ToolKind
  name: string
  description: string
  url: string
  status?: 'live' | 'coming-soon'
  license: LicenseTag
  workflows: WorkflowTag[]
  regions: RegionTag[]
  qyrenTake: string
  sortPriority?: number
}

// Strategic-relevance order, not alphabetical. Drives both sidebar order and
// section render order on the directory page. Pricing + IAP first because they
// are daily F2P operator pain; compliance last because it is quarterly.
export const SECTION_ORDER: WorkflowTag[] = [
  'pricing-localization',
  'iap-catalog',
  'skan-attribution',
  'analytics-telemetry',
  'ab-testing',
  'liveops',
  'economy-cohort',
  'compliance',
]

export const WORKFLOW_LABELS: Record<WorkflowTag, string> = {
  'pricing-localization': 'Pricing & Localization',
  'iap-catalog': 'IAP & Catalog',
  'skan-attribution': 'SKAN & Attribution',
  'analytics-telemetry': 'Analytics & Telemetry',
  'ab-testing': 'A/B Testing',
  liveops: 'LiveOps',
  'economy-cohort': 'Economy & Cohort',
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

export const WORKFLOW_ICONS: Record<WorkflowTag, LucideIcon> = {
  'pricing-localization': Coins,
  'iap-catalog': ShoppingBag,
  'skan-attribution': BarChart3,
  'analytics-telemetry': LineChart,
  'ab-testing': GitCompare,
  'economy-cohort': Users,
  liveops: Repeat,
  compliance: ShieldCheck,
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
// URLs and licenses to verify before publishing. Flagged in commit message.
export const tools: Tool[] = [
  {
    slug: 'ppp-fx-localizer',
    kind: 'built',
    name: 'PPP + FX-Drift Price Localizer',
    description:
      'Reprice your IAP catalog by purchasing-power parity. FX-drift alerts on volatile currencies.',
    url: '/tools/ppp-fx-localizer',
    status: 'coming-soon',
    license: 'mit',
    workflows: ['pricing-localization'],
    regions: ['global', 'turkey'],
    qyrenTake:
      'Built with Turkish studios in mind. Lira-proof your ladder, then lock the rest of your global price ladder against PPP drift.',
    sortPriority: 0,
  },
  {
    slug: 'kenn-app-store-pricing-matrix',
    kind: 'curated',
    name: 'kenn/app_store_pricing_matrix',
    description: "Reference table of Apple's price tiers across all currencies, parsed from App Store Connect.",
    url: 'https://github.com/kenn/app_store_pricing_matrix',
    license: 'mit',
    workflows: ['pricing-localization'],
    regions: ['global'],
    qyrenTake:
      "Useful when you're scripting price localization and need a static lookup. Less useful for live work. You'll be rebuilding the data yourself when Apple resets tiers.",
    sortPriority: 2,
  },
  {
    slug: 'fastlane-deliver',
    kind: 'curated',
    name: 'fastlane deliver',
    description: 'Ruby tool for uploading screenshots, metadata, and binaries to App Store Connect.',
    url: 'https://docs.fastlane.tools/actions/deliver/',
    license: 'mit',
    workflows: ['iap-catalog'],
    regions: ['global'],
    qyrenTake:
      'Best for app metadata and binary submission. The 10-year-old gap: it does not handle in-app purchase metadata. You will end up writing custom ASC API calls anyway.',
    sortPriority: 7,
  },
  {
    slug: 'dfabulich-node-asc-api',
    kind: 'curated',
    name: 'dfabulich/node-app-store-connect-api',
    description: 'Modern Node.js client for the App Store Connect API with built-in JWT signing.',
    url: 'https://github.com/dfabulich/node-app-store-connect-api',
    license: 'mit',
    workflows: ['iap-catalog', 'pricing-localization'],
    regions: ['global'],
    qyrenTake:
      'Best Node entry point for ASC. Thin, well-typed, no opinions. You still write your own bulk logic on top.',
    sortPriority: 5,
  },
  {
    slug: 'homa-skan-conversion-schema',
    kind: 'curated',
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
    kind: 'curated',
    name: 'PostHog OSS',
    description: 'Self-hostable open-source product analytics with feature flags and session replay.',
    url: 'https://posthog.com',
    license: 'mit',
    workflows: ['analytics-telemetry', 'ab-testing'],
    regions: ['global'],
    qyrenTake:
      'Best free product analytics if you can run Postgres and Kafka. Mobile SDKs are solid. F2P-specific metrics are not built in. You add them yourself.',
  },
  {
    slug: 'gameanalytics-free',
    kind: 'curated',
    name: 'GameAnalytics',
    description: 'F2P-specific analytics with cohort, LTV, and ARPDAU dashboards out of the box.',
    url: 'https://gameanalytics.com',
    license: 'free-saas',
    workflows: ['analytics-telemetry'],
    regions: ['global'],
    qyrenTake:
      'Free tier covers most studios under 100k MAU. Less flexible than a general-purpose tool like PostHog, but you do not have to model F2P concepts from scratch. The dashboards already speak DAU, ARPDAU, D1, D7, and the SDK ships defaults that match.',
  },
  {
    slug: 'evan-miller-ab-calculator',
    kind: 'curated',
    name: 'Evan Miller A/B calculator',
    description: 'Browser-based statistical significance calculator. Reference standard.',
    url: 'https://www.evanmiller.org/ab-testing/',
    license: 'free-saas',
    workflows: ['ab-testing'],
    regions: ['global'],
    qyrenTake:
      'The reference. Sample size, sequential tests, chi-squared, survival. No login, no telemetry, just math. Bookmark it. Sanity-check every other calculator against it.',
  },
  {
    slug: 'eseufert-theseus-growth',
    kind: 'curated',
    name: 'ESeufert/theseus_growth',
    description: 'Python library for cohort LTV modeling that fits curves to cohort revenue and projects forward.',
    url: 'https://github.com/ESeufert/theseus_growth',
    license: 'mit',
    workflows: ['economy-cohort'],
    regions: ['global'],
    qyrenTake:
      "Eric Seufert's library, the de-facto standard for indie F2P LTV work. Pairs with his published spreadsheet templates if you would rather not write Python. If you are doing serious cohort projection, start here before reinventing the curve-fit.",
  },
  {
    slug: 'firebase-remote-config',
    kind: 'curated',
    name: 'Firebase Remote Config + A/B',
    description: "Google's hosted feature flag and experiment platform integrated with Firebase.",
    url: 'https://firebase.google.com/docs/remote-config',
    license: 'free-tier',
    workflows: ['liveops', 'ab-testing'],
    regions: ['global'],
    qyrenTake:
      'Default for most studios already on Firebase. Stats engine is fine, not great. Lock-in is real once you wire it deep into game config.',
  },
  {
    slug: 'appinchina-game-license-db',
    kind: 'curated',
    name: 'AppInChina Game License Database',
    description: 'Searchable English-language database of Chinese game license (版号 / ISBN) approvals since 2009.',
    url: 'https://game-licenses.appinchina.co/',
    license: 'free-saas',
    workflows: ['compliance'],
    regions: ['china'],
    qyrenTake:
      "Useful for due diligence on Chinese partner publishers and tracking 版号 issuance volumes by quarter. Does not help you get a license. For that you need a Chinese publishing partner with NPPA standing.",
  },
  {
    slug: 'liftosaur-update-apple-prices',
    kind: 'curated',
    name: 'Liftosaur update_apple_prices.js',
    description: 'Single-file Node script for PPP-localized Apple price updates across 170+ countries.',
    url: 'https://gist.github.com/astashov/79dd4ef4e91ea012710145623bfe0984',
    license: 'mit',
    workflows: ['iap-catalog', 'pricing-localization'],
    regions: ['global'],
    qyrenTake:
      "A working pattern, not a product. JWT signing and price-point assignment logic worth lifting. Pair with the companion Google Play gist and the author's blog post for full context.",
    sortPriority: 1,
  },
  {
    slug: 'ponytech-python-asc-api',
    kind: 'curated',
    name: 'Ponytech/appstoreconnectapi',
    description: 'Python wrapper for the App Store Connect API.',
    url: 'https://github.com/Ponytech/appstoreconnectapi',
    license: 'mit',
    workflows: ['iap-catalog', 'pricing-localization'],
    regions: ['global'],
    qyrenTake:
      'The Python counterpart to dfabulich/node-app-store-connect-api. Reach for it when your stack already lives in Python. Pagination and rate-limit handling are your problem.',
    sortPriority: 6,
  },
  {
    slug: 'amowu-app-store-pricing-matrix',
    kind: 'curated',
    name: 'amowu/app-store-pricing-matrix',
    description: 'Apple price tier matrix dumped as JSON.',
    url: 'https://github.com/amowu/app-store-pricing-matrix',
    license: 'mit',
    workflows: ['pricing-localization', 'iap-catalog'],
    regions: ['global'],
    qyrenTake:
      "JSON alternate to kenn's Ruby version. Cross-check both when you suspect tier drift before pushing a global price change.",
    sortPriority: 3,
  },
  {
    slug: 'unity-iap-catalog-csv',
    kind: 'curated',
    name: 'Unity IAP Catalog CSV export',
    description: "Unity's built-in CSV export of the IAP catalog.",
    url: 'https://docs.unity3d.com/Packages/com.unity.purchasing@latest',
    license: 'free-tier',
    workflows: ['iap-catalog'],
    regions: ['global'],
    qyrenTake:
      'Useful for snapshotting and audit. Not a bulk-edit-back surface. Treat the export as read-only and apply changes via store APIs.',
    sortPriority: 9,
  },
  {
    slug: 'playfab-economy-v2-batch',
    kind: 'curated',
    name: 'PlayFab Economy v2 batch ops',
    description: 'Microsoft PlayFab admin endpoints for catalog batch ops.',
    url: 'https://learn.microsoft.com/en-us/gaming/playfab/features/economy-v2/',
    license: 'free-tier',
    workflows: ['iap-catalog', 'economy-cohort'],
    regions: ['global'],
    qyrenTake:
      'Real bulk surface if you already live in PlayFab. Migration cost from a non-PlayFab stack is rarely worth it just for catalog ops.',
    sortPriority: 8,
  },
  {
    slug: 'statsig-ab-calculator',
    kind: 'curated',
    name: 'Statsig A/B calculator',
    description: 'Browser-based A/B test significance calculator from Statsig.',
    url: 'https://www.statsig.com/calculator/sample-size',
    license: 'free-saas',
    workflows: ['ab-testing'],
    regions: ['global'],
    qyrenTake:
      'Clean defaults, trustworthy math, fastest path to a sanity check. Does not handle whale-skewed revenue tails or sequential testing.',
  },
  {
    slug: 'growthbook',
    kind: 'curated',
    name: 'GrowthBook',
    description: 'Open-source feature flag and experiment platform.',
    url: 'https://www.growthbook.io/',
    license: 'mit',
    workflows: ['ab-testing', 'liveops'],
    regions: ['global'],
    qyrenTake:
      'Self-hostable LaunchDarkly alternative with Bayesian stats by default. Setup cost is real. Worth it once you have more than two concurrent experiments.',
  },
  {
    slug: 'avo-tracking-plan',
    kind: 'curated',
    name: 'Avo (free tier)',
    description: 'Schema-managed analytics tracking plan platform.',
    url: 'https://www.avo.app/',
    license: 'free-tier',
    workflows: ['analytics-telemetry'],
    regions: ['global'],
    qyrenTake:
      'Best free tier for taming analytics drift across product and engineering. Ceiling hits fast on mid-size studios. Plan for the upgrade.',
  },
  {
    slug: 'balancy',
    kind: 'curated',
    name: 'Balancy',
    description: 'F2P-native LiveOps and game economy configuration tool.',
    url: 'https://balancy.co/',
    license: 'free-tier',
    workflows: ['liveops', 'economy-cohort'],
    regions: ['global'],
    qyrenTake:
      'Config-as-code built for F2P. Strong for offer rollouts and pricing experiments. Lock-in risk is real. Price the exit before you commit.',
  },
  {
    slug: 'thinkingdata-sdks',
    kind: 'curated',
    name: 'ThinkingData SDKs',
    description: 'Chinese-market game analytics SDK suite.',
    url: 'https://www.thinkingdata.cn/',
    license: 'free-tier',
    workflows: ['analytics-telemetry'],
    regions: ['china'],
    qyrenTake:
      'Default analytics in the Chinese cohort. SDKs ship Chinese-first. Integrate via the Gitee mirrors for reliable pulls from outside China.',
  },
  {
    slug: 'iyzipay-sdks',
    kind: 'curated',
    name: 'iyzipay SDKs',
    description: 'Turkish payments gateway with SDKs in 10+ languages.',
    url: 'https://github.com/iyzico',
    license: 'apache-2.0',
    workflows: ['compliance', 'pricing-localization'],
    regions: ['turkey'],
    qyrenTake:
      'Owns Turkish card processing for non-store flows. SDKs are Apache-2.0; the gateway itself is paid with a free tier. Read the AML docs first.',
    sortPriority: 10,
  },
  {
    slug: 'mobidictum',
    kind: 'curated',
    name: 'Mobidictum',
    description: 'Turkish game industry editorial and event hub.',
    url: 'https://mobidictum.com/',
    license: 'free-saas',
    workflows: ['compliance'],
    regions: ['turkey'],
    qyrenTake:
      'Read it weekly if Turkey is in your roadmap. Partnership and visibility lane for Turkish-market launches, not a code dependency.',
  },
  {
    slug: 'google-play-publisher-api',
    kind: 'curated',
    name: 'Google Play Developer Publisher API',
    description: "Google's official REST API for managing Play Store apps and IAP catalogs.",
    url: 'https://developers.google.com/android-publisher',
    license: 'free-saas',
    workflows: ['iap-catalog', 'pricing-localization'],
    regions: ['global'],
    qyrenTake:
      'Cleaner than ASC. One API call updates subscription pricing across all 170+ countries. Service account auth is straightforward. Where Apple makes you suffer, Google does not.',
    sortPriority: 4,
  },
  {
    slug: 'amazon-appstore-iap-csv',
    kind: 'curated',
    name: 'Amazon Appstore IAP batch CSV',
    description: "Amazon's bulk CSV upload format for IAP catalog management.",
    url: 'https://developer.amazon.com/docs/in-app-purchasing/iap-batch-import.html',
    license: 'free-saas',
    workflows: ['iap-catalog'],
    regions: ['global'],
    qyrenTake:
      "Functional, ugly. Amazon's surface is small enough that nobody automates it. Hand-edit the CSV and move on. Worth knowing exists if you ship Fire tablet or Kindle.",
    sortPriority: 20,
  },
  {
    slug: 'unity-udp-bulk-import',
    kind: 'curated',
    name: 'Unity UDP Bulk IAP Import',
    description: 'Unity Distribution Portal bulk IAP import for multi-store Android publishing.',
    url: 'https://docs.unity.com/udp/manual/UDPBulkImport.html',
    license: 'free-saas',
    workflows: ['iap-catalog'],
    regions: ['global'],
    qyrenTake:
      'Helpful if you publish to Chinese Android stores via UDP. Otherwise overkill. The store coverage is the value, not the tool.',
    sortPriority: 21,
  },
  {
    slug: 'sensors-data-sdks',
    kind: 'curated',
    name: 'Sensors Data SDKs',
    description: 'Chinese-market product analytics SDK suite with full-stack event tracking.',
    url: 'https://www.sensorsdata.cn/',
    license: 'free-tier',
    workflows: ['analytics-telemetry'],
    regions: ['china'],
    qyrenTake:
      "ThinkingData's main competitor. Stronger for cross-platform product analytics, weaker for game-specific metrics. Pick one or the other, not both.",
  },
  {
    slug: 'topon-mediation',
    kind: 'curated',
    name: 'TopOn',
    description: 'Chinese ad mediation platform with full Chinese ad network coverage.',
    url: 'https://www.toponad.com/en',
    license: 'free-saas',
    workflows: ['liveops'],
    regions: ['china'],
    qyrenTake:
      'Mediation platform built for the Chinese ad network landscape. Use it if your Chinese global cohort needs Pangle, Tencent, and Mintegral in one waterfall.',
  },
  {
    slug: 'tradplus-mediation',
    kind: 'curated',
    name: 'TradPlus',
    description: 'Cross-platform ad mediation with strong Chinese network integrations.',
    url: 'https://www.tradplus.com/',
    license: 'free-saas',
    workflows: ['liveops'],
    regions: ['china'],
    qyrenTake:
      "TopOn's nearest competitor. Functionally similar at the SDK level. Pick by which Chinese networks you need first-class support for.",
  },
  {
    slug: 'pangle-sdk',
    kind: 'curated',
    name: 'Pangle SDK',
    description: "ByteDance's ad network SDK, the dominant Chinese ad supply source.",
    url: 'https://www.pangleglobal.com/',
    license: 'free-saas',
    workflows: ['liveops'],
    regions: ['china'],
    qyrenTake:
      'Largest non-Google, non-Meta ad supply globally for casual games. Mandatory in your mediation stack if you ship in Asia. Privacy review required for Western markets.',
  },
  {
    slug: 'taptap-sdk',
    kind: 'curated',
    name: 'TapTap SDK',
    description: 'Chinese alternative app store with the largest non-WeChat gamer community.',
    url: 'https://www.taptap.io/',
    license: 'free-saas',
    workflows: ['liveops'],
    regions: ['china'],
    qyrenTake:
      'Where Chinese gamers discover non-Tencent titles. International TapTap.io now serves global indies. Worth integrating if your audience overlaps.',
  },
  {
    slug: 'airbridge-mmp',
    kind: 'curated',
    name: 'Airbridge',
    description: 'Korean-built MMP with cross-platform attribution including PC and console.',
    url: 'https://www.airbridge.io/',
    license: 'free-tier',
    workflows: ['skan-attribution'],
    regions: ['korea'],
    qyrenTake:
      'AppsFlyer alternative with stronger PC/console support. Default MMP among Korean studios. Free tier covers 15K attributed installs, useful for early-stage validation.',
  },
  {
    slug: 'tamatem-plus',
    kind: 'curated',
    name: 'Tamatem Plus',
    description: 'MENA payments and distribution platform with 45+ local payment methods.',
    url: 'https://tamatem.co/',
    license: 'free-tier',
    workflows: ['pricing-localization', 'compliance'],
    regions: ['mena'],
    qyrenTake:
      "Single API for direct carrier billing and e-wallets across Saudi, Egypt, Iraq, Jordan. The only credible non-store rail for the region's underbanked majority.",
    sortPriority: 11,
  },
]
