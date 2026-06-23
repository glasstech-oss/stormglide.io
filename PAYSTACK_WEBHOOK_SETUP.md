# Paystack Webhook Setup for StormGlide

## Overview

The Paystack webhook automatically:
1. **Receives** payment confirmation from Paystack
2. **Updates** invoice status to "paid" in Firestore
3. **Renews** project expiry date (monthly or annual)
4. **Sends** payment confirmation email to client with new expiry date
5. **Resets** project status to "active"

## Paystack Webhook URL

Your webhook endpoint is:
```
https://us-central1-stormglideio.cloudfunctions.net/paystackWebhook
```

## How to Set Up the Webhook

### Step 1: Log in to Paystack Dashboard
- Go to https://dashboard.paystack.co
- Log in with your Paystack account

### Step 2: Navigate to Webhooks
1. Click on **Settings** (gear icon, top-right)
2. Select **Developers** → **Webhooks**
3. Click **Add Webhook**

### Step 3: Configure the Webhook

| Field | Value |
|-------|-------|
| **Webhook URL** | `https://us-central1-stormglideio.cloudfunctions.net/paystackWebhook` |
| **Events** | ✅ charge.success (select this only) |
| **Active** | ✅ Yes (toggle enabled) |

### Step 4: Save

Click **Save Webhook** and you'll see:
- ✅ Webhook created successfully
- Your webhook is now receiving payment confirmations

## How It Works

### Flow Diagram

```
Customer pays invoice via Paystack
         ↓
Paystack confirms payment
         ↓
Paystack sends webhook → paystackWebhook Cloud Function
         ↓
Function verifies payment data
         ↓
Updates Firestore:
  - Invoice status → "paid"
  - Project expiryDate → renewed (+ 1 month/year)
  - Project status → "active"
         ↓
Sends payment confirmation email to client
         ↓
Client receives email with:
  - Amount paid
  - Invoice number
  - Transaction reference
  - New expiry date
  - Dashboard link
```

## Payment Confirmation Email

When a payment is confirmed via Paystack, the client receives an email with:

```
✓ Payment Confirmed

Amount Paid: GHS [amount]
Invoice Number: [INV-001]
Transaction Reference: [paystack-ref]
Payment Date: [date]
Service Valid Until: [new expiry date]

View Your Dashboard → https://stormglideio.web.app/client/dashboard
```

## Testing the Webhook Locally

### Option 1: Use Paystack Test Keys

1. In Paystack Dashboard, switch to **Test Mode** (toggle at top-left)
2. Get your Test Secret Key
3. Create a test transaction
4. Complete payment with Paystack test card:
   - Card: `4111 1111 1111 1111`
   - Month/Year: Any future date (e.g., 12/25)
   - CVV: `123`
5. After payment, the webhook will fire and confirmation email will be sent

### Option 2: Manual Webhook Test

```bash
# Get your Firebase project details
FUNCTION_URL="https://us-central1-stormglideio.cloudfunctions.net/paystackWebhook"

# Send a test webhook payload
curl -X POST $FUNCTION_URL \
  -H "Content-Type: application/json" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "TEST-REF-001",
      "amount": 50000,
      "customer": {
        "email": "client@example.com",
        "first_name": "John"
      },
      "authorization": {
        "authorization_code": "test-auth-code"
      }
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Payment processed and confirmed",
  "invoiceNumber": "INV-001"
}
```

## What Happens When Payment is Confirmed

### In Firestore

**Invoice document** updates:
```javascript
{
  status: "paid",  // was "pending"
  paidAt: Timestamp,
  transactionReference: "paystack-ref-code",
  amountPaid: 150.00,  // GHS amount
  ...
}
```

**Project document** updates:
```javascript
{
  expiryDate: Timestamp,  // renewed by 1 month or 1 year
  status: "active",
  lastPaymentDate: Timestamp,
  ...
}
```

### Email Sent

The `paystackWebhook` function automatically calls SendGrid to send a branded payment confirmation email with:
- Amount paid
- Invoice number
- Transaction reference
- Payment date
- New service expiry date
- Link to client dashboard

## Troubleshooting

### "Webhook not firing"
1. Verify webhook URL is correct in Paystack Dashboard
2. Ensure **charge.success** event is selected (not all events)
3. Check that webhook is **Active** (toggle enabled)
4. In Paystack Dashboard, go to **Webhooks** → **Recent Deliveries** to see if webhook was attempted

### "Payment not updating in Firestore"
1. Check Cloud Functions logs:
   ```bash
   firebase functions:log --project stormglideio | grep -i paystack
   ```
2. Verify invoice has `paystackReference` field matching the Paystack reference
3. Ensure SendGrid API key is configured

### "Email not sent"
1. Check that SendGrid API key is set in Firebase config
2. Verify sender email (`billing@stormglide.io`) is verified in SendGrid
3. Check Cloud Functions logs for SendGrid errors
4. Check client email in invoice is correct

### "New expiry date not calculated correctly"
1. Check that project has `billingCycle` field set to "monthly" or "annual"
2. Verify project `expiryDate` is a valid timestamp
3. Check Cloud Functions logs for date calculation errors

## Live Monitoring

### View Recent Webhooks in Paystack

1. Go to Paystack Dashboard
2. Settings → Developers → Webhooks
3. Scroll down to **Recent Deliveries**
4. Click on any webhook to see:
   - Status (✓ Successful, ✗ Failed, ⏳ Pending)
   - Request/Response payloads
   - Retry attempts

### View Cloud Function Logs

```bash
firebase functions:log --project stormglideio

# Filter for Paystack logs only
firebase functions:log --project stormglideio | grep -i paystack

# Watch logs in real-time
firebase functions:log --project stormglideio --follow
```

## Security Notes

### Webhook Signature Verification (Optional but Recommended)

For production, uncomment this in `functions/index.js` to verify webhook authenticity:

```javascript
const crypto = require('crypto');

// In paystackWebhook function:
const hash = crypto
  .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
  .update(JSON.stringify(event))
  .digest('hex');

if (hash !== req.headers['x-paystack-signature']) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

Then set your Paystack Secret Key:
```bash
firebase functions:config:set paystack.secret_key="sk_live_your_secret_key"
firebase deploy --only functions
```

### What the Webhook Doesn't Do

- ❌ Doesn't accept payment directly (Paystack handles all payment processing)
- ❌ Doesn't store credit card data (Paystack PCI-DSS compliant)
- ❌ Doesn't refund payments (use Paystack Dashboard for refunds)
- ❌ Doesn't update client authentication (uses existing phone+OTP system)

## Next Steps

1. Set up webhook in Paystack Dashboard (steps above)
2. Test with a payment in Paystack Test Mode
3. Verify confirmation email arrives
4. Check Firestore to confirm invoice and project updated
5. View Cloud Functions logs to confirm no errors
6. Switch to Live Mode in Paystack when ready for production

---

**Questions?** Check `functions/index.js` → `paystackWebhook` function for the complete implementation, or contact Paystack support at https://support.paystack.com
