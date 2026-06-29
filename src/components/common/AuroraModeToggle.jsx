import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const SWITCH_DELAY = 720
const ANIMATION_DURATION = 1320

function SwitchRobot({ target }) {
  return (
    <div className="sg-mode-robot-scene" data-target={target} aria-hidden="true">
      <span className="sg-mode-robot-track" />
      <span className="sg-mode-wall-switch"><i /></span>
      <span className="sg-mode-robot">
        <span className="sg-mode-robot-antenna"><i /></span>
        <span className="sg-mode-robot-head"><i /><i /></span>
        <span className="sg-mode-robot-body"><i /></span>
        <span className="sg-mode-robot-arm" />
        <span className="sg-mode-robot-leg is-left" />
        <span className="sg-mode-robot-leg is-right" />
      </span>
      <span className="sg-mode-switch-flash" />
    </div>
  )
}

export default function AuroraModeToggle() {
  const { activeVariant, auroraAppearance, setAuroraAppearance } = useTheme()
  const [target, setTarget] = useState(null)
  const timersRef = useRef([])
  const reduceMotion = useReducedMotion()
  const isLight = auroraAppearance === 'light'

  useEffect(() => () => {
    timersRef.current.forEach(window.clearTimeout)
    document.documentElement.classList.remove('sg-appearance-transition')
  }, [])

  if (activeVariant.id !== 'aurora') return null

  const changeMode = () => {
    if (target) return
    const next = isLight ? 'dark' : 'light'

    if (reduceMotion) {
      setAuroraAppearance(next)
      return
    }

    document.documentElement.classList.add('sg-appearance-transition')
    setTarget(next)
    timersRef.current = [
      window.setTimeout(() => setAuroraAppearance(next), SWITCH_DELAY),
      window.setTimeout(() => {
        setTarget(null)
        document.documentElement.classList.remove('sg-appearance-transition')
        timersRef.current = []
      }, ANIMATION_DURATION),
    ]
  }

  return (
    <div className="sg-aurora-mode-control">
      <button
        type="button"
        className="sg-aurora-mode-toggle"
        aria-label={`Switch Aurora to ${isLight ? 'dark' : 'light'} mode`}
        aria-pressed={isLight}
        disabled={Boolean(target)}
        onClick={changeMode}
      >
        <span className="sg-aurora-mode-icon" aria-hidden="true">
          {isLight ? <Sun size={15} /> : <Moon size={15} />}
        </span>
        <span className="sg-aurora-mode-label">{isLight ? 'Light' : 'Dark'}</span>
        <span className="sg-aurora-mode-switch" aria-hidden="true"><i /></span>
      </button>

      <AnimatePresence>
        {target && (
          <motion.div
            className="sg-mode-robot-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
          >
            <SwitchRobot target={target} />
            <span className="sg-mode-page-wash" data-target={target} />
          </motion.div>
        )}
      </AnimatePresence>

      <span className="sg-visually-hidden" role="status" aria-live="polite">
        {target ? `Switching Aurora to ${target} mode` : `Aurora ${auroraAppearance} mode`}
      </span>

      <style>{`
        .sg-aurora-mode-control { position: relative; flex: 0 0 auto; }

        .sg-aurora-mode-toggle {
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 0.48rem;
          border: 1px solid var(--color-border-subtle);
          border-radius: 999px;
          background: color-mix(in srgb, var(--color-surface) 82%, transparent);
          color: var(--color-text-primary);
          padding: 0.38rem 0.48rem 0.38rem 0.62rem;
          font-size: 0.75rem;
          font-weight: 750;
          cursor: pointer;
          backdrop-filter: blur(14px);
          transition: border-color 160ms ease, color 160ms ease, background 420ms ease;
        }

        .sg-aurora-mode-toggle:hover,
        .sg-aurora-mode-toggle:focus-visible {
          border-color: color-mix(in srgb, var(--sg-accent) 48%, transparent);
          color: var(--color-text-heading);
        }

        .sg-aurora-mode-toggle:focus-visible { outline: 2px solid var(--sg-accent); outline-offset: 2px; }
        .sg-aurora-mode-toggle:disabled { cursor: wait; }
        .sg-aurora-mode-icon { display: inline-flex; color: var(--sg-accent); }

        .sg-aurora-mode-switch {
          width: 30px;
          height: 18px;
          display: inline-flex;
          align-items: center;
          border: 1px solid color-mix(in srgb, var(--sg-accent) 32%, var(--color-border-subtle));
          border-radius: 999px;
          background: color-mix(in srgb, var(--color-text-heading) 11%, transparent);
          padding: 2px;
        }

        .sg-aurora-mode-switch i {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--color-text-secondary);
          transform: translateX(0);
          transition: transform 360ms cubic-bezier(.16,1,.3,1), background 260ms ease, box-shadow 260ms ease;
        }

        html[data-sg-appearance='light'] .sg-aurora-mode-switch { background: color-mix(in srgb, var(--sg-accent) 18%, transparent); }
        html[data-sg-appearance='light'] .sg-aurora-mode-switch i {
          background: var(--sg-accent);
          box-shadow: 0 0 10px color-mix(in srgb, var(--sg-accent) 55%, transparent);
          transform: translateX(12px);
        }

        .sg-mode-robot-layer { position: absolute; inset: 0; pointer-events: none; z-index: 1800; }
        .sg-mode-page-wash {
          position: fixed;
          inset: 0;
          z-index: -1;
          background: #f5f9fc;
          opacity: 0;
          animation: sgModePageWash 580ms 620ms ease-out both;
        }
        .sg-mode-page-wash[data-target='dark'] { background: #050608; }

        .sg-mode-robot-scene {
          position: absolute;
          top: calc(100% + 10px);
          right: -2px;
          width: 188px;
          height: 76px;
          color: var(--color-text-heading);
          filter: drop-shadow(0 14px 24px rgba(0,0,0,0.22));
        }

        .sg-mode-robot-track {
          position: absolute;
          left: 8px;
          right: 0;
          bottom: 8px;
          height: 1px;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--sg-accent) 44%, transparent));
        }

        .sg-mode-wall-switch {
          position: absolute;
          right: 0;
          top: 20px;
          width: 24px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid color-mix(in srgb, var(--sg-accent) 34%, var(--color-border-subtle));
          border-radius: 7px;
          background: var(--color-surface);
          box-shadow: var(--shadow-sm);
        }

        .sg-mode-wall-switch i {
          width: 7px;
          height: 15px;
          border-radius: 3px;
          background: var(--sg-accent);
          transform-origin: center;
          animation: sgRobotFlipSwitch 260ms 690ms ease both;
        }

        .sg-mode-robot {
          position: absolute;
          left: 0;
          bottom: 8px;
          width: 38px;
          height: 58px;
          transform-origin: center bottom;
          animation: sgRobotWalkIn 1.22s cubic-bezier(.22,.75,.2,1) both;
        }

        .sg-mode-robot-head {
          position: absolute;
          left: 4px;
          top: 7px;
          width: 30px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 2px solid currentColor;
          border-radius: 8px;
          background: var(--color-surface);
        }

        .sg-mode-robot-head i { width: 4px; height: 4px; border-radius: 50%; background: var(--sg-accent); box-shadow: 0 0 6px var(--sg-accent); }
        .sg-mode-robot-body { position: absolute; left: 8px; top: 31px; width: 23px; height: 19px; border: 2px solid currentColor; border-radius: 5px; background: var(--color-surface); }
        .sg-mode-robot-body i { position: absolute; left: 5px; right: 5px; top: 5px; height: 2px; background: var(--sg-accent); }
        .sg-mode-robot-antenna { position: absolute; left: 18px; top: 1px; width: 2px; height: 7px; background: currentColor; }
        .sg-mode-robot-antenna i { position: absolute; left: -2px; top: -2px; width: 6px; height: 6px; border-radius: 50%; background: var(--sg-accent); }
        .sg-mode-robot-arm { position: absolute; left: 29px; top: 34px; width: 19px; height: 3px; border-radius: 3px; background: currentColor; transform-origin: left center; animation: sgRobotReach 420ms 520ms ease both; }
        .sg-mode-robot-leg { position: absolute; bottom: 0; width: 3px; height: 10px; border-radius: 2px; background: currentColor; transform-origin: top center; animation: sgRobotStep 160ms linear 4 alternate; }
        .sg-mode-robot-leg.is-left { left: 12px; }
        .sg-mode-robot-leg.is-right { right: 12px; animation-direction: alternate-reverse; }
        .sg-mode-switch-flash { position: absolute; right: -7px; top: 17px; width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--sg-accent); opacity: 0; animation: sgRobotSwitchFlash 430ms 705ms ease-out both; }

        @keyframes sgRobotWalkIn {
          0% { opacity: 0; transform: translate3d(-18px, 3px, 0) scale(.9); }
          12% { opacity: 1; }
          64% { opacity: 1; transform: translate3d(122px, 0, 0) scale(1); }
          78% { opacity: 1; transform: translate3d(126px, 0, 0) scale(1); }
          100% { opacity: 0; transform: translate3d(126px, 4px, 0) scale(.96); }
        }
        @keyframes sgRobotStep { from { transform: rotate(24deg); } to { transform: rotate(-24deg); } }
        @keyframes sgRobotReach { 0%, 25% { transform: rotate(35deg) scaleX(.55); } 75%, 100% { transform: rotate(-10deg) scaleX(1); } }
        @keyframes sgRobotFlipSwitch { from { transform: rotateX(0); } to { transform: rotateX(180deg); } }
        @keyframes sgRobotSwitchFlash { 0% { opacity: 0; transform: scale(.25); } 30% { opacity: .95; } 100% { opacity: 0; transform: scale(1.35); } }
        @keyframes sgModePageWash { 0%, 100% { opacity: 0; } 45% { opacity: .18; } }

        @media (max-width: 920px) {
          .sg-aurora-mode-toggle { width: 42px; justify-content: center; padding: 0; }
          .sg-aurora-mode-label,
          .sg-aurora-mode-switch { display: none; }
          .sg-mode-robot-scene { right: -44px; width: 150px; transform: scale(.88); transform-origin: top right; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sg-mode-robot-layer { display: none; }
        }
      `}</style>
    </div>
  )
}
