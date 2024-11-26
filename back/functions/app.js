import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import serverless from 'serverless-http';

import clientesRouter from '../routes/routesC.js';
import prestamosRouter from '../routes/routesP.js';
import vendedorRouter from '../routes/routesV.js';
import authRouter from '../routes/routesAuth.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const uri = process.env.MONGO_URI || 'mongodb+srv://solheredia555:SistemaFinancieroFH@clustersistemafinancier.fxp2b.mongodb.net/Sistema-Financiero?retryWrites=true&w=majority&appName=ClusterSistemaFinanciero'; // Usa variables de entorno para mayor seguridad
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Failed to connect to MongoDB Atlas:', err.message));

// Rutas (todas con prefijo para Netlify Functions)
app.use('/.netlify/functions/api/clientes', clientesRouter);
app.use('/.netlify/functions/api/prestamos', prestamosRouter);
app.use('/.netlify/functions/api/vendedores', vendedorRouter);
app.use('/.netlify/functions/api/auth', authRouter);

// Exportar como handler para Netlify Functions
export const handler = serverless(app);
