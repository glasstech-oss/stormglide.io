import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, lazy, Suspense } from 'react'
import { ThemeProvider } from './context/ThemeContext'
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
const ServicesPage  = lazy(() => import('./pages/ServicesPage'))
const AboutPage     = lazy(() => import('./pages/AboutPage'))
const ContactPage   = lazy(() => import('./pages/ContactPage'))
const WorkPage      = lazy(() => import('./pages/WorkPage'))
const PricingPage   = lazy(() => import('./pages/PricingPage'))
const AdminLogin    = lazy(() => import('./pages/AdminLogin'))
const AdminPortal   = lazy(() => import('./pages/AdminPortal'))
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
  const auth = sessionStorage.getItem('stormglide_admin_auth')
  if (!auth) return <Navigate to="/admin/login" replace />
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
            <Route path="/products"       element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/services"       element={<ServicesPage />} />
            <Route path="/about"          element={<AboutPage />} />
            <Route path="/contact"        element={<ContactPage />} />
            <Route path="/work"           element={<WorkPage />} />
            <Route path="/pricing"        element={<PricingPage />} />
            <Route path="/admin/login"    element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminPortal />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
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

            <ScrollProgress />
            <VariantSwitcher />
            <SpotlightCursor />
            <AnimatedRoutes />
          </BrowserRouter>
        </AdminProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
