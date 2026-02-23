import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProjectBrowser({ projects }) {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [posIndex, setPosIndex] = useState(projects.length) // start in middle copy
  const [paused, setPaused] = useState(false)
  const [animate, setAnimate] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const cardWidth = isMobile ? 260 : 323
  const gap = isMobile ? 16 : 22
  const stride = cardWidth + gap

  // Triple the array: [copy1][original][copy2]
  const looped = [...projects, ...projects, ...projects]
  const displayIndex = ((posIndex % projects.length) + projects.length) % projects.length

  // After each transition ends, silently snap to the middle copy if needed
  const handleTransitionEnd = useCallback(() => {
    if (posIndex >= projects.length * 2) {
      setAnimate(false)
      setPosIndex(posIndex - projects.length)
    } else if (posIndex < projects.length) {
      setAnimate(false)
      setPosIndex(posIndex + projects.length)
    }
  }, [posIndex, projects.length])

  // Re-enable animation after a silent snap
  useEffect(() => {
    if (!animate) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true)
        })
      })
    }
  }, [animate])

  // Pause when tab is hidden, reset cleanly when visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setPaused(true)
      } else {
        // Reset to a safe middle position to prevent drift
        setPosIndex((prev) => {
          const display = ((prev % projects.length) + projects.length) % projects.length
          return projects.length + display
        })
        setAnimate(true)
        setPaused(false)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [projects.length])

  // Auto-advance
  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setPosIndex((prev) => prev + 1)
    }, 1500)
    return () => clearInterval(timer)
  }, [paused])

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setPaused(true)
        setPosIndex((prev) => prev + 1)
      } else if (e.key === 'ArrowLeft') {
        setPaused(true)
        setPosIndex((prev) => prev - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const translateX = -(posIndex * stride)

  return (
    <div
      ref={containerRef}
      className="overflow-hidden h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex"
        style={{
          gap: `${gap}px`,
          transform: `translateX(${translateX}px)`,
          transition: animate ? 'transform 0.5s cubic-bezier(0.25, 0.4, 0.25, 1)' : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {looped.map((project, i) => {
          const isActive = i === posIndex
          return (
            <div
              key={`${project.id}-${i}`}
              data-cursor="view"
              className="shrink-0 rounded-2xl overflow-hidden border border-dark-border bg-dark-light cursor-pointer"
              style={{
                width: cardWidth,
                transform: `scale(${isActive ? 1.05 : 0.95})`,
                opacity: isActive ? 1 : 0.6,
                transition: 'transform 0.3s, opacity 0.3s',
              }}
              onClick={() => navigate(`/projects/${project.slug}`)}
            >
              <div className="h-32 md:h-44 overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover object-top" />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-bold text-text mb-0.5 md:mb-1">{project.title}</h3>
                <p className="text-xs md:text-sm text-text-muted">{project.tagline}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-3 mt-3 md:mt-4">
        {projects.map((_, i) => (
          <button
            key={i}
            data-cursor="pointer"
            onClick={() => { setPaused(true); setPosIndex(projects.length + i) }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === displayIndex ? 'bg-accent scale-110' : 'bg-dark-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
