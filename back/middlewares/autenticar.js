import jwt from 'jsonwebtoken';

const autenticar = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message: "Acesso no autorizado"});

    try{
        const decoded = jwt.verify(token, 'tu_secreto_jwt');
        req.user = decoded;
        next();
    }catch(error){
        res.status(401).json({message: "Token no valido"});
    }
};
export default autenticar;