import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Zap, TrendingUp, Users, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import PageLayout from '../components/layout/PageLayout'

export default function ServiceLandingPrototyping() {
  return (
    <PageLayout>

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: '1rem', color: 'var(--sg-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              For Startups
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              MVP & Rapid Prototyping
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
              Test your idea with real users before investing big. Affordable MVPs in 8-12 weeks. Perfect for startups raising funding.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                Start MVP <ArrowRight size={16} />
              </Link>
              <a href="#timeline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'color-mix(in srgb, var(--color-surface) 38%, transparent)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border-subtle)', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                Timeline
              </a>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', border: '1px solid color-mix(in srgb, var(--sg-accent) 22%, transparent)', borderRadius: 'var(--radius)', background: 'color-mix(in srgb, var(--sg-accent) 8%, transparent)', color: 'var(--color-text-secondary)', padding: '0.72rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
              <span style={{ color: 'var(--sg-accent)', fontWeight: 700 }}>✓ 8-12 WEEK TIMELINE</span> • Affordable pricing • Investor-ready
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="MVP Types" title="What We Prototype" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: Users, title: 'Marketplace MVPs', desc: 'Buy/sell platform prototype. Test product-market fit before full development.' },
              { icon: TrendingUp, title: 'SaaS MVPs', desc: 'Business software prototype. Validate problem before building full product.' },
              { icon: Lightbulb, title: 'Service Platforms', desc: 'Uber-like prototype. Test demand and operations before scaling.' },
              { icon: Zap, title: 'Mobile App MVPs', desc: 'App prototype for iOS/Android. Test user behavior before full app.' },
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

      <section id="timeline" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Speed" title="MVP Timeline" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: '1.5rem' }}>
              {[
                { phase: 'Weeks 1-2', title: 'Research & Design', desc: 'Validate idea, design MVP scope' },
                { phase: 'Weeks 3-6', title: 'Development', desc: 'Build core features' },
                { phase: 'Weeks 7-8', title: 'Testing & Refinement', desc: 'Test with early users, iterate' },
                { phase: 'Weeks 9-12', title: 'Launch & Feedback', desc: 'Release, gather feedback, iterate' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--glass-bg)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sg-accent)', marginBottom: '0.5rem' }}>{item.phase}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Features" title="MVP Includes" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Core Development</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Focused feature set', 'Responsive design', 'User authentication', 'Payment integration', 'Basic analytics'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Support</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Launch guidance', '3-month support', 'User feedback tools', 'Analytics setup', 'Scaling roadmap'].map((item, i) => (
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

      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHeader label="Questions" title="MVP FAQ" alignment="center" />
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { q: 'What\'s included in an MVP?', a: 'Core features to test your idea. Payment integration, user auth, analytics. Everything needed to launch and gather feedback.' },
              { q: 'How much does an MVP cost?', a: 'Affordable: GHS 15,000-40,000 for web MVP. GHS 20,000-50,000 for app MVP. Based on complexity.' },
              { q: 'Can I raise funding with an MVP?', a: 'Yes. Investors love seeing working product and real user feedback. We help you prepare investor materials.' },
              { q: 'What happens after MVP launch?', a: 'We help you gather feedback, measure metrics, and plan next features. You decide whether to scale or pivot.' },
              { q: 'Can you help beyond the MVP?', a: 'Yes. Many startups evolve their MVP into full product. We provide scaling roadmap and ongoing development.' },
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
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Ready to Test Your Startup Idea?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>Let's build an MVP that validates your idea. Free consultation to discuss scope and timeline.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.75rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', cursor: 'pointer' }}>
            Start MVP Project <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
