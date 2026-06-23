# StormGlide - Quick Start (5 Minutes)

Your SaaS platform is complete. Follow these 5 steps to go live with payments.

---

## Step 1: Get SendGrid API Key (2 min)

1. Go to https://sendgrid.com → Sign up (free account)
2. Verify your email
3. Go to **Settings** → **API Keys**
4. Click **Create API Key**
5. Copy the key (starts with `SG.`)
6. Run:
   ```bash
   cd /Users/truth/Developer/stormglide.io/stormglide.io
   firebase functions:config:set sendgrid.key="SG.your_key_here"
   firebase deploy --only functions
   ```

✅ **Emails now work!**

---

## Step 2: Get Paystack API Keys (2 min)

1. Go to https://dashboard.paystack.co → Sign up
2. Verify your email
3. Click **Settings** → **Developers** → **API Keys**
4. Copy your **Public Key** (starts with `pk_`)
5. Edit `.env.production` in your project:
   ```env
   VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_public_key_here
   ```

✅ **Payment links work!**

---

## Step 3: Configure Paystack Webhook (1 min)

1. In Paystack Dashboard: **Settings** → **Webhooks**
2. Click **Add Webhook**
3. Paste this URL:
   ```
   https://us-central1-stormglideio.cloudfunctions.net/paystackWebhook
   ```
4. Event: Select **charge.success** only
5. Toggle **Active**: ✅ Yes
6. Click **Save**

✅ **Payments confirmed automatically!**

---

## Step 4: Test Payment Flow (5 min)

1. Start dev server:
   ```bash
   npm run dev
   ```
   Opens at http://localhost:5174

2. **Admin Login:**
   - Go to `/admin`
   - Password: `stormglide2025`

3. **Create Test Project:**
   - Click "New Project"
   - Fill in project name, contact, domain, package
   - Select infrastructure stacks (Firebase, Render, etc.)
   - Set pricing (e.g., GHS 150/month)
   - Review and create

4. **Check Welcome Email:**
   - You should receive an email with project details
   - (Check spam folder if not in inbox)

5. **Create Invoice:**
   - Go to Invoices tab
   - Create invoice for the project

6. **Test Payment:**
   - Open invoice and click "Pay Now"
   - Paystack checkout opens
   - Use test card:
     - **Card:** `4111 1111 1111 1111`
     - **Expiry:** `12/25`
     - **CVV:** `123`
   - Complete payment

7. **Verify Everything:**
   - ✅ Payment confirmation email arrives
   - ✅ Invoice status changes to "paid" in Firestore
   - ✅ Project expiry date extends
   - ✅ Cloud Functions logs show success: `firebase functions:log`

---

## Step 5: Deploy to Production (1 min)

```bash
npm run build
firebase deploy
```

Your site is live at: **https://stormglideio.web.app**

---

## 🎉 You're Done!

Your SaaS platform is now live with:

✅ Admin portal → Create projects & manage clients  
✅ Client portal → Clients see infrastructure & progress  
✅ Automated emails → Welcome, invoice, payment confirmation  
✅ Paystack payments → GHS currency, Ghana market  
✅ Webhook handling → Automatic invoice/project updates  
✅ Real-time database → Firestore  
✅ Scalable hosting → Firebase  

---

## 📋 What Each URL Does

| URL | Purpose |
|-----|---------|
| `https://stormglideio.web.app` | Home page |
| `https://stormglideio.web.app/admin` | Admin portal (password: stormglide2025) |
| `https://stormglideio.web.app/client` | Client login (phone + OTP) |

---

## 🔧 Troubleshooting

### "Emails not sending"
- Check SendGrid API key: `firebase functions:config:get sendgrid`
- Verify sender email `billing@stormglide.io` is verified in SendGrid
- Check logs: `firebase functions:log`

### "Payment page blank"
- Clear browser cache (`Cmd+Shift+Delete`)
- Check `.env.production` has correct Paystack Public Key
- Make sure you're in right environment (test vs. live)

### "Webhook not firing"
- Verify webhook URL in Paystack dashboard is exactly correct
- Toggle webhook OFF → ON to reactivate
- Check Paystack dashboard → Webhooks → Recent Deliveries

### "Invoice status not updating"
- Check Firestore: Projects → [project] → Check `paystackReference` field
- Check Cloud Functions logs: `firebase functions:log`
- Verify invoice has the Paystack reference

---

## 📚 More Info

- Full payment setup: See `PAYSTACK_INTEGRATION_GUIDE.md`
- Email setup: See `SENDGRID_SETUP.md`
- Complete checklist: See `DEPLOYMENT_COMPLETE.md`

---

## ✨ What You Have

### Pages Built
- ✅ Admin dashboard (create/manage projects)
- ✅ Client dashboard (view services & progress)
- ✅ Onboarding pages
- ✅ Invoice management
- ✅ Project profitability analytics

### Features Automated
- ✅ Invoice creation on project launch
- ✅ Welcome email with branded colors
- ✅ Invoice email with payment link
- ✅ Payment confirmation email
- ✅ Project renewal on payment
- ✅ 30-day renewal reminders
- ✅ 7-day urgent expiration notices
- ✅ Cost breakdown emails

### Integrations Complete
- ✅ SendGrid (email)
- ✅ Paystack (payments)
- ✅ Firebase (database & hosting)
- ✅ Cloud Functions (backend logic)

---

## 🚀 You're Ready!

Your SaaS platform is production-ready. Start accepting payments now.

Questions? Check the full documentation or Cloud Functions logs.

**Let's go! 🎉**
