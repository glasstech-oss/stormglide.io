import { motion } from 'framer-motion'
import { ArrowRight, Code, Zap, Users, TrendingUp, Smartphone, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import PageLayout from '../components/layout/PageLayout'

export default function ServiceLandingSoftwareDevelopment() {
  return (
    <PageLayout>

      {/* Hero */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: '1rem', color: 'var(--sg-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Custom Software Development
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Build Reliable Software That Scales
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
              We design, build, and operate custom software products that grow with your business. From web applications to SaaS platforms, we create technology that works reliably at scale. Based in Accra, serving Africa and beyond.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                Start Your Project <ArrowRight size={16} />
              </Link>
              <a href="#services" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'color-mix(in srgb, var(--color-surface) 38%, transparent)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border-subtle)', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                View Our Work
              </a>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', border: '1px solid color-mix(in srgb, var(--sg-accent) 22%, transparent)', borderRadius: 'var(--radius)', background: 'color-mix(in srgb, var(--sg-accent) 8%, transparent)', color: 'var(--color-text-secondary)', padding: '0.72rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
              <span style={{ color: 'var(--sg-accent)', fontWeight: 700 }}>✓ REAL PRODUCTS IN PRODUCTION</span> • Nexus HRM • CargoScan • SANO Health
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Custom Software */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="The Challenge" title="Why Off-the-Shelf Solutions Fall Short" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: Code, title: 'Generic Platforms Limit Growth', desc: 'Premade tools constrain what you can do. Custom software adapts to your unique workflows and competitive advantage.' },
              { icon: Zap, title: 'Performance & Reliability Matter', desc: 'Off-the-shelf solutions struggle under load. Custom-built systems scale efficiently without vendor lock-in.' },
              { icon: Lock, title: 'Data Security & Control', desc: 'Your data on third-party servers means compliance risks and limited control. Custom software gives you full sovereignty.' },
              { icon: TrendingUp, title: 'Integration Headaches', desc: 'Connecting disparate tools is expensive and fragile. Custom systems integrate seamlessly with your entire tech stack.' },
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
          <SectionHeader label="What We Build" title="Our Software Development Services" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: Code, title: 'Web Applications', desc: 'Full-stack web apps built with modern frameworks (React, Next.js, Vue). Real-time features, complex workflows, enterprise-grade reliability.' },
              { icon: Smartphone, title: 'Mobile Applications', desc: 'Native iOS/Android or cross-platform apps. Fast, responsive, offline-capable. Seamless API integration with your backend systems.' },
              { icon: TrendingUp, title: 'SaaS Platforms', desc: 'Multi-tenant SaaS products with subscription management, analytics dashboards, and automated workflows. Scalable architecture for growth.' },
              { icon: Users, title: 'Business Systems', desc: 'ERP, CRM, inventory, and operations systems tailored to your industry. Replaces fragmented tools with unified, integrated solutions.' },
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

      {/* Process */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Our Approach" title="How We Build Software" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { num: '01', title: 'Discovery', desc: 'Understand your business, users, and constraints. Define clear requirements and success metrics.' },
              { num: '02', title: 'Design', desc: 'Create intuitive interfaces and scalable architecture. Get stakeholder alignment before building.' },
              { num: '03', title: 'Build', desc: 'Develop incrementally with regular demos. Iterate based on feedback. Ship working software continuously.' },
              { num: '04', title: 'Operate', desc: 'Deploy, monitor, and optimize. We stay involved post-launch for fixes, improvements, and scaling.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '14px', background: 'var(--bg-soft)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--sg-accent)', marginBottom: '1rem' }}>{item.num}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Technology" title="Modern Stack, Battle-Tested Tools" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { cat: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'] },
              { cat: 'Backend', items: ['Node.js', 'Python', 'Express', 'NestJS', 'FastAPI'] },
              { cat: 'Database', items: ['PostgreSQL', 'MongoDB', 'Firebase', 'Redis', 'Supabase'] },
              { cat: 'DevOps', items: ['Docker', 'Vercel', 'AWS', 'GitHub Actions', 'CI/CD'] },
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
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Ready to Build Your Software?</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>Let's discuss your project, timeline, and vision. We'll create a custom proposal tailored to your needs.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
            Start a Conversation <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </PageLayout>
  )
}
