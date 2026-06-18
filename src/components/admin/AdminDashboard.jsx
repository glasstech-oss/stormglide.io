import { useAdmin } from '../../context/AdminContext'
import { Inbox, PlaySquare, FolderKanban, MessageSquare } from 'lucide-react'

const STATUS_COLORS = {
  new: 'var(--color-accent-cyan)',
  in_review: 'var(--color-accent-violet)',
  quoted: 'var(--color-warning)',
  won: 'var(--color-success)',
  lost: 'var(--color-danger)',
  closed: 'var(--color-text-secondary)',
}

export default function AdminDashboard() {
  const { inquiries, demoRequests, projects } = useAdmin()

  const newInquiries = inquiries.filter(i => i.status === 'new').length
  const pendingDemos = demoRequests.filter(d => d.status === 'new').length
  const activeProjects = projects.filter(p => p.status !== 'delivered').length
  const totalMessages = inquiries.length

  const recentInquiries = [...inquiries].slice(0, 5)
  const recentDemos = [...demoRequests].slice(0, 5)

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Dashboard</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'New Inquiries', value: newInquiries, icon: Inbox, color: 'var(--color-accent-cyan)' },
          { label: 'Pending Demo Requests', value: pendingDemos, icon: PlaySquare, color: 'var(--color-accent-violet)' },
          { label: 'Active Projects', value: activeProjects, icon: FolderKanban, color: 'var(--color-warning)' },
          { label: 'Total Messages', value: totalMessages, icon: MessageSquare, color: 'var(--color-success)' },
        ].map(card => (
          <div key={card.label} className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <card.icon size={18} color={card.color} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: card.color, marginBottom: '0.25rem' }}>{card.value}</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Recent inquiries */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Recent Inquiries</h3>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
            {recentInquiries.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>No inquiries yet</div>
            )}
            {recentInquiries.map((inq, i) => (
              <div key={inq.id} style={{ padding: '0.875rem 1rem', borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.name}</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>{inq.type} · {new Date(inq.date).toLocaleDateString()}</div>
                </div>
                <span style={{ background: `${STATUS_COLORS[inq.status]}20`, color: STATUS_COLORS[inq.status], border: `1px solid ${STATUS_COLORS[inq.status]}40`, borderRadius: '99px', padding: '0.15rem 0.5rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', flexShrink: 0 }}>{inq.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent demo requests */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Recent Demo Requests</h3>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
            {recentDemos.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>No demo requests yet</div>
            )}
            {recentDemos.map((req, i) => (
              <div key={req.id} style={{ padding: '0.875rem 1rem', borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>{req.name}</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.product} · {req.source}</div>
                </div>
                <span style={{ background: 'color-mix(in srgb, var(--color-accent-blue) 10%, transparent)', color: 'var(--color-accent-cyan)', border: '1px solid color-mix(in srgb, var(--color-accent-blue) 30%, transparent)', borderRadius: '99px', padding: '0.15rem 0.5rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', flexShrink: 0 }}>{req.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
