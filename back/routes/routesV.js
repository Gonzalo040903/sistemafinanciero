import { Router } from 'express';
import { createClerkClient } from '@clerk/backend';
import autenticarUsuario from '../middlewares/autenticarUsuario.js';
import verificarAdmin from '../middlewares/verificarAdmin.js';

const router = Router();
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

router.use(autenticarUsuario, verificarAdmin);

// GET /api/vendedores
router.get('/', async (_req, res) => {
  const { data } = await clerk.users.getUserList({ limit: 100 });
  const vendedores = data.map(u => ({
    id: u.id,
    nombre: u.username,
    rol: u.publicMetadata?.rol ?? 'vendedor',
    creadoEn: u.createdAt,
  }));
  res.json(vendedores);
});

// POST /api/vendedores — crear vendedor vía Clerk
router.post('/', async (req, res) => {
  const { nombre, contraseña, rol = 'vendedor' } = req.body;
  if (!nombre || !contraseña) {
    return res.status(400).json({ message: 'Nombre y contraseña son obligatorios' });
  }

  try {
    const user = await clerk.users.createUser({
      username: nombre,
      password: contraseña,
      publicMetadata: { rol },
    });
    res.status(201).json({ id: user.id, nombre: user.username, rol });
  } catch (err) {
    const msg = err.errors?.[0]?.message ?? err.message;
    res.status(400).json({ message: msg });
  }
});

// DELETE /api/vendedores/:id
router.delete('/:id', async (req, res) => {
  try {
    await clerk.users.deleteUser(req.params.id);
    res.json({ message: 'Vendedor eliminado' });
  } catch (err) {
    res.status(404).json({ message: 'Vendedor no encontrado' });
  }
});

export default router;
