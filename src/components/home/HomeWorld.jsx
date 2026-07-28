import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useActivePanelNode } from '../../lib/panelRegistry'
import { useTheme } from '../../context/ThemeContext'
import { LIVE_PRODUCT_COUNT } from '../../data/products'
import '../../styles/homeWorld.css'

/* Gyroscope parallax for mobile — adds a subtle holographic float based on device tilt.
   Fails gracefully if DeviceOrientationEvent is unavailable or needs explicit permission. */
function useGyroscope() {
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) return undefined

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return
      // Normalize beta (front-back tilt): ~45deg is a typical holding angle
      // normalize gamma (left-right tilt): [-45, 45] -> [-1, 1]
      const b = Math.max(0, Math.min(90, e.beta))
      const g = Math.max(-45, Math.min(45, e.gamma))
      tiltY.set((b - 45) / 45)
      tiltX.set(g / 45)
    }

    // iOS 13+ requires an explicit permission grant, triggered from within
    // a real user gesture, before deviceorientation events fire at all —
    // requesting it passively on mount is silently ignored there. Android
    // and desktop have no such requirement and just start firing directly.
    const needsPermission = typeof window.DeviceOrientationEvent.requestPermission === 'function'
    if (!needsPermission) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
      return () => window.removeEventListener('deviceorientation', handleOrientation)
    }

    let requested = false
    const requestOnGesture = () => {
      if (requested) return
      requested = true
      window.removeEventListener('touchend', requestOnGesture)
      window.removeEventListener('click', requestOnGesture)
      window.DeviceOrientationEvent.requestPermission()
        .then((result) => {
          if (result === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, { passive: true })
          }
        })
        .catch(() => { /* denied, or not a real user-gesture context — tilt just stays inert */ })
    }
    window.addEventListener('touchend', requestOnGesture, { passive: true })
    window.addEventListener('click', requestOnGesture)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('touchend', requestOnGesture)
      window.removeEventListener('click', requestOnGesture)
    }
  }, [tiltX, tiltY])

  return {
    tiltX: useSpring(tiltX, { stiffness: 100, damping: 30, mass: 0.5 }),
    tiltY: useSpring(tiltY, { stiffness: 100, damping: 30, mass: 0.5 }),
  }
}

/* Manual scroll-progress tracker, deliberately not framer-motion's useScroll.
   useScroll's container-ref binding was going silent here — scrollTop moved
   (verified: setting it directly held its value) but the returned progress
   never left 0, on desktop AND mobile. Root cause not worth chasing further:
   this computes the same "start start"/"end end" progress by hand from a
   plain scroll listener (rAF-throttled) on whichever node actually scrolls —
   the active board panel on desktop, or the window on mobile/off-board — and
   is therefore immune to whatever internal binding framer was missing. */
function useRunwayProgress(runwayRef, scrollNode) {
  const progress = useMotionValue(0)

  useEffect(() => {
    const node = scrollNode || window
    let frame = null

    const measure = () => {
      frame = null
      const runway = runwayRef.current
      if (!runway) return
      const isWindow = node === window
      const viewportH = isWindow ? window.innerHeight : node.clientHeight
      const scrollTop = isWindow ? window.scrollY : node.scrollTop
      const runwayRect = runway.getBoundingClientRect()
      const nodeTop = isWindow ? 0 : node.getBoundingClientRect().top
      // top of the runway measured in the scroll node's own scrollTop space
      const runwayTopInScroll = scrollTop + (runwayRect.top - nodeTop)
      const total = runway.offsetHeight - viewportH
      const raw = total > 0 ? (scrollTop - runwayTopInScroll) / total : 0
      progress.set(Math.min(1, Math.max(0, raw)))
    }

    const onScroll = () => {
      if (frame == null) frame = requestAnimationFrame(measure)
    }

    measure()
    node.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      node.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame != null) cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollNode])

  return progress
}

/* The scroll world: the home page opens as a camera flight. A sticky
   full-viewport stage sits inside a tall runway; as the visitor scrolls,
   stations approach out of depth — the brand statement, the chaos a business
   actually runs on, the thesis, and the assembled system core — before the
   page hands over to the regular sections below. Every station is real
   content (the h1, the CTAs, the pitch), not decoration. */

const DEBRIS = [
  { tag: 'WHATSAPP', text: '"how much for 20 bags?"', x: -34, y: -24, r: -9, z: 0.1 },
  { tag: 'EXCEL', text: 'sales_FINAL_v7_REAL.xlsx', x: 30, y: -28, r: 8, z: 0.16 },
  { tag: 'PAPER', text: 'Invoice #204 — unsigned', x: -38, y: 16, r: -6, z: 0.22 },
  { tag: 'NOTEBOOK', text: 'payroll... page missing', x: 34, y: 14, r: 7, z: 0.28 },
  { tag: 'DIARY', text: 'double-booked Friday 10am', x: -20, y: 34, r: 5, z: 0.34 },
  { tag: 'WHATSAPP', text: '"boss I sent it on WhatsApp"', x: 22, y: 32, r: -8, z: 0.4 },
]

