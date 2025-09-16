import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsMiddleware } from './config/cors';
import { limiter } from './middlewares/rateLimit';
import { ENV } from './config/env';

import newsletter from './routes/newsletter';
import contact from './routes/contact';
import membership from './routes/membership';
import stripeWebhook from './routes/webhooks/stripe';

const app = express();

// Stripe webhook must use raw body on its route; add it before json body parser
app.use('/webhooks', stripeWebhook);
app.use(express.json());
app.use(helmet());
app.use(corsMiddleware);
app.use(limiter);
app.use(morgan('tiny'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/newsletter', newsletter);
app.use('/api/contact', contact);
app.use('/api/membership', membership);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(ENV.port, () => {
  console.log(`API running on :${ENV.port}`);
});
