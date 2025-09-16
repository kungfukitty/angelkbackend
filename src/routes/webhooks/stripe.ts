import express from 'express';
import { Router } from 'express';
import { stripe } from '../../config/stripe';
import { ENV } from '../../config/env';

const router = Router();

router.post('/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  if (!ENV.stripeWebhookSecret) return res.status(200).json({ ok: true }); // disabled

  try {
    const event = stripe.webhooks.constructEvent(
      (req as any).body,
      sig,
      ENV.stripeWebhookSecret
    );

    // Handle events as needed (e.g., checkout.session.completed)
    return res.json({ received: true });
  } catch (err:any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
