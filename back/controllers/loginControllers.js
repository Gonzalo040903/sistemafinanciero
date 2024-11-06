import jwt from 'jsonwebtoken';
import Usuario from '../model/modelUsuario.js';

export const login = async (req, res) => {
    const { nombre, apellido } = req.body;
  
    try {
      const usuario = await Usuario.findOne({ nombre, apellido });
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      
      const token = jwt.sign(
        {id:usuario._id, role:usuario.role},
        'FINANCIERA',
        { expiresIn:'1h' }
      );

      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        usuario: { nombre: usuario.nombre, role: usuario.role }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export default { login };