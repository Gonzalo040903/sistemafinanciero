const verificarAdmin = (req, res, next) => {
   
    if (req.usuario && req.usuario.rol === "admin"){
        next();
    } else {
        // res.redirect('/panel');
        res.status(403).json({ message: 'Acceso denegado. Solo el administrador puede realizar esta acción.' });
    }
};
export default verificarAdmin;