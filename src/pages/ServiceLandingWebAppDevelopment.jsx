import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Code, Users, TrendingUp, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import PageLayout from '../components/layout/PageLayout'

export default function ServiceLandingWebAppDevelopment() {
  return (
    <PageLayout>

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: '1rem', color: 'var(--sg-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Custom Software Development
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Web Apps Built for Your Business
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
              Stop using generic software that doesn't fit your workflow. We build custom web applications tailored to your business — inventory management, HR/payroll, CRM, logistics tracking, and more.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                Start Your App <ArrowRight size={16} />
              </Link>
              <a href="#examples" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'color-mix(in srgb, var(--color-surface) 38%, transparent)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border-subtle)', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                See Examples
              </a>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', border: '1px solid color-mix(in srgb, var(--sg-accent) 22%, transparent)', borderRadius: 'var(--radius)', background: 'color-mix(in srgb, var(--sg-accent) 8%, transparent)', color: 'var(--color-text-secondary)', padding: '0.72rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
              <span style={{ color: 'var(--sg-accent)', fontWeight: 700 }}>✓ 50+ APPS IN PRODUCTION</span> • Works offline • Local payments
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Apps We Build" title="Custom Software Solutions" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: Users, title: 'HR & Payroll Systems', desc: 'Employee management, automated payroll, leave tracking, performance reviews. Works with Paystack, MTN MoMo, local taxes.' },
              { icon: TrendingUp, title: 'Inventory Management', desc: 'Track stock across multiple locations. Real-time updates, low-stock alerts, purchase orders. Works offline.' },
              { icon: Code, title: 'CRM Systems', desc: 'Customer relationship management, sales pipeline, follow-ups. Know every customer, track deals, close more sales.' },
              { icon: Zap, title: 'Logistics Tracking', desc: 'Real-time GPS tracking, driver management, delivery proof. Offline-capable for areas with poor connectivity.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '14px', background: 'var(--bg-soft)' }}>
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

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Why Custom?" title="When Generic Software Fails" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Off-the-Shelf Problems</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Doesn\'t fit your workflow', 'No offline capability', 'No local payment integration', 'Hidden monthly fees', 'Can\'t scale'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Custom Software Advantages</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Built around YOUR process', 'Works offline (critical in Ghana)', 'Local payment integration', 'Priced for exactly what you need', 'Grows with your business'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Examples" title="Apps We've Built" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { name: 'Nexus HRM', type: 'HR & Payroll', users: '50+ companies', features: 'Automated payroll, Paystack integration, leave tracking, performance management' },
              { name: 'CargoScan', type: 'Logistics Tracking', users: '30+ operators', features: 'Real-time GPS, offline tracking, driver management, offline syncing' },
              { name: 'Custom Inventory', type: 'Inventory Management', users: 'Manufacturing', features: 'Multi-location tracking, low-stock alerts, purchase orders' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '14px', background: 'var(--bg-soft)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>{item.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--sg-accent)', fontWeight: 600, marginBottom: '1rem' }}>{item.type}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}><strong>Users:</strong> {item.users}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}><strong>Features:</strong> {item.features}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHeader label="Questions" title="Web App FAQ" alignment="center" />
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { q: 'How long does development take?', a: 'MVP: 8-12 weeks. Full-featured: 12-24 weeks. We provide timeline after understanding requirements.' },
              { q: 'What about offline capability?', a: 'Yes, all our apps can work offline. Data syncs automatically when you go back online — critical for Ghana connectivity.' },
              { q: 'Can I integrate with payment systems?', a: 'Absolutely. We integrate Paystack, MTN MoMo, Vodafone Cash, and any other payment gateway you need.' },
              { q: 'How much does it cost?', a: 'Depends entirely on complexity and scope. We don\'t publish fixed prices — we scope your project first, then send a custom quote.' },
              { q: 'What if I need changes later?', a: 'Easy. You own the code. We provide documentation, training, and ongoing support for any updates.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--glass-bg)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-heading)' }}>{item.q}</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0 }}>{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Ready to Build Your App?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>Tell us about your idea. We'll help you understand requirements, timeline, and investment.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.75rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', cursor: 'pointer' }}>
            Schedule Consultation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
