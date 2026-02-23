import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Calendar, Clock, Users, CheckCircle } from 'lucide-react'
import TextReveal from '../components/TextReveal'
import SectionReveal from '../components/SectionReveal'
import { projects } from '../data/projects'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find(p => p.slug === slug)

  if (!project) return <Navigate to="/projects" replace />

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <Link to="/projects" data-cursor="pointer" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Projects
          </Link>

          <div className="flex items-start gap-3 mb-4">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium mt-2">
              {project.category}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium mt-2 ${
              project.status === 'Live' ? 'bg-success/10 text-success' : 'bg-amber/10 text-amber'
            }`}>
              {project.status}
            </span>
          </div>

          <TextReveal as="h1" className="text-4xl md:text-6xl font-extrabold mb-4">
            {project.title}
          </TextReveal>
          <p className="text-xl text-text-muted max-w-2xl mb-8">{project.tagline}</p>

          <div className="flex flex-wrap gap-4">
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors"
            >
              View Live <ExternalLink size={16} />
            </a>
          </div>

          {/* Hero image */}
          <div className="mt-12 aspect-video rounded-2xl overflow-hidden border border-dark-border">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </section>

      {/* Overview + Metrics */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <SectionReveal>
                <h2 className="text-2xl font-bold text-text mb-4">Project Overview</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-accent mb-2 uppercase tracking-wider">The Problem</h3>
                    <p className="text-text-muted leading-relaxed">{project.problem}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-accent mb-2 uppercase tracking-wider">Our Solution</h3>
                    <p className="text-text-muted leading-relaxed">{project.solution}</p>
                  </div>
                </div>
              </SectionReveal>
            </div>

            {/* Metrics */}
            <SectionReveal delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {project.metrics.map((m, i) => (
                  <div key={i} className="p-5 rounded-xl border border-dark-border bg-dark-lighter text-center">
                    <p className="text-2xl font-bold text-accent">{m.value}</p>
                    <p className="text-xs text-text-muted mt-1">{m.description}</p>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <h2 className="text-2xl font-bold text-text mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-4 rounded-xl border border-dark-border bg-dark-lighter"
                >
                  <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-text-muted">{f}</span>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Results */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <h2 className="text-2xl font-bold text-text mb-8">Results & Impact</h2>
            <div className="space-y-4">
              {project.results.map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-accent">{i + 1}</span>
                  </div>
                  <p className="text-text-muted">{r}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Lessons */}
      {project.lessons && project.lessons.length > 0 && (
        <section className="py-24 bg-dark-light">
          <div className="max-w-7xl mx-auto px-6">
            <SectionReveal>
              <h2 className="text-2xl font-bold text-text mb-8">What We Learned</h2>
              <div className="space-y-4">
                {project.lessons.map((l, i) => (
                  <p key={i} className="text-text-muted pl-4 border-l-2 border-accent/30">{l}</p>
                ))}
              </div>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* Meta info */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <div className="flex flex-wrap gap-8 text-sm text-text-muted">
              <div className="flex items-center gap-2"><Calendar size={16} className="text-text-dim" /> Launched {project.launchDate}</div>
              <div className="flex items-center gap-2"><Clock size={16} className="text-text-dim" /> Built in {project.buildTime}</div>
              <div className="flex items-center gap-2"><Users size={16} className="text-text-dim" /> {project.team}</div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionReveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text mb-4">
              Interested in a Similar Project?
            </h2>
            <p className="text-text-muted mb-8">Let's talk about your vision and make it real.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" data-cursor="pointer" className="px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors">
                Get in Touch
              </Link>
              <Link to="/projects" data-cursor="pointer" className="px-8 py-4 border border-dark-border hover:border-text-dim text-text font-semibold rounded-full transition-colors">
                View More Projects
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </main>
  )
}
