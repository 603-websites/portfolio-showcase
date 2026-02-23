import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Users, Clock, Shield, Star, CheckCircle, MessageSquare } from 'lucide-react'
import TextReveal from '../components/TextReveal'
import SectionReveal from '../components/SectionReveal'
import ProjectBrowser from '../components/ProjectBrowser'
import FAQAccordion from '../components/FAQAccordion'
import { projects } from '../data/projects'
import { homeFaq } from '../data/faq'

const stats = [
  { icon: Zap, value: '4+', label: 'Projects Delivered' },
  { icon: Clock, value: '3 Days', label: 'Avg. Delivery' },
  { icon: Star, value: '100%', label: 'Client Satisfaction' },
  { icon: Shield, value: '1 Year', label: 'Free Support' },
]

const steps = [
  { step: 1, title: 'Tell Us Your Vision', desc: 'Share what you need — we\'ll ask the right questions to understand your goals and audience.', icon: MessageSquare },
  { step: 2, title: 'We Design It', desc: 'You\'ll see a prototype before we write a single line of code. No surprises.', icon: Star },
  { step: 3, title: 'We Build It Fast', desc: 'Weekly updates so you always know where things stand. Preview your site as we go.', icon: Zap },
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
      {/* Hero + Featured Projects — all in one viewport */}
      <section className="relative h-screen flex flex-col pt-16 overflow-hidden">
        {/* Top: centered hero content */}
        <div className="relative max-w-7xl mx-auto px-6 pt-6 pb-3 flex-shrink-0 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight">
            <TextReveal as="span" className="inline">
              We Make Portfolio & Business
            </TextReveal>{' '}
            <TextReveal as="span" className="inline bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent" delay={0.4}>
              Websites
            </TextReveal>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-3 text-sm text-text-muted leading-relaxed max-w-lg mx-auto"
          >
            Professional websites that look great, load fast, and help you stand out from other job applicants and get more customers.
            Built by a two-person team that actually cares about your career trajectory.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-5 flex flex-wrap justify-center gap-3"
          >
            <Link
              to="/projects"
              data-cursor="pointer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors text-sm"
            >
              See Our Work <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              data-cursor="pointer"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-dark-border hover:border-text-dim text-text font-semibold rounded-full transition-colors text-sm"
            >
              Free Consultation
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 grid grid-cols-4 max-w-2xl mx-auto"
          >
            {stats.map((s, i) => (
              <div key={i} className={`flex flex-col items-center gap-1 py-3 ${i > 0 ? 'border-l border-dark-border' : ''}`}>
                <s.icon size={16} className="text-accent" />
                <p className="text-sm font-bold text-text">{s.value}</p>
                <p className="text-[11px] text-text-dim">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom: Featured projects carousel */}
        <div className="relative flex-1 min-h-0 mt-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="h-full flex flex-col"
          >
            <div className="max-w-7xl mx-auto px-6 w-full flex items-end justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-text">Our Recent Work</h2>
                <p className="text-sm text-text-muted mt-1">Real websites we've built for real clients</p>
              </div>
              <Link to="/projects" data-cursor="pointer" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex-1 min-h-0 max-w-7xl mx-auto px-6 w-full">
              <ProjectBrowser projects={projects} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <TextReveal as="h2" className="text-3xl md:text-5xl font-extrabold text-center mb-4">
              How It Works
            </TextReveal>
            <p className="text-text-muted text-center mb-16 max-w-xl mx-auto">
              From first conversation to live website in as little as 3 days.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-dark-border to-transparent" />
                  )}
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <s.icon size={24} className="text-accent" />
                  </div>
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Step {s.step}</span>
                  <h3 className="text-lg font-bold text-text mt-2 mb-2">{s.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{s.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <TextReveal as="h2" className="text-3xl md:text-5xl font-extrabold text-center mb-4">
              Why Work With Us
            </TextReveal>
            <p className="text-text-muted text-center mb-16 max-w-xl mx-auto">
              We're not an agency. We're two developers who build websites we're proud of.
            </p>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <div className="flex gap-4 p-6 rounded-xl border border-dark-border bg-dark-light hover:border-accent/30 transition-colors">
                  <CheckCircle size={20} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-text mb-1">{item.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-3xl mx-auto px-6">
          <SectionReveal>
            <TextReveal as="h2" className="text-3xl md:text-5xl font-extrabold text-center mb-4">
              Common Questions
            </TextReveal>
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
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionReveal>
            <TextReveal as="h2" className="text-3xl md:text-5xl font-extrabold mb-4">
              Let's Get Your Website Live
            </TextReveal>
            <p className="text-text-muted mb-8 text-lg">
              Tell us what you need. We'll tell you how fast we can build it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                data-cursor="pointer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors"
              >
                Get a Free Quote <ArrowRight size={18} />
              </Link>
              <a
                href="mailto:louissader42@gmail.com"
                data-cursor="pointer"
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
