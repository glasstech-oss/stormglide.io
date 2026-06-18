import { useState } from 'react'
import { Users, DollarSign, Calendar, Bell, LayoutDashboard, FileText, BarChart2 } from 'lucide-react'

const employees = [
  { name: 'Abena Mensah', dept: 'Engineering', role: 'Lead Developer', status: 'Active', joined: 'Mar 2022' },
  { name: 'Kwame Asante', dept: 'Finance', role: 'CFO', status: 'Active', joined: 'Jan 2021' },
  { name: 'Ama Boateng', dept: 'HR', role: 'HR Manager', status: 'On Leave', joined: 'Jun 2023' },
  { name: 'Kofi Darko', dept: 'Sales', role: 'Sales Lead', status: 'Active', joined: 'Aug 2022' },
  { name: 'Akosua Owusu', dept: 'Engineering', role: 'Frontend Dev', status: 'Active', joined: 'Nov 2023' },
]

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Users, label: 'Employees' },
  { icon: DollarSign, label: 'Payroll' },
  { icon: Calendar, label: 'Leave' },
  { icon: BarChart2, label: 'Reports' },
]

export default function NexusHRMDemo() {
  const [tab, setTab] = useState('Dashboard')

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '420px', fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
      {/* Sidebar */}
      <div style={{ width: 160, background: '#070D1C', borderRight: '1px solid var(--color-border-subtle)', padding: '1rem 0', flexShrink: 0 }}>
        <div style={{ padding: '0 1rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-accent-cyan)', fontWeight: 600 }}>NEXUS HRM</div>
        {NAV.map(({ icon: Icon, label }) => (
          <button key={label} onClick={() => setTab(label)} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%', padding: '0.625rem 1rem', background: tab === label ? 'color-mix(in srgb, var(--color-accent-blue) 10%, transparent)' : 'none', border: 'none', borderLeft: tab === label ? '2px solid var(--color-accent-cyan)' : '2px solid transparent', cursor: 'pointer', color: tab === label ? 'var(--color-accent-cyan)' : 'var(--color-text-secondary)', fontSize: '0.78rem', textAlign: 'left', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}>
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', background: '#0A1020' }}>
        {tab === 'Dashboard' && (
          <>
            <div style={{ marginBottom: '1rem', color: 'var(--color-text-heading)', fontWeight: 600 }}>Dashboard</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Employees', value: '47', icon: Users, color: 'var(--color-accent-cyan)' },
                { label: 'On Leave', value: '3', icon: Calendar, color: 'var(--color-warning)' },
                { label: "This Month's Payroll", value: 'GHS 84,200', icon: DollarSign, color: 'var(--color-success)' },
                { label: 'Open Requests', value: '5', icon: Bell, color: 'var(--color-accent-violet)' },
              ].map(card => (
                <div key={card.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '10px', padding: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>{card.label}</span>
                    <card.icon size={12} color={card.color} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: card.color }}>{card.value}</div>
                </div>
              ))}
            </div>

            <div style={{ color: 'var(--color-text-heading)', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.8rem' }}>Recent Employees</div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-alt)' }}>
                    {['Name', 'Department', 'Role', 'Status', 'Joined'].map(h => (
                      <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{e.name}</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-secondary)' }}>{e.dept}</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-secondary)' }}>{e.role}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <span style={{ background: e.status === 'Active' ? 'rgba(0,200,150,0.15)' : 'rgba(245,166,35,0.15)', color: e.status === 'Active' ? 'var(--color-success)' : 'var(--color-warning)', border: `1px solid ${e.status === 'Active' ? 'rgba(0,200,150,0.3)' : 'rgba(245,166,35,0.3)'}`, borderRadius: '99px', padding: '0.1rem 0.5rem', fontSize: '0.65rem' }}>{e.status}</span>
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-secondary)' }}>{e.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab !== 'Dashboard' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            {tab} module — click Dashboard to see the overview
          </div>
        )}
      </div>
    </div>
  )
}
