import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import WordReveal from '../common/WordReveal'

const SYSTEMS = [
  {
    id: 'nexus',
    name: 'Nexus HRM',
    type: 'Business system',
    title: 'People operations in one clear workspace.',
    description: 'A focused platform for employee records, leave, goals, payroll workflows and management visibility.',
    points: ['Multi-branch operations', 'Employee self-service', 'Operational dashboards'],
    image: '/images/mockups/webapp.png',
    width: 1024,
    height: 662,
    alt: 'Nexus HRM dashboard showing staff groups and department scores',
    path: '/nexus-hrm',
    external: 'https://mcbauchemieguinea.com/',
  },
  {
    id: 'sano',
    name: 'SANO Health',
    type: 'Mobile product',
    title: 'Health guidance designed for everyday use.',
    description: 'A mobile-first experience that brings skin analysis, routines and personal guidance into one calm interface.',
    points: ['Guided skin analysis', 'Personal routines', 'Mobile-first experience'],
    image: '/images/mockups/mobile.png',
    width: 477,
    height: 1024,
    alt: 'SANO mobile health dashboard with skin scan and routine actions',
    path: '/sano-health',
  },
  {
    id: 'dental',
    name: 'Nexus Dental',
    type: 'Dental practice system',
    title: 'Patient records, appointments, billing — one system.',
    description: 'A full practice management platform built for dental clinics. Manages patients, treatment plans, scheduling and invoicing without paper or disconnected spreadsheets.',
    points: ['Patient records & dental history', 'Appointment scheduling', 'Treatment plans & billing'],
    image: '/images/mockups/dental.png',
    width: 1024,
    height: 662,
    alt: 'Nexus Dental practice management dashboard',
    path: '/nexus-dental',
    external: 'https://nexusdental--nexusdentalsystem.us-east4.hosted.app',
  },
  {
    id: 'commerce',
    name: 'Lollarod Commerce',
    type: 'Client platform',
    title: 'A complete digital storefront, not a template.',
    description: 'A commerce experience shaped around product discovery, local delivery and the way customers actually buy.',
    points: ['Product-led experience', 'Local commerce workflows', 'Responsive storefront'],
    image: '/images/mockups/website.png',
    width: 1024,
    height: 588,
    alt: 'Lollarod commerce website with a furniture collection hero',
    path: '/work',
    external: 'https://lollarodgh.web.app/',
  },
]

export default function ProductShowcase() {
  const [activeId, setActiveId] = useState(SYSTEMS[0].id)
  const activeSystem = SYSTEMS.find(system => system.id === activeId) || SYSTEMS[0]
  const reduceMotion = useReducedMotion()

  /* Scroll parallax — mockup drifts slower than the page */
  const visualRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [46, -46])

  /* Mouse tilt — figure leans toward the cursor */
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const springTiltX = useSpring(tiltX, { stiffness: 160, damping: 20 })
  const springTiltY = useSpring(tiltY, { stiffness: 160, damping: 20 })

  const handleTilt = event => {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    tiltX.set(py * -5)
    tiltY.set(px * 7)
  }

  const resetTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <section className="sg-systems-section" id="systems">
      <div className="sg-home-container">
        <div className="sg-home-section-heading">
          <div>
            <span className="sg-home-section-label">Systems you can inspect</span>
            <WordReveal text="Real interfaces. Real operating context." />
          </div>
          <p>We show the software because the work should be visible before the sales call.</p>
        </div>

        <div className="sg-system-tabs" role="tablist" aria-label="Featured Stormglide systems">
          {SYSTEMS.map(system => (
            <button
              type="button"
              role="tab"
              aria-selected={activeId === system.id}
              className={activeId === system.id ? 'is-active' : ''}
              key={system.id}
              onClick={() => setActiveId(system.id)}
            >
              <span>{system.name}</span>
              <small>{system.type}</small>
            </button>
          ))}
        </div>

        <div className="sg-system-showcase">
          <div className="sg-system-copy">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSystem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <span className="sg-system-type">{activeSystem.type}</span>
                <h3>{activeSystem.title}</h3>
                <p>{activeSystem.description}</p>
                <ul>
                  {activeSystem.points.map(point => (
                    <li key={point}><CheckCircle2 size={17} /> {point}</li>
                  ))}
                </ul>
                <div className="sg-system-actions">
                  <Link to={activeSystem.path} className="btn-primary">
                    View the system <ArrowRight size={15} />
                  </Link>
                  {activeSystem.external && (
                    <a href={activeSystem.external} target="_blank" rel="noreferrer" className="sg-home-text-link">
                      Open live <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            ref={visualRef}
            className={`sg-system-visual is-${activeSystem.id}`}
            style={{ y: parallaxY, rotateX: springTiltX, rotateY: springTiltY, transformPerspective: 1100 }}
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
          >
            <AnimatePresence mode="wait">
              <motion.figure
                key={activeSystem.id}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, rotateX: 7, y: 22 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformPerspective: 900 }}
              >
                <div className="sg-system-browser-bar">
                  <span /><span /><span />
                  <small>{activeSystem.name.toLowerCase().replaceAll(' ', '-')}.stormglide.io</small>
                </div>
                <img
                  src={activeSystem.image}
                  width={activeSystem.width}
                  height={activeSystem.height}
                  alt={activeSystem.alt}
                  loading="lazy"
                  decoding="async"
                />
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
