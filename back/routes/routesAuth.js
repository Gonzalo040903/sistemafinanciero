import { Router } from "express";
import Vendedor from "../model/modelVendedor.js";
import bcrypt from 'bcrypt';

const router = Router();
router.post('/login', async (req, res) => {
    try {
        const { nombre, contraseña } = req.body;
        const vendedor = await Vendedor.findOne({ nombre });

        if (!vendedor) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar contraseña basada en el rol
        if (vendedor.rol === 'admin') {
            const contraseñaValida = await bcrypt.compare(contraseña, vendedor.contraseña);
            if (!contraseñaValida) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        } else {
            // Comparar directamente para los vendedores con contraseña sin encriptar
            if (vendedor.contraseña !== contraseña) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        }

        // Generar y devolver el token de autenticación si la validación es exitosa
        const token = jwt.sign({ id: vendedor._id, rol: vendedor.rol }, 'financiera2024', { expiresIn: '1h' });
        res.json({ token, role: vendedor.rol, vendedor });
    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});


export default router;