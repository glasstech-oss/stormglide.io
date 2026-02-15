# 🚀 STORMGLIDE.IO - Enterprise Command Center

A dual-purpose enterprise platform combining a high-conversion marketing frontend with a secure, AI-powered ERP/CRM backend.

## 🏗️ Architecture Overview

### **Frontend** (Next.js 15 + App Router)
- **PWA-Ready**: Native app feel with mobile-first bottom navigation
- **Premium Dark UI**: Deep charcoal (#0B0F19) with glassmorphism effects
- **Fluid Animations**: Framer Motion route transitions and micro-interactions
- **Client Portal**: Secure job tracking dashboard with animated timelines

### **Backend** (NestJS + PostgreSQL)
- **JWT Magic Link Authentication**: Passwordless, secure login
- **AI Blueprint Generator**: Google Gemini-powered database schema generation
- **Multi-Currency Billing**: Smart routing between Stripe (USD) and Paystack (GHS/NGN/ZAR)
- **CRM & Job Tracking**: Project management with live staging feedback
- **Immutable Audit Trails**: Complete security logging

---

## 📦 Project Structure

```
stormglide.io/
├── backend/                    # NestJS API
│   ├── prisma/
│   │   └── schema.prisma      # Complete PostgreSQL schema
│   ├── src/
│   │   ├── auth/              # JWT Magic Link authentication
│   │   ├── billing/           # Multi-currency invoice engine
│   │   ├── crm/               # Client & project management
│   │   ├── lab/               # AI Blueprint Generator
│   │   ├── prisma/            # Database service
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Bootstrap
│   ├── .env.example           # Environment template
│   └── package.json
│
└── frontend/                   # Next.js App
    ├── app/
    │   ├── layout.tsx         # Root layout with PWA config
    │   ├── page.tsx           # Public landing page
    │   ├── portal/
    │   │   └── page.tsx       # Client dashboard
    │   └── globals.css        # Global styles
    ├── components/
    │   └── AppShell.tsx       # Navigation wrapper
    ├── tailwind.config.ts     # Tailwind configuration
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** 14+ (local or Docker)
- **Google Gemini API Key** (for AI Blueprint Generator)

### 1. Clone & Install

```bash
cd /Users/truth/DEVELOPMENT/stormglide.io

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and configure:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/stormglide_db"
JWT_SECRET="your-super-secret-jwt-key"
GEMINI_API_KEY="your-google-gemini-api-key"
FRONTEND_URL="http://localhost:3000"
```

### 3. Initialize Database

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
Backend runs on: **http://localhost:3001**

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:3000**

---

## 🎯 Key Features

### 🔐 Authentication Flow
1. User requests magic link via `/v1/auth/request-magic-link`
2. Backend generates JWT token (15min expiry) and logs URL
3. User clicks link → Frontend calls `/v1/auth/verify?token=...`
4. Backend issues 7-day session token

### 🤖 AI Blueprint Generator
```bash
POST /v1/lab/blueprint
{
  "authorId": "user-uuid",
  "title": "Fleet Management System",
  "rawPrompt": "Client needs real-time GPS tracking, driver payroll, and vehicle maintenance scheduling"
}
```

Returns:
```json
{
  "proposedTechStack": ["Next.js", "NestJS", "PostgreSQL", "Socket.io"],
  "architectureSummary": "...",
  "prismaSchema": "model Vehicle { ... }",
  "estimatedComplexity": "Enterprise"
}
```

### 💳 Multi-Currency Billing
- **USD/EUR/GBP** → Routed to **Stripe**
- **GHS/NGN/ZAR** → Routed to **Paystack** (Mobile Money support)

Webhook endpoints:
- `/v1/billing/webhook/stripe`
- `/v1/billing/webhook/paystack`

---

## 📱 PWA Configuration

The frontend is configured for Progressive Web App installation:

- **Viewport**: Prevents zoom on mobile for native feel
- **Apple Web App**: Full-screen mode when saved to home screen
- **Theme Color**: #0B0F19 (deep charcoal)
- **Mobile Navigation**: Bottom bar with haptic feedback

---

## 🧪 Testing the System

### 1. Test Authentication
```bash
curl -X POST http://localhost:3001/v1/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@stormglide.io"}'
```

Check backend logs for the magic link URL, then:
```bash
curl "http://localhost:3001/v1/auth/verify?token=YOUR_TOKEN_HERE"
```

### 2. Test AI Blueprint Generator
```bash
curl -X POST http://localhost:3001/v1/lab/blueprint \
  -H "Content-Type: application/json" \
  -d '{
    "authorId":"YOUR_USER_ID",
    "title":"E-commerce Platform",
    "rawPrompt":"Need a multi-vendor marketplace with product catalog, shopping cart, and order management"
  }'
```

### 3. View Database
```bash
cd backend
npx prisma studio
```

Opens Prisma Studio at **http://localhost:5555**

---

## 🎨 UI/UX Highlights

- **Glassmorphism**: Frosted glass navigation with backdrop blur
- **Animated Timelines**: Glowing progress indicators for project phases
- **Skeleton Loaders**: No spinning circles - premium loading states
- **Micro-animations**: Hover effects, button transforms, route transitions
- **Dark Theme**: Rich charcoal with cyan/purple/emerald accents

---

## 🔒 Security Features

- **JWT Magic Links**: Single-use, time-limited tokens
- **Audit Logs**: Immutable trail of all admin actions
- **CORS Protection**: Configured for frontend-only access
- **Webhook Signatures**: Stripe/Paystack signature verification (TODO in production)

---

## 📚 API Endpoints

### Authentication
- `POST /v1/auth/request-magic-link` - Request login link
- `GET /v1/auth/verify?token=...` - Verify and get session token

### CRM
- `POST /v1/crm/client` - Create client profile
- `POST /v1/crm/project/:clientId` - Initialize project with Job ID
- `PUT /v1/crm/project/:projectId/phase` - Advance project phase
- `POST /v1/crm/project/:projectId/feedback` - Log staging feedback

### Billing
- `POST /v1/billing/invoice/:clientId` - Generate invoice
- `POST /v1/billing/webhook/stripe` - Stripe webhook handler
- `POST /v1/billing/webhook/paystack` - Paystack webhook handler

### AI Lab
- `POST /v1/lab/blueprint` - Generate architecture blueprint
- `GET /v1/lab/blueprints/:authorId` - Get all blueprints

---

## 🚢 Production Deployment

### Backend (NestJS)
1. Set `NODE_ENV=production` in `.env`
2. Configure production database URL
3. Add real email service (SendGrid/AWS SES)
4. Enable webhook signature verification
5. Deploy to: Railway, Render, or AWS

### Frontend (Next.js)
1. Build: `npm run build`
2. Deploy to: Vercel, Netlify, or Cloudflare Pages
3. Set `NEXT_PUBLIC_API_URL` environment variable

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **Icons** | Lucide React |
| **Backend** | NestJS, Node.js |
| **Database** | PostgreSQL, Prisma ORM |
| **Auth** | JWT, Magic Links |
| **AI** | Google Generative AI (Gemini) |
| **Payments** | Stripe, Paystack |

---

## 📄 License

Proprietary - Stormglide Engineering © 2026

---

## 🤝 Support

For questions or issues:
- **Email**: engineering@stormglide.io
- **Portal**: https://stormglide.io/portal

---

**Built with precision by the Stormglide Engineering Team** ⚡
# stormglide.io
