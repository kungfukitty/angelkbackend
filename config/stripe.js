const Stripe = require('stripe');
const { ENV } = require('./env');

// STRIPE_TODO: requires STRIPE_SECRET_KEY
module.exports.stripe = new Stripe(ENV.stripeSecret || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
});
