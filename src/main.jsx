import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './lib/analytics'

const root = document.getElementById('root')
root.replaceChildren()
document.head.querySelectorAll('[data-sg-static-seo]').forEach(node => node.remove())

initAnalytics()

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

function dismissBootLoader() {
  const bootLoader = document.getElementById('sg-boot-loader')
  if (!bootLoader) return
  bootLoader.classList.add('is-ready')
  window.setTimeout(() => bootLoader.remove(), 260)
}

// rAF can fail to fire in some contexts (backgrounded/automated tabs), and this
// loader sits at z-index 9999 over the whole app — a stuck one blocks every
// click, so it's dismissed redundantly rather than relying on a single path.
window.requestAnimationFrame(dismissBootLoader)
window.setTimeout(dismissBootLoader, 600)
