import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

export default function SpotlightCursor() {
  const { activeVariant } = useTheme()
  const location = useLocation()
  const layerRef = useRef(null)
  const revealRef = useRef(null)
  const pointRef = useRef({ x: -999, y: -999 })
  const angleRef = useRef(0)

  useEffect(() => {
    const layer = layerRef.current
    const reveal = revealRef.current
    if (!layer || !reveal) return undefined

    const isMobile = window.matchMedia('(pointer: coarse)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Realistic torchlight only looks good on dark themes (Aurora)
    const enabled = activeVariant.id === 'aurora' && !reduceMotion && !location.pathname.startsWith('/admin')

    if (!enabled) {
      layer.style.opacity = '0'
      reveal.style.opacity = '0'
      return undefined
    }

    // On desktop, show immediately. On mobile, show only when touching.
    let isVisible = !isMobile
    layer.style.opacity = isVisible ? '1' : '0'
    reveal.style.opacity = isVisible ? '1' : '0'

    let rafId;
    const paint = () => {
      // Slow rotation for the light rays
      angleRef.current = (angleRef.current + 0.08) % 360
      
      layer.style.setProperty('--cursor-x', `${pointRef.current.x}px`)
      layer.style.setProperty('--cursor-y', `${pointRef.current.y}px`)
      layer.style.setProperty('--ray-angle', `${angleRef.current}deg`)
      
      reveal.style.setProperty('--cursor-x', `${pointRef.current.x}px`)
      reveal.style.setProperty('--cursor-y', `${pointRef.current.y}px`)
      
      rafId = requestAnimationFrame(paint)
    }
    
    rafId = requestAnimationFrame(paint)

    const onPointerMove = event => {
      pointRef.current = { x: event.clientX, y: event.clientY }
    }

    const onTouchStart = event => {
      if (event.touches.length > 0) {
        pointRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
        isVisible = true
        layer.style.opacity = '1'
        reveal.style.opacity = '1'
      }
    }

    const onTouchMove = event => {
      if (event.touches.length > 0) {
        pointRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
      }
    }

    const onTouchEnd = () => {
      isVisible = false
      layer.style.opacity = '0'
      reveal.style.opacity = '0'
    }

    if (isMobile) {
      window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
      window.addEventListener('touchmove', onTouchMove, { passive: true, capture: true })
      window.addEventListener('touchend', onTouchEnd, { passive: true, capture: true })
      window.addEventListener('touchcancel', onTouchEnd, { passive: true, capture: true })
    } else {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchstart', onTouchStart, { capture: true })
      window.removeEventListener('touchmove', onTouchMove, { capture: true })
      window.removeEventListener('touchend', onTouchEnd, { capture: true })
      window.removeEventListener('touchcancel', onTouchEnd, { capture: true })
      cancelAnimationFrame(rafId)
    }
  }, [activeVariant.id, location.pathname])

  return (
    <>
      {/* Layer 1: Physically brightens and enhances contrast of the DOM behind it */}
      <div ref={revealRef} className="sg-spotlight-reveal" aria-hidden />
      
      {/* Layer 2: The actual light beam, rays, and hotspot overlay */}
      <div ref={layerRef} className="sg-spotlight-beam" aria-hidden />

      <style>{`
        .sg-spotlight-reveal {
          --cursor-x: -999px;
          --cursor-y: -999px;
          position: fixed;
          inset: 0;
          z-index: 1799;
          pointer-events: none;
          
          /* The magic: physically brightens and sharpens elements behind it */
          backdrop-filter: brightness(1.6) contrast(1.15) saturate(1.2);
          -webkit-backdrop-filter: brightness(1.6) contrast(1.15) saturate(1.2);
          
          /* Mask out the reveal effect to just a circle around the cursor */
          mask-image: radial-gradient(circle 200px at var(--cursor-x) var(--cursor-y), black 20%, transparent 100%);
          -webkit-mask-image: radial-gradient(circle 200px at var(--cursor-x) var(--cursor-y), black 20%, transparent 100%);
          
          transition: opacity 300ms ease;
          will-change: mask-image, -webkit-mask-image;
        }

        .sg-spotlight-beam {
          --cursor-x: -999px;
          --cursor-y: -999px;
          --ray-angle: 0deg;
          position: fixed;
          inset: 0;
          z-index: 1800;
          pointer-events: none;
          mix-blend-mode: color-dodge;
          
          background: 
            /* The inner intense bulb glow */
            radial-gradient(circle 40px at var(--cursor-x) var(--cursor-y), color-mix(in srgb, var(--sg-spotlight-color) 70%, white 30%) 0%, transparent 100%),
            /* The outer ambient color glow */
            radial-gradient(circle 240px at var(--cursor-x) var(--cursor-y), color-mix(in srgb, var(--sg-spotlight-color) 40%, transparent) 0%, transparent 100%),
            /* The textured light rays / caustics */
            repeating-conic-gradient(from var(--ray-angle) at var(--cursor-x) var(--cursor-y), 
              transparent 0deg, 
              color-mix(in srgb, var(--sg-spotlight-color) 12%, transparent) 3deg, 
              transparent 6deg,
              transparent 22deg,
              color-mix(in srgb, var(--sg-spotlight-color) 8%, transparent) 26deg,
              transparent 30deg,
              transparent 45deg,
              color-mix(in srgb, var(--sg-spotlight-color) 5%, transparent) 47deg,
              transparent 49deg
            );
            
          /* Mask the rays so they fade out organically */
          mask-image: radial-gradient(circle 380px at var(--cursor-x) var(--cursor-y), black 0%, transparent 100%);
          -webkit-mask-image: radial-gradient(circle 380px at var(--cursor-x) var(--cursor-y), black 0%, transparent 100%);
          
          transition: opacity 300ms ease;
          will-change: background, mask-image, -webkit-mask-image;
        }

        @media (prefers-reduced-motion: reduce) {
          .sg-spotlight-reveal, .sg-spotlight-beam {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
