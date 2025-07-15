import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { contentRoutes } from './routes/content';

// Load environment variables from .env.backend
dotenv.config({ path: '.env.backend' });

const app = express();
const port = process.env.PORT || 3001;
const allowedOrigin = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Routes
app.use('/api/content', contentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Backend server is running at http://localhost:${port}`);
});