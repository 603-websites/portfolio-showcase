import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function TextReveal({ children, as: Tag = 'h2', className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <Tag ref={ref} className={className}>
      <motion.span
        className="inline-block"
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.4, delay, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {children}
      </motion.span>
    </Tag>
  )
}
