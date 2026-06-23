# Stormglide.io — Deployment Guide

This repository contains **two separate applications** that are deployed independently.
Never confuse them — they have different build tools, different hosts, and different deploy commands.

---

## Architecture Overview

```
stormglide.io (custom domain, Namecheap DNS → Vercel)
├── /                    Public marketing site  ← Next.js (frontend/)
├── /admin/dashboard     Admin command center   ← Next.js (frontend/)
└── /portal              Client project portal  ← Next.js (frontend/)

stormglideio.web.app (Firebase Hosting)
└── /                    Legacy Vite public site ← Vite/React (src/)

us-central1-stormglideio.cloudfunctions.net/api
└── /v1/*                REST API backend        ← Firebase Functions (functions/)
```

---

## Part 1 — Public Site (Vite/React → Firebase Hosting)

**Codebase:** `src/`
**Build tool:** Vite
**Host:** Firebase Hosting → `https://stormglideio.web.app`
**Deploy command:** run from repo root

```bash
# Build
npm run build

# Deploy hosting only (fast)
firebase deploy --only hosting

# Deploy hosting + functions together
firebase deploy
```

**When to deploy here:**
- Changes to any file inside `src/`
- Changes to `public/` assets at root level
- Changes to `vite.config.js` or root `tailwind.config.js`

**What NOT to touch:**
- Do not run `npm run build` from inside `frontend/` — that builds the wrong app
- Do not run `firebase deploy` from inside `frontend/`

---

## Part 2 — Admin Portal + Next.js App (Next.js → Vercel)

**Codebase:** `frontend/`
**Build tool:** Next.js 15 (App Router)
**Host:** Vercel → `https://stormglide.io` (custom domain)
**Deploy command:** run from `frontend/` directory

```bash
cd frontend

# Build locally to verify (optional)
npm run build

# Deploy to production
npx vercel --prod
```

**When to deploy here:**
- Changes to any file inside `frontend/`
- Admin dashboard modules (`frontend/components/admin/`)
- Client portal (`frontend/app/portal/`)
- Auth pages (`frontend/app/auth/`, `frontend/app/admin/login/`)
- API client (`frontend/lib/api.ts`)
- Public landing pages in `frontend/app/`

**Environment variables** are stored in Vercel (not in `.env.local` which is local only).
To update a Vercel env var:
```bash
cd frontend
npx vercel env rm VAR_NAME production --yes
echo "new-value" | npx vercel env add VAR_NAME production
npx vercel --prod
```

---

## Part 3 — API Backend (Firebase Cloud Functions)

**Codebase:** `functions/`
**Host:** Firebase Cloud Functions → `https://us-central1-stormglideio.cloudfunctions.net/api`
**Deploy command:** run from repo root

```bash
firebase deploy --only functions
```

**When to deploy here:**
- Changes to `functions/index.js`
- Changes to `functions/package.json`
- Changes to `functions/.env` (env vars — never commit this file)

**Sensitive env vars** (RESEND_API_KEY, PAYSTACK_SECRET_KEY) must be set in:
Firebase Console → Functions → Configuration → Add variable

**Non-sensitive env vars** are in `functions/.env` (gitignored):
```
FRONTEND_URL=https://stormglide.io
ADMIN_ACCESS_KEY=<your-secret-key>
FROM_EMAIL=noreply@stormglide.io
ADMIN_EMAIL=<your-email>
```

---

## Commit Convention

Use these prefixes so it's always clear which part of the repo changed:

| Prefix | Meaning | Example |
|--------|---------|---------|
| `public:` | Changes to `src/` (Vite public site) | `public: add hero animation` |
| `portal:` | Changes to `frontend/` (Next.js admin/portal) | `portal: fix CRM client search` |
| `api:` | Changes to `functions/` (Firebase Functions) | `api: add invoice PDF endpoint` |
| `config:` | firebase.json, vercel config, CI/CD | `config: update deploy workflow` |
| `chore:` | Dependencies, docs, gitignore | `chore: update deploy guide` |

---

## Full Deploy Checklist (when releasing everything)

```bash
# 1. Build + deploy public site
npm run build
firebase deploy --only hosting

# 2. Deploy API (if functions changed)
firebase deploy --only functions

# 3. Deploy admin portal + Next.js
cd frontend
npx vercel --prod
cd ..

# 4. Commit and push
git add .
git commit -m "chore: release vX.X.X"
git push origin main
```

---

## DNS & Domains

| Domain | Points to | Managed in |
|--------|-----------|------------|
| `stormglide.io` | Vercel (Next.js frontend) | Namecheap DNS |
| `www.stormglide.io` | Vercel (redirect to apex) | Namecheap DNS |
| `stormglideio.web.app` | Firebase Hosting (Vite public site) | Firebase Console |
| `us-central1-stormglideio.cloudfunctions.net` | Firebase Functions | Firebase Console |

**Namecheap DNS records:**
```
A Record    @    76.76.21.21           (Vercel)
CNAME       www  cname.vercel-dns.com  (Vercel)
```

---

## Firebase Auth — Authorized Domains

Magic link emails only work from domains listed in:
Firebase Console → Authentication → Settings → Authorized domains

Current authorized domains:
- `localhost`
- `stormglideio.web.app`
- `stormglideio.firebaseapp.com`
- `stormglide.io` ← add this after DNS propagates

---

## Project Structure

```
stormglide.io/
├── src/                        Vite/React public site
│   ├── components/
│   ├── pages/
│   ├── firebase/
│   └── context/
├── frontend/                   Next.js admin + portal + landing pages
│   ├── app/
│   │   ├── admin/              Admin dashboard
│   │   ├── portal/             Client portal
│   │   ├── auth/               Magic link auth
│   │   └── (public pages)/     Landing pages
│   ├── components/admin/       All admin modules
│   ├── hooks/                  useSocket, etc.
│   └── lib/                    api.ts, firebase.ts
├── functions/                  Firebase Cloud Functions API
│   └── index.js                All /v1/ routes (Express + Firestore)
├── firebase.json               Firebase config (hosting + functions)
├── package.json                Root — Vite app scripts
└── DEPLOY.md                   This file
```
