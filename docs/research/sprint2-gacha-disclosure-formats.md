# Sprint 2 Section A5 Research: Gacha Disclosure Block Formats

**Artifact**: `docs/research/sprint2-gacha-disclosure-formats.md`
**Status**: V1 template skeletons derived from regulatory analysis plus published industry precedents, as of 2026-05-08
**Owner**: Ramesh
**Sister artifact**: `docs/research/sprint2-gacha-disclosure-data.md` (regulatory facts and validation rule set)
**Refresh trigger**: any of (HoYoverse or Cygames revises their published precedent, regulator publishes new format guidance, Section C2 native-speaker review surfaces format gaps)

---

## Scope and method

This artifact derives per-region V1 template skeletons that Section B (Tool UI build) generates against. The skeletons are format hypotheses grounded in two sources:

1. **Regulatory analysis** from the data artifact (`sprint2-gacha-disclosure-data.md`): what each regime mandates by statute, self-regulation, or platform policy
2. **Published industry precedents** from the convention-setters in each region: HoYoverse for Korea and global formats, Cygames for Japan, mainland-licensed games for China, App Store listings for Western

The hands-on visual collection of the 36-game sample sketched in §A5 of the Sprint 2 doc is a separate workstream. That collection refines the skeletons during Section C2 native-speaker review or after V1 launch when real studio rate sheets surface format gaps. It is not gating for Section B build start.

The convention-setters approach is appropriate because format conventions are highly homogeneous within a region: every Korean gacha game effectively copies the Genshin KR format because it became the post-2024-GIPA reference, every Japanese game copies the Cygames post-2016 format, every mainland-licensed game copies the layout patterns Tencent and miHoYo established under MIIT review. A V1 template that hits the convention-setter shape will be familiar to Korean, Japanese, Chinese, and Western players, and will satisfy each region's regulatory floor.

---

## Convention summaries by region

### Korea convention (derived from HoYoverse Korean disclosures plus GIPA Article 33 analysis)

The Korean convention is the most detailed of the four because GIPA and the August 2025 punitive damages amendment force per-item granularity plus auditable provenance.

Format conventions:

- **Disclosure surface**: in-game wish/banner UI (mandatory per Article 33), with redundant publication on the publisher's official website
- **Aggregation level**: per-rarity-tier base rate AND per-item breakdown within each tier. Just per-tier is insufficient; just per-item without the tier aggregate is harder to read but technically compliant
- **Numerical convention**: percentage with 3-4 decimal places (X.XXX% or X.XX%); HoYoverse uses 4dp for sub-1% items
- **Pity disclosure**: mandatory in practice. The HoYoverse format explicitly states the 90-pull hard pity for 5★ characters and the 9-pull hard pity for 4★ items, with an explanation that soft-pity ramps between pulls 74 and 89
- **Guarantee mechanic**: the 50/50 promotional-character guarantee plus the "Capturing Radiance" consolidated rate (55% effective rate after the mechanic) is disclosed as a separate paragraph
- **Banner-level**: per-banner block, with banner name and active period dated explicitly
- **Language**: Korean for the KR market, with a parallel English block on the global publisher site
- **Versioning**: each banner's drop rate notice is dated with the banner active period; archived for historical reference

Compliance reality: the GRAC December 2025 Case Studies document reportedly flags publishers who disclose "X or less" while internally setting "less than X" as enforcement-precedent violations. The Korean format must use exact language matching the rate sheet (no rounding-induced phrasing differences between disclosure and game logic).

### Japan convention (derived from Cygames post-2016 standard and HoYoverse JP)

The Cygames format became the de facto industry standard after the March 2016 Anchira incident. Most major Japanese publishers adopted variants of it within 18 months.

Format conventions:

