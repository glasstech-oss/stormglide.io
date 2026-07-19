import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function FounderStory() {
  const { activeVariant } = useTheme()

  return (
    <section style={{
      padding: 'clamp(4rem, 10vw, 8rem) 2rem',
      background: 'var(--color-background)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--sg-accent)',
            marginBottom: '1rem'
          }}>Our Story</p>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            margin: '0 0 1.5rem 0',
            lineHeight: 1.2
          }}>
            Why We Started StormGlide
          </h2>
        </motion.div>

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}
        >
          {/* Left: Narrative */}
          <div style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--color-text-primary)'
          }}>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem' }}>
              In 2021, we noticed a pattern across African businesses: they were spending millions on imported software built for America and Europe. These systems didn't understand their workflows, didn't support local payment methods, and treated Africa as an afterthought.
            </p>

            <p style={{ margin: '0 0 1.5rem 0' }}>
              Logistics companies were using spreadsheets to manage shipments. HR teams relied on WhatsApp and paper forms. Retailers couldn't track inventory across branches in real-time. And the software companies shrugged.
            </p>

            <p style={{ margin: '0 0 1.5rem 0' }}>
              We decided to build differently. Not for a generic "global market," but specifically for African operations. We built software that understands:
            </p>

            <ul style={{
              margin: '1rem 0 2rem 0',
              paddingLeft: '1.5rem',
              listStyle: 'disc',
              color: 'var(--color-text-secondary)'
            }}>
              <li style={{ marginBottom: '0.75rem' }}>Local payment integrations (Paystack, MTN MoMo, mobile money)</li>
              <li style={{ marginBottom: '0.75rem' }}>Multi-branch operations and currency complexities</li>
              <li style={{ marginBottom: '0.75rem' }}>Low-bandwidth environments and reliable infrastructure</li>
              <li style={{ marginBottom: '0.75rem' }}>Real business workflows, not idealized ones</li>
            </ul>

            <p style={{ margin: '0', fontWeight: 600, color: 'var(--color-text-heading)' }}>
              Today, 100+ African businesses use our products. And we're just getting started.
            </p>
          </div>

          {/* Right: Key Stats */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {[
              { label: 'Founded', value: '2021', desc: 'Building software for Africa' },
              { label: 'Team', value: 'Africa-First', desc: 'Based in Accra, Ghana' },
              { label: 'Customers', value: 'Real Businesses', desc: 'Across Ghana & Guinea' },
              { label: 'Philosophy', value: 'Your Success', desc: 'We grow when you grow' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  background: activeVariant.id === 'editorial'
                    ? 'color-mix(in srgb, var(--color-background) 98%, var(--sg-accent) 2%)'
                    : 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
                  borderLeft: `4px solid var(--sg-accent)`
                }}
              >
                <p style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--sg-accent)',
                  margin: '0 0 0.5rem 0'
                }}>
                  {item.label}
                </p>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--color-text-heading)',
                  margin: '0 0 0.25rem 0',
                  lineHeight: 1
                }}>
                  {item.value}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-text-secondary)',
                  margin: 0
                }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Join 100+ African businesses already using our products to streamline operations and grow revenue.
          </p>
          <a href="/contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 2rem',
            background: 'var(--sg-accent)',
            color: 'var(--color-background)',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '0.95rem',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 12px 32px -6px color-mix(in srgb, var(--sg-accent) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 24px 56px -8px color-mix(in srgb, var(--sg-accent) 50%, transparent), inset 0 1px 0 rgba(255,255,255,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 12px 32px -6px color-mix(in srgb, var(--sg-accent) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}>
            Let's Talk →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
