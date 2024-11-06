
import Usuario from '../model/modelUsuario.js';

export const login = async (req, res) => {
    const { nombre, apellido } = req.body;
  
    try {
      const user = await Usuario.findOne({ nombre, apellido });
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  
      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: { nombre: user.nombre, role: user.role }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export default { login };