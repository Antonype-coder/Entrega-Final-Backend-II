import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
