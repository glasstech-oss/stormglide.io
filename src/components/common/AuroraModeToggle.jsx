import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const PRESS_AT = 1460
const FINISH_AT = 2350

function ServiceUnit({ target }) {
  const light = target === 'light'
  const step = { duration: 1.42, times: [0, 0.25, 0.5, 0.75, 1], ease: 'linear' }

  return (
    <motion.svg
      className="sg-service-unit"
      viewBox="0 0 300 132"
      role="img"
      aria-label={`Service unit switching Aurora to ${target} mode`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <defs>
        <linearGradient id="sg-unit-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset="0.55" stopColor="#b9c2ce" />
          <stop offset="1" stopColor="#697586" />
        </linearGradient>
        <linearGradient id="sg-unit-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#667085" />
          <stop offset="1" stopColor="#202938" />
        </linearGradient>
        <filter id="sg-unit-shadow" x="-80%" y="-80%" width="260%" height="260%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#020617" floodOpacity=".42" />
        </filter>
        <filter id="sg-switch-bloom" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <line x1="6" y1="119" x2="286" y2="119" stroke="currentColor" strokeOpacity=".14" />
      <motion.ellipse
        cx="50" cy="119" rx="27" ry="5"
        fill="#020617"
        animate={{ cx: [50, 84, 118, 152, 184], rx: [27, 23, 27, 23, 27], opacity: [.32, .22, .32, .22, .32] }}
        transition={step}
      />

      <g transform="translate(258 28)">
        <rect x="-17" y="0" width="34" height="62" rx="8" fill="var(--color-surface)" stroke="var(--color-border-subtle)" />
        <rect x="-9" y="10" width="18" height="32" rx="9" fill="var(--color-background)" stroke="var(--color-border-subtle)" />
        <motion.g
          initial={{ rotate: light ? 18 : -18 }}
          animate={{ rotate: light ? -18 : 18 }}
          transition={{ delay: 1.46, duration: .22, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ transformOrigin: '0px 26px' }}
        >
          <rect x="-5" y="16" width="10" height="20" rx="5" fill={light ? '#1f2937' : '#dbe5ef'} />
        </motion.g>
        <circle cx="0" cy="51" r="2" fill="var(--sg-accent)" />
        <motion.circle
          cx="0" cy="26" r="12" fill="var(--sg-accent)" filter="url(#sg-switch-bloom)"
          initial={{ opacity: 0, scale: .2 }}
          animate={{ opacity: [0, 0, .38, 0], scale: [.2, .2, 2.4, 3.2] }}
          transition={{ duration: 1.9, times: [0, .72, .8, 1] }}
        />
      </g>

      <motion.g
        filter="url(#sg-unit-shadow)"
        initial={{ x: 18, y: 0 }}
        animate={{ x: [18, 52, 86, 120, 152], y: [0, -2, 0, -2, 0] }}
        transition={step}
      >
        <motion.g
          animate={{ rotate: [-16, 19, -16, 19, -6] }}
          transition={step}
          style={{ transformOrigin: '49px 79px' }}
        >
          <rect x="44" y="77" width="10" height="24" rx="5" fill="url(#sg-unit-dark)" />
          <circle cx="49" cy="101" r="5" fill="#293344" />
          <rect x="45" y="101" width="9" height="15" rx="4" fill="url(#sg-unit-shell)" />
          <rect x="42" y="113" width="20" height="6" rx="3" fill="#374151" />
        </motion.g>
        <motion.g
          animate={{ rotate: [19, -16, 19, -16, 6] }}
          transition={step}
          style={{ transformOrigin: '49px 79px' }}
        >
          <rect x="44" y="77" width="10" height="24" rx="5" fill="url(#sg-unit-shell)" />
          <circle cx="49" cy="101" r="5" fill="#667085" />
          <rect x="45" y="101" width="9" height="15" rx="4" fill="url(#sg-unit-shell)" />
          <rect x="42" y="113" width="20" height="6" rx="3" fill="#202938" />
        </motion.g>

        <rect x="34" y="40" width="30" height="42" rx="9" fill="url(#sg-unit-shell)" stroke="#f8fafc" strokeOpacity=".3" />
        <rect x="39" y="48" width="20" height="18" rx="5" fill="#172033" />
        <motion.rect x="43" y="53" width="12" height="3" rx="1.5" fill="var(--sg-accent)" animate={{ opacity: [.75, 1, .75] }} transition={{ duration: 1.1, repeat: Infinity }} />
        <path d="M42 72h14" stroke="#667085" strokeWidth="2" strokeLinecap="round" />

        <rect x="36" y="15" width="28" height="24" rx="8" fill="url(#sg-unit-shell)" stroke="#f8fafc" strokeOpacity=".35" />
        <rect x="41" y="20" width="19" height="9" rx="4.5" fill="#111827" />
        <motion.circle cx="54" cy="24.5" r="2" fill="var(--sg-accent)" animate={{ opacity: [.7, 1, .7] }} transition={{ duration: 1.2, repeat: Infinity }} />
        <rect x="42" y="34" width="16" height="7" rx="3" fill="#667085" />

        <motion.g
          animate={{ rotate: [18, -18, 18, -18, -68] }}
          transition={{ ...step, times: [0, .24, .48, .7, 1] }}
          style={{ transformOrigin: '61px 48px' }}
        >
          <circle cx="62" cy="49" r="6" fill="#788497" />
          <rect x="59" y="49" width="7" height="23" rx="3.5" fill="url(#sg-unit-shell)" />
          <circle cx="62.5" cy="73" r="4.5" fill="#4b5565" />
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 0, 0, 0, 62] }}
            transition={{ ...step, times: [0, .55, .72, .86, 1] }}
            style={{ transformOrigin: '62px 73px' }}
          >
            <rect x="59.5" y="73" width="6" height="20" rx="3" fill="url(#sg-unit-shell)" />
            <circle cx="62.5" cy="94" r="4" fill="#9aa4b2" />
          </motion.g>
        </motion.g>
        <motion.g
          animate={{ rotate: [-18, 18, -18, 18, 10] }}
          transition={step}
          style={{ transformOrigin: '36px 48px' }}
          opacity=".72"
        >
          <circle cx="36" cy="49" r="5" fill="#586476" />
          <rect x="33" y="49" width="6" height="27" rx="3" fill="url(#sg-unit-dark)" />
        </motion.g>
      </motion.g>
    </motion.svg>
  )
}

