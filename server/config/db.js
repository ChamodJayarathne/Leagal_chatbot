import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  // If no MongoDB URI is configured, default cleanly to In-Memory mode without warnings
  if (!uri || uri.trim() === '') {
    isConnected = false;
    console.log('[Database] Running in In-Memory Local-Store mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.log('[Database] Running in In-Memory Local-Store mode.');
    return false;
  }
};

export const getDBStatus = () => isConnected;

