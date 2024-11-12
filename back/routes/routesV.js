import {Router} from 'express';
import Vendedor from '../model/modelVendedor.js';
//import autenticarUsuario from '../middlewares/autenticarUsuario.js';
//import verificarAdmin from '../middlewares/verificarAdmin.js';

const router = Router();
router.use(autenticarUsuario);

router.post('/', verificarAdmin, async(req, res)=> {
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

router.get('/',  async (req, res) => {
    try {
        const vendedores = await Vendedor.find({}, "nombre apellido contraseña");
        res.json(vendedores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async(req, res) =>{
    try{
        const vendedor = await Vendedor.findById(req.params.id);
        if(!vendedor){
            return res.status(404).json({message:'Vendedor no encontrado.'});
        }
        res.json(vendedor);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.delete('/:id', autenticarUsuario, async(req, res) =>{
    try{
        const vendedor = await Vendedor.findById(req.params.id);
        if(!vendedor){
            return res.status(404).json({message:'Vendedor no encontrado.'});
        }
        await vendedor.deleteOne();
        res.json({message: 'Vendedor eliminado con exito.'});
    }catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;
