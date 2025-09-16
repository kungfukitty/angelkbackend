import { Resend } from 'resend';
import { ENV } from './env';

export const resend = ENV.resendKey ? new Resend(ENV.resendKey) : null;

export async function sendEmail(to: string | string[], subject: string, html: string) {
  if (!resend) return;
  await resend.emails.send({
    from: ENV.fromEmail,
    to,
    subject,
    html,
  });
}
