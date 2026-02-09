import express from 'express';

import { contactRateLimiter } from '../middleware/rateLimiters.js';
import ContactMessage from '../models/ContactMessage.js';
import { sendError, sendSuccess } from '../utils/httpResponse.js';
import { validateContactInput } from '../utils/validate.js';

const router = express.Router();

router.post('/contact', contactRateLimiter, async (req, res, next) => {
  try {
    const validation = validateContactInput(req.body);

    if (!validation.isValid) {
      return sendError(res, 400, 'Validation failed', validation.details);
    }

    const { name, email, phone, message } = req.body;

    const created = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      message: message.trim(),
    });

    return sendSuccess(
      res,
      {
        id: created._id,
        createdAt: created.createdAt,
      },
      201
    );
  } catch (error) {
    return next(error);
  }
});

export default router;
