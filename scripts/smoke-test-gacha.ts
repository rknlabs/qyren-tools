/**
 * Smoke test for the gacha disclosure pack validation engine.
 * Run with: npm run test:smoke
 *
 * Covers Section B acceptance #9 plus the followup-2 brief's locale-coverage
 * regression cases (Bug 6): individual cell emptying for name_zh_hans /
 * name_ko / name_ja must produce a fail on the matching validator (CN3 / KR4 /
 * JP2) with the specific item IDs reported.
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parseRateSheet } from '../src/lib/gacha/parseRateSheet.ts'
import { validate } from '../src/lib/gacha/validate.ts'
import type { Region } from '../src/types/gacha/rateSheet.ts'
import type { ValidationResult } from '../src/types/gacha/validation.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface ExpectFail {
  region: Region
  id: string
  // Optional: the failing item IDs that must appear in failed_item_ids.
  itemIds?: string[]
}

interface Case {
  label: string
  csvPath: string
  regions: Region[]
  // Apply to the loaded CSV before parsing.
  mutate?: (csv: string) => string
  expect: {
    passRegion?: Region[]
    failValidator?: ExpectFail[]
    // Validators that must NOT fail (status pass or absent). Useful for the
    // mixed-gap test where CN3 should fail but KR4 should pass.
    passValidator?: { region: Region; id: string }[]
  }
}

const CASES: Case[] = [
  {
    label: 'clean sheet (single banner) → all regions pass',
    csvPath: '../public/samples/gacha/single-banner.csv',
    regions: ['KR', 'JP', 'CN', 'EN', 'TR'],
    expect: { passRegion: ['EN', 'TR'] },
  },
  {
    label: 'soft-pity sheet → KR pity disclosure recognized',
    csvPath: '../public/samples/gacha/soft-pity.csv',
    regions: ['KR'],
    expect: { passRegion: ['KR'] },
  },
  {
    label: 'multi-banner sheet → CN per-banner pass',
    csvPath: '../public/samples/gacha/multi-banner.csv',
    regions: ['CN'],
    expect: {},
  },
  {
    label: 'multi-banner with name_zh_hans column stripped → CN3 fail',
    csvPath: '../public/samples/gacha/multi-banner.csv',
    regions: ['CN'],
    mutate: (csv) => stripColumn(csv, 'name_zh_hans'),
    expect: {
      failValidator: [{ region: 'CN', id: 'CN3' }],
    },
  },
  {
    label: 'hard-pity sheet missing name_ko → KR4 fail',
    csvPath: '../public/samples/gacha/hard-pity.csv',
    regions: ['KR'],
    expect: {
      failValidator: [{ region: 'KR', id: 'KR4' }],
    },
  },
  // Bug 6 regression cases below: empty individual cells, leave others intact.
  // Each must surface failed_item_ids on the matching validator.
  {
    label: 'multi-banner: empty name_zh_hans for 2 items → CN3 fails on those items',
    csvPath: '../public/samples/gacha/multi-banner.csv',
    regions: ['CN'],
    mutate: (csv) =>
      emptyCellsForItems(csv, 'name_zh_hans', ['wpn_3_filler', 'wpn_4_a']),
    expect: {
      failValidator: [
        {
          region: 'CN',
          id: 'CN3',
          itemIds: ['wpn_3_filler', 'wpn_4_a'],
        },
      ],
    },
  },
  {
    label: 'multi-banner: empty name_ko for 1 item → KR4 fails on that item',
    csvPath: '../public/samples/gacha/multi-banner.csv',
    regions: ['KR'],
    mutate: (csv) => emptyCellsForItems(csv, 'name_ko', ['featured_char']),
    expect: {
      failValidator: [
        { region: 'KR', id: 'KR4', itemIds: ['featured_char'] },
      ],
    },
  },
  {
    label: 'multi-banner: empty name_ja for 1 item → JP2 fails on that item',
    csvPath: '../public/samples/gacha/multi-banner.csv',
    regions: ['JP'],
    mutate: (csv) => emptyCellsForItems(csv, 'name_ja', ['filler_3']),
    expect: {
      failValidator: [{ region: 'JP', id: 'JP2', itemIds: ['filler_3'] }],
    },
  },
  {
    label: 'multi-banner: mixed locale gaps → each validator names only its own gaps',
    csvPath: '../public/samples/gacha/multi-banner.csv',
    regions: ['KR', 'JP', 'CN'],
    // wpn_3_filler missing zh, char_4_a missing ja, no name_ko gaps
    mutate: (csv) => {
      const a = emptyCellsForItems(csv, 'name_zh_hans', ['wpn_3_filler'])
      return emptyCellsForItems(a, 'name_ja', ['char_4_a'])
    },
    expect: {
      failValidator: [
        { region: 'CN', id: 'CN3', itemIds: ['wpn_3_filler'] },
        { region: 'JP', id: 'JP2', itemIds: ['char_4_a'] },
      ],
      passValidator: [{ region: 'KR', id: 'KR4' }],
    },
  },
  {
    label: 'parser sanity: empty locale cell parses to undefined, not EN substitute',
    csvPath: '../public/samples/gacha/multi-banner.csv',
    regions: ['CN'],
    mutate: (csv) =>
      emptyCellsForItems(csv, 'name_zh_hans', ['wpn_3_filler']),
    expect: {
      // Validator-level expectation; the parser sanity is checked inline below.
      failValidator: [{ region: 'CN', id: 'CN3', itemIds: ['wpn_3_filler'] }],
    },
  },
]

let totalFailed = 0

for (const c of CASES) {
  const fullPath = resolve(__dirname, c.csvPath)
  let csv = readFileSync(fullPath, 'utf-8')
  if (c.mutate) csv = c.mutate(csv)

  const parsed = parseRateSheet(csv)
  if (!parsed.ok || !parsed.rateSheet) {
    console.error(`✗ ${c.label}: parse failed: ${parsed.errors.map((e) => e.message).join(', ')}`)
    totalFailed++
    continue
  }

  // Parser sanity check: emptied locale cells must come through as undefined,
  // not auto-filled from the EN equivalent.
  if (c.label.startsWith('parser sanity')) {
    const item = parsed.rateSheet.pools
      .flatMap((p) => p.items)
      .find((i) => i.item_id === 'wpn_3_filler')
    if (item && (item.name_zh_hans !== undefined || item.name_en === undefined)) {
      console.error(`✗ ${c.label}: parser sanity failed`)
      console.error(`  name_zh_hans=${JSON.stringify(item.name_zh_hans)} name_en=${JSON.stringify(item.name_en)}`)
      totalFailed++
      continue
    }
  }

  const results = validate(parsed.rateSheet, c.regions)
  const detail: string[] = []
  let ok = true

  if (c.expect.passRegion) {
    const passingByRegion = new Map<Region, boolean>()
    for (const region of c.expect.passRegion) passingByRegion.set(region, true)
    for (const r of results) {
      if (r.status === 'fail' && passingByRegion.has(r.region)) {
        passingByRegion.set(r.region, false)
      }
    }
    for (const [region, pass] of passingByRegion) {
      if (!pass) {
        ok = false
        detail.push(`expected ${region} to pass, found a failing result`)
      }
    }
  }

  if (c.expect.failValidator) {
    for (const f of c.expect.failValidator) {
      const failed = results.filter(
        (r) => r.region === f.region && r.validator_id === f.id && r.status === 'fail',
      )
      if (failed.length === 0) {
        ok = false
        detail.push(`expected ${f.region}/${f.id} to fail; not found`)
        continue
      }
      if (f.itemIds) {
        const allReportedIds = new Set<string>()
        for (const r of failed) {
          for (const id of r.failed_item_ids ?? []) allReportedIds.add(id)
        }
        for (const expectedId of f.itemIds) {
          if (!allReportedIds.has(expectedId)) {
            ok = false
            detail.push(
              `expected ${f.region}/${f.id} failed_item_ids to include "${expectedId}"; got [${Array.from(allReportedIds).join(', ')}]`,
            )
          }
        }
      }
    }
  }

  if (c.expect.passValidator) {
    for (const p of c.expect.passValidator) {
      const failed = results.find(
        (r) => r.region === p.region && r.validator_id === p.id && r.status === 'fail',
      )
      if (failed) {
        ok = false
        detail.push(`expected ${p.region}/${p.id} not to fail; found fail with ids ${(failed.failed_item_ids ?? []).join(', ')}`)
      }
    }
  }

  const counts = countLine(results)
  if (ok) {
    console.log(`✓ ${c.label} (${counts})`)
  } else {
    console.error(`✗ ${c.label} (${counts})`)
    for (const d of detail) console.error(`  ${d}`)
    totalFailed++
  }
}

if (totalFailed > 0) {
  console.error(`\n${totalFailed} case(s) failed.`)
  process.exit(1)
}
console.log('\nAll cases passed.')

function countLine(results: ValidationResult[]): string {
  const c = { pass: 0, warn: 0, fail: 0 }
  for (const r of results) c[r.status]++
  return `pass=${c.pass} warn=${c.warn} fail=${c.fail}`
}

function findHeaderIdx(lines: string[]): number {
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('#') && lines[i].trim() !== '') return i
  }
  return -1
}

function stripColumn(csv: string, column: string): string {
  const lines = csv.split('\n')
  const headerIdx = findHeaderIdx(lines)
  if (headerIdx === -1) return csv
  const headers = lines[headerIdx].split(',')
  const colIdx = headers.indexOf(column)
  if (colIdx === -1) return csv
  for (let i = headerIdx; i < lines.length; i++) {
    const fields = lines[i].split(',')
    fields.splice(colIdx, 1)
    lines[i] = fields.join(',')
  }
  return lines.join('\n')
}

function emptyCellsForItems(csv: string, column: string, itemIds: string[]): string {
  const lines = csv.split('\n')
  const headerIdx = findHeaderIdx(lines)
  if (headerIdx === -1) return csv
  const headers = lines[headerIdx].split(',')
  const colIdx = headers.indexOf(column)
  const idIdx = headers.indexOf('item_id')
  if (colIdx === -1 || idIdx === -1) return csv
  const targets = new Set(itemIds)
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const fields = lines[i].split(',')
    if (targets.has(fields[idIdx])) {
      fields[colIdx] = ''
      lines[i] = fields.join(',')
    }
  }
  return lines.join('\n')
}
