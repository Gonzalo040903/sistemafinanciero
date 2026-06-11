import { Router } from 'express';
import supabase from '../db/supabase.js';

const router = Router();

function calcularPrestamo(monto, intereses, semanas, soloInteres) {
  const montoFinal = soloInteres
    ? monto * (intereses / 100)
    : monto + monto * (intereses / 100);
  return {
    monto_final: montoFinal,
    monto_adeudado: montoFinal,
    cuotas_totales: semanas,
  };
}

// POST /api/clientes — crear cliente con préstamo inicial
router.post('/', async (req, res) => {
  const {
    nombre, apellido, dni, direccion, googleMaps,
    telefonoPersonal, telefonoReferencia, telefonoTres,
    prestamoActual,
  } = req.body;

  if (!nombre || !apellido || !dni || !direccion || !telefonoPersonal || !prestamoActual) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const { monto, semanas, intereses, soloInteres, fechaInicio, vendedor } = prestamoActual;
  if (!monto || !semanas || !intereses || !fechaInicio || !vendedor) {
    return res.status(400).json({ message: 'El préstamo inicial es obligatorio' });
  }

  const { data: cliente, error: clienteError } = await supabase
    .from('clientes')
    .insert({
      nombre, apellido, dni, direccion,
      google_maps: googleMaps,
      telefono_personal: telefonoPersonal,
      telefono_referencia: telefonoReferencia,
      telefono_tres: telefonoTres,
    })
    .select()
    .single();

  if (clienteError) {
    if (clienteError.code === '23505') return res.status(409).json({ message: 'Ya existe un cliente con ese DNI' });
    return res.status(500).json({ message: clienteError.message });
  }

  const calc = calcularPrestamo(Number(monto), Number(intereses), Number(semanas), Boolean(soloInteres));

  const { error: prestamoError } = await supabase.from('prestamos').insert({
    cliente_id: cliente.id,
    monto: Number(monto),
    ...calc,
    semanas: Number(semanas),
    intereses: Number(intereses),
    solo_interes: Boolean(soloInteres),
    fecha_inicio: fechaInicio,
    vendedor,
    activo: true,
  });

  if (prestamoError) return res.status(500).json({ message: prestamoError.message });

  res.status(201).json(cliente);
});

// GET /api/clientes — listar todos con su préstamo activo
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*, prestamoActual:prestamos!inner(*)')
    .eq('prestamos.activo', true)
    .order('apellido');

  if (error) {
    // Fallback: traer clientes sin join si no hay préstamos activos
    const { data: clientes, error: e2 } = await supabase
      .from('clientes')
      .select('*')
      .order('apellido');
    if (e2) return res.status(500).json({ message: e2.message });
    return res.json(clientes);
  }
  res.json(data);
});

// GET /api/clientes/:dni
router.get('/:dni', async (req, res) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('dni', req.params.dni)
    .single();

  if (error || !data) return res.status(404).json({ message: 'Cliente no encontrado' });
  res.json(data);
});

// GET /api/clientes/:dni/prestamo — préstamo activo
router.get('/:dni/prestamo', async (req, res) => {
  const { data: cliente } = await supabase
    .from('clientes')
    .select('id')
    .eq('dni', req.params.dni)
    .single();

  if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

  const { data, error } = await supabase
    .from('prestamos')
    .select('*, pagos(*)')
    .eq('cliente_id', cliente.id)
    .eq('activo', true)
    .single();

  if (error || !data) return res.status(404).json({ message: 'Sin préstamo activo' });
  res.json(data);
});

