# Sprint 2 Section B Build Spec: Gacha Disclosure Pack Tool UI

**Artifact**: `docs/specs/sprint2-section-b-build-spec.md`
**Status**: Build-ready, derived from the Section A research artifacts as of 2026-05-08
**Owner**: Ramesh; **Implementer**: Claude Code (CC) session
**Sister artifacts**:
- `docs/research/sprint2-gacha-disclosure-data.md` (regulatory facts plus validation rule set plus audit-trail schema)
- `docs/research/sprint2-gacha-disclosure-formats.md` (per-region V1 template skeletons)
- `docs/planning/Qyren_Inbound_Sprint_2.md` (parent sprint plan)

---

## Scope and prerequisites

This spec covers Sprint 2 Section B (B1 through B5) plus the parts of Sections C, D, and G that are tool-internal (locale routing, directory card integration as a `kind: 'built'` entry, PostHog event firing, Supabase usage_summary write).

It assumes:
- Section A research artifacts are committed and locked (the validation rule set in §A6 of the data artifact and the V1 template skeletons in the formats artifact are the source of truth)
- The existing `rknlabs/qyren-tools` monorepo conventions are honored (Vite plus React plus Tailwind plus TypeScript, matching the directory app)
- Supabase `leads` table and Resend integration from Sprint 1 are operational and reusable
- PostHog free tier is configured and the existing event-firing helper from the directory is reusable

The build effort estimate is 12 to 16 hours per the Sprint 2 doc, executed by CC across multiple commits. Section B5 (empty/error states) is folded into the relevant component specs rather than treated as a separate epic.

---

## Repo location and integration

The tool lives in a monorepo subfolder per the locked Sprint 1 decision and the Sprint 2 open-decisions table. Exact path resolves against the existing monorepo layout; CC should inspect the repo first and follow whatever apps/tools convention is already in place. The intent:

- If the monorepo uses `apps/` for end-user surfaces and `tools/` for built utilities, the tool goes at `tools/gacha-disclosure-pack/`
- If the monorepo uses a flat workspace layout, the tool goes at `gacha-disclosure-pack/` at the root
- The directory app reads the tool's manifest to surface it as a `kind: 'built'` card

CC should not invent a new monorepo layout. If the existing convention is unclear, flag back and ship a single decision rather than guessing.

---

## File-tree layout (within the tool subfolder)

```
gacha-disclosure-pack/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── routes/
    │   ├── DetailPage.tsx          # /gacha-disclosure-pack (marketing/info page)
    │   └── ToolPage.tsx            # /gacha-disclosure-pack/run (the actual tool)
    ├── components/
    │   ├── RateSheetUpload.tsx     # B2 Step 1
    │   ├── RegionSelector.tsx      # B2 Step 2
    │   ├── OutputConfig.tsx        # B2 Step 3
    │   ├── ValidationReport.tsx    # B4 results table
    │   ├── DisclosurePreview.tsx   # B4 per-region block previews
    │   ├── ExportButtons.tsx       # B4 capture-gated exports
    │   ├── CaptureForm.tsx         # B4 capture modal
    │   └── ErrorStates.tsx         # B5 empty/error states
    ├── lib/
    │   ├── parseRateSheet.ts       # CSV/JSON input parsing
    │   ├── validate.ts             # B3 validation orchestrator
    │   ├── validators/
    │   │   ├── math.ts             # M1-M4
    │   │   ├── korea.ts            # KR1-KR5
    │   │   ├── china.ts            # CN1-CN5
    │   │   ├── japan.ts            # JP1-JP4
    │   │   └── western.ts          # W1-W2
    │   ├── renderTemplate.ts       # Per-region template interpolation
    │   ├── generateAuditJson.ts    # Audit-trail JSON generator
    │   ├── renderPng.ts            # HTML-to-PNG card generation
    │   ├── exportZip.ts            # JSZip ZIP packaging
    │   ├── hash.ts                 # SubtleCrypto SHA-256 wrapper
    │   ├── supabase.ts             # Supabase client (capture write)
    │   └── analytics.ts            # PostHog event helpers
    ├── templates/
    │   ├── ko.html                 # Korean disclosure-block template
    │   ├── ja.html                 # Japanese template
    │   ├── zh-Hans.html            # Simplified Chinese template
    │   ├── en.html                 # English template
    │   └── tr.html                 # Turkish template
    ├── types/
    │   ├── rateSheet.ts            # RateSheet, Pool, Item, Region types
    │   ├── validation.ts           # ValidationResult, ValidatorContext types
    │   └── audit.ts                # AuditTrail type
    ├── i18n/
    │   ├── en.json                 # Tool UI strings
    │   ├── tr.json
    │   └── zh-Hans.json
    └── samples/
        ├── single-banner.csv       # One pool, no pity
        ├── multi-banner.csv        # Multiple pools, banner_id required
        ├── soft-pity.csv           # Genshin-style soft pity at 74, hard pity at 90
        └── hard-pity.csv           # FGO-style hard pity only
```