- **Disclosure surface**: in-game gacha banner UI with a dedicated probability button. Cygames removed gacha history from the user-facing UI in 2016 (separate compliance choice; not relevant to the Pack)
- **Aggregation level**: per-rarity aggregate at the top of the block, then full per-item breakdown by rarity. JOGA/CESA self-regulation explicitly requires per-item, not just aggregate
- **Numerical convention**: percentage with 3-4 decimal places, often shown as fractions for very-low-probability items (e.g., "0.150% (3/2000)")
- **Rate-up disclosure**: when a banner has rate-up characters, the rate-up percentage is disclosed both as the new probability AND as the multiple of the base rate
- **Pity / spark mechanic**: the 300-pull spark/ceiling system is industry standard at ~90,000 yen (~USD $600) per banner. Players exchange 300 banner-period pulls for a guaranteed featured item. The spark mechanism and its threshold are disclosed in plain language
- **Banner-level**: per-banner block, dated with banner active period
- **Language**: Japanese
- **Versioning**: each banner has a fresh disclosure block; historical blocks archived on publisher website

Special case: kompu gacha is illegal under the Unfair Premium Act. The Japanese template must not include any combination/multi-step structure that requires assembling randomized items to obtain a final reward. This is a hard fail at the validation layer (validator JP3 in the data artifact §A6).

### China convention (derived from mainland-licensed games and 2017 MIIT framework)

The Chinese convention diverges from Korea and Japan in two structural ways: it allows website-only disclosure (not in-game), and it requires operational disclosures that go beyond static probabilities.

Format conventions:

- **Disclosure surface**: in-game on the loot box purchase page OR on the game's official website (publisher's choice). Most mainland-licensed games choose the website surface because it lets them centralize updates
- **Aggregation level**: per-item probability is mandatory; per-rarity aggregate often included but not strictly required
- **Numerical convention**: percentage with 2-4 decimal places. Tencent and miHoYo typically use 4dp for sub-1% items
- **Per-banner disclosure**: required. A single game-level disclosure does not satisfy the rule when the game has multiple banners with different rates
- **Daily cap statement**: required per the MIIT 30/3/50 rule. The block states the daily limits (30 single boxes, 3 ten-pulls, 50 total per player per day)
- **90-day outcome history pointer**: required. The block links to or describes the location of the publicly-available 90-day outcome history. The Pack does not generate this history (it is server-side runtime state), but the block must reference where it lives
- **Alternative-acquisition statement**: items obtainable only through gacha must be flagged; items with non-gacha paths state those paths (in-game shop, event reward, log-in bonus)
- **Currency rule reminder**: the block notes that the loot box itself is not directly purchased with currency in mainland-licensed games; access is granted as a "free bonus" alongside currency purchases (the standard workaround)
- **Banner-level**: per-banner block, dated with banner active period
- **Language**: Simplified Chinese (Simplified Han characters)
- **Versioning**: each banner has a dated block

Compliance reality: empirical research (Xiao & Henderson, Cambridge 2021) found surface-level compliance was near-perfect across the top 100 mainland-licensed iPhone games, but only five of those games used what researchers identified as the "most prominent disclosure format." UX prominence is regulator-attention-attracting territory; the Pack's CN block should aim for the prominent format, not the buried-link minimum.

### Western convention (Apple App Store and Google Play floor)

The Western convention is the simplest of the four because Apple and Google converge on a single rule: per-item odds disclosed prior to purchase, no specific format mandate.

Format conventions:

- **Disclosure surface**: in-game gacha banner UI prior to purchase OR App Store/Google Play listing description. Most studios place a brief block in the App Store listing AND a fuller version in-game
- **Aggregation level**: per-item probability is required; per-rarity aggregate is common practice but not mandated
- **Numerical convention**: percentage with 2-3 decimal places. Western players are less calibrated to 4dp precision and over-precision can read as obfuscation
- **Pity / guarantee disclosure**: not platform-mandated but increasingly expected by Western audiences. Apple's Guideline 3.1.1 does not require pity-mechanism disclosure, but FTC enforcement (Genshin Impact $20M settlement in 2025) has set precedent that misleading representation of probability outcomes (which can include hidden pity) is actionable
- **Banner-level**: per-banner if the game has multiple, otherwise game-level acceptable
- **Language**: English is the floor; localization to other Western languages (DE, FR, ES, IT, PT-BR) is encouraged but not platform-mandated
- **Versioning**: dated block when banner-specific; static block when game-level

