import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

type Ctx = { params: Promise<{ dni: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await requireAuth();
  if ('error' in session) return session.error;
  const { dni } = await params;

  const { data, error } = await supabase.from('clientes').select('*').eq('dni', dni).single();
  if (error || !data) return Response.json({ message: 'Cliente no encontrado' }, { status: 404 });
  return Response.json(data);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAuth();
  if ('error' in session) return session.error;
  const { dni } = await params;

  const { nombre, apellido, dni: nuevoDni, direccion, googleMaps,
          telefonoPersonal, telefonoReferencia, telefonoTres } = await req.json();

  const updates: Record<string, unknown> = {};
  if (nombre)            updates.nombre              = nombre;
  if (apellido)          updates.apellido             = apellido;
  if (nuevoDni)          updates.dni                  = nuevoDni;
  if (direccion)         updates.direccion             = direccion;
  if (googleMaps)        updates.google_maps           = googleMaps;
  if (telefonoPersonal)  updates.telefono_personal     = telefonoPersonal;
  if (telefonoReferencia) updates.telefono_referencia  = telefonoReferencia;
  if (telefonoTres)      updates.telefono_tres         = telefonoTres;

  const { data, error } = await supabase.from('clientes').update(updates).eq('dni', dni).select().single();
  if (error || !data) return Response.json({ message: 'Cliente no encontrado' }, { status: 404 });
  return Response.json({ message: 'Cliente actualizado', cliente: data });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await requireAuth();
  if ('error' in session) return session.error;
  const { dni } = await params;

  const { error } = await supabase.from('clientes').delete().eq('dni', dni);
  if (error) return Response.json({ message: error.message }, { status: 500 });
  return Response.json({ message: 'Cliente eliminado' });
}
