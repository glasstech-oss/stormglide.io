import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Users, Smartphone, Stethoscope, WifiOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import PageLayout from '../components/layout/PageLayout'

export default function SANOLanding() {
  return (
    <PageLayout>

      {/* Hero */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: '1rem', color: 'var(--sg-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Health Platform for African Communities & Clinics
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              SANO Health
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
              One platform, two sides: an offline-first mobile tool that puts basic health monitoring in people's hands, and a practice-management module that gives clinics the records, scheduling, and treatment tracking they need to act on it.
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
              <span style={{ color: 'var(--sg-accent)', fontWeight: 700 }}>✓ LIVE PRODUCT</span> • Works offline • Built for low-end phones
            </div>
          </motion.div>
        </div>
      </section>

      {/* Two audiences */}
      <section id="features" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="One Platform, Two Sides" title="Built for the People — and the Clinics Treating Them" alignment="left" maxWidth="760px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))', gap: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ padding: '2.25rem', border: '1px solid var(--color-border)', borderRadius: '16px', background: 'var(--bg-soft)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--sg-accent) 28%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Smartphone size={24} color="var(--sg-accent)" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-text-heading)' }}>For patients & community health workers</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--sg-accent)', fontWeight: 600, marginBottom: '1.25rem' }}>The mobile side</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['On-device heart rate detection via phone camera', 'AI-assisted basic skin scan analysis', 'Personal health history tracking and trends', 'Offline-first — works on low-end phones with no signal', 'WhatsApp alerts for follow-ups and reminders'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ padding: '2.25rem', border: '1px solid var(--color-border)', borderRadius: '16px', background: 'var(--bg-soft)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--sg-accent) 28%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Stethoscope size={24} color="var(--sg-accent)" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-text-heading)' }}>For clinics & providers</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--sg-accent)', fontWeight: 600, marginBottom: '1.25rem' }}>The practice-management side</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Complete patient profiles and medical history', 'Appointment scheduling and reminders', 'Treatment documentation with before/after photos', 'Consent tracking for sensitive records', 'Role-based access for staff'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '760px' }}>
            Both sides share the same data model — a reading or scan captured on a patient's phone can flow straight into their clinic record, with their consent.
          </p>
        </div>
      </section>

      {/* Why it works here */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Designed For Reality" title="Built for African Connectivity, Not Around It" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: WifiOff, title: 'Offline-first', desc: 'Core features work without a connection. Data syncs automatically once you\'re back online.' },
              { icon: Smartphone, title: 'Low-end hardware', desc: 'Runs on the phones people actually have, not just the newest devices.' },
              { icon: Users, title: 'Built for community health workers', desc: 'Designed around how CHWs actually work in the field, not a repurposed clinic tool.' },
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

      {/* Security */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Privacy" title="Data Handled with Care" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Clinical Features</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Complete patient medical records', 'Treatment documentation and photos', 'Automated appointment reminders', 'Before/after comparison tools'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Security Practices</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Data encrypted in transit and at rest', 'Explicit patient consent for record sharing', 'Audit logging for clinic access', 'Role-based access control'].map((item, i) => (
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

      {/* FAQ */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHeader label="Questions" title="Frequently Asked" alignment="center" />
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { q: 'How is patient data protected?', a: 'All data is encrypted in transit and at rest, access is role-based and logged, and record sharing between a patient and a clinic requires explicit consent.' },
              { q: 'Can I store before and after photos?', a: 'Yes. SANO Health supports secure photo storage linked to treatment records and outcomes.' },
              { q: 'How do I migrate existing patient records?', a: 'We provide data import tools and support for most systems. Migration timelines depend on the size and format of your existing data.' },
              { q: 'Can patients view their own records?', a: 'Yes. Patients can access their own health history and, with consent, share readings directly with their clinic.' },
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
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Ready to bring SANO Health to your community or clinic?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>Whether you're equipping community health workers or running a clinic, SANO Health scales to fit.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.75rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', cursor: 'pointer' }}>
            Schedule a Demo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
