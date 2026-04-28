import { Layout } from '../components/Layout'
import { SEO } from '../components/SEO'

export function Privacy() {
  return (
    <Layout>
      <SEO
        title="Privacy"
        description="How we handle your data at tools.qyren.ai. Email captures, anonymized usage, retention windows, and your rights."
        path="/privacy"
        locale="en"
      />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-2 text-fg">Privacy</h1>
        <p className="text-sm text-fg-subtle mb-10">Last updated: April 28, 2026</p>

        <div className="space-y-8 text-fg-muted leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">The short version</h2>
            <p>
              We capture email addresses you choose to give us. We log anonymized
              tool usage so we can decide what to build next. We don't sell, rent,
              or share your data with third parties for marketing. You can ask us
              to delete your data at any time by emailing{' '}
              <a href="mailto:privacy@qyren.ai" className="text-cyan hover:underline">
                privacy@qyren.ai
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Who we are</h2>
            <p>
              Qyren is a monetization-infrastructure project for free-to-play game
              studios. The tools surface at tools.qyren.ai is a free directory of
              utilities for monetization operators, plus utilities we build
              ourselves. The project is currently operated by Ramesh Krishnan
              (Dubai, UAE), pre-incorporation. References to "we" and "Qyren" in
              this document refer to that operating entity.
            </p>
            <p className="mt-3">
              When Qyren incorporates as a registered legal entity, this policy
              will be updated to name the entity as data controller. The substance
              of how we treat your data will not change.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">What we collect</h2>

            <p className="font-medium text-fg mt-4 mb-2">When you submit an email through a capture form:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Your email address</li>
              <li>The slug of the tool or page you submitted from</li>
              <li>Your selected locale (English, Turkish, or Simplified Chinese)</li>
              <li>The HTTP referrer header (which page sent the request)</li>
              <li>Your browser's user-agent string</li>
              <li>The timestamp of the submission</li>
            </ul>

            <p className="font-medium text-fg mt-6 mb-2">When you use a tool we built (e.g. the PPP+FX-Drift Localizer, when it ships):</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>An anonymized session identifier (a hash, not tied to you personally)</li>
              <li>The tool you used</li>
              <li>The action you performed (viewed, computed, exported)</li>
              <li>A structural summary of the action (e.g. "computed 12 currency repricings"), without the underlying input data</li>
            </ul>

            <p className="font-medium text-fg mt-6 mb-2">Standard analytics, via PostHog:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Pages viewed</li>
              <li>Approximate geographic region (country-level, derived from IP)</li>
              <li>Browser, operating system, and device type</li>
              <li>How you arrived at the site (referrer)</li>
            </ul>
            <p className="mt-3">
              We do not use cross-site tracking pixels, advertising cookies, or
              fingerprinting. We do not sell or share any of this data with
              advertising networks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Why we collect it</h2>
            <p>Three reasons, in plain terms:</p>
            <ol className="list-decimal pl-5 space-y-1.5 mt-3">
              <li>
                <span className="font-medium text-fg">To send you the welcome email and occasional updates.</span>{' '}
                Roughly once or twice a month, framed around tool launches and
                pain-story posts. You can unsubscribe by replying with
                "unsubscribe" or emailing{' '}
                <a href="mailto:support@qyren.ai" className="text-cyan hover:underline">
                  support@qyren.ai
                </a>
                .
              </li>
              <li>
                <span className="font-medium text-fg">To decide what to build next.</span>{' '}
                If 200 people sign up via a tool card titled "iOS IAP Bulk Editor,"
                that tells us where to focus. We use aggregated capture data to
                prioritize the build queue.
              </li>
              <li>
                <span className="font-medium text-fg">To improve the tools themselves.</span>{' '}
                Anonymized usage logs let us see which features land and which
                don't. We do not analyze individual user behavior; we look at
                aggregate patterns.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Where your data lives</h2>
            <p>
              Email captures and usage logs are stored in Supabase, hosted in
              Frankfurt, Germany (EU). Welcome and update emails are sent through
              Resend. Web analytics flow through PostHog Cloud. Site infrastructure
              runs on Vercel.
            </p>
            <p className="mt-3">
              Each of these vendors has its own data-protection terms. We selected
              them in part because their default postures are aligned with GDPR
              and similar frameworks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">How long we keep it</h2>
            <p>
              Email captures are kept indefinitely while you remain subscribed.
              When you unsubscribe, we mark the record inactive and stop sending,
              but keep the row for up to 24 months for fraud prevention and audit
              purposes. After that, the record is fully deleted unless we have a
              specific legal reason to retain it. You can request immediate full
              deletion at any time.
            </p>
            <p className="mt-3">
              Anonymized tool-usage logs are aggregated and the per-session detail
              is deleted after 90 days. Aggregate counts (e.g. "the localizer ran
              4,200 times last month") may be retained beyond that.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Your rights</h2>
            <p>
              You can:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>See what data we hold about you</li>
              <li>Correct anything that's wrong</li>
              <li>Have it deleted</li>
              <li>Export it in a portable format</li>
              <li>Withdraw consent for any future processing</li>
              <li>Object to specific processing activities</li>
            </ul>
            <p className="mt-3">
              Email{' '}
              <a href="mailto:privacy@qyren.ai" className="text-cyan hover:underline">
                privacy@qyren.ai
              </a>
              {' '}with the request. We respond within 30 days. There is no fee for
              reasonable requests.
            </p>
            <p className="mt-3">
              These rights are aligned with the UAE Personal Data Protection Law
              (PDPL Federal Decree-Law No. 45 of 2021) and with the EU General
              Data Protection Regulation (GDPR), whichever applies to your
              circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Cookies and similar technologies</h2>
            <p>
              We use a minimal set:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>
                A theme preference stored in localStorage (so the site remembers
                whether you chose light or dark mode). This stays on your device
                and is never sent to us.
              </li>
              <li>
                PostHog analytics cookies for measuring site visits in aggregate.
                You can opt out via the controls in your browser or by using a
                privacy-focused browser extension.
              </li>
            </ul>
            <p className="mt-3">
              We do not use advertising cookies, retargeting pixels, or
              third-party tracking beyond standard analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Children</h2>
            <p>
              Qyren Tools is built for monetization operators at game studios. It
              is not directed to children, and we do not knowingly collect data
              from anyone under 16. If you believe a child has submitted data to
              us, email{' '}
              <a href="mailto:privacy@qyren.ai" className="text-cyan hover:underline">
                privacy@qyren.ai
              </a>
              {' '}and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Changes to this policy</h2>
            <p>
              When we update this policy, the "Last updated" date at the top will
              change. For significant changes (new categories of data, new
              processing purposes, new third-party processors), we will notify
              subscribers by email before the change takes effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Contact</h2>
            <p>
              All privacy questions, data requests, and complaints go to{' '}
              <a href="mailto:privacy@qyren.ai" className="text-cyan hover:underline">
                privacy@qyren.ai
              </a>
              . We aim to acknowledge within 5 business days and resolve within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Jurisdiction</h2>
            <p>
              This policy is governed by the laws of the United Arab Emirates and
              the Emirate of Dubai, without regard to conflict of law principles.
              For visitors in the European Union, your local data-protection
              regulator may also have jurisdiction over disputes involving your
              personal data.
            </p>
          </section>

        </div>
      </div>
    </Layout>
  )
}
