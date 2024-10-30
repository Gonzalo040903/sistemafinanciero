import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/rutas.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
const uri = 'mongodb://localhost:27017/Sistema-Financiero';
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));
app.use('/api', router);
app.listen(POR,()=>{
    console.log(`Server running on port ${PORT}`);
});

