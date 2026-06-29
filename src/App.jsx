import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useEffect, useRef, lazy, Suspense } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { AdminProvider } from './context/AdminContext'
import BrandLoader from './components/common/BrandLoader'
import RouteSEO from './components/common/RouteSEO'

/* ── Lazy-loaded pages (each becomes its own chunk) ── */
const Home          = lazy(() => import('./pages/Home'))
const ProductsPage  = lazy(() => import('./pages/ProductsPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const NexusHRMLanding = lazy(() => import('./pages/ProductLandingNexusHRM'))
const CargoScanLanding = lazy(() => import('./pages/ProductLandingCargoScan'))
const SANOLanding   = lazy(() => import('./pages/ProductLandingSANO'))
const ServiceLandingSoftwareDevelopment = lazy(() => import('./pages/ServiceLandingSoftwareDevelopment'))
const ServiceLandingSaasDevelopment = lazy(() => import('./pages/ServiceLandingSaasDevelopment'))
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

/* ── Scroll progress bar ── */
function ScrollProgress() {
  const progressRef = useRef(null)

  useEffect(() => {
    let frame = 0

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const el = document.documentElement
        const scrolled = el.scrollTop || document.body.scrollTop
        const total = el.scrollHeight - el.clientHeight
        const pct = total > 0 ? scrolled / total : 0
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${pct})`
        }
        frame = 0
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={progressRef} id="sg-scroll-progress" />
}

/* ── Animated routes ── */
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <Suspense key={location.pathname} fallback={<PageLoader />}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/"               element={<Home />} />
          <Route path="/nexus-hrm"      element={<NexusHRMLanding />} />
          <Route path="/cargoscan"      element={<CargoScanLanding />} />
          <Route path="/sano-health"    element={<SANOLanding />} />
          <Route path="/services"       element={<ServicesPage />} />
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
          <Route path="/products"       element={<ProductsPage />} />
          <Route path="/products/nexus-hrm" element={<Navigate to="/nexus-hrm" replace />} />
          <Route path="/products/cargoscan" element={<Navigate to="/cargoscan" replace />} />
          <Route path="/products/sano" element={<Navigate to="/sano-health" replace />} />
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
      </motion.div>
      <RouteSEO />
    </Suspense>
  )
}

/* ── The main interactive layout ── */
function SiteContent() {
  return (
    <>
      <ScrollProgress />
      <AnimatedRoutes />
    </>
  )
}

function AdminDeprecatedRedirect() {
  useEffect(() => {
    window.location.href = 'https://frontend-ten-blush-98.vercel.app/admin/login';
  }, []);
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050608', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Admin Portal Moved</h1>
        <p style={{ color: '#888' }}>Redirecting you to the new Stormglide Mission Control...</p>
        <a href="https://frontend-ten-blush-98.vercel.app/admin/login" style={{ color: '#5AD1FF', marginTop: '24px', display: 'inline-block', textDecoration: 'none' }}>
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
            <SiteContent />
          </BrowserRouter>
        </AdminProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
