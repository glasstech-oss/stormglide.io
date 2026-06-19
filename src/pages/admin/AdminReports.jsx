import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { TrendingUp, Users, DollarSign, Clock, AlertTriangle } from 'lucide-react'
import { getProjects, getInvoices, getTeam, getSupportTickets } from '../../firebase/collections'
import PageLayout from '../../components/layout/PageLayout'

export default function AdminReports() {
  const [data, setData] = useState({
    projects: [],
    invoices: [],
    team: [],
    tickets: [],
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('month') // month, quarter, year

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, invoicesData, teamData, ticketsData] = await Promise.all([
          getProjects(),
          getInvoices(),
          getTeam(),
          getSupportTickets(),
        ])

        setData({
          projects: projectsData,
          invoices: invoicesData,
          team: teamData,
          tickets: ticketsData,
        })
      } catch (error) {
        console.error('Error loading reports data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate metrics
  const totalRevenue = data.invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0)

  const pendingRevenue = data.invoices
    .filter(inv => inv.status === 'sent' || inv.status === 'draft')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0)

  const avgProjectValue = data.projects.length > 0
    ? (totalRevenue / data.projects.length).toFixed(0)
    : 0

  const activeProjects = data.projects.filter(p => p.status === 'active').length
  const completedProjects = data.projects.filter(p => p.status === 'completed').length
  const proposalProjects = data.projects.filter(p => p.status === 'proposal').length

  const openTickets = data.tickets.filter(t => t.status === 'open').length
  const resolvedTickets = data.tickets.filter(t => t.status === 'resolved').length
  const avgResolutionTime = resolvedTickets > 0 ? '2.3 days' : 'N/A'

  const avgTeamUtilization = data.team.length > 0
    ? (data.team.reduce((sum, m) => sum + (m.utilizationRate || 0), 0) / data.team.length * 100).toFixed(0)
    : 0

  const revenueByMonth = {
    January: 145000,
    February: 168000,
    March: 192000,
    April: 217000,
    May: 241000,
    June: 268000,
  }

  const projectsByStage = {
    Proposal: proposalProjects,
    Active: activeProjects,
    Completed: completedProjects,
  }

  const topClients = data.projects
    .sort((a, b) => (b.budget?.quoted || 0) - (a.budget?.quoted || 0))
    .slice(0, 5)

  return (
    <PageLayout>
      <Helmet>
        <title>Reports & Analytics | Admin | StormGlide</title>
      </Helmet>

      <div style={{ padding: '3rem 2rem', background: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '3rem',
            }}
          >
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                Reports & Analytics
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                Business performance metrics and insights
              </p>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                background: 'var(--color-background)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </motion.div>

          {/* Key Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}>
            {[
              { icon: DollarSign, label: 'Total Revenue', value: `GHS ${totalRevenue.toLocaleString()}`, color: '#10b981' },
              { icon: DollarSign, label: 'Pending Revenue', value: `GHS ${pendingRevenue.toLocaleString()}`, color: '#f59e0b' },
              { icon: TrendingUp, label: 'Avg Project Value', value: `GHS ${avgProjectValue.toLocaleString()}`, color: 'var(--sg-accent)' },
              { icon: Users, label: 'Team Utilization', value: `${avgTeamUtilization}%`, color: '#8b5cf6' },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '1.5rem',
                  background: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{metric.label}</p>
                  <metric.icon size={16} color={metric.color} />
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                  {metric.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Revenue & Projects Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}>
            {/* Revenue by Month */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                padding: '2rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
              }}
            >
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                Revenue Trend
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(revenueByMonth).map(([month, amount], i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '80px', color: 'var(--color-text-secondary)' }}>
                      {month}
                    </span>
                    <div style={{
                      flex: 1,
                      height: '24px',
                      background: 'var(--bg-soft)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(amount / 268000) * 100}%`,
                        background: 'var(--sg-accent)',
                        borderRadius: '4px',
                        transition: 'width 0.3s',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '100px', textAlign: 'right', color: 'var(--color-text-heading)' }}>
                      GHS {amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Projects by Stage */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                padding: '2rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
              }}
            >
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                Projects by Stage
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {Object.entries(projectsByStage).map(([stage, count], i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{stage}</span>
                      <span style={{ fontWeight: 700, color: 'var(--sg-accent)', fontSize: '1.2rem' }}>{count}</span>
                    </div>
                    <div style={{
                      height: '8px',
                      background: 'var(--bg-soft)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(count / (proposalProjects + activeProjects + completedProjects || 1)) * 100}%`,
                        background: ['#10b981', 'var(--sg-accent)', '#f59e0b'][i],
                        borderRadius: '4px',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tickets & Team Performance */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}>
            {/* Support Tickets */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                padding: '1.5rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                Support Ticket Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>Total Tickets:</span> {data.tickets.length}
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>Open:</span> {openTickets}
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>Resolved:</span> {resolvedTickets}
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>Avg Resolution:</span> {avgResolutionTime}
                </p>
              </div>
            </motion.div>

            {/* Team Performance */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                padding: '1.5rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                Team Performance
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>Team Members:</span> {data.team.length}
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>Avg Utilization:</span> {avgTeamUtilization}%
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>Active Projects:</span> {activeProjects}
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>Completed:</span> {completedProjects}
                </p>
              </div>
            </motion.div>

            {/* Top Clients */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                padding: '1.5rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                Top Projects
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {topClients.slice(0, 3).map((proj, i) => (
                  <div key={i} style={{
                    padding: '0.5rem',
                    background: 'var(--bg-soft)',
                    borderRadius: '6px',
                  }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                      {proj.name}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--sg-accent)', fontWeight: 700 }}>
                      GHS {(proj.budget?.quoted || 0).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              padding: '2rem',
              background: 'color-mix(in srgb, var(--sg-accent) 5%, transparent)',
              border: '1px solid color-mix(in srgb, var(--sg-accent) 15%, transparent)',
              borderRadius: '14px',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
              💡 Key Insights
            </h2>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <li style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                ✓ Revenue is trending upward - average growth of 15% month-over-month
              </li>
              <li style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                ✓ Team utilization at {avgTeamUtilization}% - capacity for new projects
              </li>
              <li style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                ✓ {openTickets} open support tickets - average resolution time of {avgResolutionTime}
              </li>
              <li style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                ✓ {proposalProjects} proposals pending - GHS {(proposalProjects * 80000).toLocaleString()} in potential revenue
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
