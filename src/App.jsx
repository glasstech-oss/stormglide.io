import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AnimatePresence, motion, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { AdminProvider } from './context/AdminContext'
import BrandLoader from './components/common/BrandLoader'
import RouteSEO from './components/common/RouteSEO'
import { trackPageview } from './lib/analytics'
import SquircleDefs from './components/common/SquircleDefs'
import AINavBar from './components/layout/AINavBar'
import WhatsAppFloat from './components/layout/WhatsAppFloat'
import CanvasBackground from './components/layout/CanvasBackground'
import StormGliderGame from './components/game/StormGliderGame'
import { BOARD_PATHS, getBoardKey, getMove, getSpatialPosition } from './lib/spatialBoard'
import { boardPageComponents } from './lib/boardPages'
import { OVERLAY_KEY, setPanelNode, useActivePanelNode } from './lib/panelRegistry'

/* ── Lazy-loaded sub-pages (the 6 board pages live in ./lib/boardPages.js) ── */
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const WorkDetail = lazy(() => import('./pages/WorkDetail'))
const IndustriesIndex = lazy(() => import('./pages/IndustriesIndex'))
const IndustryLanding = lazy(() => import('./pages/IndustryLanding'))
const SystemsAudit = lazy(() => import('./pages/SystemsAudit'))
const InsightsIndex = lazy(() => import('./pages/InsightsIndex'))
const InsightArticle = lazy(() => import('./pages/InsightArticle'))
const PriceEstimator = lazy(() => import('./pages/PriceEstimator'))
const NexusHRMLanding = lazy(() => import('./pages/ProductLandingNexusHRM'))
const CargoScanLanding = lazy(() => import('./pages/ProductLandingCargoScan'))
const SANOLanding   = lazy(() => import('./pages/ProductLandingSANO'))
const NexusDentalLanding = lazy(() => import('./pages/ProductLandingNexusDental'))
const ServiceLandingSoftwareDevelopment = lazy(() => import('./pages/ServiceLandingSoftwareDevelopment'))
const ServiceLandingSaasDevelopment = lazy(() => import('./pages/ServiceLandingSaasDevelopment'))
const ServiceLandingWebsiteDevelopment = lazy(() => import('./pages/ServiceLandingWebsiteDevelopment'))
const ServiceLandingWebAppDevelopment = lazy(() => import('./pages/ServiceLandingWebAppDevelopment'))
const ServiceLandingMobileAppDevelopment = lazy(() => import('./pages/ServiceLandingMobileAppDevelopment'))
const ServiceLandingDesign = lazy(() => import('./pages/ServiceLandingDesign'))
const ServiceLandingPrototyping = lazy(() => import('./pages/ServiceLandingPrototyping'))
const ClientLogin   = lazy(() => import('./pages/client/ClientLogin'))
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'))
const ClientProject = lazy(() => import('./pages/client/ClientProject'))
const ClientInvoices = lazy(() => import('./pages/client/ClientInvoices'))
const ClientSupportTickets = lazy(() => import('./pages/client/ClientSupportTickets'))
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'))

/* ── Page loading skeleton ── */
function PageLoader() {
  return (
    <div className="sg-page-loader">
      <BrandLoader label="Loading page" />
    </div>
  )
}