The Western block is the lightest-weight of the four. It often lives in the App Store listing as a short paragraph plus a link to the full in-game disclosure. The Pack's English block can serve as the in-game-disclosure-quality artifact that Western studios use both in-game and as the source for the App Store listing copy.

---

## Cross-region unifications and divergences

Three conventions hold across all four regions and can be unified in the rate-sheet schema:

1. **Per-item probability is the floor everywhere**. No region accepts pure rarity-tier aggregates as the minimum; per-item is required by Korea's GIPA, Japan's CESA/JOGA, China's MIIT, and Apple/Google policy
2. **Banner active period is dated explicitly** wherever banners are time-limited
3. **Numerical convention is percentage** with 2-4 decimal places of precision

Three conventions diverge meaningfully and require region-specific output blocks rather than a single unified block:

1. **Disclosure surface flexibility**: China alone permits website-only disclosure; Korea and Japan require in-game; Western accepts either or both
2. **Operational requirements beyond probabilities**: only China requires daily-cap statements and 90-day history pointers; Korea requires pity-threshold disclosure for Article 33 compliance; Japan and Western do not mandate operational disclosures
3. **Language requirement**: Korea requires Korean for KR market, Japan requires Japanese, China requires Simplified Chinese, Western accepts English. Single-language disclosure does not satisfy multi-region launch

The Pack must generate a separate region-specific block per targeted region rather than a single unified block. This is structurally consistent with the §A6 validation rule set (region-specific validators) and the Section B output flow (per-region disclosure block previews and ZIP exports).

---

## V1 template skeletons

These are the templates Section B generates against. Each skeleton specifies structure, mandatory fields, and conditional fields; actual styling and copy land during Section C2 native-speaker review.

### Korea V1 template skeleton

```
[KOREAN-LANGUAGE TITLE: e.g., "확률형 아이템 정보 공시"]
Banner name (Korean): {banner_name_ko}
Banner active period: {banner_start} to {banner_end}
Last updated: {generated_at}

[Section 1: Per-rarity aggregate rates]
5★ 캐릭터: {tier_5_char_aggregate}%
5★ 무기: {tier_5_weapon_aggregate}% (if weapon banner)
4★ 캐릭터/무기: {tier_4_aggregate}%
3★ 무기: {tier_3_aggregate}%

[Section 2: Per-item probability table]
| 등급 (Rarity) | 아이템 (Item) | 확률 (Probability) |
|---|---|---|
| 5★ | {item_name_ko_1} | {probability_1}% |
| 5★ | {item_name_ko_2} | {probability_2}% |
| ... | ... | ... |

[Section 3: Pity threshold disclosure (if applicable)]
- 5★ 확정: 90회 소환 시 5★ 아이템 획득 보장
- 소프트 천장: 74회부터 5★ 확률 점진적 증가
- 4★ 확정: 10회 소환 시 4★ 이상 획득 보장
- 50/50 시스템: 5★ 획득 시 50% 확률로 한정 캐릭터 획득; 비한정 획득 시 다음 5★는 확정 한정

[Section 4: Guarantee mechanic (if applicable, e.g., Capturing Radiance)]
{Plain-language explanation of any consolidated-rate guarantee mechanic}

[Footer]
운영자: {operator_name}
국내 대리인: {domestic_agent_name} (per October 2025 amendment, required for overseas operators)
공시 발행일: {generated_at}
도구 버전: Qyren Gacha Disclosure Pack v{tool_version}
공시 해시: {block_hash}

[Disclaimer]
본 공시는 게임산업진흥에 관한 법률 제33조 및 제33-2조에 따른 확률 정보 공시입니다. 운영자는 공시된 확률과 실제 게임 내 확률의 일치를 보장합니다.
```

