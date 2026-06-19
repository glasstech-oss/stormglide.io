import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { MessageSquare, ArrowRight, Check } from 'lucide-react'
import { getInquiries, updateInquiry, addProject } from '../../firebase/collections'
import PageLayout from '../../components/layout/PageLayout'

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [response, setResponse] = useState('')
  const [showConvert, setShowConvert] = useState(false)
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    budget: '',
    timeline: '',
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getInquiries()
        setInquiries(data)
      } catch (error) {
        console.error('Error loading inquiries:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleStatusChange = async (inquiryId, status) => {
    try {
      await updateInquiry(inquiryId, { status })
      const updated = await getInquiries()
      setInquiries(updated)
    } catch (error) {
      console.error('Error updating inquiry:', error)
    }
  }

  const handleAddResponse = async () => {
    if (!selectedInquiry || !response.trim()) return
    try {
      const currentConversation = selectedInquiry.conversation || []
      currentConversation.push({
        sender: 'team',
        message: response,
        timestamp: new Date().toISOString(),
      })
      await updateInquiry(selectedInquiry.id, {
        conversation: currentConversation,
      })
      setResponse('')
      const updated = await getInquiries()
      setInquiries(updated)
      const refreshed = updated.find(i => i.id === selectedInquiry.id)
      setSelectedInquiry(refreshed)
    } catch (error) {
      console.error('Error adding response:', error)
    }
  }

  const handleConvertToProject = async (e) => {
    e.preventDefault()
    try {
      await addProject({
        clientId: selectedInquiry.clientId || selectedInquiry.id,
        name: projectForm.name || selectedInquiry.clientName,
        status: 'proposal',
        description: projectForm.description || selectedInquiry.message,
        budget: {
          quoted: parseInt(projectForm.budget) || 0,
          spent: 0,
          currency: 'GHS',
        },
        startDate: new Date(),
        dueDate: new Date(Date.now() + (parseInt(projectForm.timeline) || 30) * 24 * 60 * 60 * 1000),
        team: [],
      })
      await handleStatusChange(selectedInquiry.id, 'accepted')
      setShowConvert(false)
      setProjectForm({ name: '', description: '', budget: '', timeline: '' })
    } catch (error) {
      console.error('Error converting to project:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#ef4444'
      case 'contacted': return '#f59e0b'
      case 'proposal_sent': return '#3b82f6'
      case 'accepted': return '#10b981'
      case 'rejected': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const inquiryStats = {
    new: inquiries.filter(i => i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    proposed: inquiries.filter(i => i.status === 'proposal_sent').length,
    accepted: inquiries.filter(i => i.status === 'accepted').length,
  }

  return (
    <PageLayout>
      <Helmet>
        <title>Inquiries Management | Admin | StormGlide</title>
      </Helmet>

      <div style={{ padding: '3rem 2rem', background: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
              Inquiries Management
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
              Track and convert leads into projects
            </p>
          </motion.div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            {[
              { label: 'New', count: inquiryStats.new, color: '#ef4444' },
              { label: 'Contacted', count: inquiryStats.contacted, color: '#f59e0b' },
              { label: 'Proposed', count: inquiryStats.proposed, color: '#3b82f6' },
              { label: 'Accepted', count: inquiryStats.accepted, color: '#10b981' },
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
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>
                  {stat.count}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Inquiries Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* Inquiries List */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '2rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                maxHeight: '700px',
                overflowY: 'auto',
              }}
            >
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                All Inquiries ({inquiries.length})
              </h2>
              {inquiries.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>No inquiries yet</p>
              ) : (
                inquiries.map((inq, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedInquiry(inq)}
                    style={{
                      padding: '1rem',
                      background: selectedInquiry?.id === inq.id ? 'var(--bg-soft)' : 'transparent',
                      border: selectedInquiry?.id === inq.id ? '1px solid var(--sg-accent)' : 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '0.75rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-text-heading)' }}>
                      {inq.clientName}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                      {inq.serviceType}
                    </p>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: `color-mix(in srgb, ${getStatusColor(inq.status)} 15%, transparent)`,
                      color: getStatusColor(inq.status),
                      textTransform: 'capitalize',
                    }}>
                      {inq.status}
                    </span>
                  </div>
                ))
              )}
            </motion.div>

            {/* Inquiry Detail */}
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
              {selectedInquiry ? (
                <>
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                      {selectedInquiry.clientName}
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                      {selectedInquiry.clientEmail} • {selectedInquiry.clientPhone}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      {selectedInquiry.message}
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                      Status
                    </label>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        backgroundColor: 'var(--bg-soft)',
                        marginBottom: '1rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => setShowConvert(!showConvert)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'var(--sg-accent)',
                        color: 'var(--color-background)',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      <ArrowRight size={18} />
                      Convert to Project
                    </button>
                  </div>

                  {/* Convert Form */}
                  {showConvert && (
                    <form onSubmit={handleConvertToProject} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                        Create Project
                      </h3>
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={projectForm.name}
                        onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Budget (GHS)"
                        value={projectForm.budget}
                        onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Timeline (days)"
                        value={projectForm.timeline}
                        onChange={(e) => setProjectForm({ ...projectForm, timeline: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Check size={18} style={{ marginRight: '0.5rem', display: 'inline' }} />
                        Create Project
                      </button>
                    </form>
                  )}

                  {/* Conversation */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                      Conversation
                    </h3>
                    {selectedInquiry.conversation?.map((msg, i) => (
                      <div key={i} style={{
                        padding: '1rem',
                        background: msg.sender === 'team' ? 'var(--bg-soft)' : 'transparent',
                        borderRadius: '8px',
                        marginBottom: '0.75rem',
                        borderLeft: `4px solid ${msg.sender === 'team' ? 'var(--sg-accent)' : 'var(--color-border)'}`,
                      }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>
                          {msg.sender === 'team' ? 'Team' : 'Client'}
                        </p>
                        <p style={{ color: 'var(--color-text-heading)' }}>
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add Response */}
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Add response..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      minHeight: '80px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    onClick={handleAddResponse}
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
                    Send Response
                  </button>
                </>
              ) : (
                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
                  Select an inquiry to view details
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