// GET /api/clientes/:dni/prestamos — historial completo
router.get('/:dni/prestamos', async (req, res) => {
  const { data: cliente } = await supabase
    .from('clientes')
    .select('id')
    .eq('dni', req.params.dni)
    .single();

  if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

  const { data, error } = await supabase
    .from('prestamos')
    .select('*, pagos(*)')
    .eq('cliente_id', cliente.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

// PATCH /api/clientes/:dni — actualizar datos del cliente
router.patch('/:dni', async (req, res) => {
  const { nombre, apellido, dni, direccion, googleMaps,
          telefonoPersonal, telefonoReferencia, telefonoTres } = req.body;

  const updates = {};
  if (nombre)            updates.nombre             = nombre;
  if (apellido)          updates.apellido            = apellido;
  if (dni)               updates.dni                 = dni;
  if (direccion)         updates.direccion            = direccion;
  if (googleMaps)        updates.google_maps          = googleMaps;
  if (telefonoPersonal)  updates.telefono_personal    = telefonoPersonal;
  if (telefonoReferencia) updates.telefono_referencia = telefonoReferencia;
  if (telefonoTres)      updates.telefono_tres        = telefonoTres;

  const { data, error } = await supabase
    .from('clientes')
    .update(updates)
    .eq('dni', req.params.dni)
    .select()
    .single();

  if (error || !data) return res.status(404).json({ message: 'Cliente no encontrado' });
  res.json({ message: 'Cliente actualizado', cliente: data });
});

// DELETE /api/clientes/:dni
router.delete('/:dni', async (req, res) => {
  const { error } = await supabase.from('clientes').delete().eq('dni', req.params.dni);
  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: 'Cliente eliminado' });
});

// PATCH /api/clientes/:dni/prestamo/cuotas — registrar pagos
router.patch('/:dni/prestamo/cuotas', async (req, res) => {
  const { cuotasPagadas } = req.body;

  const { data: cliente } = await supabase
    .from('clientes')
    .select('id')
    .eq('dni', req.params.dni)
    .single();

  if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

  const { data: prestamo } = await supabase
    .from('prestamos')
    .select('*')
    .eq('cliente_id', cliente.id)
    .eq('activo', true)
    .single();

  if (!prestamo) return res.status(400).json({ message: 'Sin préstamo activo' });

  const cuotaValor = prestamo.monto_final / prestamo.cuotas_totales;
  const cuotasAnteriores = prestamo.cuotas_pagadas;
  const cuotasNuevas = cuotasPagadas - cuotasAnteriores;

  if (cuotasNuevas > 0) {
    const nuevoPagos = Array.from({ length: cuotasNuevas }, () => ({
      prestamo_id: prestamo.id,
      fecha: new Date().toISOString(),
      monto: cuotaValor,
    }));
    await supabase.from('pagos').insert(nuevoPagos);
  }

  const montoAdeudado = prestamo.monto_final - cuotaValor * cuotasPagadas;

  const { data: updated, error } = await supabase
    .from('prestamos')
    .update({ cuotas_pagadas: cuotasPagadas, monto_adeudado: Math.max(0, montoAdeudado) })
    .eq('id', prestamo.id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  res.json(updated);
});

// PATCH /api/clientes/:dni/prestamo/nuevo — cerrar préstamo actual y abrir uno nuevo
router.patch('/:dni/prestamo/nuevo', async (req, res) => {
  const { prestamoActual, moverHistorial } = req.body;
  const { monto, semanas, intereses, soloInteres, fechaInicio, vendedor } = prestamoActual;

  const { data: cliente } = await supabase
    .from('clientes')
    .select('id')
    .eq('dni', req.params.dni)
    .single();

  if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

  if (moverHistorial) {
    await supabase
      .from('prestamos')
      .update({ activo: false })
      .eq('cliente_id', cliente.id)
      .eq('activo', true);
  }

  const calc = calcularPrestamo(Number(monto), Number(intereses), Number(semanas), Boolean(soloInteres));

  const { data: nuevoPrestamo, error } = await supabase
    .from('prestamos')
    .insert({
      cliente_id: cliente.id,
      monto: Number(monto),
      ...calc,
      semanas: Number(semanas),
      intereses: Number(intereses),
      solo_interes: Boolean(soloInteres),
      fecha_inicio: fechaInicio,
      vendedor,
      activo: true,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  res.json(nuevoPrestamo);
});

export default router;
