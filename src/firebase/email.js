import { httpsCallable } from 'firebase/functions'
import { functions } from './db'

/**
 * Email notification service
 * Calls Firebase Cloud Functions to send emails via SendGrid
 */

export const sendInquiryNotification = async (inquiryData) => {
  try {
    const sendEmail = httpsCallable(functions, 'sendInquiryNotification')
    await sendEmail({
      clientName: inquiryData.clientName,
      clientEmail: inquiryData.clientEmail,
      clientPhone: inquiryData.clientPhone,
      serviceType: inquiryData.serviceType,
      message: inquiryData.message,
    })
  } catch (error) {
    console.error('Error sending inquiry notification:', error)
  }
}

export const sendInvoiceNotification = async (invoiceData, clientEmail) => {
  try {
    const sendEmail = httpsCallable(functions, 'sendInvoiceEmail')
    await sendEmail({
      clientEmail,
      invoiceNumber: invoiceData.invoiceNumber,
      amount: invoiceData.amount,
      dueDate: invoiceData.dueAt,
      projectName: invoiceData.projectName,
    })
  } catch (error) {
    console.error('Error sending invoice email:', error)
  }
}

export const sendTicketNotification = async (ticketData, recipientEmail) => {
  try {
    const sendEmail = httpsCallable(functions, 'sendTicketEmail')
    await sendEmail({
      recipientEmail,
      ticketTitle: ticketData.title,
      ticketDescription: ticketData.description,
      priority: ticketData.priority,
      ticketId: ticketData.id,
    })
  } catch (error) {
    console.error('Error sending ticket notification:', error)
  }
}

export const sendTicketResponseNotification = async (ticketId, message, recipientEmail) => {
  try {
    const sendEmail = httpsCallable(functions, 'sendTicketResponseEmail')
    await sendEmail({
      recipientEmail,
      ticketId,
      message,
      responseType: 'team-response',
    })
  } catch (error) {
    console.error('Error sending ticket response notification:', error)
  }
}
