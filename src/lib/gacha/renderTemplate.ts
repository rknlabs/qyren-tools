import type { Pool, RateSheet, Region } from '../../types/gacha/rateSheet'
import type { FieldSources } from '../../types/gacha/fieldSource'
import koTemplate from './templates/ko.html?raw'
import jaTemplate from './templates/ja.html?raw'
import zhTemplate from './templates/zh-Hans.html?raw'
import enTemplate from './templates/en.html?raw'
import trTemplate from './templates/tr.html?raw'
import { suffixForRegion, TRANSLATABLE_FIELD_PREFIXES } from './fieldSources'

const TEMPLATES: Record<Region, string> = {
  KR: koTemplate,
  JP: jaTemplate,
  CN: zhTemplate,
  EN: enTemplate,
  TR: trTemplate,
}

// Per-region footnote rendered when at least one Game Details field used by
// this disclosure block is still source = auto_translated_unreviewed at
// export time. Wrapped in escapeHtml-safe static text; no untrusted input.
const TRANSLATION_FOOTNOTE: Record<Region, string> = {
  KR: '<div class="translation-footnote">참고: 본 공시의 일부는 기계 번역으로 생성되었습니다. 운영자는 모든 값이 해당 게임의 게시된 스토어 등재 정보와 일치함을 확인합니다.</div>',
  JP: '<div class="translation-footnote">注：本表示の一部は機械翻訳によって生成されました。運営者は、すべての値が該当するゲームの公開ストア情報と一致することを確認しています。</div>',
  CN: '<div class="translation-footnote">注：本公示部分内容由机器翻译生成。运营方确认所有数值与对应游戏在应用商店发布的信息一致。</div>',
  EN: '<div class="translation-footnote">Note: Portions of this disclosure were generated using machine translation. The operator confirms that all values match the corresponding game\'s published store listings.</div>',
  TR: '<div class="translation-footnote">Not: Bu bildirimin bir kısmı makine çevirisiyle oluşturulmuştur. Operatör, tüm değerlerin ilgili oyunun yayınlanan mağaza listesiyle eşleştiğini onaylar.</div>',
}

interface RenderOptions {
  toolVersion: string
  fieldSources?: FieldSources
}

export interface RenderedBlock {
  region: Region
  pool_id: string
  html: string
}

export function renderAllBlocks(
  rateSheet: RateSheet,
  regions: Region[],
  options: RenderOptions,
): RenderedBlock[] {
  const blocks: RenderedBlock[] = []
  for (const region of regions) {
    for (const pool of rateSheet.pools) {
      const html = renderPool(rateSheet, pool, region, options)
      blocks.push({ region, pool_id: pool.pool_id, html })
    }
  }
  return blocks
}

function renderPool(
  rateSheet: RateSheet,
  pool: Pool,
  region: Region,
  options: RenderOptions,
): string {
  const template = TEMPLATES[region]
  const fields = buildFieldMap(rateSheet, pool, region, options.toolVersion)
  fields.translation_footnote = hasUnreviewedTranslations(region, options.fieldSources)
    ? TRANSLATION_FOOTNOTE[region]
    : ''
  return interpolate(template, fields)
}

// True when at least one of this region's translatable Game Details fields
// (game_name, banner_name, operator_name) is still source =
// auto_translated_unreviewed. The user clicked auto-translate and never
// edited the result, so the disclosure block earns the footnote.
function hasUnreviewedTranslations(
  region: Region,
  fieldSources: FieldSources | undefined,
): boolean {
  if (!fieldSources) return false
  const suffix = suffixForRegion(region)
  for (const prefix of TRANSLATABLE_FIELD_PREFIXES) {
    const id = `${prefix}_${suffix}`
    if (fieldSources[id]?.source === 'auto_translated_unreviewed') return true
  }
  return false
}

function interpolate(template: string, fields: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => fields[key] ?? '')
}

function buildFieldMap(
  rateSheet: RateSheet,
  pool: Pool,
  region: Region,
  toolVersion: string,
): Record<string, string> {
  const meta = rateSheet.metadata
  const game = pickLocalized(
    region,
    meta.game_name_en,
    meta.game_name_ko,
    meta.game_name_ja,
    meta.game_name_zh_hans,
    meta.game_name_tr,
  )
  const operator = pickLocalized(
    region,
    meta.operator_name_en,
    meta.operator_name_ko,
    meta.operator_name_ja,
    meta.operator_name_zh_hans,
    meta.operator_name_tr,
  )
  const banner = pickLocalized(
    region,
    pool.banner_name_en ?? pool.banner_id ?? pool.pool_id,
    pool.banner_name_ko,
    pool.banner_name_ja,
    pool.banner_name_zh_hans,
    pool.banner_name_tr,
  )
  // En-dash separator between dates is acceptable typography. The fallback
  // here only fires when banner_period is missing; the form's required-state
  // gate prevents that on the happy path. Rendered as "(not set)" rather than
  // a dash per brand voice ban; honest signal beats decorative dash.
  const period = pool.banner_period
    ? `${pool.banner_period.start} – ${pool.banner_period.end}`
    : '(not set)'

  return {
    game_name: escapeHtml(game),
    operator_name: escapeHtml(operator),
    banner_name: escapeHtml(banner),
    banner_period: escapeHtml(period),
    generated_at: escapeHtml(meta.generated_at),
    tool_version: escapeHtml(toolVersion),
    rarity_aggregates: buildRarityAggregates(pool, region),
    item_rows: buildItemRows(pool, region),
    pity_section: buildPitySection(pool, region),
    guarantee_section: buildGuaranteeSection(pool, region),
    domestic_agent_line: buildDomesticAgentLine(meta.domestic_agent_name_ko),
    outcome_history: escapeHtml(
      meta.outcome_history_url ?? '运营商应在游戏内或官网提供 / Operator must provide',
    ),
    alt_acquisition_section: buildAltAcquisitionSection(pool),
  }
}

