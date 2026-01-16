import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import sessionRoutes from './routes/sessions.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/carts.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/sessions', sessionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Error interno' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

export default app;
