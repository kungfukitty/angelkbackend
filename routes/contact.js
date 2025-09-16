const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { validateCaptcha } = require('../middlewares/validateCaptcha');
const { sendEmail } = require('../config/resend');
const { ENV } = require('../config/env');

const prisma = new PrismaClient();
const router = Router();

router.post('/', validateCaptcha, async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: 'Invalid input' });

    const record = await prisma.contact.create({ data: { name, email, message } });

    if (ENV.adminEmails.length) {
      await sendEmail(ENV.adminEmails, 'New Contact Submission', `
        <h3>New message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p>${String(message).replace(/</g,'&lt;')}</p>
      `);
    }

    res.json({ ok: true, id: record.id });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit' });
  }
});

module.exports = router;