The `templates/` directory is read at build time and the HTML strings are bundled into the JS. This makes the tool deployable as a static SPA without runtime template fetches.

---

## Type definitions

### `src/types/rateSheet.ts`

```typescript
export type Region = "KR" | "JP" | "CN" | "EN" | "TR";

export type Rarity = string; // e.g. "5★", "SSR", "UR": studio-defined

export type PityType = "soft" | "hard" | "none";

export interface Item {
  item_id: string;
  item_rarity: Rarity;
  probability: number; // 0.0 to 1.0
  name_en: string;
  name_ko?: string;
  name_ja?: string;
  name_zh_hans?: string;
  name_tr?: string;
  alternative_acquisition?: string; // e.g. "shop", "event", "none"
}

export interface Pool {
  pool_id: string;
  banner_id?: string;
  banner_period?: { start: string; end: string }; // ISO 8601
  banner_name_en?: string;
  banner_name_ko?: string;
  banner_name_ja?: string;
  banner_name_zh_hans?: string;
  banner_name_tr?: string;
  pity_threshold?: number; // 0 if no pity
  pity_type?: PityType;
  guarantee_threshold?: number; // for "X pulls guarantees rarity Y"
  items: Item[];
}

export interface RateSheetMetadata {
  studio_name: string;
  game_id: string;
  game_name_en: string;
  game_name_ko?: string;
  game_name_ja?: string;
  game_name_zh_hans?: string;
  game_name_tr?: string;
  rate_sheet_version: string;
  generated_at: string; // ISO 8601
  source_system?: string;
  operator_name_en: string;
  operator_name_ko?: string;
  operator_name_ja?: string;
  operator_name_zh_hans?: string;
  operator_name_tr?: string;
  domestic_agent_name_ko?: string; // required for KR if overseas operator
  outcome_history_url?: string; // for CN 90-day history pointer
}

export interface RateSheet {
  metadata: RateSheetMetadata;
  pools: Pool[];
}
```

### `src/types/validation.ts`

```typescript
import { Region } from "./rateSheet";

export type ValidationStatus = "pass" | "warn" | "fail";

export interface ValidationResult {
  pool_id: string;
  region: Region;
  validator_id: string; // e.g. "KR2", "M1"
  status: ValidationStatus;
  message: string;
  suggested_fix?: string;
}

export interface ValidatorContext {
  pool_id: string;
  region: Region;
  rateSheet: import("./rateSheet").RateSheet;
}

export type Validator = (ctx: ValidatorContext) => ValidationResult[];
```

### `src/types/audit.ts`

```typescript
import { Region, RateSheetMetadata } from "./rateSheet";
import { ValidationResult } from "./validation";

export interface GeneratedBlock {
  region: Region;
  format: "html" | "png" | "json";
  block_hash: string; // SHA-256
  block_uri: string; // filename in the export ZIP
}

export interface AuditTrail {
  schema_version: "1.0";
  generated_at: string; // ISO 8601
  tool_version: string; // semver from package.json
  rate_sheet_hash: string; // SHA-256 of canonicalized rate sheet
  rate_sheet_metadata: RateSheetMetadata;
  regions_targeted: Region[];
  validation_results: ValidationResult[];
  generated_blocks: GeneratedBlock[];
  disclaimer: string;
}
```

---

## Routing

Two routes added to the tool's router. The directory app at `tools.qyren.ai` already handles its own routing; the gacha-disclosure-pack tool registers its routes through whatever convention the monorepo uses (a route manifest file or a router-level registration).

| Route | Component | Purpose |
|---|---|---|
| `/gacha-disclosure-pack` | `DetailPage` | Marketing/info page: tool name, description, screenshots, sample rate sheet downloads, link to source repo, "Use the tool" CTA to `/run` |
| `/gacha-disclosure-pack/run` | `ToolPage` | The full tool workflow |
| `/tr/gacha-disclosure-pack` | `DetailPage` (Turkish locale) | Same content, TR strings |
| `/tr/gacha-disclosure-pack/run` | `ToolPage` (Turkish locale) | Same workflow, TR UI strings |
| `/cn/gacha-disclosure-pack` | `DetailPage` (ZH-Hans locale) | Same content, ZH-Hans strings |
| `/cn/gacha-disclosure-pack/run` | `ToolPage` (ZH-Hans locale) | Same workflow, ZH-Hans UI strings |

