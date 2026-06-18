import { useState } from 'react'
import { Plus, Trash2, FileText } from 'lucide-react'

const RATE_PER_KG = 45

export default function CargoScanDemo() {
  const [form, setForm] = useState({ length: '', width: '', height: '', qty: '1' })
  const [packages, setPackages] = useState([])
  const [report, setReport] = useState(false)

  const addPackage = (e) => {
    e.preventDefault()
    const l = parseFloat(form.length)
    const w = parseFloat(form.width)
    const h = parseFloat(form.height)
    const q = parseInt(form.qty) || 1
    if (!l || !w || !h) return
    const cbm = ((l / 100) * (w / 100) * (h / 100) * q)
    setPackages(prev => [...prev, { l, w, h, q, cbm: parseFloat(cbm.toFixed(4)) }])
    setForm({ length: '', width: '', height: '', qty: '1' })
  }

  const totalCBM = packages.reduce((s, p) => s + p.cbm, 0)
  const chargeableWeight = totalCBM * 167
  const estimatedCost = chargeableWeight * RATE_PER_KG

  return (
    <div style={{ padding: '1.25rem', background: '#07101C', minHeight: '420px', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-heading)', marginBottom: '1rem' }}>CBM Calculator</div>

      <form onSubmit={addPackage} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr) auto', gap: '0.5rem', marginBottom: '1rem', alignItems: 'end' }}>
        {[['length', 'Length (cm)'], ['width', 'Width (cm)'], ['height', 'Height (cm)'], ['qty', 'Qty']].map(([k, label]) => (
          <div key={k}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.65rem', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>{label}</div>
            <input
              className="input"
              type="number"
              min="0"
              step="0.1"
              placeholder={k === 'qty' ? '1' : '0'}
              value={form[k]}
              onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
              style={{ padding: '0.5rem 0.625rem', fontSize: '0.8rem' }}
            />
          </div>
        ))}
        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.75rem', gap: '0.25rem', fontSize: '0.8rem', height: 38, alignSelf: 'end' }}>
          <Plus size={14} /> Add
        </button>
      </form>

      {packages.length > 0 && (
        <>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', overflow: 'hidden', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-alt)' }}>
                  {['L×W×H (cm)', 'Qty', 'CBM', ''].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.65rem', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {packages.map((p, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{p.l}×{p.w}×{p.h}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-secondary)' }}>{p.q}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.cbm.toFixed(4)}</td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>
                      <button onClick={() => setPackages(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}>
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            {[
              { label: 'Total CBM', value: totalCBM.toFixed(4), color: 'var(--color-accent-cyan)' },
              { label: 'Chargeable Weight', value: `${chargeableWeight.toFixed(1)} kg`, color: 'var(--color-accent-violet)' },
              { label: 'Est. Cost *', value: `GHS ${estimatedCost.toFixed(0)}`, color: 'var(--color-accent-gold)' },
            ].map(card => (
              <div key={card.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', padding: '0.875rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: card.color }}>{card.value}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.65rem', marginTop: '0.25rem' }}>{card.label}</div>
              </div>
            ))}
          </div>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.65rem', marginBottom: '1rem' }}>* Rate: GHS {RATE_PER_KG}/kg — estimate only. Actual rates vary by route.</p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '0.5rem 1rem' }} onClick={() => setPackages([])}>Clear All</button>
            <button className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.5rem 1rem', gap: '0.375rem' }} onClick={() => setReport(v => !v)}>
              <FileText size={14} /> {report ? 'Hide Report' : 'Generate Report'}
            </button>
          </div>

          {report && (
            <div style={{ marginTop: '1rem', background: '#0A0F1A', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              {`CARGOSCAN SHIPMENT REPORT
Generated: ${new Date().toLocaleString()}
---
Packages: ${packages.length}
Total CBM: ${totalCBM.toFixed(4)} m³
Chargeable Weight: ${chargeableWeight.toFixed(1)} kg
Estimated Cost: GHS ${estimatedCost.toFixed(0)} (@ GHS ${RATE_PER_KG}/kg)
---
${packages.map((p, i) => `Pkg ${i + 1}: ${p.l}×${p.w}×${p.h} cm × ${p.q} unit(s) = ${p.cbm.toFixed(4)} CBM`).join('\n')}`}
            </div>
          )}
        </>
      )}

      {packages.length === 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textAlign: 'center' }}>
          Add your first package above to start calculating
        </div>
      )}
    </div>
  )
}
