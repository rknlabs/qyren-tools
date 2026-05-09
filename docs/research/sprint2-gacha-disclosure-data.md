# Sprint 2 Section A Research: Gacha Disclosure Data

**Artifact**: `docs/research/sprint2-gacha-disclosure-data.md`
**Status**: Initial draft, primary-source-grounded as of 2026-05-08
**Owner**: Ramesh
**Refresh trigger**: any of (Korean revenue-fine bill passes, Apple/Google policy text changes, China MIIT issues new notice, JOGA/CESA publishes revised guidelines, regulatory-status-as-of-date stamp ages past 90 days)
**Sister artifact**: `docs/research/sprint2-gacha-disclosure-formats.md` (visual format collection, separate document)

---

## Executive synthesis

Four regulatory regimes govern gacha probability disclosure for the markets the Pack targets. The shape, force, and operational depth differ sharply across them.

**Korea is the strongest force and the most recently moved.** Probability disclosure has been mandatory under the Game Industry Promotion Act (GIPA) since March 22, 2024. A January 2025 amendment introduced treble damages, reversed burden of proof, and a dedicated dispute resolution center; the punitive damages provisions took effect August 1, 2025. A separate amendment effective October 23, 2025 requires overseas operators meeting size thresholds to designate a Korean domestic representative who carries disclosure liability. A second pending bill from September 23, 2025 (Kim Seong-hoe amendment) would add revenue-based administrative fines of up to 3% of sales or KRW 1 billion, but as of February 2026 the Ministry of Culture, Sports and Tourism has urged caution and the bill has not passed. The Loot Box Victim Relief Center, operated by the Game Rating and Administration Committee (GRAC), opened February 27, 2026.

**China is the oldest force and the most operationally demanding.** Probability disclosure has been required since May 2017 under a Ministry of Culture notice (2016 publication, May 2017 effective). The rule's footprint extends well beyond a static disclosure block: rates must "reflect reality over time" (deterministic guarantees, e.g. a 10% rate must hit by ten pulls in aggregate), daily caps apply (no more than 30 single boxes, 3 ten-pull bundles, 50 boxes total per player per day), and a public 90-day outcome history must be available. Mainland-licensed games go through the National Press and Publication Administration (NPPA) approval; MIIT governs the privacy policy and ToS layer. Compliance is surface-level near-perfect across the top 100 mainland-licensed iPhone games but disclosure UX is widely buried, which has drawn academic and KFTC-equivalent attention.

