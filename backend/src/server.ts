import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import healthRoutes from './routes/health.routes.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: true, // Allow frontend origin
    credentials: true,
  })
);

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

app.use(express.json());

// Routes Setup
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/health', healthRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 EduTrack Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health Check available at http://localhost:${PORT}/api/health`);
});

export default app;
