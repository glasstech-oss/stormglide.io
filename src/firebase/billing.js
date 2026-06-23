import { addInvoice } from './collections'

/**
 * Automatically create billing invoices for a project
 * Called when a project is created or billing cycle is updated
 */
export const createBillingInvoice = async (project) => {
  try {
    const amount = project.paymentCycle === 'annual'
      ? parseFloat(project.clientPaymentAnnual)
      : parseFloat(project.clientPaymentMonthly)

    const invoiceNumber = `INV-${Date.now()}`

    const invoiceData = {
      projectId: project.id,
      clientId: project.contactEmail,
      clientName: project.contactPerson,
      clientEmail: project.contactEmail,
      email: project.contactEmail,
      phone: project.contactPhone,
      amount: amount,
      currency: 'GHS',
      description: `${project.packageName} - ${project.name}${project.domain ? ` (${project.domain})` : ''}`,
      status: 'pending',
      invoiceNumber: invoiceNumber,
      paystackReference: invoiceNumber, // Used for webhook tracking
      itemizedBreakdown: project.stacks.map(stack => ({
        item: stack.name,
        rate: project.paymentCycle === 'annual' ? stack.costPerYear : stack.costPerMonth,
        description: `${stack.billingCycle} billing`
      })),
      billingDetails: {
        projectName: project.name,
        packageName: project.packageName,
        domain: project.domain,
        contactPerson: project.contactPerson,
        billingCycle: project.paymentCycle,
        nextRenewalDate: new Date(new Date(project.billingEndDate).getTime() + 24 * 60 * 60 * 1000),
      },
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
    }

    const result = await addInvoice(invoiceData)
    return result
  } catch (error) {
    console.error('Error creating billing invoice:', error)
    throw error
  }
}

/**
 * Check which projects have upcoming renewal dates
 * Returns projects expiring within X days
 */
export const getExpiringProjects = (projects, daysUntilExpiry = 30) => {
  const now = new Date()

  return projects.filter(project => {
    if (!project.billingEndDate) return false

    const expiryDate = new Date(project.billingEndDate.seconds ? project.billingEndDate.seconds * 1000 : project.billingEndDate)
    const daysLeft = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24))

    return daysLeft > 0 && daysLeft <= daysUntilExpiry
  })
}

/**
 * Generate renewal reminder for a project
 */
export const generateRenewalReminder = (project) => {
  const expiryDate = new Date(project.billingEndDate.seconds ? project.billingEndDate.seconds * 1000 : project.billingEndDate)
  const daysLeft = Math.floor((expiryDate - new Date()) / (1000 * 60 * 60 * 24))

  return {
    projectId: project.id,
    projectName: project.name,
    clientName: project.contactPerson,
    clientEmail: project.contactEmail,
    domain: project.domain,
    renewalDate: expiryDate,
    daysUntilRenewal: daysLeft,
    amount: project.paymentCycle === 'annual'
      ? parseFloat(project.clientPaymentAnnual)
      : parseFloat(project.clientPaymentMonthly),
    message: `Your ${project.packageName} service expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Please renew to avoid service interruption.`
  }
}

/**
 * Calculate infrastructure costs for a project
 */
export const calculateInfrastructureCost = (stacks, billingCycle = 'monthly') => {
  if (!stacks || stacks.length === 0) return 0

  return stacks.reduce((total, stack) => {
    const cost = billingCycle === 'annual' ? stack.costPerYear : stack.costPerMonth
    return total + parseFloat(cost || 0)
  }, 0)
}

/**
 * Calculate profit margin for a project
 */
export const calculateMargin = (project) => {
  const clientPayment = project.paymentCycle === 'annual'
    ? parseFloat(project.clientPaymentAnnual)
    : parseFloat(project.clientPaymentMonthly)

  const infrastructureCost = calculateInfrastructureCost(project.stacks, project.paymentCycle === 'annual' ? 'annual' : 'monthly')

  return {
    clientPayment,
    infrastructureCost,
    margin: clientPayment - infrastructureCost,
    marginPercentage: infrastructureCost > 0 ? ((clientPayment - infrastructureCost) / clientPayment * 100).toFixed(1) : 0
  }
}

/**
 * Format project details for client notification
 */
export const formatProjectForClient = (project) => {
  const margin = calculateMargin(project)

  return {
    projectName: project.name,
    packageName: project.packageName,
    domain: project.domain,
    contactPerson: project.contactPerson,
    paymentCycle: project.paymentCycle,
    monthlyPrice: project.clientPaymentMonthly,
    annualPrice: project.clientPaymentAnnual,
    currentPrice: project.paymentCycle === 'annual' ? project.clientPaymentAnnual : project.clientPaymentMonthly,
    infrastructure: project.stacks.map(stack => ({
      name: stack.name,
      cost: project.paymentCycle === 'annual' ? stack.costPerYear : stack.costPerMonth,
      renewalDate: stack.renewalDate
    })),
    marginSummary: margin
  }
}
