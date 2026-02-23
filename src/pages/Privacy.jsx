import TextReveal from '../components/TextReveal'
import SectionReveal from '../components/SectionReveal'

export default function Privacy() {
  return (
    <main className="pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <SectionReveal>
          <TextReveal as="h1" className="text-4xl md:text-5xl font-extrabold mb-8">
            Privacy Policy
          </TextReveal>
          <p className="text-sm text-text-dim mb-12">Last updated: February 2026</p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="prose-invert space-y-8 text-text-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-text mb-3">1. Information We Collect</h2>
              <p>When you use our contact form, we collect the following information:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Name and email address</li>
                <li>Company or business name (if provided)</li>
                <li>Project details and requirements you describe</li>
                <li>Your preferred contact method and phone number (if provided)</li>
                <li>IP address (for spam prevention)</li>
              </ul>
              <p className="mt-2">We also automatically collect standard web analytics data including browser type, device information, and pages visited.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Respond to your project inquiries and communicate with you</li>
                <li>Understand our website traffic and improve our services</li>
                <li>Prevent spam and abuse of our contact form</li>
                <li>Send project-related communications you've requested</li>
              </ul>
              <p className="mt-2">We will never sell your personal information to third parties or use it for unsolicited marketing.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">3. Third-Party Services</h2>
              <p>We use the following third-party services to operate our website:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Supabase</strong> — Database hosting for contact form submissions</li>
                <li><strong>Vercel</strong> — Website hosting, deployment, and analytics</li>
                <li><strong>Google Fonts</strong> — Web font delivery</li>
              </ul>
              <p className="mt-2">Each of these services has their own privacy policy governing their handling of data.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">4. Data Retention</h2>
              <p>Contact form submissions are retained for as long as necessary to respond to your inquiry and for our legitimate business records. You may request deletion of your data at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Request access to the personal data we hold about you</li>
                <li>Request correction of any inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to the processing of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">6. Cookies</h2>
              <p>Our website uses essential cookies required for the site to function properly. We do not use third-party tracking cookies or advertising cookies.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">7. Contact</h2>
              <p>For privacy-related questions, contact us at <a href="mailto:louissader42@gmail.com" className="text-accent hover:text-accent-hover transition-colors" data-cursor="pointer">louissader42@gmail.com</a>.</p>
            </section>
          </div>
        </SectionReveal>
      </div>
    </main>
  )
}
