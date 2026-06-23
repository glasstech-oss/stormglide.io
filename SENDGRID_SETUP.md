# SendGrid Setup for StormGlide Cloud Functions

## Overview

The Cloud Functions use SendGrid to send branded emails (welcome emails, invoices, renewal reminders, etc.). To complete the deployment, you need to set up a SendGrid API key.

## Steps to Get Your SendGrid API Key

1. **Create a SendGrid Account**
   - Go to https://sendgrid.com
   - Sign up for a free account (or use existing account)
   - Verify your email address

2. **Create an API Key**
   - Log in to SendGrid dashboard
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name it: `StormGlide Cloud Functions`
   - Select "Full Access" (or create a restricted key with only Mail Send permission)
   - Copy the generated key (it starts with `SG.`)
   - **Save this key in a safe place — you won't see it again**

3. **Verify Sender Email**
   - Go to Settings → Sender Authentication
   - Click "Verify a Single Sender" or "Authenticate Your Domain"
   - Add your sender email (e.g., noreply@stormglide.io or support@stormglide.io)
   - Verify the email by clicking the confirmation link SendGrid sends

## Set the API Key in Firebase Cloud Functions

### Option 1: Via Firebase CLI (Recommended)

```bash
firebase functions:config:set sendgrid.key="SG.your_actual_key_here"
firebase deploy --only functions
```

### Option 2: Via Firebase Console

1. Go to https://console.firebase.google.com
2. Select your project (stormglideio)
3. Go to Functions
4. Click the "Runtime settings" (gear icon)
5. Set environment variables:
   - Key: `SENDGRID_API_KEY`
   - Value: `SG.your_actual_key_here`
6. Deploy any function to apply the changes

### Option 3: Via Environment File (Local Development)

Create `.env.local` in the `functions/` directory:

```
SENDGRID_API_KEY=SG.your_actual_key_here
```

Then run:
```bash
cd functions
npm run serve
```

## Update Sender Emails in Code

The functions currently use these sender emails. Update them in `functions/index.js` if needed:

- `noreply@stormglide.io` — transactional emails (welcome, billing)
- `support@stormglide.io` — support-related emails (renewals, expiration warnings)
- `billing@stormglide.io` — invoice-related emails

**Make sure these match verified senders in your SendGrid account.**

## Verify Setup

After setting the API key, test by creating a new project in the admin dashboard:

1. Go to http://localhost:5174/admin (port may vary)
2. Create a new project (admin password: `stormglide2025`)
3. Check the client's email for the welcome email
4. Check CloudFunction logs: `firebase functions:log`

## Troubleshooting

**"API key does not start with SG."**
- The API key is empty or invalid
- Verify the key in Firebase config/environment
- Check that you copied the full key from SendGrid (starts with `SG.`)

**"Mail Service Error"**
- Sender email not verified in SendGrid
- API key doesn't have Mail Send permission
- Check CloudFunction logs for detailed error: `firebase functions:log`

**Emails not received**
- Check spam folder
- Verify sender email is authenticated in SendGrid
- Check CloudFunction logs for send status
- Verify recipient email is correct

## Cost

SendGrid has a generous free tier:
- **Free plan**: 100 emails per day (limit is reset daily)
- **Free plus plan**: 5,000 emails per month (~$20/month)
- **Pro plan**: 10,000 emails per month and higher

For a small business starting out, the free plan is sufficient.

## Next Steps

1. Set your SendGrid API key using one of the options above
2. Redeploy Cloud Functions: `firebase deploy --only functions`
3. Test by creating a project in the admin portal
4. Verify welcome email arrives at the client email address
5. Monitor CloudFunction logs for any errors

---

**Questions?** Check `functions/index.js` to see how emails are being sent, or contact SendGrid support at https://support.sendgrid.com
