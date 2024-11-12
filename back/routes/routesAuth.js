import { Router } from "express";
import Vendedor from "../model/modelVendedor.js";
import bcrypt from 'bcrypt';

router.post('/login', async (req, res) => {
    try {
        const { nombre, password } = req.body;
        console.log('Intento de login:', nombre, password);
        const vendedor = await Vendedor.findOne({ nombre });

        if (!vendedor) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (vendedor.rol === 'admin') {
            const passwordValida = await bcrypt.compare(password, vendedor.contraseña);
            if (!passwordValida) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        } else {
            if (vendedor.contraseña !== password) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        }

        console.log('Inicio de sesión exitoso para:', vendedor.nombre);
        res.json({ role: vendedor.rol, vendedor });
    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});


export default router;