import { motion } from 'framer-motion'
import { CheckCircle2, TrendingUp, Users, FileText, CreditCard, Activity, RefreshCw } from 'lucide-react'
import SectionHeader from '../common/SectionHeader'

const outcomes = [
  { text: 'Reduce manual work', icon: RefreshCw },
  { text: 'Track sales and stock', icon: TrendingUp },
  { text: 'Manage customers', icon: Users },
  { text: 'Automate reports', icon: FileText },
  { text: 'Collect payments online', icon: CreditCard },
  { text: 'Monitor operations in real time', icon: Activity },
  { text: 'Replace Excel/WhatsApp chaos with proper systems', icon: CheckCircle2 },
]

export default function SolutionSection() {
  return (
    <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-white)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeader
          label="THE SOLUTION"
          title="StormGlide builds custom business software that brings everything into one system."
          alignment="center"
          maxWidth="800px"
        />

        <div
          style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1000px',
            margin: '4rem auto 0',
          }}
        >
          {outcomes.map((outcome, idx) => {
            const Icon = outcome.icon
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
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    background: 'color-mix(in srgb, var(--sg-accent) 10%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color="var(--sg-accent)" />
                </div>
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--color-text-heading)'
                  }}
                >
                  {outcome.text}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
