import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
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

export default function About() {
  return (
    <main className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <SectionReveal className="mb-16">
          <TextReveal as="h1" className="text-4xl md:text-6xl font-extrabold mb-4">
            Meet the Team
          </TextReveal>
          <p className="text-xl text-text-muted max-w-2xl">
            Two builders who ship fast and care about the details.
          </p>
        </SectionReveal>

        {/* Team cards */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
          {team.map((member, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <TeamCard {...member} compact />
            </SectionReveal>
          ))}
        </div>

        {/* CTA — anchored card that connects to the cards above */}
        <SectionReveal>
          <div className="border border-dark-border rounded-2xl p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-text mb-3">Work With Us</h2>
            <p className="text-text-muted mb-6">Let's build something great together.</p>
            <Link to="/contact" data-cursor="pointer" className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors">
              Get in Touch <ArrowRight size={18} />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </main>
  )
}
