import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import serverless from 'serverless-http';

import clientesRouter from '../routes/routesC.js';
import prestamosRouter from '../routes/routesP.js';
import vendedorRouter from '../routes/routesV.js';
import authRouter from '../routes/routesAuth.js';

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const uri = 'mongodb+srv://solheredia555:SistemaFinancieroFH@clustersistemafinancier.fxp2b.mongodb.net/Sistema-Financiero?retryWrites=true&w=majority&appName=ClusterSistemaFinanciero';

mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch(err => console.error('Failed to connect to MongoDB Atlas:', err.message));

// Rutas
app.use('/.netlify/functions/api/clientes', clientesRouter); // Netlify requiere el prefijo '/.netlify/functions'
app.use('/.netlify/functions/api/prestamos', prestamosRouter);
app.use('/.netlify/functions/api/vendedores', vendedorRouter);
app.use('/.netlify/functions/api', authRouter);

// Exportar como handler
export const handler = serverless(app);
