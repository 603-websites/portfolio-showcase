import { useRef, useState, useEffect, useCallback } from 'react'
import { ExternalLink } from 'lucide-react'

export default function ProjectBrowser({ projects }) {
  const containerRef = useRef(null)
  const [posIndex, setPosIndex] = useState(projects.length) // start in middle copy
  const [paused, setPaused] = useState(false)
  const [animate, setAnimate] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
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
    }, 3500)
    return () => clearInterval(timer)
  }, [paused])

  // Keyboard (scoped to container focus)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      setPaused(true)
      setPosIndex((prev) => prev + 1)
    } else if (e.key === 'ArrowLeft') {
      setPaused(true)
      setPosIndex((prev) => prev - 1)
    }
  }

  const translateX = -(posIndex * stride)

  return (
    <div
      ref={containerRef}
      className="overflow-hidden h-full outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
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
              className="group shrink-0 rounded-2xl overflow-hidden border border-dark-border bg-dark-light cursor-pointer"
              style={{
                width: cardWidth,
                transform: `scale(${isActive ? 1.05 : 0.95})`,
                opacity: isActive ? 1 : 0.6,
                transition: 'transform 0.3s, opacity 0.3s',
              }}
              onClick={() => window.open(project.liveLink, '_blank')}
            >
              <div className="h-32 md:h-44 overflow-hidden relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 text-white text-sm font-semibold">
                    <ExternalLink size={15} />
                    Visit Site
                  </div>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-bold text-text mb-0.5 md:mb-1">{project.title}</h3>
                <p className="text-xs md:text-sm text-text-muted">{project.tagline}</p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
