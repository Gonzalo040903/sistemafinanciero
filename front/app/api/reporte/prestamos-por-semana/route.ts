import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

function inicioSemana(offsetSemanas: number): Date {
  const ahora = new Date();
  const argMs = ahora.getTime() - 3 * 60 * 60 * 1000;
  const arg = new Date(argMs);
  const dow = arg.getUTCDay();
  const diasDesdeElLunes = dow === 0 ? 6 : dow - 1;
  const lunes = new Date(arg);
  lunes.setUTCDate(arg.getUTCDate() - diasDesdeElLunes - offsetSemanas * 7);
  lunes.setUTCHours(0, 0, 0, 0);
  return new Date(lunes.getTime() + 3 * 60 * 60 * 1000);
}

export async function GET() {
  const session = await requireAuth();
  if ('error' in session) return session.error;

  try {
    // Obtener préstamos de las últimas 8 semanas
    const desde = inicioSemana(7).toISOString();

    const { data: prestamos, error } = await supabase
      .from('prestamos')
      .select('fecha_inicio, monto')
      .gte('fecha_inicio', desde);

    if (error) {
      console.error('prestamos-por-semana error:', error);
      return Response.json({ message: error.message }, { status: 500 });
    }

    // Agrupar por semana (índice 0 = semana actual, 7 = hace 7 semanas)
    const semanas: { semana: string; total: number; monto: number }[] = [];

    for (let i = 7; i >= 0; i--) {
      const inicio = inicioSemana(i);
      const fin = new Date(inicio.getTime() + 7 * 24 * 60 * 60 * 1000);
      const deEsaSemana = (prestamos ?? []).filter(p => {
        const f = new Date(p.fecha_inicio).getTime();
        return f >= inicio.getTime() && f < fin.getTime();
      });
      const label = inicio.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
      semanas.push({
        semana: label,
        total: deEsaSemana.length,
        monto: deEsaSemana.reduce((s, p) => s + Number(p.monto), 0),
      });
    }

    return Response.json(semanas);
  } catch (err) {
    console.error('prestamos-por-semana unexpected error:', err);
    return Response.json({ message: 'Error interno' }, { status: 500 });
  }
}
