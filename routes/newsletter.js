const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { validateCaptcha } = require('../middlewares/validateCaptcha');
const { sendEmail } = require('../config/resend');

const prisma = new PrismaClient();
const router = Router();

router.post('/', validateCaptcha, async (req, res) => {
  try {
    const { email, source } = req.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const record = await prisma.newsletter.upsert({
      where: { email },
      update: { source: source || undefined },
      create: { email, source }
    });

    await sendEmail(email, 'Welcome to the Angel Kellogg ecosystem', `<p>You're in. Expect insider updates across the ecosystem.</p>`);

    res.json({ ok: true, id: record.id });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save' });
  }
});

module.exports = router;
