import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRoutes from './routes/urls.routes';
import authRoutes from './routes/auth.routes';


dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN_URL || 'http://localhost:5173',
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

export default app;