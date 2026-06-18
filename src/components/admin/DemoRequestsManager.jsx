import { useState } from 'react'
import { X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const STATUSES = ['new', 'contacted', 'demo_sent', 'converted', 'closed']
const STATUS_COLORS = { new: 'var(--color-accent-cyan)', contacted: 'var(--color-accent-violet)', demo_sent: 'var(--color-warning)', converted: 'var(--color-success)', closed: 'var(--color-text-secondary)' }

function DemoPanel({ req, onClose, onUpdate }) {
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', maxWidth: '100vw', background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border-subtle)', zIndex: 500, overflowY: 'auto' }}>
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1rem' }}>Demo Request</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={18} /></button>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{req.name}</div>
          <a href={`mailto:${req.email}`} style={{ color: 'var(--color-accent-cyan)', fontSize: '0.875rem' }}>{req.email}</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {[['Product', req.product], ['Source', req.source], ['Date', new Date(req.date).toLocaleDateString()]].map(([label, value]) => (
            <div key={label}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>{label}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{value}</div>
            </div>
          ))}
        </div>

        {req.configuratorSelections && (
          <div style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Configurator Selections</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-secondary)', overflow: 'auto' }}>
              {JSON.stringify(req.configuratorSelections, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Status</div>
          <select className="input" value={req.status} onChange={e => onUpdate(req.id, { status: e.target.value })} style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <button className="btn-primary" style={{ justifyContent: 'center', fontSize: '0.85rem' }} onClick={() => onUpdate(req.id, { status: 'demo_sent' })}>Mark Demo Sent</button>
          <button className="btn-secondary" style={{ justifyContent: 'center', fontSize: '0.85rem' }} onClick={() => onUpdate(req.id, { status: 'contacted' })}>Mark Contacted</button>
          <button onClick={() => { onUpdate(req.id, { status: 'closed' }); onClose() }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', fontSize: '0.8rem', textAlign: 'center', padding: '0.5rem' }}>Archive</button>
        </div>
      </div>
    </div>
  )
}

export default function DemoRequestsManager() {
  const { demoRequests, updateDemoRequest } = useAdmin()
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Demo Requests</h2>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
        {demoRequests.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No demo requests yet</div>
        )}
        {demoRequests.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-alt)' }}>
                {['Name', 'Email', 'Product', 'Source', 'Date', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '0.625rem 0.875rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demoRequests.map((req, i) => (
                <tr key={req.id} onClick={() => setSelected(req)} style={{ borderTop: '1px solid var(--color-border-subtle)', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-alt)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.75rem 0.875rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{req.name}</td>
                  <td style={{ padding: '0.75rem 0.875rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{req.email}</td>
                  <td style={{ padding: '0.75rem 0.875rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{req.product}</td>
                  <td style={{ padding: '0.75rem 0.875rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{req.source}</td>
                  <td style={{ padding: '0.75rem 0.875rem', color: 'var(--color-text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{new Date(req.date).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem 0.875rem' }}>
                    <span style={{ background: `${STATUS_COLORS[req.status]}15`, color: STATUS_COLORS[req.status], border: `1px solid ${STATUS_COLORS[req.status]}30`, borderRadius: '99px', padding: '0.15rem 0.625rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{req.status.replace('_', ' ')}</span>
                  </td>
                  <td style={{ padding: '0.75rem 0.875rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)' }}>Handle →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <DemoPanel
          req={demoRequests.find(d => d.id === selected.id) || selected}
          onClose={() => setSelected(null)}
          onUpdate={(id, changes) => { updateDemoRequest(id, changes); setSelected(prev => ({ ...prev, ...changes })) }}
        />
      )}
    </div>
  )
}
