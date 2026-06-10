'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '@/lib/useApi';
import type { Cliente, Prestamo } from '@/types';

const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '0.875rem',
  boxShadow: 'var(--glow-purple)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: '0.5rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.85rem',
  color: 'var(--text-primary)',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  color: 'var(--text-muted)',
  marginBottom: '0.25rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

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
    const prestamoRapido = c.prestamoActual ?? null;
    setPrestamo(prestamoRapido);
    if (prestamoRapido) setCuotasPagadas(prestamoRapido.cuotas_pagadas);
    try {
      const [pRes, hRes] = await Promise.allSettled([
        api.get<Prestamo>(`/api/clientes/${c.dni}/prestamo`),
        api.get<Prestamo[]>(`/api/clientes/${c.dni}/prestamos`),
      ]);
      const p = pRes.status === 'fulfilled' ? pRes.value.data : prestamoRapido;
      setPrestamo(p);
      if (p) setCuotasPagadas(p.cuotas_pagadas);
      const todos = hRes.status === 'fulfilled' ? hRes.value.data : [];
      setHistorial(todos.filter((h: Prestamo) => !h.activo));
    } catch { /* prestamoRapido ya está en state */ }
  };

  const volver = () => { setSeleccionado(null); setPrestamo(null); setHistorial([]); setNuevoModo(false); };

  const registrarPago = async () => {
    if (!seleccionado) return;
    try {
      await api.patch(`/api/clientes/${seleccionado.dni}/prestamo/cuotas`, { cuotasPagadas });
      toast.success('Pago registrado');
      gestionar(seleccionado);
    } catch { toast.error('Error al registrar el pago'); }
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
    } catch { toast.error('Error al registrar el préstamo'); }
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
    <div className="p-6" style={{ color: 'var(--text-primary)' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Nuevo Cobro</h3>

      {/* Tabla de clientes */}
      {!seleccionado && (
        <div style={card}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
            <input
              style={{ ...inputStyle, maxWidth: '280px' }}
              placeholder="Buscar por nombre o DNI..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.83rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Nombre', 'DNI', 'Monto adeudado', 'Cuotas', ''].map(h => (
                    <th key={h} style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', textAlign: h === 'Nombre' ? 'left' : 'center' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(c => {
                  const p = c.prestamoActual;
                  return (
                    <tr key={c.dni} style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 500, color: 'var(--text-primary)', textAlign: 'left' }}>
                        {c.apellido}, {c.nombre}
                      </td>
                      <td style={{ padding: '0.7rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{c.dni}</td>
                      <td style={{ padding: '0.7rem 1rem', textAlign: 'center', color: p ? '#4ade80' : 'var(--text-muted)' }}>
                        {p ? `$${Number(p.monto_adeudado).toLocaleString('es-AR')}` : '—'}
                      </td>
                      <td style={{ padding: '0.7rem 1rem', textAlign: 'center' }}>
                        {p ? (
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '999px',
                            background: p.cuotas_pagadas >= p.cuotas_totales ? 'rgba(74,222,128,0.15)' : 'rgba(250,204,21,0.15)',
                            color: p.cuotas_pagadas >= p.cuotas_totales ? '#4ade80' : '#facc15',
                            border: `1px solid ${p.cuotas_pagadas >= p.cuotas_totales ? 'rgba(74,222,128,0.3)' : 'rgba(250,204,21,0.3)'}`,
                          }}>
                            {p.cuotas_pagadas}/{p.cuotas_totales}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '0.7rem 1rem', textAlign: 'center' }}>
                        <button onClick={() => gestionar(c)} style={{
                          background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)',
                          color: '#a78bfa', fontSize: '0.75rem', padding: '0.3rem 0.75rem',
                          borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600,
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.35)'; e.currentTarget.style.color = '#c4b5fd'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.color = '#a78bfa'; }}
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

      {/* Panel del cliente */}
      {seleccionado && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <button onClick={volver} style={{
              background: 'rgba(139,92,246,0.1)', border: '1px solid var(--border)',
              color: '#a78bfa', fontSize: '0.8rem', padding: '0.35rem 0.8rem',
              borderRadius: '0.4rem', cursor: 'pointer',
            }}>
              ← Volver
            </button>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {seleccionado.nombre} {seleccionado.apellido} — DNI {seleccionado.dni}
            </h4>
          </div>

          {/* Préstamo activo */}
          {prestamo && !nuevoModo && (
            <div style={{ ...card, padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Préstamo activo</span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px',
                  background: pagado ? 'rgba(74,222,128,0.15)' : 'rgba(250,204,21,0.15)',
                  color: pagado ? '#4ade80' : '#facc15',
                  border: `1px solid ${pagado ? 'rgba(74,222,128,0.3)' : 'rgba(250,204,21,0.3)'}`,
                }}>
                  {pagado ? 'Saldado' : 'En curso'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                {[
                  { label: 'Monto original', value: `$${Number(prestamo.monto).toLocaleString('es-AR')}` },
                  { label: 'Monto final',    value: `$${Number(prestamo.monto_final).toLocaleString('es-AR')}` },
                  { label: 'Monto adeudado', value: `$${Number(prestamo.monto_adeudado).toLocaleString('es-AR')}`, highlight: true },
                  { label: 'Cuota semanal',  value: `$${cuotaValor.toLocaleString('es-AR')}` },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-surface)', borderRadius: '0.5rem', padding: '0.75rem 1rem', border: '1px solid rgba(139,92,246,0.1)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: s.highlight ? '#4ade80' : 'var(--text-primary)' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Cuotas pagadas</label>
                  <input
                    style={{ ...inputStyle, width: '7rem' }}
                    type="number"
                    value={cuotasPagadas}
                    min={prestamo.cuotas_pagadas}
                    max={prestamo.cuotas_totales}
                    onChange={e => setCuotasPagadas(Number(e.target.value))}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {prestamo.cuotas_pagadas}/{prestamo.cuotas_totales} pagadas
                  </div>
                </div>
                <button onClick={registrarPago} style={{
                  background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
                  color: '#4ade80', fontWeight: 600, padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem',
                }}>
                  Registrar pago
                </button>
                <button
                  onClick={() => setNuevoModo(true)}
                  disabled={!pagado}
                  title={!pagado ? `Saldo pendiente: $${Number(prestamo.monto_adeudado).toLocaleString('es-AR')}` : ''}
                  style={{
                    background: pagado ? 'rgba(139,92,246,0.2)' : 'rgba(100,116,139,0.1)',
                    border: `1px solid ${pagado ? 'rgba(139,92,246,0.4)' : 'rgba(100,116,139,0.2)'}`,
                    color: pagado ? '#a78bfa' : 'var(--text-muted)',
                    fontWeight: 600, padding: '0.5rem 1.25rem',
                    borderRadius: '0.5rem', cursor: pagado ? 'pointer' : 'not-allowed',
                    fontSize: '0.85rem', opacity: pagado ? 1 : 0.5,
                  }}
                >
                  Nuevo préstamo
                </button>
              </div>
            </div>
          )}

          {/* Sin préstamo activo */}
          {!prestamo && !nuevoModo && (
            <div style={{ ...card, padding: '1.5rem', marginBottom: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Este cliente no tiene préstamo activo.</p>
              <button onClick={() => setNuevoModo(true)} style={{
                background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)',
                color: '#a78bfa', fontWeight: 600, padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem',
              }}>
                Crear préstamo
              </button>
            </div>
          )}

          {/* Formulario nuevo préstamo */}
          {nuevoModo && (
            <div style={{ ...card, padding: '1.5rem', marginBottom: '1rem' }}>
              <h5 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Nuevo préstamo</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                <div><label style={labelStyle}>Monto</label><input style={inputStyle} type="number" value={nMonto} onChange={e => setNMonto(e.target.value)} /></div>
                <div><label style={labelStyle}>% Intereses</label><input style={inputStyle} type="number" value={nIntereses} onChange={e => setNIntereses(e.target.value)} /></div>
                <div>
                  <label style={labelStyle}>Semanas</label>
                  <select style={{ ...inputStyle }} value={nSemanas} onChange={e => setNSemanas(Number(e.target.value))}>
                    {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1} semana{i > 0 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Fecha inicio</label><input style={inputStyle} type="date" value={nFecha} onChange={e => setNFecha(e.target.value)} /></div>
                <div><label style={labelStyle}>Vendedor</label><input style={inputStyle} value={nVendedor} onChange={e => setNVendedor(e.target.value)} /></div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={nSoloInteres} onChange={e => setNSoloInteres(e.target.checked)} style={{ width: '1rem', height: '1rem', accentColor: '#8b5cf6' }} />
                    Solo interés
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={registrarNuevo} style={{
                  background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
                  color: '#4ade80', fontWeight: 600, padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem',
                }}>Confirmar</button>
                <button onClick={() => setNuevoModo(false)} style={{
                  background: 'rgba(100,116,139,0.1)', border: '1px solid rgba(100,116,139,0.2)',
                  color: 'var(--text-muted)', fontWeight: 600, padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem',
                }}>Cancelar</button>
              </div>
            </div>
          )}

          {/* Historial */}
          {historial.length > 0 && (
            <div style={card}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Historial de préstamos
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.82rem', textAlign: 'center', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Fecha', 'Monto', 'Monto final', 'Intereses', 'Cuotas', 'Vendedor'].map(h => (
                        <th key={h} style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map(h => (
                      <tr key={h.id} style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}>
                        <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{fmt(h.fecha_inicio)}</td>
                        <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>${Number(h.monto).toLocaleString('es-AR')}</td>
                        <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>${Number(h.monto_final).toLocaleString('es-AR')}</td>
                        <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{h.intereses}%{h.solo_interes ? ' (solo int.)' : ''}</td>
                        <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{h.cuotas_pagadas}/{h.cuotas_totales}</td>
                        <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{h.vendedor}</td>
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
