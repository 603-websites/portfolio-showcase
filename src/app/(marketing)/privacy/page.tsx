import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Website Upgraders",
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose-sm space-y-6 text-text-muted">
          <p>Last updated: March 2026</p>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, including your
              name, email address, phone number, business name, and project
              details when you fill out our contact form, place an order, or
              create an account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              How We Use Your Information
            </h2>
            <p>
              We use the information we collect to provide, maintain, and improve
              our services, communicate with you about your projects, process
              payments, and send you updates about your website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">Cookies</h2>
            <p>
              We use cookies and similar technologies to maintain your session,
              remember your preferences, and understand how you interact with our
              services. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              Third-Party Services
            </h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong className="text-text">Stripe</strong>: for payment
                processing
              </li>
              <li>
                <strong className="text-text">Supabase</strong>: for
                authentication and data storage
              </li>
              <li>
                <strong className="text-text">Vercel</strong>: for website
                hosting and deployment
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              Data Retention
            </h2>
            <p>
              We retain your personal information for as long as your account is
              active or as needed to provide you services. You can request
              deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">
              Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal
              information. You may also opt out of marketing communications at
              any time. Contact us at louissader42@gmail.com to exercise these
              rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mb-3">Contact</h2>
            <p>
              If you have questions about this privacy policy, contact us at{" "}
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
