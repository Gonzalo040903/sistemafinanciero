import { Router } from 'express';
import Prestamo from '../model/modelPrestamo.js';
import Cliente from '../model/modelCliente.js';

const router = Router();

//get q me trae todos los prestamos
router.get('/', async (req, res) => {
    try {
        const prestamos = await Prestamo.find().populate('cliente', 'dni nombre apellido -_id');
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get por dni 
router.get('/:dni', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ dni: req.params.dni });
        
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const prestamos = await Prestamo.find({ cliente: cliente._id }).populate('cliente', 'dni nombre apellido -_id');
        if (prestamos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron préstamos para este cliente' });
        }

        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Crear prestamo
router.post('/', async (req, res) => {
    const {dni, monto, semanas, intereses, fechaInicio} = req.body;
    try {
        const cliente = await Cliente.findOne({dni});

        if(!cliente) {
            return res.status(404).json({message:"'Cliente no encontrado"});
        }
        const nuevoPrestamo = new Prestamo({
            cliente: cliente._id,
            monto,
            semanas,
            intereses,
            fechaInicio: fechaInicio || Date.now()
        }); 
        await nuevoPrestamo.save(); 
        res.status(201).json(nuevoPrestamo);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//actualizar prestamo(cuotas y montoadeudado)
router.patch('/:dni', async (req, res) => {
    const {cuotasPagadas} = req.body;
    try {
        const cliente = await Cliente.findOne({ dni: req.params.dni});
        if(!cliente){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }

        const prestamo = await Prestamo.findOne({ cliente: cliente._id});
        if (!prestamo){
            return res.status(404).json({ message: 'Prestamo no encontrado para este cliente'});
        }

        prestamo.cuotasPagadas = cuotasPagadas;
        prestamo.montoAdeudado = prestamo.montoFinal - ((prestamo.montoFinal / prestamo.semanas) * cuotasPagadas);
        await prestamo.save();
        res.json(prestamo);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.delete('/:dni', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ dni: req.params.dni});
        if(!cliente){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }

        const result = await Prestamo.deleteMany({ cliente: cliente._id});
        if (result.deletedCount === 0){
            return res.status(404).json({message: 'No se encontraron prestamos para este cliente'});
        }
        res.json({message: 'Prestamo eliminado'});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;