hreflang on the detail page: three locales plus x-default. Locale resolution uses the same i18n context the directory app already provides; do not invent a new locale system.

---

## Component hierarchy

### `ToolPage.tsx` (the main workflow container)

State management with `useReducer` (state machine pattern). The state shape:

```typescript
type ToolState =
  | { phase: "input"; rateSheet?: RateSheet; regions: Region[]; outputConfig: OutputConfig }
  | { phase: "validating" }
  | { phase: "results"; rateSheet: RateSheet; regions: Region[]; outputConfig: OutputConfig; validationResults: ValidationResult[]; renderedBlocks: Map<Region, string> }
  | { phase: "capturing"; capturePayload: CapturePayload }
  | { phase: "exporting"; auditTrail: AuditTrail }
  | { phase: "complete"; downloadUrl: string };
```

State transitions:
- `input` → `validating` when user clicks "Validate"
- `validating` → `results` when validators complete
- `results` → `capturing` when user clicks any export button (capture-gate fires)
- `capturing` → `exporting` when capture form submits successfully
- `exporting` → `complete` when ZIP is generated and ready for download
- Any phase → `input` via "Start over" button

### Child components

**`RateSheetUpload`** (B2 Step 1, phase=input)
- Drag-and-drop zone (use a small library like `react-dropzone` or roll a native HTML5 drag handler)
- Paste-JSON textarea fallback
- Sample rate sheet download links (4 archetypes from `samples/` directory)
- Inline schema reference panel (collapsible)
- On valid CSV/JSON parse, dispatch `RATE_SHEET_PARSED` with the parsed object
- On parse error, dispatch `RATE_SHEET_PARSE_ERROR` with row-number details

**`RegionSelector`** (B2 Step 2, phase=input)
- Multi-select chips for KR, JP, CN, EN, TR
- Default selection: KR + JP + CN + EN
- Each chip has a tooltip with the regulatory regime summary (statute, self-regulation, platform policy)

**`OutputConfig`** (B2 Step 3, phase=input)
- Output format toggles: HTML (default on), PNG (default on), JSON audit (default on)
- Banner-level vs game-level disclosure toggle (default banner-level for CN, game-level acceptable elsewhere)
- Pity-threshold disclosure toggle (default on for KR, off elsewhere unless rate sheet has pity declared)
- "Validate" button at the bottom that dispatches `START_VALIDATION`

**`ValidationReport`** (B4, phase=results)
- Table of per-region per-validator results
- Color coding: green=pass, amber=warn, red=fail
- Inline suggested-fix text for fail rows
- Expandable per-pool sections when multiple pools exist

**`DisclosurePreview`** (B4, phase=results)
- Tab strip per region (KR, JP, CN, EN, TR)
- Each tab renders the generated HTML block in an iframe-isolated preview
- Below the preview: hash, generation timestamp, tool version stamp

**`ExportButtons`** (B4, phase=results)
- "Download all (ZIP)": triggers capture-gate, then ZIP generation
- "Download HTML only": same gate, smaller ZIP
- "Download JSON audit only": same gate, single file
- "Email me the pack": same gate, send via Resend

**`CaptureForm`** (B4, phase=capturing)
- Modal overlay
- Email input (required)
- Studio name (optional)
- "What tool would you build next?" textarea (optional, warm-outreach signal)
- Submit triggers Supabase write plus Resend email plus PostHog event

**`ErrorStates`** (B5, used inline within other components)
- Rate sheet malformed: row-number error display
- Region selected but missing language coverage: "Korean block requires item_name_ko column" with re-upload CTA
- Probability sum tolerance violation: per-pool error with the actual sum and the fix
- Zero regions selected: re-select CTA

---

## Validation engine implementation

### `src/lib/validate.ts` (orchestrator)

