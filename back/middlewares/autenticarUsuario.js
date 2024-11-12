const autenticarUsuario = (req, res, next) => {
    req.usuario = { nombre: 'Facundo Heredia' }; 
    next();
};

export default autenticarUsuario;