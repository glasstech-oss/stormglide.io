import { motion } from 'framer-motion'
import { Truck, Stethoscope, ShoppingCart, HardHat, GraduationCap, Building } from 'lucide-react'
import SectionHeader from '../common/SectionHeader'

const industries = [
  { name: 'Logistics & supply chain', icon: Truck },
  { name: 'Healthcare & clinics', icon: Stethoscope },
  { name: 'Retail & inventory businesses', icon: ShoppingCart },
  { name: 'Construction & procurement', icon: HardHat },
  { name: 'Schools and service businesses', icon: GraduationCap },
  { name: 'SMEs that need automation', icon: Building },
]

export default function Industries() {
  return (
    <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-white)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeader
          label="WHO WE SERVE"
          title="Built for businesses with complex operations."
          description="We understand African operations, payments, logistics, procurement, and business workflows."
          alignment="center"
          maxWidth="700px"
        />

        <div
          style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1000px',
            margin: '4rem auto 0',
          }}
        >
          {industries.map((industry, idx) => {
            const Icon = industry.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.5rem',
                  background: 'var(--bg-soft)',
                  border: '1px solid var(--ink-100)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'color-mix(in srgb, var(--color-accent-blue) 10%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color="var(--color-accent-blue)" />
                </div>
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--color-text-heading)'
                  }}
                >
                  {industry.name}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
