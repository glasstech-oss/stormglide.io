import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Grid3X3, UtensilsCrossed, X } from 'lucide-react'

const CATEGORIES = {
  Glass: {
    icon: Layers,
    color: 'var(--color-accent-cyan)',
    products: [
      { name: 'Float Glass 4mm', spec: 'Clear · 2440×1220mm · 4mm' },
      { name: 'Tempered Glass 10mm', spec: 'Clear · 2440×1220mm · 10mm' },
      { name: 'Laminated Glass 8mm', spec: 'Safety · 2440×1220mm · 8mm' },
      { name: 'Reflective Glass 6mm', spec: 'Bronze · 2440×1220mm · 6mm' },
      { name: 'Frosted Glass 5mm', spec: 'Sandblasted · custom sizes' },
      { name: 'Wired Glass 6mm', spec: 'Fire rated · 1830×1220mm' },
    ],
  },
  Aluminum: {
    icon: Grid3X3,
    color: 'var(--color-accent-violet)',
    products: [
      { name: 'Casement Window Frame', spec: 'Anodized · 50mm series' },
      { name: 'Sliding Door Frame', spec: 'Mill finish · 100mm series' },
      { name: 'Curtain Wall System', spec: 'Thermal break · 65mm' },
      { name: 'Louvre Frame', spec: 'Powder coated · 100mm' },
      { name: 'Partition System', spec: 'Anodized · 100mm series' },
      { name: 'Shopfront Frame', spec: 'Mill finish · 125mm series' },
    ],
  },
  'Kitchen Cabinets': {
    icon: UtensilsCrossed,
    color: 'var(--color-accent-gold)',
    products: [
      { name: 'Base Cabinet 600mm', spec: 'MDF · Gloss white finish' },
      { name: 'Wall Cabinet 300mm', spec: 'MDF · Various colors' },
      { name: 'Tall Pantry Unit', spec: 'Melamine · 600×2100mm' },
      { name: 'Corner Cabinet', spec: 'Soft close hinges · 900mm' },
      { name: 'Drawer Base Unit', spec: '3-drawer · Soft close' },
      { name: 'Island Unit', spec: 'Custom · Marble top option' },
    ],
  },
}

function QuoteModal({ product, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, background: 'rgba(5,10,24,0.9)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', padding: '1.5rem', width: '100%', maxWidth: '320px', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={16} /></button>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</div>
            <p style={{ color: 'var(--color-success)', fontSize: '0.85rem' }}>Quote request sent!</p>
          </div>
        ) : (
          <>
            <div style={{ fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Request Quote</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginBottom: '1rem' }}>{product}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }} />
              <input className="input" placeholder="Phone number" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }} />
              <textarea className="input" placeholder="Message (optional)" rows={2} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', resize: 'none' }} />
              <button className="btn-primary" style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }} onClick={() => setSent(true)}>Send Request</button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function GlasstechDemo() {
  const [cat, setCat] = useState('Glass')
  const [quoteProduct, setQuoteProduct] = useState(null)
  const { icon: CatIcon, color, products } = CATEGORIES[cat]

  return (
    <div style={{ padding: '1.25rem', background: '#07101C', minHeight: '420px', fontFamily: 'var(--font-body)', fontSize: '0.85rem', position: 'relative' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-heading)', marginBottom: '1rem' }}>Glasstech Fabrications</div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {Object.entries(CATEGORIES).map(([name, { icon: Icon, color: c }]) => (
          <button key={name} onClick={() => setCat(name)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', background: cat === name ? `${c}15` : 'none', border: `1px solid ${cat === name ? c : 'var(--color-border-subtle)'}`, borderRadius: '8px', color: cat === name ? c : 'var(--color-text-secondary)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            <Icon size={12} /> {name}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
        {products.map(p => (
          <div key={p.name} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
            <div style={{ height: 72, background: `linear-gradient(135deg, ${color}15, ${color}05)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CatIcon size={24} color={color} opacity={0.6} />
            </div>
            <div style={{ padding: '0.625rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>{p.name}</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.65rem', marginBottom: '0.625rem' }}>{p.spec}</div>
              <button onClick={() => setQuoteProduct(p.name)} style={{ width: '100%', padding: '0.3rem', background: `${color}10`, border: `1px solid ${color}30`, borderRadius: '6px', color, fontSize: '0.65rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Request Quote
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {quoteProduct && <QuoteModal product={quoteProduct} onClose={() => setQuoteProduct(null)} />}
      </AnimatePresence>
    </div>
  )
}
