# Paystack Integration Guide - StormGlide

Complete setup guide for Paystack payment processing and webhook configuration.

## What's Already Built

✅ **Payment Link Generation** — Automatic Paystack links in invoices  
✅ **Webhook Handler** — Cloud Function to receive payment confirmations  
✅ **Email Confirmations** — Automated payment receipt emails  
✅ **Invoice Tracking** — Invoice status updates (pending → paid)  
✅ **Project Renewal** — Automatic service extension on payment  
✅ **Transaction Reference** — Unique tracking for each payment  

---

## 3-Step Setup

### Step 1: Get Your Paystack API Keys

1. Go to https://dashboard.paystack.co
2. Sign up or log in
3. Click **Settings** (gear icon, top-right)
4. Go to **Developers** → **API Keys**
5. You'll see two keys:
   - **Public Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

**Keep these safe!** Never share your Secret Key.

---

### Step 2: Set Environment Variables

#### For Frontend (Client Checkout)

Add to `.env.local`:
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_public_key_here
```

Or create `.env.production`:
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_public_key_here
```

#### For Cloud Functions (Webhook Verification - Optional)

If you want to verify webhook signatures (recommended for security):

```bash
firebase functions:config:set paystack.secret_key="sk_live_your_secret_key_here"
firebase deploy --only functions
```

---

### Step 3: Configure Webhook in Paystack Dashboard

**Webhook URL:**
```
https://us-central1-stormglideio.cloudfunctions.net/paystackWebhook
```

**Steps:**
1. Go to https://dashboard.paystack.co
2. Settings → Developers → **Webhooks**
3. Click **Add Webhook**
4. Paste the webhook URL above
5. Select **Events**: ✅ `charge.success` (only this one)
6. Toggle **Active**: ✅ Yes
7. Click **Save Webhook**

Done! Your webhook is now active.

---

## How Payment Flow Works

### User Journey

```
Client receives invoice email
         ↓
Clicks "Pay Now" button
         ↓
Redirected to Paystack checkout
         ↓
Enters payment details (or existing card)
         ↓
Completes payment
         ↓
Paystack confirms payment
         ↓
paystackWebhook function triggered
         ↓
Invoice marked as "paid"
         ↓
Project renewal date extended
         ↓
Confirmation email sent to client
         ↓
Service continues uninterrupted
```

### What Happens at Each Step

| Step | System | Action |
|------|--------|--------|
| Invoice Created | Admin Portal | Invoice number + amount stored in Firestore |
| Payment Link | Frontend | Client clicks "Pay Now" → Paystack link generated |
| Payment Processing | Paystack | Client completes payment at Paystack checkout |
| Webhook Fired | Paystack → Cloud Functions | `paystackWebhook` function receives payment confirmation |
| Invoice Updated | Cloud Functions | Invoice status → "paid", amount → recorded |
| Project Renewed | Cloud Functions | Project expiryDate → extended by 1 month/year |
| Email Sent | Cloud Functions → SendGrid | Confirmation email to client with new expiry |
| Dashboard Updated | Firestore | Client sees new status when they log in |

---

## Testing Payments

### Using Paystack Test Mode

Best for development/testing:

1. In Paystack Dashboard, toggle **Test Mode** (top-left corner)
2. Switch to test API keys (the purple ones)
3. Update `.env.local`:
   ```env
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_test_public_key
   ```
4. Create a test invoice and click "Pay Now"
5. Use Paystack test card:
   - **Card Number:** `4111 1111 1111 1111`
   - **Expiry:** Any future date (e.g., `12/25`)
   - **CVV:** `123`
6. Payment will complete immediately
7. Check:
   - ✅ Confirmation email arrives
   - ✅ Invoice status changes to "paid" in Firestore
   - ✅ Project expiry date extends
   - ✅ Cloud Functions logs show success

### Monitoring Test Payments

1. Paystack Dashboard → **Transactions**
2. Filter by **Test Mode**
3. Click a transaction to see:
   - Payment status (✓ Success)
   - Amount and reference
   - Customer email
   - Timestamp

---

## Key Files

| File | Purpose |
|------|---------|
| `functions/index.js` | `paystackWebhook` function (receives payments) |
| `src/utils/paystackPayment.js` | Payment link generation utility |
| `src/firebase/billing.js` | Invoice creation with Paystack reference |
| `src/firebase/notifications.js` | Email sending on payment |
| `PAYSTACK_WEBHOOK_SETUP.md` | Detailed webhook setup (this guide) |

---

## Common Invoice Email

When invoice is created, client receives:

```
📧 Subject: Invoice INV-1719859200000 - GHS 150.00

Hi [Client Name],

Your invoice is ready for payment.

Amount: GHS 150.00
Description: Starter - My Project (mysite.com)
Due Date: [7 days from now]

[Pay Now Button] → Paystack Checkout

The "Pay Now" button opens a Paystack checkout where client enters payment details.
```

After payment:

