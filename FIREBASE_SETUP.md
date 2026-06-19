# Firebase Setup Guide for StormGlide Admin Portal

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Create a new project"
3. Name: `stormglide`
4. Disable Google Analytics (optional)
5. Click "Create project" and wait for setup

## Step 2: Configure Firebase

### Enable Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Phone** authentication
3. Enable **Email/Password** authentication (for admin login)

### Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose region: **Europe (closest to Africa)**
4. Start in **Test mode** (we'll add security rules after)
5. Create database

### Enable Storage (optional, for file uploads in future)
1. Go to **Storage**
2. Click "Get started"
3. Start in test mode

## Step 3: Get Firebase Config

1. In Firebase Console, click the **Settings icon** (gear) → **Project settings**
2. Scroll to "Your apps" section
3. Click Web icon (`</>`) if no web app exists, create one
4. Copy the config object

## Step 4: Set Environment Variables

Create a `.env.local` file in the project root:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

Replace with your actual values from Firebase Console.

## Step 5: Initialize Firestore Collections

Run this in Firebase Console → Firestore → manually create these collections:

**Collections to create:**
- `clients`
- `projects`
- `inquiries`
- `team`
- `invoices`
- `supportTickets`

(Collections auto-create when you add first document, but it's good to set up structure first)

## Step 6: Set Up Security Rules

Go to **Firestore** → **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin can read/write everything
    match /{document=**} {
      allow read, write: if request.auth.uid == '[YOUR_ADMIN_UID]';
    }
    
    // Clients can read their own project
    match /projects/{projectId} {
      allow read: if request.auth != null;
    }
    
    // Anyone can read inquiries (Phase 1, tighten later)
    match /inquiries/{inquiryId} {
      allow read, write: if true;
    }
  }
}
```

**Note**: Replace `[YOUR_ADMIN_UID]` with your actual Firebase Auth UID after first login.

## Step 7: Test Firebase Connection

1. Start dev server: `npm run dev`
2. Go to `/admin/login`
3. Login with test email (create in Firebase Auth console first)
4. Go to `/admin/dashboard` — should show data from Firestore

## Step 8: Deploy to Production

### Vercel Environment Variables
1. Go to Vercel project settings
2. Add all 6 Firebase config vars:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. Redeploy: `git push` (Vercel will auto-deploy)

### Security Rules for Production
Before going live, update Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users only (add your admin UIDs)
    function isAdmin() {
      return request.auth.uid in ['admin_uid_1', 'admin_uid_2'];
    }
    
    // Authenticated users
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Admin dashboard
    match /projects/{projectId} {
      allow read, write: if isAdmin();
    }
    match /inquiries/{inquiryId} {
      allow read, write: if isAdmin();
    }
    match /clients/{clientId} {
      allow read, write: if isAdmin();
    }
    match /team/{memberId} {
      allow read, write: if isAdmin();
    }
    match /invoices/{invoiceId} {
      allow read, write: if isAdmin();
    }
    match /supportTickets/{ticketId} {
      allow read, write: if isAdmin();
      allow create: if isAuthenticated();
    }
  }
}
```

## Step 9: Add Test Data (Optional)

For testing, manually add sample data in Firestore Console:

**Sample Project Document:**
```json
{
  "clientId": "client_123",
  "name": "E-commerce Platform",
  "status": "active",
  "budget": {
    "quoted": 50000,
    "spent": 25000,
    "currency": "GHS"
  },
  "infrastructure": {
    "domains": [
      {
        "name": "example.com.gh",
        "registrar": "Namecheap",
        "cost": 200,
        "expiresAt": {
          "seconds": 1735689600
        }
      }
    ],
    "databases": [
      {
        "name": "Firestore",
        "provider": "Firebase",
        "storage": "2.5GB",
        "tier": "free"
      }
    ],
    "tools": [
      {
        "name": "Stripe",
        "type": "payment",
        "cost": 0,
        "billingCycle": "variable"
      }
    ]
  }
}
```

## Troubleshooting

### "Module not found: firebase/db"
- Make sure `src/firebase/db.js` exists
- Run: `npm install firebase`

### "Cannot find reCAPTCHA container"
- Add `<div id="recaptcha-container"></div>` to page (already in ClientLogin)
- Enable reCAPTCHA v3 in Firebase console

### "User not found after login"
- Go to Firebase Auth console
- Create test user with email + password
- Get their UID and update security rules

### Firestore quota exceeded
- Project is on Spark plan (free, limited)
- Upgrade to Blaze plan (pay-as-you-go, more generous free tier)

## Next Steps

- Phase 2: Add email notifications with SendGrid
- Phase 2: Add GBP message integration
- Phase 3: Add Stripe payment processing
- Phase 3: Add support ticket system

---

## Support

For Firebase issues: https://firebase.google.com/support
For StormGlide issues: contact support@stormglide.io

