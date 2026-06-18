import { useState } from 'react'
import { Factory, Package, Settings } from 'lucide-react'

const orders = [
  { id: 'PO-2410', product: 'Aluminum Sheets 2mm', qty: 500, status: 'In Progress', due: 'Jun 5' },
  { id: 'PO-2409', product: 'Steel Beams 6m', qty: 120, status: 'Complete', due: 'Jun 2' },
  { id: 'PO-2408', product: 'PVC Pipes 3/4"', qty: 2000, status: 'Pending', due: 'Jun 8' },
  { id: 'PO-2407', product: 'Glass Panels 10mm', qty: 80, status: 'In Progress', due: 'Jun 6' },
  { id: 'PO-2406', product: 'Copper Wire Coils', qty: 45, status: 'Complete', due: 'May 30' },
]

const materials = [
  { name: 'Aluminum Ingots', stock: '4.2 tons', status: 'Good' },
  { name: 'Steel Rod', stock: '1.8 tons', status: 'Low' },
  { name: 'Raw PVC Granules', stock: '320 kg', status: 'Good' },
  { name: 'Silica Sand', stock: '0.5 tons', status: 'Critical' },
]

const STATUS_COLORS = {
  'In Progress': 'var(--color-accent-cyan)',
  'Complete': 'var(--color-success)',
  'Pending': 'var(--color-warning)',
}
const MAT_COLORS = { Good: 'var(--color-success)', Low: 'var(--color-warning)', Critical: 'var(--color-danger)' }

export default function NexusMFGDemo() {
  const [tab, setTab] = useState('orders')

  return (
    <div style={{ padding: '1.25rem', background: '#07101C', minHeight: '420px', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-heading)', marginBottom: '1rem' }}>Nexus MFG — Production</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.625rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Active Orders', value: '12', color: 'var(--color-accent-cyan)' },
          { label: 'Units Today', value: '847', color: 'var(--color-success)' },
          { label: 'Material Stock', value: 'Good', color: 'var(--color-success)' },
          { label: 'Machines Active', value: '8/10', color: 'var(--color-accent-violet)' },
        ].map(card => (
          <div key={card.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: card.color }}>{card.value}</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.65rem', marginTop: '0.2rem' }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {[['orders', 'Production Orders'], ['materials', 'Materials']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: '0.375rem 0.875rem', background: tab === id ? 'color-mix(in srgb, var(--color-accent-blue) 10%, transparent)' : 'none', border: `1px solid ${tab === id ? 'var(--color-accent-cyan)' : 'var(--color-border-subtle)'}`, borderRadius: '8px', color: tab === id ? 'var(--color-accent-cyan)' : 'var(--color-text-secondary)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
        {tab === 'orders' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-alt)' }}>
                {['Order ID', 'Product', 'Qty', 'Status', 'Due'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.65rem', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-accent-cyan)' }}>{o.id}</td>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-primary)' }}>{o.product}</td>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-secondary)' }}>{o.qty}</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>
                    <span style={{ background: `${STATUS_COLORS[o.status]}20`, color: STATUS_COLORS[o.status], border: `1px solid ${STATUS_COLORS[o.status]}40`, borderRadius: '99px', padding: '0.1rem 0.5rem', fontSize: '0.65rem' }}>{o.status}</span>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-secondary)' }}>{o.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'materials' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-alt)' }}>
                {['Material', 'Stock', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.65rem', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {materials.map(m => (
                <tr key={m.name} style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-primary)' }}>{m.name}</td>
                  <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{m.stock}</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>
                    <span style={{ background: `${MAT_COLORS[m.status]}20`, color: MAT_COLORS[m.status], border: `1px solid ${MAT_COLORS[m.status]}40`, borderRadius: '99px', padding: '0.1rem 0.5rem', fontSize: '0.65rem' }}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
