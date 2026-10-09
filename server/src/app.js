import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import healthRoutes from './routes/healthRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import { getStats } from './controllers/statsController.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or matching allowed origin
      if (!origin || origin === allowedOrigin || process.env.NODE_ENV === 'test') {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy restricts access from origin: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Rate Limiting
app.use('/api/', apiRateLimiter);

// Body Parsing Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API Routes
app.use('/api', healthRoutes);
app.get('/api/stats', getStats);
app.use('/api/applications', applicationRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
