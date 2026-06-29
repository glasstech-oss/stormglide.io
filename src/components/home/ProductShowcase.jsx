import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

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

  return (
    <section className="sg-systems-section" id="systems">
      <div className="sg-home-container">
        <div className="sg-home-section-heading">
          <div>
            <span className="sg-home-section-label">Systems you can inspect</span>
            <h2>Real interfaces. Real operating context.</h2>
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

          <div className={`sg-system-visual is-${activeSystem.id}`}>
            <AnimatePresence mode="wait">
              <motion.figure
                key={activeSystem.id}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.28 }}
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
          </div>
        </div>
      </div>
    </section>
  )
}
