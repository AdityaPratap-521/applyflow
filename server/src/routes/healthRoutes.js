import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isConnected = dbState === 1;

  // Liveness vs Readiness: Return 200 OK only when DB is fully connected, 503 Service Unavailable otherwise
  const statusCode = isConnected ? 200 : 503;

  res.status(statusCode).json({
    success: isConnected,
    status: isConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: states[dbState] || 'unknown',
      isConnected,
    },
  });
});

export default router;
