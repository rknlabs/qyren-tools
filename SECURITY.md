# Security

## Reporting a vulnerability

Email `security@qyren.ai` (or `ramesh@qyren.ai` if that bounces during initial setup). Please don't open a public GitHub issue for security reports.

Include:

- A description of the issue
- Steps to reproduce
- Affected URL or code path
- Your assessment of impact

We aim to acknowledge within 48 hours and provide an initial response within 5 business days. We don't currently run a paid bug-bounty program. Credit in release notes is given on request for valid reports.

## In scope

- The codebase in this repository
- The live site at [tools.qyren.ai](https://tools.qyren.ai)
- The directory's email-capture flow and any first-party API routes

## Out of scope

- Third-party tools linked from the directory (report to those vendors directly)
- Denial-of-service or volumetric attacks against the live site
- Social engineering of Qyren staff or contractors
- Issues requiring physical access to user devices
- Vulnerabilities in third-party dependencies that have an upstream fix already available

## For contributors

This is a public repository. Anything committed is permanent and is scanned by automated bots within minutes of pushing. Treat the repo accordingly.

**Never commit:**

- `.env`, `.env.local`, `.env.production`
- Supabase service-role keys or JWT secrets
- Resend API keys
- PostHog personal API keys (the project key is fine — designed to be public)
- Any `.p8`, `.pem`, `.key`, `.p12`, `.pfx`, `.cer`, or `.crt` file
- App Store Connect API keys

**Safe to commit:**

- Supabase anon keys (designed for client-side use, gated by Row-Level Security)
- PostHog project keys (designed to be public)
- Vercel project IDs

## If you accidentally commit a secret

1. Rotate it at the vendor immediately. The leaked value is already in bot databases — `git rm` and force-push do not recall it.
2. Notify us at `security@qyren.ai`.
3. Don't try to "delete the commit" before rotating. Rotation comes first; cleanup is secondary.

## Disclosure

We follow coordinated disclosure. Please give us a reasonable window to fix and ship before publishing details. We'll work with you on timeline.
