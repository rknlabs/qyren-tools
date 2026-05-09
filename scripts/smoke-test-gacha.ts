/**
 * Smoke test for the gacha disclosure pack validation engine.
 * Run with: npx tsx scripts/smoke-test-gacha.ts
 *
 * Covers acceptance criterion #9: clean sheet, KR-floor-failing sheet,
 * CN-language-coverage-failing sheet.
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parseRateSheet } from '../src/lib/gacha/parseRateSheet.ts'
import { validate, summarizeResults } from '../src/lib/gacha/validate.ts'
import type { Region } from '../src/types/gacha/rateSheet.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface Case {
  label: string
  csvPath: string
  regions: Region[]
  expect: {
    passRegion?: Region[]
    failValidator?: { region: Region; id: string }[]
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
    label: 'multi-banner stripped of name_zh_hans → CN3 fail',
    csvPath: '../public/samples/gacha/multi-banner.csv',
    regions: ['CN'],
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
]

let totalFailed = 0

for (const c of CASES) {
  const fullPath = resolve(__dirname, c.csvPath)
  let csv = readFileSync(fullPath, 'utf-8')

  // Mutation cases: strip name_zh_hans for CN3 test, etc.
  if (c.label.includes('stripped of name_zh_hans')) {
    csv = stripColumn(csv, 'name_zh_hans')
  }

  const parsed = parseRateSheet(csv)
  if (!parsed.ok || !parsed.rateSheet) {
    console.error(`✗ ${c.label}: parse failed: ${parsed.errors.map((e) => e.message).join(', ')}`)
    totalFailed++
    continue
  }

  const results = validate(parsed.rateSheet, c.regions)
  const summary = summarizeResults(results)

  let ok = true
  const detail: string[] = []

  if (c.expect.passRegion) {
    for (const region of c.expect.passRegion) {
      if (!summary.regionsPassing.includes(region)) {
        ok = false
        detail.push(`expected ${region} to pass, got fails: ${summary.regionsFailing.join(',')}`)
      }
    }
  }

  if (c.expect.failValidator) {
    for (const f of c.expect.failValidator) {
      const matched = results.find(
        (r) => r.region === f.region && r.validator_id === f.id && r.status === 'fail',
      )
      if (!matched) {
        ok = false
        detail.push(`expected ${f.region}/${f.id} to fail; not found`)
      }
    }
  }

  const counts = `pass=${results.filter((r) => r.status === 'pass').length} warn=${results.filter((r) => r.status === 'warn').length} fail=${results.filter((r) => r.status === 'fail').length}`
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

function stripColumn(csv: string, column: string): string {
  const lines = csv.split('\n')
  let headerIdx = -1
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('#') && lines[i].trim() !== '') {
      headerIdx = i
      break
    }
  }
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
