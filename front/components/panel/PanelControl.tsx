'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/lib/useApi';
import type { Cliente, BalanceSemanal } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { FaUsers, FaHandHoldingUsd, FaMoneyBillWave, FaCoins } from 'react-icons/fa';

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

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        fontSize: '0.7rem', fontWeight: 700, color: 'var(--purple-400)',
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15rem',
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</div>
      )}
    </div>
  );
}

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
    {
      label: 'Nuevos clientes',       value: balance.nuevosClientes,
      color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', icon: <FaUsers />,
    },
    {
      label: 'Préstamos esta semana', value: balance.totalPrestamos,
      color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',  icon: <FaHandHoldingUsd />,
    },
    {
      label: 'Total prestado',        value: `$${Number(balance.totalPrestado).toLocaleString('es-AR')}`,
      color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  icon: <FaMoneyBillWave />,
    },
    {
      label: 'Total cobrado',         value: `$${Number(balance.totalCobrado).toLocaleString('es-AR')}`,
      color: '#facc15', bg: 'rgba(250,204,21,0.1)',  icon: <FaCoins />,
    },
  ] : [];

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)', maxWidth: '1400px' }}>

      {/* Balance semanal */}
      <section style={{ marginBottom: '2rem' }}>
        <SectionHeader
          title="Balance Semanal"
          subtitle={balance ? `Semana del ${balance.fechaHoy}` : undefined}
        />

        {balanceError && (
          <div style={{
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
            color: '#fca5a5', borderRadius: '0.75rem', padding: '0.75rem 1rem',
            marginBottom: '1rem', fontSize: '0.82rem',
          }}>
            ⚠ {balanceError}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {statsCards.map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-card)',
              border: `1px solid ${s.color}22`,
              borderRadius: '1rem',
              padding: '1.4rem 1.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
              boxShadow: `0 0 24px ${s.color}18`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Icono de fondo */}
              <div style={{
                position: 'absolute', top: '1rem', right: '1.1rem',
                fontSize: '1.4rem', color: s.color, opacity: 0.18,
              }}>
                {s.icon}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '2rem', height: '2rem', borderRadius: '0.5rem',
                background: s.bg, color: s.color, fontSize: '0.9rem',
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{
                  fontSize: '1.6rem', fontWeight: 800, color: s.color,
                  lineHeight: 1.1, letterSpacing: '-0.02em',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}

          {/* Skeleton mientras carga */}
          {!balance && !balanceError && [0, 1, 2, 3].map(i => (
            <div key={i} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '1rem', padding: '1.4rem 1.5rem', height: '110px',
              opacity: 0.5,
            }} />
          ))}
        </div>
      </section>

      {/* Gráfico */}
      {grafico.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <SectionHeader title="Actividad crediticia" subtitle="Préstamos otorgados por semana" />
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '1rem', padding: '1.5rem 1.5rem 1rem',
            boxShadow: 'var(--glow-purple)',
          }}>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={grafico} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#5b21b6" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.08)" />
                <XAxis
                  dataKey="semana"
                  tick={{ fill: '#475569', fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 11 }}
                  axisLine={false} tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a40', border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: '0.6rem', color: '#f1f5f9', fontSize: '0.8rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  }}
                  cursor={{ fill: 'rgba(139,92,246,0.07)' }}
                  formatter={(val, name) =>
                    name === 'monto'
                      ? [`$${Number(val).toLocaleString('es-AR')}`, 'Monto prestado']
                      : [val, 'Préstamos']
                  }
                />
                <Bar dataKey="total" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Alertas */}
      {alertas.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <SectionHeader title="Alertas de vencimiento" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {alertas.map(({ c, alerta }) => {
              const p = c.prestamoActual!;
              const colores = {
                vencida: { bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.25)', text: '#fca5a5', badge: '#dc2626' },
                hoy:     { bg: 'rgba(251,191,36,0.07)',  border: 'rgba(251,191,36,0.25)',  text: '#fde68a', badge: '#d97706' },
                semana:  { bg: 'rgba(250,204,21,0.05)',  border: 'rgba(250,204,21,0.18)',  text: '#fef08a', badge: '#ca8a04' },
              };
              const etiquetas = { vencida: 'Vencida', hoy: 'Vence hoy', semana: 'Esta semana' };
              const col = colores[alerta!.urgencia];
              return (
                <div key={c.dni} style={{
                  background: col.bg, border: `1px solid ${col.border}`,
                  borderRadius: '0.75rem', padding: '0.75rem 1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontSize: '0.82rem', gap: '1rem', flexWrap: 'wrap',
                }}>
                  <span style={{ fontWeight: 600, color: col.text }}>
                    {c.nombre} {c.apellido} <span style={{ opacity: 0.6 }}>— DNI {c.dni}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <span>Adeuda: <strong style={{ color: col.text }}>${Number(p.monto_adeudado).toLocaleString('es-AR')}</strong></span>
                    <span>Cuotas: {p.cuotas_pagadas}/{p.cuotas_totales}</span>
                    <span style={{
                      background: col.badge, color: '#fff', fontWeight: 700,
                      fontSize: '0.68rem', padding: '2px 10px', borderRadius: '999px',
                    }}>
                      {etiquetas[alerta!.urgencia]}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Tabla */}
      <section>
        <SectionHeader title="Clientes activos" subtitle={`${clientes.length} registrados`} />
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '1rem', overflow: 'hidden',
          boxShadow: 'var(--glow-purple)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.83rem', textAlign: 'center', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Nombre', 'DNI', 'Teléfono', 'Vendedor', 'Monto adeudado', 'Cuotas'].map(h => (
                    <th key={h} style={{
                      padding: '0.85rem 1.25rem',
                      color: 'var(--text-muted)', fontWeight: 600,
                      fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em',
                      background: 'rgba(139,92,246,0.04)',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientes.map((c, i) => {
                  const p = c.prestamoActual;
                  return (
                    <tr key={c.dni} style={{
                      borderBottom: i < clientes.length - 1 ? '1px solid rgba(139,92,246,0.06)' : 'none',
                      transition: 'background 0.12s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {c.nombre} {c.apellido}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)' }}>{c.dni}</td>
                      <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)' }}>{c.telefono_personal}</td>
                      <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)' }}>{p?.vendedor ?? '—'}</td>
                      <td style={{ padding: '0.85rem 1.25rem', color: p ? '#4ade80' : 'var(--text-muted)', fontWeight: p ? 600 : 400 }}>
                        {p ? `$${Number(p.monto_adeudado).toLocaleString('es-AR')}` : '—'}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        {p ? (
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
                            background: p.cuotas_pagadas >= p.cuotas_totales ? 'rgba(74,222,128,0.12)' : 'rgba(250,204,21,0.12)',
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
                {clientes.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No hay clientes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
