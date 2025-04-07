import { Router } from 'express';
import Vendedor from '../model/modelVendedor.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { nombre, contraseña } = req.body;
        const vendedor = await Vendedor.findOne({ nombre });

        if (!vendedor) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        let contraseñaValida;
        if (vendedor.rol === 'admin') {
            contraseñaValida = await bcrypt.compare(contraseña, vendedor.contraseña);
        } else {
            contraseñaValida = vendedor.contraseña === contraseña;
        }

        if (!contraseñaValida) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: vendedor._id, rol: vendedor.rol }, '2024', { expiresIn: '1h' });
        res.json({ token, role: vendedor.rol, vendedor });
    } catch (error) {
        //console.error('Error en el login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});

export default router;
