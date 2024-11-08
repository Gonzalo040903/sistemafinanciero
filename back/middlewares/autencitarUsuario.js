// Middleware de autenticación simulado para siempre reconocer a Facundo Heredia
const autenticarUsuario = (req, res, next) => {
    req.user = { nombre: 'Facundo Heredia' }; 
    next();
};

export default autenticarUsuario;