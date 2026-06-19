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
          
          /* The magic: Inverts the colors to reveal a 'light theme' X-ray effect */
          backdrop-filter: invert(1) hue-rotate(180deg) brightness(1.2);
          -webkit-backdrop-filter: invert(1) hue-rotate(180deg) brightness(1.2);
          
          /* Mask out the reveal effect to just a circle around the cursor */
          mask-image: radial-gradient(circle 400px at var(--cursor-x) var(--cursor-y), black 20%, transparent 100%);
          -webkit-mask-image: radial-gradient(circle 400px at var(--cursor-x) var(--cursor-y), black 20%, transparent 100%);
          
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
          mix-blend-mode: screen;
          
          background: 
            /* The inner intense bulb glow - solid white */
            radial-gradient(circle 60px at var(--cursor-x) var(--cursor-y), rgba(255, 255, 255, 0.5) 0%, transparent 100%),
            /* The outer ambient color glow - pure white fade */
            radial-gradient(circle 400px at var(--cursor-x) var(--cursor-y), rgba(255, 255, 255, 0.1) 0%, transparent 100%),
            /* The textured light rays / caustics - bright white */
            repeating-conic-gradient(from var(--ray-angle) at var(--cursor-x) var(--cursor-y), 
              transparent 0deg, 
              rgba(255, 255, 255, 0.08) 3deg, 
              transparent 6deg,
              transparent 22deg,
              rgba(255, 255, 255, 0.05) 26deg,
              transparent 30deg,
              transparent 45deg,
              rgba(255, 255, 255, 0.03) 47deg,
              transparent 49deg
            );
            
          /* Mask the rays so they fade out organically */
          mask-image: radial-gradient(circle 500px at var(--cursor-x) var(--cursor-y), black 0%, transparent 100%);
          -webkit-mask-image: radial-gradient(circle 500px at var(--cursor-x) var(--cursor-y), black 0%, transparent 100%);
          
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
