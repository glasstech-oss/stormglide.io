import { motion } from 'framer-motion'
import SectionHeader from '../common/SectionHeader'

/**
 * TeamSection - Build trust by showing the humans behind the company
 */
export default function TeamSection() {
  const team = [
    {
      name: 'Founder & CEO',
      title: 'Built 10+ enterprise systems for African logistics, healthcare, manufacturing',
      initials: 'SG',
      color: 'var(--color-success)',
    },
    {
      name: 'Engineering Lead',
      title: 'Full-stack architect. Scaled systems from 10 to 10,000 users.',
      initials: 'EL',
      color: 'var(--sg-accent)',
    },
    {
      name: 'Operations & Delivery',
      title: 'Ensures every project ships on time with zero surprises.',
      initials: 'OD',
      color: 'var(--color-warning)',
    },
  ]

  return (
    <section style={{ padding: 'var(--section-padding) 2rem', background: 'var(--bg-soft)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeader
          label="OUR TEAM"
          title="Built by experienced operators"
          description="Engineers who've run businesses, not just written code."
          alignment="center"
          maxWidth="700px"
        />

        <div
          style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: '2rem',
          }}
        >
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              style={{
                textAlign: 'center',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '12px',
                  background: member.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: 'var(--color-text-heading)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                {member.initials}
              </div>

              {/* Name */}
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  marginBottom: '0.5rem',
                }}
              >
                {member.name}
              </h3>

              {/* Bio */}
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.65,
                }}
              >
                {member.title}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: '3rem',
            textAlign: 'center',
            padding: '2rem',
            background: 'var(--bg-white)',
            border: '1.5px solid var(--ink-100)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.95rem',
              margin: 0,
            }}
          >
            We're a small team based in <strong>Accra, Ghana</strong>. We've collectively built software for 50+ African businesses across logistics, healthcare, manufacturing, and retail. We don't just code — we understand operations.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
