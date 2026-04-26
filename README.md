# qyren-tools

Free tools for free-to-play monetization operators. Built and curated by [Qyren](https://qyren.ai).

This repo powers [tools.qyren.ai](https://tools.qyren.ai), a directory of free utilities for F2P monetization work, plus tools we build ourselves when the gaps are too big to point at.

> **Status**: Initial build. The directory site is not yet live. This README will be updated as Sprint 1 ships.

## What this is

A two-part program:

1. **A curated directory** of existing free tools for IAP catalog management, SKAN attribution, A/B testing, LTV modeling, pricing localization, and LiveOps. Pointing at the best of what already exists so operators don't have to re-discover it every quarter.

2. **Tools we build ourselves**, one at a time, where the gap is real and unowned. Sequence is data-informed. The directory's traffic and capture data tell us which gap to fill next.

## Why

F2P monetization has identifiable workflow gaps that big vendors haven't filled, including bulk IAP editing on iOS, PPP-aware price localization, conversion-value schema design, and FX-drift handling for high-volatility currencies. Each is solvable. Each, shipped well, saves an operator hours per week.

We're betting that tools earn trust faster than content does. The pattern is empirically validated by PostHog, Ahrefs, GrowthBook, and others. Free utilities rank for high-intent keywords, get adopted into daily workflow, and the vendor becomes the trusted infrastructure layer.

## Roadmap (rough, in build order)

- Curated directory with English, Turkish, and Simplified Chinese surfaces
- PPP + FX-drift price localizer
- iOS IAP bulk editor
- Turkish state incentive (10962 sayılı Cumhurbaşkanlığı Kararnamesi) reimbursement tracker
- Gacha probability validator with CN / KR / JP statutory disclosure output
- SKAN 5 conversion-value schema designer

We ship one at a time. We don't pre-commit beyond the next milestone.

## Mirror

This repo is mirrored to [Gitee](https://gitee.com/rknlabs/qyren-tools) for visitors who can't reach GitHub reliably. The mirror is one-way and updates on every push to `main`.

## Local development

Documentation will land here once the Vite scaffold is in place. If you're reading this before that section is filled in, the repo is at the very start of Sprint 1.

## License

MIT. See [LICENSE](./LICENSE).

## Contributing

Curation suggestions (free tools that should be in the directory and aren't), bug reports, and small PRs are welcome.

For anything larger than a typo fix, please open an issue first. The program has explicit scope decisions about what's in, what's deferred, and what's deliberately rejected, and those aren't always obvious from the code alone. A quick conversation saves work on both sides.

## Security

If you find a security issue, please don't open a public issue. See [SECURITY.md](./SECURITY.md) for how to report it.

## Contact

Ramesh, `ramesh@qyren.ai`.
