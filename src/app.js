import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

import sessionRoutes from './routes/sessions.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/carts.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use('/api/sessions', sessionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'API Ecommerce - Proyecto Final',
    version: '1.0.0',
    author: 'Estudiante',
    endpoints: {
      sessions: '/api/sessions',
      products: '/api/products',
      carts: '/api/carts'
    }
  });
});

app.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restablecer Contraseña</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: 50px auto;
          padding: 20px;
        }
        .form-container {
          border: 1px solid #ddd;
          padding: 30px;
          border-radius: 10px;
        }
        input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          background: #007bff;
          color: white;
          padding: 12px;
          width: 100%;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .message {
          margin-top: 20px;
          padding: 10px;
          border-radius: 5px;
        }
        .success {
          background: #d4edda;
          color: #155724;
        }
        .error {
          background: #f8d7da;
          color: #721c24;
        }
      </style>
    </head>
    <body>
      <div class="form-container">
        <h2>Restablecer Contraseña</h2>
        <p>Proyecto Final - Ecommerce</p>
        
        <form id="resetForm">
          <input type="password" id="password" placeholder="Nueva contraseña" required>
          <input type="password" id="confirmPassword" placeholder="Confirmar contraseña" required>
          <button type="submit">Restablecer</button>
        </form>
        
        <div id="message"></div>
      </div>
      
      <script>
        const form = document.getElementById('resetForm');
        const message = document.getElementById('message');
        const token = '${token}';
        
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirmPassword').value;
          
          if (password !== confirmPassword) {
            showMessage('Las contraseñas no coinciden', 'error');
            return;
          }
          
          try {
            const response = await fetch('/api/sessions/reset-password/' + token, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
              showMessage('Contraseña actualizada correctamente', 'success');
              form.reset();
            } else {
              showMessage(data.message, 'error');
            }
          } catch (error) {
            showMessage('Error de conexión', 'error');
          }
        });
        
        function showMessage(text, type) {
          message.textContent = text;
          message.className = 'message ' + type;
        }
      </script>
    </body>
    </html>
  `);
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.path 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('='.repeat(50));
});