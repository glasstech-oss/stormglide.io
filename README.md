# Stormglide.io

Business systems studio site — public marketing site, admin portal, and backend API, deployed as three separate apps.

**→ See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for the full architecture, where things live, deploy commands, and known gotchas.**

## Quick summary

| App | Where | Deploy |
|---|---|---|
| Public site (`src/`) | Firebase Hosting — `stormglide.io` | `npm run build && firebase deploy --only hosting` |
| Admin portal (`frontend/`) | Vercel | `cd frontend && npx vercel --prod --yes` |
| Backend API (`functions/`) | Firebase Functions | `firebase deploy --only functions:api` |

The `backend/` folder (NestJS + PostgreSQL) is **dead code** — an early rewrite that was never deployed. Don't build on it. The real backend is `functions/index.js` (Firebase Functions + Firestore).

## Local development

```bash
# Public site
npm install
npm run dev              # localhost:5174

# Admin portal
cd frontend
npm install
npm run dev               # localhost:3000

# Backend (emulated)
cd functions
npm install
firebase emulators:start --only functions,firestore,auth
```

## License

Proprietary — Stormglide Technologies Ltd. © 2026
