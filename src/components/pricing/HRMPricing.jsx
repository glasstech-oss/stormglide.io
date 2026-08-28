import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

export default function HRMPricing() {
  const [activeTab, setActiveTab] = useState('tiers');
  const [headcount, setHeadcount] = useState(50);

  const tiers = [
    {
      name: 'Starter',
      price: '$6,500',
      period: '/ year',
      included: 'Up to 25 employees',
      setup: '$1,200 one-time setup',
      description: 'The full HR foundation for small teams.',
      features: [
        'Employee profiles & digital signing',
        'Leave management & certificates',
        'Attendance & web/kiosk clock-in',
        'Holiday calendar & policy library',
        'Security, daily backups & SSL',
      ]
    },
    {
      name: 'Advance',
      price: '$8,900',
      period: '/ year',
      included: 'Up to 40 employees',
      setup: '$2,200 one-time setup',
      recommended: true,
      description: 'Operational automation for growing companies.',
      features: [
        'Everything in Starter',
        'Ghana GRA PAYE & SSNIT payroll',
        'Onboarding & offboarding checklists',
        'Asset & IT equipment tracking',
        'KPIs & goal setting',
        'IT/HR/Finance helpdesk with SLA'
      ]
    },
    {
      name: 'Pro',
      price: '$12,000',
      period: '/ year',
      included: 'Up to 60 employees',
      setup: 'From $3,500 one-time setup',
      description: 'Full governance and compliance tooling.',
      features: [
        'Everything in Advance',
        '360° appraisals & calibration',
        'Audit logs & disciplinary workflows',
        'Multi-branch / sub-unit routing',
        'Enterprise reporting & predictive analytics',
        'Priority 4h Support & Dedicated Manager'
      ]
    }
  ];

  const addons = [
    { title: 'Biometric hardware integration', price: '$750 - $1,200', desc: 'Real-time sync connector for ZKTeco, Anviz, Suprema.' },
    { title: 'Custom bank payroll export', price: '$400 / format', desc: 'Electronic payroll upload files for Ecobank, GCB, Stanbic, etc.' },
    { title: 'SMS & WhatsApp enterprise alerts', price: '$500 setup + usage', desc: 'Gateway integration for automated payslip and leave notifications.' },
    { title: 'ERP & accounting sync', price: '$1,500 - $3,500', desc: 'Bi-directional general ledger sync with QuickBooks, Xero, SAP.' },
    { title: 'Custom ID card & badge printing', price: '$300 - $600', desc: 'Double-sided badge layout design, barcode/NFC encoding.' },
    { title: 'Custom appraisal models', price: '$800 - $1,800', desc: 'Tailored 9-box grid, project-based scoring formulas.' }
  ];

  const calculateOverage = (count, tierIncluded) => {
    if (count <= tierIncluded) return 0;
    let extra = count - tierIncluded;
    let cost = 0;
    
    // 0-100 extra: $30
    let tier1 = Math.min(extra, 100);
    cost += tier1 * 30;
    extra -= tier1;
    
    if (extra > 0) {
      // 101-250 extra: $26
      let tier2 = Math.min(extra, 150);
      cost += tier2 * 26;
      extra -= tier2;
    }
    
    if (extra > 0) {
      // 251-500 extra: $22
      let tier3 = Math.min(extra, 250);
      cost += tier3 * 22;
      extra -= tier3;
    }
    
    if (extra > 0) {
      // 500+ extra: $18
      cost += extra * 18;
    }
    
    return cost;
  };

  return (
    <section id="pricing" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeader 
          label="Pricing Schedule" 
          title="Transparent, predictable pricing" 
          alignment="center" 
        />
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
          Priced by what you actually need. Choose a foundation tier, and seamlessly scale as your headcount grows.
        </p>

        {/* Custom Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--glass-bg)', padding: '0.4rem', borderRadius: '999px', border: '1px solid var(--color-border)' }}>
            {['tiers', 'calculator', 'addons'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: activeTab === tab ? 'var(--sg-accent)' : 'transparent',
                  color: activeTab === tab ? 'var(--color-background)' : 'var(--color-text-secondary)',
                  fontWeight: activeTab === tab ? 700 : 500,
                  fontSize: '0.9rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab === 'tiers' ? 'Subscription Tiers' : tab === 'calculator' ? 'Headcount Calculator' : 'Setup & Add-ons'}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          
          {activeTab === 'tiers' && (
            <motion.div 
              key="tiers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
            >
              {tiers.map((tier, i) => (
                <div 
                  key={i} 
                  style={{ 
                    background: 'var(--color-surface)', 
                    border: `1px solid ${tier.recommended ? 'var(--sg-accent)' : 'var(--color-border)'}`, 
                    borderRadius: '24px', 
                    padding: '2.5rem 2rem',
                    position: 'relative',
                    boxShadow: tier.recommended ? '0 12px 40px -12px color-mix(in srgb, var(--sg-accent) 25%, transparent)' : 'none',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {tier.recommended && (
                    <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--sg-accent)', color: 'var(--color-background)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Recommended
                    </div>
                  )}
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-heading)', margin: 0 }}>{tier.name}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', minHeight: '44px', marginTop: '0.5rem', marginBottom: '1.5rem' }}>{tier.description}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-heading)', letterSpacing: '-0.03em' }}>{tier.price}</span>
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{tier.period}</span>
                  </div>
                  
                  <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-heading)', fontWeight: 600, marginBottom: '0.5rem' }}>
                      <UsersIcon size={16} color="var(--sg-accent)" /> {tier.included}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      <SetupIcon size={16} /> {tier.setup}
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
                    {tier.features.map((feat, j) => (
                      <li key={j} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ marginTop: '3px', background: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)', borderRadius: '50%', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={12} strokeWidth={3} color="var(--sg-accent)" />
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-heading)', lineHeight: 1.4 }}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'calculator' && (
            <motion.div 
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '3rem' }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Headcount Scaling</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                Additional employees beyond a tier's included headcount are billed annually in advance, at a declining per-employee rate as your workforce grows.
              </p>

              <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                  <label style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>Total Employees</label>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--sg-accent)' }}>{headcount}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="1000" 
                  value={headcount} 
                  onChange={(e) => setHeadcount(parseInt(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--sg-accent)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                  <span>1</span>
                  <span>1,000+</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-soft)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--color-border-subtle)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>Annual Estimate by Tier</h4>
                
                {[
                  { name: 'Starter', base: 6500, included: 25 },
                  { name: 'Advance', base: 8900, included: 40 },
                  { name: 'Pro', base: 12000, included: 60 }
                ].map((t) => {
                  const overage = calculateOverage(headcount, t.included);
                  const total = t.base + overage;
                  const perEmployee = (total / headcount).toFixed(2);
                  return (
                    <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: t.name !== 'Pro' ? '1px solid var(--color-border-subtle)' : 'none' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--color-text-heading)', fontSize: '1.05rem' }}>{t.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                          Base + {headcount > t.included ? `${headcount - t.included} extra employees` : 'Fully covered'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: 'var(--color-text-heading)', fontSize: '1.15rem' }}>${total.toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>/ yr</span></div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--sg-accent)', fontWeight: 600 }}>≈ ${perEmployee} / emp / yr</div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </motion.div>
          )}

          {activeTab === 'addons' && (
            <motion.div 
              key="addons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: '1000px', margin: '0 auto' }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--color-text-heading)', textAlign: 'center' }}>Custom Features & Integrations</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {addons.map((addon, i) => (
                  <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-heading)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>{addon.title}</div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem', flexGrow: 1 }}>{addon.desc}</p>
                    <div style={{ display: 'inline-block', alignSelf: 'flex-start', background: 'var(--bg-soft)', color: 'var(--color-text-heading)', fontWeight: 600, fontSize: '0.85rem', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border-subtle)' }}>
                      {addon.price}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '3rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>Dedicated Private Cloud</h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', margin: 0 }}>Isolated cloud instance or full local server installation for stringent data sovereignty requirements.</p>
                </div>
                <div style={{ background: 'color-mix(in srgb, var(--sg-accent) 10%, transparent)', color: 'var(--sg-accent)', fontWeight: 800, padding: '1rem 1.5rem', borderRadius: '12px', fontSize: '1.1rem' }}>
                  $5,000 – $10,000
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <a href="/downloads/Stormglide - HRM Pricing Schedule.pdf" download style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', textDecoration: 'none', borderBottom: '1px solid var(--color-border)' }}>
            <Info size={16} />
            Download official pricing schedule (PDF)
          </a>
        </div>

      </div>
    </section>
  );
}

// Simple icons to avoid additional lucide imports
function UsersIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SetupIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14.7 13.5 5.5 5.5c.8.8.8 2.1 0 2.9-.8.8-2.1.8-2.9 0l-5.5-5.5" />
      <circle cx="9" cy="9" r="6" />
      <path d="m10.5 10.5-2-2" />
    </svg>
  );
}
