import { Router } from 'express';
import Prestamo from '../model/modelPrestamo';
import Cliente from '../model/modelCliente';

const router = Router();

//Crear prestamo
router.post('/', async (req, res) => {
    const {clienteId, monto, interes, cuotasTotales} = req.body;
    try {
        const cliente = await Cliente.findOne(clienteId);
        if(!cliente) {
            return res.status(404).json({message:"'Cliente no encontrado"});
        }
        const nuevoPrestamo = new Prestamo({
            cliente: clienteId,
            monto,
            semanas,
            interes,
            fechaInicio: fechaInicio || Date.now(),

        });
        await nuevoPrestamo.save();
        res.status(201).json(nuevoPrestamo)  
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});
export default router;