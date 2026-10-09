import mongoose from 'mongoose';

export const connectDB = async (customUri) => {
  try {
    const mongoUri = customUri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/applyflow';
    
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    // If running in development without a local database, log warning
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[MongoDB] Ensure MongoDB is running locally or specify a valid MONGO_URI in server/.env');
    }
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected successfully');
  } catch (error) {
    console.error(`[MongoDB Disconnect Error] ${error.message}`);
  }
};
