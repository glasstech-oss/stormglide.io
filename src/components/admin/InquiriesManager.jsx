import { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const STATUSES = ['new', 'in_review', 'quoted', 'won', 'lost', 'closed']
const STATUS_COLORS = { new: 'var(--color-accent-cyan)', in_review: 'var(--color-accent-violet)', quoted: 'var(--color-warning)', won: 'var(--color-success)', lost: 'var(--color-danger)', closed: 'var(--color-text-secondary)' }
const TEMPLATES = [
  { label: 'Will be in touch', text: "Hi, thank you for reaching out to Stormglide. We've received your message and will be in touch with you within 24 hours." },
  { label: 'Quote sent', text: "Hi, thank you for your interest. We've reviewed your requirements and sent over a quote. Please check your inbox and let us know if you have any questions." },
  { label: 'Not a fit', text: "Hi, thank you for getting in touch. After reviewing your request, we don't think we're the right fit for this particular project at this time. We wish you success with your venture." },
]

function InquiryPanel({ inquiry, onClose, onUpdate }) {
  const [notes, setNotes] = useState(inquiry.notes || '')

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px', maxWidth: '100vw', background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border-subtle)', zIndex: 500, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1rem' }}>Inquiry Detail</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={18} /></button>
      </div>
      <div style={{ padding: '1.5rem', flex: 1 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{inquiry.name}</div>
          {inquiry.company && <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{inquiry.company}</div>}
          <a href={`mailto:${inquiry.email}`} style={{ color: 'var(--color-accent-cyan)', fontSize: '0.875rem' }}>{inquiry.email}</a>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Type</div>
          <div style={{ fontSize: '0.875rem' }}>{inquiry.type}</div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Status</div>
          <select
            className="input"
            value={inquiry.status}
            onChange={e => onUpdate(inquiry.id, { status: e.target.value })}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Message</div>
          <div style={{ background: 'var(--color-surface-alt)', borderRadius: 'var(--border-radius)', padding: '1rem', fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--color-text-primary)', border: '1px solid var(--color-border-subtle)' }}>{inquiry.message}</div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Reply Templates</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {TEMPLATES.map(t => (
              <button key={t.label} onClick={() => navigator.clipboard?.writeText(t.text)} style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '0.625rem 0.875rem', textAlign: 'left', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.78rem', fontFamily: 'var(--font-body)' }}>
                {t.label} (click to copy)
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Private Notes</div>
          <textarea
            className="input"
            rows={4}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={() => onUpdate(inquiry.id, { notes })}
            placeholder="Add private notes..."
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>
    </div>
  )
}

export default function InquiriesManager() {
  const { inquiries, updateInquiry } = useAdmin()
  const [selected, setSelected] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')

  const filtered = inquiries.filter(i => {
    if (filterStatus && i.status !== filterStatus) return false
    if (search && !`${i.name} ${i.company}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const exportCSV = () => {
    const cols = ['name', 'company', 'email', 'type', 'status', 'date']
    const rows = inquiries.map(i => cols.map(c => `"${(i[c] || '').toString().replace(/"/g, '""')}"`).join(','))
    const csv = [cols.join(','), ...rows].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'inquiries.csv'
    a.click()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Inquiries</h2>
        <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }} onClick={exportCSV}>Export CSV</button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input className="input" placeholder="Search name or company..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: '1 1 200px', padding: '0.5rem 0.875rem', fontSize: '0.85rem' }} />
        <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 160, padding: '0.5rem 0.875rem', fontSize: '0.85rem' }}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No inquiries found</div>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          {filtered.length > 0 && (
            <thead>
              <tr style={{ background: 'var(--color-surface-alt)' }}>
                {['Name', 'Company', 'Email', 'Type', 'Date', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '0.625rem 0.875rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {filtered.map((inq, i) => (
              <tr key={inq.id} onClick={() => setSelected(inq)} style={{ borderTop: '1px solid var(--color-border-subtle)', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-alt)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '0.75rem 0.875rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>{inq.name}</td>
                <td style={{ padding: '0.75rem 0.875rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{inq.company || '—'}</td>
                <td style={{ padding: '0.75rem 0.875rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{inq.email}</td>
                <td style={{ padding: '0.75rem 0.875rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{inq.type}</td>
                <td style={{ padding: '0.75rem 0.875rem', color: 'var(--color-text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{new Date(inq.date).toLocaleDateString()}</td>
                <td style={{ padding: '0.75rem 0.875rem' }}>
                  <span style={{ background: `${STATUS_COLORS[inq.status]}15`, color: STATUS_COLORS[inq.status], border: `1px solid ${STATUS_COLORS[inq.status]}30`, borderRadius: '99px', padding: '0.15rem 0.625rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{inq.status.replace('_', ' ')}</span>
                </td>
                <td style={{ padding: '0.75rem 0.875rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)' }}>View →</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <InquiryPanel
          inquiry={inquiries.find(i => i.id === selected.id) || selected}
          onClose={() => setSelected(null)}
          onUpdate={(id, changes) => { updateInquiry(id, changes); setSelected(prev => ({ ...prev, ...changes })) }}
        />
      )}
    </div>
  )
}
