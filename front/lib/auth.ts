import { auth } from '@clerk/nextjs/server';

export async function requireAuth() {
  const session = await auth();
  if (!session.userId) return { error: Response.json({ message: 'No autenticado' }, { status: 401 }) };
  const rol = (session.sessionClaims?.metadata as { rol?: string })?.rol ?? 'vendedor';
  return { userId: session.userId, rol };
}

export async function requireAdmin() {
  const result = await requireAuth();
  if ('error' in result) return result;
  if (result.rol !== 'admin') return { error: Response.json({ message: 'Acceso restringido a administradores' }, { status: 403 }) };
  return result;
}

export function calcularPrestamo(monto: number, intereses: number, semanas: number, soloInteres: boolean) {
  const monto_final = soloInteres
    ? monto * (intereses / 100)
    : monto + monto * (intereses / 100);
  return { monto_final, monto_adeudado: monto_final, cuotas_totales: semanas };
}
