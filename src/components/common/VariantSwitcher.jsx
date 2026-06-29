import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Palette } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const VARIANT_NOTES = {
  aurora: 'Cinematic light and depth',
  editorial: 'Warm, restrained and tactile',
  signal: 'Precise, technical and direct',
}

export default function VariantSwitcher() {
  const { activeVariant, visualVariants, setVisualVariant } = useTheme()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const location = useLocation()
  const variants = Object.values(visualVariants)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = event => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const handleKeyDown = event => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/client')) {
    return null
  }

  return (
    <div className="sg-experience-control" ref={rootRef}>
      <button
        type="button"
        className="sg-experience-trigger"
        aria-label={`Visual experience: ${activeVariant.label}`}
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        <Palette size={15} />
        <span className="sg-experience-trigger-label">{activeVariant.label}</span>
        <ChevronDown size={13} className={open ? 'is-open' : ''} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="sg-experience-menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            <div className="sg-experience-menu-heading">
              <span>Visual experience</span>
              <small>Same systems, different perspective.</small>
            </div>
            {variants.map(variant => {
              const active = activeVariant.id === variant.id
              return (
                <button
                  key={variant.id}
                  type="button"
                  className={`sg-experience-option ${active ? 'is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => {
                    setVisualVariant(variant.id)
                    setOpen(false)
                  }}
                >
                  <span className={`sg-experience-swatch is-${variant.id}`} />
                  <span>
                    <strong>{variant.label}</strong>
                    <small>{VARIANT_NOTES[variant.id]}</small>
                  </span>
                  {active && <Check size={15} />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .sg-experience-control {
          position: relative;
          flex: 0 0 auto;
        }

        .sg-experience-trigger {
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 0.42rem;
          border: 1px solid var(--color-border-subtle);
          border-radius: 999px;
          background: color-mix(in srgb, var(--color-surface) 82%, transparent);
          color: var(--color-text-primary);
          padding: 0.48rem 0.7rem;
          font-size: 0.76rem;
          font-weight: 750;
          cursor: pointer;
          backdrop-filter: blur(14px);
          transition: border-color 160ms ease, color 160ms ease, background 160ms ease;
        }

        .sg-experience-trigger:hover,
        .sg-experience-trigger:focus-visible {
          border-color: color-mix(in srgb, var(--sg-accent) 48%, transparent);
          color: var(--color-text-heading);
        }

        .sg-experience-trigger:focus-visible,
        .sg-experience-option:focus-visible {
          outline: 2px solid var(--sg-accent);
          outline-offset: 2px;
        }

        .sg-experience-trigger svg:last-child {
          transition: transform 160ms ease;
        }

        .sg-experience-trigger svg:last-child.is-open {
          transform: rotate(180deg);
        }

        .sg-experience-menu {
          position: absolute;
          top: calc(100% + 0.7rem);
          right: 0;
          width: min(292px, calc(100vw - 2rem));
          overflow: hidden;
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-lg);
          background: color-mix(in srgb, var(--color-surface) 96%, transparent);
          box-shadow: var(--shadow-lg);
          padding: 0.55rem;
          backdrop-filter: blur(22px);
        }

        .sg-experience-menu-heading {
          display: grid;
          gap: 0.2rem;
          padding: 0.65rem 0.7rem 0.75rem;
          border-bottom: 1px solid var(--color-border-subtle);
          margin-bottom: 0.35rem;
        }

        .sg-experience-menu-heading span {
          color: var(--color-text-heading);
          font-size: 0.78rem;
          font-weight: 800;
        }

        .sg-experience-menu-heading small,
        .sg-experience-option small {
          color: var(--color-text-secondary);
          font-size: 0.68rem;
          line-height: 1.35;
        }

        .sg-experience-option {
          width: 100%;
          display: grid;
          grid-template-columns: 28px 1fr 18px;
          align-items: center;
          gap: 0.7rem;
          border: 0;
          border-radius: var(--radius);
          background: transparent;
          color: var(--color-text-primary);
          padding: 0.72rem;
          text-align: left;
          cursor: pointer;
        }

        .sg-experience-option:hover,
        .sg-experience-option.is-active {
          background: color-mix(in srgb, var(--sg-accent) 10%, transparent);
        }

        .sg-experience-option > span:nth-child(2) {
          min-width: 0;
          display: grid;
          gap: 0.1rem;
        }

        .sg-experience-option strong {
          color: var(--color-text-heading);
          font-size: 0.78rem;
        }

        .sg-experience-option > svg {
          color: var(--sg-accent);
        }

        .sg-experience-swatch {
          width: 28px;
          height: 28px;
          border: 1px solid rgba(127, 127, 127, 0.2);
          border-radius: 8px;
          box-shadow: inset 0 0 0 5px rgba(255, 255, 255, 0.12);
        }

        .sg-experience-swatch.is-aurora { background: #07131d; border-color: #5ad1ff; }
        .sg-experience-swatch.is-editorial { background: #f4f1ea; border-color: #c8642f; }
        .sg-experience-swatch.is-signal { background: #eceae4; border-color: #1aa15a; }

        @media (max-width: 920px) {
          .sg-experience-control { margin-left: auto; }
          .sg-experience-menu { right: -3.2rem; }
          .sg-experience-trigger-label { display: none; }
          .sg-experience-trigger { width: 42px; justify-content: center; padding: 0; }
          .sg-experience-trigger svg:last-child { display: none; }
        }
      `}</style>
    </div>
  )
}