```typescript
import { RateSheet, Region } from "../types/rateSheet";
import { ValidationResult } from "../types/validation";
import { mathValidators } from "./validators/math";
import { koreaValidators } from "./validators/korea";
import { chinaValidators } from "./validators/china";
import { japanValidators } from "./validators/japan";
import { westernValidators } from "./validators/western";

const REGION_VALIDATORS = {
  KR: [...mathValidators, ...koreaValidators],
  CN: [...mathValidators, ...chinaValidators],
  JP: [...mathValidators, ...japanValidators],
  EN: [...mathValidators, ...westernValidators],
  TR: [...mathValidators, ...westernValidators],
} as const;

export function validate(rateSheet: RateSheet, regions: Region[]): ValidationResult[] {
  const results: ValidationResult[] = [];
  for (const region of regions) {
    for (const pool of rateSheet.pools) {
      const validators = REGION_VALIDATORS[region];
      for (const validator of validators) {
        const ctx = { pool_id: pool.pool_id, region, rateSheet };
        results.push(...validator(ctx));
      }
    }
  }
  return results;
}
```

### `src/lib/validators/math.ts` (M1-M4, region-agnostic)

```typescript
import { Validator, ValidationResult } from "../../types/validation";

const TOLERANCE_ABS = 0.001;
const TOLERANCE_REL = 0.001;

export const M1_probabilitySum: Validator = (ctx) => {
  const pool = ctx.rateSheet.pools.find(p => p.pool_id === ctx.pool_id)!;
  const sum = pool.items.reduce((acc, item) => acc + item.probability, 0);
  const absDiff = Math.abs(sum - 1.0);
  const relDiff = absDiff / 1.0;
  if (absDiff <= TOLERANCE_ABS && relDiff <= TOLERANCE_REL) {
    return [{ pool_id: ctx.pool_id, region: ctx.region, validator_id: "M1", status: "pass", message: `Probabilities sum to ${sum.toFixed(6)}` }];
  }
  return [{
    pool_id: ctx.pool_id,
    region: ctx.region,
    validator_id: "M1",
    status: "fail",
    message: `Probabilities sum to ${sum.toFixed(6)}, expected 1.0 (tolerance ±0.001)`,
    suggested_fix: `Adjust item probabilities so they sum to 1.0. Current diff: ${absDiff.toFixed(6)}`,
  }];
};

export const M2_noZeroProbability: Validator = (ctx) => {
  const pool = ctx.rateSheet.pools.find(p => p.pool_id === ctx.pool_id)!;
  const zeros = pool.items.filter(item => item.probability === 0);
  if (zeros.length === 0) {
    return [{ pool_id: ctx.pool_id, region: ctx.region, validator_id: "M2", status: "pass", message: "No zero-probability items" }];
  }
  return zeros.map(item => ({
    pool_id: ctx.pool_id,
    region: ctx.region,
    validator_id: "M2",
    status: "fail" as const,
    message: `Item ${item.item_id} has probability 0`,
    suggested_fix: `Remove zero-probability items or assign a non-zero probability`,
  }));
};

export const M3_noNegativeProbability: Validator = (ctx) => {
  const pool = ctx.rateSheet.pools.find(p => p.pool_id === ctx.pool_id)!;
  const negs = pool.items.filter(item => item.probability < 0);
  if (negs.length === 0) {
    return [{ pool_id: ctx.pool_id, region: ctx.region, validator_id: "M3", status: "pass", message: "No negative probabilities" }];
  }
  return negs.map(item => ({
    pool_id: ctx.pool_id,
    region: ctx.region,
    validator_id: "M3",
    status: "fail" as const,
    message: `Item ${item.item_id} has negative probability ${item.probability}`,
    suggested_fix: `Probabilities must be in [0, 1]`,
  }));
};

export const M4_consistentPrecision: Validator = (ctx) => {
  const pool = ctx.rateSheet.pools.find(p => p.pool_id === ctx.pool_id)!;
  const precisions = pool.items.map(item => {
    const str = item.probability.toString();
    const decimal = str.split(".")[1];
    return decimal ? decimal.length : 0;
  });
  const unique = new Set(precisions);
  if (unique.size <= 2) {
    return [{ pool_id: ctx.pool_id, region: ctx.region, validator_id: "M4", status: "pass", message: "Probability precision is consistent" }];
  }
  return [{
    pool_id: ctx.pool_id,
    region: ctx.region,
    validator_id: "M4",
    status: "warn",
    message: `Probability precision varies across items (${unique.size} different precisions)`,
    suggested_fix: `Normalize probabilities to a single decimal precision (e.g. 4 decimal places throughout)`,
  }];
};

export const mathValidators: Validator[] = [M1_probabilitySum, M2_noZeroProbability, M3_noNegativeProbability, M4_consistentPrecision];
```

### `src/lib/validators/korea.ts` (KR1-KR5)

