import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

type Ctx = { params: Promise<{ dni: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAuth();
  if ('error' in session) return session.error;
  const { dni } = await params;
  const { cuotasPagadas } = await req.json();

  const { data: cliente } = await supabase.from('clientes').select('id').eq('dni', dni).single();
  if (!cliente) return Response.json({ message: 'Cliente no encontrado' }, { status: 404 });

  const { data: prestamo } = await supabase
    .from('prestamos').select('*').eq('cliente_id', cliente.id).eq('activo', true).single();
  if (!prestamo) return Response.json({ message: 'Sin préstamo activo' }, { status: 400 });

  const cuotaValor = prestamo.monto_final / prestamo.cuotas_totales;
  const cuotasNuevas = cuotasPagadas - prestamo.cuotas_pagadas;

  if (cuotasNuevas > 0) {
    await supabase.from('pagos').insert(
      Array.from({ length: cuotasNuevas }, () => ({
        prestamo_id: prestamo.id,
        fecha: new Date().toISOString(),
        monto: cuotaValor,
      }))
    );
  }

  const { data, error } = await supabase
    .from('prestamos')
    .update({
      cuotas_pagadas: cuotasPagadas,
      monto_adeudado: Math.max(0, prestamo.monto_final - cuotaValor * cuotasPagadas),
    })
    .eq('id', prestamo.id).select().single();

  if (error) return Response.json({ message: error.message }, { status: 500 });
  return Response.json(data);
}
