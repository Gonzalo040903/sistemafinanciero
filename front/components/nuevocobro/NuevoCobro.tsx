'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '@/lib/useApi';
import type { Cliente, Prestamo } from '@/types';

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500';

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR');
}

export default function NuevoCobro() {
  const api = useApi();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState<Cliente | null>(null);
  const [prestamo, setPrestamo] = useState<Prestamo | null>(null);
  const [historial, setHistorial] = useState<Prestamo[]>([]);
  const [cuotasPagadas, setCuotasPagadas] = useState(0);
  const [nuevoModo, setNuevoModo] = useState(false);
  const [nMonto, setNMonto] = useState('');
  const [nIntereses, setNIntereses] = useState('');
  const [nSemanas, setNSemanas] = useState(1);
  const [nFecha, setNFecha] = useState('');
  const [nVendedor, setNVendedor] = useState('');
  const [nSoloInteres, setNSoloInteres] = useState(false);

  useEffect(() => {
    api.get<Cliente[]>('/api/clientes').then(r => setClientes(r.data)).catch(console.error);
  }, [api]);

  const gestionar = async (c: Cliente) => {
    setSeleccionado(c);
    setNuevoModo(false);
    setHistorial([]);
    // Usar el dato ya disponible en la tabla para no mostrar "sin préstamo" mientras carga
    const prestamoRapido = c.prestamoActual ?? null;
    setPrestamo(prestamoRapido);
    if (prestamoRapido) setCuotasPagadas(prestamoRapido.cuotas_pagadas);

    try {
      const [pRes, hRes] = await Promise.allSettled([
        api.get<Prestamo>(`/api/clientes/${c.dni}/prestamo`),
        api.get<Prestamo[]>(`/api/clientes/${c.dni}/prestamos`),
      ]);
      // Actualizar con datos completos (incluye pagos[])
      const p = pRes.status === 'fulfilled' ? pRes.value.data : prestamoRapido;
      setPrestamo(p);
      if (p) setCuotasPagadas(p.cuotas_pagadas);
      const todos = hRes.status === 'fulfilled' ? hRes.value.data : [];
      setHistorial(todos.filter((h: Prestamo) => !h.activo));
    } catch {
      // prestamoRapido ya está en state, no resetear
    }
  };

  const volver = () => { setSeleccionado(null); setPrestamo(null); setHistorial([]); setNuevoModo(false); };

  const registrarPago = async () => {
    if (!seleccionado) return;
    try {
      await api.patch(`/api/clientes/${seleccionado.dni}/prestamo/cuotas`, { cuotasPagadas });
      toast.success('Pago registrado');
      gestionar(seleccionado);
    } catch {
      toast.error('Error al registrar el pago');
    }
  };

  const registrarNuevo = async () => {
    if (!seleccionado) return;
    try {
      await api.patch(`/api/clientes/${seleccionado.dni}/prestamo/nuevo`, {
        moverHistorial: true,
        prestamoActual: {
          monto: Number(nMonto), intereses: Number(nIntereses), semanas: nSemanas,
          soloInteres: nSoloInteres, fechaInicio: new Date(nFecha).toISOString(), vendedor: nVendedor,
        },
      });
      toast.success('Nuevo préstamo registrado');
      setNuevoModo(false);
      setNMonto(''); setNIntereses(''); setNFecha(''); setNVendedor('');
      gestionar(seleccionado);
    } catch {
      toast.error('Error al registrar el préstamo');
    }
  };

  const pagado = !prestamo || prestamo.monto_adeudado <= 0 || prestamo.cuotas_pagadas >= prestamo.cuotas_totales;
  const cuotaValor = prestamo ? prestamo.monto_final / prestamo.cuotas_totales : 0;
  const filtrados = clientes.filter(c =>
    !busqueda ||
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.dni.includes(busqueda)
  );

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-700 mb-6">Nuevo Cobro</h3>

      {/* ── Tabla de clientes ─────────────────────────────────── */}
      {!seleccionado && (
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-4 border-b border-gray-100">
            <input
              className={inputCls + ' max-w-xs'}
              placeholder="Buscar por nombre o DNI..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3">DNI</th>
                  <th className="px-4 py-3">Monto adeudado</th>
                  <th className="px-4 py-3">Cuotas</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrados.map(c => {
                  const p = c.prestamoActual;
                  return (
                    <tr key={c.dni} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{c.apellido}, {c.nombre}</td>
                      <td className="px-4 py-3 text-center">{c.dni}</td>
                      <td className="px-4 py-3 text-center">
                        {p ? `$${Number(p.monto_adeudado).toLocaleString('es-AR')}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p ? (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            p.cuotas_pagadas >= p.cuotas_totales
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {p.cuotas_pagadas}/{p.cuotas_totales}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => gestionar(c)}
                          className="bg-sky-500 hover:bg-sky-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Gestionar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Panel del cliente seleccionado ────────────────────── */}
      {seleccionado && (
        <>
          <div className="flex items-center gap-3 mb-5">
            <button onClick={volver} className="text-sm text-gray-500 hover:text-gray-700">← Volver</button>
            <h4 className="text-lg font-semibold text-gray-800">
              {seleccionado.nombre} {seleccionado.apellido} — DNI {seleccionado.dni}
            </h4>
          </div>

          {/* Préstamo activo */}
          {prestamo && !nuevoModo && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-semibold text-gray-800">Préstamo activo</h5>
                {pagado
                  ? <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Saldado</span>
                  : <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">En curso</span>
                }
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                {[
                  { label: 'Monto original', value: `$${Number(prestamo.monto).toLocaleString('es-AR')}` },
                  { label: 'Monto final',    value: `$${Number(prestamo.monto_final).toLocaleString('es-AR')}` },
                  { label: 'Monto adeudado', value: `$${Number(prestamo.monto_adeudado).toLocaleString('es-AR')}` },
                  { label: 'Cuota semanal',  value: `$${cuotaValor.toLocaleString('es-AR')}` },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-xs text-gray-500 mb-0.5">{s.label}</div>
                    <div className="font-semibold text-gray-800">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Cuotas pagadas</label>
                  <input
                    className={inputCls + ' w-28'}
                    type="number"
                    value={cuotasPagadas}
                    min={prestamo.cuotas_pagadas}
                    max={prestamo.cuotas_totales}
                    onChange={e => setCuotasPagadas(Number(e.target.value))}
                  />
                  <div className="text-xs text-gray-400 mt-1">{prestamo.cuotas_pagadas}/{prestamo.cuotas_totales} pagadas</div>
                </div>
                <button onClick={registrarPago}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                  Registrar pago
                </button>
                <button
                  onClick={() => setNuevoModo(true)}
                  disabled={!pagado}
                  title={!pagado ? `Saldo pendiente: $${Number(prestamo.monto_adeudado).toLocaleString('es-AR')}` : ''}
                  className={`font-medium px-4 py-2 rounded-lg transition-colors text-white ${
                    pagado ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-300 cursor-not-allowed opacity-60'
                  }`}
                >
                  Nuevo préstamo
                </button>
              </div>
            </div>
          )}

          {/* Sin préstamo activo */}
          {!prestamo && !nuevoModo && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-4">
              <p className="text-gray-500 mb-4">Este cliente no tiene préstamo activo.</p>
              <button onClick={() => setNuevoModo(true)}
                className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                Crear préstamo
              </button>
            </div>
          )}

          {/* Formulario nuevo préstamo */}
          {nuevoModo && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-4">
              <h5 className="font-semibold text-gray-800 mb-4">Nuevo préstamo</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Monto</label>
                  <input className={inputCls} type="number" value={nMonto} onChange={e => setNMonto(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">% Intereses</label>
                  <input className={inputCls} type="number" value={nIntereses} onChange={e => setNIntereses(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Semanas</label>
                  <select className={inputCls} value={nSemanas} onChange={e => setNSemanas(Number(e.target.value))}>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} semana{i > 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Fecha inicio</label>
                  <input className={inputCls} type="date" value={nFecha} onChange={e => setNFecha(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Vendedor</label>
                  <input className={inputCls} value={nVendedor} onChange={e => setNVendedor(e.target.value)} />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={nSoloInteres} onChange={e => setNSoloInteres(e.target.checked)} className="w-4 h-4" />
                    Solo interés
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={registrarNuevo}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                  Confirmar
                </button>
                <button onClick={() => setNuevoModo(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Historial */}
          {historial.length > 0 && (
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-4 border-b border-gray-100">
                <h5 className="font-semibold text-gray-700">Historial de préstamos</h5>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Monto</th>
                      <th className="px-4 py-3">Monto final</th>
                      <th className="px-4 py-3">Intereses</th>
                      <th className="px-4 py-3">Cuotas</th>
                      <th className="px-4 py-3">Vendedor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historial.map(h => (
                      <tr key={h.id} className="hover:bg-gray-50 text-gray-500">
                        <td className="px-4 py-3">{fmt(h.fecha_inicio)}</td>
                        <td className="px-4 py-3">${Number(h.monto).toLocaleString('es-AR')}</td>
                        <td className="px-4 py-3">${Number(h.monto_final).toLocaleString('es-AR')}</td>
                        <td className="px-4 py-3">{h.intereses}%{h.solo_interes ? ' (solo int.)' : ''}</td>
                        <td className="px-4 py-3">{h.cuotas_pagadas}/{h.cuotas_totales}</td>
                        <td className="px-4 py-3">{h.vendedor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
