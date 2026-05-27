# SwiftHaul — Fast & Reliable Courier Service

> A full-stack courier and logistics web application built with Next.js 16, MongoDB, and Paystack payments.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/license-MIT-yellow?style=flat-square)

---

## Overview

SwiftHaul is a production-ready courier management platform supporting three user roles — **customer**, **driver**, and **admin** — with a full shipment lifecycle from booking and payment through driver delivery and proof-of-delivery photo upload.

---

## Features

### Customer
- Multi-step shipment booking wizard (sender → recipient → package → payment)
- Paystack payment integration
- Real-time shipment tracking (public & authenticated)
- PDF receipt emailed on booking
- Notification centre

### Driver
- Dashboard with assigned deliveries
- Status updates (picked up → in transit → out for delivery → delivered)
- Cloudinary photo upload for proof-of-delivery

### Admin
- Full shipment management — filter, assign drivers, update status
- CSV export with date/status filters
- User management (create/deactivate drivers and customers)
- Analytics dashboard — revenue, shipment trends, zone breakdown (Recharts)

### Platform
- Role-based route protection via NextAuth.js v5 middleware
- Email verification & password reset flows (Resend)
- In-memory rate limiting on auth endpoints
- Zod validation on all API routes
- Interactive 3D hero scene (Spline)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | NextAuth.js v5 (JWT, credentials) |
| Database | MongoDB Atlas + Mongoose |
| Payments | Paystack |
| Email | Resend + React Email |
| PDF | @react-pdf/renderer |
| File uploads | Cloudinary |
| Charts | Recharts |
| 3D Scene | Spline (@splinetool/react-spline) |
| Fonts | Plus Jakarta Sans + Bricolage Grotesque |
| Toasts | Sonner |
| State | Zustand |

---

## Project Structure

```
SwiftHaul/
├── app/
│   ├── (auth)/          # login, register, forgot-password, reset-password
│   ├── (customer)/      # dashboard, shipments, shipments/new, shipments/[id]
│   ├── (driver)/        # driver dashboard, deliveries
│   ├── (admin)/         # admin dashboard, shipments, drivers, users, analytics
│   ├── api/             # all API routes
│   ├── track/           # public tracking page
│   └── verify-email/    # email verification
├── components/
│   ├── layout/          # Navbar
│   ├── ui/              # shadcn/ui components + Spline + Spotlight
│   ├── shared/          # StatusBadge, ShipmentTimeline
│   ├── shipments/       # NewShipmentWizard
│   └── admin/           # AnalyticsDashboard
├── lib/
│   ├── db.ts            # Mongoose connection
│   ├── pricing.ts       # Zone-based pricing engine
│   ├── tracking.ts      # Tracking ID generator (SH-YYYYMMDD-XXXXX)
│   ├── resend.ts        # Email service (lazy init)
│   ├── cloudinary.ts    # File upload
│   ├── rate-limiter.ts  # In-memory rate limiting
│   └── validators/      # Zod schemas
├── models/              # Mongoose models (User, Shipment, Notification)
├── emails/              # React Email templates
└── scripts/             # Seed admin account
```

---

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (free tier works)
- Resend account (free tier — 100 emails/day)
- Paystack account (test keys)
- Cloudinary account (free tier)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/SwiftHaul.git
cd SwiftHaul

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Copy env template and fill in values
cp .env.example .env.local

# 4. Seed the admin account
npm run seed

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://...

# NextAuth
AUTH_SECRET=your-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Paystack
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_NAME=SwiftHaul
```

### Default Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@swifthaul.com | Admin@123456 |

Drivers are created by the admin from the admin panel.
Customers self-register at `/register`.

---

## Pricing Model

All amounts are in **kobo** (NGN × 100) internally.

| Zone | Base Rate | Per kg | Category Surcharge |
|------|-----------|--------|-------------------|
| Local | ₦1,500 | ₦200 | Standard: ₦0 · Fragile: ₦500 · Perishable: ₦800 |
| Interstate | ₦3,500 | ₦450 | Same as above |
| International | ₦12,000 | ₦1,800 | Same as above |

7.5% VAT applied on subtotal.

---

## Deployment

### Vercel (frontend preview)

```bash
npx vercel
```

Set environment variables in the Vercel dashboard. The public pages (landing, login, register, track) render without any backend services.

### Render.com (full stack)

```bash
npm run build
node .next/standalone/server.js
```

Set all environment variables in the Render dashboard. Use `output: "standalone"` in `next.config.ts`.

---

## Security Notes

- Passwords hashed with bcrypt (12 rounds)
- JWT with minimal claims (id, role, isVerified only)
- Unverified customers blocked at both auth and middleware layers
- Paystack payment status only updated via webhook (HMAC-verified) — never trusted from client
- Rate limiting: 10 requests per 15-minute window per IP on auth endpoints
- Sensitive fields (`passwordHash`, `verificationToken`, `resetToken`) excluded from all API responses

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Built with care using Next.js, MongoDB, and a lot of ☕*
