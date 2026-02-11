import app from '../server/src/app.js';
import connectDB from '../server/src/config/db.js';

let dbReadyPromise;

const ensureDbConnection = async () => {
  if (!dbReadyPromise) {
    dbReadyPromise = connectDB().catch((error) => {
      dbReadyPromise = undefined;
      throw error;
    });
  }

  await dbReadyPromise;
};

export const handleRequest = async (req, res) => {
  try {
    await ensureDbConnection();
    return app(req, res);
  } catch (error) {
    console.error('Vercel API bootstrap error:', error);
    return res.status(500).json({
      data: null,
      error: {
        message: 'Internal server error.',
      },
    });
  }
};
