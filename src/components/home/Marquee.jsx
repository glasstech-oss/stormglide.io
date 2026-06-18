import { Stethoscope, GraduationCap, UtensilsCrossed, ShoppingCart, Truck, Hotel, Pill, Home as HomeIcon, Church, Factory, Package, Scissors, Users, Scale, Bot, Receipt, BarChart3, Settings, Ship, Wrench, CalendarCheck, Globe2 } from 'lucide-react'

const ROW1 = [
  { label: 'Dental & Hospital Systems', Icon: Stethoscope,    color: 'var(--color-accent-blue)' },
  { label: 'School Management',         Icon: GraduationCap,  color: 'var(--sg-accent)' },
  { label: 'Restaurant & POS',          Icon: UtensilsCrossed,color: 'var(--color-danger)' },
  { label: 'E-commerce Platforms',      Icon: ShoppingCart,   color: 'var(--color-success)' },
  { label: 'Logistics & Fleet',         Icon: Truck,          color: 'var(--color-warning)' },
  { label: 'Hotel & Hospitality',       Icon: Hotel,          color: 'var(--color-success)' },
  { label: 'Clinic & Pharmacy',         Icon: Pill,           color: 'var(--color-success)' },
  { label: 'Real Estate CRM',           Icon: HomeIcon,       color: 'var(--color-success)' },
  { label: 'Church & NGO Management',   Icon: Church,         color: 'var(--color-warning)' },
  { label: 'Manufacturing Systems',     Icon: Factory,        color: 'var(--color-accent-violet)' },
  { label: 'Wholesale Distribution',    Icon: Package,        color: 'var(--color-accent-coral)' },
  { label: 'Salon & Spa Booking',       Icon: Scissors,       color: '#EC4899' },
]

const ROW2 = [
  { label: 'HR & Payroll',              Icon: Users,          color: 'var(--color-accent-blue)' },
  { label: 'Legal Case Management',     Icon: Scale,          color: 'var(--color-accent-violet)' },
  { label: 'AI & Automation',           Icon: Bot,            color: 'var(--color-accent-coral)' },
  { label: 'Invoicing & Finance',       Icon: Receipt,        color: 'var(--sg-accent)' },
  { label: 'Patient Management',        Icon: Stethoscope,    color: 'var(--color-success)' },
  { label: 'Inventory Systems',         Icon: BarChart3,      color: 'var(--color-warning)' },
  { label: 'Custom Admin Backoffice',   Icon: Settings,       color: 'var(--color-success)' },
  { label: 'Freight & CBM Tools',       Icon: Ship,           color: 'var(--color-accent-blue)' },
  { label: 'Church Giving & Members',   Icon: Church,         color: 'var(--color-warning)' },
  { label: 'Production Management',     Icon: Wrench,         color: 'var(--color-accent-violet)' },
  { label: 'Online Booking Systems',    Icon: CalendarCheck,  color: 'var(--color-danger)' },
  { label: 'Multi-Branch Operations',   Icon: Globe2,         color: 'var(--color-success)' },
]

function MarqueeRow({ items, direction = 'left', speed = 40 }) {
  const all = [...items, ...items, ...items]
  const dur = `${speed}s`
  const anim = direction === 'left' ? 'marqueeLeft' : 'marqueeRight'

  return (
    <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
      <div style={{
        display: 'flex', gap: '0.75rem',
        animation: `${anim} ${dur} linear infinite`,
        width: 'max-content',
      }}>
        {all.map((item, i) => (
          <div key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.45rem 1rem',
            background: `${item.color}10`,
            border: `1.5px solid ${item.color}28`,
            borderRadius: '99px',
            flexShrink: 0,
          }}>
            <item.Icon size={13} color={item.color} strokeWidth={2} />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.78rem',
              fontWeight: 600, color: item.color,
              letterSpacing: '-0.01em', whiteSpace: 'nowrap',
            }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  return (
    <div style={{
      padding: '1.5rem 0',
      background: 'var(--bg-soft)',
      borderTop: '1px solid var(--ink-100)',
      borderBottom: '1px solid var(--ink-100)',
      display: 'flex', flexDirection: 'column', gap: '0.625rem',
      overflow: 'hidden',
      maxWidth: '100vw',
      contain: 'paint',
    }}>
      <MarqueeRow items={ROW1} direction="left"  speed={50} />
      <MarqueeRow items={ROW2} direction="right" speed={42} />

      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @keyframes marqueeRight {
          0%   { transform: translateX(calc(-100% / 3)); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
