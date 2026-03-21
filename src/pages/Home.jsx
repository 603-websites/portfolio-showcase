import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Shield, CheckCircle, MessageSquare, Palette, Rocket } from 'lucide-react'
import SectionReveal from '../components/SectionReveal'
import ProjectBrowser from '../components/ProjectBrowser'
import FAQAccordion from '../components/FAQAccordion'
import { projects } from '../data/projects'
import { homeFaq } from '../data/faq'

const stats = [
  { value: '3 Days', label: 'Avg. Delivery' },
  { value: '100%', label: 'Client Satisfaction' },
  { value: '1 Year', label: 'Free Support' },
]

const steps = [
  { step: 1, title: 'Tell Us Your Vision', desc: 'Share what you need — we\'ll ask the right questions to understand your goals and audience.', icon: MessageSquare },
  { step: 2, title: 'We Design It', desc: 'You\'ll see a prototype before we write a single line of code. No surprises.', icon: Palette },
  { step: 3, title: 'We Build It Fast', desc: 'Weekly updates so you always know where things stand. Preview your site as we go.', icon: Rocket },
  { step: 4, title: 'Launch & Support', desc: 'We handle deployment, make sure everything works, and support you for a full year after launch.', icon: Shield },
]

const whyUs = [
  { title: 'You talk to the people who build it', desc: 'No project managers, no middlemen. The people you talk to are the people writing the code.' },
  { title: 'Fast turnaround, no corners cut', desc: 'Most projects go live in days, not weeks. We move fast because we\'ve done this before — not because we skip steps.' },
  { title: 'Your site actually works on every device', desc: 'Mobile, tablet, desktop — we test everything. Your customers get a great experience no matter how they find you.' },
  { title: '1 year of support included', desc: 'After launch, we stick around. Bug fixes, updates, tweaks, questions — we\'ve got you covered for a full year.' },
  { title: 'Sites that load in under 2 seconds', desc: 'Slow websites lose customers. We build fast sites that rank well on Google and keep visitors engaged.' },
  { title: 'You own everything', desc: 'Your site, your code, your domain. No lock-in, no recurring fees for access to your own work.' },
]

export default function Home() {
  return (
    <main>
      {/* Hero + Featured Projects */}
      <section className="relative min-h-screen flex flex-col pt-16 overflow-x-hidden">
        {/* Hero: left-aligned with Get Started CTA */}
        <div className="relative max-w-7xl mx-auto px-6 pt-10 md:pt-14 pb-4 flex-shrink-0">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              We Make Business & Portfolio{' '}
              <span className="bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">Websites</span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-text-muted leading-relaxed max-w-lg">
              Professional websites that look great, load fast, and help you get more customers.
              Built by a two-person team that actually cares about your results.
            </p>
            <div className="mt-5 flex items-center gap-6">
              <Link
                to="/order"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors text-sm"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <div className="hidden sm:flex items-center gap-5 text-sm text-text-dim">
                {stats.map((s, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="font-semibold text-text">{s.value}</span> {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured projects carousel */}
        <div className="relative flex-1 min-h-0 mt-4">
          <div className="h-full flex flex-col">
            <div className="max-w-7xl mx-auto px-6 w-full flex items-end justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-text">Our Recent Work</h2>
                <p className="text-sm text-text-muted mt-1">Real websites we've built for real clients</p>
              </div>
              <Link to="/projects" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex-1 min-h-0 max-w-7xl mx-auto px-6 w-full">
              <ProjectBrowser projects={projects} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-2 md:mb-4">How It Works</h2>
            <p className="text-text-muted text-center text-sm md:text-base mb-8 md:mb-16 max-w-xl mx-auto">
              From first conversation to live website in as little as 3 days.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {steps.map((s, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="relative flex md:flex-col items-start gap-3 md:gap-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 md:mb-4">
                    <s.icon size={20} className="text-accent md:hidden" />
                    <s.icon size={24} className="text-accent hidden md:block" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-dark-border to-transparent" />
                  )}
                  <div>
                    <span className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-wider">Step {s.step}</span>
                    <h3 className="text-sm md:text-lg font-bold text-text mt-0.5 md:mt-2 mb-1 md:mb-2">{s.title}</h3>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-3 md:mb-4">Why Work With Us</h2>
            <p className="text-text-muted text-center mb-8 md:mb-16 max-w-xl mx-auto text-sm md:text-base">
              We're not an agency. We're two developers who build websites we're proud of.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {whyUs.map((item, i) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <div className="flex gap-3 md:gap-4 p-4 md:p-6 rounded-xl border border-dark-border hover:border-accent/30 transition-colors">
                  <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-text mb-0.5 md:mb-1">{item.title}</h3>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <SectionReveal>
            <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-4">Common Questions</h2>
            <p className="text-text-muted text-center mb-12">
              Straight answers, no jargon.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <FAQAccordion items={homeFaq} />
          </SectionReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionReveal>
            <h2 className="text-2xl md:text-4xl font-extrabold mb-4">Let's Get Your Website Live</h2>
            <p className="text-text-muted mb-8 text-base md:text-lg">
              Tell us what you need. We'll tell you how fast we can build it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/order"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <a
                href="mailto:louissader42@gmail.com"
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                Or email us: louissader42@gmail.com
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>
    </main>
  )
}
