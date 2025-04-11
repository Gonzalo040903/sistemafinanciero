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

dotenv.config(); // Cargar variables de entorno desde un archivo .env

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // URL de tu frontend desplegado
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    
}));

app.use(express.json());

// Conexión a MongoDB
const uri = process.env.MONGODB_URI || 'mongodb+srv://solheredia555:SistemaFinancieroFH@clustersistemafinancier.fxp2b.mongodb.net/Sistema-Financiero?retryWrites=true&w=majority&appName=ClusterSistemaFinanciero';

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