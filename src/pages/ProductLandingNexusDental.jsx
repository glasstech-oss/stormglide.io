import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Calendar, FileText, CreditCard, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import PageLayout from '../components/layout/PageLayout'

const ACCENT = '#00BFA5'

export default function NexusDentalLanding() {
  return (
    <PageLayout>

      {/* Hero */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: '1rem', color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Dental Practice Management
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Nexus Dental
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
              A complete practice management system built for dental clinics — patient records, appointments, treatment plans, billing, and clinical notes in one connected platform.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: ACCENT, color: '#fff', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                Request Demo <ArrowRight size={16} />
              </Link>
              <a href="https://nexusdental--nexusdentalsystem.us-east4.hosted.app" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'color-mix(in srgb, var(--color-surface) 38%, transparent)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border-subtle)', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                Open Live Site
              </a>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', border: `1px solid color-mix(in srgb, ${ACCENT} 22%, transparent)`, borderRadius: 'var(--radius)', background: `color-mix(in srgb, ${ACCENT} 8%, transparent)`, color: 'var(--color-text-secondary)', padding: '0.72rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
              <span style={{ color: ACCENT, fontWeight: 700 }}>✓ LIVE PRODUCT</span> • Built for African clinics • Cloud-based
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Core Capabilities" title="What Nexus Dental Does" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: Users, title: 'Patient Records', desc: 'Complete dental history, X-rays, treatment notes, and contact records in one place' },
              { icon: Calendar, title: 'Appointment Scheduling', desc: 'Book, reschedule, and manage appointments across multiple dentists and chairs' },
              { icon: FileText, title: 'Treatment Plans', desc: 'Create and track treatment plans, clinical notes, and charting per patient visit' },
              { icon: CreditCard, title: 'Billing & Invoicing', desc: 'Generate invoices, track payments, and manage outstanding balances' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '14px', background: 'var(--bg-soft)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `color-mix(in srgb, ${ACCENT} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${ACCENT} 28%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <item.icon size={24} color={ACCENT} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for African Clinics */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Why Nexus Dental" title="Built for How African Clinics Actually Work" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Practice Operations</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Multi-dentist and multi-chair support',
                  'Walk-in and scheduled appointment flow',
                  'SMS and WhatsApp appointment reminders',
                  'Offline-resilient — works on slow connections',
                  'Role-based access for front desk and clinical staff',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color={ACCENT} style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Finance & Compliance</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Invoice generation with itemized treatments',
                  'Partial payment and instalment tracking',
                  'Daily, weekly, and monthly revenue reports',
                  'Patient payment history and outstanding balances',
                  'Data export for accounting and tax purposes',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color={ACCENT} style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHeader label="Questions" title="Frequently Asked" alignment="center" />
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { q: 'Do I need to install anything?', a: 'No. Nexus Dental is fully cloud-based. Your staff access it through any modern browser — no downloads or IT setup required.' },
              { q: 'Can it handle multiple dentists and chairs?', a: 'Yes. Nexus Dental supports multi-dentist scheduling with separate appointment streams and chair assignments per practitioner.' },
              { q: 'What happens to patient data if I lose internet?', a: 'The system is designed to work on slow or intermittent connections. Critical data is cached locally and syncs when the connection is restored.' },
              { q: 'Can I migrate data from our current paper records or system?', a: 'Yes. We support structured data import and can assist with migrating from paper records, Excel, or other practice management software.' },
              { q: 'Is patient data secure?', a: 'All data is encrypted in transit and at rest. Access is role-controlled — front desk staff only see scheduling and billing; clinical notes are restricted to clinical staff.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--bg-soft)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-heading)' }}>{item.q}</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0 }}>{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Ready to run a paperless clinic?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Nexus Dental replaces scattered paper records, manual appointment books, and disconnected billing — with one system your whole team can use from day one.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.75rem', background: ACCENT, color: '#fff', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', cursor: 'pointer' }}>
              Schedule a Demo <ArrowRight size={16} />
            </Link>
            <a href="https://nexusdental--nexusdentalsystem.us-east4.hosted.app" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.75rem', background: 'transparent', color: 'var(--color-text-heading)', border: '1px solid var(--color-border-subtle)', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', cursor: 'pointer' }}>
              Open Live Site
            </a>
          </div>
        </div>
      </section>

    </PageLayout>
  )
}
