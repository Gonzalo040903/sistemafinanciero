import { Router } from 'express';
import moment from 'moment-timezone';
import supabase from '../db/supabase.js';

const router = Router();
const TZ = 'America/Argentina/Buenos_Aires';

function formatearFecha(fecha) {
  const d = new Date(fecha);
  return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
}

function getRangoSemana() {
  const hoy = moment().tz(TZ);
  const inicio = hoy.clone().startOf('week').subtract(1, 'day').hour(23).minute(0).second(0).millisecond(0);
  const fin    = hoy.clone().endOf('week').hour(22).minute(59).second(59).millisecond(999);
  return { inicio: inicio.utc().toISOString(), fin: fin.utc().toISOString() };
}

router.get('/balance-semanal', async (_req, res) => {
  const { inicio, fin } = getRangoSemana();

  try {
    // Nuevos clientes esta semana
    const { count: nuevosClientes } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', inicio)
      .lte('created_at', fin);

    // Préstamos iniciados esta semana
    const { data: prestamosSemanales } = await supabase
      .from('prestamos')
      .select('id, monto, fecha_inicio, clientes(nombre, apellido)')
      .gte('fecha_inicio', inicio)
      .lte('fecha_inicio', fin);

    const totalPrestamos = prestamosSemanales?.length ?? 0;
    const totalPrestado  = prestamosSemanales?.reduce((s, p) => s + Number(p.monto), 0) ?? 0;

    const prestamosDeLaSemana = prestamosSemanales?.map(p => ({
      cliente: `${p.clientes.nombre} ${p.clientes.apellido}`,
      monto: p.monto,
      fechaFormateada: formatearFecha(p.fecha_inicio),
    })) ?? [];

    // Pagos de la semana
    const { data: pagosSemanales } = await supabase
      .from('pagos')
      .select('monto')
      .gte('fecha', inicio)
      .lte('fecha', fin);

    const totalCobrado = pagosSemanales?.reduce((s, p) => s + Number(p.monto), 0) ?? 0;

    res.json({
      nuevosClientes: nuevosClientes ?? 0,
      totalPrestamos,
      totalPrestado,
      totalCobrado,
      prestamosDeLaSemana,
      fechaHoy: formatearFecha(new Date()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al calcular balance semanal' });
  }
});

export default router;