/* ── Scroll progress bar — tracks whichever panel/overlay is currently active ── */
function ScrollProgress({ activeNode }) {
  const progressRef = useRef(null)

  useEffect(() => {
    if (!activeNode) return undefined
    let frame = 0

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const scrolled = activeNode.scrollTop
        const total = activeNode.scrollHeight - activeNode.clientHeight
        const pct = total > 0 ? scrolled / total : 0
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${pct})`
        }
        frame = 0
      })
    }

    onScroll()
    activeNode.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      activeNode.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [activeNode])

  return <div ref={progressRef} id="sg-scroll-progress" />
}

const BOARD_EASE = [0.22, 1, 0.36, 1]
const BOARD_DURATION = 0.5

/* Variants receive { move } via AnimatePresence `custom`.
   Used by the depth/off-board overlay (sub-pages, client portal, 404) — the
   6 main destinations no longer mount/unmount, so they don't need these. */
const pageVariants = {
  initial: ({ move }) => {
    // A native View Transition is already handling this navigation's visuals
    // (see viewTransition.js) — stay at the settled state so Framer Motion
    // doesn't also animate the same nav on top of it.
    if (move.type === 'instant') return { opacity: 1, y: 0, x: 0, rotateY: 0, scale: 1 }
    if (move.type === 'lateral') {
      return {
        x: `${move.dir * 6}%`,
        rotateY: move.dir * -8,
        scale: 0.98,
        opacity: 0,
        transformOrigin: move.dir > 0 ? 'left center' : 'right center',
      }
    }
    if (move.type === 'depth') {
      return { scale: move.dir > 0 ? 1.035 : 0.975, opacity: 0, x: 0, rotateY: 0 }
    }
    return { opacity: 0, y: 10, x: 0, rotateY: 0, scale: 1 }
  },
  animate: {
    x: 0,
    y: 0,
    rotateY: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: BOARD_DURATION, ease: BOARD_EASE },
  },
  exit: ({ move }) => {
    if (move.type === 'instant') return { opacity: 1, y: 0, x: 0, rotateY: 0, scale: 1, transition: { duration: 0 } }
    if (move.type === 'lateral') {
      return {
        x: `${move.dir * -5}%`,
        rotateY: move.dir * 6,
        scale: 0.985,
        opacity: 0,
        transformOrigin: move.dir > 0 ? 'right center' : 'left center',
        transition: { duration: BOARD_DURATION * 0.7, ease: BOARD_EASE },
      }
    }
    if (move.type === 'depth') {
      return {
        scale: move.dir > 0 ? 0.975 : 1.03,
        opacity: 0,
        transition: { duration: BOARD_DURATION * 0.7, ease: BOARD_EASE },
      }
    }
    return { opacity: 0, y: -6, transition: { duration: 0.22, ease: BOARD_EASE } }
  },
}

/* Every non-board route. `includeTopLevel` also mounts the 6 board pages —
   used by the mobile fallback, which has no persistent board to draw them from. */
function SiteRoutes({ location, includeTopLevel }) {
  return (
    <Routes location={location}>
      {includeTopLevel && BOARD_PATHS.map(path => {
        const Component = boardPageComponents[path]
        return <Route key={path} path={path} element={<Component />} />
      })}
      <Route path="/nexus-hrm"      element={<NexusHRMLanding />} />
      <Route path="/cargoscan"      element={<CargoScanLanding />} />
      <Route path="/sano-health"    element={<SANOLanding />} />
      <Route path="/nexus-dental"   element={<NexusDentalLanding />} />
      <Route path="/services/software-development"           element={<ServiceLandingSoftwareDevelopment />} />
      <Route path="/services/saas-development"               element={<ServiceLandingSaasDevelopment />} />
      <Route path="/services/website-development"            element={<ServiceLandingWebsiteDevelopment />} />
      <Route path="/services/web-app-development"            element={<ServiceLandingWebAppDevelopment />} />
      <Route path="/services/mobile-app-development"         element={<ServiceLandingMobileAppDevelopment />} />
      <Route path="/services/design-services"                element={<ServiceLandingDesign />} />
      <Route path="/services/prototyping"                    element={<ServiceLandingPrototyping />} />
      <Route path="/services/website-development-ghana"      element={<ServiceLandingWebsiteDevelopment />} />
      <Route path="/services/web-app-development-ghana"      element={<ServiceLandingWebAppDevelopment />} />
      <Route path="/services/mobile-app-development-ghana"   element={<ServiceLandingMobileAppDevelopment />} />
      <Route path="/services/design-services-ghana"          element={<ServiceLandingDesign />} />
      <Route path="/services/prototyping-ghana"              element={<ServiceLandingPrototyping />} />
      <Route path="/products/nexus-hrm" element={<Navigate to="/nexus-hrm" replace />} />
      <Route path="/products/cargoscan" element={<Navigate to="/cargoscan" replace />} />
      <Route path="/products/sano" element={<Navigate to="/sano-health" replace />} />
      <Route path="/products/nexus-dental" element={<Navigate to="/nexus-dental" replace />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/work/:slug" element={<WorkDetail />} />
      <Route path="/industries" element={<IndustriesIndex />} />
      <Route path="/industries/:slug" element={<IndustryLanding />} />
      <Route path="/price-estimator" element={<PriceEstimator />} />
      <Route path="/systems-audit" element={<SystemsAudit />} />
      <Route path="/insights" element={<InsightsIndex />} />
      <Route path="/insights/:slug" element={<InsightArticle />} />
      <Route path="/about"          element={<Navigate to="/contact" replace />} />
      <Route path="/admin/*" element={<AdminDeprecatedRedirect />} />
      <Route path="/client/login" element={<ClientLogin />} />
      <Route path="/client/dashboard" element={<ClientDashboard />} />
      <Route path="/client/project" element={<ClientProject />} />
      <Route path="/client/invoices" element={<ClientInvoices />} />
      <Route path="/client/support-tickets" element={<ClientSupportTickets />} />
      {/* Board paths must resolve to nothing here (not the wildcard below) — they're
          rendered by their persistent board panel, and this overlay just sits empty
          and invisible while one of them is active. */}
      {!includeTopLevel && BOARD_PATHS.map(path => <Route key={`empty-${path}`} path={path} element={null} />)}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

/* ── One persistently-mounted board panel (one of the 6 main destinations) ── */
function BoardPanel({ path, index, visited }) {
  const ref = useRef(null)
  const Component = boardPageComponents[path]

  useEffect(() => {
    setPanelNode(path, ref.current)
    return () => setPanelNode(path, null)
  }, [path])

  return (
    <div
      ref={ref}
      className="sg-board-panel"
      style={{
        position: 'absolute',
        left: `${index * 100}vw`,
        top: 0,
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        // The board keeps every visited panel mounted so state/scroll persists,
        // but that means 5 pages' worth of cards (each with infinite CSS
        // animations + backdrop-filter blur) were animating/compositing in the
        // background at all times — content-visibility:auto tells the browser
        // to skip layout/paint/animation entirely for whichever panels aren't
        // actually on-screen, without unmounting them (unlike display:none).
        contentVisibility: 'auto',
        containIntrinsicSize: '100vw 100vh',
        overscrollBehavior: 'contain',
        // Live-updating widgets (OperationsFlow's chart/log) change layout
        // above the fold; scroll anchoring would "compensate" by nudging
        // scrollTop every tick, making the page drift on its own.
        overflowAnchor: 'none',
      }}
    >
      {visited && (
        <Suspense fallback={<PageLoader />}>
          <Component />
        </Suspense>
      )}
    </div>
  )
}

/* ── The persistent canvas: a spring-driven camera panning across 6 always-mounted panels ── */
function Board({ activeX, instant, visitedPanels }) {
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth)
  const cameraX = useSpring(-activeX * viewportWidth, { stiffness: 140, damping: 24 })
  const hasMounted = useRef(false)

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      setViewportWidth(w)
      cameraX.jump(-activeX * w)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeX, cameraX])

  useEffect(() => {
    const target = -activeX * viewportWidth
    if (instant || !hasMounted.current) {
      cameraX.jump(target)
      hasMounted.current = true
    } else {
      cameraX.set(target)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeX])

  // While the camera is in flight, flag the document so CSS can temporarily
  // drop backdrop-filter/shimmer work — compositing dozens of blurred glass
  // layers during a full-viewport pan is what made pans take multiple seconds
  // on mid-range machines.
  useEffect(() => {
    const root = document.documentElement
    const clear = () => root.removeAttribute('data-sg-panning')
    const unsubStart = cameraX.on('animationStart', () => root.setAttribute('data-sg-panning', ''))
    const unsubEnd = cameraX.on('animationComplete', clear)
    const unsubCancel = cameraX.on('animationCancel', clear)
    return () => { unsubStart(); unsubEnd(); unsubCancel(); clear() }
  }, [cameraX])

  const trackStyle = {
    // absolute + inset:0, not relative — these two tracks must overlap exactly
    // (both spanning the whole board), not stack as normal-flow block siblings.
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: `${BOARD_PATHS.length * 100}vw`,
    x: cameraX,
    willChange: 'transform',
  }

  return (
    <div className="sg-board" style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 1 }}>
      <motion.div className="sg-board-track" style={trackStyle}>
        {BOARD_PATHS.map((path, index) => (
          <BoardPanel key={path} path={path} index={index} visited={visitedPanels.has(path)} />
        ))}
      </motion.div>
    </div>
  )
}

/* ── Depth/off-board overlay: service & product detail pages, client portal, 404.
     Its <Routes> has no match while a board path is active, so it's naturally
     empty — the opacity/pointer-events toggle just keeps it out of the way. ── */
function DepthOverlay({ location, move, isActive }) {
  const ref = useRef(null)

  useEffect(() => {
    setPanelNode(OVERLAY_KEY, ref.current)
    return () => setPanelNode(OVERLAY_KEY, null)
  }, [])

  return (
    <div
      ref={ref}
      className="sg-depth-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        overflowY: isActive ? 'auto' : 'hidden',
        overflowX: 'hidden',
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? 'auto' : 'none',
        transition: 'opacity 260ms ease',
        background: isActive ? 'var(--color-background)' : 'transparent',
      }}
    >
      <Suspense fallback={<PageLoader />}>
        <div style={{ perspective: '2200px', overflowX: 'clip', position: 'relative' }}>
          <AnimatePresence mode="popLayout" initial={false} custom={{ move }}>
            <motion.div
              key={location.pathname}
              custom={{ move }}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ backfaceVisibility: 'hidden', willChange: 'transform, opacity' }}
            >
              <SiteRoutes location={location} includeTopLevel={false} />
            </motion.div>
          </AnimatePresence>
        </div>
      </Suspense>
    </div>
  )
}

const DESKTOP_BOARD_QUERY = '(min-width: 920px)'

function useIsDesktopBoard() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_BOARD_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_BOARD_QUERY)
    // Belt-and-suspenders: some environments resize the viewport without firing
    // a MediaQueryList 'change' event, so also recheck on a plain window resize.
    const handler = () => setIsDesktop(mq.matches)
    mq.addEventListener('change', handler)
    window.addEventListener('resize', handler)
    return () => {
      mq.removeEventListener('change', handler)
      window.removeEventListener('resize', handler)
    }
  }, [])
  return isDesktop
}

/* ── The main interactive layout ── */
function SiteContent() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const isDesktopBoard = useIsDesktopBoard()

  const [trail, setTrail] = useState({ curr: location.pathname, prev: null })
  if (trail.curr !== location.pathname) {
    setTrail({ curr: location.pathname, prev: trail.curr })
  }

  useEffect(() => {
    trackPageview(location.pathname)
  }, [location.pathname])

  const currentPos = getSpatialPosition(location.pathname)
  const move = location.state?.sgViaVT
    ? { type: 'instant' } // a native View Transition is driving this nav's visuals — see viewTransition.js
    : reduceMotion
      ? { type: 'fade' }
      : getMove(trail.prev ? getSpatialPosition(trail.prev) : currentPos, currentPos)

  const boardKey = getBoardKey(location.pathname)
  const [visitedPanels, setVisitedPanels] = useState(() => new Set(boardKey ? [boardKey] : []))
  if (boardKey && !visitedPanels.has(boardKey)) {
    setVisitedPanels(prev => new Set(prev).add(boardKey))
  }

  // `trail.prev` is null only until the first navigation happens (see above) —
  // reuse that as "is this the very first render" instead of a render-time ref.
  const instant = trail.prev === null

  const [lastBoardX, setLastBoardX] = useState(currentPos ? currentPos.x : 0)
  if (currentPos && lastBoardX !== currentPos.x) {
    setLastBoardX(currentPos.x)
  }

  const isOverlayActive = !currentPos || currentPos.depth > 0
  const scrollNode = useActivePanelNode()

  return (
    <>
      <CanvasBackground />
      <ScrollProgress activeNode={scrollNode} />
      {isDesktopBoard ? (
        <>
          <Board activeX={lastBoardX} instant={instant} visitedPanels={visitedPanels} />
          <DepthOverlay location={location} move={move} isActive={isOverlayActive} />
        </>
      ) : (
        <Suspense fallback={<PageLoader />}>
          <div style={{ perspective: '2200px', overflowX: 'clip', position: 'relative' }}>
            <AnimatePresence mode="popLayout" initial={false} custom={{ move }}>
              <motion.div
                key={location.pathname}
                custom={{ move }}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ backfaceVisibility: 'hidden', willChange: 'transform, opacity' }}
              >
                <SiteRoutes location={location} includeTopLevel />
              </motion.div>
            </AnimatePresence>
          </div>
        </Suspense>
      )}
      <WhatsAppFloat />
      <AINavBar />
      <StormGliderGame />
      <RouteSEO />
    </>
  )
}

function AdminDeprecatedRedirect() {
  useEffect(() => {
    window.location.href = 'https://admin.stormglide.io/admin/login';
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050608', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Admin Portal Moved</h1>
        <p style={{ color: '#888' }}>Redirecting you to the new Stormglide Mission Control...</p>
        <a href="https://admin.stormglide.io/admin/login" style={{ color: '#5AD1FF', marginTop: '24px', display: 'inline-block', textDecoration: 'none' }}>
          Click here if not redirected
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AdminProvider>
          <BrowserRouter>
            <SquircleDefs />
            <SiteContent />
          </BrowserRouter>
        </AdminProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
