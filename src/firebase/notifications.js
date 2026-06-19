import { functions } from './db'
import { httpsCallable } from 'firebase/functions'

/**
 * Send project welcome email to client
 */
export const sendWelcomeEmail = async (project) => {
  try {
    const sendEmail = httpsCallable(functions, 'sendWelcomeEmail')
    const result = await sendEmail({
      to: project.contactEmail,
      clientName: project.contactPerson,
      projectName: project.name,
      domain: project.domain,
      packageName: project.packageName,
      monthlyPrice: project.clientPaymentMonthly,
      annualPrice: project.clientPaymentAnnual,
      startDate: new Date(project.billingStartDate).toLocaleDateString(),
    })
    return result.data
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw error
  }
}

/**
 * Send invoice to client
 */
export const sendInvoiceEmail = async (invoice, project) => {
  try {
    const sendEmail = httpsCallable(functions, 'sendInvoiceEmail')
    const result = await sendEmail({
      to: project.contactEmail,
      clientName: project.contactPerson,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      currency: invoice.currency,
      description: invoice.description,
      projectName: project.name,
      domain: project.domain,
      dueDate: new Date(invoice.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString(),
      paymentLink: `https://stormglideio.web.app/client/payment/${invoice.id}`,
    })
    return result.data
  } catch (error) {
    console.error('Error sending invoice email:', error)
    throw error
  }
}

/**
 * Send renewal reminder email (30 days before expiry)
 */
export const sendRenewalReminder = async (project) => {
  try {
    const expiryDate = new Date(project.billingEndDate.seconds ? project.billingEndDate.seconds * 1000 : project.billingEndDate)
    const daysLeft = Math.floor((expiryDate - new Date()) / (1000 * 60 * 60 * 24))

    const sendEmail = httpsCallable(functions, 'sendRenewalReminder')
    const result = await sendEmail({
      to: project.contactEmail,
      clientName: project.contactPerson,
      projectName: project.name,
      domain: project.domain,
      expiryDate: expiryDate.toLocaleDateString(),
      daysLeft: daysLeft,
      renewalAmount: project.paymentCycle === 'annual' ? project.clientPaymentAnnual : project.clientPaymentMonthly,
      renewalLink: `https://stormglideio.web.app/client/renew/${project.id}`,
    })
    return result.data
  } catch (error) {
    console.error('Error sending renewal reminder:', error)
    throw error
  }
}

/**
 * Send payment confirmation email
 */
export const sendPaymentConfirmation = async (project, invoice, transactionRef) => {
  try {
    const sendEmail = httpsCallable(functions, 'sendPaymentConfirmation')
    const result = await sendEmail({
      to: project.contactEmail,
      clientName: project.contactPerson,
      projectName: project.name,
      amount: invoice.amount,
      currency: invoice.currency,
      transactionRef: transactionRef,
      invoiceNumber: invoice.invoiceNumber,
      paymentDate: new Date().toLocaleDateString(),
      nextRenewalDate: project.billingEndDate,
    })
    return result.data
  } catch (error) {
    console.error('Error sending payment confirmation:', error)
    throw error
  }
}

/**
 * Send service expiration warning (7 days before)
 */
export const sendExpirationWarning = async (project) => {
  try {
    const sendEmail = httpsCallable(functions, 'sendExpirationWarning')
    const result = await sendEmail({
      to: project.contactEmail,
      clientName: project.contactPerson,
      projectName: project.name,
      domain: project.domain,
      expiryDate: new Date(project.billingEndDate.seconds ? project.billingEndDate.seconds * 1000 : project.billingEndDate).toLocaleDateString(),
      renewalAmount: project.paymentCycle === 'annual' ? project.clientPaymentAnnual : project.clientPaymentMonthly,
      renewalLink: `https://stormglideio.web.app/client/renew/${project.id}`,
    })
    return result.data
  } catch (error) {
    console.error('Error sending expiration warning:', error)
    throw error
  }
}

/**
 * Send infrastructure cost breakdown email
 */
export const sendCostBreakdownEmail = async (project) => {
  try {
    const sendEmail = httpsCallable(functions, 'sendCostBreakdown')
    const result = await sendEmail({
      to: project.contactEmail,
      clientName: project.contactPerson,
      projectName: project.name,
      packageName: project.packageName,
      infrastructure: project.stacks.map(stack => ({
        name: stack.name,
        cost: project.paymentCycle === 'annual' ? stack.costPerYear : stack.costPerMonth,
        renewalDate: stack.renewalDate,
      })),
      totalCost: project.stacks.reduce((sum, s) => sum + (project.paymentCycle === 'annual' ? s.costPerYear : s.costPerMonth), 0),
      yourPrice: project.paymentCycle === 'annual' ? project.clientPaymentAnnual : project.clientPaymentMonthly,
    })
    return result.data
  } catch (error) {
    console.error('Error sending cost breakdown email:', error)
    throw error
  }
}
