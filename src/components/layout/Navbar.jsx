import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Work', href: '/work' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { activeVariant } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const overHero = isHome && !scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`sg-navbar ${overHero ? 'is-over-hero' : 'is-solid'}`} data-variant={activeVariant.id}>
      <div className="sg-navbar-inner">
        <Link to="/" className="sg-logo" aria-label="Stormglide home" style={{ padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <svg viewBox="0 0 16 24" height="24" style={{ display: 'block', color: 'var(--color-text-heading)' }}>
            <rect x="4" y="0" width="6" height="6" fill="currentColor" />
            <rect x="12" y="0" width="4" height="7" fill="var(--sg-accent)" />
            <path d="M0 10 H10 V24 H4 V16 H0 Z" fill="currentColor" />
            <rect x="12" y="10" width="4" height="7" fill="currentColor" />
          </svg>
          <span style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontWeight: 800, 
            fontSize: '24px', 
            letterSpacing: '-0.04em', 
            color: 'var(--color-text-heading)',
            display: 'flex',
            alignItems: 'baseline'
          }}>
            stormglide.
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              ı
              <span style={{ 
                position: 'absolute', 
                top: '0.2em', 
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0.23em', 
                height: '0.23em', 
                backgroundColor: 'var(--sg-accent)', 
                borderRadius: '1.5px' 
              }}></span>
            </span>
            o
          </span>
        </Link>

        <div className="sg-nav-links">
          {NAV_LINKS.map(link => (
            <Link key={link.href} to={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <Link to="/contact" className="sg-nav-cta">
          Let's build <ArrowRight size={14} />
        </Link>

        <button
          type="button"
          className="sg-mobile-menu-button"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sg-mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {NAV_LINKS.map(link => (
              <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link to="/contact" className="btn-primary" onClick={() => setMobileOpen(false)}>
              Let's build <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .sg-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1500;
          border-bottom: 1px solid transparent;
          color: var(--color-text-heading);
          transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease, color 180ms ease;
        }

        .sg-navbar.is-over-hero {
          color: var(--color-text-heading);
          background: linear-gradient(180deg, color-mix(in srgb, var(--color-background) 72%, transparent), transparent);
        }

        .sg-navbar.is-solid {
          background: color-mix(in srgb, var(--color-surface) 88%, transparent);
          border-bottom-color: var(--color-border-subtle);
          box-shadow: var(--shadow-xs);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .sg-navbar-inner {
          width: min(1280px, calc(100% - 40px));
          min-height: 72px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1.35rem;
        }

        .sg-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.62rem;
          color: inherit;
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          text-decoration: none;
          white-space: nowrap;
        }

        .sg-logo span span {
          color: var(--sg-accent);
        }

        .sg-logo-mark {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid color-mix(in srgb, var(--sg-accent) 32%, transparent);
          border-radius: 10px;
          background: color-mix(in srgb, var(--sg-accent) 12%, transparent);
          color: var(--sg-accent);
          box-shadow: 0 0 24px color-mix(in srgb, var(--sg-accent) 14%, transparent);
          font-size: 0.78rem;
        }

        .sg-nav-links {
          display: flex;
          align-items: center;
          gap: 1.28rem;
          margin-left: auto;
        }

        .sg-nav-links a {
          color: var(--color-text-secondary);
          font-size: 0.87rem;
          font-weight: 650;
          text-decoration: none;
          transition: color 150ms ease, transform 150ms ease;
        }

        .sg-nav-links a:hover {
          color: var(--color-text-heading);
          transform: translateY(-1px);
        }

        .sg-nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          border: 1px solid color-mix(in srgb, var(--sg-accent) 32%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--sg-accent) 13%, transparent);
          color: var(--sg-accent);
          padding: 0.58rem 0.95rem;
          font-size: 0.82rem;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
          transition: background 160ms ease, transform 160ms ease;
        }

        .sg-nav-cta:hover {
          background: var(--sg-accent);
          color: var(--color-background);
          transform: translateY(-1px);
        }

        .sg-mobile-menu-button {
          display: none;
          margin-left: auto;
          width: 42px;
          height: 42px;
          border: 1px solid var(--color-border-subtle);
          border-radius: 999px;
          background: color-mix(in srgb, var(--color-surface) 72%, transparent);
          color: var(--color-text-heading);
          cursor: pointer;
          align-items: center;
          justify-content: center;
        }

        .sg-mobile-menu {
          width: min(100% - 32px, 420px);
          margin: 0 auto 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-lg);
          background: color-mix(in srgb, var(--color-surface) 95%, transparent);
          box-shadow: var(--shadow-lg);
          padding: 0.75rem;
          backdrop-filter: blur(18px);
        }

        .sg-mobile-menu a {
          border-radius: var(--radius);
          color: var(--color-text-heading);
          padding: 0.82rem 0.95rem;
          text-decoration: none;
          font-weight: 700;
        }

        .sg-mobile-menu a:not(.btn-primary):hover {
          background: color-mix(in srgb, var(--sg-accent) 10%, transparent);
        }

        @media (max-width: 1120px) {
          .sg-nav-links {
            gap: 0.9rem;
          }
        }

        @media (max-width: 920px) {
          .sg-nav-links,
          .sg-nav-cta {
            display: none;
          }

          .sg-mobile-menu-button {
            display: inline-flex;
          }

          .sg-navbar-inner {
            width: min(100% - 32px, 1280px);
            min-height: 66px;
          }
        }
      `}</style>
    </nav>
  )
}