**Japan is the longest-standing self-regulation regime with no statutory teeth on disclosure itself, but real platform and reputational teeth.** JOGA (Japan Online Games Association) and CESA (Computer Entertainment Supplier's Association) have issued probability disclosure guidelines since April 2016, following the 2012 kompu gacha ban and the 2016 Granblue Fantasy "rate-up lie" controversy. Disclosure is required per-item, not just per-rarity-tier, which is a stricter format requirement than Korea or China nominally demand. Kompu gacha (combination/complete gacha mechanics) is illegal under the Act against Unfair Premiums and Misleading Representations (the Unfair Premium Act). The Act also caps prize value at the lower of 20x transaction value or JPY 100,000.

**Western markets converge on a single rule shape: Apple App Store Review Guideline 3.1.1 (December 2017) and Google Play Developer Policy Monetization & Ads section (May 2019).** Both require per-item odds disclosure prior to purchase for any randomized-virtual-item mechanism. Apple's text covers loot boxes purchased with virtual currency once that virtual currency was bought with real money (clarified through developer-forum guidance). Neither platform mandates a specific format. Apple can expel developers from the Developer Program for non-compliance.

The synthesis for the Pack: a single disclosure block per region cannot satisfy all four regimes simultaneously. Korea demands per-item rates plus pity-threshold disclosure plus an auditable claim of "no wilful misconduct." China demands per-item rates plus daily-cap disclosure plus a 90-day outcome history pointer. Japan demands per-item rates (JOGA/CESA) and avoidance of kompu gacha mechanics. Apple and Google demand per-item rates prior to purchase. The Pack's job is to produce a region-specific block per regime that hits each region's full footprint, with a unified audit trail showing the studio disclosed what it claimed.

---

## A1. Korea: Game Industry Promotion Act (GIPA) probability disclosure

### Baseline rule (in effect since March 22, 2024)

The Amended GIPA, passed in 2023, made probability disclosure for "Random Items" mandatory effective March 22, 2024. The relevant provisions are Article 33 of the Amended GIPA. Article 2(11) defines Random Items, and Article 33(2) extends the disclosure scope to game providers (not just developers and distributors). Disclosure must cover types of random items and probability of obtaining each.

The disclosure requirement applies not only to in-game surfaces but also to the game's website, advertisements, and promotional materials. Monitoring is conducted by an MCST-coordinated team that has expanded over time (originally 24 persons, expanded under the Comprehensive Plan).

Source: Lexology, "Game industry promotion act was amended to expand regulation of random items," Bae Kim & Lee LLC, March 14, 2023, https://www.lexology.com/library/detail.aspx?g=614e2a6c-5904-4c7e-b2b7-6385926c29df

### Punitive damages amendment (effective August 1, 2025)

Following the 2024 disclosure baseline, the National Assembly passed a partial amendment to GIPA on December 31, 2024, approved by the Cabinet January 21, 2025, with the punitive damages provisions taking effect August 1, 2025. The amendment establishes Article 33-2, which adds:

- **Treble damages** (up to 3x actual damages) for intentional violations of disclosure requirements
- **Reversed burden of proof**: game operators must demonstrate absence of wilful misconduct or negligence to avoid liability
- **Simplified damage claims**: courts may determine damages through holistic review when precise calculation is challenging
- **Dedicated dispute resolution**: MCST established a game dispute resolution center centralizing reporting and remediation

The September 2025 "Measures to Establish Consumer Sovereignty," announced by relevant government authorities, emphasized the operation of the punitive damages system specifically for disclosure violations.

Sources:
- Legal500, "Punitive Damages and Other Special Legal Provisions for Litigation Concerning Probability-Based Game Items," August 22, 2025, https://www.legal500.com/developments/thought-leadership/punitive-damages-and-other-special-legal-provisions-for-litigation-concerning-probability-based-game-items/
- Chambers and Partners, "Gaming Law 2025: South Korea," November 25, 2025, https://practiceguides.chambers.com/practice-guides/gaming-law-2025/south-korea

### Domestic agent system (effective October 23, 2025)

A separate GIPA amendment, effective October 23, 2025, requires major overseas providers without a Korean address (meeting user and revenue thresholds) to designate a domestic agent in writing, typically through a service agreement. The domestic agent handles reporting and disclosure obligations under GIPA, and violations by the agent are attributed to the provider. Legislative intent is to address "reverse discrimination" against domestic Korean operators who already complied while overseas operators did not.

This is structurally important for the Pack's Turkish-studio-expansion launch frame. A Turkish or Istanbul-based publisher (e.g. Century Games' Whiteout Survival, which currently ranks as the highest-grossing overseas publisher on Korea's Google Play gaming category) must now have a Korean domestic representative, who in turn must operate disclosure compliance against the post-August-2025 punitive damages regime.

Sources:
- Korea Herald, "Will Korea's new gaming decree facilitate control over overseas game companies?", October 14, 2025, https://www.koreaherald.com/article/10593422
- Chambers and Partners, "Gaming Law 2025: South Korea" (cited above)

### Pending bill: revenue-based administrative fines (status as of February 2026: not passed)

On September 23, 2025, Rep. Kim Seong-hoe of the Democratic Party of Korea introduced a partial amendment bill (Kim amendment, co-sponsored by nine additional lawmakers) that would add a new Article 38-2 to GIPA, establishing penalty surcharges for omitted or false disclosures of probability-type item information. The proposal:

- Penalty surcharge: up to 3% of sales OR up to KRW 1 billion (~USD $692,300), whichever applies
- Trigger: distributing probability-type items without disclosing OR with false disclosure of types and supply probabilities

Status as of late February 2026: MCST has expressed cautious position citing potential double-punishment concerns (since treble damages already took effect August 2025), urging policymakers to first observe how existing sanctions operate. K-GAMES (Korea Association of Game Industry, the major industry association) submitted concerns about the undefined scope of "revenue" in the bill. The bill has not passed.

Sources:
- Outlook Respawn, "South Korea Proposes Revenue-Based Fines for Loot Box Violations," December 26, 2025, https://respawn.outlookindia.com/gaming/gaming-news/south-korea-proposes-revenue-based-fines-for-loot-box-violations
- Inven Global, "Loot Box Crackdown? South Korea Eyes Revenue Penalties for Probability Disclosure Breaches," February 25, 2026, https://www.invenglobal.com/articles/20244/loot-box-crackdown-south-korea-eyes-revenue-penalties-for-probability-disclosure-breaches

### Loot Box Victim Relief Center (operational since February 27, 2026)

GRAC (Game Rating and Administration Committee) opened the Loot Box Victim Relief Center on February 27, 2026. The Center conducts investigations into randomized items and mediates disputes related to consumer damages. Combined with the August 2025 punitive damages regime, this creates an active enforcement infrastructure for disclosure violations.

In December 2025, GRAC published a Collection of Case Studies Regarding Loot Box Probability Disclosure Violations, categorizing instances by violation type. A precedent enforcement: a Korean game developer (15-year IAP history) lowered drop rates of popular potential options without notifying users. The KFTC imposed the largest administrative fine in history for a violation of the Electronic Commerce Act, and the Consumer Dispute Mediation Committee ruled the company must refund a percentage of spend to ~5,000 affected purchasers.

Source: Shin & Kim, "South Korea is Expected to Tighten its Loot Box Probability Disclosure Laws," March 30, 2026, https://www.shinkim.com/eng/media/newsletter/3206

### Korea-specific disclosure floors derivable for the Pack

Synthesizing across the sources above:

1. **Per-item probability**, not per-rarity-tier aggregate (Article 33 language: "types of and probability of redemption for")
2. **Disclosure on multiple surfaces**: in-game, website, advertisements, promotional materials
3. **Pity-threshold disclosure**: not explicitly mandated by statute but the GRAC Case Studies and KFTC enforcement against the "X or less" vs "less than X" precedent suggest any pity, soft-pity, or guarantee mechanism that materially affects probability outcomes must be disclosed accurately
4. **Domestic agent attribution** for overseas operators: the agent is the legally responsible party, so the Pack should produce an audit JSON the agent can use as part of due-diligence record
5. **Refresh discipline**: the GRAC Case Studies precedent (lowering rates without notification) establishes that any rate change must be re-disclosed promptly; the Pack's audit JSON should include the rate-sheet hash and timestamp so a studio can show "as-disclosed-on-DATE-X" provenance

### Open Korea-side research items

- [ ] Locate primary-source GIPA Article 33-2 text in Korean and confirm English translation
- [ ] Identify whether GRAC's December 2025 Case Studies document is publicly downloadable; if so, ingest it as canonical guidance
- [ ] Confirm exact disclosure format requirements: percentage (x.xx%) vs decimal (0.0x) vs fraction; Korean academic literature suggests percentage but should verify against GRAC's Case Studies
- [ ] Verify Loot Box Victim Relief Center filing format and whether the audit JSON structure the Pack produces would be admissible/useful in a Center filing

---

## A2. China: MIIT and Ministry of Culture probability disclosure

### Baseline rule (in effect since May 1, 2017)

The People's Republic of China has required disclosure of randomized-reward probabilities since May 1, 2017, under a Ministry of Culture notice published in 2016. China is consistently identified in academic literature as the first jurisdiction to legally mandate gacha probability disclosure.

The rule requires:
1. **Probability disclosure for each randomized reward** (not just rarity-tier aggregates)
2. **Disclosure surface flexibility**: probabilities may be disclosed in-game on the loot box purchase page OR on the game's official website
3. **No specific format mandate**: no requirements as to size, type of symbol, wording, placement of website disclosures, or numerical/graphical communication

Sources:
- Cambridge Core, "Gaming the system: suboptimal compliance with loot box probability disclosure regulations in China," Xiao & Henderson, https://www.cambridge.org/core/journals/behavioural-public-policy/article/gaming-the-system-suboptimal-compliance-with-loot-box-probability-disclosure-regulations-in-china/B2642E2F8B7164236E5477D58D2B26DE
- Wikipedia, "Regulations protecting consumers from microtransactions," accessed May 2026, https://en.wikipedia.org/wiki/Regulations_protecting_consumers_from_microtransactions

### Operational requirements beyond static disclosure

Mainland-licensed games face four operational requirements beyond simply publishing a probability block:

1. **Deterministic over-time guarantees**: rates must reflect reality over time. The canonical interpretation is that a 10% probability item must actually appear within 10 box opens in aggregate. This is effectively a hard-pity guarantee per item.
2. **90-day public outcome history**: a publicly available record of loot box outcomes for the last 90 days
3. **Daily caps per player**:
   - No more than 30 single loot boxes per day
   - No more than 3 "10x" loot box bundles per day
   - No more than 50 loot boxes total per day
4. **Clear in-game display of player's daily limit**: showing how many opens remain

Source: AppInChina, "Content Restrictions & Requirements For Games In China," https://appinchina.co/services/game-publishing/content-restrictions-for-publishing-games-in-china/

### Loot box payment rules (relevant context)

Two parallel rules constrain the loot box mechanic itself:

1. **No real-money or virtual-currency direct purchase of loot boxes**: in mainland-licensed games, loot boxes cannot be purchased using either real or virtual currency. Workaround used by many publishers (e.g. Overwatch in China): loot boxes given as a "free bonus" for in-game-currency purchases that themselves were bought with real money
2. **Loot box contents must be acquirable through other means**: pure-luck-only acquisition paths are prohibited
3. **Compulsion loops not allowed**: kompu-gacha-style mechanics that require multiple steps to obtain a final reward are prohibited

These constrain product design, not the Pack directly, but Chinese disclosure blocks should reference the alternative-acquisition path per item where relevant, since failure to do so could be flagged in NPPA review.

### Licensing and approval (operational gate, not disclosure)

Mainland-licensed games go through the NPPA (National Press and Publication Administration) approval process. MIIT governs the privacy policy and ToS aspects of mobile apps. The Pack does not need to handle NPPA submission, but the disclosure block it produces is one of the artifacts that goes into NPPA review.

### Enforcement and compliance reality

Empirical research (Xiao & Henderson, Cambridge 2021) found 91 of the 100 highest-grossing PRC iPhone games contained loot boxes; 90.5% of games rated 12+ contained loot boxes. Surface-level compliance with disclosure was near-perfect, but disclosure UX was widely poor (buried, hard to access). Only five games used the most prominent disclosure format. Enforcement has historically been uneven, but recent enforcement has been tightening, particularly through the KFTC's "dark pattern" framing under the E-Commerce Consumer Protection Act.

### China-specific disclosure floors derivable for the Pack

1. **Per-banner disclosure**, not per-game aggregate, when the rate sheet has multiple banners with different rates
2. **Per-item probability**, not per-rarity-tier
3. **Daily-cap statement**: the disclosure block should include or reference the daily-cap mechanism
4. **90-day history pointer**: the disclosure block should link to or describe the 90-day outcome history surface (the Pack does not generate this history, but the block should reference where it lives)
5. **Alternative-acquisition statement**: items obtainable only via gacha should be flagged; items with non-gacha paths should note those paths
6. **Simplified Chinese language**: disclosure must be in Simplified Chinese for mainland-licensed games

### Open China-side research items

- [ ] Locate the original 2016 Ministry of Culture notice text (Chinese-language primary source)
- [ ] Confirm whether the daily caps (30/3/50) apply to all loot box mechanics or only certain rarity bands
- [ ] Confirm current enforcement status: are NPPA-licensed games required to surface the 90-day history through a specific UI pattern, or is publishing a downloadable record sufficient?
- [ ] Check whether the 2019 spending caps ($28-57/month for minors) interact with disclosure obligations or are a separate consumer-protection layer

---

## A3. Japan: JOGA and CESA self-regulation

### Baseline self-regulation (in effect since April 2016, building on 2012 kompu gacha ban)

Japan has no statute specifically requiring gacha probability disclosure. The regulatory regime is industry self-regulation through two non-governmental industry associations:

- **JOGA** (Japan Online Games Association)
- **CESA** (Computer Entertainment Supplier's Association)

Both associations issued probability disclosure guidelines in April 2016, following the 2012 kompu gacha ban (which applied gambling and Unfair Premium Act framings) and the 2016 Granblue Fantasy "rate-up lie" controversy that prompted thousands of CAA complaints and ~USD $1 billion in market-cap loss across Japanese social gaming.

The April 2016 CESA guideline asked members to disclose:
- Probability rates of each gacha-generated item (not just per-rarity drop rates)
- Mechanism transparency for combination/multi-step gacha

Sources:
- Lexology, "Loot Boxes in Japan: Legal Analysis and Kompu Gacha Explained," August 2, 2018, https://www.lexology.com/library/detail.aspx?g=9207df10-a8a2-4f67-81c3-6a148a6100e2
- Medium, Min Maybe, "Gacha at a Crossroads: How Europe Regulates While Japan Self-Regulates," November 29, 2025, https://medium.com/@minsu057/gacha-at-a-crossroads-how-europe-regulates-while-japan-self-regulates-e32dfc5a8623
- Chambers and Partners, "Gaming Law 2022: Japan," https://www.nagashima.com/wp-content/uploads/2023/01/cp_gpg_GamingLaw_2022_japan.pdf

### Statutory backstop: Unfair Premium Act

Where industry self-regulation breaks down, two statutes can intervene:

1. **Act against Unfair Premiums and Misleading Representations (Unfair Premium Act)**: caps prize value at the lower of (a) 20x the transaction value, or (b) JPY 100,000. Excessive prizes can be banned by the Consumer Affairs Agency (CAA) or Japan Fair Trade Commission (JFTC) under this Act.
2. **Kompu gacha is illegal**: the multi-level "complete gacha" mechanic that requires assembling a set of randomized items to obtain a final reward was banned in 2012 under the Unfair Premium Act framing.

The Unfair Premium Act provides a fallback mechanism: false probability disclosure can be characterized as a "misleading representation" under the Act, which is government-enforceable even though probability disclosure itself is industry-self-regulated.

### Compliance reality and platform pressure

Compliance with JOGA/CESA guidelines is technically voluntary, but in practice:

- Major publishers risk losing platform distribution partners (Apple, Google, regional storefronts)
- Reputational damage is real (the 2016 Granblue case cost the industry ~USD $1 billion)
- Player communities are highly disclosure-conscious; deviations get surfaced quickly on social platforms

Compliance does not require government licensing or filing.

### Japan-specific disclosure floors derivable for the Pack

1. **Per-item probability disclosure** (CESA/JOGA standard, stricter than aggregate)
2. **Pity and rate-up disclosure**: where soft-pity or rate-up mechanics affect outcomes, those mechanics should be disclosed in plain language
3. **Kompu gacha avoidance**: the rate sheet itself should be checked for any combination/multi-step structure that could be characterized as kompu gacha; the Pack should flag this as a hard fail
4. **Internal record-keeping**: publishers should be able to prove probabilities match what they advertise. The Pack's audit JSON satisfies the "internal record" piece even though Japan does not formally require it.

### Open Japan-side research items

- [ ] Locate primary-source JOGA gacha guideline (Japanese-language source, April 2016)
- [ ] Locate primary-source CESA guideline (Japanese-language source, April 2016)
- [ ] Confirm any post-2016 revisions; CESA reportedly revised guidelines but timing and scope unclear
- [ ] Confirm whether Apple/Google's platform-level rules effectively supersede JOGA/CESA in practice for any Japanese-market mobile game (likely yes, since both Apple and Google enforce per-item disclosure regardless of regional self-regulation)

---

## A4. Western markets: Apple App Store and Google Play

### Apple App Store Review Guideline 3.1.1 (in effect since December 2017)

Apple's App Store Review Guideline 3.1.1 (In-App Purchase) was updated in December 2017 to add a probability disclosure requirement. The current text (verified May 2026):

Apps offering loot boxes or other mechanisms that provide randomized virtual items for purchase must disclose the odds of receiving each type of item to customers prior to purchase.

Key features:
- **Per-item odds**, not per-rarity aggregate ("each type of item")
- **Disclosure timing**: prior to purchase
- **Scope**: applies whether loot boxes are purchased directly with real money or with virtual currency that was originally purchased with real money (clarified through Apple Developer Forums developer guidance)
- **Enforcement**: Apple can expel developers from the Developer Program for non-compliance

Source: Apple Developer, "App Review Guidelines," accessed May 2026, https://developer.apple.com/app-store/review/guidelines/

### Google Play Developer Policy: Monetization & Ads (in effect since May 2019)

Google Play's Monetization and Ads policy was updated in May 2019 to add a parallel rule:

Apps offering mechanisms to receive randomized virtual items from a purchase (i.e. loot boxes) must clearly disclose the odds of receiving those items in advance of purchase.

Key features mirror Apple:
- Per-item odds
- Prior to purchase
- Same scope structure

Sources:
- Fenwick & West, "Google Play Now Requires Disclosure of Loot Box Odds," August 28, 2025, https://www.fenwick.com/insights/publications/google-play-now-requires-disclosure-of-loot-box-odds
- Lexology / Mondaq, multiple sources confirming May 2019 effective date

### Western markets disclosure floors derivable for the Pack

Apple and Google converge on a single rule shape that is the floor for any English-language disclosure block:

1. **Per-item probability**, not per-rarity-tier
2. **Prior to purchase**: the disclosure must be visible BEFORE the player commits to the purchase, not after
3. **No specific format mandate**: like China, no required font, layout, or numerical convention
4. **English-language acceptable**: both platforms accept English disclosure for global markets; localization is encouraged but not platform-mandated

The Pack's English disclosure block satisfies both Apple and Google. ESRB and PEGI labeling ("In-Game Purchases (Includes Random Items)") is a separate adjacent layer that affects store presentation but does not impose disclosure-format requirements.

### Open Western-markets research items

- [ ] Confirm latest Google Play Developer Policy text (the May 2019 wording may have been refined since)
- [ ] Confirm whether Apple's Guideline 3.1.1 has been updated post-2017 (the wording has been consistent across multiple captures from 2018 through 2025, but a primary-source check is worth doing)
- [ ] Document EU consumer law overlay: Italy and Netherlands have enforced UCPD (Unfair Commercial Practices Directive) against gacha non-disclosure; this is a potential V2 disclosure surface but the Pack's V1 EN block covering Apple/Google is the floor

---

## A5. Disclosure block format research framework

This section sketches the framework for the sister artifact (`docs/research/sprint2-gacha-disclosure-formats.md`). The actual collection of disclosure-block samples is hands-on visual work better suited for a CC session or manual collection.

### Games to sample (by region)

**Korea (12 samples target)**
- Genshin Impact KR (Cognosphere/HoYoverse)
- Honkai Star Rail KR (HoYoverse)
- Blue Archive KR (Nexon Korea)
- Lost Ark Mobile (Smilegate)
- Lineage W (NCSOFT)
- MapleStory M (Nexon)
- Cookie Run: Kingdom (Devsisters)
- Seven Knights 2 (Netmarble)
- KartRider Rush+ (Nexon)
- Brown Dust 2 (Neowiz)
- Black Desert Mobile (Pearl Abyss)
- Whiteout Survival KR (Century Games, Istanbul/London-based, useful for Turkey-Korea expansion frame)

**Japan (10 samples target)**
- Fate/Grand Order (Aniplex/Type-Moon)
- Princess Connect Re:Dive (Cygames)
- Uma Musume Pretty Derby (Cygames)
- Blue Archive JP (Yostar)
- Granblue Fantasy (Cygames, the original 2016 controversy game)
- Monster Strike (Mixi)
- Puzzle & Dragons (GungHo)
- Disney Tsum Tsum (LINE)
- Genshin Impact JP (HoYoverse)
- Arknights JP (Yostar)

**China mainland (8 samples target, via NPPA-licensed editions)**
- Honor of Kings (Tencent)
- Genshin Impact CN (miHoYo, mainland edition)
- Arknights CN (Hypergryph)
- Honkai Star Rail CN (miHoYo)
- Identity V (NetEase)
- Naruto Mobile (Tencent)
- Onmyoji (NetEase)
- Game for Peace (Tencent, the China-edition replacement for PUBG Mobile)

**Western (6 samples target)**
- Marvel Snap (Second Dinner)
- Diablo Immortal (Blizzard/NetEase)
- MARVEL Strike Force (Scopely)
- AFK Arena (Lilith Games)
- Genshin Impact (HoYoverse, Western edition)
- Counter-Strike 2 (Valve)

### What to extract per sample

For each game, capture:

1. **Disclosure surface**: in-game-only, website-only, both, or store-listing
2. **Access path**: from gacha banner screen, how many taps/clicks to reach the disclosure?
3. **Format type**: table, paragraph, bulleted list, image-rendered (PNG/JPEG)
4. **Aggregation level**: per-item, per-rarity-tier, both
5. **Numerical convention**: percentage (X.XX%), decimal (0.0X), fraction (1/X), ratio
6. **Decimal precision**: 2dp, 3dp, 4dp, more
7. **Pity/guarantee disclosure**: yes/no, where, how phrased
8. **Banner-level vs game-level**: per-banner blocks or single game-level block
9. **Language**: native locale only, multi-language, English-only
10. **Versioning/dating**: is the block dated? versioned? linked to a specific banner period?
11. **Layout artifacts**: column structure, grouping, color coding, accessibility

### Format conventions hypothesis (to verify)

Based on the regulatory framework analysis above, expected per-region conventions:

- **Korea**: in-game prominent placement, per-item percentage (likely 4dp), rarity-tier groupings, explicit pity-threshold callout, version-dated block
- **Japan**: in-game prominent placement, per-item percentage (likely 4dp), rarity-tier groupings, rate-up callout for limited banners, often image-rendered for layout control
- **China**: surface-flexible (in-game OR website), per-item percentage, often-buried access path, daily-cap mention, 90-day-history link
- **Western**: store-listing OR in-game, per-item percentage (often 2-3dp), simpler format, often single English block covering global edition

Hypothesis testing happens in the format-collection artifact.

### Format-research deliverable

The sister artifact `docs/research/sprint2-gacha-disclosure-formats.md` should contain:
- One table summarizing the 36-game sample with the 11 extraction fields
- Per-region template skeleton derived from the dominant pattern
- Annotated screenshots committed to `docs/research/disclosure-samples/{kr,jp,cn,en}/`
- An anti-pattern callout: implementations that drew regulator or community pushback

---

## A6. Validation rule set and audit-trail data model

### Rate-sheet input schema

```
RateSheet := {
  metadata: {
    studio_name: string,
    game_id: string,
    rate_sheet_version: string (semver or date-based),
    generated_at: ISO 8601 timestamp,
    source_system: string (optional)
  },
  pools: [
    {
      pool_id: string,
      banner_id: string (optional, required for China per-banner mode),
      banner_period: { start: ISO 8601, end: ISO 8601 } (optional),
      pity_threshold: int (optional, 0 if no pity),
      pity_type: enum["soft", "hard", "none"] (optional),
      guarantee_threshold: int (optional, for "X pulls guarantees rarity Y"),
      items: [
        {
          item_id: string,
          item_rarity: string (e.g. "5★", "SR", "UR"),
          probability: float (0.0 to 1.0),
          name_en: string,
          name_ko: string (optional),
          name_ja: string (optional),
          name_zh_hans: string (optional),
          name_tr: string (optional),
          alternative_acquisition: string (optional, e.g. "shop", "event", "none")
        }
      ]
    }
  ]
}
```

### Validation rule set per region

**Math validators (region-agnostic)**
- `M1`: each pool's item probabilities sum to 1.0 within tolerance (default abs 0.001, rel 0.1%)
- `M2`: no probability is exactly 0.0 (zero-prob items should be removed, not listed)
- `M3`: no probability is negative
- `M4`: probability precision is consistent across items in a pool (no mixing 4dp and 2dp)

**Korea validators (KR)**
- `KR1`: per-item probability is provided (M1-M4 pass)
- `KR2`: if `pity_threshold > 0`, the disclosed block includes pity-threshold language
- `KR3`: if `guarantee_threshold > 0`, the disclosed block includes guarantee language
- `KR4`: `name_ko` is present for every item in a pool that targets Korea
- `KR5`: rate-sheet `generated_at` is within 90 days of validation timestamp (refresh-discipline check)

**China validators (CN)**
- `CN1`: per-item probability is provided (M1-M4 pass)
- `CN2`: `banner_id` is provided for every pool (per-banner mode required for mainland-licensed games)
- `CN3`: `name_zh_hans` is present for every item in a pool that targets China
- `CN4`: warning: daily-cap mechanism (30/3/50 per-player-per-day) must be implemented in-game; the block references this but does not enforce it
- `CN5`: warning: 90-day outcome history must be available; block references the URL/path but does not generate the history

**Japan validators (JP)**
- `JP1`: per-item probability is provided (M1-M4 pass)
- `JP2`: `name_ja` is present for every item in a pool that targets Japan
- `JP3`: kompu-gacha check: scan rate sheet for combination/multi-step structures (heuristic: any pool whose items reference completion of another pool's items as a precondition); flag as hard fail
- `JP4`: Unfair Premium Act prize-cap check: no item's nominal value can exceed lower of (20x ticket price) or JPY 100,000; this is informational since the tool does not know nominal item values, but should warn if studio-provided value metadata is present

**Western validators (W)**
- `W1`: per-item probability is provided (M1-M4 pass)
- `W2`: `name_en` is present for every item

### Audit-trail JSON schema

```
AuditTrail := {
  schema_version: "1.0",
  generated_at: ISO 8601 timestamp,
  tool_version: string (Pack semver),
  rate_sheet_hash: string (SHA-256 of canonicalized rate sheet),
  rate_sheet_metadata: {
    studio_name: string,
    game_id: string,
    rate_sheet_version: string,
    rate_sheet_generated_at: ISO 8601
  },
  regions_targeted: [string],
  validation_results: [
    {
      region: string,
      pool_id: string,
      validator_id: string (e.g. "KR2"),
      status: enum["pass", "warn", "fail"],
      message: string,
      suggested_fix: string (optional)
    }
  ],
  generated_blocks: [
    {
      region: string,
      format: enum["html", "png", "json"],
      block_hash: string (SHA-256),
      block_uri: string (output filename in the export ZIP)
    }
  ],
  disclaimer: "This audit was generated by Qyren Gacha Disclosure Pack. The audit attests to what the studio provided and what was generated, not to legal compliance. The studio is responsible for compliance review before publication."
}
```

The audit trail satisfies four purposes:

1. **Provenance**: a regulator or platform reviewer can verify what the studio disclosed at a specific point in time
2. **Reproducibility**: the rate-sheet hash plus tool version plus block hashes let anyone re-run the validation and confirm the same result
3. **Refresh discipline**: the timestamp lets a studio show "as-disclosed-on-DATE-X" provenance for any rate change
4. **Legal posture**: the disclaimer makes clear the audit is a record of what was disclosed, not legal advice or compliance certification

Cryptographic signing is out of scope for V1 per the open decisions in the Sprint 2 doc; an unsigned JSON is sufficient for studio internal records and platform reviewer use cases at this stage.

---

## Open cross-cutting research items (Section A consolidation)

These items remain open after this initial draft and should resolve before Section B build begins:

- [ ] **Korean primary-source GIPA Article 33 and 33-2 text** (currently relying on secondary sources)
- [ ] **GRAC December 2025 Case Studies** download and ingest as canonical guidance
- [ ] **Chinese 2016 Ministry of Culture notice** primary-source text (Chinese-language)
- [ ] **JOGA April 2016 guideline** primary-source text (Japanese-language)
- [ ] **CESA April 2016 guideline** primary-source text (Japanese-language)
- [ ] **Latest Google Play Developer Policy text** (verify against May 2019 baseline)
- [ ] **Disclosure-format collection** (the 36-game sample, sister artifact)
- [ ] **Korean reviewer or attorney sourcing** (gates Section C2 disclosure-block template review)
- [ ] **Japanese reviewer sourcing** (same gate)

---

*End of Section A research data artifact. This document is the primary input for Section B (Tool UI build) and Section C2 (disclosure-block template review). Update this artifact whenever any of the regulatory facts shifts or whenever any open item resolves.*
