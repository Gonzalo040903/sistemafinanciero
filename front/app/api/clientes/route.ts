import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth, calcularPrestamo } from '@/lib/auth';

export async function GET() {
  const session = await requireAuth();
  if ('error' in session) return session.error;

  const { data, error } = await supabase
    .from('clientes')
    .select('*, prestamoActual:prestamos(*)')
    .order('apellido');

  if (error) return Response.json({ message: error.message }, { status: 500 });

  // Attach only the active loan as prestamoActual
  const result = (data ?? []).map((c: any) => ({
    ...c,
    prestamoActual: c.prestamoActual?.find((p: any) => p.activo) ?? null,
  }));

  return Response.json(result);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if ('error' in session) return session.error;

  const body = await req.json();
  const { nombre, apellido, dni, direccion, googleMaps,
          telefonoPersonal, telefonoReferencia, telefonoTres, prestamoActual } = body;

  if (!nombre || !apellido || !dni || !direccion || !telefonoPersonal || !prestamoActual) {
    return Response.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
  }

  const { monto, semanas, intereses, soloInteres, fechaInicio, vendedor } = prestamoActual;
  if (!monto || !semanas || !intereses || !fechaInicio || !vendedor) {
    return Response.json({ message: 'El préstamo inicial es obligatorio' }, { status: 400 });
  }

  const { data: cliente, error: ce } = await supabase
    .from('clientes')
    .insert({ nombre, apellido, dni, direccion, google_maps: googleMaps,
              telefono_personal: telefonoPersonal, telefono_referencia: telefonoReferencia,
              telefono_tres: telefonoTres })
    .select().single();

  if (ce) {
    if (ce.code === '23505') return Response.json({ message: 'Ya existe un cliente con ese DNI' }, { status: 409 });
    return Response.json({ message: ce.message }, { status: 500 });
  }

  const calc = calcularPrestamo(Number(monto), Number(intereses), Number(semanas), Boolean(soloInteres));
  const { error: pe } = await supabase.from('prestamos').insert({
    cliente_id: cliente.id, monto: Number(monto), ...calc,
    semanas: Number(semanas), intereses: Number(intereses),
    solo_interes: Boolean(soloInteres), fecha_inicio: fechaInicio, vendedor, activo: true,
  });

  if (pe) return Response.json({ message: pe.message }, { status: 500 });
  return Response.json(cliente, { status: 201 });
}
