import { NextRequest } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { requireAdmin } from '@/lib/auth';

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if ('error' in session) return session.error;
  const { id } = await params;

  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);
    return Response.json({ message: 'Vendedor eliminado' });
  } catch {
    return Response.json({ message: 'Vendedor no encontrado' }, { status: 404 });
  }
}
