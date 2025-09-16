# AngelKellogg Backend (Node.js, server.js)

Pure JavaScript (CommonJS) backend with **server.js** entrypoint.
Production-ready: Express + Prisma + Postgres on Render, Resend email, hCaptcha, Stripe Checkout.

## Endpoints
- POST `/api/newsletter` { email, source?, captchaToken }
- POST `/api/contact` { name, email, message, captchaToken }
- POST `/api/membership/checkout` { planId: "starter"|"standard"|"premium" }
- POST `/webhooks/stripe` (optional when webhook secret is set)
- GET `/health`

## Setup
1. Copy `.env.example` → `.env` and fill values.
2. `npm i`
3. `npx prisma generate`
4. Migrate DB: `npm run migrate:dev` (first run) or `npm run migrate:deploy` (prod)
5. Start: `npm start` (runs `node server.js`)

## Render
- Build Command: `npm ci && npx prisma generate`
- Start Command: `npm start`
- Health Check: `/health`
- Node: 18
- Add env vars from `.env.example`

## Stripe_TODO
- Add STRIPE_SECRET_KEY and STRIPE_PRICE_* envs when Stripe is approved.
- (Optional) Add STRIPE_WEBHOOK_SECRET and enable webhook in Stripe dashboard.
