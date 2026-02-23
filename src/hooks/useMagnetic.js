import { useRef, useState } from 'react'

export function useMagnetic(strength = 0.3) {
  const ref = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    setOffset({ x: distX * strength, y: distY * strength })
  }

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 })
  }

  return { ref, offset, handleMouseMove, handleMouseLeave }
}
