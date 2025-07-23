import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv'; // Para cargar las variables de entorno
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
console.log('🔍 buildPath:', buildPath);
console.log('  exists?', fs.existsSync(buildPath));
console.log('  index.html exists?', fs.existsSync(join(buildPath, 'index.html')));
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(join(buildPath, 'index.html'));
});
// Carga variables solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  dotenv.config(); // leerá tu .env con MONGODB_URI y PORT=3001
}

const app = express();

// En producción process.env.PORT viene de Railway; en local usa tu PORT=3001
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
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas:', err.message));

// Rutas de la API
import clientesRouter from './routes/routesC.js';
import prestamosRouter from './routes/routesP.js';
import vendedorRouter from './routes/routesV.js';
import authRouter from './routes/routesAuth.js';
import reporteSemanal from './routes/reporte.js';

app.use('/api/clientes', clientesRouter);
app.use('/api/prestamos', prestamosRouter);
app.use('/api/vendedores', vendedorRouter);
app.use('/api', authRouter);
app.use('/api/reporte', reporteSemanal);

// Ruta de test de IP
app.get('/ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.send(`IP pública detectada: ${ip}`);
});

// Servir el build de tu frontend
const buildPath = path.resolve(__dirname, '..', 'front', 'build');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Iniciar el servidor en 0.0.0.0 para recibir conexiones externas

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});


