import jwt from 'jsonwebtoken';

const autenticarUsuario = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(403).json({ message: 'No se proporcionó un token. Acceso denegado.' });
  }

  const token = authHeader.split(' ')[1]; // Acceder correctamente al token

  if (!token) {
    return res.status(403).json({ message: 'Formato de token incorrecto.' });
  }

  try {
    const decoded = jwt.verify(token, '2024');
    req.usuario = decoded; // Decodificar el token y adjuntarlo a la solicitud
    next(); // Continuar al siguiente middleware o controlador
  } catch (error) {
    res.status(401).json({ message: 'Token no válido. Acceso denegado.' });
  }
};


export default autenticarUsuario;