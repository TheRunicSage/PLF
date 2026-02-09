import rateLimit from 'express-rate-limit';

import { sendError } from '../utils/httpResponse.js';

const makeLimiter = (options) => {
  const { windowMs, max, message } = options;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      return sendError(res, 429, message);
    },
  });
};

export const loginRateLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please try again in a few minutes.',
});

export const contactRateLimiter = makeLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: 'Too many contact submissions. Please try again shortly.',
});