function pickLocalized(
  region: Region,
  en: string,
  ko?: string,
  ja?: string,
  zh?: string,
  tr?: string,
): string {
  switch (region) {
    case 'KR':
      return ko && ko.trim() ? ko : en
    case 'JP':
      return ja && ja.trim() ? ja : en
    case 'CN':
      return zh && zh.trim() ? zh : en
    case 'TR':
      return tr && tr.trim() ? tr : en
    default:
      return en
  }
}

function pickItemName(item: Pool['items'][number], region: Region): string {
  switch (region) {
    case 'KR':
      return item.name_ko ?? item.name_en
    case 'JP':
      return item.name_ja ?? item.name_en
    case 'CN':
      return item.name_zh_hans ?? item.name_en
    case 'TR':
      return item.name_tr ?? item.name_en
    default:
      return item.name_en
  }
}

function buildRarityAggregates(pool: Pool, region: Region): string {
  const byRarity = new Map<string, number>()
  for (const item of pool.items) {
    byRarity.set(item.item_rarity, (byRarity.get(item.item_rarity) ?? 0) + item.probability)
  }
  const labelByRegion: Record<Region, (rarity: string) => string> = {
    KR: (r) => `${r} 등급`,
    JP: (r) => `${r}`,
    CN: (r) => `${r}`,
    EN: (r) => `${r} items`,
    TR: (r) => `${r} ögeler`,
  }
  const rows: string[] = []
  for (const [rarity, total] of byRarity) {
    rows.push(
      `<li>${escapeHtml(labelByRegion[region](rarity))}: ${formatPercent(total)}</li>`,
    )
  }
  return rows.join('')
}

function buildItemRows(pool: Pool, region: Region): string {
  return pool.items
    .map(
      (item) =>
        `<tr><td>${escapeHtml(item.item_rarity)}</td><td>${escapeHtml(pickItemName(item, region))}</td><td class="right">${formatPercent(item.probability)}</td></tr>`,
    )
    .join('')
}

function buildPitySection(pool: Pool, region: Region): string {
  if (!pool.pity_threshold || pool.pity_threshold === 0) return ''
  const heading: Record<Region, string> = {
    KR: '천장 / 소프트 피티 정보',
    JP: '天井・ピティ機構',
    CN: '保底机制',
    EN: 'Pity and guarantees',
    TR: 'Acıma ve garanti mekanikleri',
  }
  const lines: Record<Region, (n: number, type?: string) => string> = {
    KR: (n, type) =>
      `${type === 'soft' ? '소프트 피티' : type === 'hard' ? '확정' : '피티'}: ${n}회 소환 시 보장`,
    JP: (n, type) =>
      `${type === 'soft' ? 'ソフト天井' : type === 'hard' ? '天井' : 'ピティ'}: ${n}回で確定`,
    CN: (n, type) =>
      `${type === 'soft' ? '软保底' : type === 'hard' ? '硬保底' : '保底'}: 累计 ${n} 抽必出`,
    EN: (n, type) =>
      `${type === 'soft' ? 'Soft pity' : type === 'hard' ? 'Hard pity' : 'Pity'} at ${n} pulls`,
    TR: (n, type) =>
      `${type === 'soft' ? 'Yumuşak acıma' : type === 'hard' ? 'Sert acıma' : 'Acıma'} ${n} çekilişte garanti`,
  }
  return `<h2>${escapeHtml(heading[region])}</h2><ul><li>${escapeHtml(lines[region](pool.pity_threshold, pool.pity_type))}</li></ul>`
}

function buildGuaranteeSection(pool: Pool, region: Region): string {
  if (!pool.guarantee_threshold) return ''
  const heading: Record<Region, string> = {
    KR: '확정 메커니즘',
    JP: '確定メカニズム',
    CN: '保证机制',
    EN: 'Guarantee mechanism',
    TR: 'Garanti mekanizması',
  }
  const lines: Record<Region, (n: number) => string> = {
    KR: (n) => `${n}회 누적 시 확정 보상`,
    JP: (n) => `累計${n}回で対象アイテムと交換可能`,
    CN: (n) => `累计 ${n} 次后必出对应奖励`,
    EN: (n) => `Cumulative ${n} pulls guarantees the featured reward`,
    TR: (n) => `${n} kümülatif çekilişte garanti ödül`,
  }
  return `<h2>${escapeHtml(heading[region])}</h2><ul><li>${escapeHtml(lines[region](pool.guarantee_threshold))}</li></ul>`
}

function buildDomesticAgentLine(agentName?: string): string {
  if (!agentName || agentName.trim() === '') return ''
  return `국내 대리인: ${escapeHtml(agentName)}<br />`
}

function buildAltAcquisitionSection(pool: Pool): string {
  const withAlt = pool.items.filter((i) => i.alternative_acquisition)
  if (withAlt.length === 0) return ''
  const rows = withAlt
    .map(
      (i) =>
        `<tr><td>${escapeHtml(i.name_zh_hans ?? i.name_en)}</td><td>${escapeHtml(i.alternative_acquisition ?? '')}</td></tr>`,
    )
    .join('')
  return `<h2>卡池外获取途径</h2><table><thead><tr><th>物品</th><th>获取途径</th></tr></thead><tbody>${rows}</tbody></table>`
}

function formatPercent(p: number): string {
  const pct = p * 100
  if (pct < 1) return `${pct.toFixed(4)}%`
  if (pct < 10) return `${pct.toFixed(3)}%`
  return `${pct.toFixed(2)}%`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
