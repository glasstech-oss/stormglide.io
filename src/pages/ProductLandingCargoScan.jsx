import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Truck, Calculator, Navigation, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import PageLayout from '../components/layout/PageLayout'

export default function CargoScanLanding() {
  return (
    <PageLayout>

      {/* Hero */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: '1rem', color: 'var(--sg-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Logistics & Supply Chain
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              CargoScan
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
              Two tools in one platform: instant CBM and freight-cost calculation for quoting shipments, and GPS fleet tracking for managing them once they're moving.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                Request Demo <ArrowRight size={16} />
              </Link>
              <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'color-mix(in srgb, var(--color-surface) 38%, transparent)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border-subtle)', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                Learn More
              </a>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', border: '1px solid color-mix(in srgb, var(--sg-accent) 22%, transparent)', borderRadius: 'var(--radius)', background: 'color-mix(in srgb, var(--sg-accent) 8%, transparent)', color: 'var(--color-text-secondary)', padding: '0.72rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
              <span style={{ color: 'var(--sg-accent)', fontWeight: 700 }}>✓ LIVE PRODUCT</span> • Built for Ghana-China trade routes
            </div>
          </motion.div>
        </div>
      </section>

      {/* Two capabilities */}
      <section id="features" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="One Platform, Two Capabilities" title="Quote the Shipment, Then Track It" alignment="left" maxWidth="760px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))', gap: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ padding: '2.25rem', border: '1px solid var(--color-border)', borderRadius: '16px', background: 'var(--bg-soft)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--sg-accent) 28%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Calculator size={24} color="var(--sg-accent)" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-text-heading)' }}>Instant cost estimation</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--sg-accent)', fontWeight: 600, marginBottom: '1.25rem' }}>Scan or enter, get a quote</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Instant CBM calculation from package dimensions', 'Freight cost estimation by route', 'Multi-package shipment tracking', 'Shareable shipment reports', 'Import/export history log'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ padding: '2.25rem', border: '1px solid var(--color-border)', borderRadius: '16px', background: 'var(--bg-soft)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--sg-accent) 28%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Navigation size={24} color="var(--sg-accent)" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-text-heading)' }}>Shipment & fleet tracking</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--sg-accent)', fontWeight: 600, marginBottom: '1.25rem' }}>Know where it is, always</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['GPS-enabled cargo and vehicle tracking', 'Offline-capable mobile apps for drivers', 'Geofencing and delivery alerts', 'SMS and WhatsApp driver communications', 'Customer delivery notifications'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why it works here */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Designed For Reality" title="Built for African Trade Routes" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: Truck, title: 'Built for the routes you actually run', desc: 'Purpose-built around Ghana-China trade flows, not adapted from a generic logistics template.' },
              { icon: AlertCircle, title: 'Works with patchy connectivity', desc: 'Mobile apps work offline and sync when a connection is available — GPS data is cached and sent in batches.' },
              { icon: Navigation, title: 'One record, start to finish', desc: 'The same shipment record follows the cargo from cost estimate to delivery confirmation.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '14px', background: 'var(--glass-bg)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--sg-accent) 28%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <item.icon size={24} color="var(--sg-accent)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHeader label="Questions" title="Frequently Asked" alignment="center" />
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { q: 'Can CargoScan work in areas with poor connectivity?', a: 'Yes. Mobile apps work offline and sync when connectivity returns. GPS data is cached and sent in batches.' },
              { q: 'How does the cost calculator work?', a: 'Enter or scan your package dimensions and CargoScan instantly calculates CBM and a freight cost estimate for your route.' },
              { q: 'Can drivers use basic phones?', a: 'Yes. Drivers can receive SMS updates and communicate via basic phones. The full tracking app currently runs on Android.' },
              { q: 'How do I integrate with systems I already use?', a: 'CargoScan provides a REST API for integrating with your existing tools. Integration scope is quoted after we understand what you\'re connecting to.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--glass-bg)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-heading)' }}>{item.q}</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0 }}>{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Ready to quote and track your shipments in one place?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>From instant cost estimates to real-time tracking, CargoScan covers the shipment end to end.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.75rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', cursor: 'pointer' }}>
            Schedule a Demo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
