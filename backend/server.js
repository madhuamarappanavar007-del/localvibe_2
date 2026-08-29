import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import eventsRouter from './routes/events.js';
import usersRouter from './routes/users.js';
import rsvpRouter from './routes/rsvp.js';
import geocodeRouter from './routes/geocode.js';

const app = express();
const PORT = process.env.PORT || 5000;

const isDevelopment = process.env.NODE_ENV !== 'production';

const getAllowedOrigins = () => {
  const origins = [process.env.FRONTEND_URL].filter(Boolean);
  if (isDevelopment) {
    origins.push(
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    );
  }
  return origins;
};

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  })
);

app.use(express.json());

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'LocalVibe API' });
});

app.use('/api/events', eventsRouter);
app.use('/api/events', rsvpRouter);
app.use('/api/users', usersRouter);
app.use('/api/geocode', geocodeRouter);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`LocalVibe API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });