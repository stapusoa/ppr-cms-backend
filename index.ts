import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { contentRoutes } from './routes/content';
import { checkJwt } from './utils/auth'; // 🔐 Import middleware

// Load environment variables from .env.backend
dotenv.config({ path: '.env.backend' });

const app = express();
const port = process.env.PORT || 3001;
const allowedOrigin = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Routes — 🔐 apply JWT check before accessing content routes
app.use('/api/content', checkJwt, contentRoutes);

// Health check (no auth needed)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Backend server is running at http://localhost:${port}`);
});