import jwt from 'jsonwebtoken';

const autenticarUsuario = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(403).json({ message: 'No se proporcionó un token. Acceso denegado.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Formato de token incorrecto.' });
  }

  try {
    const decoded = jwt.verify(token,'financiera2024');
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido. Acceso denegado.' });
  }
};


export default autenticarUsuario;