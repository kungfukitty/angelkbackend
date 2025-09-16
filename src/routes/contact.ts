import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../config/resend';
import { ENV } from '../config/env';
import { validateCaptcha } from '../middlewares/validateCaptcha';

const prisma = new PrismaClient();
const router = Router();

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  captchaToken: z.string().min(1)
});

router.post('/', validateCaptcha, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  try {
    const { name, email, message } = parsed.data;
    const record = await prisma.contact.create({ data: { name, email, message } });

    if (ENV.adminEmails.length) {
      await sendEmail(ENV.adminEmails, 'New Contact Submission', `
        <h3>New message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p>${message.replace(/</g,'&lt;')}</p>
      `);
    }

    res.json({ ok: true, id: record.id });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit' });
  }
});

export default router;
