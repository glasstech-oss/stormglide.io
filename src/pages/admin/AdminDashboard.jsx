import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { BarChart3, AlertTriangle, Users, Zap } from 'lucide-react'
import { getProjects, getInquiries, getTeam } from '../../firebase/collections'
import PageLayout from '../../components/layout/PageLayout'

export default function AdminDashboard() {
  const [projects, setProjects] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projData, inqData, teamData] = await Promise.all([
          getProjects(),
          getInquiries(),
          getTeam(),
        ])

        setProjects(projData)
        setInquiries(inqData)
        setTeam(teamData)

        // Generate alerts for expiring domains/databases
        const newAlerts = []
        projData.forEach(proj => {
          if (proj.infrastructure?.domains) {
            proj.infrastructure.domains.forEach(domain => {
              const daysUntilExpiry = Math.floor(
                (new Date(domain.expiresAt?.seconds * 1000) - new Date()) / (1000 * 60 * 60 * 24)
              )
              if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
                newAlerts.push({
                  type: 'domain-expiring',
                  message: `${domain.name} expires in ${daysUntilExpiry} days`,
                  projectId: proj.id,
                  severity: daysUntilExpiry <= 7 ? 'high' : 'medium',
                })
              }
            })
          }
        })
        setAlerts(newAlerts)
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const activeProjects = projects.filter(p => p.status === 'active')
  const pendingInquiries = inquiries.filter(i => i.status === 'new' || i.status === 'contacted')
  const teamUtilization = team.length > 0
    ? (team.reduce((sum, m) => sum + (m.utilizationRate || 0), 0) / team.length * 100).toFixed(0)
    : 0

  return (
    <PageLayout>
      <Helmet>
        <title>Admin Dashboard | StormGlide</title>
      </Helmet>

      <div style={{ padding: '3rem 2rem', background: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              Manage projects, team, and clients from one place
            </p>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '1.5rem',
                background: 'color-mix(in srgb, var(--sg-accent) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--sg-accent) 25%, transparent)',
                borderRadius: '12px',
                marginBottom: '2rem',
                display: 'flex',
                gap: '1rem',
              }}
            >
              <AlertTriangle size={20} style={{ color: 'var(--sg-accent)', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                  {alerts.length} Active Alerts
                </p>
                {alerts.map((alert, i) => (
                  <p key={i} style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: i < alerts.length - 1 ? '0.25rem' : 0 }}>
                    ⚠️ {alert.message}
                  </p>
                ))}
              </div>
            </motion.div>
          )}

          {/* Overview Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}>
            {[
              { icon: Zap, label: 'Active Projects', value: activeProjects.length, color: 'var(--sg-accent)' },
              { icon: BarChart3, label: 'Pending Inquiries', value: pendingInquiries.length, color: '#3b82f6' },
              { icon: Users, label: 'Team Members', value: team.length, color: '#10b981' },
              { icon: AlertTriangle, label: 'Team Utilization', value: `${teamUtilization}%`, color: '#f59e0b' },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '2rem',
                  background: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '14px',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: `color-mix(in srgb, ${card.color} 15%, transparent)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
                >
                  <card.icon size={28} color={card.color} />
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  {card.label}
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                  {card.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {/* Recent Inquiries */}
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                Recent Inquiries
              </h3>
              {pendingInquiries.slice(0, 5).map((inq, i) => (
                <div key={i} style={{
                  padding: '0.75rem 0',
                  borderBottom: i < Math.min(5, pendingInquiries.length) - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                    {inq.clientName}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {inq.serviceType} • {inq.status}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Active Projects */}
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                Active Projects
              </h3>
              {activeProjects.slice(0, 5).map((proj, i) => (
                <div key={i} style={{
                  padding: '0.75rem 0',
                  borderBottom: i < Math.min(5, activeProjects.length) - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                    {proj.name}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {proj.team?.length || 0} team members • {proj.status}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Team Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                padding: '2rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                Team Status
              </h3>
              {team.slice(0, 5).map((member, i) => (
                <div key={i} style={{
                  padding: '0.75rem 0',
                  borderBottom: i < Math.min(5, team.length) - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                    {member.name}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {member.role} • {member.availability}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
