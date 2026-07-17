import { useEffect, useRef } from 'react'

const DESKTOP_MAX_PRINTS = 42
const MOBILE_MAX_PRINTS = 18
const DESKTOP_MAX_WALKERS = 2
const MOBILE_MAX_WALKERS = 1

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function createWalker(width, height, isMobile, now) {
  const edge = Math.floor(Math.random() * 4)
  const margin = isMobile ? 80 : 120
  let x
  let y
  let targetX
  let targetY

  if (edge === 0) {
    x = randomBetween(0, width)
    y = -margin
    targetX = randomBetween(0, width)
    targetY = height + margin
  } else if (edge === 1) {
    x = width + margin
    y = randomBetween(0, height)
    targetX = -margin
    targetY = randomBetween(0, height)
  } else if (edge === 2) {
    x = randomBetween(0, width)
    y = height + margin
    targetX = randomBetween(0, width)
    targetY = -margin
  } else {
    x = -margin
    y = randomBetween(0, height)
    targetX = width + margin
    targetY = randomBetween(0, height)
  }

  const angle = Math.atan2(targetY - y, targetX - x)
  const speed = isMobile ? randomBetween(11, 18) : randomBetween(16, 26)

  return {
    x,
    y,
    angle,
    speed,
    side: Math.random() > 0.5 ? 1 : -1,
    nextStepAt: now + randomBetween(160, 900),
    stepInterval: isMobile ? randomBetween(850, 1350) : randomBetween(620, 1050),
    remainingSteps: isMobile ? Math.floor(randomBetween(5, 9)) : Math.floor(randomBetween(7, 14)),
  }
}

// An actual foot silhouette, not disconnected blobs: a tapered sole pad
// (narrow heel, wider ball) with five separated toes sitting right at its
// front edge, shrinking from the big toe down to the pinky — mirrored
// left/right via `side` (matches which foot is stepping). Coordinates were
// tuned by rendering them standalone at 8x scale and iterating until the
// toes read as distinct circles (not a merged blob) sitting on the pad
// (not floating above it) before wiring them into the live component.
const TOE_DEFS = [
  { dx: -6, dy: -20.5, r: 2.6 }, // big toe — largest
  { dx: -2.8, dy: -22, r: 2.2 },
  { dx: 0.6, dy: -22.5, r: 2.0 },
  { dx: 3.7, dy: -21, r: 1.8 },
  { dx: 6.4, dy: -18.5, r: 1.5 }, // pinky toe — smallest
]

function buildFootOutlinePath(side) {
  const s = side
  const path = new Path2D()
  path.moveTo(0, 22)
  // outer edge: heel up to the ball of the foot
  path.bezierCurveTo(s * 8, 21, s * 9, 8, s * 8.5, -4)
  path.bezierCurveTo(s * 8, -10, s * 6, -15, s * 3, -17.5)
  // across the front (where the toes attach)
  path.bezierCurveTo(s * 0, -19, s * -3, -18.5, s * -5, -16.5)
  // inner edge: ball back down to the heel
  path.bezierCurveTo(s * -7.5, -14, s * -8.5, -8, s * -8.5, -2)
  path.bezierCurveTo(s * -8.5, 9, s * -7, 20, 0, 22)
  path.closePath()
  return path
}

// A print's local-space shape never changes over its lifetime (only its global
// position/alpha/scale do, applied via the canvas transform) — so the path and
// gradients are built once, on the first frame it's drawn, and reused for every
// frame after. Rebuilding a bezier outline + up to 6 gradients per print per
// frame was real, continuous main-thread cost for a purely decorative layer;
// this cuts it to a one-time cost per print.
function buildFootprintShape(ctx, side, isLightMode) {
  const color = isLightMode ? '42, 52, 82' : '225, 246, 255'
  const rim = isLightMode ? '22, 30, 48' : '255, 255, 255'

  const outline = ctx.createRadialGradient(side * -2, -6, 2, side * -2, -6, 30)
  outline.addColorStop(0, `rgba(${rim}, 0.3)`)
  outline.addColorStop(0.55, `rgba(${color}, 0.17)`)
  outline.addColorStop(1, `rgba(${color}, 0)`)

  const toes = TOE_DEFS.map(({ dx, dy, r }) => {
    const x = side * dx
    const toe = ctx.createRadialGradient(x, dy, 0.4, x, dy, r * 2.6)
    toe.addColorStop(0, `rgba(${rim}, 0.22)`)
    toe.addColorStop(1, `rgba(${color}, 0)`)
    return { gradient: toe, x, y: dy, r }
  })

  return { path: buildFootOutlinePath(side), outline, toes }
}

