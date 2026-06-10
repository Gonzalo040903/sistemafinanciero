import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

type Ctx = { params: Promise<{ dni: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await requireAuth();
  if ('error' in session) return session.error;
  const { dni } = await params;

  const { data: cliente } = await supabase.from('clientes').select('id').eq('dni', dni).single();
  if (!cliente) return Response.json({ message: 'Cliente no encontrado' }, { status: 404 });

  const { data, error } = await supabase
    .from('prestamos').select('*, pagos(*)')
    .eq('cliente_id', cliente.id)
    .order('created_at', { ascending: false });

  if (error) return Response.json({ message: error.message }, { status: 500 });
  return Response.json(data);
}
