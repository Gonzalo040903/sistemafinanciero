'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/lib/useApi';
import type { Cliente, BalanceSemanal } from '@/types';

function calcularAlerta(c: Cliente): { urgencia: 'vencida' | 'hoy' | 'semana' } | null {
  const p = c.prestamoActual;
  if (!p || p.cuotas_pagadas >= p.cuotas_totales || p.monto_adeudado <= 0) return null;
  const inicio = new Date(p.fecha_inicio).getTime();
  const proxima = inicio + (p.cuotas_pagadas + 1) * 7 * 24 * 60 * 60 * 1000;
  const hoy = Date.now();
  const diff = proxima - hoy;
  if (diff < 0) return { urgencia: 'vencida' };
  if (diff < 24 * 60 * 60 * 1000) return { urgencia: 'hoy' };
  if (diff < 7 * 24 * 60 * 60 * 1000) return { urgencia: 'semana' };
  return null;
}

export default function PanelControl() {
  const api = useApi();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [balance, setBalance] = useState<BalanceSemanal | null>(null);

  useEffect(() => {
    api.get<Cliente[]>('/api/clientes').then(r => setClientes(r.data)).catch(console.error);
    api.get<BalanceSemanal>('/api/reporte/balance-semanal').then(r => setBalance(r.data)).catch(console.error);
  }, [api]);

  const alertas = clientes
    .map(c => ({ c, alerta: calcularAlerta(c) }))
    .filter(x => x.alerta !== null)
    .sort((a, b) => {
      const orden = { vencida: 0, hoy: 1, semana: 2 };
      return orden[a.alerta!.urgencia] - orden[b.alerta!.urgencia];
    });

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-700 mb-6">Panel de Control</h3>

      {/* Balance semanal */}
      {balance && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Nuevos clientes',       value: balance.nuevosClientes },
            { label: 'Préstamos esta semana',  value: balance.totalPrestamos },
            { label: 'Total prestado',         value: `$${Number(balance.totalPrestado).toLocaleString('es-AR')}` },
            { label: 'Total cobrado',          value: `$${Number(balance.totalCobrado).toLocaleString('es-AR')}` },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl shadow-md p-4 text-center">
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Alertas de vencimiento */}
      {alertas.length > 0 && (
        <div className="mb-6">
          <h5 className="font-semibold text-gray-700 mb-3">Alertas de vencimiento</h5>
          <div className="flex flex-col gap-2">
            {alertas.map(({ c, alerta }) => {
              const p = c.prestamoActual!;
              const colores = {
                vencida: 'bg-red-50 border-red-300 text-red-800',
                hoy:     'bg-orange-50 border-orange-300 text-orange-800',
                semana:  'bg-yellow-50 border-yellow-200 text-yellow-800',
              };
              const etiquetas = {
                vencida: 'Vencida',
                hoy:     'Vence hoy',
                semana:  'Vence esta semana',
              };
              return (
                <div key={c.dni} className={`border rounded-lg px-4 py-3 flex items-center justify-between text-sm ${colores[alerta!.urgencia]}`}>
                  <span className="font-medium">{c.nombre} {c.apellido} — DNI {c.dni}</span>
                  <span className="flex items-center gap-4">
                    <span>Adeuda: ${Number(p.monto_adeudado).toLocaleString('es-AR')}</span>
                    <span>Cuotas: {p.cuotas_pagadas}/{p.cuotas_totales}</span>
                    <span className="font-semibold">{etiquetas[alerta!.urgencia]}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabla de clientes */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-4 border-b border-gray-100">
          <h5 className="font-semibold text-gray-700">Tabla de Clientes</h5>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Vendedor</th>
                <th className="px-4 py-3">Monto adeudado</th>
                <th className="px-4 py-3">Cuotas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.map(c => {
                const p = c.prestamoActual;
                return (
                  <tr key={c.dni} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{c.nombre} {c.apellido}</td>
                    <td className="px-4 py-3">{c.dni}</td>
                    <td className="px-4 py-3">{c.telefono_personal}</td>
                    <td className="px-4 py-3">{p?.vendedor ?? '—'}</td>
                    <td className="px-4 py-3">{p ? `$${Number(p.monto_adeudado).toLocaleString('es-AR')}` : '—'}</td>
                    <td className="px-4 py-3">{p ? `${p.cuotas_pagadas}/${p.cuotas_totales}` : '—'}</td>
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
