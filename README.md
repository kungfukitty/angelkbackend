# AngelKellogg Backend (Production)

Express + Prisma + Postgres on Render. Email via Resend. hCaptcha on forms. Stripe Checkout for memberships.

## Endpoints
- POST `/api/newsletter` { email, source?, captchaToken }
- POST `/api/contact` { name, email, message, captchaToken }
- POST `/api/membership/checkout` { planId: "starter"|"standard"|"premium" }
- POST `/webhooks/stripe` (optional when webhook secret is set)
- GET `/health`

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. `npm i`
3. Ensure Postgres is reachable via `DATABASE_URL`
4. Migrate: `npm run migrate:dev` (first run) or `npm run migrate:deploy` (in prod)
5. Dev: `npm run dev`

## Build & Run (Production)
- Build: `npm run build`
- Start: `npm start`

## Required Envs
- See `.env.example`. STRIPE_* can be added later (code is live and will error if missing during checkout only).

## Render Notes
- Service Type: Web Service
- Build Command: `npm ci && npm run build`
- Start Command: `npm start`
- Environment: Node 18
- Health Check: `/health`
- Add environment variables from `.env.example`

## Security
- CORS restricted via `ALLOWED_ORIGINS`
- hCaptcha required on newsletter/contact
- Rate limiting and Helmet enabled

## Stripe_TODO
- Add STRIPE_SECRET_KEY, STRIPE_PRICE_* envs.
- (Optional) Add STRIPE_WEBHOOK_SECRET and enable the webhook route.
