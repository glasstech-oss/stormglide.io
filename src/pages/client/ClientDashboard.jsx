import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  LogOut, AlertTriangle, CheckCircle2, Clock, Database, Server, Globe,
  Mail, MessageSquare, Shield, TrendingUp, Calendar, Zap, Eye
} from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'

export default function ClientDashboard() {
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [healthStatus, setHealthStatus] = useState({})

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectData = JSON.parse(sessionStorage.getItem('stormglide_client_project'))

        if (!projectData) {
          navigate('/client/login')
          return
        }

        setProject(projectData)

        // Simulate health check
        const status = {}
        if (projectData.stacks) {
          projectData.stacks.forEach(stack => {
            const expiryDate = new Date(stack.renewalDate)
            const daysLeft = Math.floor((expiryDate - new Date()) / (1000 * 60 * 60 * 24))
            status[stack.id] = {
              isHealthy: daysLeft > 7,
              daysLeft: daysLeft,
              uptime: 99.9 + Math.random() * 0.1,
            }
          })
        }
        setHealthStatus(status)
      } catch (error) {
        console.error('Error loading project:', error)
        navigate('/client/login')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [navigate])

  const handleLogout = () => {
    sessionStorage.removeItem('stormglide_client_auth')
    sessionStorage.removeItem('stormglide_client_project_id')
    sessionStorage.removeItem('stormglide_client_project')
    navigate('/client/login')
  }

  const getStackIcon = (stackName) => {
    const name = stackName.toLowerCase()
    if (name.includes('firebase') || name.includes('mongo') || name.includes('supabase')) return Database
    if (name.includes('render') || name.includes('aws') || name.includes('vercel')) return Server
    if (name.includes('domain')) return Globe
    if (name.includes('mail') || name.includes('sendgrid')) return Mail
    if (name.includes('sms') || name.includes('twilio')) return MessageSquare
    if (name.includes('cloudflare') || name.includes('cdn')) return Shield
    if (name.includes('ssl')) return Shield
    return Zap
  }

  const getStatusColor = (stack) => {
    if (!healthStatus[stack.id]) return '#6b7280'
    const { daysLeft, isHealthy } = healthStatus[stack.id]
    if (daysLeft < 0) return '#ef4444'
    if (daysLeft < 7) return '#ef4444'
    if (daysLeft < 30) return '#f59e0b'
    if (isHealthy) return '#10b981'
    return '#6b7280'
  }

  const getStatusLabel = (stack) => {
    if (!healthStatus[stack.id]) return 'Unknown'
    const { daysLeft } = healthStatus[stack.id]
    if (daysLeft < 0) return 'Expired'
    if (daysLeft < 7) return `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`
    if (daysLeft < 30) return `Expires in ${daysLeft} days`
    return 'Active'
  }

  const expiringStacks = project?.stacks?.filter(s => {
    const status = healthStatus[s.id]
    return status && status.daysLeft <= 30 && status.daysLeft > 0
  }) || []

  const monthlyPayment = project?.paymentCycle === 'annual'
    ? (parseFloat(project?.clientPaymentAnnual) / 12).toFixed(2)
    : parseFloat(project?.clientPaymentMonthly).toFixed(2)

  const completedDeliverables = project?.deliverables?.filter(d => d.status === 'completed').length || 0
  const totalDeliverables = project?.deliverables?.length || 0
  const completionPercentage = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0

  if (loading) {
    return (
      <PageLayout>
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p>Loading your project dashboard...</p>
        </div>
      </PageLayout>
    )
  }

  if (!project) {
    return (
      <PageLayout>
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p>No project found. Please log in again.</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Helmet>
        <title>{project.name} | Client Dashboard | StormGlide</title>
      </Helmet>

      <div style={{ padding: '3rem 2rem', background: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                {project.name}
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                {project.packageName} • {project.domain}
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '1rem',
          }}>
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'infrastructure', label: 'Infrastructure & Services', icon: Zap },
              { id: 'invoices', label: 'Invoices & Payments', icon: TrendingUp },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: activeTab === tab.id ? 'var(--sg-accent)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              {/* Key Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}>
                {[
                  {
                    label: 'Monthly Payment',
                    value: `GHS ${parseFloat(monthlyPayment).toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
                    icon: TrendingUp,
                    color: '#10b981',
                  },
                  {
                    label: 'Billing Cycle',
                    value: project.paymentCycle === 'annual' ? 'Annual' : 'Monthly',
                    icon: Calendar,
                    color: '#3b82f6',
                  },
                  {
                    label: 'Services Running',
                    value: `${project.stacks?.length || 0}`,
                    icon: Zap,
                    color: 'var(--sg-accent)',
                  },
                  {
                    label: 'System Health',
                    value: expiringStacks.length === 0 ? 'All Good' : `${expiringStacks.length} Alert${expiringStacks.length !== 1 ? 's' : ''}`,
                    icon: expiringStacks.length === 0 ? CheckCircle2 : AlertTriangle,
                    color: expiringStacks.length === 0 ? '#10b981' : '#f59e0b',
                  },
                  {
                    label: 'Project Progress',
                    value: `${completionPercentage}%`,
                    icon: TrendingUp,
                    color: completionPercentage === 100 ? '#10b981' : 'var(--sg-accent)',
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      padding: '1.5rem',
                      background: 'var(--color-background)',
                      border: `2px solid ${stat.color}`,
                      borderRadius: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <stat.icon size={20} color={stat.color} />
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        {stat.label}
                      </p>
                    </div>
                    <p style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: stat.color,
                    }}>
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Alerts */}
              {expiringStacks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '1.5rem',
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <AlertTriangle size={24} color='#f59e0b' style={{ flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#92400e' }}>
                        ⚠️ Services Expiring Soon
                      </h3>
                      <p style={{ color: '#b45309', marginBottom: '0.75rem' }}>
                        Please renew these services to avoid interruption:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {expiringStacks.map(stack => (
                          <p key={stack.id} style={{ color: '#b45309', fontSize: '0.9rem' }}>
                            • <strong>{stack.name}</strong> - Expires {new Date(stack.renewalDate).toLocaleDateString()}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Project Progress */}
              {totalDeliverables > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    padding: '1.5rem',
                    background: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                >
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                    📊 Project Progress
                  </h2>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Completion</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--sg-accent)' }}>
                        {completionPercentage}%
                      </p>
                    </div>
                    <div style={{
                      height: '12px',
                      background: '#e2e8f0',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${completionPercentage}%`,
                        background: 'linear-gradient(90deg, var(--sg-accent), #06b6d4)',
                        transition: 'width 0.3s',
                      }} />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                      {completedDeliverables} of {totalDeliverables} deliverables completed
                    </p>
                  </div>

                  {/* Deliverables */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {project.deliverables?.map(deliverable => (
                      <div key={deliverable.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: deliverable.status === 'completed' ? '#10b981' : deliverable.status === 'in-progress' ? 'var(--sg-accent)' : '#cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}>
                          {deliverable.status === 'completed' ? '✓' : deliverable.status === 'in-progress' ? '⏳' : '○'}
                        </div>
                        <span style={{
                          flex: 1,
                          fontWeight: 500,
                          color: 'var(--color-text-heading)',
                          textDecoration: deliverable.status === 'completed' ? 'line-through' : 'none',
                          opacity: deliverable.status === 'completed' ? 0.6 : 1,
                        }}>
                          {deliverable.name}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: deliverable.status === 'completed' ? '#10b981' : deliverable.status === 'in-progress' ? 'var(--sg-accent)' : '#94a3b8',
                          textTransform: 'capitalize',
                        }}>
                          {deliverable.status === 'pending' ? 'Upcoming' : deliverable.status === 'in-progress' ? 'In Progress' : 'Done'}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  padding: '1.5rem',
                  background: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              >
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                  Project Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                      Contact Person
                    </p>
                    <p style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      {project.contactPerson}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                      Email
                    </p>
                    <p style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      {project.contactEmail}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                      Phone
                    </p>
                    <p style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      {project.contactPhone || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                      Domain
                    </p>
                    <p style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      {project.domain || 'Not set'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* INFRASTRUCTURE TAB */}
          {activeTab === 'infrastructure' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                All the services and integrations powering your project. Each shows real-time status and expiration dates.
              </p>

              {(!project.stacks || project.stacks.length === 0) ? (
                <div style={{
                  padding: '2rem',
                  background: 'var(--color-background)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px dashed var(--color-border)',
                }}>
                  <p style={{ color: 'var(--color-text-secondary)' }}>No infrastructure services configured yet.</p>
                </div>
              ) : (
                project.stacks.map((stack, idx) => {
                  const status = healthStatus[stack.id] || {}
                  const Icon = getStackIcon(stack.name)
                  const statusColor = getStatusColor(stack)

                  return (
                    <motion.div
                      key={stack.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{
                        padding: '1.5rem',
                        background: 'var(--color-background)',
                        border: `2px solid ${statusColor}`,
                        borderRadius: '12px',
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '2rem', alignItems: 'start' }}>
                        {/* Service Details */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '8px',
                              background: `${statusColor}20`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Icon size={24} color={statusColor} />
                            </div>
                            <div>
                              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                                {stack.name}
                              </h3>
                              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                Service Type
                              </p>
                            </div>
                          </div>

                          {/* Service-specific info */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                            marginTop: '1rem',
                          }}>
                            <div>
                              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                Monthly Cost
                              </p>
                              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-heading)' }}>
                                GHS {parseFloat(stack.costPerMonth).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                Annual Cost
                              </p>
                              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-heading)' }}>
                                GHS {parseFloat(stack.costPerYear).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status & Health */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                              Status
                            </p>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem 1rem',
                              background: `${statusColor}20`,
                              color: statusColor,
                              borderRadius: '6px',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                            }}>
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: statusColor,
                              }} />
                              {getStatusLabel(stack)}
                            </div>
                          </div>

                          {status.uptime && (
                            <div>
                              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                Uptime
                              </p>
                              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#10b981' }}>
                                {status.uptime.toFixed(2)}%
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Expiration */}
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            Renewal Date
                          </p>
                          <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-heading)' }}>
                            {new Date(stack.renewalDate).toLocaleDateString()}
                          </p>
                          <p style={{ fontSize: '0.85rem', color: statusColor, fontWeight: 600, marginTop: '0.5rem' }}>
                            {status.daysLeft !== undefined && (
                              status.daysLeft > 0
                                ? `${status.daysLeft} day${status.daysLeft !== 1 ? 's' : ''} left`
                                : 'Expired'
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          )}

          {/* INVOICES TAB */}
          {activeTab === 'invoices' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => navigate('/client/invoices')}
                style={{
                  padding: '1rem 2rem',
                  background: 'var(--sg-accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: '2rem',
                }}
              >
                Go to Invoices & Payments →
              </button>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                View all your invoices, payments, and billing information on the dedicated invoices page.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
