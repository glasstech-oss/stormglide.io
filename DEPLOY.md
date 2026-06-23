# Stormglide.io — Deployment Guide

## Final Architecture

```
stormglide.io              → Firebase Hosting  → src/       (Public site — what clients see)
admin.stormglide.io        → Vercel            → frontend/  (Admin dashboard + client portal)
*.cloudfunctions.net/api   → Firebase Functions → functions/ (REST API backend)
```

**Rule:** Never mix them up. Each section has its own codebase, build tool, and deploy command.

---

## 1. Public Site — `stormglide.io`

**What it is:** The main marketing/product site that clients know and visit.
**Codebase:** `src/` (Vite + React)
**Host:** Firebase Hosting
**Live URL:** `https://stormglide.io` (custom domain) + `https://stormglideio.web.app` (Firebase default)

### Deploy

Run from the **repo root**:

```bash
# Build the Vite app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### When to run this
- Any change inside `src/`
- New pages, design updates, component changes on the public site

### Commit prefix: `public:`
```
public: update hero section copy
public: add new pricing card
public: fix mobile nav
```

---

## 2. Admin Dashboard + Client Portal — `admin.stormglide.io`

**What it is:** The internal command centre (admin) and client-facing project portal.
**Codebase:** `frontend/` (Next.js 15 App Router)
**Host:** Vercel
**Live URL:** `https://admin.stormglide.io`

| Path | What it is |
|------|------------|
| `/admin/dashboard` | Admin command centre |
| `/admin/login` | Admin login (Commander Key) |
| `/portal` | Client project portal |
| `/portal/login` | Client magic link login |
| `/auth/verify` | Magic link verification page |

### Deploy

Run from the **`frontend/` directory**:

```bash
cd frontend
npx vercel --prod
```

### When to run this
- Any change inside `frontend/`
- Admin modules, client portal, auth pages, API client

### Updating environment variables on Vercel
```bash
cd frontend
npx vercel env rm VAR_NAME production --yes
echo "new-value" | npx vercel env add VAR_NAME production
npx vercel --prod
```

### Current Vercel env vars
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase project API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `stormglideio.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `stormglideio` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `stormglideio.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_API_URL` | `https://us-central1-stormglideio.cloudfunctions.net/api` |

### Commit prefix: `portal:` or `admin:`
```
portal: fix invoice display in client view
admin: add bulk lead export
admin: update CRM search filter
```

---

## 3. API Backend — Firebase Cloud Functions

**What it is:** All backend logic — auth, CRM, billing, monitoring, Firestore reads/writes.
**Codebase:** `functions/` (Express + Firestore)
**Host:** Firebase Cloud Functions
**Live URL:** `https://us-central1-stormglideio.cloudfunctions.net/api`

### Deploy

Run from the **repo root**:

```bash
firebase deploy --only functions
```

### When to run this
- Any change inside `functions/index.js`
- New API routes, business logic changes, email templates

### Environment variables
Non-sensitive vars live in `functions/.env` (gitignored — never commit):
```
FRONTEND_URL=https://admin.stormglide.io
FROM_EMAIL=noreply@stormglide.io
ADMIN_EMAIL=<your-email>
ADMIN_ACCESS_KEY=<your-secret-key>
```

Sensitive keys (RESEND_API_KEY, PAYSTACK_SECRET_KEY) must be set in:
**Firebase Console → Functions → Configuration**

### Commit prefix: `api:`
```
api: add document upload endpoint
api: fix Paystack webhook signature check
api: improve alert deduplication
```

---

## Full Release (all three at once)

```bash
# From repo root:

# 1. Public site
npm run build
firebase deploy --only hosting

# 2. API (only if functions changed)
firebase deploy --only functions

# 3. Admin portal
cd frontend && npx vercel --prod && cd ..

# 4. Commit everything
git add .
git commit -m "chore: release"
git push origin main
```

---

## DNS — Namecheap Configuration

| Record | Host | Value | Purpose |
|--------|------|-------|---------|
| `A` | `@` | Firebase IP *(from Firebase Console)* | `stormglide.io` → public site |
| `CNAME` | `www` | Firebase CNAME *(from Firebase Console)* | `www.stormglide.io` redirect |
| `A` | `admin` | `76.76.21.21` | `admin.stormglide.io` → Vercel |

### Setting up `stormglide.io` on Firebase Hosting (one-time)
1. Firebase Console → Hosting → **Add custom domain**
2. Enter `stormglide.io`
3. Firebase gives you a TXT record for verification — add it in Namecheap
4. After verification, Firebase gives A records — replace the TXT with those A records
5. Propagation: 5–30 minutes

### `admin.stormglide.io` — already wired to Vercel
Just add this single record in Namecheap Advanced DNS:
```
A Record    admin    76.76.21.21    Automatic TTL
```

---

## Firebase Auth — Authorized Domains

Magic link emails only work from domains listed here:
**Firebase Console → Authentication → Settings → Authorized domains**

Add both:
- `stormglide.io`
- `admin.stormglide.io`

---

## Project Structure

```
stormglide.io/
├── src/                     Vite/React — PUBLIC SITE (stormglide.io)
│   ├── components/
│   ├── pages/
│   ├── firebase/
│   └── context/
│
├── frontend/                Next.js — ADMIN + PORTAL (admin.stormglide.io)
│   ├── app/
│   │   ├── admin/           Admin dashboard & login
│   │   ├── portal/          Client project portal
│   │   └── auth/            Magic link verification
│   ├── components/admin/    CRM, Billing, Kanban, Monitoring modules
│   ├── hooks/               useSocket
│   └── lib/                 api.ts, firebase.ts
│
├── functions/               Firebase Functions — API BACKEND
│   └── index.js             All /v1/ routes (Express + Firestore)
│
├── firebase.json            Firebase config (hosting + functions)
├── package.json             Root Vite scripts (for src/)
└── DEPLOY.md                This file
```

---

## Common Mistakes to Avoid

| Mistake | Why it's wrong |
|---------|---------------|
| Running `npm run build` inside `frontend/` and deploying to Firebase Hosting | Wrong app — Firebase Hosting serves `src/`, not `frontend/` |
| Running `npx vercel --prod` from the repo root | Vercel serves `frontend/` only |
| Changing `functions/.env` and not redeploying functions | Functions won't pick up the change |
| Committing `functions/.env` | Contains secrets — it is gitignored for a reason |
| Adding a domain to Vercel that should go to Firebase Hosting | Both can't own the same domain |
