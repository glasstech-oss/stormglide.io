import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
root.replaceChildren()
document.head.querySelectorAll('[data-sg-static-seo]').forEach(node => node.remove())

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

window.requestAnimationFrame(() => {
  const bootLoader = document.getElementById('sg-boot-loader')
  if (!bootLoader) return
  bootLoader.classList.add('is-ready')
  window.setTimeout(() => bootLoader.remove(), 260)
})
