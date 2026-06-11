import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') dotenv.config();

import clientesRouter  from './routes/routesC.js';
import vendedorRouter  from './routes/routesV.js';
import reporteRouter   from './routes/reporte.js';

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(process.env.NODE_ENV === 'production'
  ? cors({ origin: process.env.FRONTEND_URL, methods: ['GET','POST','PUT','DELETE','PATCH'] })
  : cors()
);
app.use(express.json());

app.use('/api/clientes',  clientesRouter);
app.use('/api/vendedores', vendedorRouter);
app.use('/api/reporte',   reporteRouter);

app.get('/ping', (_req, res) => res.send('pong'));

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
