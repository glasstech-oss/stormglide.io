import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { services } from '../../data/services'
import SectionHeader from '../common/SectionHeader'
import { BentoContainer, BentoItem } from './BentoGrid'

export default function Services() {
  const primaryService = services.find(s => s.tier === 'primary') // Just the one primary
  const secondaryServices = services.filter(s => s.tier === 'secondary')
  const tertiaryServices = services.filter(s => s.tier === 'tertiary')

  return (
    <section id="services" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-surface)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeader
          label="WHAT WE DO"
          title="Engineered for Scale. Designed for Speed."
          description="From powerful SaaS platforms to high-performance customer portals, we build software that drives your business forward."
          alignment="center"
          maxWidth="700px"
        />

        <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* PRIMARY TIER (SaaS Products) */}
          {primaryService && (
            <BentoContainer isPrimary={true}>
              <BentoItem 
                colSpan={8}
                rowSpan={2}
                title={primaryService.title}
                subtitle={primaryService.subtitle}
                description={primaryService.description}
                icon={primaryService.icon}
                color={primaryService.color}
                bgMode="solid"
                delay={0.1}
              >
                {/* Visual Representation instead of a long list */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {primaryService.products?.map((product, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '1rem',
                        background: 'color-mix(in srgb, var(--color-background) 40%, transparent)',
                        borderRadius: '12px',
                        border: '1px solid color-mix(in srgb, var(--color-background) 20%, transparent)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}
                    >
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 750, color: 'var(--color-text-heading)' }}>
                            {product.name}
                          </span>
                          <span style={{ background: 'var(--sg-accent)', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            {product.badge}
                          </span>
                       </div>
                       <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{product.tagline}</span>
                    </div>
                  ))}
                </div>
              </BentoItem>

              {/* SECONDARY TIER INJECTED ALONGSIDE PRIMARY */}
              {secondaryServices[0] && (
                <BentoItem 
                  colSpan={4}
                  rowSpan={1}
                  title={secondaryServices[0].title}
                  description={secondaryServices[0].description}
                  icon={secondaryServices[0].icon}
                  color={secondaryServices[0].color}
                  bgMode="subtle"
                  delay={0.2}
                />
              )}
              {secondaryServices[1] && (
                <BentoItem 
                  colSpan={4}
                  rowSpan={1}
                  title={secondaryServices[1].title}
                  description={secondaryServices[1].description}
                  icon={secondaryServices[1].icon}
                  color={secondaryServices[1].color}
                  bgMode="glass"
                  delay={0.3}
                />
              )}
            </BentoContainer>
          )}

          {/* TERTIARY TIER */}
          {tertiaryServices.length > 0 && (
             <BentoContainer>
               {tertiaryServices.map((service, idx) => (
                  <BentoItem 
                    key={service.id}
                    colSpan={3}
                    rowSpan={1}
                    title={service.title}
                    description={service.description}
                    icon={service.icon}
                    color={service.color}
                    align="center"
                    bgMode="subtle"
                    delay={0.1 * idx}
                  />
               ))}
             </BentoContainer>
          )}

        </div>
      </div>
    </section>
  )
}
