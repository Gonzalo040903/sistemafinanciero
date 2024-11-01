import {Router} from 'express';
import Cliente from '../model/modelCliente.js'
import Prestamo from '../model/modelPrestamo.js';

const router = Router();

//Obetener Clientes
router.get('/clientes', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes)
    
    } catch (error) {
        res.status(500).json({message:error.message});
    
    }   
});
//obtener por dni
router.get('/clientes', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({dni: req.params.dni});
        if(cliente == null){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        res.json(cliente)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//actualizar cliente
router.patch('/clientes/:dni', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({dni: req.params.dni});
        if(cliente == null){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        const {nombre, apellido,dni, direccion, telefonoPersonal, telefonoReferencia } = req.body;
        if(nombre) cliente.nombre = nombre;
        if(apellido) cliente.apellido = apellido;
        if(dni) cliente.dni = dni;
        if(direccion) cliente.direccion = direccion;
        if(telefonoPersonal) cliente.telefonoPersonal = telefonoPersonal;
        if(telefonoReferencia) cliente.telefonoReferencia = telefonoReferencia;
        await cliente.save();
        res.json({message:'Cliente actualizado', cliente})

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//eliminar cliente
router.delete('/clientes/:dni', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({dni: req.params.dni});
        if(cliente == null){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        await cliente.deleteOne({dni: req.params.dni})
        res.json({message: 'Cliente eliminado'});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//actualizar prestamo(cuotas y montoadeudado)
router.patch('/:id', async (req, res) => {
    const {cuotasPagadas} = req.body;
    try {
        const prestamo = await Prestamo.findById(req.params.id);
        if(!prestamo){
            return res.status(404).json({message: 'Prestamo no encontrado'});
        }
        prestamo.cuotasPagadas = cuotasPagadas;
        prestamo.montoAdeudado = prestamo.montoFinal - ((prestamo.montoFinal / prestamo.semanas) * cuotasPagadas);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
export default router;