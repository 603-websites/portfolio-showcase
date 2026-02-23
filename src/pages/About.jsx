import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Heart, Shield } from 'lucide-react'
import TextReveal from '../components/TextReveal'
import SectionReveal from '../components/SectionReveal'
import TeamCard from '../components/TeamCard'

const team = [
  {
    name: 'Louis Sader',
    title: 'Co-Founder',
    bio: 'Software developer with professional experience at startups and enterprise companies. Focused on building fast, reliable websites and booking platforms that help businesses grow.',
    skills: [],
    image: '/images/team/louis.jpg',
    linkedin: 'https://www.linkedin.com/in/louis-sader-a6a391287/',
    github: 'https://github.com/louissader',
  },
  {
    name: 'Logan Carter',
    title: 'Co-Founder',
    bio: 'Engineering student at CU Boulder (Class of 2027), Dean\'s List, Honors College. Combines engineering precision with creative web design. Brings meticulous attention to detail to every project.',
    skills: [],
    image: '/images/team/logan.jpg',
    linkedin: 'https://www.linkedin.com/in/logan-carter-35h/',
    github: 'https://github.com/Logan566C',
  },
]

const values = [
  { icon: Zap, title: 'Ship Fast', desc: 'From first conversation to live website in weeks, not months. We move quickly without cutting corners.' },
  { icon: Heart, title: 'Client-First', desc: 'We build for your customers and your business goals. Your success is our success.' },
  { icon: Shield, title: 'Built to Last', desc: 'Websites that stay fast, secure, and reliable long after launch. No shortcuts.' },
]

export default function About() {
  return (
    <main className="pt-24 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <SectionReveal>
          <TextReveal as="h1" className="text-4xl md:text-6xl font-extrabold mb-4">
            Meet the Team
          </TextReveal>
          <p className="text-xl text-text-muted max-w-2xl">
            Two builders who ship fast and care about the details.
          </p>
        </SectionReveal>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <TeamCard {...member} />
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-3xl mx-auto px-6">
          <SectionReveal>
            <h2 className="text-2xl font-bold text-text mb-6">How We Started</h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>
                We connected through a shared passion for building things that matter. Louis brings professional
                software development experience, and Logan brings creative design skills and engineering precision.
                Together, we saw an opportunity to help businesses get professional websites without the agency markup.
              </p>
              <p>
                What sets us apart? We're small enough to care deeply about every project but experienced enough
                to deliver professional results. We don't hand off work — the people you talk to are the people
                who build your site. Every project gets our full attention, and we don't stop until it's something
                we're proud of.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <TextReveal as="h2" className="text-3xl md:text-4xl font-extrabold text-center mb-12">
              Our Approach
            </TextReveal>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <v.icon size={28} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">{v.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{v.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionReveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text mb-4">Work With Us</h2>
            <p className="text-text-muted mb-8 text-lg">Let's build something great together.</p>
            <Link to="/contact" data-cursor="pointer" className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors">
              Get in Touch <ArrowRight size={18} />
            </Link>
          </SectionReveal>
        </div>
      </section>
    </main>
  )
}
