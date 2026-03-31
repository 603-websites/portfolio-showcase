import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/marketing/ContactForm";
import SectionReveal from "@/components/marketing/SectionReveal";

export const metadata: Metadata = {
  title: "Contact | Website Upgraders",
  description: "Get in touch with Website Upgraders. Free consultation for small business website design, development, and management.",
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionReveal>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-text-muted text-lg mb-12 max-w-2xl">
            Have a project in mind? Fill out the form and we&apos;ll get back to
            you within 24 hours.
          </p>
        </SectionReveal>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SectionReveal delay={0.1}>
              <div className="bg-dark-light border border-dark-border rounded-2xl p-6 md:p-8">
                <ContactForm />
              </div>
            </SectionReveal>
          </div>

          <div className="space-y-6">
            <SectionReveal delay={0.2}>
              <div className="bg-dark-light border border-dark-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Direct Contact</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:louissader42@gmail.com"
                    className="flex items-center gap-3 text-text-muted hover:text-text transition"
                  >
                    <Mail className="w-5 h-5 text-accent" />
                    louissader42@gmail.com
                  </a>
                  <a
                    href="tel:+16032757513"
                    className="flex items-center gap-3 text-text-muted hover:text-text transition"
                  >
                    <Phone className="w-5 h-5 text-accent" />
                    (603) 275-7513
                  </a>
                  <div className="flex items-center gap-3 text-text-muted">
                    <MapPin className="w-5 h-5 text-accent" />
                    New England, United States
                  </div>
                  <div className="flex items-center gap-3 text-text-muted">
                    <Clock className="w-5 h-5 text-accent" />
                    Within 24 hours (EST)
                  </div>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.3}>
              <div className="bg-dark-light border border-dark-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-text-dim text-xs uppercase mb-1">
                      Louis Sader
                    </p>
                    <div className="flex gap-3">
                      <a
                        href="https://linkedin.com/in/louis-sader-a6a391287/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-accent transition"
                      >
                        LinkedIn
                      </a>
                      <a
                        href="https://github.com/louissader"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-accent transition"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-text-dim text-xs uppercase mb-1">
                      Logan Carter
                    </p>
                    <div className="flex gap-3">
                      <a
                        href="https://linkedin.com/in/logan-carter-35h/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-accent transition"
                      >
                        LinkedIn
                      </a>
                      <a
                        href="https://github.com/Logan566C"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-accent transition"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.4}>
              <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-2">Best for</h3>
                <p className="text-text-muted text-sm">
                  New projects, questions about our services, support requests
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
