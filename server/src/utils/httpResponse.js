export const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    data,
    error: null,
  });
};

export const sendError = (res, statusCode, message, details) => {
  return res.status(statusCode).json({
    data: null,
    error: {
      message,
      ...(details ? { details } : {}),
    },
  });
};

