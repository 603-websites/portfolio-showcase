import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Shield, Clock, DollarSign } from 'lucide-react'
import TextReveal from '../components/TextReveal'
import SectionReveal from '../components/SectionReveal'

const guarantees = [
  { icon: DollarSign, title: 'Lowest Price Guarantee', desc: 'We guarantee you\'ll pay less than what you\'re currently paying — or less than any competing quote. No inflated agency pricing.' },
  { icon: Clock, title: 'Lightning Fast Delivery', desc: 'Most websites go live in 3 days. We don\'t drag things out. You get a professional site, fast.' },
  { icon: Shield, title: '1 Year Free Support', desc: 'Every project includes a full year of free support and updates. We\'re with you long after launch.' },
]

const included = [
  'Professional, custom design tailored to your brand',
  'Works perfectly on phone, tablet, and desktop',
  'Fast-loading pages that rank well on Google',
  'Contact forms and lead capture',
  'Online booking and payments (if you need them)',
  '1 full year of free support, updates, and fixes',
  'You own everything — your site, your code, your domain',
  'No hidden fees, no recurring charges for access',
]

export default function Services() {
  return (
    <main className="pt-24 pb-24">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 mb-24 text-center">
        <SectionReveal>
          <TextReveal as="h1" className="text-4xl md:text-6xl font-extrabold mb-6">
            Simple Pricing, No Surprises
          </TextReveal>
          <p className="text-xl text-text-muted max-w-2xl mx-auto mb-8">
            Tell us what you need and we'll give you an honest quote. We guarantee you'll pay less than what you're currently paying — or less than any other quote you've received.
          </p>
          <Link
            to="/contact"
            data-cursor="pointer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors text-lg"
          >
            Get Your Free Quote <ArrowRight size={20} />
          </Link>
        </SectionReveal>
      </section>

      {/* Guarantees */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <TextReveal as="h2" className="text-3xl md:text-4xl font-extrabold text-center mb-16">
              Our Promise to You
            </TextReveal>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((g, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <g.icon size={28} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">{g.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{g.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <SectionReveal>
            <TextReveal as="h2" className="text-3xl md:text-4xl font-extrabold text-center mb-12">
              What's Included
            </TextReveal>
          </SectionReveal>
          <div className="space-y-4">
            {included.map((item, i) => (
              <SectionReveal key={i} delay={i * 0.05}>
                <div className="flex items-start gap-3 p-4 rounded-xl border border-dark-border bg-dark-light">
                  <CheckCircle size={20} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-text-muted">{item}</span>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionReveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-text-muted mb-8 text-lg">
              Reach out for a free consultation and quote. No pressure, no commitments — just an honest conversation about what you need.
            </p>
            <Link to="/contact" data-cursor="pointer" className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors">
              Get a Free Quote <ArrowRight size={18} />
            </Link>
          </SectionReveal>
        </div>
      </section>
    </main>
  )
}
