// Google Analytics 4 — no-op until VITE_GA_MEASUREMENT_ID is set (see
// .env.example). React Router does all navigation client-side after the
// first load, so GA4's own automatic pageview (which only fires on a real
// page load) never fires again — send_page_view is disabled and pageviews
// are sent manually via trackPageview() on every route change instead.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export function initAnalytics() {
  if (!GA_ID || typeof window === 'undefined') return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false })
}

export function trackPageview(path) {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'page_view', { page_path: path })
}
