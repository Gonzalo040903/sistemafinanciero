const verificarAdmin = (req, res, next) => {
    //console.log('Usuario en el req:', req.usuario);
    if (req.usuario && req.usuario.rol === "admin"){
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Solo el administrador puede realizar esta acción.' });
    }
};
export default verificarAdmin;