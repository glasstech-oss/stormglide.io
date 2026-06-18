import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'

const stack = [
  'React',
  'Node.js',
  'PostgreSQL',
  'Firebase',
  'Paystack',
  'WhatsApp Integrations'
]

export default function TechStack() {
  return (
    <section style={{ padding: 'calc(var(--section-padding) * 0.8) 2rem', background: 'var(--bg-white)', borderTop: '1px solid var(--ink-100)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              background: 'var(--bg-soft)',
              border: '1px solid var(--ink-100)',
              color: 'var(--color-text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <Code2 size={16} color="var(--color-text-secondary)" />
            Enterprise-Grade Stack
          </div>
          
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
            Built with robust, scalable technology
          </h3>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '0.75rem', 
            marginTop: '1.5rem' 
          }}>
            {stack.map((tech, idx) => (
              <span
                key={idx}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--ink-100)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
