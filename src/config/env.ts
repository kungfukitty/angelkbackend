import 'dotenv/config';

function getEnv(name: string, fallback?: string, required = false): string {
  const v = process.env[name] ?? fallback;
  if (required && (!v || v.trim() === '')) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v as string;
}

export const ENV = {
  node: getEnv('NODE_ENV', 'production'),
  port: Number(getEnv('PORT', '8787')),
  dbUrl: getEnv('DATABASE_URL', '', true),
  allowedOrigins: getEnv('ALLOWED_ORIGINS', '').split(',').map(s => s.trim()).filter(Boolean),
  resendKey: getEnv('RESEND_API_KEY', ''),
  fromEmail: getEnv('FROM_EMAIL', 'no-reply@angelkellogg.com'),
  adminEmails: getEnv('ADMIN_NOTIFICATIONS', '').split(',').map(s => s.trim()).filter(Boolean),
  hcaptchaSiteKey: getEnv('HCAPTCHA_SITE_KEY', ''),
  hcaptchaSecret: getEnv('HCAPTCHA_SECRET', ''),
  stripeSecret: getEnv('STRIPE_SECRET_KEY', ''),
  stripeWebhookSecret: getEnv('STRIPE_WEBHOOK_SECRET', ''),
  priceStarter: getEnv('STRIPE_PRICE_STARTER', ''),
  priceStandard: getEnv('STRIPE_PRICE_STANDARD', ''),
  pricePremium: getEnv('STRIPE_PRICE_PREMIUM', ''),
  checkoutSuccessUrl: getEnv('CHECKOUT_SUCCESS_URL', 'https://www.angelkellogg.com/membership/success'),
  checkoutCancelUrl: getEnv('CHECKOUT_CANCEL_URL', 'https://www.angelkellogg.com/membership/cancel'),
};
