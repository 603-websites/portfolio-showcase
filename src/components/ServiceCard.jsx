import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Package, Code, Wrench, Check } from 'lucide-react'

const icons = { Calendar, Package, Code, Wrench }

export default function ServiceCard({ service }) {
  const Icon = icons[service.icon] || Code

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-dark-light border border-dark-border rounded-2xl p-8 hover:border-accent/50 transition-colors"
    >
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
        <Icon size={24} className="text-accent" />
      </div>
      <h3 className="text-xl font-bold text-text mb-3">{service.title}</h3>
      <p className="text-sm text-text-muted leading-relaxed mb-6">{service.description}</p>

      <ul className="space-y-2 mb-6">
        {service.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
            <Check size={16} className="text-accent shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between text-sm text-text-dim mb-6">
        <span>{service.timeline}</span>
        <span>{service.price}</span>
      </div>

      <Link
        to={service.ctaLink}
        data-cursor="pointer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
      >
        {service.cta} <span>&rarr;</span>
      </Link>
    </motion.div>
  )
}
