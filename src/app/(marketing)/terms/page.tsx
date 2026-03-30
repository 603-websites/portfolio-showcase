import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | 603 Websites",
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose-sm space-y-6 text-text-muted">
          <p>Last updated: March 2026</p>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              Service Description
            </h2>
            <p>
              603 Websites (&quot;Sader &amp; Carter Web Development&quot;)
              provides managed website design, development, hosting, and ongoing
              maintenance services through monthly subscription plans.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              Subscription Terms
            </h2>
            <p>
              Subscriptions are billed monthly and include a one-time setup fee.
              Your subscription will automatically renew each month unless
              cancelled. All plans include hosting, SSL, and a set number of
              monthly update hours based on your plan tier.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              Payment Terms
            </h2>
            <p>
              Payments are processed through Stripe. You agree to provide
              accurate billing information and authorize us to charge your
              payment method on a recurring monthly basis. Failed payments may
              result in service suspension.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              Cancellation
            </h2>
            <p>
              You may cancel your subscription at any time. Cancellation takes
              effect at the end of your current billing period. No refunds are
              provided for partial months or setup fees. Upon cancellation, your
              website will remain accessible for 30 days before being taken
              offline.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              Intellectual Property
            </h2>
            <p>
              You retain ownership of all content you provide (text, images,
              logos). We retain ownership of our code, design templates, and
              development tools. Upon full payment of the setup fee, you receive
              a perpetual license to use the custom design we create for you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              Limitation of Liability
            </h2>
            <p>
              We provide our services &quot;as is&quot; and make no warranties
              regarding uptime, although we target 99.9% availability. Our total
              liability is limited to the amount you&apos;ve paid us in the
              preceding 3 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. We will notify you of
              any material changes via email or through our platform. Continued
              use of our services after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">Contact</h2>
            <p>
              Questions about these terms? Email us at{" "}
              <a
                href="mailto:louissader42@gmail.com"
                className="text-accent hover:underline"
              >
                louissader42@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
