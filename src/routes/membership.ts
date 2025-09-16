import { Router } from 'express';
import { z } from 'zod';
import { stripe } from '../config/stripe';
import { ENV } from '../config/env';

const router = Router();

const schema = z.object({
  planId: z.enum(['starter','standard','premium'])
});

router.post('/checkout', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const priceMap: Record<'starter'|'standard'|'premium', string> = {
    starter: ENV.priceStarter,
    standard: ENV.priceStandard,
    premium: ENV.pricePremium,
  };

  const price = priceMap[parsed.data.planId];
  if (!price) return res.status(500).json({ error: 'Price not configured' });

  try {
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

export default router;
