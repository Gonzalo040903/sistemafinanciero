import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

function formatearFecha(fecha: string | Date) {
  const d = new Date(fecha);
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function semanaArgentina(): { inicio: string; fin: string } {
  // Argentina = UTC-3, sin horario de verano
  const ahora = new Date();
  const argMs = ahora.getTime() - 3 * 60 * 60 * 1000;
  const argFecha = new Date(argMs);

  // ISO week: lunes = 0, domingo = 6
  const dow = argFecha.getUTCDay();
  const diasDesdeElLunes = dow === 0 ? 6 : dow - 1;

  const lunes = new Date(argFecha);
  lunes.setUTCDate(argFecha.getUTCDate() - diasDesdeElLunes);
  lunes.setUTCHours(0, 0, 0, 0);

  const domingo = new Date(lunes);
  domingo.setUTCDate(lunes.getUTCDate() + 6);
  domingo.setUTCHours(23, 59, 59, 999);

  // Convertir de vuelta a UTC real
  const inicio = new Date(lunes.getTime() + 3 * 60 * 60 * 1000).toISOString();
  const fin    = new Date(domingo.getTime() + 3 * 60 * 60 * 1000).toISOString();
  return { inicio, fin };
}

export async function GET() {
  const session = await requireAuth();
  if ('error' in session) return session.error;

  const { inicio, fin } = semanaArgentina();

  try {
    const [
      { count: nuevosClientes },
      { data: prestamosSemanales },
      { data: pagosSemanales },
    ] = await Promise.all([
      supabase.from('clientes').select('*', { count: 'exact', head: true })
        .gte('created_at', inicio).lte('created_at', fin),
      supabase.from('prestamos').select('id, monto, fecha_inicio, cliente_id')
        .gte('fecha_inicio', inicio).lte('fecha_inicio', fin),
      supabase.from('pagos').select('monto')
        .gte('fecha', inicio).lte('fecha', fin),
    ]);

    // Buscar nombres de clientes por separado
    const ids = [...new Set((prestamosSemanales ?? []).map((p: any) => p.cliente_id))];
    const { data: clientesData } = ids.length
      ? await supabase.from('clientes').select('id, nombre, apellido').in('id', ids)
      : { data: [] };
    const clienteMap: Record<string, { nombre: string; apellido: string }> =
      Object.fromEntries((clientesData ?? []).map((c: any) => [c.id, c]));

    return Response.json({
      nuevosClientes: nuevosClientes ?? 0,
      totalPrestamos: prestamosSemanales?.length ?? 0,
      totalPrestado:  prestamosSemanales?.reduce((s: number, p: any) => s + Number(p.monto), 0) ?? 0,
      totalCobrado:   pagosSemanales?.reduce((s: number, p: any) => s + Number(p.monto), 0) ?? 0,
      prestamosDeLaSemana: (prestamosSemanales ?? []).map((p: any) => {
        const c = clienteMap[p.cliente_id];
        return {
          cliente: c ? `${c.nombre} ${c.apellido}` : '—',
          monto: p.monto,
          fechaFormateada: formatearFecha(p.fecha_inicio),
        };
      }),
      fechaHoy: formatearFecha(new Date()),
    });
  } catch (err) {
    console.error('balance-semanal error:', err);
    return Response.json({ message: 'Error al calcular balance semanal' }, { status: 500 });
  }
}
