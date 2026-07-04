import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'

/**
 * CountUp - animates the numeric part of a stat string when scrolled into view.
 * Accepts display strings like "99.9%", "50+", "12 min", "8 countries", "GHS 84,200".
 * Non-numeric prefix/suffix text is preserved and rendered statically.
 */
export default function CountUp({ value, duration = 1.6, className, style }) {
  const numRef = useRef(null)
  const rootRef = useRef(null)
  const inView = useInView(rootRef, { once: true, margin: '-40px' })
  const reduceMotion = useReducedMotion()

  const str = String(value)
  const match = str.match(/-?[\d,]+(?:\.\d+)?/)

  const prefix = match ? str.slice(0, match.index) : str
  const suffix = match ? str.slice(match.index + match[0].length) : ''
  const target = match ? parseFloat(match[0].replace(/,/g, '')) : null
  const decimals = match && match[0].includes('.') ? match[0].split('.')[1].length : 0
  const useGrouping = match ? match[0].includes(',') : false

  useEffect(() => {
    if (target === null || !inView || !numRef.current) return undefined
    if (reduceMotion) {
      numRef.current.textContent = format(target, decimals, useGrouping)
      return undefined
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: latest => {
        if (numRef.current) {
          numRef.current.textContent = format(latest, decimals, useGrouping)
        }
      },
    })
    return () => controls.stop()
  }, [inView, target, decimals, duration, reduceMotion, useGrouping])

  if (target === null) {
    return <span ref={rootRef} className={className} style={style}>{str}</span>
  }

  return (
    <span ref={rootRef} className={className} style={style}>
      {prefix}
      <span ref={numRef}>{format(0, decimals, useGrouping)}</span>
      {suffix}
    </span>
  )
}

function format(n, decimals, useGrouping) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping,
  })
}