const PROOF_STATS = [
  { value: String(LIVE_PRODUCT_COUNT), label: 'Products live, in production', tone: 'blue' },
  { value: '7', label: 'Countries running our systems — Ghana, Guinea, UK, US, UAE, Togo & China', tone: 'green' },
  { value: '24h', label: 'Response on every enquiry', tone: 'orange' },
]

const FEED = [
  'invoice #204 approved — GHS 3,120',
  'payroll batch reconciled',
  'new booking confirmed — Fri 10:00',
  'inventory check-in — 240 units',
  'client portal request closed',
  'Paystack webhook confirmed',
]

const TRUSTED_BY = ['LOLLAROD', 'JAYBESIN LOGISTICS', 'KYEKYE CUISINE', 'GREEN GOLD GARDENS']

const CORE_STATS = [
  { label: 'Invoiced this month', value: 'GHS 48,200', tone: 'blue' },
  { label: 'Bookings this week', value: '136', tone: 'ink' },
  { label: 'Payroll', value: 'Reconciled', tone: 'green' },
  { label: 'Open requests', value: '5', tone: 'orange' },
]

const RAIL = ['Surface', 'The chaos', 'The thesis', 'The proof', 'The system']

// Max out-of-focus blur applied to a station while it's entering/exiting.
const BLUR_MAX = 10

// Applied inline on .sg-world-flight below — real depth via translateZ
// instead of a manual scale approximation, so stations actually
// foreshorten and keep moving all the way through exit instead of freezing
// at hold and just fading.
const PERSPECTIVE = 1300

/* piecewise-linear map with clamping (same semantics as range-form useTransform) */
function mapRange(v, input, output) {
  if (v <= input[0]) return output[0]
  for (let i = 1; i < input.length; i++) {
    if (v <= input[i]) {
      const t = (v - input[i - 1]) / (input[i] - input[i - 1] || 1)
      return output[i - 1] + t * (output[i] - output[i - 1])
    }
  }
  return output[output.length - 1]
}

