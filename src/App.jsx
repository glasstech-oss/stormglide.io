import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, lazy, Suspense } from 'react'
import { ThemeProvider, getThemeVariables, useTheme } from './context/ThemeContext'
import { AdminProvider } from './context/AdminContext'
import VariantSwitcher from './components/common/VariantSwitcher'
import SpotlightCursor from './components/common/SpotlightCursor'
import SplashScreen from './components/common/SplashScreen'

/* ── Lazy-loaded pages (each becomes its own chunk) ── */
const Home          = lazy(() => import('./pages/Home'))
const ProductsPage  = lazy(() => import('./pages/ProductsPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const NexusHRMLanding = lazy(() => import('./pages/ProductLandingNexusHRM'))
const CargoScanLanding = lazy(() => import('./pages/ProductLandingCargoScan'))
const SANOLanding   = lazy(() => import('./pages/ProductLandingSANO'))
const ServiceLandingWebsiteDevelopment = lazy(() => import('./pages/ServiceLandingWebsiteDevelopment'))
const ServiceLandingWebAppDevelopment = lazy(() => import('./pages/ServiceLandingWebAppDevelopment'))
const ServiceLandingMobileAppDevelopment = lazy(() => import('./pages/ServiceLandingMobileAppDevelopment'))
const ServiceLandingDesign = lazy(() => import('./pages/ServiceLandingDesign'))
const ServiceLandingPrototyping = lazy(() => import('./pages/ServiceLandingPrototyping'))
const ServicesPage  = lazy(() => import('./pages/ServicesPage'))
const AboutPage     = lazy(() => import('./pages/AboutPage'))
const ContactPage   = lazy(() => import('./pages/ContactPage'))
const WorkPage      = lazy(() => import('./pages/WorkPage'))
const PricingPage   = lazy(() => import('./pages/PricingPage'))
const AdminLogin    = lazy(() => import('./pages/AdminLogin'))
const AdminPortal   = lazy(() => import('./pages/AdminPortal'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminInfrastructure = lazy(() => import('./pages/admin/AdminInfrastructure'))
const AdminInvoices = lazy(() => import('./pages/admin/AdminInvoices'))
const AdminSupportTickets = lazy(() => import('./pages/admin/AdminSupportTickets'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))
const AdminInsights = lazy(() => import('./pages/admin/AdminInsights'))
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'))
const ClientLogin   = lazy(() => import('./pages/client/ClientLogin'))
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'))
const ClientProject = lazy(() => import('./pages/client/ClientProject'))
const ClientInvoices = lazy(() => import('./pages/client/ClientInvoices'))
const ClientSupportTickets = lazy(() => import('./pages/client/ClientSupportTickets'))
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'))

/* ── Page loading skeleton ── */
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-white)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--blue), var(--violet))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'sgLoaderPulse 1.4s ease-in-out infinite',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>S/</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--ink-300)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Loading…
        </div>
      </div>
      <style>{`@keyframes sgLoaderPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.92)} }`}</style>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const uid = sessionStorage.getItem('stormglide_admin_auth')
  if (!uid) return <Navigate to="/admin/login" replace />
  return children
}

/* ── Scroll progress bar ── */
function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop || document.body.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div id="sg-scroll-progress" style={{ width: `${pct}%` }} />
}

