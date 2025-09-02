import express, { Request } from 'express';
import { config } from 'dotenv';
import cors, { CorsOptions } from 'cors';

import usersRouter from '../db/routes/users.routes';
import exercisesRouter from '../db/routes/exercises.routes';
import workoutsRouter from '../db/routes/workouts.routes';

config({ path: '.env' });

const isDevelopment = process.env.NODE_ENV !== 'production';

// Import LOCAL_IP only in development
let LOCAL_IP: string = 'localhost';
if (isDevelopment) {
  try {
    const localConfig = require('../../local.config');
    LOCAL_IP = localConfig.LOCAL_IP;
  } catch (error) {
    console.log('⚠️ local.config not found, using localhost');
  }
}

const app = express();
const PORT = Number(process.env.PORT) || 8008;
const HOST = isDevelopment ? LOCAL_IP : '0.0.0.0';

const allowedOrigins = isDevelopment
  ? [`http://${LOCAL_IP}:3001`]
  : [process.env.FRONTEND_URL ?? ''].filter(Boolean);

// CORS configuration
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight requests
app.use(express.json());

// Health check endpoint (useful for Railway)
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    host: HOST,
  });
});

// API routes
app.use('/users', usersRouter);
app.use('/exercises', exercisesRouter);
app.use('/workouts', workoutsRouter);

// Root endpoint with helpful info
app.get('/', (_, res) => {
  res.json({
    message: 'Workout Tracker API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      users: '/users',
      exercises: '/exercises',
      workouts: '/workouts',
    },
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (_, res) => {
  res.status(404).json({
    error: 'Route not found',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}\n`);

  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://${HOST}:${PORT}/health\n`);

  if (isDevelopment) {
    console.log(`Local development mode`);
    console.log(`Frontend should connect to: http://${HOST}:${PORT}`);
  } else {
    console.log(`Production mode`);
    console.log(`CORS enabled for: ${corsOptions.origin}`);
  }
});

export default app;
