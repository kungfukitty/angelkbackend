const { Resend } = require('resend');
const { ENV } = require('./env');

const resend = ENV.resendKey ? new Resend(ENV.resendKey) : null;

async function sendEmail(to, subject, html){
  if (!resend) return;
  await resend.emails.send({ from: ENV.fromEmail, to, subject, html });
}

module.exports = { resend, sendEmail };
