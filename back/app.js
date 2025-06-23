import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv'; // Para cargar las variables de entorno

// Importar rutas
import clientesRouter from './routes/routesC.js';
import prestamosRouter from './routes/routesP.js';
import vendedorRouter from './routes/routesV.js';
import authRouter from './routes/routesAuth.js';
import reporteSemanal from './routes/reporte.js';

dotenv.config(); // Cargar variables de entorno desde un archivo .env

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: 'https://sistemafinanciero.up.railway.app', // URL de tu frontend desplegado
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    
}));

app.use(express.json());

// Conexión a MongoDB
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('❌ No se encontró la URI de MongoDB. Revisá tus variables de entorno.');
    process.exit(1); // Detiene la app si no hay URI
}

mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        // Si necesitas crear un admin, descomenta la línea
        // crearAdmin();
    })
    .catch(err => console.error('Failed to connect to MongoDB Atlas:', err.message));

// Rutas de la API
app.use('/api/clientes', clientesRouter);
app.use('/api/prestamos', prestamosRouter);
app.use('/api/vendedores', vendedorRouter);
app.use('/api', authRouter);
app.use('/api/reporte', reporteSemanal);

app.get('/ip', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.send(`IP pública detectada: ${ip}`);
});


const buildPath = path.resolve('front', 'build');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`);
});

import { conectarWhatsApp } from './services/whatsappService.js';
import { iniciarCron } from './cron/whatsappCron.js';

async function iniciarApp() {
    await conectarWhatsApp();
    iniciarCron();
}

iniciarApp();