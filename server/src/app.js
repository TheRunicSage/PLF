import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import postRoutes from './routes/postRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sendError, sendSuccess } from './utils/httpResponse.js';

dotenv.config();

const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== 'string') {
    return '';
  }

  const trimmed = origin.trim().replace(/\/+$/, '');

  if (!trimmed) {
    return '';
  }

  try {
    const parsed = new URL(trimmed);
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch (_error) {
    return trimmed.toLowerCase();
  }
};

const buildAllowedOrigins = () => {
  return new Set(
    (process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map(normalizeOrigin)
      .filter(Boolean)
  );
};

export const createApp = () => {
  const app = express();
  const allowedOrigins = buildAllowedOrigins();

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        if (allowedOrigins.has(normalizeOrigin(origin))) {
          return callback(null, true);
        }

        const corsError = new Error('CORS origin not allowed.');
        corsError.statusCode = 403;
        return callback(corsError);
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '6mb' }));
  app.use(express.urlencoded({ extended: true, limit: '6mb' }));

  app.get('/api/health', (_req, res) => {
    return sendSuccess(res, { status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api', postRoutes);
  app.use('/api', projectRoutes);
  app.use('/api', contactRoutes);
  app.use('/api', settingsRoutes);

  app.use((_req, res) => {
    return sendError(res, 404, 'Route not found.');
  });

  app.use(errorHandler);

  return app;
};

const app = createApp();

export default app;
