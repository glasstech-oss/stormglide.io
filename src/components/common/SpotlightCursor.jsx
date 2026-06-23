import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useReducedMotion } from 'framer-motion'

const TRAIL_DURATION = 900  // ms each trail point lives before fully fading
const TRAIL_INTERVAL = 18   // ms between trail point captures
const TRAIL_RADIUS   = 300  // px — glow size of each trail point
const LEAD_RADIUS    = 220  // px — glow size of the live cursor head

export default function SpotlightCursor() {
  const location    = useLocation()
  const { activeVariant } = useTheme()
  const reduceMotion = useReducedMotion()
  const canvasRef   = useRef(null)
  const rafRef      = useRef(null)

  // Trail history: array of { x, y, t }
  const trail       = useRef([])
  const lastTrailT  = useRef(0)

  // Smoothed lead position (lags slightly behind raw input)
  const leadPos     = useRef({ x: -9999, y: -9999 })
  // Raw input position
  const targetPos   = useRef({ x: -9999, y: -9999 })
  const active      = useRef(false)

  const enabled =
    activeVariant.id === 'aurora' &&
    !reduceMotion &&
    !location.pathname.startsWith('/admin') &&
    !location.pathname.startsWith('/client')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !enabled) return

    const ctx = canvas.getContext('2d')

    // Match canvas to viewport size
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // ── Main render loop ──────────────────────────────────────
    const loop = (now) => {
      const { width: W, height: H } = canvas
      ctx.clearRect(0, 0, W, H)

      // Smooth lead toward target (eased follow)
      leadPos.current.x += (targetPos.current.x - leadPos.current.x) * 0.14
      leadPos.current.y += (targetPos.current.y - leadPos.current.y) * 0.14

      // Capture a new trail point
      if (active.current && now - lastTrailT.current > TRAIL_INTERVAL) {
        trail.current.push({ x: leadPos.current.x, y: leadPos.current.y, t: now })
        lastTrailT.current = now
      }

      // Purge fully expired points
      trail.current = trail.current.filter(p => now - p.t < TRAIL_DURATION)

      // ── Draw trail (oldest → newest, so newest paints on top)
      trail.current.forEach(p => {
        const age     = (now - p.t) / TRAIL_DURATION   // 0 = fresh, 1 = dead
        const eased   = 1 - Math.pow(age, 1.6)         // slightly accelerated fade
        const alpha   = eased * 0.28
        const radius  = TRAIL_RADIUS * (0.6 + eased * 0.4)

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
        g.addColorStop(0,   `rgba(90,209,255,${(alpha * 1.0).toFixed(3)})`)
        g.addColorStop(0.3, `rgba(90,209,255,${(alpha * 0.6).toFixed(3)})`)
        g.addColorStop(0.6, `rgba(150,120,255,${(alpha * 0.25).toFixed(3)})`)
        g.addColorStop(1,   'rgba(0,0,0,0)')

        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // ── Draw live cursor head (always on top, brightest point)
      if (active.current) {
        const lx = leadPos.current.x
        const ly = leadPos.current.y

        // Outer ambient halo
        const halo = ctx.createRadialGradient(lx, ly, 0, lx, ly, LEAD_RADIUS * 2)
        halo.addColorStop(0,   'rgba(90,209,255,0.26)')
        halo.addColorStop(0.35,'rgba(90,209,255,0.14)')
        halo.addColorStop(0.65,'rgba(150,120,255,0.07)')
        halo.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(lx, ly, LEAD_RADIUS * 2, 0, Math.PI * 2)
        ctx.fill()

        // Bright inner core
        const core = ctx.createRadialGradient(lx, ly, 0, lx, ly, LEAD_RADIUS * 0.45)
        core.addColorStop(0,  'rgba(210,245,255,0.55)')
        core.addColorStop(0.4,'rgba(90,209,255,0.30)')
        core.addColorStop(1,  'rgba(0,0,0,0)')
        ctx.fillStyle = core
        ctx.beginPath()
        ctx.arc(lx, ly, LEAD_RADIUS * 0.45, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    // ── Input handlers ────────────────────────────────────────
    const show = () => { active.current = true }
    const hide = () => {
      active.current = false
      targetPos.current = { x: -9999, y: -9999 }
    }

    // Pointer (desktop mouse / stylus)
    const onPointerMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY }
      show()
    }
    const onPointerLeave = () => hide()

    // Touch (mobile)
    const onTouchMove = (e) => {
      const t = e.touches[0]
      targetPos.current = { x: t.clientX, y: t.clientY }
      show()
    }
    const onTouchEnd = () => hide()

    window.addEventListener('pointermove',  onPointerMove,  { passive: true })
    document.body.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('touchmove',    onTouchMove,    { passive: true })
    window.addEventListener('touchend',     onTouchEnd,     { passive: true })
    window.addEventListener('touchcancel',  onTouchEnd,     { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize',       resize)
      window.removeEventListener('pointermove',  onPointerMove)
      document.body.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('touchmove',    onTouchMove)
      window.removeEventListener('touchend',     onTouchEnd)
      window.removeEventListener('touchcancel',  onTouchEnd)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1800,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  )
}
