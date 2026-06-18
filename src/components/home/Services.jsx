import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { services } from '../../data/services'
import SectionHeader from '../common/SectionHeader'

export default function Services() {
  const primaryServices = services.filter(s => s.tier === 'primary')
  const secondaryServices = services.filter(s => s.tier === 'secondary')
  const tertiaryServices = services.filter(s => s.tier === 'tertiary')

  const ServiceTier = ({ title, subtitle, services: tierServices, isPrimary = false, isSecondary = false }) => (
    <div style={{ marginBottom: isPrimary ? '6rem' : '5rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: isPrimary ? '3rem' : '3rem' }}
      >
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: isPrimary ? 'var(--sg-accent)' : isSecondary ? 'var(--color-text-secondary)' : 'var(--ink-400)',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          {isPrimary ? '⭐ PRIMARY' : isSecondary ? 'SECONDARY' : 'COMPLEMENTARY'}
        </span>
        <h3
          style={{
            fontSize: isPrimary ? '2rem' : '1.5rem',
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            marginTop: '0.5rem',
            marginBottom: '0.75rem',
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          {subtitle}
        </p>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isPrimary ? 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))' : 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
          gap: '2rem',
        }}
      >
        {tierServices.map((service, idx) => {
          const IconComponent = Icons[service.icon] || Icons.Zap

          // For PRIMARY tier with products
          if (service.products) {
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  padding: '2.5rem',
                  border: '1.5px solid var(--sg-accent)',
                  background: 'color-mix(in srgb, var(--sg-accent) 6%, transparent)',
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '14px',
                      background: `color-mix(in srgb, var(--sg-accent) 20%, transparent)`,
                      border: `1.5px solid var(--sg-accent)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <IconComponent size={26} color="var(--sg-accent)" strokeWidth={1.5} />
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>
                    {service.title}
                  </h4>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                  {service.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {service.products.map((product, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.75rem',
                        background: 'color-mix(in srgb, var(--sg-accent) 10%, transparent)',
                        borderRadius: '8px',
                        border: '1px solid var(--sg-accent)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            {product.tagline}
                          </div>
                        </div>
                        <span
                          style={{
                            background: 'var(--sg-accent)',
                            color: 'var(--color-background)',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.35rem 0.65rem',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          }

          // For SECONDARY & TERTIARY tiers
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '2.5rem',
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    background: `color-mix(in srgb, ${service.color} 15%, transparent)`,
                    border: `1.5px solid color-mix(in srgb, ${service.color} 28%, transparent)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent size={26} color={service.color} strokeWidth={1.5} />
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                {service.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: service.color, fontWeight: 600, marginBottom: '0.75rem' }}>
                {service.subtitle}
              </p>

              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem', flex: 1 }}>
                {service.description}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {service.features.slice(0, 4).map((feature, i) => (
                  <li key={i} style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '0.75rem' }}>
                    <span style={{ color: service.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  return (
    <section id="services" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-surface)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeader
          label="WHAT WE OFFER"
          title="SaaS Products First. Custom Development. Websites Too."
          description="Three tiers of software solutions, organized by what matters most to your business."
          alignment="center"
          maxWidth="700px"
        />

        <div style={{ marginTop: '5rem' }}>
          {primaryServices.length > 0 && (
            <ServiceTier
              title="Our SaaS Products"
              subtitle="Production-ready software serving 100+ customers across Africa"
              services={primaryServices}
              isPrimary={true}
            />
          )}

          {secondaryServices.length > 0 && (
            <ServiceTier
              title="Custom Development"
              subtitle="Build your own SaaS platform or custom business software"
              services={secondaryServices}
              isSecondary={true}
            />
          )}

          {tertiaryServices.length > 0 && (
            <ServiceTier
              title="Websites & E-commerce"
              subtitle="Professional digital presence when you need it"
              services={tertiaryServices}
            />
          )}
        </div>
      </div>
    </section>
  )
}
