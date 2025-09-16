const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { corsMiddleware } = require('./config/cors');
const { limiter } = require('./middlewares/rateLimit');
const { ENV } = require('./config/env');

const newsletter = require('./routes/newsletter');
const contact = require('./routes/contact');
const membership = require('./routes/membership');
const stripeWebhook = require('./routes/webhooks/stripe');

const app = express();

// Stripe webhook uses raw body; mount BEFORE json parser
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

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(ENV.port, () => {
  console.log(`API running on :${ENV.port}`);
});
