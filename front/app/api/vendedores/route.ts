import { NextRequest } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const session = await requireAdmin();
  if ('error' in session) return session.error;

  const clerk = await clerkClient();
  const { data } = await clerk.users.getUserList({ limit: 100 });
  return Response.json(data.map(u => {
    const nombre =
      u.username ||
      [u.firstName, u.lastName].filter(Boolean).join(' ') ||
      u.emailAddresses[0]?.emailAddress ||
      u.id;
    return {
      id: u.id,
      nombre,
      rol: (u.publicMetadata as { rol?: string })?.rol ?? 'vendedor',
      creadoEn: u.createdAt,
    };
  }));
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if ('error' in session) return session.error;

  const { nombre, contraseña, rol = 'vendedor' } = await req.json();
  if (!nombre || !contraseña) {
    return Response.json({ message: 'Nombre y contraseña son obligatorios' }, { status: 400 });
  }

  try {
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: nombre,
      password: contraseña,
      publicMetadata: { rol },
    });
    return Response.json({ id: user.id, nombre: user.username, rol }, { status: 201 });
  } catch (err: any) {
    return Response.json({ message: err.errors?.[0]?.message ?? err.message }, { status: 400 });
  }
}