/* ── Animated routes ── */
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/"               element={<Home />} />
            <Route path="/nexus-hrm"      element={<NexusHRMLanding />} />
            <Route path="/cargoscan"      element={<CargoScanLanding />} />
            <Route path="/sano-health"    element={<SANOLanding />} />
            <Route path="/services"       element={<ServicesPage />} />
            <Route path="/services/website-development-ghana"      element={<ServiceLandingWebsiteDevelopment />} />
            <Route path="/services/web-app-development-ghana"      element={<ServiceLandingWebAppDevelopment />} />
            <Route path="/services/mobile-app-development-ghana"   element={<ServiceLandingMobileAppDevelopment />} />
            <Route path="/services/design-services-ghana"          element={<ServiceLandingDesign />} />
            <Route path="/services/prototyping-ghana"              element={<ServiceLandingPrototyping />} />
            <Route path="/products"       element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/about"          element={<AboutPage />} />
            <Route path="/contact"        element={<ContactPage />} />
            <Route path="/work"           element={<WorkPage />} />
            <Route path="/pricing"        element={<PricingPage />} />
            <Route path="/admin/*" element={<AdminDeprecatedRedirect />} />
            <Route path="/client/login" element={<ClientLogin />} />
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/project" element={<ClientProject />} />
            <Route path="/client/invoices" element={<ClientInvoices />} />
            <Route path="/client/support-tickets" element={<ClientSupportTickets />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── The main interactive layout ── */
function SiteContent() {
  return (
    <>
      <ScrollProgress />
      <VariantSwitcher />
      <SpotlightCursor />
      <AnimatedRoutes />
    </>
  )
}

/* ── Context-Aware Cursor Layer ── */
function ThemeRevealLayer() {
  const { theme, activeVariant, visualVariants } = useTheme()
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isDarkSection, setIsDarkSection] = useState(true)
  const [isOverCTA, setIsOverCTA] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const listener = e => setReduceMotion(e.matches)
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [])

  useEffect(() => {
    if (activeVariant.id !== 'aurora' || reduceMotion) {
      document.documentElement.style.setProperty('--cursor-page-x', '-999px')
      document.documentElement.style.setProperty('--cursor-page-y', '-999px')
      return
    }

    const onPointerMove = (e) => {
      const element = document.elementFromPoint(e.clientX, e.clientY)

      // Detect if cursor is over a CTA button
      const isOverButton = element?.closest('a[href="/contact"], a[href="/solutions"], a[href="/services"]') ||
                          element?.closest('[class*="btn"], [class*="CTA"]') ||
                          element?.getAttribute('data-cta') === 'true'
      setIsOverCTA(!!isOverButton)

      // Detect section background darkness
      const section = element?.closest('section')
      if (section) {
        const bgColor = window.getComputedStyle(section).backgroundColor
        // Check if background is dark (luminance < 128)
        const rgb = bgColor.match(/\d+/g)
        if (rgb && rgb.length >= 3) {
          const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255
          setIsDarkSection(luminance < 0.5)
        }
      }

      document.documentElement.style.setProperty('--cursor-page-x', `${e.pageX}px`)
      document.documentElement.style.setProperty('--cursor-page-y', `${e.pageY}px`)
    }

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        document.documentElement.style.setProperty('--cursor-page-x', `${touch.pageX}px`)
        document.documentElement.style.setProperty('--cursor-page-y', `${touch.pageY}px`)
      }
    }

    const onPointerLeave = () => {
      document.documentElement.style.setProperty('--cursor-page-x', '-999px')
      document.documentElement.style.setProperty('--cursor-page-y', '-999px')
      setIsOverCTA(false)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    document.body.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('touchend', onPointerLeave, { passive: true })
    window.addEventListener('touchcancel', onPointerLeave, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchmove', onTouchMove)
      document.body.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('touchend', onPointerLeave)
      window.removeEventListener('touchcancel', onPointerLeave)
      document.documentElement.style.setProperty('--cursor-page-x', '-999px')
      document.documentElement.style.setProperty('--cursor-page-y', '-999px')
    }
  }, [activeVariant.id, reduceMotion])

  if (activeVariant.id !== 'aurora' || reduceMotion || !isDarkSection) {
    return null
  }

  const editorialVariant = visualVariants['editorial'] || visualVariants['aurora']
  const revealVars = getThemeVariables(theme, editorialVariant, true)

  // Enhanced glow when over CTA, subtle otherwise
  const circleSize = isOverCTA ? '140px' : '120px'
  const glowIntensity = isOverCTA ? 0.5 : 0.3
  const maskGradient = `radial-gradient(circle ${circleSize} at var(--cursor-page-x, -999px) var(--cursor-page-y, -999px), rgba(0,0,0,${isOverCTA ? '0.45' : '0.35'}) 0%, rgba(0,0,0,${isOverCTA ? '0.35' : '0.25'}) 35%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.02) 80%, transparent 100%)`

  return (
    <div
      className="sg-theme-reveal-layer"
      aria-hidden="true"
      style={{
        ...revealVars,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        zIndex: 1798,
        background: 'var(--color-background)',
        color: 'var(--color-text-primary)',
        /* Context-aware warm light: subtle on sections, enhanced on CTAs */
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
        willChange: 'mask-image, -webkit-mask-image',
        filter: `drop-shadow(0 0 ${isOverCTA ? '90px' : '70px'} rgba(255, 180, 80, ${glowIntensity}))`,
        transition: 'filter 0.25s ease-out, mask-image 0.25s ease-out'
      }}
    >
      <SiteContent />
    </div>
  )
}

function AdminDeprecatedRedirect() {
  useEffect(() => {
    window.location.href = 'https://admin.stormglide.io/admin/dashboard';
  }, []);
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050608', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Admin Portal Moved</h1>
        <p style={{ color: '#888' }}>Redirecting you to the new Stormglide Mission Control...</p>
        <a href="https://admin.stormglide.io/admin/dashboard" style={{ color: '#5AD1FF', marginTop: '24px', display: 'inline-block', textDecoration: 'none' }}>
          Click here if not redirected
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AdminProvider>
          <BrowserRouter>
            <AnimatePresence>
              {showSplash && <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />}
            </AnimatePresence>

            {/* Main Interactive App Layer */}
            <SiteContent />

            {/* Warm Light Reveal Layer */}
            <ThemeRevealLayer />

          </BrowserRouter>
        </AdminProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
