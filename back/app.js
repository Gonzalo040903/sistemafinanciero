import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import clientesRouter from './routes/routesC.js';
import prestamosRouter from './routes/routesP.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

//conexion a MongoDB
const uri = 'mongodb+srv://solheredia555:SistemaFinancieroFH@clustersistemafinancier.fxp2b.mongodb.net/Sistema-Financiero?retryWrites=true&w=majority';
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.log('Failed to connect to MongoDB Atlas', err));
//Rutas de cliente y prestamo
app.use('/api/clientes',  clientesRouter);
app.use('/api/prestamos', prestamosRouter);

//inicia el servidor
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

