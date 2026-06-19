import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2 } from 'lucide-react'
import { addProject } from '../../firebase/collections'
import { createBillingInvoice } from '../../firebase/billing'

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Package Name (e.g., Starter, Professional, Enterprise)"
                value={formData.packageName}
                onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Contact Person Name"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="input"
                required
              />
              <input
                type="email"
                placeholder="Contact Email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="input"
                required
              />
              <input
                type="tel"
                placeholder="Contact Phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="input"
              />
              <input
                type="text"
                placeholder="Domain (e.g., example.com)"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="input"
              />
              <textarea
                placeholder="Project Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                style={{ minHeight: '80px' }}
              />
            </div>
          )}

          {/* Step 2: Pricing & Infrastructure */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Pricing Section */}
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                  Client Pricing
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Monthly Price (GHS)"
                    value={formData.clientPaymentMonthly}
                    onChange={(e) => setFormData({ ...formData, clientPaymentMonthly: e.target.value })}
                    className="input"
                  />
                  <input
                    type="number"
                    placeholder="Annual Price (GHS)"
                    value={formData.clientPaymentAnnual}
                    onChange={(e) => setFormData({ ...formData, clientPaymentAnnual: e.target.value })}
                    className="input"
                  />
                </div>
                <select
                  value={formData.paymentCycle}
                  onChange={(e) => setFormData({ ...formData, paymentCycle: e.target.value })}
                  className="input"
                >
                  <option value="monthly">Monthly Billing</option>
                  <option value="annual">Annual Billing</option>
                </select>
              </div>

              {/* Infrastructure Stacks */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                  Infrastructure Stacks & Costs
                </h3>

                {/* Add Stack Form */}
                <div style={{
                  background: 'var(--bg-soft)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: '1px dashed var(--color-border)',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <select
                      value={newStack.name}
                      onChange={(e) => setNewStack({ ...newStack, name: e.target.value })}
                      className="input"
                    >
                      <option value="">Select Stack</option>
                      {STACKS.map(stack => (
                        <option key={stack.name} value={stack.name}>{stack.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Monthly Cost"
                      value={newStack.costPerMonth}
                      onChange={(e) => setNewStack({ ...newStack, costPerMonth: e.target.value })}
                      className="input"
                    />
                    <input
                      type="number"
                      placeholder="Annual Cost"
                      value={newStack.costPerYear}
                      onChange={(e) => setNewStack({ ...newStack, costPerYear: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem' }}>
                    <select
                      value={newStack.billingCycle}
                      onChange={(e) => setNewStack({ ...newStack, billingCycle: e.target.value })}
                      className="input"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual</option>
                      <option value="pay-as-you-go">Pay-as-you-go</option>
                    </select>
                    <input
                      type="date"
                      value={newStack.renewalDate}
                      onChange={(e) => setNewStack({ ...newStack, renewalDate: e.target.value })}
                      className="input"
                    />
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
                      }}
                    >
                      <Plus size={16} /> Add
                    </button>
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

              <div style={{
                background: 'var(--bg-soft)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                  Pricing & Costs
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Client Pays (Monthly)</p>
                    <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--sg-accent)' }}>
                      GHS {parseFloat(formData.clientPaymentMonthly).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Infrastructure Cost</p>
                    <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ef4444' }}>
                      GHS {formData.stacks.reduce((sum, s) => sum + parseFloat(s.costPerMonth), 0).toFixed(2)}
                    </p>
                  </div>
                  <div style={{ gridColumn: '1 / -1', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Your Profit Margin</p>
                    <p style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: parseFloat(formData.clientPaymentMonthly) - formData.stacks.reduce((sum, s) => sum + parseFloat(s.costPerMonth), 0) > 0 ? '#10b981' : '#ef4444'
                    }}>
                      GHS {(parseFloat(formData.clientPaymentMonthly) - formData.stacks.reduce((sum, s) => sum + parseFloat(s.costPerMonth), 0)).toFixed(2)}/month
                    </p>
                  </div>
                </div>
              </div>

              {formData.stacks.length > 0 && (
                <div style={{
                  background: 'var(--bg-soft)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                    Infrastructure ({formData.stacks.length} stacks)
                  </h3>
                  {formData.stacks.map(stack => (
                    <div key={stack.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                      <p style={{ fontWeight: 500, color: 'var(--color-text-heading)' }}>{stack.name}</p>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>GHS {parseFloat(stack.costPerMonth).toFixed(2)}/mo</p>
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
