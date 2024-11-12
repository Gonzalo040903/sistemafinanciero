import { Router } from "express";
import Vendedor from "../model/modelVendedor";

const router = Router();
router.post('/login', async (req, res) => {
    try{
        const {nombre, password} = req.body;
        const vendedor = await Vendedor.findOne({nombre});
        if(!vendedor){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        if(vendedor.password !== password.trim()) {
            return res.status(401).json({message: 'Contraseña incorrecta.'});
        }
    }catch(error){
        return res.status(500).json({message: error.message});
    }
});

export default router;