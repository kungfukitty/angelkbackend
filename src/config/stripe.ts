import Stripe from 'stripe';
import { ENV } from './env';

// STRIPE_TODO: requires STRIPE_SECRET_KEY
export const stripe = new Stripe(ENV.stripeSecret || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
});
