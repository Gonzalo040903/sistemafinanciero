import {Router} from 'express';
import Cliente from '../model/modelCliente.js'

const router = Router();

//crear cliente
router.post('/', async (req, res) => {

    const {nombre, apellido, dni, direccion, telefonoPersonal, telefonoReferencia} = req.body;
    if(!nombre || !apellido || !dni || !direccion || !telefonoPersonal || !telefonoReferencia){
        return res.status(400).json({message:'Todos los campos son obligarorios'});
    }

    const nuevoCliente = new Cliente({
        nombre,
        apellido,
        dni,
        direccion,
        telefonoPersonal,
        telefonoReferencia
    });

    try {
      const clienteGuardado = await nuevoCliente.save();
      res.status(201).json(clienteGuardado);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
});

//Obetener Clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }   
});
//obtener por dni
router.get('/:apellido', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({dni: req.params.dni});
        if(cliente == null){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//actualizar cliente
router.patch('/:dni', async (req, res) => {
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
        res.json({message:'Cliente actualizado', cliente});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//eliminar cliente
router.delete('/:dni', async (req, res) => {
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

export default router;
