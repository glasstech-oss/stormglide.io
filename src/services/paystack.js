/**
 * Paystack Payment Integration Service
 * Handles invoice payments and transactions
 */

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_demo_key'
const PAYSTACK_API_URL = 'https://api.paystack.co'

export const initializePaymentModal = () => {
  if (window.PaystackPop) {
    return window.PaystackPop
  }

  // Load Paystack script if not already loaded
  const script = document.createElement('script')
  script.src = 'https://js.paystack.co/v1/inline.js'
  script.async = true
  document.head.appendChild(script)

  return new Promise((resolve) => {
    script.onload = () => resolve(window.PaystackPop)
  })
}

export const createPaystackPayment = async (invoiceData) => {
  const {
    invoiceNumber,
    amount,
    clientEmail,
    clientName,
    projectName,
    invoiceId,
  } = invoiceData

  const PaystackPop = await initializePaymentModal()

  return new Promise((resolve, reject) => {
    PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: clientEmail,
      amount: amount * 100, // Paystack expects amount in kobo (GHS * 100)
      currency: 'GHS',
      ref: `INV-${invoiceId}-${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: 'Invoice',
            variable_name: 'invoice_number',
            value: invoiceNumber,
          },
          {
            display_name: 'Client',
            variable_name: 'client_name',
            value: clientName,
          },
          {
            display_name: 'Project',
            variable_name: 'project_name',
            value: projectName,
          },
        ],
      },
      onClose: () => {
        reject(new Error('Payment modal closed'))
      },
      callback: (response) => {
        resolve(response)
      },
    })
    PaystackPop.openIframe()
  })
}

export const verifyPaystackPayment = async (reference, serverKey) => {
  try {
    const response = await fetch(
      `${PAYSTACK_API_URL}/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${serverKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Payment verification failed')
    }

    const data = await response.json()
    return data.data // Returns transaction data if successful
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw error
  }
}

export const getPaystackCustomers = async (serverKey) => {
  try {
    const response = await fetch(`${PAYSTACK_API_URL}/customer`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${serverKey}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch customers')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw error
  }
}

export const createPaystackCustomer = async (email, firstName, lastName, serverKey) => {
  try {
    const response = await fetch(`${PAYSTACK_API_URL}/customer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create customer')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

export const getPaystackTransactionHistory = async (serverKey, limit = 10, offset = 0) => {
  try {
    const response = await fetch(
      `${PAYSTACK_API_URL}/transaction?perPage=${limit}&page=${offset + 1}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${serverKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch transaction history')
    }

    const data = await response.json()
    return {
      transactions: data.data,
      pagination: data.meta?.pagination,
    }
  } catch (error) {
    console.error('Error fetching transaction history:', error)
    throw error
  }
}

export const generatePaymentLink = (invoiceData) => {
  const {
    invoiceNumber,
    amount,
    clientEmail,
    clientName,
    invoiceId,
  } = invoiceData

  // Construct Paystack payment link for sharing
  const encodedEmail = encodeURIComponent(clientEmail)
  const encodedRef = encodeURIComponent(`INV-${invoiceId}-${Date.now()}`)

  return `https://pay.paystack.com/?email=${encodedEmail}&amount=${amount * 100}&reference=${encodedRef}`
}

export default {
  initializePaymentModal,
  createPaystackPayment,
  verifyPaystackPayment,
  getPaystackCustomers,
  createPaystackCustomer,
  getPaystackTransactionHistory,
  generatePaymentLink,
}