KR1 is implicit (math validators must pass first). KR2-KR5 implementation:

```typescript
import { Validator } from "../../types/validation";

export const KR2_pityDisclosure: Validator = (ctx) => {
  if (ctx.region !== "KR") return [];
  const pool = ctx.rateSheet.pools.find(p => p.pool_id === ctx.pool_id)!;
  if (!pool.pity_threshold || pool.pity_threshold === 0) {
    return [{ pool_id: ctx.pool_id, region: "KR", validator_id: "KR2", status: "pass", message: "No pity threshold declared" }];
  }
  // The KR template auto-includes pity disclosure when pool.pity_threshold > 0; this validator passes informationally
  return [{ pool_id: ctx.pool_id, region: "KR", validator_id: "KR2", status: "pass", message: `Pity threshold ${pool.pity_threshold} will be disclosed in Korean block` }];
};

export const KR3_guaranteeDisclosure: Validator = (ctx) => {
  if (ctx.region !== "KR") return [];
  const pool = ctx.rateSheet.pools.find(p => p.pool_id === ctx.pool_id)!;
  if (!pool.guarantee_threshold) {
    return [{ pool_id: ctx.pool_id, region: "KR", validator_id: "KR3", status: "pass", message: "No guarantee threshold declared" }];
  }
  return [{ pool_id: ctx.pool_id, region: "KR", validator_id: "KR3", status: "pass", message: `Guarantee threshold ${pool.guarantee_threshold} will be disclosed in Korean block` }];
};

export const KR4_languageCoverage: Validator = (ctx) => {
  if (ctx.region !== "KR") return [];
  const pool = ctx.rateSheet.pools.find(p => p.pool_id === ctx.pool_id)!;
  const missing = pool.items.filter(item => !item.name_ko);
  if (missing.length === 0) {
    return [{ pool_id: ctx.pool_id, region: "KR", validator_id: "KR4", status: "pass", message: "All items have Korean names" }];
  }
  return [{
    pool_id: ctx.pool_id,
    region: "KR",
    validator_id: "KR4",
    status: "fail",
    message: `${missing.length} items lack Korean names (name_ko column)`,
    suggested_fix: `Add name_ko column to your rate sheet for items: ${missing.slice(0, 5).map(m => m.item_id).join(", ")}${missing.length > 5 ? "..." : ""}`,
  }];
};

export const KR5_refreshDiscipline: Validator = (ctx) => {
  if (ctx.region !== "KR") return [];
  const generatedAt = new Date(ctx.rateSheet.metadata.generated_at);
  const now = new Date();
  const daysAgo = (now.getTime() - generatedAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysAgo <= 90) {
    return [{ pool_id: ctx.pool_id, region: "KR", validator_id: "KR5", status: "pass", message: `Rate sheet generated ${Math.floor(daysAgo)} days ago, within 90-day refresh window` }];
  }
  return [{
    pool_id: ctx.pool_id,
    region: "KR",
    validator_id: "KR5",
    status: "warn",
    message: `Rate sheet generated ${Math.floor(daysAgo)} days ago, outside 90-day refresh window`,
    suggested_fix: `Refresh the rate sheet to confirm current rates match disclosed rates`,
  }];
};

export const koreaValidators: Validator[] = [KR2_pityDisclosure, KR3_guaranteeDisclosure, KR4_languageCoverage, KR5_refreshDiscipline];
```

### `src/lib/validators/china.ts` (CN1-CN5)

CN2-CN5 implementation pattern matches Korea: language coverage check (CN3 requires `name_zh_hans`), banner_id required check (CN2), informational warnings for daily-cap and 90-day-history (CN4, CN5). Full implementation in CC's commit.

### `src/lib/validators/japan.ts` (JP1-JP4)

Critical validator: JP3 (kompu-gacha check) is a hard fail. The detection heuristic is "any pool whose items reference completion of another pool's items as a precondition." V1 implementation: scan item names for kompu-gacha-shaped keywords (`完成`, `合成`, `combination`, `complete set`) and warn; full structural detection requires rate-sheet schema extensions deferred to V2.

### `src/lib/validators/western.ts` (W1-W2)

W1 implicit (math validators), W2 is name_en coverage. Trivial implementation.

---

## Template rendering

### `src/lib/renderTemplate.ts`

Templates use `{{field}}` placeholders (Mustache-style). The renderer is intentionally simple: no logic blocks, no conditionals beyond presence-or-absence, no helpers. All conditional logic is handled by the orchestrator before template invocation.

