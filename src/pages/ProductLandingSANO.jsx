import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, CheckCircle, Heart, Users, TrendingUp, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import PageLayout from '../components/layout/PageLayout'

export default function SANOLanding() {
  return (
    <PageLayout>
      <Helmet>
        <title>SANO Health: Healthcare & Skincare Management Platform</title>
        <meta name="description" content="SANO Health is a production-grade platform for dermatology clinics and skincare providers across Africa. Patient management, appointment scheduling, treatment tracking, and outcome analytics. Live since 2023." />
        <meta name="keywords" content="healthcare software, skincare management, patient management, dermatology software, clinic management, healthcare platform" />
        <meta property="og:title" content="SANO Health - Healthcare Platform" />
        <meta property="og:description" content="Modern healthcare and skincare management for African clinics" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: '1rem', color: 'var(--sg-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Healthcare & Skincare Management
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              SANO Health
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
              Production-grade healthcare platform for dermatology clinics and skincare providers. Patient management, appointment scheduling, treatment tracking, and outcome analytics. Live since 2023. Serving 20+ clinics across Africa.
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
              <span style={{ color: 'var(--sg-accent)', fontWeight: 700 }}>✓ LIVE PRODUCT</span> • 20+ clinics • HIPAA-compliant
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Core Capabilities" title="What SANO Health Does" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: Users, title: 'Patient Management', desc: 'Complete patient profiles, medical history, treatment plans, and consent tracking' },
              { icon: Heart, title: 'Treatment Tracking', desc: 'Document procedures, before/after photos, outcomes, and follow-up schedules' },
              { icon: TrendingUp, title: 'Outcome Analytics', desc: 'Track treatment success rates, patient satisfaction, and clinic performance metrics' },
              { icon: Shield, title: 'Data Security & Compliance', desc: 'HIPAA-compliant, end-to-end encryption, audit logs, and data residency options' },
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

      {/* Results / Impact */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Real Results" title="Impact for Our Customers" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { number: '20+', label: 'Active clinics and providers' },
              { number: '40h/month', label: 'Saved per clinic on admin work' },
              { number: '95%', label: 'Patient satisfaction rating' },
              { number: '6 countries', label: 'Operating across Africa' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, color: 'var(--sg-accent)', marginBottom: '0.5rem' }}>{item.number}</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Technology" title="Built for Healthcare Excellence" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Clinical Features</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Complete patient medical records', 'Treatment documentation and photos', 'Outcome tracking and analytics', 'Automated appointment reminders', 'Before/after comparison tools'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Security & Compliance</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['HIPAA-compliant and encrypted', 'Patient consent management', 'Audit logging for compliance', 'Data residency and backup options', 'Role-based access control'].map((item, i) => (
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
              { q: 'Is SANO Health HIPAA compliant?', a: 'Yes. SANO Health meets HIPAA, GDPR, and African data protection standards. All patient data is encrypted in transit and at rest.' },
              { q: 'Can I store before and after photos?', a: 'Yes. SANO Health supports high-resolution photo storage with secure cloud backup. Photos are linked to treatment records and outcomes.' },
              { q: 'How do I migrate patient records?', a: 'We provide data import tools and support for most healthcare systems. Typical migration takes 2-4 weeks including data cleansing.' },
              { q: 'Can patients view their own records?', a: 'Yes. Patients can access a secure patient portal to view appointments, treatment history, and before/after photos (with consent).' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--color-background)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-heading)' }}>{item.q}</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0 }}>{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--color-background)', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Ready to digitize your clinic?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>Join 20+ clinics using SANO Health for patient management, treatment tracking, and outcome analytics.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.75rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', cursor: 'pointer' }}>
            Schedule a Demo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
