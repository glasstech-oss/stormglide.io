import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

/**
 * Magnetic - wraps a CTA so it leans toward the cursor with a spring,
 * and snaps back on leave. Wrap around a single button/link.
 */
export default function Magnetic({ children, strength = 0.28, style }) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.6 })

  const handleMove = event => {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ display: 'inline-block', x: springX, y: springY, ...style }}
    >
      {children}
    </motion.span>
  )
}
