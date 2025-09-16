const { Router } = require('express');
const { stripe } = require('../config/stripe');
const { ENV } = require('../config/env');

const router = Router();

router.post('/checkout', async (req, res) => {
  try {
    const { planId } = req.body || {};
    if (!['starter','standard','premium'].includes(planId)) {
      return res.status(400).json({ error: 'Invalid planId' });
    }

    const priceMap = {
      starter: ENV.priceStarter,
      standard: ENV.priceStandard,
      premium: ENV.pricePremium,
    };
    const price = priceMap[planId];
    if (!price) return res.status(500).json({ error: 'Price not configured' });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // STRIPE_TODO: change to 'payment' for one-time
      line_items: [{ price, quantity: 1 }],
      success_url: ENV.checkoutSuccessUrl,
      cancel_url: ENV.checkoutCancelUrl
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

module.exports = router;
