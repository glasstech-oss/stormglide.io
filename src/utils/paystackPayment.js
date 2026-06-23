/**
 * Paystack Payment Integration Utilities
 * Generates payment links and handles Paystack initialization
 */

// Your Paystack Public Key (get from Paystack Dashboard → Settings → API Keys)
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_your_public_key_here';

/**
 * Generate a Paystack payment link for an invoice
 * @param {Object} invoiceData - Invoice data
 * @param {string} invoiceData.invoiceNumber - Invoice number (e.g., "INV-001")
 * @param {number} invoiceData.amount - Amount in GHS
 * @param {string} invoiceData.clientEmail - Client email address
 * @param {string} invoiceData.clientName - Client name
 * @param {string} invoiceData.projectName - Project name
 * @param {string} invoiceData.invoiceId - Firestore invoice ID (stored as reference)
 * @returns {string} Paystack payment link
 */
export const generatePaystackPaymentLink = (invoiceData) => {
  const {
    invoiceNumber,
    amount,
    clientEmail,
    clientName,
    projectName,
    invoiceId,
  } = invoiceData;

  // Encode parameters for URL
  const params = new URLSearchParams({
    key: PAYSTACK_PUBLIC_KEY,
    email: clientEmail,
    amount: (amount * 100).toString(), // Paystack expects amount in kobo (1 GHS = 100 kobo)
    ref: invoiceId || invoiceNumber, // Used to track the payment
    metadata: JSON.stringify({
      invoice_number: invoiceNumber,
      project_name: projectName,
      client_name: clientName,
    }),
    currency: 'GHS',
  });

  return `https://checkout.paystack.com/?${params.toString()}`;
};

/**
 * Initialize Paystack checkout (if using inline checkout)
 * @param {Object} config - Paystack config
 * @param {string} config.email - Customer email
 * @param {number} config.amount - Amount in GHS
 * @param {string} config.ref - Unique reference (invoice ID)
 * @param {Function} config.onSuccess - Callback when payment succeeds
 * @param {Function} config.onError - Callback when payment fails
 */
export const initializePaystackCheckout = (config) => {
  if (!window.PaystackPop) {
    console.error('Paystack library not loaded. Add script to index.html');
    return;
  }

  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: (config.amount * 100).toFixed(0), // Convert to kobo
    ref: config.ref,
    currency: 'GHS',
    onClose: () => {
      console.log('Payment window closed');
      if (config.onError) {
        config.onError({ message: 'Payment window closed' });
      }
    },
    onSuccess: (response) => {
      console.log('Payment successful:', response);
      if (config.onSuccess) {
        config.onSuccess(response);
      }
    },
  });

  handler.openIframe();
};

/**
 * Format amount for display (GHS currency)
 * @param {number} amount - Amount in GHS
 * @returns {string} Formatted amount (e.g., "GHS 150.00")
 */
export const formatGHS = (amount) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(amount);
};

/**
 * Verify payment (call from your backend/Cloud Function)
 * This is typically done server-side for security
 * @param {string} reference - Paystack payment reference
 * @returns {Promise<Object>} Payment verification result
 */
export const verifyPaystackPayment = async (reference) => {
  try {
    // This should be called from a Cloud Function, not directly from frontend
    // The Cloud Function will have access to PAYSTACK_SECRET_KEY
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference }),
    });

    return await response.json();
  } catch (error) {
    console.error('Payment verification failed:', error);
    return { success: false, error: error.message };
  }
};

export default {
  generatePaystackPaymentLink,
  initializePaystackCheckout,
  formatGHS,
  verifyPaystackPayment,
};
