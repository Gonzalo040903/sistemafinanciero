import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path, { join, resolve } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// —————————————————————————————————————
// Recreamos __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// Ruta absoluta al build de tu front
const buildPath = resolve(__dirname, '..', 'front', 'build');
// Logs de depuración para verificar que Express encuentre el build
console.log('🔍 buildPath:', buildPath);
console.log('   exists?', fs.existsSync(buildPath));
console.log('   index.html exists?', fs.existsSync(join(buildPath, 'index.html')));
// —————————————————————————————————————

// Carga variables solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3001;

// …el resto de tu configuración (cors, json, rutas, static, etc.)

// Servir el build de tu frontend
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(join(buildPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
