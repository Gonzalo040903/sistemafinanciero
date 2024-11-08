//verifica solo al admin a realizar un vendedor
const verificarAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'Facundo Heredia') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Solo el administrador puede realizar esta acción.' });
    }
};
export default verificarAdmin;