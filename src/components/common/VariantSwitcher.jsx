import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Palette, ChevronDown } from 'lucide-react'
import { createRipple } from '../../utils/haptics'

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

      {/* Mobile: Dropdown switcher */}
      <div className="sg-variant-mobile">
        {/* Animated glowing CTA bubble for mobile */}
        {!open && (
          <div className="sg-variant-cta-bubble mobile-cta">
            <span style={{ marginRight: '4px' }}>✨</span> Tap to Experience Themes!
          </div>
        )}
        <button
          type="button"
          className={`sg-variant-mobile-trigger ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          onPointerDown={(e) => createRipple(e)}
          onClick={() => setOpen(v => !v)}
        >
          <div className="sg-variant-mobile-trigger-content">
            <Palette size={16} />
            <div className="sg-variant-mobile-trigger-text">
              <span className="sg-variant-mobile-label">{activeVariant.label}</span>
              <span className="sg-variant-mobile-subtitle">{variantSubtitles[activeVariant.id]}</span>
            </div>
          </div>
          <ChevronDown size={16} className={open ? 'is-open' : ''} />
        </button>
        {open && (
          <div className="sg-variant-mobile-menu">
            {variants.map(variant => (
              <button
                key={variant.id}
                type="button"
                className={`sg-variant-mobile-option ${activeVariant.id === variant.id ? 'is-active' : ''}`}
                onPointerDown={(e) => createRipple(e)}
                onClick={() => {
                  setVisualVariant(variant.id)
                  setOpen(false)
                }}
              >
                <div className="sg-variant-mobile-option-header">
                  <span className="sg-variant-mobile-option-label">{variant.label}</span>
                  <span className="sg-variant-mobile-option-short">{variant.shortLabel}</span>
                </div>
                <span className="sg-variant-mobile-option-desc">{variantSubtitles[variant.id]}</span>
              </button>
            ))}
          </div>
        )}
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
          bottom: calc(100% + 10px);
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

        /* Exotic animated gradient border */
        .sg-variant-desktop::before,
        .sg-variant-mobile-trigger::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #FF3366, #FF9933, #33CCFF, #FF3366);
          background-size: 300% 100%;
          z-index: -1;
          animation: sg-variant-border-glow 4s linear infinite;
        }
        
        .sg-variant-mobile-trigger::before {
          border-radius: 16px;
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
            width: min(90vw, 420px);
            transform: translateX(-50%);
          }

          .sg-variant-desktop {
            display: none;
          }

          .sg-variant-mobile {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 0.6rem;
          }

          .sg-variant-mobile-trigger {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.8rem;
            min-height: 56px;
            border: none;
            border-radius: 14px;
            background: var(--color-surface);
            color: var(--color-text-heading);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
            padding: 0.8rem 1.2rem;
            font-family: var(--font-body), system-ui, sans-serif;
            font-size: 0.9rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 200ms ease;
          }

          .sg-variant-mobile-trigger-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            flex: 1;
            z-index: 2;
          }

          .sg-variant-mobile-trigger-content svg {
            color: var(--color-text-primary);
            opacity: 0.8;
            transition: opacity 200ms ease;
          }

          .sg-variant-mobile-trigger-text {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }

          .sg-variant-mobile-label {
            display: block;
            font-size: 0.9rem;
            font-weight: 800;
            color: var(--color-text-heading);
          }

          .sg-variant-mobile-subtitle {
            display: block;
            font-size: 0.7rem;
            font-weight: 600;
            color: var(--color-text-secondary);
          }

          .sg-variant-mobile-trigger svg:last-child {
            transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
            width: 18px;
            height: 18px;
            z-index: 2;
          }

          .sg-variant-mobile-trigger.is-open svg:last-child {
            transform: rotate(180deg);
          }

          .sg-variant-mobile-menu {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.6rem;
            border: 2px solid color-mix(in srgb, var(--color-text-primary) 10%, transparent);
            border-radius: 14px;
            background: var(--color-surface);
            box-shadow: 0 12px 40px rgba(0,0,0,0.2);
            padding: 0.6rem;
            animation: sg-variant-menu-in 200ms cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes sg-variant-menu-in {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .sg-variant-mobile-option {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.35rem;
            min-height: 64px;
            border: 1px solid color-mix(in srgb, var(--color-border-subtle) 50%, transparent);
            border-radius: 10px;
            background: color-mix(in srgb, var(--color-surface-alt) 40%, transparent);
            color: var(--color-text-secondary);
            padding: 0.8rem;
            font-family: var(--font-body), system-ui, sans-serif;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 180ms ease;
            border-left: 3px solid transparent;
          }

          .sg-variant-mobile-option:hover {
            background: color-mix(in srgb, var(--color-surface-alt) 60%, transparent);
            border-left-color: var(--color-text-primary);
          }

          .sg-variant-mobile-option-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            gap: 0.5rem;
          }

          .sg-variant-mobile-option-label {
            font-weight: 800;
            color: var(--color-text-heading);
          }

          .sg-variant-mobile-option-short {
            font-family: var(--font-mono), monospace;
            font-size: 0.65rem;
            font-weight: 700;
            color: var(--color-text-primary);
            opacity: 0.8;
          }

          .sg-variant-mobile-option-desc {
            font-size: 0.65rem;
            color: var(--color-text-secondary);
            font-weight: 600;
            opacity: 0.85;
          }

          .sg-variant-mobile-option.is-active {
            border-color: var(--color-text-heading);
            border-left-color: var(--color-text-heading);
            background: var(--color-text-heading);
            color: var(--color-background);
          }

          .sg-variant-mobile-option.is-active .sg-variant-mobile-option-label {
            color: var(--color-background);
          }

          .sg-variant-mobile-option.is-active .sg-variant-mobile-option-desc,
          .sg-variant-mobile-option.is-active .sg-variant-mobile-option-short {
            color: color-mix(in srgb, var(--color-background) 80%, transparent);
          }
        }
      `}</style>
    </div>
  )
}
