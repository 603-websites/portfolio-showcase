import { Mail, Phone, MapPin, Clock, Linkedin, Github } from 'lucide-react'
import TextReveal from '../components/TextReveal'
import SectionReveal from '../components/SectionReveal'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <main className="pt-24 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <SectionReveal>
          <TextReveal as="h1" className="text-4xl md:text-6xl font-extrabold mb-4">
            Let's Build Something Great
          </TextReveal>
          <p className="text-xl text-text-muted max-w-2xl">
            Tell us about your project and let's see if we're a good fit.
          </p>
        </SectionReveal>
      </section>

      {/* Two column layout */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <SectionReveal>
              <div className="bg-dark-light border border-dark-border rounded-2xl p-8">
                <ContactForm />
              </div>
            </SectionReveal>
          </div>

          {/* Contact Info */}
          <div>
            <SectionReveal delay={0.1}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-text mb-4">Direct Contact</h3>
                  <div className="space-y-4">
                    <a href="mailto:louissader42@gmail.com" data-cursor="pointer" className="flex items-center gap-3 text-text-muted hover:text-text transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Mail size={18} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">Email</p>
                        <p className="text-sm text-text-muted">louissader42@gmail.com</p>
                      </div>
                    </a>
                    <a href="tel:+16032757513" data-cursor="pointer" className="flex items-center gap-3 text-text-muted hover:text-text transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Phone size={18} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">Phone</p>
                        <p className="text-sm text-text-muted">(603) 275-7513</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">Location</p>
                        <p className="text-sm text-text-muted">New England, United States</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Clock size={18} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">Response Time</p>
                        <p className="text-sm text-text-muted">Within 24 hours (EST)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-text mb-4">Connect</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-text-dim uppercase tracking-wider mb-2">Louis Sader</p>
                      <div className="flex gap-3">
                        <a href="https://www.linkedin.com/in/louis-sader-a6a391287/" target="_blank" rel="noopener noreferrer" data-cursor="pointer" className="w-10 h-10 rounded-lg bg-dark-lighter border border-dark-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors">
                          <Linkedin size={18} />
                        </a>
                        <a href="https://github.com/louissader" target="_blank" rel="noopener noreferrer" data-cursor="pointer" className="w-10 h-10 rounded-lg bg-dark-lighter border border-dark-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors">
                          <Github size={18} />
                        </a>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-text-dim uppercase tracking-wider mb-2">Logan Carter</p>
                      <div className="flex gap-3">
                        <a href="https://www.linkedin.com/in/logan-carter-35h/" target="_blank" rel="noopener noreferrer" data-cursor="pointer" className="w-10 h-10 rounded-lg bg-dark-lighter border border-dark-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors">
                          <Linkedin size={18} />
                        </a>
                        <a href="https://github.com/Logan566C" target="_blank" rel="noopener noreferrer" data-cursor="pointer" className="w-10 h-10 rounded-lg bg-dark-lighter border border-dark-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors">
                          <Github size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-dark-lighter border border-dark-border">
                  <h4 className="text-sm font-semibold text-text mb-2">Best for</h4>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Quick questions, project inquiries, partnership opportunities, and SaaS template licensing.
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </main>
  )
}
