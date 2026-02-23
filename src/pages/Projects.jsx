import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import TextReveal from '../components/TextReveal'
import SectionReveal from '../components/SectionReveal'
import TiltCard from '../components/TiltCard'
import { projects } from '../data/projects'

const filters = ['All', 'SaaS', 'Portfolio']

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const navigate = useNavigate()

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter)

  return (
    <main className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <SectionReveal>
          <TextReveal as="h1" className="text-4xl md:text-6xl font-extrabold mb-4">
            Our Projects
          </TextReveal>
          <p className="text-lg text-text-muted mb-8 max-w-2xl">
            Shipped web applications built for real clients. Every project is live, production-grade, and built with modern tools.
          </p>
        </SectionReveal>

        {/* Filters */}
        <SectionReveal delay={0.1}>
          <div className="flex gap-3 mb-12">
            {filters.map(f => (
              <button
                key={f}
                data-cursor="pointer"
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === f
                    ? 'bg-accent text-white'
                    : 'bg-dark-lighter border border-dark-border text-text-muted hover:text-text'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </SectionReveal>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <TiltCard
                  className="rounded-2xl border border-dark-border bg-dark-light overflow-hidden"
                  onClick={() => navigate(`/projects/${project.slug}`)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-text mb-2">{project.title}</h3>
                    <p className="text-sm text-text-muted mb-4 line-clamp-2">{project.tagline}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-accent">{project.metrics[0].value} {project.metrics[0].label}</span>
                      <span className="text-sm text-text-muted">View Details &rarr;</span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  )
}