function drawFootprint(ctx, print, now, isLightMode) {
  const age = now - print.createdAt
  const life = print.life
  const fadeIn = clamp(age / 520, 0, 1)
  const fadeOut = clamp(1 - age / life, 0, 1)
  const alpha = print.alpha * fadeIn * fadeOut * fadeOut
  if (alpha <= 0) return

  if (!print.shape || print.shapeMode !== isLightMode) {
    print.shape = buildFootprintShape(ctx, print.side, isLightMode)
    print.shapeMode = isLightMode
  }
  const { path, outline, toes } = print.shape

  ctx.save()
  ctx.translate(print.x, print.y)
  ctx.rotate(print.angle)
  ctx.scale(print.scale, print.scale)
  ctx.globalAlpha = alpha
  ctx.globalCompositeOperation = isLightMode ? 'multiply' : 'screen'

  ctx.fillStyle = outline
  ctx.fill(path)

  toes.forEach(toe => {
    ctx.fillStyle = toe.gradient
    ctx.beginPath()
    ctx.ellipse(toe.x, toe.y, toe.r, toe.r * 1.1, 0, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.restore()
}

export default function GlassFootprints() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return undefined

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !ctx) return undefined

    let frame = 0
    let width = 0
    let height = 0
    let dpr = 1
    let nextWalkerAt = 0
    const walkers = []
    const prints = []

    const isMobileViewport = () => window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.6)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const addPrint = (walker, now, isMobile) => {
      // A print is ~44-49 canvas units long — a real step spaces consecutive
      // footprints about 2.5-3x the foot's own length apart, not less than it
      // (that's what made this read as "not how humans walk": prints were
      // nearly stacked on top of each other instead of a natural stride).
      const stride = isMobile ? randomBetween(62, 78) : randomBetween(92, 116)
      const lateral = isMobile ? 6 : 8
      walker.x += Math.cos(walker.angle) * stride
      walker.y += Math.sin(walker.angle) * stride

      const perpendicular = walker.angle + Math.PI / 2
      prints.push({
        x: walker.x + Math.cos(perpendicular) * lateral * walker.side,
        y: walker.y + Math.sin(perpendicular) * lateral * walker.side,
        angle: walker.angle + Math.PI / 2,
        side: walker.side,
        scale: isMobile ? randomBetween(0.58, 0.78) : randomBetween(0.72, 1.02),
        alpha: isMobile ? randomBetween(0.2, 0.34) : randomBetween(0.26, 0.44),
        life: isMobile ? randomBetween(5200, 8200) : randomBetween(6800, 11000),
        createdAt: now,
      })

      walker.side *= -1
      walker.nextStepAt = now + walker.stepInterval + randomBetween(-160, 220)
      walker.remainingSteps -= 1
    }

    const tick = (now) => {
      const isMobile = isMobileViewport()
      const maxWalkers = isMobile ? MOBILE_MAX_WALKERS : DESKTOP_MAX_WALKERS
      const maxPrints = isMobile ? MOBILE_MAX_PRINTS : DESKTOP_MAX_PRINTS
      const root = document.documentElement
      const isLightMode = root.getAttribute('data-sg-appearance') === 'light'

      if (walkers.length < maxWalkers && now >= nextWalkerAt) {
        walkers.push(createWalker(width, height, isMobile, now))
        nextWalkerAt = now + (isMobile ? randomBetween(10000, 17000) : randomBetween(4200, 8500))
      }

      for (let i = walkers.length - 1; i >= 0; i -= 1) {
        const walker = walkers[i]
        walker.x += Math.cos(walker.angle) * walker.speed * 0.016
        walker.y += Math.sin(walker.angle) * walker.speed * 0.016

        if (now >= walker.nextStepAt) addPrint(walker, now, isMobile)

        const offscreen = walker.x < -180 || walker.x > width + 180 || walker.y < -180 || walker.y > height + 180
        if (offscreen || walker.remainingSteps <= 0) walkers.splice(i, 1)
      }

      for (let i = prints.length - 1; i >= 0; i -= 1) {
        if (now - prints[i].createdAt > prints[i].life) prints.splice(i, 1)
      }
      if (prints.length > maxPrints) prints.splice(0, prints.length - maxPrints)

      ctx.clearRect(0, 0, width, height)
      prints.forEach(print => drawFootprint(ctx, print, now, isLightMode))

      frame = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    nextWalkerAt = 250
    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <canvas className="sg-glass-footprints" ref={canvasRef} aria-hidden="true" />
  )
}
