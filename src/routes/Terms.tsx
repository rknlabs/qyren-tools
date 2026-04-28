import { Layout } from '../components/Layout'

export function Terms() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-2 text-fg">Terms</h1>
        <p className="text-sm text-fg-subtle mb-10">Last updated: April 28, 2026</p>

        <div className="space-y-8 text-fg-muted leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">The short version</h2>
            <p>
              The directory is a curated list of free monetization tools, plus
              utilities we build ourselves. Everything is free. We don't promise
              the tools are flawless or that the curated links won't change.
              Don't use anything here in a way that breaks the law or harms
              other people.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Who these terms apply to</h2>
            <p>
              These terms apply to anyone who visits tools.qyren.ai, uses the
              directory, uses a tool we have built ourselves, or signs up for our
              email list. By using the site, you agree to these terms.
            </p>
            <p className="mt-3">
              The site is currently operated by Ramesh Krishnan (Dubai, UAE),
              pre-incorporation. References to "we" and "Qyren" refer to that
              operating entity. Once Qyren incorporates, these terms will be
              updated to reflect the registered entity, and we will notify
              subscribers before the change takes effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">What we provide</h2>

            <p className="font-medium text-fg mt-4 mb-2">A curated directory</p>
            <p>
              The directory lists third-party tools we believe are useful for
              free-to-play monetization operators. Listing a tool is not an
              endorsement of the tool's vendor, the vendor's terms, or the
              vendor's data practices. Each external link opens at your own risk.
              When you click through to a third-party tool, that tool's terms and
              privacy policy govern your use of it, not ours.
            </p>

            <p className="font-medium text-fg mt-6 mb-2">Tools we build ourselves</p>
            <p>
              Some tools on the site are built and hosted by us. They are
              identified with a "Built by Qyren" badge. These are provided free
              of charge, as-is, with no warranty or service-level commitment. We
              try hard to make them work well, but we will not be liable for
              losses that arise from using them.
            </p>

            <p className="font-medium text-fg mt-6 mb-2">Source code</p>
            <p>
              Tools we build are open source under the MIT license. The
              repository lives at github.com/rknlabs/qyren-tools and is mirrored
              to gitee.com/rknlabs/qyren-tools. The MIT license governs your use
              of the source code.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Your responsibilities</h2>
            <p>
              When you use the site or a tool we built, don't:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>Submit information that isn't yours to submit (someone else's email, private credentials, etc.)</li>
              <li>Use the tools to violate any third-party platform's terms (App Store, Google Play, etc.)</li>
              <li>Attempt to break, abuse, or rate-limit the site</li>
              <li>Reverse-engineer, scrape, or systematically harvest data from the directory in ways that interfere with normal operation</li>
              <li>Use the tools or information here for anything illegal under the laws of your jurisdiction or ours</li>
            </ul>
            <p className="mt-3">
              If you're submitting an email address through a capture form, by
              doing so you confirm it's yours and you have the right to receive
              email at that address.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Bring-your-own credentials</h2>
            <p>
              Some tools we build (current and future) accept third-party
              credentials such as App Store Connect API keys, mobile measurement
              partner API keys, or analytics service tokens. When a tool asks for
              such credentials:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>The credentials remain under your control</li>
              <li>We use them only to perform the action you requested</li>
              <li>We do not store them on our servers beyond the duration of the active session, unless the tool explicitly tells you it does and explains why</li>
              <li>You are responsible for the consequences of any action taken using your credentials, including any platform violations or charges</li>
            </ul>
            <p className="mt-3">
              When in doubt, treat any credential you paste into one of our tools
              the same way you would treat one you paste into a script you wrote
              yourself.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">No warranty, limited liability</h2>
            <p>
              Everything on the site is provided "as is" and "as available"
              without warranties of any kind, whether express or implied. We do
              not warrant that the directory's links are accurate, that the tools
              we built are bug-free, that the site will be available without
              interruption, or that the information here will be suitable for
              your specific use case.
            </p>
            <p className="mt-3">
              To the maximum extent permitted by law, we are not liable for any
              indirect, incidental, special, consequential, or punitive damages
              arising from your use of the site, the directory, or the tools.
              This includes loss of revenue, loss of data, business interruption,
              and reputational harm.
            </p>
            <p className="mt-3">
              For tools that take action on your behalf via third-party APIs (for
              example, tools that write to App Store Connect, modify Google Play
              listings, or push schemas to mobile measurement partners), the
              consequences of those actions are yours. Test on a sandbox or a
              non-production catalog first.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Intellectual property</h2>
            <p>
              The "Qyren" name, logo, and brand identity are ours. The directory
              copy, "Qyren take" reviews, and tool descriptions are ours.
              Third-party tool names, logos, and product references belong to
              their respective owners; their inclusion in the directory does not
              imply affiliation or endorsement in either direction.
            </p>
            <p className="mt-3">
              Source code for tools we build is MIT-licensed (see github.com/rknlabs/qyren-tools).
              You can use, modify, and redistribute it under those terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Email and unsubscribing</h2>
            <p>
              When you submit a capture form, you consent to receiving a welcome
              email and occasional updates from us, roughly once or twice a
              month. You can unsubscribe at any time by replying with
              "unsubscribe" or emailing{' '}
              <a href="mailto:support@qyren.ai" className="text-cyan hover:underline">
                support@qyren.ai
              </a>
              . Unsubscribe requests are honored within 5 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Changes to these terms</h2>
            <p>
              We may update these terms over time. The "Last updated" date at the
              top will reflect the most recent change. For significant changes,
              we will notify subscribers by email at least 14 days before the
              change takes effect, where practical. Continued use of the site
              after a change takes effect constitutes acceptance of the updated
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Termination</h2>
            <p>
              We may suspend or remove access to the site, the directory, or any
              tool at any time for any reason, including suspected abuse, legal
              concerns, or vendor changes. We will make a reasonable effort to
              notify affected subscribers when this happens.
            </p>
            <p className="mt-3">
              You can stop using the site at any time. If you'd like your data
              deleted as part of leaving, see the Privacy page or email{' '}
              <a href="mailto:privacy@qyren.ai" className="text-cyan hover:underline">
                privacy@qyren.ai
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Governing law</h2>
            <p>
              These terms are governed by the laws of the United Arab Emirates
              and the Emirate of Dubai, without regard to conflict-of-law
              principles. Any dispute that cannot be resolved through good-faith
              discussion will be subject to the exclusive jurisdiction of the
              courts of Dubai, except where mandatory consumer-protection or
              data-protection laws of your country of residence give you the
              right to bring claims locally.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Severability</h2>
            <p>
              If any part of these terms is found unenforceable by a court of
              competent jurisdiction, the rest remain in effect. The
              unenforceable part will be replaced with a provision that comes
              closest to the original intent and is enforceable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fg mb-3">Contact</h2>
            <p>
              All questions, complaints, takedown requests, and clarifications
              go to{' '}
              <a href="mailto:support@qyren.ai" className="text-cyan hover:underline">
                support@qyren.ai
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </Layout>
  )
}
