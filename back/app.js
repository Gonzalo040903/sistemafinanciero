import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { crearAdmin } from './model/modelVendedor.js';

import clientesRouter from './routes/routesC.js';
import prestamosRouter from './routes/routesP.js';
import vendedorRouter from './routes/routesV.js';
//import initAdmin from './initAdmin.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

//conexion a MongoDB
const uri = 'mongodb+srv://solheredia555:SistemaFinancieroFH@clustersistemafinancier.fxp2b.mongodb.net/Sistema-Financiero?retryWrites=true&w=majority&appName=ClusterSistemaFinanciero';

mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB');
        crearAdmin();
    //initAdmin();
    })
    .catch(err => console.error('Failed to connect to MongoDB:', err.message));

//Rutas de cliente y prestamo
app.use('/api/clientes', clientesRouter);
app.use('/api/prestamos', prestamosRouter);
app.use('/api/vendedores', vendedorRouter);
//console.log('Attempting to connect to MongoDB Atlas...');
//mongoose.connect(uri)
  //  .then(() => console.log('Connected to MongoDB Atlas'))
   // .catch(err => console.error('Failed to connect to MongoDB:', err.message));
//inicia el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
