import { motion } from 'framer-motion'
import { Lock, FileText, Shield } from 'lucide-react'

/**
 * TrustStatement - Build confidence with data ownership & security messaging
 */
export default function TrustStatement() {
  const statements = [
    {
      icon: Lock,
      label: 'Your Data is Yours',
      description: 'You own 100% of your code and data. We never sell or share information.',
    },
    {
      icon: FileText,
      label: 'Full Source Code Ownership',
      description: 'Every system we build becomes your asset. No vendor lock-in, ever.',
    },
    {
      icon: Shield,
      label: 'Enterprise Security',
      description: 'Role-based access control, audit trails, encryption. Built from day one.',
    },
  ]

  return (
    <section style={{ padding: '4rem 2rem', background: 'var(--bg-white)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {statements.map((item, idx) => {
            const IconComponent = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'color-mix(in srgb, var(--color-success) 10%, transparent)',
                    border: '1.5px solid color-mix(in srgb, var(--color-success) 20%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent size={24} color="var(--violet)" strokeWidth={1.5} />
                </div>

                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--color-text-heading)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {item.label}
                </h3>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.65,
                  }}
                >
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
