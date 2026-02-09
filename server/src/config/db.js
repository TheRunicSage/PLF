import mongoose from 'mongoose';

let cached = globalThis.__plfMongoose;

if (!cached) {
  cached = globalThis.__plfMongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  mongoose.set('strictQuery', true);

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri);
  }

  cached.conn = await cached.promise;
  console.log(`MongoDB connected: ${cached.conn.connection.host}`);
  return cached.conn;
};

export default connectDB;
