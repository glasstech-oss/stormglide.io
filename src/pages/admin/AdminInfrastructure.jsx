import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { AlertTriangle, Calendar, DollarSign, Server } from 'lucide-react'
import { getProjects } from '../../firebase/collections'
import PageLayout from '../../components/layout/PageLayout'

export default function AdminInfrastructure() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, expiring-soon, over-capacity

  useEffect(() => {
    const loadData = async () => {
      try {
        const projData = await getProjects()
        setProjects(projData)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const getDaysUntilExpiry = (timestamp) => {
    if (!timestamp) return null
    const expiryDate = new Date(timestamp.seconds * 1000)
    const days = Math.floor((expiryDate - new Date()) / (1000 * 60 * 60 * 24))
    return days
  }

  const getAlertColor = (days) => {
    if (days <= 7) return '#ef4444' // red
    if (days <= 30) return '#f59e0b' // amber
    return '#10b981' // green
  }

  const getAlertText = (days) => {
    if (days <= 0) return 'EXPIRED'
    if (days <= 7) return `${days}d - URGENT`
    if (days <= 30) return `${days}d - Soon`
    return `${days}d - OK`
  }

  // Aggregate all infrastructure across projects
  const allDomains = []
  const allDatabases = []
  const allTools = []

  projects.forEach(proj => {
    if (proj.infrastructure) {
      if (proj.infrastructure.domains) {
        proj.infrastructure.domains.forEach(domain => {
          allDomains.push({ ...domain, projectName: proj.name, projectId: proj.id })
        })
      }
      if (proj.infrastructure.databases) {
        proj.infrastructure.databases.forEach(db => {
          allDatabases.push({ ...db, projectName: proj.name, projectId: proj.id })
        })
      }
      if (proj.infrastructure.tools) {
        proj.infrastructure.tools.forEach(tool => {
          allTools.push({ ...tool, projectName: proj.name, projectId: proj.id })
        })
      }
    }
  })

  const expiringDomains = allDomains.filter(d => {
    const days = getDaysUntilExpiry(d.expiresAt)
    return days !== null && days <= 30
  })

  const monthlyToolCost = allTools
    .filter(t => t.billingCycle === 'monthly')
    .reduce((sum, t) => sum + (t.cost || 0), 0)

  const annualCost = monthlyToolCost * 12 +
    allDomains.reduce((sum, d) => sum + (d.cost || 0), 0) +
    allTools.filter(t => t.billingCycle === 'annual').reduce((sum, t) => sum + (t.cost || 0), 0)

  return (
    <PageLayout>
      <Helmet>
        <title>Infrastructure Tracker | Admin | StormGlide</title>
      </Helmet>

      <div style={{ padding: '3rem 2rem', background: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
              Infrastructure Tracker
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              Manage domains, databases, and tool subscriptions across all projects
            </p>
          </div>

          {/* Cost Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '1.5rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Monthly Cost</p>
                <DollarSign size={16} color='var(--sg-accent)' />
              </div>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                GHS {monthlyToolCost.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                From tool subscriptions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                padding: '1.5rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Annualized Cost</p>
                <DollarSign size={16} color='var(--sg-accent)' />
              </div>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                GHS {annualCost.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                All domains + tools
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                padding: '1.5rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Expiring Soon</p>
                <AlertTriangle size={16} color='#f59e0b' />
              </div>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                {expiringDomains.length}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                Domains in next 30 days
              </p>
            </motion.div>
          </div>

          {/* Domains */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: '2rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Domains ({allDomains.length})
            </h2>
            {allDomains.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', padding: '2rem 0', textAlign: 'center' }}>
                No domains tracked yet. Add domains to projects.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.95rem',
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Domain</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Project</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Registrar</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Expires</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDomains.map((domain, i) => {
                      const days = getDaysUntilExpiry(domain.expiresAt)
                      return (
                        <tr key={i} style={{
                          borderBottom: '1px solid var(--color-border)',
                          backgroundColor: days <= 7 ? 'color-mix(in srgb, #ef4444 5%, transparent)' : 'transparent',
                        }}>
                          <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                            {domain.name}
                          </td>
                          <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                            {domain.projectName}
                          </td>
                          <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                            {domain.registrar || 'N/A'}
                          </td>
                          <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                            {domain.expiresAt ? new Date(domain.expiresAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: '1rem 0' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              backgroundColor: `color-mix(in srgb, ${getAlertColor(days)} 15%, transparent)`,
                              color: getAlertColor(days),
                            }}>
                              {getAlertText(days)}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Databases */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              padding: '2rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Databases ({allDatabases.length})
            </h2>
            {allDatabases.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', padding: '2rem 0', textAlign: 'center' }}>
                No databases tracked yet. Add databases to projects.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.95rem',
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Database</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Project</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Provider</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Storage Used</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDatabases.map((db, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                          {db.name}
                        </td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                          {db.projectName}
                        </td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                          {db.provider}
                        </td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                          {db.storage}
                        </td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                          {db.tier}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Tools */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              padding: '2rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Tool Subscriptions ({allTools.length})
            </h2>
            {allTools.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', padding: '2rem 0', textAlign: 'center' }}>
                No tools tracked yet. Add tools to projects.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.95rem',
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Tool</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Project</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Type</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Cost</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Billing Cycle</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Renews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTools.map((tool, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                          {tool.name}
                        </td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                          {tool.projectName}
                        </td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                          {tool.type}
                        </td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                          GHS {typeof tool.cost === 'number' ? tool.cost : tool.cost}
                        </td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                          {tool.billingCycle}
                        </td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                          {tool.renewsAt ? new Date(tool.renewsAt.seconds * 1000).toLocaleDateString() : 'Ongoing'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
