import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Users, Zap, BarChart3, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import PageLayout from '../components/layout/PageLayout'

export default function ServiceLandingSaasDevelopment() {
  return (
    <PageLayout>

      {/* Hero */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: '1rem', color: 'var(--sg-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              SaaS Product Development
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Launch Your SaaS Product Faster
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
              We build multi-tenant SaaS platforms designed for scale. From idea to market launch, we handle architecture, subscription management, analytics, and compliance. Let us turn your idea into a profitable business.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                Launch Your SaaS <ArrowRight size={16} />
              </Link>
              <a href="#services" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'color-mix(in srgb, var(--color-surface) 38%, transparent)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border-subtle)', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                See Our SaaS
              </a>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', border: '1px solid color-mix(in srgb, var(--sg-accent) 22%, transparent)', borderRadius: 'var(--radius)', background: 'color-mix(in srgb, var(--sg-accent) 8%, transparent)', color: 'var(--color-text-secondary)', padding: '0.72rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
              <span style={{ color: 'var(--sg-accent)', fontWeight: 700 }}>✓ 3 ACTIVE SAAS PRODUCTS</span> • Nexus-HRM • CargoScan • SANO
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why SaaS */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="The Opportunity" title="Why SaaS Is the Right Model" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: TrendingUp, title: 'Recurring Revenue', desc: 'Predictable, scalable revenue from subscriptions. No feast-or-famine sales cycles. Grow your MRR methodically.' },
              { icon: Globe, title: 'Global Reach, Local Costs', desc: 'Serve customers worldwide from one platform. Your marginal cost per user approaches zero. Scale without proportional overhead.' },
              { icon: Users, title: 'Customer Relationships', desc: 'Continuous engagement with your users. Gather feedback, iterate fast, build loyalty. Your product improves every month.' },
              { icon: BarChart3, title: 'Data-Driven Growth', desc: 'Built-in analytics show user behavior, feature adoption, churn patterns. Optimize based on real data.' },
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

      {/* Services */}
      <section id="services" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="What We Build" title="Complete SaaS Solutions" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: Zap, title: 'MVP to Market', desc: 'Validate your idea quickly with a focused MVP. Launch in 8-12 weeks. Gather real customer feedback before investing further.' },
              { icon: Users, title: 'Multi-Tenant Architecture', desc: 'Secure, scalable platform supporting thousands of customers. Data isolation, role-based access, audit trails built-in.' },
              { icon: BarChart3, title: 'Subscription Management', desc: 'Billing, invoicing, recurring charges. Stripe/Paystack integration. Handle free trials, upgrades, downgrades, cancellations.' },
              { icon: TrendingUp, title: 'Analytics Dashboard', desc: 'Track MRR, churn, user retention, feature adoption. Export reports. Know your business metrics in real-time.' },
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

      {/* Why Us */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Our Edge" title="Why Choose Stormglide for SaaS" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            {[
              { title: 'We Build & Operate', desc: 'We don\'t just hand off code. We deploy, monitor, and optimize. Your success is our success. We care about uptime and performance.' },
              { title: 'Proven SaaS Track Record', desc: 'We\'ve built and run live SaaS products, including Nexus HRM, CargoScan, and SANO Health. We know what works: scalability, reliability, user retention.' },
              { title: 'Security by Default', desc: 'Encrypted data storage, role-based access control, and privacy-conscious data handling. Compliance built in from day one, scoped to your requirements.' },
              { title: 'Fast Iteration', desc: 'Ship MVPs in weeks, not months. Iterate based on user feedback. Move fast, break nothing.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '1.5rem 2rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--bg-soft)' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>{item.title}</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Architecture" title="SaaS-Grade Technology" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { cat: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'] },
              { cat: 'Backend', items: ['Node.js', 'PostgreSQL', 'Prisma', 'NestJS'] },
              { cat: 'Payments', items: ['Stripe', 'Paystack', 'Recurring billing', 'Invoicing'] },
              { cat: 'Infra', items: ['Vercel', 'AWS', 'Docker', 'GitHub Actions'] },
            ].map((group, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '14px', background: 'var(--glass-bg)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--sg-accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{group.cat}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {group.items.map((item, j) => (
                    <span key={j} style={{ padding: '0.4rem 0.8rem', background: 'color-mix(in srgb, var(--sg-accent) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--sg-accent) 22%, transparent)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{item}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem', background: 'linear-gradient(135deg, color-mix(in srgb, var(--sg-accent) 8%, transparent) 0%, color-mix(in srgb, var(--sg-accent) 4%, transparent) 100%)', border: '1px solid color-mix(in srgb, var(--sg-accent) 22%, transparent)', borderRadius: '20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Ready to Launch Your SaaS?</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>Let's validate your idea, build your MVP, and scale to profitability. From concept to customers in months, not years.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
            Discuss Your Idea <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </PageLayout>
  )
}