function Station({ progress, enter, hold, exit, stay = false, first = false, children, className, tiltX, tiltY }) {
  // All input ranges must stay inside [0,1]: framer compiles these
  // scroll-linked transforms to native ScrollTimeline keyframes, and WAAPI
  // throws on offsets outside that range (which unmounts the whole app
  // when there's no error boundary above). Function-form transforms on
  // purpose: range-form ones get promoted to a native ScrollTimeline bound
  // to the whole scroll container, mapping progress over the entire page
  // instead of this runway segment.
  const inR = first ? [hold, exit] : stay ? [enter, enter + 0.06] : [enter, enter + 0.06, hold, exit]
  const outO = first ? [1, 0] : stay ? [0, 1] : [0, 1, 1, 0]
  const opacity = useTransform(progress, v => mapRange(v, inR, outO))
  const outZ = first ? [0, 950] : stay ? [-950, 0] : [-950, -280, 0, 650]
  const z = useTransform(progress, v => mapRange(v, inR, outZ))
  const transform = useTransform(z, zv => `translateZ(${zv.toFixed(1)}px)`)
  const outB = outO.map(o => (1 - o) * BLUR_MAX)
  const filter = useTransform(progress, v => `blur(${mapRange(v, inR, outB).toFixed(2)}px)`)

  // Station subtle parallax based on gyroscope. tiltX/tiltY are always real
  // motion values here (every call site passes useGyroscope()'s output) —
  // no fallback needed, and `new useMotionValue()` would be calling a React
  // hook conditionally besides being a meaningless use of `new` on a hook.
  const tiltOffX = useTransform(tiltX, v => v * 35)
  const tiltOffY = useTransform(tiltY, v => v * 35)

  return (
    <motion.div className={`sg-world-station ${className || ''}`} style={{ opacity, transform, filter }}>
      <motion.div style={{ x: tiltOffX, y: tiltOffY, width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function HomeWorld() {
  const reduceMotion = useReducedMotion()
  const { theme } = useTheme()
  const whatsappPhone = theme.contactWhatsapp.replace(/[^0-9]/g, '').replace(/^0/, '233')

  const runwayRef = useRef(null)
  const activePanelNode = useActivePanelNode()
  const rawProgress = useRunwayProgress(runwayRef, activePanelNode)
  // Springs the raw scroll-tied value so the whole flight has a touch of
  // inertia instead of moving in lockstep with every pixel of scroll —
  // overdamped on purpose (no bounce/overshoot on a progress value).
  const scrollYProgress = useSpring(rawProgress, { stiffness: 400, damping: 50, mass: 0.5 })
  const { tiltX, tiltY } = useGyroscope()

  // Deliberately measured off rawProgress, not the already-sprung
  // scrollYProgress — chaining a velocity+spring off a value that's itself
  // mid-spring compounds two independent lag curves, so the effect keeps
  // "catching up" long after the visitor's hand has actually stopped.
  const rawVelocity = useVelocity(rawProgress)
  const velocity = useSpring(rawVelocity, { stiffness: 260, damping: 34, mass: 0.25 })
  const speedFilter = useTransform(velocity, v => {
    const speed = Math.min(16, Math.abs(v) * 4)
    return speed > 0.15 ? `blur(${speed.toFixed(2)}px)` : 'none'
  })
  const vignetteOpacity = useTransform(velocity, v => Math.min(0.55, Math.abs(v) * 0.15))

  const depthText = useTransform(scrollYProgress, v =>
    String(Math.round(v * 8000)).padStart(4, '0'),
  )
  const railIndex = useTransform(scrollYProgress, v => Math.min(4, Math.floor(v * 5)))

  // Haptic feedback when crossing a rail threshold on mobile
  const prevRailIndex = useRef(0)
  useEffect(() => {
    return railIndex.on('change', latest => {
      if (latest !== prevRailIndex.current) {
        prevRailIndex.current = latest
        // Trigger subtle haptic bump on rail station change
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(12) 
        }
      }
    })
  }, [railIndex])

  if (reduceMotion) {
    // Static fallback: the same content as a plain document.
    return (
      <section className="sg-world sg-world-static">
        <div className="sg-world-station is-static">
          <HeroStation whatsappPhone={whatsappPhone} />
        </div>
        <div className="sg-world-station is-static"><ThesisStation /></div>
        <div className="sg-world-station is-static"><ProofStation /></div>
        <div className="sg-world-station is-static"><CoreStation /></div>
      </section>
    )
  }

  return (
    <section className="sg-world" ref={runwayRef}>
      <div className="sg-world-stage">
        <motion.div className="sg-world-flight" style={{ filter: speedFilter, perspective: `${PERSPECTIVE}px` }}>
          {/* debris drifts past between the hero and the thesis */}
          {DEBRIS.map(d => (
            <Debris key={d.tag + d.x} d={d} progress={scrollYProgress} tiltX={tiltX} tiltY={tiltY} />
          ))}

          <Station progress={scrollYProgress} enter={0} hold={0.16} exit={0.26} first className="is-hero" tiltX={tiltX} tiltY={tiltY}>
            <HeroStation whatsappPhone={whatsappPhone} />
          </Station>

          <Station progress={scrollYProgress} enter={0.2} hold={0.3} exit={0.38} className="is-chaos" tiltX={tiltX} tiltY={tiltY}>
            <p className="sg-world-chaos">
              Right now, your business is <em>floating in pieces.</em>
            </p>
          </Station>

          <Station progress={scrollYProgress} enter={0.34} hold={0.46} exit={0.56} tiltX={tiltX} tiltY={tiltY}>
            <ThesisStation />
          </Station>

          <Station progress={scrollYProgress} enter={0.5} hold={0.6} exit={0.68} tiltX={tiltX} tiltY={tiltY}>
            <ProofStation />
          </Station>

          <Station progress={scrollYProgress} enter={0.72} hold={0.88} exit={1} stay tiltX={tiltX} tiltY={tiltY}>
            <CoreStation />
          </Station>
        </motion.div>

        {/* darkens toward the edges as scroll speed increases — settles
            away completely at rest */}
        <motion.div className="sg-world-vignette" aria-hidden="true" style={{ opacity: vignetteOpacity }} />

        {/* HUD */}
        <div className="sg-world-hud" aria-hidden="true">
          <div className="sg-world-depth">
            DEPTH <motion.b>{depthText}</motion.b> M
          </div>
          <div className="sg-world-rail">
            {RAIL.map((label, i) => (
              <RailItem key={label} label={label} index={i} railIndex={railIndex} />
            ))}
          </div>
          <div className="sg-world-hint">SCROLL TO DESCEND</div>
        </div>
      </div>
    </section>
  )
}

function RailItem({ label, index, railIndex }) {
  const opacity = useTransform(railIndex, v => (v === index ? 1 : 0.38))
  return <motion.span style={{ opacity }}>{label}</motion.span>
}

function Debris({ d, progress, tiltX, tiltY }) {
  // Debris lives in the depth band between the hero and thesis stations,
  // staggered by its z offset so pieces stream past rather than arrive at once.
  const start = 0.14 + d.z * 0.24
  const end = start + 0.2
  const opacity = useTransform(progress, v =>
    mapRange(v, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]),
  )
  const transform = useTransform(progress, v => {
    const scale = mapRange(v, [start, end], [0.5, 1.7])
    const drift = mapRange(v, [start, end], [0.55, 1.85])
    const x = (d.x * drift).toFixed(2)
    const y = (d.y * drift).toFixed(2)
    const rot = (d.r * drift).toFixed(1)
    return `translate(-50%, -50%) translate(${x}vw, ${y}vh) rotate(${rot}deg) scale(${scale.toFixed(3)})`
  })
  
  // Mobile parallax tilt offset (only active when gyro events fire)
  const tiltOffX = useTransform(tiltX, v => v * 45 * (d.z * 10))
  const tiltOffY = useTransform(tiltY, v => v * 45 * (d.z * 10))

  return (
    <motion.div
      className="sg-world-debris"
      style={{ opacity, transform, left: '50%', top: '50%' }}
    >
      <motion.div style={{ x: tiltOffX, y: tiltOffY }}>
        <small>{d.tag}</small>
        {d.text}
      </motion.div>
    </motion.div>
  )
}

const heroRise = i => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.12 + i * 0.09, ease: [0.16, 1, 0.3, 1] },
})

