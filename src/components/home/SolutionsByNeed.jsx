import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { solutions } from '../../data/solutions'
import SectionHeader from '../common/SectionHeader'

/**
 * SolutionsByNeed - Help visitors identify which engagement type applies to them
 */
export default function SolutionsByNeed() {
  return (
    <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeader
          label="FIND YOUR FIT"
          title="Solutions by what you need"
          alignment="center"
          maxWidth="640px"
        />

        <div
          style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {solutions.map((solution, idx) => {
            const IconComponent = Icons[solution.icon] || Icons.Zap
            return (
              <motion.a
                key={solution.id}
                href={solution.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="card"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: 'color-mix(in srgb, var(--sg-accent) 10%, transparent)',
                    border: '1.5px solid color-mix(in srgb, var(--sg-accent) 20%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent size={20} color="var(--blue)" strokeWidth={1.5} />
                </div>

                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: 'var(--color-text-heading)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {solution.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                    flex: 1,
                  }}
                >
                  {solution.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--blue)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    marginTop: 'auto',
                    transition: 'gap 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.gap = '0.75rem')}
                  onMouseLeave={e => (e.currentTarget.style.gap = '0.5rem')}
                >
                  {solution.cta} →
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
