import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Clock, CheckCircle2, AlertCircle, CreditCard, LogOut, Download } from 'lucide-react'
import { getInvoicesByProject } from '../../firebase/collections'
import { createPaystackPayment } from '../../services/paystack'
import { sendPaymentConfirmation } from '../../firebase/notifications'
import PageLayout from '../../components/layout/PageLayout'

export default function ClientInvoices() {
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectId = sessionStorage.getItem('stormglide_client_project_id')
        const projectData = JSON.parse(sessionStorage.getItem('stormglide_client_project'))

        if (!projectId || !projectData) {
          navigate('/client/login')
          return
        }

        setProject(projectData)

        const invoiceData = await getInvoicesByProject(projectId)
        setInvoices(invoiceData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
      } catch (error) {
        console.error('Error loading invoices:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [navigate])

  const handlePayment = async (invoice) => {
    if (processing) return
    setProcessing(true)

    try {
      const response = await createPaystackPayment({
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        clientEmail: project.contactEmail,
        clientName: project.contactPerson,
        projectName: project.name,
        invoiceId: invoice.id,
      })

      if (response.reference) {
        // Send confirmation email
        try {
          await sendPaymentConfirmation(project, invoice, response.reference)
        } catch (err) {
          console.error('Could not send confirmation email:', err)
        }

        // Reload invoices
        const updated = await getInvoicesByProject(project.id)
        setInvoices(updated)
        setSelectedInvoice(null)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('stormglide_client_auth')
    sessionStorage.removeItem('stormglide_client_project_id')
    sessionStorage.removeItem('stormglide_client_project')
    navigate('/client/login')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#6b7280'
      case 'sent': return '#3b82f6'
      case 'paid': return '#10b981'
      case 'overdue': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const totalPending = invoices
    .filter(i => ['draft', 'sent', 'overdue'].includes(i.status))
    .reduce((sum, i) => sum + (i.amount || 0), 0)

  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + (i.amount || 0), 0)

  if (loading) {
    return (
      <PageLayout>
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p>Loading invoices...</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Helmet>
        <title>Invoices | {project?.name} | StormGlide</title>
      </Helmet>

      <div style={{ padding: '3rem 2rem', background: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                Invoices & Payments
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {project?.name} • {project?.domain}
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

          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            {[
              { label: 'Pending', amount: totalPending, color: '#f59e0b', icon: Clock },
              { label: 'Paid', amount: totalPaid, color: '#10b981', icon: CheckCircle2 },
              { label: 'Total Invoices', amount: invoices.length, color: 'var(--sg-accent)', icon: CreditCard },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '1.5rem',
                  background: 'var(--color-background)',
                  border: `1px solid ${card.color}`,
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <card.icon size={20} color={card.color} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    {card.label}
                  </p>
                </div>
                <p style={{
                  fontSize: typeof card.amount === 'number' && card.amount > 100 ? '1.5rem' : '1.3rem',
                  fontWeight: 700,
                  color: card.color,
                }}>
                  {typeof card.amount === 'number' && card.amount > 100
                    ? `GHS ${card.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    : card.amount}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Invoices List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {invoices.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-secondary)' }}>No invoices yet</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--bg-soft)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                        Invoice #
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                        Description
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                        Amount
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                        Status
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                          {invoice.invoiceNumber}
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', maxWidth: '300px' }}>
                          {invoice.description}
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                          GHS {(invoice.amount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.4rem 0.8rem',
                            background: `${getStatusColor(invoice.status)}20`,
                            color: getStatusColor(invoice.status),
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}>
                            {invoice.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          {['draft', 'sent', 'overdue'].includes(invoice.status) && (
                            <button
                              onClick={() => handlePayment(invoice)}
                              disabled={processing}
                              style={{
                                padding: '0.5rem 1rem',
                                background: 'var(--sg-accent)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 600,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                opacity: processing ? 0.6 : 1,
                                fontSize: '0.85rem',
                              }}
                            >
                              {processing ? 'Processing...' : 'Pay Now'}
                            </button>
                          )}
                          {invoice.status === 'paid' && (
                            <span style={{ color: '#10b981', fontWeight: 600 }}>✓ Paid</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Payment Information */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'var(--bg-soft)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
              📱 Payment Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Payment Method</p>
                <p>Paystack (Credit/Debit Card, Mobile Money)</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Currency</p>
                <p>Ghanaian Cedis (GHS)</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Processing</p>
                <p>Instant - Paid within seconds</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Support</p>
                <p>Email: john@stormglide.io</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
