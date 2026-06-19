# Firebase Hosting Deployment Guide

## Setup Firebase Hosting

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize Firebase in Project
```bash
firebase init hosting
```

When prompted:
- Public directory: `dist`
- Single-page app: Yes
- Auto-build/deploy: No (we'll do this manually)

### 3. Configure firebase.json

Update `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 4. Set Environment Variables

Create `.env.production`:

```
VITE_FIREBASE_API_KEY=AIzaSyCHX-pEn0slFVJRy8kHZj0l9NiDValIqgA
VITE_FIREBASE_AUTH_DOMAIN=stormglideio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=stormglideio
VITE_FIREBASE_STORAGE_BUCKET=stormglideio.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1055875955113
VITE_FIREBASE_APP_ID=1:1055875955113:web:fb3afeccbb270b9dbd6cb8
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_key
```

### 5. Build & Deploy

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

### 6. View Live Site

After deployment, your site will be live at:
- `https://stormglideio.web.app`
- `https://stormglideio.firebaseapp.com`

---

## Custom Domain Setup

### 1. Connect Custom Domain

```bash
firebase hosting:domain:create
```

Follow prompts to connect your domain (stormglide.io)

### 2. Update DNS Records

Firebase will provide CNAME records. Update your DNS provider with:
- CNAME: `stormglide.io` → `stormglideio.web.app`
- SSL will be automatic via Firebase

### 3. Verify Domain

```bash
firebase hosting:domain:list
```

---

## Continuous Deployment with GitHub Actions

### 1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          VITE_PAYSTACK_PUBLIC_KEY: ${{ secrets.PAYSTACK_PUBLIC_KEY }}
      
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: stormglideio
```

### 2. Add GitHub Secrets

In GitHub repo settings, add:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `PAYSTACK_PUBLIC_KEY`
- `FIREBASE_SERVICE_ACCOUNT` (service account JSON)

---

## Performance Optimization

### 1. Enable Caching

Firebase automatically caches:
- JS/CSS files (1 year)
- HTML files (5 minutes)
- Other assets (1 hour)

### 2. Enable CDN

Hosting uses Google Cloud CDN globally (automatic)

### 3. Monitor Performance

Dashboard: https://console.firebase.google.com/u/0/project/stormglideio/hosting

---

## Rollback & Versions

### View Deployed Versions
```bash
firebase hosting:channel:list
```

### Rollback to Previous Version
```bash
firebase hosting:rollback
```

### Deploy to Preview Channel (for testing)
```bash
firebase deploy --only hosting:preview
```

---

## Environment Setup Summary

### Production Deployment Checklist
- [ ] Firebase project created
- [ ] Firestore database active
- [ ] Phone Auth enabled
- [ ] Cloud Functions deployed
- [ ] SendGrid API key set
- [ ] Paystack account created & API key
- [ ] Environment variables in `.env.production`
- [ ] GitHub secrets configured
- [ ] GitHub Actions workflow enabled
- [ ] Custom domain connected
- [ ] SSL certificate active
- [ ] Analytics tracking enabled
- [ ] Error tracking enabled

### DNS Records Needed
- `stormglide.io` CNAME → `stormglideio.web.app`
- `www.stormglide.io` CNAME → `stormglideio.web.app`

### Post-Deploy
- [ ] Test homepage loads
- [ ] Test admin login
- [ ] Test client login with phone+OTP
- [ ] Test contact form submission
- [ ] Test invoice creation
- [ ] Test Paystack payment (test keys)
- [ ] Check Performance tab in Firebase Console
- [ ] Enable error reporting
- [ ] Set up monitoring alerts

---

## Troubleshooting

**"Missing firebase.json"**
```bash
firebase init hosting
```

**"Deployment fails on build"**
- Check `.env.production` has all required vars
- Run `npm run build` locally to debug

**"Domain not connecting"**
- Wait 24-48 hours for DNS propagation
- Verify CNAME records are correct
- Check Firebase Hosting settings for domain status

**"404 on refresh"**
- Ensure `firebase.json` has rewrite rules
- Single-page app must redirect all routes to `index.html`

---

## Cost

- **Firebase Hosting**: Free tier = 10GB/month bandwidth
- **Firestore**: Free tier = 50K reads/day, 20K writes/day, 1GB storage
- **Cloud Functions**: Free tier = 2M invocations/month, 400K GB-seconds
- **Authentication**: Free for first 50K users

Current usage is well within free tier.

---

## Next Steps

1. Run: `npm run build`
2. Run: `firebase deploy`
3. Visit: `https://stormglideio.web.app`
4. Add custom domain via Firebase Console
5. Set up GitHub Actions for auto-deploy

