import { motion } from 'framer-motion'
import { caseStudies } from '../../data/caseStudies'
import CaseStudyCard from '../common/CaseStudyCard'
import SectionHeader from '../common/SectionHeader'

export default function FeaturedWork() {
  // SaaS products we own - these get LIVE PRODUCT badges
  const SAAS_PRODUCT_IDS = ['cargoscan', 'sano', 'hrm-system']
  const productStudies = caseStudies.filter(s => SAAS_PRODUCT_IDS.includes(s.id))
  const customStudies = caseStudies.filter(s => !SAAS_PRODUCT_IDS.includes(s.id))

  return (
    <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeader
          label="REAL PRODUCTS"
          title="Systems We've Built"
          description="Our SaaS products in production, plus custom solutions we've delivered for ambitious businesses."
          alignment="left"
          maxWidth="700px"
        />

        {/* SAAS PRODUCTS IN PRODUCTION */}
        {productStudies.length > 0 && (
          <div style={{ marginTop: '5rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '1rem' }}>
                Our SaaS Products in Production
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--ink-400)', marginBottom: '3rem', maxWidth: '600px' }}>
                These are the software products we own and operate. Serving 100+ customers, generating recurring revenue, and continuously improving.
              </p>
            </motion.div>

            <div className="sg-case-grid">
              {productStudies.map((study, idx) => (
                <div key={study.id} className="sg-case-grid-item">
                  <CaseStudyCard
                    title={study.title}
                    industry={study.industry}
                    problem={study.problem}
                    solution={study.solution}
                    outcome={study.outcome}
                    features={study.features}
                    technologies={study.technologies}
                    demoUrl={study.demoUrl}
                    caseStudyUrl={`/case-studies/${study.id}`}
                    color={study.color}
                    delay={idx * 0.08}
                    badge="LIVE PRODUCT"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOM SOLUTIONS */}
        {customStudies.length > 0 && (
          <div style={{ marginTop: '5rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '1rem' }}>
                Custom Solutions We've Delivered
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--ink-400)', marginBottom: '3rem', maxWidth: '600px' }}>
                Beyond our products, we've built custom business software, healthcare systems, and e-commerce platforms tailored to specific company needs.
              </p>
            </motion.div>

            <div className="sg-case-grid">
              {customStudies.map((study, idx) => (
                <div key={study.id} className="sg-case-grid-item">
                  <CaseStudyCard
                    title={study.title}
                    industry={study.industry}
                    problem={study.problem}
                    solution={study.solution}
                    outcome={study.outcome}
                    features={study.features}
                    technologies={study.technologies}
                    demoUrl={study.demoUrl}
                    caseStudyUrl={`/case-studies/${study.id}`}
                    color={study.color}
                    delay={idx * 0.08}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .sg-case-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }

        @media (max-width: 920px) {
          .sg-case-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-padding: 0 2rem;
            gap: 1.5rem;
            padding-bottom: 2rem;
            margin: 0 -2rem;
            padding-left: 2rem;
            padding-right: 2rem;
            scrollbar-width: none;
          }
          .sg-case-grid::-webkit-scrollbar {
            display: none;
          }

          .sg-case-grid-item {
            scroll-snap-align: center;
            flex: 0 0 85%;
            min-width: 0;
          }
        }
      `}</style>
    </section>
  )
}
