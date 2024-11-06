//define la funcion de logion que verifica las credenciales y genera un token

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Usuario from '../model/modelUsuario.js';

async function login(req, res) {
    const {nombre, apellido} =  req.body;
    const usuario = await Usuario.findOne({nombre, apellido});

    if(!Usuario){
        return res.status(401).json({ error: 'Credenciales incorrectas'});

    }
    const isMatch = await bcrypt.compare(apellido, Usuario.password);
    if(!isMatch){
        return res.status(401).json({ error: 'Credenciales incorrectas'});
    }
    const token = jwt.sign({usuarioId: usuario._id, role: usuario.role}, 'secret_key');
    res.json({token, role: usuario.role});

}
export default { login };