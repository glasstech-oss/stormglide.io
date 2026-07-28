import { useEffect, useState } from 'react'
import Magnetic from '../common/Magnetic'
import { AnimatePresence, motion, useTransform } from 'framer-motion'
import { ArrowRight, House, Info, LayoutGrid, Menu, MonitorSmartphone, Package, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import BrandLogo from '../common/BrandLogo'
import { useActivePanelNode } from '../../lib/panelRegistry'
import { prefetchBoardPage } from '../../lib/boardPages'
import { useGyroscope } from '../../hooks/useGyroscope'

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
  // Mobile-only (see .sg-navbar.is-dock-hidden, scoped to the same
  // max-width:768px breakpoint as the icon dock itself): hides the dock
  // while actively scrolling and brings it back once scrolling settles,
  // like a native app's tab bar. Starts false so the dock doesn't flash
  // hidden on initial mount, before any real scroll event has happened.
  const [dockHidden, setDockHidden] = useState(false)
  const { tiltX, tiltY } = useGyroscope({ stiffness: 120, damping: 25, mass: 0.4 })
  const liquidX = useTransform(tiltX, v => v * 16)
  const liquidY = useTransform(tiltY, v => v * 16)
  const liquidOppositeX = useTransform(tiltX, v => v * -12)
  const liquidOppositeY = useTransform(tiltY, v => v * -12)
  const { activeVariant } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const overHero = isHome && !scrolled
  const activePanelNode = useActivePanelNode()

  useEffect(() => {
    // activePanelNode comes from panelRegistry, which is only ever populated
    // by the desktop spatial-board components (Board/DepthOverlay in
    // App.jsx, gated at min-width:920px) — on mobile nothing registers a
    // node there, so it's always null and the plain document scroll (via
    // window) is the real thing to listen to instead.
    const node = activePanelNode || window
    const getScrollTop = () => (activePanelNode ? activePanelNode.scrollTop : document.documentElement.scrollTop)
    const syncScrolled = () => setScrolled(getScrollTop() > 8)
    syncScrolled()

    let idleTimer = null
    const handleScroll = () => {
      setScrolled(getScrollTop() > 8)
      setDockHidden(true)
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => setDockHidden(false), 400)
    }
    node.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      node.removeEventListener('scroll', handleScroll)
      clearTimeout(idleTimer)
    }
  }, [activePanelNode])

  return (
    <>
      {/* brand pinned top-left, outside the dock: backdrop-filter/transform on
          the nav would otherwise become the containing block for the logo */}
      <Link to="/" className="sg-logo sg-brand-pin" aria-label="Stormglide home">
        <BrandLogo className="sg-navbar-brand-logo" />
      </Link>
    <nav className={`sg-navbar ${overHero ? 'is-over-hero' : 'is-solid'}${dockHidden ? ' is-dock-hidden' : ''}`} data-variant={activeVariant.id}>
      <div className="sg-navbar-inner">
        <div className="sg-nav-links">
          {NAV_LINKS.map(link => {
            const isActive = link.href === '/contact'
              ? location.pathname === '/contact'
              : location.pathname === link.href || location.pathname.startsWith(`${link.href}/`)
            return (
              // The wrapper (not the Link) carries `layout` — the active
              // link grows slightly wider via CSS padding, and framer-motion
              // animates every sibling wrapper's resulting position shift,
              // which is what actually reads as "the others move apart".
              <motion.div layout key={link.href} className="sg-nav-item-wrap" transition={{ type: 'spring', stiffness: 420, damping: 34 }}>
                <Link
                  to={link.href}
                  className={isActive ? 'is-active' : ''}
                  onPointerEnter={() => prefetchBoardPage(link.href)}
                  onFocus={() => prefetchBoardPage(link.href)}
                >
                  {isActive && (
                    <motion.span
                      className="sg-nav-active-pill"
                      layoutId="sg-nav-active"
                      initial={{ borderRadius: '46% 54% 58% 42% / 52% 46% 54% 48%' }}
                      animate={{ borderRadius: '999px' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30, borderRadius: { duration: 0.5, ease: 'easeOut' } }}
                    >
                      {/* liquid-glass glint: sweeps across once on activation */}
                      <motion.span
                        className="sg-nav-active-sheen"
                        initial={{ x: '-130%', opacity: 0 }}
                        animate={{ x: '130%', opacity: [0, 1, 0] }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </motion.span>
                  )}
                  <span className="sg-nav-link-label">{link.label}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <Magnetic strength={0.22}>
          <Link to="/contact#build" className="sg-nav-cta" data-cta="true">
            Let's build <ArrowRight size={14} />
          </Link>
        </Magnetic>

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
              <Link key={href} to={href} className={active ? 'is-active sg-liquid-tab' : 'sg-liquid-tab'} aria-label={label}
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10)
                }}
                onPointerEnter={() => prefetchBoardPage(href)}>
                {active && (
                  <div className="sg-liquid-container">
                    <motion.div className="sg-liquid-blob blue" style={{ x: liquidX, y: liquidY }} />
                    <motion.div className="sg-liquid-blob orange" style={{ x: liquidOppositeX, y: liquidOppositeY }} />
                  </div>
                )}
                <span className="sg-dock-icon-wrapper">
                  <Icon size={21} strokeWidth={active ? 2.4 : 1.8} />
                </span>
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

        .sg-nav-item-wrap {
          display: flex;
        }

        .sg-nav-links a {
          position: relative;
          color: var(--color-text-secondary);
          font-size: 0.87rem;
          font-weight: 650;
          text-decoration: none;
          padding: 0.42rem 0.75rem;
          border-radius: 999px;
          transition: color 150ms ease, transform 150ms ease, padding 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sg-nav-links a:hover {
          color: var(--color-text-heading);
          transform: translateY(-1px);
        }

        .sg-nav-links a.is-active {
          color: var(--color-text-heading);
          /* The extra reach is what makes the wrapper's layout prop kick
             in — its resize is what pushes the neighboring items apart. */
          padding: 0.42rem 1.05rem;
        }

        .sg-nav-active-pill {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 999px;
          background: var(--glass-bg-strong);
          border: 1px solid var(--glass-border);
          box-shadow: inset 0 1px 0 var(--glass-highlight);
          backdrop-filter: var(--glass-blur-soft);
          -webkit-backdrop-filter: var(--glass-blur-soft);
        }

        .sg-nav-active-sheen {
          position: absolute;
          top: -60%;
          left: 0;
          width: 45%;
          height: 220%;
          background: linear-gradient(115deg, transparent, color-mix(in srgb, var(--sg-accent) 65%, white) 50%, transparent);
          filter: blur(2px);
          transform: skewX(-16deg);
          pointer-events: none;
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
            transition: transform 380ms cubic-bezier(0.16, 1, 0.3, 1), 
                        width 380ms cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 380ms cubic-bezier(0.16, 1, 0.3, 1), 
                        background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
          }
          /* Fluid dock: while scrolling, the dock shrinks into a translucent pill
             and drops down slightly, keeping it out of the way but still providing
             context of where you are (Dynamic Island style) */
          .sg-navbar.is-dock-hidden {
            transform: translateY(22px) scale(0.85);
            width: 50vw;
            opacity: 0.65;
            pointer-events: none;
            backdrop-filter: blur(8px) saturate(140%);
            -webkit-backdrop-filter: blur(8px) saturate(140%);
          }
          .sg-navbar.is-dock-hidden .sg-dock-tabs {
            opacity: 0;
            transform: scale(0.9);
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
            transition: opacity 300ms ease, transform 300ms ease;
          }
          .sg-dock-tabs a {
            display: grid;
            justify-items: center;
            gap: 3px;
            padding: 0.5rem 0.9rem;
            border-radius: 18px;
            color: var(--color-text-secondary);
            text-decoration: none;
            transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1), background 250ms ease, color 250ms ease;
          }
          .sg-liquid-tab {
            position: relative;
            overflow: hidden;
            z-index: 1;
          }
          .sg-liquid-container {
            position: absolute;
            inset: 0;
            z-index: -1;
            border-radius: 18px;
            overflow: hidden;
            background: #0B0F19;
            box-shadow: inset 0 1px 3px rgba(255,255,255,0.15), inset 0 -2px 6px rgba(0,0,0,0.6);
          }
          .sg-liquid-container::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 45%, transparent 65%, rgba(0,0,0,0.4) 100%);
            border-radius: inherit;
            pointer-events: none;
            z-index: 3;
          }
          .sg-liquid-blob {
            position: absolute;
            will-change: transform;
            opacity: 1;
          }
          .sg-liquid-blob.blue {
            width: 100%; height: 140%;
            top: -20%; left: -20%;
            background: var(--sg-accent);
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          }
          .sg-liquid-blob.orange {
            width: 150%; height: 150%;
            bottom: -15%; right: -25%;
            background: #FF6A00;
            border-radius: 50% 40% 30% 70% / 50% 60% 40% 40%;
            z-index: 2;
          }
          .sg-dock-icon-wrapper {
            position: relative;
            z-index: 2;
          }
          .sg-dock-tabs a:active {
            transform: scale(0.75) translateY(4px);
            transition: transform 80ms cubic-bezier(0.16, 1, 0.3, 1);
          }
          .sg-dock-tabs a.is-active {
            color: #ffffff;
            background: transparent;
            text-shadow: 0 1px 3px rgba(0,0,0,0.4);
          }
          .sg-dock-tabs a.is-active small {
            font-weight: 700;
          }
          .sg-dock-tabs small {
            font-family: var(--font-mono);
            font-size: 0.5rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }
        }

        @media (max-width: 768px) and (prefers-reduced-motion: reduce) {
          .sg-navbar { transition: none; }
          .sg-navbar.is-dock-hidden { transform: none; }
        }
      `}</style>
    </nav>
    </>
  )
}
