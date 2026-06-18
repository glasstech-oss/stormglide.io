import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, MoveUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

function HeroTitle({ lines }) {
  return (
    <h1 className="sg-hero-title">
      {lines.map((line, index) => (
        <span key={`${line.text}-${index}`} className="sg-title-line">
          <motion.span
            initial={{ y: '115%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.78, delay: 0.08 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={line.accent ? 'is-accent' : undefined}
            style={{ fontStyle: line.italic ? 'italic' : undefined }}
          >
            {line.text}
          </motion.span>
          {line.joinNext && (
            <>
              {' '}
              <motion.span
                initial={{ y: '115%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.78, delay: 0.18 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {line.joinNext.trim()}
              </motion.span>
            </>
          )}
        </span>
      ))}
    </h1>
  )
}

function DeviceScene({ variant }) {
  const { visualLabels, browserLabel } = variant.hero

  return (
    <div className="sg-device-stage" aria-hidden>
      <div className="sg-device-card sg-device-browser">
        <div className="sg-browser-top">
          <span />
          <span />
          <span />
          <div>{browserLabel}</div>
        </div>
        <div className="sg-browser-canvas">
          <div className="sg-canvas-panel">
            <span>{visualLabels[0]}</span>
          </div>
          <div className="sg-canvas-lines">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>

      <div className="sg-device-card sg-device-analytics">
        <div className="sg-device-label">
          <span>{visualLabels[1]}</span>
          <b />
        </div>
        <div className="sg-bars">
          {[42, 72, 56, 94, 66].map((height, index) => (
            <i key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>

      <div className="sg-device-card sg-device-phone">
        <div className="sg-phone-screen">
          <b />
          <span>{visualLabels[2]}</span>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  const { activeVariant } = useTheme()
  const sceneRef = useRef(null)
  const variant = activeVariant

  function handlePointerMove(event) {
    const scene = sceneRef.current
    if (!scene || window.matchMedia('(pointer: coarse)').matches) return
    const rect = scene.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18
    scene.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
  }

  function handlePointerLeave() {
    if (sceneRef.current) sceneRef.current.style.transform = 'translate3d(0, 0, 0)'
  }

  return (
    <section
      className="sg-hero"
      data-variant={variant.id}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="sg-hero-bg" aria-hidden>
        <div className="sg-hero-glow glow-one" />
        <div className="sg-hero-glow glow-two" />
        <div className="sg-hero-grid-bg" />
      </div>

      <div className="sg-hero-inner">
        <div className="sg-hero-copy">
          <motion.div
            className="sg-hero-kicker"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            {variant.hero.eyebrow}
          </motion.div>

          <HeroTitle lines={variant.hero.titleLines} />

          <motion.p
            className="sg-hero-body"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.48 }}
          >
            {variant.hero.body}
          </motion.p>

          <motion.div
            className="sg-hero-actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.58 }}
          >
            <Link to="/contact" className="sg-hero-primary">
              {variant.hero.primaryCta} <ArrowRight size={16} />
            </Link>
            <Link to="/work" className="sg-hero-secondary">
              {variant.hero.secondaryCta} <MoveUpRight size={15} />
            </Link>
          </motion.div>

          <motion.div
            className="sg-hero-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.72 }}
          >
            <BarChart3 size={15} />
            <span>SaaS products · custom systems · high-performance websites</span>
          </motion.div>
        </div>

        <motion.div
          className="sg-hero-visual"
          ref={sceneRef}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.72, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
        >
          <DeviceScene variant={variant} />
        </motion.div>
      </div>

      <style>{`
        .sg-hero {
          position: relative;
          width: 100%;
          max-width: 100vw;
          min-height: 100svh;
          display: flex;
          align-items: center;
          overflow: hidden;
          contain: paint;
          background:
            radial-gradient(120% 120% at 72% 8%, color-mix(in srgb, var(--sg-accent) 16%, var(--color-background)) 0%, var(--color-background) 58%),
            var(--color-background);
          color: var(--color-text-heading);
          padding: 9.5rem 2rem 5.2rem;
        }

        .sg-hero[data-variant='editorial'] {
          background:
            radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--sg-accent) 14%, transparent), transparent 34rem),
            linear-gradient(135deg, var(--color-background), var(--color-surface));
        }

        .sg-hero[data-variant='signal'] {
          background: var(--color-background);
        }

        .sg-hero-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          max-width: 100%;
          pointer-events: none;
        }

        .sg-hero-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(52px);
          opacity: 0.82;
          transform: translateZ(0);
        }

        .glow-one {
          width: 620px;
          height: 620px;
          top: -160px;
          right: 16%;
          background: radial-gradient(circle, var(--sg-spotlight-color), transparent 64%);
          animation: sgHeroGlow 13s ease-in-out infinite;
        }

        .glow-two {
          width: 520px;
          height: 520px;
          top: 14%;
          right: -8%;
          background: radial-gradient(circle, color-mix(in srgb, var(--sg-accent-2) 28%, transparent), transparent 66%);
          animation: sgHeroGlow 16s ease-in-out infinite reverse;
        }

        .sg-hero-grid-bg {
          display: none;
          position: absolute;
          inset: -60px;
          background-image:
            linear-gradient(color-mix(in srgb, var(--color-text-heading) 7%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--color-text-heading) 7%, transparent) 1px, transparent 1px);
          background-size: 46px 46px;
        }

        .sg-hero[data-variant='signal'] .sg-hero-grid-bg {
          display: block;
        }

        .sg-hero-inner {
          position: relative;
          z-index: 1;
          width: min(1280px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(430px, 0.9fr);
          gap: clamp(3rem, 6vw, 6rem);
          align-items: center;
        }

        .sg-hero-copy {
          max-width: 720px;
        }

        .sg-hero-kicker {
          width: fit-content;
          color: var(--sg-accent);
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: clamp(0.68rem, 1vw, 0.76rem);
          font-weight: 700;
          letter-spacing: 0.22em;
          line-height: 1.5;
          margin-bottom: 1.45rem;
          text-transform: uppercase;
        }

        .sg-hero-title {
          max-width: 850px;
          color: var(--color-text-heading);
          font-size: clamp(3rem, 7vw, 6.2rem);
          font-weight: 700;
          line-height: 0.96;
          letter-spacing: -0.055em;
        }

        .sg-hero[data-variant='editorial'] .sg-hero-title {
          font-weight: 400;
          letter-spacing: -0.025em;
          max-width: 920px;
        }

        .sg-title-line {
          display: block;
          overflow: hidden;
          padding-bottom: 0.04em;
        }

        .sg-title-line > span {
          display: inline-block;
        }

        .sg-title-line .is-accent {
          color: var(--sg-accent);
        }

        .sg-hero[data-variant='signal'] .sg-title-line .is-accent {
          background: color-mix(in srgb, var(--sg-accent) 12%, transparent);
          padding: 0 0.1em;
        }

        .sg-hero-body {
          max-width: 560px;
          color: var(--color-text-secondary);
          font-size: clamp(1rem, 1.25vw, 1.14rem);
          line-height: 1.65;
          margin-top: 1.55rem;
        }

        .sg-hero[data-variant='signal'] .sg-hero-body {
          max-width: 520px;
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: clamp(0.86rem, 1vw, 0.96rem);
        }

        .sg-hero-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
          margin-top: 2.2rem;
        }

        .sg-hero-primary,
        .sg-hero-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 50px;
          border-radius: 999px;
          padding: 0.95rem 1.45rem;
          font-size: 0.94rem;
          font-weight: 800;
          text-decoration: none;
          transition: transform 160ms ease, background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
        }

        .sg-hero-primary {
          border: 1px solid var(--sg-accent);
          background: var(--sg-accent);
          color: var(--color-background);
          box-shadow: 0 0 0 0 color-mix(in srgb, var(--sg-accent) 18%, transparent), 0 16px 44px color-mix(in srgb, var(--sg-accent) 22%, transparent);
        }

        .sg-hero-secondary {
          border: 1px solid var(--color-border-subtle);
          background: color-mix(in srgb, var(--color-surface) 38%, transparent);
          color: var(--color-text-heading);
        }

        .sg-hero-primary:hover,
        .sg-hero-secondary:hover {
          transform: translateY(-2px);
        }

        .sg-hero-proof {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          border: 1px solid color-mix(in srgb, var(--sg-accent) 22%, transparent);
          border-radius: var(--radius);
          background: color-mix(in srgb, var(--sg-accent) 8%, transparent);
          color: var(--color-text-secondary);
          margin-top: 1.35rem;
          padding: 0.72rem 0.9rem;
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: 0.72rem;
          letter-spacing: 0.03em;
        }

        .sg-hero-proof svg {
          color: var(--sg-accent);
          flex-shrink: 0;
        }

        .sg-hero-visual {
          min-height: 560px;
          position: relative;
          transition: transform 180ms ease-out;
          will-change: transform;
        }

        .sg-device-stage {
          position: relative;
          width: min(100%, 620px);
          height: 560px;
          margin-left: auto;
        }

        .sg-device-card {
          position: absolute;
          border: 1px solid var(--color-border-subtle);
          background: color-mix(in srgb, var(--color-surface) 88%, transparent);
          box-shadow: 0 42px 90px -32px color-mix(in srgb, var(--color-text-heading) 58%, transparent);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          overflow: hidden;
        }

        .sg-device-browser {
          left: 70px;
          top: 18px;
          width: 460px;
          border-radius: 16px;
          animation: sgFloatA 7s ease-in-out infinite;
        }

        .sg-browser-top {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 13px 16px;
          background: color-mix(in srgb, var(--color-text-heading) 6%, transparent);
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .sg-browser-top > span {
          width: 11px;
          height: 11px;
          border-radius: 50%;
        }

        .sg-browser-top > span:nth-child(1) { background: var(--red); }
        .sg-browser-top > span:nth-child(2) { background: var(--amber); }
        .sg-browser-top > span:nth-child(3) { background: var(--green); }

        .sg-browser-top div {
          flex: 1;
          height: 24px;
          display: flex;
          align-items: center;
          margin-left: 12px;
          border-radius: 7px;
          background: color-mix(in srgb, var(--color-text-heading) 5%, transparent);
          color: var(--color-text-secondary);
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: 0.68rem;
          padding: 0 0.75rem;
        }

        .sg-browser-canvas {
          height: 236px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 1rem;
          align-items: center;
          padding: 1.4rem;
          background:
            repeating-linear-gradient(135deg, color-mix(in srgb, var(--sg-accent) 9%, transparent) 0 12px, color-mix(in srgb, var(--color-text-heading) 2%, transparent) 12px 24px);
        }

        .sg-canvas-panel {
          height: 150px;
          border: 1px solid color-mix(in srgb, var(--sg-accent) 22%, transparent);
          border-radius: 14px;
          background: color-mix(in srgb, var(--color-background) 46%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sg-canvas-panel span,
        .sg-phone-screen span,
        .sg-device-label span {
          color: var(--color-text-secondary);
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .sg-canvas-lines {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .sg-canvas-lines i {
          display: block;
          height: 10px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--sg-accent) 26%, transparent);
        }

        .sg-canvas-lines i:nth-child(2) {
          width: 72%;
        }

        .sg-canvas-lines i:nth-child(3) {
          width: 48%;
        }

        .sg-device-analytics {
          left: 0;
          top: 270px;
          width: 285px;
          border-radius: 16px;
          padding: 1rem;
          animation: sgFloatB 7.5s ease-in-out infinite;
        }

        .sg-device-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .sg-device-label b {
          width: 28px;
          height: 7px;
          border-radius: 999px;
          background: var(--sg-accent);
        }

        .sg-bars {
          height: 82px;
          display: flex;
          align-items: flex-end;
          gap: 7px;
        }

        .sg-bars i {
          flex: 1;
          border-radius: 4px 4px 2px 2px;
          background: color-mix(in srgb, var(--sg-accent) 42%, transparent);
        }

        .sg-bars i:nth-child(4) {
          background: var(--sg-accent);
          box-shadow: 0 0 24px color-mix(in srgb, var(--sg-accent) 34%, transparent);
        }

        .sg-device-phone {
          left: 430px;
          top: 160px;
          width: 158px;
          border-radius: 31px;
          padding: 8px;
          animation: sgFloatC 8.5s ease-in-out infinite;
        }

        .sg-phone-screen {
          position: relative;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 23px;
          overflow: hidden;
          background:
            repeating-linear-gradient(135deg, color-mix(in srgb, var(--sg-accent-2) 14%, transparent) 0 10px, color-mix(in srgb, var(--color-text-heading) 3%, transparent) 10px 20px);
        }

        .sg-phone-screen b {
          position: absolute;
          top: 10px;
          left: 50%;
          width: 46px;
          height: 14px;
          border-radius: 999px;
          background: var(--color-background);
          transform: translateX(-50%);
        }

        .sg-phone-screen span {
          writing-mode: vertical-rl;
        }

        .sg-hero[data-variant='editorial'] .sg-device-card {
          background: #fffdf7;
        }

        .sg-hero[data-variant='signal'] .sg-device-card {
          border-radius: 2px;
          box-shadow: none;
          backdrop-filter: none;
        }

        .sg-hero[data-variant='signal'] .sg-device-phone {
          border-radius: 16px;
        }

        @keyframes sgHeroGlow {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(24px, -18px, 0) scale(1.05); }
        }

        @keyframes sgFloatA {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-11px); }
        }

        @keyframes sgFloatB {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(13px); }
        }

        @keyframes sgFloatC {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @media (max-width: 1020px) {
          .sg-hero {
            padding-top: 8.2rem;
          }

          .sg-hero-inner {
            grid-template-columns: 1fr;
          }

          .sg-hero-copy {
            max-width: 820px;
          }

          .sg-hero-visual {
            min-height: 420px;
          }

          .sg-device-stage {
            height: 420px;
            margin: 0;
            transform: scale(0.84);
            transform-origin: left top;
          }
        }

        @media (max-width: 760px) {
          .sg-hero {
            min-height: auto;
            padding: 6.6rem 1.25rem 4.8rem;
          }

          .sg-hero-glow {
            width: 360px;
            height: 360px;
            opacity: 0.5;
          }

          .glow-one {
            left: auto;
            right: -170px;
            top: -90px;
          }

          .glow-two {
            right: -190px;
            top: 120px;
          }

          .sg-hero-grid-bg {
            inset: 0;
          }

          .sg-hero-title {
            font-size: clamp(2.55rem, 13vw, 4.05rem);
            line-height: 0.98;
          }

          .sg-hero-actions {
            align-items: stretch;
          }

          .sg-hero-primary,
          .sg-hero-secondary {
            flex: 1 1 100%;
          }

          .sg-hero-proof {
            align-items: flex-start;
            font-size: 0.68rem;
          }

          .sg-hero-visual {
            min-height: 280px;
            pointer-events: none;
          }

          .sg-device-stage {
            width: 100%;
            height: 280px;
            transform: none;
          }

          .sg-device-browser {
            left: 0;
            top: 0;
            width: min(100%, 370px);
          }

          .sg-browser-canvas {
            height: 160px;
            padding: 1rem;
          }

          .sg-device-analytics {
            left: 7%;
            top: 210px;
            width: 210px;
          }

          .sg-device-phone {
            right: 0;
            left: auto;
            top: 118px;
            width: 112px;
            border-radius: 24px;
          }

          .sg-phone-screen {
            height: 220px;
            border-radius: 18px;
          }
        }
      `}</style>
    </section>
  )
}
