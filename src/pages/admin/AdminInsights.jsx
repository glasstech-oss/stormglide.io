import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { TrendingUp, AlertTriangle, DollarSign, Calendar, Zap } from 'lucide-react'
import { getProjects } from '../../firebase/collections'
import { calculateMargin, getExpiringProjects, calculateInfrastructureCost } from '../../firebase/billing'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminInsights() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData)

        // Calculate metrics
        const totalRevenue = projectsData.reduce((sum, p) => {
          const payment = p.paymentCycle === 'annual'
            ? parseFloat(p.clientPaymentAnnual) / 12
            : parseFloat(p.clientPaymentMonthly)
          return sum + payment
        }, 0)

        const totalInfrastructure = projectsData.reduce((sum, p) => {
          const cost = calculateInfrastructureCost(p.stacks, p.paymentCycle === 'annual' ? 'annual' : 'monthly')
          return sum + (p.paymentCycle === 'annual' ? cost / 12 : cost)
        }, 0)

        const totalProfit = totalRevenue - totalInfrastructure

        const expiringProjects = getExpiringProjects(projectsData, 30)

        const marginByProject = projectsData.map(p => ({
          name: p.name,
          ...calculateMargin(p),
        }))

        const avgMargin = projectsData.length > 0
          ? (marginByProject.reduce((sum, p) => sum + p.margin, 0) / projectsData.length).toFixed(2)
          : 0

        const lowMarginProjects = marginByProject.filter(p => p.margin < 500)

        // Revenue forecast (next 6 months)
        const forecast = Array.from({ length: 6 }).map((_, i) => {
          const date = new Date()
          date.setMonth(date.getMonth() + i)
          return {
            month: date.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
            revenue: totalRevenue,
            cost: totalInfrastructure,
            profit: totalProfit,
          }
        })

        setMetrics({
          totalProjects: projectsData.length,
          totalMonthlyRevenue: totalRevenue,
          totalMonthlyCost: totalInfrastructure,
          totalMonthlyProfit: totalProfit,
          profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0,
          avgProjectMargin: avgMargin,
          expiringProjects: expiringProjects.length,
          lowMarginProjects: lowMarginProjects.length,
          marginByProject: marginByProject.sort((a, b) => b.margin - a.margin),
          expiringProjectsList: expiringProjects.slice(0, 5),
          lowMarginList: lowMarginProjects.slice(0, 5),
          forecast: forecast,
        })
      } catch (error) {
        console.error('Error loading insights:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading || !metrics) {
    return (
      <AdminLayout>
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p>Loading insights...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Business Insights | Admin | StormGlide</title>
      </Helmet>

      <div style={{ padding: '3rem 2rem', background: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
            Business Insights & Profitability
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Real-time revenue, costs, and profitability analysis
          </p>

          {/* Key Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            {[
              {
                label: 'Monthly Revenue',
                value: `GHS ${metrics.totalMonthlyRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                icon: DollarSign,
                color: '#10b981',
              },
              {
                label: 'Monthly Costs',
                value: `GHS ${metrics.totalMonthlyCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                icon: Zap,
                color: '#ef4444',
              },
              {
                label: 'Monthly Profit',
                value: `GHS ${metrics.totalMonthlyProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                icon: TrendingUp,
                color: 'var(--sg-accent)',
              },
              {
                label: 'Profit Margin',
                value: `${metrics.profitMargin}%`,
                icon: TrendingUp,
                color: '#3b82f6',
              },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '1.5rem',
                  background: 'var(--color-background)',
                  border: `2px solid ${metric.color}`,
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <metric.icon size={20} color={metric.color} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    {metric.label}
                  </p>
                </div>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: metric.color,
                }}>
                  {metric.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Alerts & Warnings */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            {/* Expiring Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Calendar size={20} color='#f59e0b' />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                  Expiring Soon ({metrics.expiringProjects})
                </h2>
              </div>
              {metrics.expiringProjectsList.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>No projects expiring in the next 30 days</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {metrics.expiringProjectsList.map((project, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.75rem',
                        background: 'var(--bg-soft)',
                        borderRadius: '8px',
                        borderLeft: '3px solid #f59e0b',
                      }}
                    >
                      <p style={{ fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                        {project.name}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        Expires: {new Date(project.billingEndDate?.seconds ? project.billingEndDate.seconds * 1000 : project.billingEndDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Low Margin Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <AlertTriangle size={20} color='#ef4444' />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                  Low Margin Projects ({metrics.lowMarginProjects})
                </h2>
              </div>
              {metrics.lowMarginList.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>All projects have healthy margins</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {metrics.lowMarginList.map((project, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.75rem',
                        background: 'var(--bg-soft)',
                        borderRadius: '8px',
                        borderLeft: '3px solid #ef4444',
                      }}
                    >
                      <p style={{ fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                        {project.name}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>
                        Margin: GHS {project.margin.toFixed(0)}/mo ({project.marginPercentage}%)
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Revenue Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              6-Month Revenue Forecast
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      Month
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      Revenue
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      Costs
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      Profit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.forecast.map((month, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                        {month.month}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>
                        GHS {month.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#ef4444', fontWeight: 600 }}>
                        GHS {month.cost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--sg-accent)', fontWeight: 700 }}>
                        GHS {month.profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Project Profitability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
              padding: '1.5rem',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Project Profitability Ranking
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      Project
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      Client Payment
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      Costs
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      Margin
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.marginByProject.slice(0, 10).map((project, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                        {project.name}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>
                        GHS {project.clientPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#ef4444', fontWeight: 600 }}>
                        GHS {project.infrastructureCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        color: project.margin > 0 ? 'var(--sg-accent)' : '#ef4444',
                        fontWeight: 700,
                      }}>
                        GHS {project.margin.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        color: project.marginPercentage > 50 ? '#10b981' : project.marginPercentage > 20 ? '#f59e0b' : '#ef4444',
                        fontWeight: 600,
                      }}>
                        {project.marginPercentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
