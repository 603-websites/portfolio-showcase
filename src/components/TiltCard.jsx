import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function TiltCard({ children, className = '', onClick }) {
  const ref = useRef(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) / (rect.width / 2)
    const y = (e.clientY - centerY) / (rect.height / 2)
    setRotateX(-y * 15)
    setRotateY(x * 15)
    setGlarePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setGlarePos({ x: 50, y: 50 })
  }

  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        data-cursor="view"
        className={`relative overflow-hidden ${className}`}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {children}
        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
          }}
        />
      </motion.div>
    </div>
  )
}