```typescript
import { RateSheet, Pool, Region } from "../types/rateSheet";

const TEMPLATE_PATHS: Record<Region, () => Promise<string>> = {
  KR: () => import("../templates/ko.html?raw").then(m => m.default),
  JP: () => import("../templates/ja.html?raw").then(m => m.default),
  CN: () => import("../templates/zh-Hans.html?raw").then(m => m.default),
  EN: () => import("../templates/en.html?raw").then(m => m.default),
  TR: () => import("../templates/tr.html?raw").then(m => m.default),
};

export async function renderTemplate(rateSheet: RateSheet, pool: Pool, region: Region): Promise<string> {
  const template = await TEMPLATE_PATHS[region]();
  const fields = buildFieldMap(rateSheet, pool, region);
  return interpolate(template, fields);
}

function buildFieldMap(rateSheet: RateSheet, pool: Pool, region: Region): Record<string, string> {
  // Build the field map per region's template skeleton
  // Per-region logic: which name field to use, which optional sections to include, etc.
  // Reference: docs/research/sprint2-gacha-disclosure-formats.md per-region skeletons
  // ... full implementation in CC commit
  return {};
}

function interpolate(template: string, fields: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => fields[key] ?? "");
}
```

### Template files

Each template file in `src/templates/` is the HTML rendering of the corresponding skeleton from `sprint2-gacha-disclosure-formats.md`. Section C2 native-speaker review will refine these. CC ships V1 with literal renderings of the skeletons; the regulatory-grounding boilerplate at the bottom of each block stays untranslated until C2 review confirms the legal language.

For the CN template, the daily caps statement and 90-day history pointer are mandatory and not conditional. They render whether or not the rate sheet declares them. The 90-day history URL falls through to a "studio must provide" placeholder if `metadata.outcome_history_url` is empty, plus a warning surfaced to the user before export.

---

## Audit-trail JSON generation

### `src/lib/generateAuditJson.ts`

```typescript
import { RateSheet, Region } from "../types/rateSheet";
import { ValidationResult } from "../types/validation";
import { AuditTrail, GeneratedBlock } from "../types/audit";
import { sha256 } from "./hash";

const TOOL_VERSION = "0.1.0"; // sourced from package.json at build time

const DISCLAIMER = "This audit was generated by Qyren Gacha Disclosure Pack. The audit attests to what the studio provided and what was generated, not to legal compliance. The studio is responsible for compliance review before publication.";

export async function generateAuditJson(
  rateSheet: RateSheet,
  regions: Region[],
  validationResults: ValidationResult[],
  renderedBlocks: Map<Region, string>
): Promise<AuditTrail> {
  const canonicalRateSheet = canonicalize(rateSheet);
  const rateSheetHash = await sha256(canonicalRateSheet);

  const generatedBlocks: GeneratedBlock[] = [];
  for (const [region, html] of renderedBlocks) {
    const blockHash = await sha256(html);
    generatedBlocks.push({
      region,
      format: "html",
      block_hash: blockHash,
      block_uri: `disclosure-${region.toLowerCase()}.html`,
    });
  }

  return {
    schema_version: "1.0",
    generated_at: new Date().toISOString(),
    tool_version: TOOL_VERSION,
    rate_sheet_hash: rateSheetHash,
    rate_sheet_metadata: rateSheet.metadata,
    regions_targeted: regions,
    validation_results: validationResults,
    generated_blocks: generatedBlocks,
    disclaimer: DISCLAIMER,
  };
}

function canonicalize(rateSheet: RateSheet): string {
  // Stable JSON serialization with sorted keys for hash reproducibility
  return JSON.stringify(rateSheet, Object.keys(rateSheet).sort());
}
```

### `src/lib/hash.ts`

```typescript
export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
```

---

## Export ZIP generation

### `src/lib/exportZip.ts`

Uses JSZip (already a common dependency; if not in monorepo, CC adds via the appropriate package manager). Client-side ZIP generation, no server roundtrip. Triggers a browser download of the resulting blob.

