import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function autenticarUsuario(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token requerido' });

  try {
    const payload = await clerk.verifyToken(token);
    req.usuario = {
      id: payload.sub,
      rol: payload.metadata?.rol ?? 'vendedor',
    };
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}
