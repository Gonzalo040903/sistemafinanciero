//define la funcion de logion que verifica las credenciales y genera un token

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Usuario from '../model/modelUsuario.js';

export const login = async (req, res) => {
    const {nombre, apellido} =  req.body;

    try{
        const usuario = await Usuario.findOne({nombre, apellido});
        if(!usuario) return res.status(404).json({message: "Usuario no encontrado"});

        const token = jwt.sign({id: user._id, rol: user.rol}, ' tu_secreto_jwt', {expiresIn:'1h'});
        res.json({token}); 

    }catch(error) {
        res.status(500).json({message: error.message});
    }
};
export default { login };