```typescript
import JSZip from "jszip";
import { RateSheet, Region } from "../types/rateSheet";
import { AuditTrail } from "../types/audit";
import { renderPng } from "./renderPng";

export interface ExportOptions {
  includeHtml: boolean;
  includePng: boolean;
  includeJson: boolean;
}

export async function exportZip(
  rateSheet: RateSheet,
  regions: Region[],
  renderedBlocks: Map<Region, string>,
  auditTrail: AuditTrail,
  options: ExportOptions
): Promise<Blob> {
  const zip = new JSZip();

  if (options.includeHtml) {
    for (const [region, html] of renderedBlocks) {
      zip.file(`disclosure-${region.toLowerCase()}.html`, html);
    }
  }

  if (options.includePng) {
    for (const [region, html] of renderedBlocks) {
      const png = await renderPng(html);
      zip.file(`disclosure-${region.toLowerCase()}.png`, png);
    }
  }

  if (options.includeJson) {
    zip.file("audit-trail.json", JSON.stringify(auditTrail, null, 2));
  }

  zip.file("README.txt", buildReadme(rateSheet, regions, auditTrail));

  return zip.generateAsync({ type: "blob" });
}

function buildReadme(rateSheet: RateSheet, regions: Region[], auditTrail: AuditTrail): string {
  return [
    "Qyren Gacha Disclosure Pack",
    "",
    `Game: ${rateSheet.metadata.game_name_en}`,
    `Generated: ${auditTrail.generated_at}`,
    `Tool version: ${auditTrail.tool_version}`,
    `Rate sheet hash: ${auditTrail.rate_sheet_hash}`,
    "",
    `Regions: ${regions.join(", ")}`,
    "",
    "Files:",
    ...auditTrail.generated_blocks.map(b => `  ${b.block_uri} (${b.format}, hash: ${b.block_hash})`),
    "  audit-trail.json (full audit record)",
    "",
    "Disclaimer: This pack was generated by Qyren Gacha Disclosure Pack. The audit attests",
    "to what was provided and generated, not to legal compliance. The studio is responsible",
    "for compliance review before publication.",
  ].join("\n");
}
```

### `src/lib/renderPng.ts`

PNG generation uses `html-to-image` library or canvas-based rendering. Renders the HTML block at 1080x1920 (mobile portrait, common screenshot dimension). The PNG is intended as a screenshot-friendly disclosure card studios can post on social or in patch notes; it is not the canonical disclosure (the HTML is).

---

## Capture-gate integration

### `src/lib/supabase.ts`

Reuses the existing Supabase client config from the directory app (env vars, table name `leads`). The Pack writes to the same `leads` table with `source = "gacha-disclosure-pack"`.

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface CapturePayload {
  email: string;
  studio_name?: string;
  next_tool_idea?: string;
  usage_summary: {
    regions_covered: string[];
    rate_sheet_size: number;
    disclosure_floors_failed: number;
    export_formats: string[];
  };
}

