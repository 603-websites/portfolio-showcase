import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function TextReveal({ children, as: Tag = 'h2', className = '', delay = 0, charAnimation = false }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const words = children.split(' ')
  const stagger = charAnimation ? 0.03 : 0.08

  if (charAnimation) {
    // Animate per-character but preserve word spacing
    let charIndex = 0
    return (
      <Tag ref={ref} className={className}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split('').map((char) => {
              const ci = charIndex++
              return (
                <span key={ci} className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '100%' }}
                    animate={isInView ? { y: 0 } : { y: '100%' }}
                    transition={{ duration: 0.5, delay: delay + ci * stagger, ease: [0.25, 0.4, 0.25, 1] }}
                  >
                    {char}
                  </motion.span>
                </span>
              )
            })}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </Tag>
    )
  }

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{ duration: 0.4, delay: delay + i * stagger, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {word}{'\u00A0'}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
