import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-dark-border rounded-xl overflow-hidden">
          <button
            data-cursor="pointer"
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-dark-lighter transition-colors"
          >
            <span className="text-base font-medium text-text pr-4">{item.question}</span>
            <motion.span
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 text-text-muted"
            >
              <ChevronDown size={20} />
            </motion.span>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-sm text-text-muted leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