Mandatory fields: banner name, period, all rarity aggregates, full per-item table, generated_at timestamp, operator name, domestic agent name (for overseas operators), block hash.
Conditional fields: pity, soft-pity, guarantee mechanic (only if rate sheet declares them).

### Japan V1 template skeleton

```
[JAPANESE-LANGUAGE TITLE: e.g., "ガチャ提供割合"]
Banner name (Japanese): {banner_name_ja}
Banner active period: {banner_start} to {banner_end}
Last updated: {generated_at}

[Section 1: Per-rarity aggregate rates]
SSR キャラクター: {tier_ssr_char_aggregate}%
SSR 武器: {tier_ssr_weapon_aggregate}% (if weapon banner)
SR キャラクター/武器: {tier_sr_aggregate}%
R: {tier_r_aggregate}%

[Section 2: Per-item probability table]
| レアリティ (Rarity) | アイテム (Item) | 確率 (Probability) |
|---|---|---|
| SSR | {item_name_ja_1} | {probability_1}% |
| SSR | {item_name_ja_2} | {probability_2}% |
| ... | ... | ... |

[Section 3: Rate-up disclosure (if applicable)]
ピックアップ対象: {rate_up_items_ja}
ピックアップ確率: {rate_up_probabilities}% (通常確率の{multiplier}倍)

[Section 4: Spark/ceiling mechanic (if applicable)]
{Plain-language explanation of the spark mechanism}
- 累計300回ガチャで対象アイテム1個と交換可能
- 開催期間中の累計回数が対象 (banner-period scope)

[Footer]
運営: {operator_name_ja}
公開日: {generated_at}
ツールバージョン: Qyren Gacha Disclosure Pack v{tool_version}
公示ハッシュ: {block_hash}

[Disclaimer]
本表示はJOGA・CESAガイドラインに基づく確率情報の開示です。運営は表示された確率と実際の確率の一致を保証します。
```

Mandatory fields: banner name, period, rarity aggregates, per-item table, generated_at, operator, hash.
Conditional fields: rate-up disclosure, spark/ceiling.
Hard fail: if the rate sheet has a kompu-gacha-shaped structure, the JP block is not generated and the validator returns a fail with explanation.

### China V1 template skeleton

```
[SIMPLIFIED-CHINESE TITLE: e.g., "概率公示"]
游戏名称: {game_name_zh}
卡池名称: {banner_name_zh}
卡池开放时间: {banner_start} 至 {banner_end}
公示发布时间: {generated_at}

[Section 1: Per-rarity aggregate rates]
五星概率: {tier_5_aggregate}%
四星概率: {tier_4_aggregate}%
三星概率: {tier_3_aggregate}%

[Section 2: Per-item probability table]
| 稀有度 (Rarity) | 物品 (Item) | 概率 (Probability) |
|---|---|---|
| 五星 | {item_name_zh_1} | {probability_1}% |
| 五星 | {item_name_zh_2} | {probability_2}% |
| ... | ... | ... |

[Section 3: Daily caps (per MIIT regulation)]
- 每日单抽次数上限: 30次
- 每日十连次数上限: 3次
- 每日累计抽卡上限: 50次

[Section 4: 90-day outcome history pointer]
玩家90天内抽卡历史可在以下位置查询: {outcome_history_url_or_in_game_path}

[Section 5: Alternative acquisition (per item)]
| 物品 (Item) | 卡池外获取途径 (Non-gacha path) |
|---|---|
| {item_name_zh_1} | {alt_path_1} (e.g., "活动奖励", "商城购买", "无") |
| ... | ... |

[Footer]
运营方: {operator_name_zh}
公示发布时间: {generated_at}
工具版本: Qyren Gacha Disclosure Pack v{tool_version}
公示哈希: {block_hash}

[Disclaimer]
本公示符合文化部《关于规范网络游戏运营加强事中事后监管工作的通知》(2016)关于概率公示的要求。运营方对公示概率与实际游戏内概率的一致性负责。
```

