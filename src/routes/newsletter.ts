import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../config/resend';
import { validateCaptcha } from '../middlewares/validateCaptcha';

const prisma = new PrismaClient();
const router = Router();

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
  captchaToken: z.string().min(1)
});

router.post('/', validateCaptcha, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const { email, source } = parsed.data;

  try {
    const record = await prisma.newsletter.upsert({
      where: { email },
      update: { source: source ?? undefined },
      create: { email, source }
    });

    await sendEmail(email, 'Welcome to the Angel Kellogg ecosystem', `
      <p>You're in. Expect insider updates across the ecosystem.</p>
    `);

    res.json({ ok: true, id: record.id });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save' });
  }
});

export default router;
