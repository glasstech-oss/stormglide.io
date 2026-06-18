import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { differentiators } from '../../data/differentiators'
import SectionHeader from '../common/SectionHeader'

/**
 * WhyStormglide - Communicate meaningful differentiators
 */
export default function WhyStormglide() {
  return (
    <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeader
          label="WHY STORMGLIDE"
          title="Why choose StormGlide?"
          alignment="center"
          maxWidth="640px"
        />

        <div
          style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: '2rem',
          }}
        >
          {differentiators.map((diff, idx) => {
            const IconComponent = Icons[diff.icon] || Icons.Zap
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="card"
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
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
                  <IconComponent size={22} color="var(--blue)" strokeWidth={1.5} />
                </div>

                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--color-text-heading)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {diff.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.65,
                  }}
                >
                  {diff.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
