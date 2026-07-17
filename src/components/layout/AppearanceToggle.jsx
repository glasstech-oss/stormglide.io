import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

/** Clean glass sun/moon switch — dark/light appearance for the one 'glass' variant. */
export default function AppearanceToggle() {
  const { appearance, toggleAppearance } = useTheme()
  const isLight = appearance === 'light'

  return (
    <button
      type="button"
      className="sg-appearance-toggle"
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      aria-pressed={isLight}
      onClick={toggleAppearance}
    >
      <span className="sg-appearance-toggle-track" aria-hidden="true">
        <span className="sg-appearance-toggle-thumb">
          {isLight ? <Sun size={13} /> : <Moon size={13} />}
        </span>
      </span>

      <style>{`
        .sg-appearance-toggle {
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
          width: 46px;
          height: 28px;
          border: 1px solid var(--glass-border);
          border-radius: 999px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur-soft);
          -webkit-backdrop-filter: var(--glass-blur-soft);
          box-shadow: inset 0 1px 0 var(--glass-highlight);
          padding: 3px;
          cursor: pointer;
          transition: background 200ms ease, border-color 200ms ease;
        }

        .sg-appearance-toggle:focus-visible {
          outline: 2px solid var(--sg-accent);
          outline-offset: 3px;
        }

        .sg-appearance-toggle-track {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
        }

        .sg-appearance-toggle-thumb {
          position: absolute;
          top: 50%;
          left: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(160deg, var(--sg-accent), var(--sg-accent-2));
          color: var(--color-background);
          box-shadow: 0 2px 8px color-mix(in srgb, var(--sg-accent) 40%, transparent);
          transform: translate(0, -50%);
          transition: transform 320ms cubic-bezier(.16,1,.3,1), background 320ms ease;
        }

        html[data-sg-appearance='light'] .sg-appearance-toggle-thumb {
          transform: translate(18px, -50%);
        }

        @media (prefers-reduced-motion: reduce) {
          .sg-appearance-toggle-thumb { transition: none; }
        }
      `}</style>
    </button>
  )
}
