const express = require('express');
const { Router } = require('express');
const { stripe } = require('../../config/stripe');
const { ENV } = require('../../config/env');

const router = Router();

router.post('/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  if (!ENV.stripeWebhookSecret) return res.status(200).json({ ok: true }); // disabled

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, ENV.stripeWebhookSecret);
    // Handle events if needed (e.g., checkout.session.completed)
    return res.json({ received: true });
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;
