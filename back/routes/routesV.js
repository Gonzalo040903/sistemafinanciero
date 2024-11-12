import { Router } from 'express';
import Vendedor from '../model/modelVendedor.js';
// import autenticarUsuario from '../middlewares/autenticarUsuario.js';
// import verificarAdmin from '../middlewares/verificarAdmin.js';

const router = Router();
// router.use(autenticarUsuario);
// router.use(verificarAdmin);
router.post('/', async (req, res) => {
    try {
        const { nombre, contraseña } = req.body;
        if (!nombre || !contraseña) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }
        const nuevoVendedor = new Vendedor({ nombre, contraseña });
        await nuevoVendedor.save();
        res.status(201).json({ message: 'Vendedor creado con éxito.', vendedor: nuevoVendedor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const vendedores = await Vendedor.find({}, 'nombre contraseña');
        res.json(vendedores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id',async(req, res) =>{
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

router.delete('/:id', async(req, res) =>{
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
