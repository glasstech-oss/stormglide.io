# Firebase Cloud Functions Setup - Email Notifications

## Overview
Phase 3 email notifications require Firebase Cloud Functions to send emails via SendGrid.

## Setup Steps

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

### 2. Create Cloud Functions

In `functions/index.js`, add these email functions:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send inquiry notification to admin
exports.sendInquiryNotification = functions.https.onCall(async (data, context) => {
  try {
    const msg = {
      to: "admin@stormglide.io",
      from: "noreply@stormglide.io",
      subject: `New Inquiry: ${data.serviceType} from ${data.clientName}`,
      html: `
        <h2>New Inquiry Received</h2>
        <p><strong>From:</strong> ${data.clientName}</p>
        <p><strong>Email:</strong> ${data.clientEmail}</p>
        <p><strong>Phone:</strong> ${data.clientPhone}</p>
        <p><strong>Service:</strong> ${data.serviceType}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <hr />
        <p><a href="https://stormglide.vercel.app/admin/dashboard">View in Dashboard</a></p>
      `,
    };
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// Send invoice email to client
exports.sendInvoiceEmail = functions.https.onCall(async (data, context) => {
  try {
    const msg = {
      to: data.clientEmail,
      from: "invoices@stormglide.io",
      subject: `Invoice ${data.invoiceNumber} - GHS ${data.amount}`,
      html: `
        <h2>Invoice ${data.invoiceNumber}</h2>
        <p><strong>Project:</strong> ${data.projectName}</p>
        <p><strong>Amount:</strong> GHS ${data.amount.toLocaleString()}</p>
        <p><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</p>
        <hr />
        <p>Please review and process payment at your earliest convenience.</p>
        <p><a href="https://stormglide.vercel.app/client/project">View Project</a></p>
      `,
    };
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// Send support ticket notification
exports.sendTicketEmail = functions.https.onCall(async (data, context) => {
  try {
    const msg = {
      to: data.recipientEmail,
      from: "support@stormglide.io",
      subject: `Support Ticket Created: ${data.ticketTitle}`,
      html: `
        <h2>Support Ticket Created</h2>
        <p><strong>Title:</strong> ${data.ticketTitle}</p>
        <p><strong>Priority:</strong> ${data.priority.toUpperCase()}</p>
        <p><strong>Description:</strong></p>
        <p>${data.ticketDescription}</p>
        <hr />
        <p>Our team will respond within 24 hours.</p>
        <p><a href="https://stormglide.vercel.app/client/support-tickets">View Ticket</a></p>
      `,
    };
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error("Error sending ticket email:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// Send ticket response notification
exports.sendTicketResponseEmail = functions.https.onCall(async (data, context) => {
  try {
    const msg = {
      to: data.recipientEmail,
      from: "support@stormglide.io",
      subject: `Response to Your Support Ticket`,
      html: `
        <h2>Support Ticket Response</h2>
        <p>We've responded to your support ticket #${data.ticketId}</p>
        <p><strong>Response:</strong></p>
        <p>${data.message}</p>
        <hr />
        <p><a href="https://stormglide.vercel.app/client/support-tickets">View All Tickets</a></p>
      `,
    };
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error("Error sending response email:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
```

### 3. Install SendGrid Package

```bash
cd functions
npm install @sendgrid/mail
```

### 4. Set Environment Variables

```bash
firebase functions:config:set sendgrid.api_key="YOUR_SENDGRID_API_KEY"
```

Get your SendGrid API key:
1. Go to https://sendgrid.com/
2. Create free account
3. Verify sender email (stormglide.io domain or your email)
4. Go to Settings → API Keys → Create API Key
5. Copy the key

### 5. Deploy Functions

```bash
firebase deploy --only functions
```

### 6. Test Locally (Optional)

```bash
firebase emulators:start
```

Then test calling functions from the admin dashboard.

---

## Email Templates

You can customize email templates in the Cloud Functions above. Key variables:

- `${data.clientName}` - Client name
- `${data.clientEmail}` - Client email
- `${data.invoiceNumber}` - Invoice ID
- `${data.amount}` - Amount in GHS
- `${data.ticketTitle}` - Support ticket title
- `${data.message}` - Response message

---

## SendGrid Sender Verification

Before sending emails:

1. **Free Tier**: Verify one sender email
   - Go to https://app.sendgrid.com/settings/sender_auth
   - Verify your email (stormglide.io or your email)
   - Click confirmation link in email

2. **Production**: Use domain authentication
   - Set up CNAME records for stormglide.io
   - Follow SendGrid's domain verification guide

---

## Cost

- **Free tier**: 100 emails/day
- **Pay-as-you-go**: $0.0001 per email (after free tier)
- **Cloud Functions**: First 2M invocations/month free

---

## Integration with Admin Portal

After setup, these events trigger emails automatically:

1. **New Inquiry** → Admin email notification
2. **Invoice Created** → Client email notification
3. **New Support Ticket** → Admin + Client email
4. **Ticket Response** → Client email notification

No additional code changes needed - the Firebase functions handle emails automatically.

---

## Troubleshooting

**"sendgrid.api_key is not defined"**
- Run: `firebase functions:config:set sendgrid.api_key="YOUR_KEY"`
- Then redeploy: `firebase deploy --only functions`

**"Invalid sender email"**
- Verify sender in SendGrid Settings → Sender Authentication

**"Function timeout"**
- Increase timeout: `functions.runWith({timeoutSeconds: 60}).https.onCall(...)`

---

## Next Steps

- Set up SendGrid account
- Deploy Cloud Functions
- Test by creating a new inquiry or invoice
- Monitor email logs in SendGrid dashboard

