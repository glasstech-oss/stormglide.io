# Stormglide.io — Project Overview

_Last verified accurate: 2026-08-28. If this drifts from reality, trust the code and update this file._

This repo contains **three separate applications** that together make up Stormglide.io. They deploy independently, to three different places.

| App | Framework | Deploys to | Live at |
|---|---|---|---|
| Public marketing site | Vite + React 19 (this repo's root `src/`) | Firebase Hosting | `stormglide.io` / `stormglideio.web.app` |
| Admin portal | Next.js App Router (`frontend/`) | Vercel | `admin.stormglide.io` |
| Backend API | Firebase Cloud Functions, Express (`functions/`) | Firebase Functions | `us-central1-stormglideio.cloudfunctions.net/api` |

**Repo ownership:** this repo now lives at `github.com/johnsedofiadakey-hue/stormglide.io` (transferred back from a `glasstech-oss` account on 2026-08-28 — the Vercel GitHub App was never authorized on `glasstech-oss`, which is why pushes silently stopped auto-deploying the admin portal for a while; `johnsedofiadakey-hue` already had it).

**Admin portal deploys:** as of 2026-08-28, the `frontend` Vercel project is git-connected to this repo, so a push to `main` auto-deploys it — same as the marketing site and backend already did. If it ever stops auto-deploying again, `cd frontend && npx vercel --prod --yes` deploys directly from whatever's on disk, bypassing git entirely — useful for confirming a fix immediately, but don't mistake that manual deploy for proof that git-triggered auto-deploy is still working.

The `backend/` folder (an early NestJS + PostgreSQL + Prisma rewrite) was deleted on 2026-08-28 — it was never deployed anywhere and nothing in production ever talked to it.

---

## 1. Public marketing site (`src/`)

React 19 + Vite, React Router v6, Framer Motion, plain CSS with custom properties (no Tailwind here).

**Structure:**
- `src/pages/` — route-level pages (Home, ServicesPage, ProductsPage, WorkPage, PricingPage, ContactPage, product landing pages, service landing pages)
- `src/components/home/`, `src/components/layout/`, `src/components/common/` — shared UI
- `src/data/` — content as data: `services.js`, `products.js`, `testimonials.js`, `seo.js`, `visualVariants.js`, `defaultTheme.js`
- `src/context/ThemeContext.jsx` — theming system (see §4)
- `scripts/generate-static-seo.mjs` — post-build step that stamps per-route `<title>`/meta/JSON-LD into static HTML snapshots for crawlers (see §5)

**Key routes:**
- `/` — Home
- `/services`, `/products`, `/work`, `/pricing` — marketing pages
- `/contact` — **merged About + Contact page**: leads with company story, pillars, founder section, team grid (if any admin-added team members exist), data/security section, then the actual contact form + WhatsApp CTA at the bottom (anchored at `#build`)
- `/about` — client-side redirect to `/contact` (kept for old links/bookmarks)
- `/nexus-hrm`, `/nexus-dental`, `/sano-health`, `/cargoscan` — dedicated product landing pages
- `/client/*` — client portal (OTP/magic-link login, project status, invoices, support tickets) — reads Firestore directly via `src/firebase/db.js`
- `/admin/*` — deprecated, redirects to the real admin portal on Vercel

**Deploy:**
```bash
npm run build          # vite build + generate-static-seo.mjs
firebase deploy --only hosting
```

---

## 2. Admin portal (`frontend/`)

Next.js App Router, TypeScript, Tailwind, deployed to Vercel. This is where the business actually runs day to day.

**Structure:**
- `frontend/app/admin/` — the real admin app: dashboard, CRM (clients), Projects, Invoices, Team, Website settings
- `frontend/app/invoice/[id]/` — public, unauthenticated invoice pay page (shareable link, no login required)
- `frontend/app/contact/`, `frontend/components/Footer.tsx`, etc. — **leftover pages from an early Next.js-based public site attempt.** These are still live and reachable (e.g. `frontend-ten-blush-98.vercel.app/contact`), showing stale/duplicate content. They are not linked from anywhere real but are a known loose end — worth cleaning up or removing.
- `frontend/lib/api.ts` — typed API client for every backend resource (`BillingAPI`, `CrmAPI`, `ProjectsAPI`, `TeamAPI`, `SettingsAPI`, etc.)
- Auth: Firebase Auth (Google Sign-In), gated by custom claims `role: 'OMEGA' | 'ADMIN'`, enforced in `app/admin/layout.tsx` and by `verifyToken`/`adminOnly` middleware on the backend

**Deploy:**
```bash
cd frontend
npx vercel --prod --yes
```

---

## 3. Backend (`functions/index.js`)

One big Express app deployed as a single Firebase Cloud Function (`api`), backed by Firestore. Everything lives in `functions/index.js` — no separate router files.

**Major resource groups:**
- **Auth** — `verifyToken` (Firebase ID token check) + `adminOnly` (role check) middleware, used on every admin-only route
- **CRM** — clients, projects (`/v1/crm/*`, `/v1/projects/*`)
- **Billing / Invoices** — line-item invoices, tax/discount, Paystack payment links (auto-selected for GHS/NGN/ZAR, Stripe otherwise), branded PDF generation via `pdf-lib`, public pay page endpoints (`/v1/public/invoice/:id`), webhook signature verification
- **Team** (`/v1/team`) — CRUD for the people shown on the public About/Contact page; `GET` is public, writes are admin-only. Photos are stored as inline base64 data URIs directly on the Firestore doc (no Cloud Storage bucket provisioned)
- **Site Settings** (`/v1/settings`) — public GET / admin-only PUT. Flat string key-value store: branding colors, logo (base64), contact email/phone/WhatsApp, invoice terms/warranty, bank details. **Important gotcha:** this Firestore doc, once saved, permanently overrides any new code-level defaults in `DEFAULT_SITE_SETTINGS` until someone edits it again via the Settings page (or it's patched directly) — this has caused confusion multiple times (stale colors, stale email) and is worth knowing about before assuming a code change "didn't work."
- **Monitoring / Domains / Subscriptions** — project completion tracking, domain renewal alerts, subscription cost tracking (feeds the admin dashboard's alerts)

**Deploy:**
```bash
firebase deploy --only functions:api
```

---

## 4. Theming system

Three "visual variants" — **Aurora** (default, cinematic dark/light), **Editorial** (warm serif), **Signal** (technical mono grid) — each defined in `src/data/visualVariants.js` as a full color/font/radius token set. Aurora additionally has a separate `auroraLightColors` export swapped in for light mode.

`ThemeContext.jsx`'s `getThemeVariables()` maps all of this to CSS custom properties (`--color-*`, `--sg-accent`, `--blue`, etc.) applied at `:root`. The visitor's variant/appearance choice and any admin-set brand overrides (from Site Settings) are merged in, then persisted to `localStorage` per-browser.

**Known gotcha:** because the resolved theme is cached in `localStorage`, a returning visitor's browser can keep showing old defaults (colors, tagline, email) even after a code-level default changes, until that cache is cleared or overwritten. Not yet fixed with cache-busting/versioning.

---

## 5. SEO

- Every route has hand-written metadata in `src/data/seo.js` (title, description, h1, JSON-LD `schemaType`), rendered live via `<RouteSEO>` (React Helmet) **and** baked into static HTML snapshots at build time by `scripts/generate-static-seo.mjs` (one `.html` file per route in `dist/`, matched by Firebase Hosting's clean-URL rewrites) — this is what search crawlers actually see, since they don't execute JS reliably.
- `organizationSchema` includes `AggregateRating`/`Review` schema sourced from `src/data/testimonials.js` — the same array the visible Testimonials section renders, so structured data always matches visible content.
- The Work page emits `Product` schema per case study.
- `public/sitemap.xml` and `public/robots.txt` are static, not generated — update manually when adding routes.

---

## 6. Known loose ends (not fixed, worth knowing about)

- **`frontend/app/contact`, `frontend/app/portfolio`, `frontend/app/security`, `frontend/app/lab`, etc.** — old Next.js public-site remnants, still publicly reachable on the Vercel deployment root, showing stale content (old email, old copy). Not linked anywhere live, but a real duplicate-content/confusion risk if someone stumbles onto them.
- **`localStorage` theme caching** — see §4.
- **Firestore Settings doc overriding code defaults** — see §3. Any time a "site-wide default" change doesn't seem to take effect, check whether a saved value in Admin → Website Settings is masking it.
- **GitHub push blocked** — the repo's configured Git credential lacks the `workflow` OAuth scope, so pushes that touch `.github/workflows/*.yml` are rejected. Deploys are done directly via `firebase deploy` / `vercel --prod` from local, not via the GitHub Actions pipeline that's checked into the repo.
- **Pricing page intermittent load glitch** — reported once (briefly showed Home content before self-correcting on reload); root cause not found, not reproduced since.

---

## 7. Quick reference: where things actually live

| I want to change... | Edit this |
|---|---|
| Homepage hero copy | `src/components/home/Hero.jsx` |
| Services/pricing packages | `src/data/services.js` |
| Products (Nexus HRM, etc.) | `src/data/products.js` + their landing page in `src/pages/` |
| Case studies / client work | `src/pages/WorkPage.jsx` (the `CLIENT_WORK` array — `src/data/caseStudies.js` is dead/unused) |
| About/Contact page content | `src/pages/ContactPage.jsx` |
| Team shown on About/Contact | Admin → About page team (`frontend/app/admin/team/`) — not a code change |
| Site colors/logo/bank details/email | Admin → Website settings (`frontend/app/admin/settings/`) — not a code change |
| Invoice PDF layout | `functions/index.js`, `buildInvoicePdf()` |
| SEO title/description per route | `src/data/seo.js` |
