import { useEffect, useState } from 'react'
import Magnetic from '../common/Magnetic'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, House, Info, LayoutGrid, Menu, MonitorSmartphone, Package, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import BrandLogo from '../common/BrandLogo'
import AppearanceToggle from './AppearanceToggle'
import { useActivePanelNode } from '../../lib/panelRegistry'
import { prefetchBoardPage } from '../../lib/boardPages'

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Work', href: '/work' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { activeVariant } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const overHero = isHome && !scrolled
  const activePanelNode = useActivePanelNode()

  useEffect(() => {
    if (!activePanelNode) return undefined
    const handleScroll = () => setScrolled(activePanelNode.scrollTop > 8)
    handleScroll()
    activePanelNode.addEventListener('scroll', handleScroll, { passive: true })
    return () => activePanelNode.removeEventListener('scroll', handleScroll)
  }, [activePanelNode])

  return (
    <>
      {/* brand pinned top-left, outside the dock: backdrop-filter/transform on
          the nav would otherwise become the containing block for the logo */}
      <Link to="/" className="sg-logo sg-brand-pin" aria-label="Stormglide home">
        <BrandLogo className="sg-navbar-brand-logo" />
      </Link>
    <nav className={`sg-navbar ${overHero ? 'is-over-hero' : 'is-solid'}`} data-variant={activeVariant.id}>
      <div className="sg-navbar-inner">
        <div className="sg-nav-links">
          {NAV_LINKS.map(link => {
            const isActive = link.href === '/contact'
              ? location.pathname === '/contact'
              : location.pathname === link.href || location.pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                to={link.href}
                className={isActive ? 'is-active' : ''}
                onPointerEnter={() => prefetchBoardPage(link.href)}
                onFocus={() => prefetchBoardPage(link.href)}
              >
                {isActive && (
                  <motion.span
                    className="sg-nav-active-pill"
                    layoutId="sg-nav-active"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="sg-nav-link-label">{link.label}</span>
              </Link>
            )
          })}
        </div>

        <Magnetic strength={0.22}>
          <Link to="/contact#build" className="sg-nav-cta" data-cta="true">
            Let's build <ArrowRight size={14} />
          </Link>
        </Magnetic>

        <AppearanceToggle />

        {/* IG-style icon tab bar (mobile only) */}
        <div className="sg-dock-tabs" role="navigation" aria-label="Primary">
          {[
            { href: '/', label: 'Home', Icon: House },
            { href: '/services', label: 'Services', Icon: LayoutGrid },
            { href: '/products', label: 'Products', Icon: Package },
            { href: '/work', label: 'Work', Icon: MonitorSmartphone },
            { href: '/contact', label: 'About', Icon: Info },
          ].map(({ href, label, Icon }) => {
            const active = href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)
            return (
              <Link key={href} to={href} className={active ? 'is-active' : ''} aria-label={label}
                onPointerEnter={() => prefetchBoardPage(href)}>
                <Icon size={21} strokeWidth={active ? 2.4 : 1.8} />
                <small>{label}</small>
              </Link>
            )
          })}
        </div>

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
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
        /* Floating dock: the nav lives at the bottom-center as a pill, matching
           the world's HUD instruments and staying thumb-reachable on mobile.
           The brand escapes the dock and pins to the top-left on its own. */
        .sg-navbar {
          position: fixed;
          bottom: 18px;
          left: 0;
          right: 0;
          margin-inline: auto;
          width: fit-content;
          z-index: 1500;
          border-radius: 999px;
          border: 1px solid var(--color-border-subtle);
          color: var(--color-text-heading);
          background: color-mix(in srgb, var(--color-background) 86%, transparent);
          backdrop-filter: var(--glass-blur-strong);
          -webkit-backdrop-filter: var(--glass-blur-strong);
          box-shadow: 0 18px 44px -18px rgba(22, 35, 63, 0.35), inset 0 1px 0 var(--glass-highlight);
          transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }

        .sg-navbar-inner {
          padding: 0.45rem 0.6rem 0.45rem 1.1rem;
          display: flex;
          align-items: center;
          gap: 1.1rem;
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

        .sg-navbar-brand-logo { width: 178px; }

        .sg-nav-links {
          display: flex;
          align-items: center;
          gap: 1.28rem;
          margin-left: auto;
        }

        .sg-nav-links a {
          position: relative;
          color: var(--color-text-secondary);
          font-size: 0.87rem;
          font-weight: 650;
          text-decoration: none;
          padding: 0.42rem 0.75rem;
          border-radius: 999px;
          transition: color 150ms ease, transform 150ms ease;
        }

        .sg-nav-links a:hover {
          color: var(--color-text-heading);
          transform: translateY(-1px);
        }

        .sg-nav-links a.is-active {
          color: var(--color-text-heading);
        }

        .sg-nav-active-pill {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: var(--glass-bg-strong);
          border: 1px solid var(--glass-border);
          box-shadow: inset 0 1px 0 var(--glass-highlight);
          backdrop-filter: var(--glass-blur-soft);
          -webkit-backdrop-filter: var(--glass-blur-soft);
        }

        .sg-nav-link-label {
          position: relative;
          z-index: 1;
        }

        .sg-nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          border: 1px solid color-mix(in srgb, var(--sg-accent) 40%, var(--glass-border));
          border-radius: 999px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur-soft);
          -webkit-backdrop-filter: var(--glass-blur-soft);
          color: var(--sg-accent);
          padding: 0.58rem 0.95rem;
          font-size: 0.82rem;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
          transition: background 160ms ease, transform 160ms ease, color 160ms ease;
        }

        .sg-nav-cta:hover {
          background: linear-gradient(160deg, var(--sg-accent), var(--sg-accent-2));
          color: var(--color-background);
          transform: translateY(-1px);
        }

        .sg-dock-tabs { display: none; }

        .sg-mobile-menu-button {
          display: none;
          margin-left: auto;
          width: 42px;
          height: 42px;
          border: 1px solid var(--glass-border);
          border-radius: 999px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur-soft);
          -webkit-backdrop-filter: var(--glass-blur-soft);
          color: var(--color-text-heading);
          cursor: pointer;
          align-items: center;
          justify-content: center;
        }

        .sg-mobile-menu {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          margin-left: max(-46vw, -210px);
          width: min(92vw, 420px);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          background: var(--glass-bg-strong);
          clip-path: url(#sg-squircle);
          box-shadow: inset 0 1px 0 var(--glass-highlight);
          filter: drop-shadow(var(--shadow-lg-outer));
          padding: 0.75rem;
          backdrop-filter: var(--glass-blur-strong);
          -webkit-backdrop-filter: var(--glass-blur-strong);
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
            display: none;
          }

          .sg-navbar-inner {
            width: min(100% - 32px, 1280px);
            min-height: 66px;
          }
        }

        @media (max-width: 420px) {
          .sg-navbar-inner { gap: 0.48rem; }
          .sg-navbar-brand-logo { width: 148px; }
        }

        @media (max-width: 350px) {
          .sg-navbar-brand-logo { width: 132px; }
        }

        @media (max-width: 768px) {
          .sg-navbar {
            bottom: 10px;
            width: calc(100vw - 20px);
            border-radius: 26px;
          }
          .sg-navbar-inner {
            padding: 0.4rem 0.4rem;
            gap: 0;
          }
          .sg-nav-links, .sg-nav-cta, .sg-navbar .sg-appearance-toggle { display: none !important; }
          .sg-dock-tabs {
            display: flex;
            width: 100%;
            justify-content: space-around;
            align-items: center;
          }
          .sg-dock-tabs a {
            display: grid;
            justify-items: center;
            gap: 3px;
            padding: 0.5rem 0.9rem;
            border-radius: 18px;
            color: var(--color-text-secondary);
            text-decoration: none;
          }
          .sg-dock-tabs a.is-active {
            color: var(--sg-accent);
            background: color-mix(in srgb, var(--sg-accent) 9%, transparent);
          }
          .sg-dock-tabs small {
            font-family: var(--font-mono);
            font-size: 0.5rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }
        }
      `}</style>
    </nav>
    </>
  )
}
