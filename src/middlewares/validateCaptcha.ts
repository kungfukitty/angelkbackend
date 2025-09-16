import type { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export async function validateCaptcha(req: Request, res: Response, next: NextFunction) {
  try {
    const token = (req.body?.captchaToken as string) || '';
    if (!ENV.hcaptchaSecret) return res.status(500).json({ error: 'Captcha not configured' });
    if (!token) return res.status(400).json({ error: 'Missing captcha token' });

    const params = new URLSearchParams();
    params.append('secret', ENV.hcaptchaSecret);
    params.append('response', token);

    const r = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await r.json();
    if (!data.success) return res.status(400).json({ error: 'Captcha failed' });
    next();
  } catch (e) {
    return res.status(500).json({ error: 'Captcha verification error' });
  }
}
