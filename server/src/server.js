import dotenv from 'dotenv';
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt DB connection
    await connectDB().catch((err) => {
      console.warn(`[Server Initialization Warning] Database connection failed: ${err.message}`);
      console.warn('[Server Initialization Warning] Server will still listen for requests, but DB operations will fail until connected.');
    });

    const server = app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(` ApplyFlow Server is running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(`==================================================`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n[${signal}] Received. Shutting down gracefully...`);
      server.close(async () => {
        console.log('[HTTP] Server closed.');
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error(`[Fatal Server Start Error] ${error.message}`);
    process.exit(1);
  }
};

startServer();
