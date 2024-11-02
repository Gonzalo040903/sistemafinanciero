import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import clientesRouter from './routes/routesC.js';
import prestammosRouter from './routes/routesP.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

//conexion a MongoDB
const uri = 'mongodb://localhost:27017/Sistema-Financiero';
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));
//Rutas de cliente y prestamo
app.use('/api/clientes', clientesRouter);
app.use('/api/prestamos', prestammosRouter);
//inicia el servidor
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

