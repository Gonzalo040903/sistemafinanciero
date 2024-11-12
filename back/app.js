import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { crearAdmin } from './model/modelVendedor.js';
import clientesRouter from './routes/routesC.js';
import prestamosRouter from './routes/routesP.js';
import vendedorRouter from './routes/routesV.js';
import authRouter from './routes/routesAuth.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

//conexion a MongoDB
const uri = 'mongodb+srv://solheredia555:SistemaFinancieroFH@clustersistemafinancier.fxp2b.mongodb.net/Sistema-Financiero?retryWrites=true&w=majority&appName=ClusterSistemaFinanciero';

mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        crearAdmin();
    })
    .catch(err => console.error('Failed to connect to MongoDB Atlas:', err.message));

//Rutas de cliente y prestamo
app.use('/api/clientes', clientesRouter);
app.use('/api/prestamos', prestamosRouter);
app.use('/api/vendedores', vendedorRouter);
app.use('/api', authRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
