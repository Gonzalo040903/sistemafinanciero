import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth, calcularPrestamo } from '@/lib/auth';

type Ctx = { params: Promise<{ dni: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAuth();
  if ('error' in session) return session.error;
  const { dni } = await params;
  const { prestamoActual, moverHistorial } = await req.json();
  const { monto, semanas, intereses, soloInteres, fechaInicio, vendedor } = prestamoActual;

  const { data: cliente } = await supabase.from('clientes').select('id').eq('dni', dni).single();
  if (!cliente) return Response.json({ message: 'Cliente no encontrado' }, { status: 404 });

  if (moverHistorial) {
    await supabase.from('prestamos').update({ activo: false })
      .eq('cliente_id', cliente.id).eq('activo', true);
  }

  const calc = calcularPrestamo(Number(monto), Number(intereses), Number(semanas), Boolean(soloInteres));
  const { data, error } = await supabase.from('prestamos').insert({
    cliente_id: cliente.id, monto: Number(monto), ...calc,
    semanas: Number(semanas), intereses: Number(intereses),
    solo_interes: Boolean(soloInteres), fecha_inicio: fechaInicio, vendedor, activo: true,
  }).select().single();

  if (error) return Response.json({ message: error.message }, { status: 500 });
  return Response.json(data);
}
