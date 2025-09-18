import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRoutes from './routes/urls.routes'


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/urls', urlRoutes);

export default app;