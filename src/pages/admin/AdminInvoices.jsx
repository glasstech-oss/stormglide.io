import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { DollarSign, Send, Check, Clock, AlertTriangle } from 'lucide-react'
import { getInvoices, getProject, updateInvoice, addInvoice } from '../../firebase/collections'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    projectId: '',
    clientId: '',
    amount: '',
    description: '',
    items: [{ item: '', hours: '', rate: '', total: 0 }],
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const invoiceData = await getInvoices()
        setInvoices(invoiceData)
      } catch (error) {
        console.error('Error loading invoices:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleCreateInvoice = async (e) => {
    e.preventDefault()
    try {
      const invoiceData = {
        projectId: newInvoice.projectId,
        clientId: newInvoice.clientId,
        amount: parseInt(newInvoice.amount),
        currency: 'GHS',
        description: newInvoice.description,
        itemizedBreakdown: newInvoice.items.filter(i => i.item),
      }

      await addInvoice(invoiceData)

      // Reset form and reload
      setNewInvoice({
        projectId: '',
        clientId: '',
        amount: '',
        description: '',
        items: [{ item: '', hours: '', rate: '', total: 0 }],
      })
      setShowForm(false)

      const updated = await getInvoices()
      setInvoices(updated)
    } catch (error) {
      console.error('Error creating invoice:', error)
    }
  }

  const handleUpdateStatus = async (invoiceId, status) => {
    try {
      await updateInvoice(invoiceId, { status })
      const updated = await getInvoices()
      setInvoices(updated)
    } catch (error) {
      console.error('Error updating invoice:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#10b981'
      case 'sent': return '#3b82f6'
      case 'draft': return '#6b7280'
      case 'overdue': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0)

  const pendingAmount = invoices
    .filter(inv => inv.status === 'sent' || inv.status === 'draft')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0)

  return (
    <AdminLayout>
      <Helmet>
        <title>Invoicing | Admin | StormGlide</title>
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
                Invoicing
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                Manage project invoices and track payments
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--sg-accent)',
                color: 'var(--color-background)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {showForm ? 'Cancel' : '+ New Invoice'}
            </button>
          </motion.div>

          {/* Revenue Overview */}
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
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Total Revenue</p>
                <DollarSign size={16} color='#10b981' />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                GHS {totalRevenue.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                Paid invoices
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
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Pending</p>
                <Clock size={16} color='#f59e0b' />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                GHS {pendingAmount.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                Draft + sent invoices
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
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Total Invoices</p>
                <DollarSign size={16} color='var(--sg-accent)' />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                {invoices.length}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                All time
              </p>
            </motion.div>
          </div>

          {/* Create Invoice Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '2rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                marginBottom: '2rem',
              }}
            >
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                Create New Invoice
              </h2>
              <form onSubmit={handleCreateInvoice}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <input
                    type="text"
                    placeholder="Project ID"
                    value={newInvoice.projectId}
                    onChange={(e) => setNewInvoice({ ...newInvoice, projectId: e.target.value })}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      backgroundColor: 'var(--bg-soft)',
                    }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Client ID"
                    value={newInvoice.clientId}
                    onChange={(e) => setNewInvoice({ ...newInvoice, clientId: e.target.value })}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      backgroundColor: 'var(--bg-soft)',
                    }}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Total Amount (GHS)"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      backgroundColor: 'var(--bg-soft)',
                    }}
                    required
                  />
                </div>
                <textarea
                  placeholder="Invoice Description / Deliverables"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    backgroundColor: 'var(--bg-soft)',
                    marginBottom: '1.5rem',
                    minHeight: '100px',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--sg-accent)',
                    color: 'var(--color-background)',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Create Invoice
                </button>
              </form>
            </motion.div>
          )}

          {/* Invoices List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '2rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              All Invoices
            </h2>
            {invoices.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', padding: '2rem 0', textAlign: 'center' }}>
                No invoices yet. Create one to get started.
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
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Invoice #</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Project</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Amount</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '1rem 0', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                          INV-{inv.id?.slice(0, 8).toUpperCase() || '0000'}
                        </td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)' }}>
                          {inv.projectId || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                          GHS {inv.amount?.toLocaleString() || 0}
                        </td>
                        <td style={{ padding: '1rem 0' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            backgroundColor: `color-mix(in srgb, ${getStatusColor(inv.status)} 15%, transparent)`,
                            color: getStatusColor(inv.status),
                            textTransform: 'capitalize',
                          }}>
                            {inv.status || 'draft'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0' }}>
                          <select
                            value={inv.status || 'draft'}
                            onChange={(e) => handleUpdateStatus(inv.id, e.target.value)}
                            style={{
                              padding: '0.5rem',
                              border: '1px solid var(--color-border)',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              backgroundColor: 'var(--bg-soft)',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                          </select>
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
    </AdminLayout>
  )
}
