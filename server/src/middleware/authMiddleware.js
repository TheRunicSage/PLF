import jwt from 'jsonwebtoken';

import { sendError } from '../utils/httpResponse.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Unauthorized: missing Bearer token.');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 401, 'Unauthorized: invalid token format.');
  }

  if (!process.env.JWT_SECRET) {
    return sendError(res, 500, 'Server misconfiguration: JWT secret missing.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    return next();
  } catch (_error) {
    return sendError(res, 401, 'Unauthorized: token is invalid or expired.');
  }
};