export default function AuroraModeToggle() {
  const { activeVariant, auroraAppearance, setAuroraAppearance } = useTheme()
  const [target, setTarget] = useState(null)
  const timers = useRef([])
  const reduceMotion = useReducedMotion()
  const isLight = auroraAppearance === 'light'

  useEffect(() => () => {
    timers.current.forEach(clearTimeout)
    document.documentElement.classList.remove('sg-appearance-transition')
  }, [])

  if (activeVariant.id !== 'aurora') return null

  const changeMode = () => {
    if (target) return
    const next = isLight ? 'dark' : 'light'
    if (reduceMotion || window.matchMedia('(max-width: 920px)').matches) {
      setAuroraAppearance(next)
      return
    }

    document.documentElement.classList.add('sg-appearance-transition')
    setTarget(next)
    timers.current = [
      setTimeout(() => setAuroraAppearance(next), PRESS_AT),
      setTimeout(() => {
        setTarget(null)
        document.documentElement.classList.remove('sg-appearance-transition')
        timers.current = []
      }, FINISH_AT),
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
        <span className="sg-aurora-mode-icon" aria-hidden="true">{isLight ? <Sun size={15} /> : <Moon size={15} />}</span>
        <span className="sg-aurora-mode-label">{isLight ? 'Light' : 'Dark'}</span>
        <span className="sg-aurora-mode-switch" aria-hidden="true"><i /></span>
      </button>

      <AnimatePresence>
        {target && (
          <motion.div className="sg-service-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ServiceUnit target={target} />
          </motion.div>
        )}
      </AnimatePresence>

      <span className="sg-visually-hidden" role="status" aria-live="polite">
        {target ? `Switching Aurora to ${target} mode` : `Aurora ${auroraAppearance} mode`}
      </span>

      <style>{`
        .sg-aurora-mode-control { position: relative; flex: 0 0 auto; }
        .sg-aurora-mode-toggle { min-height: 38px; display: inline-flex; align-items: center; gap: .48rem; border: 1px solid var(--color-border-subtle); border-radius: 999px; background: color-mix(in srgb, var(--color-surface) 84%, transparent); color: var(--color-text-primary); padding: .38rem .48rem .38rem .62rem; font-size: .75rem; font-weight: 750; cursor: pointer; backdrop-filter: blur(14px); transition: border-color 160ms ease, color 160ms ease, background 320ms ease; }
        .sg-aurora-mode-toggle:hover, .sg-aurora-mode-toggle:focus-visible { border-color: color-mix(in srgb, var(--sg-accent) 48%, transparent); color: var(--color-text-heading); }
        .sg-aurora-mode-toggle:focus-visible { outline: 2px solid var(--sg-accent); outline-offset: 2px; }
        .sg-aurora-mode-toggle:disabled { cursor: wait; }
        .sg-aurora-mode-icon { display: inline-flex; color: var(--sg-accent); }
        .sg-aurora-mode-switch { width: 30px; height: 18px; display: inline-flex; align-items: center; border: 1px solid color-mix(in srgb, var(--sg-accent) 32%, var(--color-border-subtle)); border-radius: 999px; background: color-mix(in srgb, var(--color-text-heading) 11%, transparent); padding: 2px; }
        .sg-aurora-mode-switch i { width: 12px; height: 12px; border-radius: 50%; background: var(--color-text-secondary); transform: translateX(0); transition: transform 360ms cubic-bezier(.16,1,.3,1), background 260ms ease, box-shadow 260ms ease; }
        html[data-sg-appearance='light'] .sg-aurora-mode-switch { background: color-mix(in srgb, var(--sg-accent) 18%, transparent); }
        html[data-sg-appearance='light'] .sg-aurora-mode-switch i { background: var(--sg-accent); box-shadow: 0 0 10px color-mix(in srgb, var(--sg-accent) 55%, transparent); transform: translateX(12px); }
        .sg-service-layer { position: fixed; z-index: 1800; top: 54px; right: 12px; width: 320px; height: 142px; pointer-events: none; color: var(--color-text-heading); }
        .sg-service-unit { display: block; width: 100%; height: 100%; overflow: visible; }
        .sg-visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        html.sg-appearance-transition body, html.sg-appearance-transition .navbar { transition: background-color 520ms ease, color 520ms ease, border-color 520ms ease; }
        @media (max-width: 920px) { .sg-aurora-mode-toggle { width: 42px; justify-content: center; padding: 0; } .sg-aurora-mode-label, .sg-aurora-mode-switch, .sg-service-layer { display: none; } }
        @media (prefers-reduced-motion: reduce) { .sg-service-layer { display: none; } }
      `}</style>
    </div>
  )
}