function HeroStation({ whatsappPhone }) {
  return (
    <div className="sg-world-hero">
      <motion.p {...heroRise(0)} className="sg-world-kicker">BUSINESS SYSTEMS STUDIO &mdash; LIVE IN PRODUCTION TODAY</motion.p>
      <motion.h1 {...heroRise(1)}>
        One <span className="w-blue">system</span> instead of{' '}
        <span className="w-orange">six tools.</span>
      </motion.h1>
      <motion.p {...heroRise(2)} className="sg-world-sub">
        Spreadsheets, chat groups, paper files, and three apps that don't talk to
        each other. We design, build, and run the single system that replaces all
        of it &mdash; customers, staff, inventory, payments, and reporting in one
        dashboard your team will actually use.
      </motion.p>
      <motion.div {...heroRise(3)} className="sg-world-actions">
        <Link to="/products" className="btn-primary">
          See our products <ArrowRight size={16} />
        </Link>
        <Link to="/price-estimator" className="sg-home-text-link">
          Start a project <ArrowRight size={15} />
        </Link>
        <a
          href={`https://wa.me/${whatsappPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="sg-home-text-link"
        >
          Chat on WhatsApp <ArrowUpRight size={15} />
        </a>
      </motion.div>
      <motion.div {...heroRise(4)} className="sg-world-trusted">
        <span className="sg-world-trusted-label">TRUSTED BY</span>
        {TRUSTED_BY.map(name => (
          <span key={name}>{name}</span>
        ))}
      </motion.div>
      <motion.div {...heroRise(5)} className="sg-world-feed" aria-hidden="true">
        <span className="sg-world-feed-label"><i /> LIVE FROM OUR SYSTEMS</span>
        <span className="sg-world-feed-track">
          <span>{FEED.join('   ·   ')}   ·   </span>
          <span>{FEED.join('   ·   ')}   ·   </span>
        </span>
      </motion.div>
    </div>
  )
}

function ThesisStation() {
  return (
    <div className="sg-world-thesis">
      <h2>
        <span>A website gets you <i className="w-blue">found.</i></span>
        <span>A system keeps you <i className="w-green">running.</i></span>
      </h2>
      <div className="sg-world-thesis-annot">
        <span>WEBSITES <i>/ the front door</i></span>
        <span>CUSTOM SOFTWARE <i>/ everything behind it</i></span>
      </div>
    </div>
  )
}

function ProofStation() {
  return (
    <div className="sg-world-proof">
      <p className="sg-world-proof-kicker">NOT PROMISES &mdash; PRODUCTION</p>
      <div className="sg-world-proof-grid">
        {PROOF_STATS.map(stat => (
          <div key={stat.label}>
            <strong className={`tone-${stat.tone}`}>{stat.value}</strong>
            <small>{stat.label}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

function CoreStation() {
  return (
    <div className="sg-world-core">
      <div className="sg-world-core-panel">
        <div className="sg-world-core-head">
          <span>APP.STORMGLIDE.IO</span>
          <span className="live">LIVE</span>
        </div>
        <div className="sg-world-core-grid">
          {CORE_STATS.map(stat => (
            <div key={stat.label}>
              <small>{stat.label}</small>
              <strong className={`tone-${stat.tone}`}>{stat.value}</strong>
            </div>
          ))}
        </div>
      </div>
      <p className="sg-world-core-caption">ONE SYSTEM. EVERY MOVING PART.</p>
    </div>
  )
}
