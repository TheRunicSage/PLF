import { sendError } from '../utils/httpResponse.js';

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  return sendError(
    res,
    statusCode,
    err.message || 'Internal server error.',
    err.details && typeof err.details === 'object' ? err.details : undefined
  );
};

