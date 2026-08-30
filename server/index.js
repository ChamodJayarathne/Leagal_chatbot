import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import rightsRoutes from './routes/rights.js';
import lawyerRoutes from './routes/lawyers.js';
import documentRoutes from './routes/documents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB (with automatic fallback mode)
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'LegalAI Sri Lanka Backend',
    timestamp: new Date(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/rights', rightsRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/documents', documentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` LegalAI Sri Lanka Server running on port ${PORT}`);
  console.log(` Base API URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
