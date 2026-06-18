import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Palette } from 'lucide-react'
import { createRipple } from '../../utils/haptics'
import { AnimatePresence, motion } from 'framer-motion'

export default function VariantSwitcher() {
  const { activeVariant, visualVariants, setVisualVariant } = useTheme()
  const [open, setOpen] = useState(false)
  const [hoveredVariant, setHoveredVariant] = useState(null)
  const location = useLocation()

  if (location.pathname.startsWith('/admin')) return null

  const variants = Object.values(visualVariants)

  // Descriptive subtitles for each variant
  const variantSubtitles = {
    aurora: 'Cinematic dark with cyan accents',
    editorial: 'Premium light with warm tones',
    signal: 'Technical grid with precision',
  }

  return (
    <>
      <div className="sg-variant-shell" aria-label="Experience different design variants">
        {/* Desktop: Horizontal tab switcher */}
        <div className="sg-variant-desktop">
          {/* Animated glowing CTA bubble */}
          <div className="sg-variant-cta-bubble">
            <span style={{ marginRight: '4px' }}>✨</span> Click to Experience Themes!
          </div>

          <div className="sg-variant-header">
            <Palette size={14} />
            <span className="sg-variant-kicker">Try</span>
          </div>
          <div className="sg-variant-tabs">
            {variants.map(variant => {
              const active = activeVariant.id === variant.id
              return (
                <button
                  key={variant.id}
                  type="button"
                  aria-pressed={active}
                  title={`${variant.label}: ${variant.description}`}
                  className={`sg-variant-tab ${active ? 'is-active' : ''}`}
                  onMouseEnter={() => setHoveredVariant(variant.id)}
                  onMouseLeave={() => setHoveredVariant(null)}
                  onPointerDown={(e) => createRipple(e)}
                  onClick={() => setVisualVariant(variant.id)}
                >
                  <span className="sg-variant-tab-label">{variant.label}</span>
                  <span className="sg-variant-tab-subtitle">{variantSubtitles[variant.id]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile: Drawer switcher Trigger */}
        <div className="sg-variant-mobile">
          {!open && (
            <div className="sg-variant-cta-bubble mobile-cta">
              <span style={{ marginRight: '4px' }}>✨</span> Try Themes
            </div>
          )}
          <button
            type="button"
            className="sg-variant-mobile-pill"
            aria-expanded={open}
            onPointerDown={(e) => createRipple(e)}
            onClick={() => setOpen(true)}
          >
            <Palette size={16} />
            <span>{activeVariant.label}</span>
          </button>
        </div>
      </div>

      {/* Render Drawer OUTSIDE of .sg-variant-shell to escape transform containment */}
      <div className="sg-variant-drawer-portal">
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="sg-variant-mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                className="sg-variant-mobile-drawer"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <div className="sg-variant-drawer-handle" />
                <h3 className="sg-variant-drawer-title">Choose a Theme</h3>
                <div className="sg-variant-drawer-cards">
                  {variants.map(variant => {
                    const isActive = activeVariant.id === variant.id
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        className={`sg-variant-drawer-card ${isActive ? 'is-active' : ''}`}
                        onPointerDown={(e) => createRipple(e)}
                        onClick={() => {
                          setVisualVariant(variant.id)
                          setTimeout(() => setOpen(false), 150) // small delay to see ripple
                        }}
                      >
                        <div className="sg-variant-card-preview" style={{
                          background: variant.id === 'aurora' ? '#050608' : variant.id === 'editorial' ? '#F4F1EA' : '#ECEAE4',
                          borderColor: variant.id === 'aurora' ? '#5AD1FF' : variant.id === 'editorial' ? '#C8642F' : '#1AA15A'
                        }}>
                          <div className="sg-variant-card-accent" style={{ background: variant.id === 'aurora' ? '#5AD1FF' : variant.id === 'editorial' ? '#C8642F' : '#1AA15A' }} />
                        </div>
                        <div className="sg-variant-card-content">
                          <span className="sg-variant-card-label">{variant.label}</span>
                          <span className="sg-variant-card-desc">{variantSubtitles[variant.id]}</span>
                        </div>
                        <div className={`sg-variant-card-radio ${isActive ? 'is-active' : ''}`}>
                          {isActive && <div className="sg-variant-card-radio-inner" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .sg-variant-shell {
          position: fixed;
          left: 50%;
          bottom: 32px;
          top: auto;
          transform: translateX(-50%);
          z-index: 2200;
          pointer-events: none;
        }

        /* Highly visible pulsing CTA bubble */
        .sg-variant-cta-bubble {
          position: absolute;
          bottom: calc(100% + 14px);
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #FF3366 0%, #FF7733 100%);
          color: white;
          padding: 0.5rem 0.9rem;
          border-radius: 999px;
          font-family: var(--font-body), system-ui, sans-serif;
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.02em;
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(255, 51, 102, 0.4);
          animation: sg-variant-bounce 2s infinite cubic-bezier(0.28, 0.84, 0.42, 1);
          pointer-events: none;
          z-index: 10;
        }

        .sg-variant-cta-bubble::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: #FF5544;
        }

        .sg-variant-cta-bubble.mobile-cta {
          bottom: calc(100% + 12px);
          padding: 0.4rem 0.8rem;
          font-size: 0.7rem;
        }

        @keyframes sg-variant-bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }

        /* ========== DESKTOP VARIANT ========== */
        .sg-variant-desktop {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.4rem 0.45rem 0.4rem 0.7rem;
          border-radius: 999px;
          background: var(--color-surface);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          pointer-events: auto;
          animation: sg-variant-float 4s ease-in-out infinite alternate;
        }

        .sg-variant-desktop::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #FF3366, #FF9933, #33CCFF, #FF3366);
          background-size: 300% 100%;
          z-index: -1;
          animation: sg-variant-border-glow 4s linear infinite;
        }

        @keyframes sg-variant-border-glow {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        @keyframes sg-variant-float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }

        .sg-variant-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--color-text-secondary);
          padding-right: 0.6rem;
          margin-right: 0.2rem;
          border-right: 1px solid color-mix(in srgb, var(--color-text-primary) 15%, transparent);
        }

        .sg-variant-header svg {
          color: var(--color-text-primary);
          opacity: 0.9;
        }

        .sg-variant-kicker {
          color: var(--color-text-primary);
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .sg-variant-tabs {
          display: flex;
          gap: 0.3rem;
        }

        .sg-variant-tab {
          border: none;
          cursor: pointer;
          background: transparent;
          color: var(--color-text-secondary);
          padding: 0.5rem 0.9rem;
          border-radius: 999px;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .sg-variant-tab-label {
          display: block;
        }

        .sg-variant-tab-subtitle {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: color-mix(in srgb, var(--color-surface-alt) 95%, transparent);
          color: var(--color-text-primary);
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          font-size: 0.65rem;
          font-weight: 600;
          opacity: 0;
          pointer-events: none;
          transition: all 200ms ease;
          white-space: nowrap;
          border: 1px solid var(--color-border-subtle);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
          z-index: 20;
        }

        .sg-variant-tab:hover {
          color: var(--color-text-primary);
          background: color-mix(in srgb, var(--color-text-primary) 8%, transparent);
        }

        .sg-variant-tab:hover .sg-variant-tab-subtitle {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .sg-variant-tab.is-active {
          background: var(--color-text-heading);
          color: var(--color-background);
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }

        .sg-variant-mobile {
          display: none;
          pointer-events: auto;
          position: relative;
        }

        /* ========== MOBILE VARIANT ========== */
        @media (max-width: 920px) {
          .sg-variant-shell {
            top: auto;
            bottom: 24px;
            left: 50%;
            right: auto;
            width: auto;
            transform: translateX(-50%);
          }

          .sg-variant-desktop {
            display: none;
          }

          .sg-variant-mobile {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .sg-variant-mobile-pill {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            height: 44px;
            padding: 0 1.2rem;
            border-radius: 999px;
            border: 1px solid color-mix(in srgb, var(--color-border-subtle) 50%, transparent);
            background: color-mix(in srgb, var(--color-surface) 70%, transparent);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            color: var(--color-text-heading);
            font-family: var(--font-body), system-ui, sans-serif;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            transition: transform 0.2s;
            position: relative;
            z-index: 100;
          }

          .sg-variant-mobile-pill:active {
            transform: scale(0.96);
          }

          .sg-variant-mobile-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 2201; /* Above shell but below drawer */
            pointer-events: auto;
          }

          .sg-variant-mobile-drawer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--color-surface);
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            padding: 1rem 1.5rem 2.5rem;
            z-index: 2202;
            pointer-events: auto;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
            border-top: 1px solid color-mix(in srgb, var(--color-border-subtle) 40%, transparent);
          }

          .sg-variant-drawer-handle {
            width: 40px;
            height: 5px;
            background: color-mix(in srgb, var(--color-text-secondary) 30%, transparent);
            border-radius: 999px;
            margin: 0 auto 1.5rem;
          }

          .sg-variant-drawer-title {
            font-size: 1.1rem;
            font-weight: 800;
            color: var(--color-text-heading);
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .sg-variant-drawer-cards {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
          }

          .sg-variant-drawer-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border-radius: 16px;
            background: color-mix(in srgb, var(--color-surface-alt) 40%, transparent);
            border: 2px solid transparent;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
          }

          .sg-variant-drawer-card:active {
            transform: scale(0.98);
          }

          .sg-variant-drawer-card.is-active {
            background: color-mix(in srgb, var(--color-surface-alt) 80%, transparent);
            border-color: var(--color-text-primary);
          }

          .sg-variant-card-preview {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            border: 2px solid;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .sg-variant-card-accent {
            width: 20px;
            height: 20px;
            border-radius: 50%;
          }

          .sg-variant-card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
          }

          .sg-variant-card-label {
            font-family: var(--font-body), system-ui, sans-serif;
            font-size: 1rem;
            font-weight: 700;
            color: var(--color-text-heading);
          }

          .sg-variant-card-desc {
            font-family: var(--font-body), system-ui, sans-serif;
            font-size: 0.75rem;
            color: var(--color-text-secondary);
            font-weight: 500;
            line-height: 1.3;
          }

          .sg-variant-card-radio {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid color-mix(in srgb, var(--color-text-secondary) 40%, transparent);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.2s ease;
          }

          .sg-variant-card-radio.is-active {
            border-color: var(--color-text-primary);
          }

          .sg-variant-card-radio-inner {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--color-text-primary);
          }
        }
      `}</style>
    </>
  )
}
