import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2 } from 'lucide-react'
import { addProject } from '../../firebase/collections'
import { createBillingInvoice } from '../../firebase/billing'
import { sendWelcomeEmail } from '../../firebase/notifications'

const STACKS = [
  { name: 'Firebase', type: 'backend', costTypes: ['monthly', 'pay-as-you-go'] },
  { name: 'Render', type: 'hosting', costTypes: ['monthly', 'pay-as-you-go'] },
  { name: 'MongoDB', type: 'database', costTypes: ['monthly', 'annual'] },
  { name: 'Supabase', type: 'database', costTypes: ['monthly', 'pay-as-you-go'] },
  { name: 'Vercel', type: 'hosting', costTypes: ['monthly', 'pay-as-you-go'] },
  { name: 'AWS', type: 'cloud', costTypes: ['monthly', 'pay-as-you-go'] },
  { name: 'Google Cloud', type: 'cloud', costTypes: ['monthly', 'pay-as-you-go'] },
  { name: 'Stripe', type: 'payment', costTypes: ['per-transaction'] },
  { name: 'SendGrid', type: 'email', costTypes: ['monthly', 'pay-as-you-go'] },
  { name: 'Cloudflare', type: 'cdn', costTypes: ['monthly', 'annual'] },
  { name: 'Domain Registration', type: 'domain', costTypes: ['annual'] },
  { name: 'SSL Certificate', type: 'security', costTypes: ['annual', 'monthly'] },
  { name: 'Server Management', type: 'service', costTypes: ['monthly', 'annual'] },
]

