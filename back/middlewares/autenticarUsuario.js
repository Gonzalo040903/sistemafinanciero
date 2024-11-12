import jwt from 'jsonwebtoken';

const autenticarUsuario = (req, res, next) => {
    const token = req.header('Autorizar')?.replace('Bearer', '');
    if(!token) {
        return res.status(401).json({message: 'No se proporciono un token. Acesso denegado.'});
    }
    try {
        const decoded = jwt.verify(token, 'financiera2024');
        req.usuario = decoded;
        next()
    } catch (error) {
        res.status(401).json({message: 'Token no valiod. Acceso denegado.'});
    }
    /*const {vendedor} = req.body;
    if(!vendedor) {
        return res.status(401).json({message: 'Acceso dednegado. No autenticado.'});
    }
    next()*/
    /*req.usuario = { nombre: 'Facundo Heredia' }; 
    next();*/
};

export default autenticarUsuario;