```
📧 Subject: ✓ Payment Confirmed - Invoice INV-1719859200000

Hi [Client Name],

Your payment has been received and confirmed!

Amount Paid: GHS 150.00
Invoice Number: INV-1719859200000
Transaction Reference: [Paystack Ref]
Payment Date: [Today's date]
Service Valid Until: [New expiry date]

[View Your Dashboard] → https://stormglideio.web.app/client/dashboard
```

---

## Paystack Features Used

| Feature | Used | Purpose |
|---------|------|---------|
| Hosted Checkout | ✅ | Client pays via Paystack-hosted page |
| Webhooks | ✅ | Receive payment confirmations |
| Payment Reference | ✅ | Track payments by invoice number |
| Customer Email | ✅ | Send customer receipt |
| Currency (GHS) | ✅ | Ghana Cedi for local transactions |
| Multiple Payment Methods | ✅ | Card, Bank, Mobile Money via Paystack |
| Test Mode | ✅ | Test payments without real charges |

---

## Security Notes

### What You Should Do

1. ✅ Keep Secret Key safe (never commit to git)
2. ✅ Use environment variables (`.env` files)
3. ✅ Verify webhook signatures (optional but recommended)
4. ✅ Always use HTTPS (Firebase hosting does this automatically)
5. ✅ Verify SendGrid API key is set

### What Paystack Handles

1. ✅ PCI-DSS compliance (card security)
2. ✅ Encryption of payment data
3. ✅ Fraud detection
4. ✅ Multiple payment methods
5. ✅ Settlement to your bank account

### What You Don't Do

1. ❌ Never store card data (Paystack does this)
2. ❌ Never process raw card details (use Paystack checkout)
3. ❌ Never hardcode API keys (use environment variables)
4. ❌ Never trust client-side payment verification (webhook verification is server-side)

---

## Troubleshooting

### Payment Page Won't Load

**Problem:** "Paystack checkout is blank or not loading"

**Solution:**
1. Check Public Key in `.env.local` is correct (starts with `pk_`)
2. Clear browser cache: `Cmd+Shift+Delete`
3. Make sure you're on the right environment (test vs. live)
4. Check browser console for errors: `F12` → Console tab

### Webhook Not Firing

**Problem:** "Payment is completed but invoice not updated"

**Solution:**
1. Check Paystack Dashboard → Settings → Webhooks
2. Verify webhook URL is exactly: `https://us-central1-stormglideio.cloudfunctions.net/paystackWebhook`
3. Toggle webhook **Off → On** to reactivate
4. Check **Recent Deliveries** to see if webhook was attempted
5. Check Cloud Functions logs: `firebase functions:log`

### Email Not Sent After Payment

**Problem:** "Payment confirmed but no email received"

**Solution:**
1. Verify SendGrid API key is set: `firebase functions:config:get sendgrid`
2. Verify sender email (`billing@stormglide.io`) is verified in SendGrid
3. Check client email in invoice is correct
4. Check Cloud Functions logs for SendGrid errors
5. Check spam/trash folder

### Wrong Expiry Date Calculated

**Problem:** "Project extended by wrong amount (e.g., 2 months instead of 1)"

**Solution:**
1. Check project `billingCycle` is set correctly ("monthly" or "annual")
2. Verify project `expiryDate` exists and is valid
3. Check Cloud Functions logs for date calculation issues
4. Manually update project expiryDate in Firestore if needed

---

## Going Live

### Checklist

- [ ] Paystack account created and verified
- [ ] Public Key added to `.env.production`
- [ ] Secret Key set in Firebase Cloud Functions config (optional)
- [ ] Webhook URL added to Paystack Dashboard (live mode)
- [ ] SendGrid API key configured
- [ ] Sender email verified in SendGrid
- [ ] Test payment completed successfully
- [ ] Confirmation email received
- [ ] Invoice status updated in Firestore
- [ ] Project expiry date extended
- [ ] Firebase deployment completed
- [ ] Custom domain configured (optional: stormglide.io)

### Switch from Test to Live

1. In Paystack Dashboard, toggle **Test Mode OFF**
2. Copy your **Live** API keys
3. Update `.env.production` with live Public Key
4. Update Firebase config with live Secret Key (if using verification)
5. Rebuild and redeploy:
   ```bash
   npm run build
   firebase deploy
   ```

---

## Support

| Issue | Resource |
|-------|----------|
| Paystack Questions | https://support.paystack.com |
| Webhook Issues | https://paystack.com/docs/payments/webhooks |
| Payment Methods | https://paystack.com/what-we-do |
| Pricing & Fees | https://paystack.com/pricing |

---

## Summary

Your StormGlide platform now has:

✅ **Automatic payment processing** via Paystack  
✅ **Webhook-based invoice confirmation** (no manual work)  
✅ **Automatic service renewal** on payment  
✅ **Branded confirmation emails** to clients  
✅ **Transaction tracking** by reference  
✅ **GHS currency support** for Ghana  
✅ **Test mode** for safe testing  
✅ **Live mode** for production payments  

Just set your API keys and you're ready to accept payments!

Questions? Check the `/functions/index.js` file for the complete webhook implementation.