export default function ProjectFormModal({ isOpen, onClose, onSubmit }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Project Details
    name: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    domain: '',

    // Pricing
    packageName: '',
    clientPaymentMonthly: 0,
    clientPaymentAnnual: 0,
    paymentCycle: 'monthly', // monthly or annual
    billingStartDate: new Date().toISOString().split('T')[0],
    billingEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

    // Infrastructure Stacks
    stacks: [],
    deliverables: [],

    // Additional
    description: '',
    status: 'active',
  })

  const [newStack, setNewStack] = useState({
    name: '',
    costPerMonth: 0,
    costPerYear: 0,
    billingCycle: 'monthly',
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })

  const [newDeliverable, setNewDeliverable] = useState({
    name: '',
  })

  const addStack = () => {
    if (newStack.name) {
      setFormData({
        ...formData,
        stacks: [...formData.stacks, { ...newStack, id: Date.now() }],
      })
      setNewStack({
        name: '',
        costPerMonth: 0,
        costPerYear: 0,
        billingCycle: 'monthly',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
    }
  }

  const removeStack = (id) => {
    setFormData({
      ...formData,
      stacks: formData.stacks.filter(s => s.id !== id),
    })
  }

  const addDeliverable = () => {
    if (newDeliverable.name.trim()) {
      setFormData({
        ...formData,
        deliverables: [...formData.deliverables, {
          id: Date.now(),
          name: newDeliverable.name,
          status: 'pending',
        }],
      })
      setNewDeliverable({ name: '' })
    }
  }

  const removeDeliverable = (id) => {
    setFormData({
      ...formData,
      deliverables: formData.deliverables.filter(d => d.id !== id),
    })
  }

  const calculateTotalCost = () => {
    const stackCost = formData.stacks.reduce((sum, stack) => {
      return sum + (formData.paymentCycle === 'monthly' ? parseFloat(stack.costPerMonth) : parseFloat(stack.costPerYear) / 12)
    }, 0)
    return stackCost
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const projectData = {
        ...formData,
        clientPaymentMonthly: parseFloat(formData.clientPaymentMonthly),
        clientPaymentAnnual: parseFloat(formData.clientPaymentAnnual),
        stacksCost: calculateTotalCost(),
        margin: parseFloat(formData.clientPaymentMonthly) - calculateTotalCost(),
        startDate: new Date(formData.billingStartDate),
        dueDate: new Date(formData.billingEndDate),
        budget: {
          quoted: parseFloat(formData.clientPaymentMonthly) * 12,
          spent: 0,
          currency: 'GHS',
        },
        team: [],
        deliverables: [],
      }

      const newProject = await addProject(projectData)

      // Auto-generate first billing invoice
      try {
        await createBillingInvoice({ ...projectData, id: newProject })
      } catch (err) {
        console.error('Warning: Could not create billing invoice:', err)
      }

      // Send branded welcome email to client
      try {
        await sendWelcomeEmail({ ...projectData, id: newProject })
      } catch (err) {
        console.error('Warning: Could not send welcome email:', err)
      }

      onSubmit()
      setFormData({
        name: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        domain: '',
        packageName: '',
        clientPaymentMonthly: 0,
        clientPaymentAnnual: 0,
        paymentCycle: 'monthly',
        billingStartDate: new Date().toISOString().split('T')[0],
        billingEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stacks: [],
        description: '',
        status: 'active',
      })
      setStep(1)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'var(--color-background)',
          borderRadius: '14px',
          width: '90%',
          maxWidth: '700px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '2rem',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
              Create New Project
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Step {step} of 3 — {step === 1 ? 'Project Details' : step === 2 ? 'Infrastructure & Costs' : 'Review & Create'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1) }}>
          {/* Step 1: Project Details */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Acme Logistics Portal, TechStart Dashboard"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
                  What is the project/business name? (Client will see this)
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                  Package Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Starter, Professional, Enterprise, Basic SaaS"
                  value={formData.packageName}
                  onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                  className="input"
                  required
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
                  Tier/plan name for this project (e.g., which level of service)
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., John Mensah, Ama Osei"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="input"
                  required
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
                  Primary client contact person
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                  Contact Email *
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="input"
                  required
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
                  Client will receive invoices & updates here
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                  Contact Phone
                </label>
                <input
                  type="tel"
                  placeholder="+233 XX XXX XXXX or 024 XXX XXXX"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="input"
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
                  Client phone number (Ghana format or international)
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                  Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g., acme.com, app.techstart.io"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="input"
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
                  If applicable. Leave blank if no domain yet
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                  Project Description
                </label>
                <textarea
                  placeholder="What does this project do? What problem does it solve? e.g., Logistics management platform for tracking shipments..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  style={{ minHeight: '80px' }}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
                  Brief overview of project scope (internal notes only)
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Financial Model */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Financial Overview - Upfront + Recurring + Expenses */}
              <div style={{
                background: 'linear-gradient(135deg, var(--bg-soft) 0%, var(--color-surface) 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '2px solid var(--sg-accent)',
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                  💰 Client Payments & Your Expenses
                </h3>

                {/* Three-column financial summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {/* One-Time Fee */}
                  {parseFloat(formData.clientPaymentMonthly || 0) > 0 && (
                    <div style={{
                      background: 'var(--color-background)',
                      padding: '1.25rem',
                      borderRadius: '10px',
                      border: '2px solid #8b5cf6',
                    }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                        One-Time (Setup)
                      </p>
                      <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#8b5cf6', margin: 0 }}>
                        GHS {parseFloat(formData.clientPaymentMonthly || 0).toFixed(2)}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                        paid upfront
                      </p>
                    </div>
                  )}

                  {/* Recurring Fee */}
                  <div style={{
                    background: 'var(--color-background)',
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: '2px solid #0891b2',
                  }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0891b2', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      Recurring
                    </p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0891b2', margin: 0 }}>
                      GHS {parseFloat(formData.clientPaymentAnnual || 0).toFixed(2)}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                      {formData.paymentCycle === 'annual' ? 'per year' : 'per month'}
                    </p>
                  </div>

                  {/* Your Monthly Expenses */}
                  <div style={{
                    background: 'var(--color-background)',
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: '2px solid #ef4444',
                  }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      Your Expenses
                    </p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ef4444', margin: 0 }}>
                      GHS {formData.stacks.reduce((sum, s) => sum + parseFloat(s.costPerMonth || 0), 0).toFixed(2)}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                      per month
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 1: Client Pricing - Upfront + Recurring */}
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                  Step 1: How much does the CLIENT pay?
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  Set your revenue. Include one-time fees (development) and recurring fees (maintenance/hosting).
                </p>

                {/* One-Time Setup/Development Fee */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.75rem' }}>
                    💰 One-Time Fee (Setup/Development)
                  </h4>
                  <input
                    type="number"
                    placeholder="e.g., 10000, 50000, 100000 (or 0 if no upfront fee)"
                    value={formData.clientPaymentMonthly}
                    onChange={(e) => setFormData({ ...formData, clientPaymentMonthly: e.target.value })}
                    className="input"
                    style={{ fontSize: '1.1rem', fontWeight: 600, padding: '0.75rem' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
                    Large upfront payment (e.g., website development). Leave at 0 if none.
                  </p>
                </div>

                {/* Recurring Monthly/Annual Fee */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.75rem' }}>
                    🔄 Recurring Fee (Maintenance/Hosting/Support)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
                        Monthly
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 500, 1500, 5000"
                        value={formData.clientPaymentAnnual}
                        onChange={(e) => setFormData({ ...formData, clientPaymentAnnual: e.target.value })}
                        className="input"
                        style={{ fontSize: '1rem', fontWeight: 600, padding: '0.75rem' }}
                      />
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                        Monthly hosting/domain/email/SMS fees
                      </p>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
                        Annual (if paying yearly)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 5000, 18000, 60000 (optional)"
                        value={formData.paymentCycle === 'annual' ? formData.clientPaymentMonthly : 0}
                        onChange={(e) => {}}
                        className="input"
                        disabled
                        style={{ fontSize: '1rem', fontWeight: 600, padding: '0.75rem', opacity: 0.6 }}
                      />
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                        Auto-calculated (12x monthly)
                      </p>
                    </div>
                  </div>

                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                    How often do they pay recurring fees?
                  </label>
                  <select
                    value={formData.paymentCycle}
                    onChange={(e) => setFormData({ ...formData, paymentCycle: e.target.value })}
                    className="input"
                  >
                    <option value="monthly">Monthly (invoice every month)</option>
                    <option value="annual">Annual (invoice once per year)</option>
                  </select>
                </div>
              </div>

              {/* Infrastructure Stacks */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                  Step 2: What are YOUR monthly EXPENSES?
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  List every service you pay for to keep this project running. This is YOUR COST, not what client pays. (Firebase, Render, MongoDB, domain, etc.)
                </p>

                {/* Add Stack Form */}
                <div style={{
                  background: 'var(--bg-soft)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: '1px dashed var(--color-border)',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 600 }}>
                        Service/Stack
                      </label>
                      <select
                        value={newStack.name}
                        onChange={(e) => setNewStack({ ...newStack, name: e.target.value })}
                        className="input"
                      >
                        <option value="">Select a service</option>
                        {STACKS.map(stack => (
                          <option key={stack.name} value={stack.name}>{stack.name}</option>
                        ))}
                      </select>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                        Which service? (Firebase, Render, etc.)
                      </p>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 600 }}>
                        Monthly Cost (GHS)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 10, 50, 200"
                        value={newStack.costPerMonth}
                        onChange={(e) => setNewStack({ ...newStack, costPerMonth: e.target.value })}
                        className="input"
                      />
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                        What you pay per month
                      </p>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 600 }}>
                        Annual Cost (GHS)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 100, 600, 2400"
                        value={newStack.costPerYear}
                        onChange={(e) => setNewStack({ ...newStack, costPerYear: e.target.value })}
                        className="input"
                      />
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                        What you pay per year
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 600 }}>
                        Billing Cycle
                      </label>
                      <select
                        value={newStack.billingCycle}
                        onChange={(e) => setNewStack({ ...newStack, billingCycle: e.target.value })}
                        className="input"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                        <option value="pay-as-you-go">Pay-as-you-go</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 600 }}>
                        Renewal Date
                      </label>
                      <input
                        type="date"
                        value={newStack.renewalDate}
                        onChange={(e) => setNewStack({ ...newStack, renewalDate: e.target.value })}
                        className="input"
                      />
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                        When does subscription renew?
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={addStack}
                        style={{
                          padding: '0.65rem 1.5rem',
                          background: 'var(--sg-accent)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Plus size={16} /> Add Service
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stacks List */}
                {formData.stacks.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    {formData.stacks.map(stack => (
                      <div
                        key={stack.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{stack.name}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            GHS {parseFloat(stack.costPerMonth).toFixed(2)}/mo • GHS {parseFloat(stack.costPerYear).toFixed(2)}/yr • Renews: {stack.renewalDate}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStack(stack.id)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cost Summary */}
                <div style={{
                  background: 'var(--bg-soft)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Total Stack Cost (Monthly)</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--sg-accent)' }}>
                        GHS {formData.stacks.reduce((sum, s) => sum + parseFloat(s.costPerMonth), 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Your Margin (Monthly)</p>
                      <p style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: parseFloat(formData.clientPaymentMonthly) - formData.stacks.reduce((sum, s) => sum + parseFloat(s.costPerMonth), 0) > 0 ? '#10b981' : '#ef4444'
                      }}>
                        GHS {(parseFloat(formData.clientPaymentMonthly) - formData.stacks.reduce((sum, s) => sum + parseFloat(s.costPerMonth), 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                  Step 3: What will you DELIVER to the client?
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  List all features/milestones you'll deliver. Client sees this list and can track progress. (Optional but recommended for transparency)
                </p>

                {/* Add Deliverable */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}>
                  <input
                    type="text"
                    placeholder="e.g., Homepage Design, Backend API Setup, Database Schema, Testing, Deployment"
                    value={newDeliverable.name}
                    onChange={(e) => setNewDeliverable({ ...newDeliverable, name: e.target.value })}
                    className="input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={addDeliverable}
                    style={{
                      padding: '0.65rem 1.5rem',
                      background: 'var(--sg-accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Plus size={16} /> Add Task
                  </button>
                </div>

                {/* Deliverables List */}
                {formData.deliverables.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    {formData.deliverables.map(deliverable => (
                      <div
                        key={deliverable.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <p style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>
                          {deliverable.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeDeliverable(deliverable.id)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: 'var(--bg-soft)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                  Project Summary
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                  <div>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Project Name</p>
                    <p style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{formData.name}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Contact</p>
                    <p style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{formData.contactPerson}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Domain</p>
                    <p style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{formData.domain}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Package</p>
                    <p style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{formData.packageName}</p>
                  </div>
                </div>
              </div>

              {/* FINANCIAL SUMMARY - CLIENT PAYMENTS & EXPENSES */}
              <div style={{
                background: 'linear-gradient(135deg, var(--bg-soft) 0%, var(--color-surface) 100%)',
                padding: '2rem',
                borderRadius: '12px',
                border: '2px solid var(--sg-accent)',
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                  💰 Client Payments & Your Operating Costs
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: parseFloat(formData.clientPaymentMonthly || 0) > 0 ? '1fr 1fr 1fr' : '1fr 1fr', gap: '1.5rem' }}>
                  {/* One-Time Setup Fee */}
                  {parseFloat(formData.clientPaymentMonthly || 0) > 0 && (
                    <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--color-background)', borderRadius: '10px', border: '2px solid #8b5cf6' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8b5cf6', margin: '0 0 0.75rem 0', textTransform: 'uppercase' }}>
                        One-Time Setup Fee
                      </p>
                      <p style={{ fontSize: '2rem', fontWeight: 900, color: '#8b5cf6', margin: 0 }}>
                        GHS {parseFloat(formData.clientPaymentMonthly || 0).toFixed(2)}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                        paid upfront (development/setup)
                      </p>
                    </div>
                  )}

                  {/* Recurring Fee */}
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--color-background)', borderRadius: '10px', border: '2px solid #0891b2' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0891b2', margin: '0 0 0.75rem 0', textTransform: 'uppercase' }}>
                      Recurring Fee
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 900, color: '#0891b2', margin: 0 }}>
                      GHS {parseFloat(formData.clientPaymentAnnual || 0).toFixed(2)}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                      {formData.paymentCycle === 'annual' ? 'annually' : 'monthly'} (hosting/maintenance/support)
                    </p>
                  </div>

                  {/* Your Monthly Operating Costs */}
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--color-background)', borderRadius: '10px', border: '2px solid #ef4444' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444', margin: '0 0 0.75rem 0', textTransform: 'uppercase' }}>
                      Your Monthly Costs
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444', margin: 0 }}>
                      GHS {formData.stacks.reduce((sum, s) => sum + parseFloat(s.costPerMonth || 0), 0).toFixed(2)}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                      infrastructure/services
                    </p>
                  </div>
                </div>
              </div>

              {formData.stacks.length > 0 && (
                <div style={{
                  background: 'var(--bg-soft)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '2px solid #ef4444',
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ef4444' }}>
                    💸 Your Monthly Expenses ({formData.stacks.length} service{formData.stacks.length !== 1 ? 's' : ''})
                  </h3>
                  {formData.stacks.map((stack, idx) => (
                    <div key={stack.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: idx < formData.stacks.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>{stack.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0 0' }}>{stack.billingCycle === 'annual' ? 'Annual' : stack.billingCycle === 'monthly' ? 'Monthly' : 'Pay-as-you-go'}</p>
                      </div>
                      <p style={{ fontWeight: 700, color: '#ef4444', fontSize: '1.1rem' }}>GHS {parseFloat(stack.costPerMonth).toFixed(2)}/mo</p>
                    </div>
                  ))}
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #ef4444' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontWeight: 700, color: 'var(--color-text-heading)', fontSize: '1rem' }}>TOTAL MONTHLY:</p>
                      <p style={{ fontWeight: 900, color: '#ef4444', fontSize: '1.3rem' }}>GHS {formData.stacks.reduce((sum, s) => sum + parseFloat(s.costPerMonth), 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {formData.deliverables.length > 0 && (
                <div style={{
                  background: 'var(--bg-soft)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                    Deliverables ({formData.deliverables.length} tasks)
                  </h3>
                  {formData.deliverables.map((del, i) => (
                    <div key={del.id} style={{ padding: '0.75rem 0', borderBottom: i < formData.deliverables.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                      <p style={{ fontWeight: 500, color: 'var(--color-text-heading)', margin: 0 }}>○ {del.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--sg-accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {step === 3 ? 'Create Project' : 'Next'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