Mandatory fields: game name, banner name, period, rarity aggregates, per-item table, daily caps statement (literal MIIT values), 90-day history pointer, alternative-acquisition table, generated_at, operator, hash.
Conditional fields: none (the MIIT operational requirements are uniform across mainland-licensed games).

### Western (Apple/Google) V1 template skeleton

```
TITLE: Drop Rate Disclosure
Game: {game_name_en}
Banner: {banner_name_en}
Active period: {banner_start} to {banner_end}
Last updated: {generated_at}

[Section 1: Per-rarity aggregate rates]
- 5★ items: {tier_5_aggregate}%
- 4★ items: {tier_4_aggregate}%
- 3★ items: {tier_3_aggregate}%

[Section 2: Per-item probability table]
| Rarity | Item | Probability |
|---|---|---|
| 5★ | {item_name_en_1} | {probability_1}% |
| 5★ | {item_name_en_2} | {probability_2}% |
| ... | ... | ... |

[Section 3: Pity and guarantees (if applicable)]
{Plain-language summary of any pity, soft-pity, hard-pity, or guarantee mechanic}

[Footer]
Operator: {operator_name_en}
Published: {generated_at}
Tool version: Qyren Gacha Disclosure Pack v{tool_version}
Disclosure hash: {block_hash}

[Disclaimer]
This disclosure satisfies Apple App Store Review Guideline 3.1.1 and Google Play Developer Policy on randomized virtual items. The operator certifies that disclosed probabilities match in-game outcomes.
```

Mandatory fields: game name, banner name, period, rarity aggregates, per-item table, generated_at, operator, hash.
Conditional fields: pity disclosure (recommended where the rate sheet declares pity, even though Apple/Google do not strictly require it; FTC precedent makes the disclosure prudent).

### Turkish V1 template skeleton (optional, for studios disclosing in TR storefronts)

```
BAŞLIK: Çekiliş Olasılık Bildirimi
Oyun: {game_name_tr}
Banner: {banner_name_tr}
Aktif dönem: {banner_start} – {banner_end}
Son güncelleme: {generated_at}

[Section 1: Per-rarity aggregate rates]
- 5★ ögeler: {tier_5_aggregate}%
- 4★ ögeler: {tier_4_aggregate}%
- 3★ ögeler: {tier_3_aggregate}%

[Section 2: Per-item probability table]
| Nadirlik | Öge | Olasılık |
|---|---|---|
| 5★ | {item_name_tr_1} | {probability_1}% |
| ... | ... | ... |

[Section 3: Acıma ve garanti mekanikleri (if applicable)]
{Plain-language summary in Turkish}

[Footer]
Operatör: {operator_name_tr}
Yayın tarihi: {generated_at}
Araç versiyonu: Qyren Gacha Disclosure Pack v{tool_version}
Bildirim hash: {block_hash}

[Disclaimer]
Bu bildirim Apple App Store ve Google Play politikalarına uygundur. Operatör, açıklanan olasılıkların oyun içi sonuçlarla eşleştiğini onaylar.
```

The Turkish template is structurally identical to the English template with translated copy. Turkey has no domestic gacha-disclosure regulation; the TR block exists for studios that want a Turkish-language version of the Apple/Google-floor disclosure for their Turkish storefront listing.

---

## Format-collection coverage status

This artifact derives skeletons from convention-setter precedents and regulatory analysis. Hands-on visual collection is partial:

