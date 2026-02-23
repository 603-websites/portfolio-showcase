import TextReveal from '../components/TextReveal'
import SectionReveal from '../components/SectionReveal'

export default function Terms() {
  return (
    <main className="pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <SectionReveal>
          <TextReveal as="h1" className="text-4xl md:text-5xl font-extrabold mb-8">
            Terms of Service
          </TextReveal>
          <p className="text-sm text-text-dim mb-12">Last updated: February 2026</p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="prose-invert space-y-8 text-text-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-text mb-3">1. Services</h2>
              <p>Sader & Carter Web Development provides custom web development services including but not limited to booking platforms, SaaS applications, portfolio websites, and web application maintenance. The specific scope of work for each project is defined in individual project agreements.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">2. Use of This Website</h2>
              <p>This website is provided for informational purposes about our services and portfolio. By using this website, you agree not to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Attempt to interfere with the website's operation</li>
                <li>Submit false or misleading information through our contact form</li>
                <li>Use the website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any part of the website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">3. Intellectual Property</h2>
              <p>All content on this website, including text, images, design elements, and code, is the property of Sader & Carter Web Development unless otherwise noted. Project screenshots and descriptions are used with client permission.</p>
              <p className="mt-2">For client projects, intellectual property ownership is defined in individual project agreements. Generally, clients receive full ownership of the custom code developed for their projects upon final payment.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">4. White-Label Licensing</h2>
              <p>SaaS templates offered under white-label licensing are subject to separate licensing agreements. Licensing terms, usage rights, and restrictions are detailed in the specific licensing agreement for each template.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">5. Limitation of Liability</h2>
              <p>Sader & Carter Web Development provides this website and its content "as is" without warranties of any kind. We are not liable for any damages arising from the use of this website or reliance on the information provided.</p>
              <p className="mt-2">For project-specific liability terms, refer to your individual project agreement.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">6. Contact Form Submissions</h2>
              <p>Information submitted through our contact form is used solely for the purpose of responding to your inquiry. See our Privacy Policy for details on data handling.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">7. Changes to These Terms</h2>
              <p>We reserve the right to update these terms at any time. Changes will be posted on this page with an updated revision date.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">8. Contact</h2>
              <p>Questions about these terms? Contact us at <a href="mailto:louissader42@gmail.com" className="text-accent hover:text-accent-hover transition-colors" data-cursor="pointer">louissader42@gmail.com</a>.</p>
            </section>
          </div>
        </SectionReveal>
      </div>
    </main>
  )
}
