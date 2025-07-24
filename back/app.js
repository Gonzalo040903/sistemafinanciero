// back/app.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path, { join, resolve } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
console.log('🔍 buildPath:', buildPath);
console.log('   exists?', fs.existsSync(buildPath));
console.log('   index.html exists?', fs.existsSync(join(buildPath, 'index.html')));

// Recrear __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// Ruta absoluta al build de tu front
const buildPath = resolve(__dirname, '..', 'front', 'build');

// Logs de depuración para verificar que Express encuentre tu build
console.log('🔍 buildPath:', buildPath);
console.log('   exists?', fs.existsSync(buildPath));
console.log('   index.html exists?', fs.existsSync(join(buildPath, 'index.html')));


// Carga variables de entorno solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  dotenv.config(); // leerá tu .env con MONGODB_URI y PORT=3001
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'https://sistemafinanciero.up.railway.app', // tu frontend en Railway
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(express.json());

// Conexión a MongoDB
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ No se encontró la URI de MongoDB. Revisá tus variables de entorno.');
  process.exit(1);
}
mongoose.connect(uri)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ Failed to connect to MongoDB Atlas:', err.message));

// Rutas de la API
import clientesRouter   from './routes/routesC.js';
import prestamosRouter  from './routes/routesP.js';
import vendedorRouter   from './routes/routesV.js';
import authRouter       from './routes/routesAuth.js';
import reporteSemanal   from './routes/reporte.js';

app.use('/api/clientes',  clientesRouter);
app.use('/api/prestamos', prestamosRouter);
app.use('/api/vendedores', vendedorRouter);
app.use('/api', authRouter);
app.use('/api/reporte', reporteSemanal);

// Ruta de sanity check
app.get('/ping', (_req, res) => res.send('pong'));

// Servir el build de tu frontend
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(join(buildPath, 'index.html'));
});

// Iniciar el servidor en todas las interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
