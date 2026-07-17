import { motion } from 'framer-motion'
import { ArrowRight, Palette, Eye, Smartphone, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import PageLayout from '../components/layout/PageLayout'

export default function ServiceLandingDesign() {
  return (
    <PageLayout>

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: '1rem', color: 'var(--sg-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Design for Impact
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              UI/UX & Brand Design
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
              Design that converts. Beautiful, user-centered designs for websites, apps, and brands. Every design tested with real users.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                Start Design Project <ArrowRight size={16} />
              </Link>
              <a href="#services" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'color-mix(in srgb, var(--color-surface) 38%, transparent)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border-subtle)', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                See Work
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Design Services" title="What We Design" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: Eye, title: 'UI/UX Design', desc: 'App and website interfaces designed for users. Wireframes, mockups, interactive prototypes. User-tested designs.' },
              { icon: Palette, title: 'Brand Design', desc: 'Logo, color palette, typography, brand guidelines. Complete visual identity for your business.' },
              { icon: Smartphone, title: 'App UI Design', desc: 'Mobile app interfaces for iOS and Android. User flows, interaction design, responsive layouts.' },
              { icon: Zap, title: 'Design Systems', desc: 'Reusable components and patterns for consistency. Scales with your growing product.' },
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
          <SectionHeader label="Process" title="How We Design" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { num: '1', title: 'Research', desc: 'Understand your users, competitors, market' },
              { num: '2', title: 'Strategy', desc: 'Define design goals and user flows' },
              { num: '3', title: 'Wireframes', desc: 'Create low-fidelity layouts' },
              { num: '4', title: 'Design', desc: 'Build high-fidelity mockups with branding' },
              { num: '5', title: 'Testing', desc: 'Test with real users, iterate' },
              { num: '6', title: 'Handoff', desc: 'Deliver designs and design system' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--glass-bg)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--sg-accent)', marginBottom: '0.5rem' }}>{item.num}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHeader label="Questions" title="Design FAQ" alignment="center" />
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { q: 'How long does design take?', a: 'Logo/branding: 2-3 weeks. Website design: 3-4 weeks. App design: 4-6 weeks. We work in sprints so you see progress regularly.' },
              { q: 'Do I get source files?', a: 'Yes. You get all design files (Figma), design system, and handoff documentation so your developers can build it.' },
              { q: 'Can you test designs with users?', a: 'Yes. We conduct user testing to validate designs before development starts. This prevents costly revisions later.' },
              { q: 'How many revisions?', a: 'Typically 2-3 revision rounds included. Additional revisions are billed separately.' },
              { q: 'What if I need changes after design?', a: 'We provide documentation and design system so changes are easy. We can also help with future design needs.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--bg-soft)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-heading)' }}>{item.q}</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0 }}>{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Ready to Design Your Brand?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>Let's create something beautiful. Free consultation to discuss your vision and design needs.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.75rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', cursor: 'pointer' }}>
            Start Design Project <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
