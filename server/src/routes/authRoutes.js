import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';

import { loginRateLimiter } from '../middleware/rateLimiters.js';
import AdminUser from '../models/AdminUser.js';
import { sendError, sendSuccess } from '../utils/httpResponse.js';

const router = express.Router();

router.post('/login', loginRateLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required.');
    }

    if (!process.env.JWT_SECRET) {
      const error = new Error('JWT_SECRET is not configured.');
      error.statusCode = 500;
      throw error;
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return sendError(res, 401, 'Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid credentials.');
    }

    const token = jwt.sign(
      {
        id: admin._id.toString(),
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      }
    );

    return sendSuccess(
      res,
      {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
        },
      },
      200
    );
  } catch (error) {
    return next(error);
  }
});

// TODO: Add a secure script or seed route to create the first admin user.

export default router;
