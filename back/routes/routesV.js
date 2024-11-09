import {Router} from 'express';
import Vendedor from '../model/modelVendedor.js';
//import autenticarUsuario from '../middlewares/autencitarUsuario.js';
//import verificarAdmin from '../middlewares/verificarAdmin.js';

const router = Router();

//router.use(autenticarUsuario);

router.post('/', async(req, res)=> {
    try{
        const {nombre, apellido, contraseña } = req.body;
        if(!nombre || !apellido || !contraseña){
            return res.status(400).json({message: 'Todos los campos son obligatorios.'});

        }
        const nuevoVendedor = new Vendedor({nombre, apellido, contraseña});
        await nuevoVendedor.save();
        res.status(201).json({message:'Vendedor creado con exito.', vendedor: nuevoVendedor});

    }catch(error){
        res.status.apply(500).json({message: error.message});
    }
});

router.get('/:nombre', async(req, res) =>{
    try{
        const vendedor = await Vendedor.findOne(req.params.nombre);
        if(!vendedor){
            return res.status(404).json({message:'Vendedor no encontraado.'});
        }
        res.json(vendedor);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.delete('/nombre', async(req, res) =>{
    try{
        const vendedor = await Vendedor.findOne(req.params.id);
        if(!vendedor){
            return res.status(404).json({message:'Vendedor no encontrado.'});
        }
        await vendedor.deleteOne();
        res.json({message: 'Vendedor eliminado con exito.'});
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

export default router;
