import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMousePosition } from '../hooks/useMousePosition'

export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [variant, setVariant] = useState('default')
  const { x, y } = useMousePosition()

  const springConfig = { damping: 25, stiffness: 300 }
  const cursorX = useSpring(useMotionValue(0), springConfig)
  const cursorY = useSpring(useMotionValue(0), springConfig)

  useEffect(() => {
    cursorX.set(x)
    cursorY.set(y)
  }, [x, y, cursorX, cursorY])

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return
    setVisible(true)

    const handleEnter = (variant) => () => setVariant(variant)
    const handleLeave = () => setVariant('default')

    const observe = () => {
      document.querySelectorAll('a, button, [data-cursor="pointer"]').forEach((el) => {
        el.addEventListener('mouseenter', handleEnter('pointer'))
        el.addEventListener('mouseleave', handleLeave)
      })
      document.querySelectorAll('[data-cursor="view"]').forEach((el) => {
        el.addEventListener('mouseenter', handleEnter('view'))
        el.addEventListener('mouseleave', handleLeave)
      })
    }

    observe()
    const observer = new MutationObserver(observe)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  if (!visible) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: cursorX, y: cursorY }}
      >
        {/* Dot */}
        <motion.div
          className="rounded-full bg-white absolute"
          animate={{
            width: variant === 'default' ? 8 : 0,
            height: variant === 'default' ? 8 : 0,
            x: variant === 'default' ? -4 : 0,
            y: variant === 'default' ? -4 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
        {/* Ring */}
        <motion.div
          className="rounded-full border-2 border-white absolute flex items-center justify-center"
          animate={{
            width: variant === 'default' ? 32 : variant === 'view' ? 80 : 64,
            height: variant === 'default' ? 32 : variant === 'view' ? 80 : 64,
            x: variant === 'default' ? -16 : variant === 'view' ? -40 : -32,
            y: variant === 'default' ? -16 : variant === 'view' ? -40 : -32,
          }}
          transition={{ duration: 0.3 }}
        >
          {variant === 'view' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-white text-xs font-semibold"
            >
              View
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}