export async function writeCapture(payload: CapturePayload): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("leads").insert({
    email: payload.email,
    source: "gacha-disclosure-pack",
    studio_name: payload.studio_name,
    next_tool_idea: payload.next_tool_idea,
    usage_summary: payload.usage_summary,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
```

The Resend welcome email triggers via the existing Supabase webhook configured in Sprint 1. No new email infrastructure for this tool; the welcome email template gets a paragraph variant for Pack captures, drafted by Ramesh and updated in the existing Resend template repo.

---

## PostHog event firing

### `src/lib/analytics.ts`

Reuses the existing PostHog client from the directory app. Events fired per the Sprint 2 doc §G1:

```typescript
import posthog from "posthog-js";

export function trackToolLoaded() {
  posthog.capture("tool_loaded", { tool: "gacha-disclosure-pack" });
}

export function trackRateSheetUploaded(poolCount: number, totalItemCount: number, regionsTargeted: string[]) {
  posthog.capture("rate_sheet_uploaded", {
    tool: "gacha-disclosure-pack",
    pool_count: poolCount,
    total_item_count: totalItemCount,
    regions_targeted: regionsTargeted,
  });
}

export function trackValidationCompleted(regionsPassing: string[], regionsFailing: string[], topFailedValidator?: string) {
  posthog.capture("validation_completed", {
    tool: "gacha-disclosure-pack",
    regions_passing: regionsPassing,
    regions_failing: regionsFailing,
    top_failed_validator: topFailedValidator,
  });
}

export function trackValidationFailed(region: string, validatorId: string) {
  posthog.capture("validation_failed", {
    tool: "gacha-disclosure-pack",
    region,
    validator_id: validatorId,
  });
}

export function trackExportAttempted() {
  posthog.capture("export_attempted", { tool: "gacha-disclosure-pack" });
}

export function trackCaptureSubmitted(usageSummary: object) {
  posthog.capture("capture_submitted", {
    tool: "gacha-disclosure-pack",
    source: "gacha-disclosure-pack",
    ...usageSummary,
  });
}

export function trackDisclosureExported(regions: string[], formats: string[]) {
  posthog.capture("disclosure_exported", {
    tool: "gacha-disclosure-pack",
    regions,
    formats,
  });
}
```

Event fire points in the workflow:
- `tool_loaded`: in `ToolPage.tsx` `useEffect` on mount
- `rate_sheet_uploaded`: in `RateSheetUpload` after successful parse
- `validation_completed` and `validation_failed`: in `validate.ts` orchestrator after validators run
- `export_attempted`: in `ExportButtons` when user clicks any export button
- `capture_submitted`: in `CaptureForm` after successful Supabase write
- `disclosure_exported`: in `exportZip.ts` after blob generation

---

## Sample rate sheets

CC commits four sample CSV files to `src/samples/`:

1. `single-banner.csv`: one pool, six items across three rarities, no pity, no banner_id; covers Western and informational JP cases
2. `multi-banner.csv`: three pools each with banner_id, banner_period, and per-banner items; the canonical CN-mode test case
3. `soft-pity.csv`: Genshin-style 90-pull hard pity with soft-pity at 74; the canonical KR-mode test case
4. `hard-pity.csv`: FGO-style hard pity only, no soft-pity; the simpler KR/JP case

Each sample includes `name_ko`, `name_ja`, `name_zh_hans`, `name_tr` columns populated for items relevant to that region's test case. CC writes the samples to be useful both as schema demonstrations AND as the validation engine's unit-test fixtures.

---

## Acceptance criteria for Section B

Section B is complete when ALL of the following are true:

1. Tool routes resolve correctly: `/gacha-disclosure-pack`, `/gacha-disclosure-pack/run`, plus the `/tr/...` and `/cn/...` locale variants
2. The detail page renders with name, description, screenshots, and sample rate sheet downloads
3. The tool page accepts CSV and JSON rate-sheet input via drag-drop and paste
4. Region selection with default KR + JP + CN + EN
5. Output configuration toggles work for HTML/PNG/JSON
6. Validation engine runs all M, KR, CN, JP, W validators and returns structured results
7. Validation results render with green/amber/red color coding and inline suggested-fix text
8. Disclosure block previews render per region in a tabbed UI
9. Three test rate sheets pass validation as expected: clean sheet (all pass), Korean-floor-failing sheet (KR validators fail with specific messages), Chinese-language-coverage-failing sheet (CN3 fails)
10. ZIP export triggers capture-gate before generation
11. Capture form writes to Supabase `leads` table with correct `usage_summary` payload
12. ZIP contains HTML files per region, PNG cards per region, audit-trail JSON, and README.txt
13. Audit-trail JSON validates against the schema in §A6 of the data artifact
14. All seven PostHog events fire at the expected points in the workflow
15. Empty/error states render clearly for malformed rate sheets, missing language coverage, probability sum violations, and zero-region selection
16. The tool's `package.json` declares all dependencies; the build succeeds with `pnpm build` (or whatever the monorepo uses)
17. Source code is committed to the monorepo subfolder under MIT license
18. The directory app surfaces the tool as a `kind: 'built'` card in the Compliance & Disclosure workflow group

Sections C2 (disclosure-block template native-speaker review), F (launch coordination), and the launch-day external-share moment are downstream of Section B acceptance; they do not gate the build itself.

---

## Open implementation decisions for CC to flag

These decisions can resolve during build without further input, but CC should flag back if any feel non-obvious:

- **CSV parsing library**: Papaparse is already a dependency in the directory app (per Sprint 1 Section B reference); reuse it. If unavailable, use the Web standard `Response.text()` plus manual line splitting
- **HTML-to-PNG library**: `html-to-image` (1.x line) is the simplest. If size budget is tight, fall back to a canvas-based renderer
- **i18n library**: reuse whatever the directory app uses (likely `react-i18next` or similar). Do not invent a new i18n system for this tool
- **Rate-sheet template registration**: confirm whether the monorepo has a directory-app manifest file where built tools register their card metadata; if so, register through that manifest rather than hand-coding the card in directory source
- **Tool version source**: read from `package.json` at build time via Vite's `define` or a `vite-plugin-package-version` plugin; do not hard-code

If CC encounters a decision not on this list and not in the sister artifacts, the right move is to ship a single clear choice with a one-line note in the commit message rather than block on a question.

---

*End of Section B build spec. Section A research artifacts are the source of truth for regulatory and format facts; this spec is the source of truth for tool implementation. CC executes against this spec; flag back only on monorepo-layout questions or genuine ambiguity not resolvable from the artifact set.*
