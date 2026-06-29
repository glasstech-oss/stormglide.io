import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const SYSTEMS = [
  {
    id: 'nexus',
    index: '01',
    name: 'Nexus HRM',
    type: 'Operations system',
    status: 'People and payroll workflows',
  },
  {
    id: 'commerce',
    index: '02',
    name: 'Lollarod',
    type: 'Commerce platform',
    status: 'Storefront and local delivery',
  },
  {
    id: 'sano',
    index: '03',
    name: 'SANO',
    type: 'Mobile health product',
    status: 'Guidance and personal routines',
  },
]

const META_MOTION = {
  aurora: { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 } },
  editorial: { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 } },
  signal: { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 } },
}

export default function Hero() {
  const { activeVariant } = useTheme()
  const [activeId, setActiveId] = useState('nexus')
  const [hasInteracted, setHasInteracted] = useState(false)
  const [paused, setPaused] = useState(false)
  const stageRef = useRef(null)
  const stageInView = useInView(stageRef, { amount: 0.45 })
  const reduceMotion = useReducedMotion()
  const activeSystem = SYSTEMS.find(system => system.id === activeId) ?? SYSTEMS[0]
  const metaMotion = META_MOTION[activeVariant.id] ?? META_MOTION.aurora

  useEffect(() => {
    const canAutoPlay = window.matchMedia('(pointer: fine)').matches
    if (!canAutoPlay || reduceMotion || hasInteracted || paused || !stageInView) return undefined

    const timer = window.setInterval(() => {
      setActiveId(currentId => {
        const currentIndex = SYSTEMS.findIndex(system => system.id === currentId)
        return SYSTEMS[(currentIndex + 1) % SYSTEMS.length].id
      })
    }, 5800)

    return () => window.clearInterval(timer)
  }, [hasInteracted, paused, reduceMotion, stageInView])

  const selectSystem = id => {
    setActiveId(id)
    setHasInteracted(true)
  }

  return (
    <section className="sg-home-hero" data-variant={activeVariant.id}>
      <div className="sg-home-hero-grid" aria-hidden="true" />

      <div className="sg-home-hero-inner">
        <div className="sg-home-hero-copy">
          <motion.div
            className="sg-home-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="sg-home-status-dot" />
            Product studio and software operator
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Software that runs <em>African operations.</em>
          </motion.h1>

          <motion.p
            className="sg-home-hero-body"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We design, build and operate web, business and mobile systems around how teams work here.
          </motion.p>

          <motion.div
            className="sg-home-hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            <a href="#systems" className="btn-primary">
              Explore the systems <ArrowRight size={16} />
            </a>
            <Link to="/contact" className="sg-home-text-link">
              Start a project <ArrowUpRight size={15} />
            </Link>
          </motion.div>

          <motion.div
            className="sg-home-location"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.38 }}
          >
            <MapPin size={14} />
            Built in Accra, working across Africa
          </motion.div>
        </div>

        <motion.div
          ref={stageRef}
          className="sg-home-product-stage"
          data-active={activeId}
          data-autoplay={!hasInteracted && !reduceMotion}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
          }}
        >
          <div className="sg-stage-orbit" aria-hidden="true" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="sg-stage-meta"
              key={activeSystem.id}
              initial={metaMotion.initial}
              animate={metaMotion.animate}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <small>Product {activeSystem.index} / 03</small>
              <strong>{activeSystem.name}</strong>
              <span>{activeSystem.type}</span>
              <span className="sg-stage-meta-status"><i /> {activeSystem.status}</span>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            className={`sg-stage-frame sg-stage-window sg-stage-window-main ${activeId === 'nexus' ? 'is-active' : ''}`}
            aria-pressed={activeId === 'nexus'}
            aria-label="Preview Nexus HRM operations system"
            onClick={() => selectSystem('nexus')}
          >
            <span className="sg-stage-window-bar">
              <i /><i /><i />
              <small>operations.stormglide.io</small>
            </span>
            <img
              src="/images/mockups/webapp.png"
              width="1024"
              height="662"
              alt="Human resources operations dashboard built by Stormglide"
              fetchPriority="high"
              decoding="async"
            />
            <span className="sg-stage-caption">Business systems</span>
            <span className="sg-stage-signal-scan" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={`sg-stage-frame sg-stage-window sg-stage-window-web ${activeId === 'commerce' ? 'is-active' : ''}`}
            aria-pressed={activeId === 'commerce'}
            aria-label="Preview Lollarod commerce platform"
            onClick={() => selectSystem('commerce')}
          >
            <img
              src="/images/mockups/website.png"
              width="1024"
              height="588"
              alt="Commerce website built by Stormglide"
              loading="lazy"
              decoding="async"
            />
            <span className="sg-stage-caption">Web platforms</span>
            <span className="sg-stage-signal-scan" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={`sg-stage-frame sg-stage-phone ${activeId === 'sano' ? 'is-active' : ''}`}
            aria-pressed={activeId === 'sano'}
            aria-label="Preview SANO mobile health product"
            onClick={() => selectSystem('sano')}
          >
            <img
              src="/images/mockups/mobile.png"
              width="477"
              height="1024"
              alt="SANO mobile health product interface"
              loading="lazy"
              decoding="async"
            />
            <span className="sg-stage-caption">Mobile products</span>
            <span className="sg-stage-signal-scan" aria-hidden="true" />
          </button>

          <div className="sg-stage-selector" role="tablist" aria-label="Choose a product preview">
            {SYSTEMS.map(system => (
              <button
                type="button"
                role="tab"
                aria-selected={activeId === system.id}
                className={activeId === system.id ? 'is-active' : ''}
                key={system.id}
                onClick={() => selectSystem(system.id)}
              >
                <span>{system.index}</span>
                {system.name}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