**Confirmed via published industry precedent**:
- Korea: HoYoverse Korean disclosures (Genshin Impact KR, Honkai Star Rail KR), pity and guarantee mechanics fully documented
- Japan: Cygames post-2016 standard (Granblue Fantasy, Princess Connect Re:Dive, Uma Musume Pretty Derby)
- Western: Apple App Store Review Guideline 3.1.1 text, Google Play Developer Policy

**Confirmed via academic literature**:
- China: Xiao & Henderson 2021 Cambridge paper covering 100 highest-grossing PRC iPhone games; the format conventions documented there inform the §A2 derivation

**Partial / hypothesis-pending**:
- Korean-native game format quirks (Lineage W, Blue Archive KR, Nexon-published Korean MMORPGs) may differ from HoYoverse format in tier nomenclature or pity-mechanic disclosure detail; native-speaker review during Section C2 should validate
- Japanese non-Cygames format quirks (Aniplex's FGO, Mixi's Monster Strike) may differ in spark mechanism detail; same review path
- Mainland Chinese 90-day-history surface conventions vary by publisher; Tencent vs miHoYo vs NetEase use different UI patterns. The Pack references the URL/path the studio provides; the Pack does not prescribe the surface

**Long-tail hands-on items** (deferred to CC session or post-launch refinement):
- Visual screenshot collection of all 36 sampled games' actual in-game disclosure UIs
- Per-region UI layout patterns (table vs paragraph vs image-rendered)
- Color and accessibility conventions
- Mobile vs desktop rendering patterns

The long-tail items refine layout and presentation. They do not change the structural skeletons above. Section B can ship V1 against these skeletons; Section C2 native-speaker review catches the convention-quirks; post-launch refinement (V1.1) absorbs whatever real studio rate sheets surface.

---

## What Section B receives from this artifact

Section B (Tool UI build) receives:

1. **Five region-specific template skeletons** with mandatory and conditional fields enumerated
2. **Region-specific copy disclaimers** (the regulatory-grounding boilerplate at the bottom of each block)
3. **Cross-region unification rules** for the rate-sheet schema (per-item probability, banner-period dating, percentage convention)
4. **Hard-fail rules** (Japan kompu-gacha structure check)
5. **Conditional-field triggers** (pity, soft-pity, hard-pity, rate-up, spark, guarantee mechanic, alternative-acquisition path)

Section B implementation strategy:

- Templates live as Handlebars-style or Liquid-style files in `templates/gacha-disclosure/{ko,ja,zh-Hans,en,tr}.html` (per the Sprint 2 doc §C1 path)
- The validation engine (§A6 validators) runs first; if validation passes, the template renderer fills the skeleton with rate-sheet data
- Conditional fields are gated by rate-sheet declarations (e.g., the pity section renders only if `pity_threshold > 0` for the pool)
- The audit-trail JSON (§A6 schema) hashes the rendered block, providing the `block_hash` field referenced in each footer

---

## Open hands-on collection items (long tail)

These items refine V1 templates over time. None are gating for Section B build start.

- [ ] Screenshot capture of in-game disclosure UIs across 36 sample games (KR 12, JP 10, CN 8, Western 6)
- [ ] Annotated comparison of HoYoverse vs Cygames vs Tencent vs Aniplex format choices
- [ ] Per-region disclosure-prominence assessment (matches Xiao academic methodology: how many taps from gacha banner to the disclosure surface?)
- [ ] Korean publisher format-quirk catalog (NCSOFT, Nexon, Smilegate, Netmarble vs HoYoverse Korea)
- [ ] Japanese publisher format-quirk catalog (Aniplex, Mixi, GungHo, Yostar vs Cygames)
- [ ] Mainland Chinese 90-day-history surface-pattern catalog (Tencent vs miHoYo vs NetEase)
- [ ] Western format-prominence assessment for App Store listing vs in-game placement

---

*End of Section A5 disclosure-format research artifact. Section B (Tool UI build) is unblocked from this artifact alone; the long-tail collection items refine the V1 templates over time but do not gate the build.*
