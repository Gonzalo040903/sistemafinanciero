'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/lib/useApi';
import type { Cliente, BalanceSemanal } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

type SemanaData = { semana: string; total: number; monto: number };

function calcularAlerta(c: Cliente): { urgencia: 'vencida' | 'hoy' | 'semana' } | null {
  const p = c.prestamoActual;
  if (!p || p.cuotas_pagadas >= p.cuotas_totales || p.monto_adeudado <= 0) return null;
  const proxima = new Date(p.fecha_inicio).getTime() + (p.cuotas_pagadas + 1) * 7 * 24 * 60 * 60 * 1000;
  const diff = proxima - Date.now();
  if (diff < 0) return { urgencia: 'vencida' };
  if (diff < 24 * 60 * 60 * 1000) return { urgencia: 'hoy' };
  if (diff < 7 * 24 * 60 * 60 * 1000) return { urgencia: 'semana' };
  return null;
}

const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '0.875rem',
  boxShadow: 'var(--glow-purple)',
};

const muted = { color: 'var(--text-muted)', fontSize: '0.75rem' };

export default function PanelControl() {
  const api = useApi();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [balance, setBalance] = useState<BalanceSemanal | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [grafico, setGrafico] = useState<SemanaData[]>([]);

  useEffect(() => {
    api.get<Cliente[]>('/api/clientes')
      .then(r => setClientes(r.data))
      .catch(console.error);

    api.get<BalanceSemanal>('/api/reporte/balance-semanal')
      .then(r => { setBalance(r.data); setBalanceError(null); })
      .catch(err => {
        const msg = err?.response?.data?.message ?? `Error ${err?.response?.status ?? ''} al cargar balance`;
        setBalanceError(msg);
        console.error('balance-semanal:', err);
      });

    api.get<SemanaData[]>('/api/reporte/prestamos-por-semana')
      .then(r => setGrafico(r.data))
      .catch(console.error);
  }, [api]);

  const alertas = clientes
    .map(c => ({ c, alerta: calcularAlerta(c) }))
    .filter(x => x.alerta !== null)
    .sort((a, b) => {
      const orden = { vencida: 0, hoy: 1, semana: 2 };
      return orden[a.alerta!.urgencia] - orden[b.alerta!.urgencia];
    });

  const statsCards = balance ? [
    { label: 'Nuevos clientes',      value: balance.nuevosClientes,       color: '#a78bfa' },
    { label: 'Préstamos esta semana', value: balance.totalPrestamos,        color: '#22d3ee' },
    { label: 'Total prestado',        value: `$${Number(balance.totalPrestado).toLocaleString('es-AR')}`, color: '#4ade80' },
    { label: 'Total cobrado',         value: `$${Number(balance.totalCobrado).toLocaleString('es-AR')}`,  color: '#facc15' },
  ] : [];

  return (
    <div className="p-6" style={{ color: 'var(--text-primary)' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Panel de Control
      </h3>

      {/* Error de balance */}
      {balanceError && (
        <div style={{
          background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
          color: '#fca5a5', borderRadius: '0.75rem', padding: '0.75rem 1rem',
          marginBottom: '1rem', fontSize: '0.85rem',
        }}>
          ⚠ Balance semanal: {balanceError}
        </div>
      )}

      {/* Stats cards */}
      {balance && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statsCards.map(s => (
            <div key={s.label} style={{ ...card, padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>
                {s.value}
              </div>
              <div style={muted}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Gráfico de barras */}
      {grafico.length > 0 && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Préstamos por semana (últimas 8 semanas)
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={grafico} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" />
              <XAxis dataKey="semana" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card-alt)', border: '1px solid var(--border)',
                  borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8rem',
                }}
                cursor={{ fill: 'rgba(139,92,246,0.08)' }}
                formatter={(val, name) =>
                  name === 'monto'
                    ? [`$${Number(val).toLocaleString('es-AR')}`, 'Monto prestado']
                    : [val, 'Préstamos']
                }
              />
              <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Alertas */}
      {alertas.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Alertas de vencimiento
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {alertas.map(({ c, alerta }) => {
              const p = c.prestamoActual!;
              const colores = {
                vencida: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)', text: '#fca5a5', badge: '#ef4444' },
                hoy:     { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.3)',  text: '#fde68a', badge: '#f59e0b' },
                semana:  { bg: 'rgba(250,204,21,0.06)',  border: 'rgba(250,204,21,0.2)',  text: '#fef08a', badge: '#ca8a04' },
              };
              const etiquetas = { vencida: 'Vencida', hoy: 'Vence hoy', semana: 'Esta semana' };
              const col = colores[alerta!.urgencia];
              return (
                <div key={c.dni} style={{
                  background: col.bg, border: `1px solid ${col.border}`,
                  borderRadius: '0.625rem', padding: '0.6rem 1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontSize: '0.82rem', gap: '1rem', flexWrap: 'wrap',
                }}>
                  <span style={{ fontWeight: 600, color: col.text }}>
                    {c.nombre} {c.apellido} — DNI {c.dni}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                    <span>Adeuda: ${Number(p.monto_adeudado).toLocaleString('es-AR')}</span>
                    <span>Cuotas: {p.cuotas_pagadas}/{p.cuotas_totales}</span>
                    <span style={{
                      background: col.badge, color: '#fff',
                      fontWeight: 700, fontSize: '0.7rem',
                      padding: '2px 8px', borderRadius: '999px',
                    }}>
                      {etiquetas[alerta!.urgencia]}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabla de clientes */}
      <div style={card}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Tabla de Clientes
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.83rem', textAlign: 'center', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Nombre', 'DNI', 'Teléfono', 'Vendedor', 'Monto adeudado', 'Cuotas'].map(h => (
                  <th key={h} style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => {
                const p = c.prestamoActual;
                return (
                  <tr key={c.dni} style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.7rem 1rem', color: 'var(--text-primary)' }}>{c.nombre} {c.apellido}</td>
                    <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>{c.dni}</td>
                    <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>{c.telefono_personal}</td>
                    <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>{p?.vendedor ?? '—'}</td>
                    <td style={{ padding: '0.7rem 1rem', color: p ? '#4ade80' : 'var(--text-muted)' }}>
                      {p ? `$${Number(p.monto_adeudado).toLocaleString('es-AR')}` : '—'}
                    </td>
                    <td style={{ padding: '0.7rem 1rem' }}>
                      {p ? (
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '999px',
                          background: p.cuotas_pagadas >= p.cuotas_totales ? 'rgba(74,222,128,0.15)' : 'rgba(250,204,21,0.15)',
                          color: p.cuotas_pagadas >= p.cuotas_totales ? '#4ade80' : '#facc15',
                          border: `1px solid ${p.cuotas_pagadas >= p.cuotas_totales ? 'rgba(74,222,128,0.3)' : 'rgba(250,204,21,0.3)'}`,
                        }}>
                          {p.cuotas_pagadas}/{p.cuotas_totales}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
