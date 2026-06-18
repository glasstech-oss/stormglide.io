import { motion } from 'framer-motion'
import SectionHeader from '../common/SectionHeader'

const steps = [
  { num: '01', title: 'Discovery call', desc: 'Understanding your business operations and pain points.' },
  { num: '02', title: 'Workflow mapping', desc: 'Detailing how the software will solve your specific bottlenecks.' },
  { num: '03', title: 'UI prototype', desc: 'Visualizing the system before any code is written.' },
  { num: '04', title: 'Development', desc: 'Building the core architecture and features.' },
  { num: '05', title: 'Testing', desc: 'Rigorous QA and user acceptance testing.' },
  { num: '06', title: 'Launch', desc: 'Deployment, onboarding, and go-live.' },
  { num: '07', title: 'Support & improvements', desc: 'Ongoing maintenance, scaling, and feature updates.' },
]

export default function Process() {
  return (
    <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeader
          label="OUR PROCESS"
          title="How We Work"
          description="A structured, predictable process that turns your operational chaos into streamlined software."
          alignment="center"
          maxWidth="700px"
        />

        <div
          style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '4rem auto 0',
          }}
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem',
                background: 'var(--bg-white)',
                border: '1px solid var(--ink-100)',
                borderRadius: 'var(--radius-lg)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'color-mix(in srgb, var(--sg-accent) 20%, transparent)',
                  marginBottom: '1rem',
                  lineHeight: 1
                }}
              >
                {step.num}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
