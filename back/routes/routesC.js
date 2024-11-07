import {Router} from 'express';
import Cliente from '../model/modelCliente.js'

const router = Router();

//crear cliente
router.post('/', async (req, res) => {

    const {nombre, apellido, dni, direccion, telefonoPersonal, telefonoReferencia, telefonoTres} = req.body;
    if(!nombre || !apellido || !dni || !direccion || !telefonoPersonal || !telefonoReferencia || !telefonoTres){
        return res.status(400).json({message:'Todos los campos son obligarorios'});
    }

    const nuevoCliente = new Cliente({
        nombre,
        apellido,
        dni,
        direccion,
        telefonoPersonal,
        telefonoReferencia,
        telefonoTres
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
//obtener por apellido
router.get('/:apellido', async (req, res) => {
    try {
        const cliente = await Cliente.find({ apellido:  req.params.apellido});
        if(cliente.length === 0){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//actualizar cliente
router.patch('/:apellido', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ apellido: req.params.apellido});
        if(cliente == null){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        const {nombre, apellido, dni, direccion, telefonoPersonal, telefonoReferencia, telefonoTres} = req.body;
        if(nombre) cliente.nombre = nombre;
        if(apellido) cliente.apellido = apellido;
        if(dni) cliente.dni = dni;
        if(direccion) cliente.direccion = direccion;
        if(telefonoPersonal) cliente.telefonoPersonal = telefonoPersonal;
        if(telefonoReferencia) cliente.telefonoReferencia = telefonoReferencia;
        if(telefonoTres) cliente.telefonoTres = telefonoTres;
        await cliente.save();
        res.json({message:'Cliente actualizado', cliente});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//eliminar cliente
router.delete('/:apellido', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ apellido: req.params.apellido});
        if(cliente == null){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        await cliente.deleteOne({ apellido: req.params.apellido})
        res.json({message: 'Cliente eliminado'});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;