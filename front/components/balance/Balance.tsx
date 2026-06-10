'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/lib/useApi';
import type { BalanceSemanal } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Area, AreaChart,
} from 'recharts';
import { Users, HandCoins, Banknote, Coins, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type SemanaData = { semana: string; total: number; monto: number };

const statConfig = [
  { key: 'nuevosClientes',  label: 'Nuevos clientes',       icon: Users,      color: 'text-primary',    bg: 'bg-primary/10',      border: 'border-primary/20' },
  { key: 'totalPrestamos',  label: 'Préstamos esta semana', icon: HandCoins,  color: 'text-cyan-400',   bg: 'bg-cyan-400/10',     border: 'border-cyan-400/20' },
  { key: 'totalPrestado',   label: 'Total prestado',        icon: Banknote,   color: 'text-green-400',  bg: 'bg-green-400/10',    border: 'border-green-400/20' },
  { key: 'totalCobrado',    label: 'Total cobrado',         icon: Coins,      color: 'text-yellow-400', bg: 'bg-yellow-400/10',   border: 'border-yellow-400/20' },
] as const;

export default function Balance() {
  const api = useApi();
  const [balance, setBalance] = useState<BalanceSemanal | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [grafico, setGrafico] = useState<SemanaData[]>([]);

  useEffect(() => {
    api.get<BalanceSemanal>('/api/reporte/balance-semanal')
      .then(r => { setBalance(r.data); setBalanceError(null); })
      .catch(err => setBalanceError(err?.response?.data?.message ?? 'Error al cargar balance'));

    api.get<SemanaData[]>('/api/reporte/prestamos-por-semana')
      .then(r => setGrafico(r.data))
      .catch(console.error);
  }, [api]);

  const totalNeto = balance ? balance.totalCobrado - balance.totalPrestado : 0;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Balance</h1>
        {balance && (
          <p className="text-sm text-muted-foreground mt-1">Semana del {balance.fechaHoy}</p>
        )}
      </div>

      {balanceError && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          {balanceError}
        </div>
      )}

      {/* Stat cards grandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {balance
          ? statConfig.map(s => (
            <Card key={s.key} className={cn('border', s.border)}>
              <CardContent className="p-6">
                <div className={cn('inline-flex size-10 items-center justify-center rounded-xl mb-4', s.bg)}>
                  <s.icon className={cn('size-5', s.color)} />
                </div>
                <div className={cn('text-3xl font-bold tracking-tight mb-1', s.color)}>
                  {s.key === 'totalPrestado' || s.key === 'totalCobrado'
                    ? `$${Number(balance[s.key]).toLocaleString('es-AR')}`
                    : balance[s.key]
                  }
                </div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))
          : !balanceError && [0, 1, 2, 3].map(i => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-28" /></CardContent></Card>
          ))
        }
      </div>

      {/* Card de flujo neto */}
      {balance && (
        <Card className={cn('border', totalNeto >= 0 ? 'border-green-500/20' : 'border-destructive/20')}>
          <CardContent className="p-6 flex items-center gap-5">
            <div className={cn('size-12 rounded-xl flex items-center justify-center', totalNeto >= 0 ? 'bg-green-400/10' : 'bg-destructive/10')}>
              <TrendingUp className={cn('size-6', totalNeto >= 0 ? 'text-green-400' : 'text-destructive')} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Flujo neto de la semana</p>
              <p className={cn('text-4xl font-bold tracking-tight mt-0.5', totalNeto >= 0 ? 'text-green-400' : 'text-destructive')}>
                {totalNeto >= 0 ? '+' : ''}{totalNeto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">cobrado − prestado esta semana</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de barras — préstamos por semana */}
      {grafico.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Préstamos otorgados por semana
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={grafico} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#5b21b6" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="semana" tick={{ fill: '#52525b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#52525b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#111113', border: '1px solid #27272a', borderRadius: '0.5rem', color: '#fafafa', fontSize: '0.82rem' }}
                  cursor={{ fill: 'rgba(139,92,246,0.06)' }}
                  formatter={(val, name) => name === 'monto'
                    ? [`$${Number(val).toLocaleString('es-AR')}`, 'Monto prestado']
                    : [val, 'Préstamos']}
                />
                <Bar dataKey="total" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de área — monto prestado */}
      {grafico.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Monto prestado por semana
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={grafico} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="semana" tick={{ fill: '#52525b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#52525b', fontSize: 12 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#111113', border: '1px solid #27272a', borderRadius: '0.5rem', color: '#fafafa', fontSize: '0.82rem' }}
                  formatter={(val) => [`$${Number(val).toLocaleString('es-AR')}`, 'Monto']}
                />
                <Area type="monotone" dataKey="monto" stroke="#8b5cf6" strokeWidth={2} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detalle préstamos de esta semana */}
      {balance && balance.prestamosDeLaSemana.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Préstamos esta semana
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {balance.prestamosDeLaSemana.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.cliente}</p>
                  <p className="text-xs text-muted-foreground">{p.fechaFormateada}</p>
                </div>
                <p className="text-sm font-semibold text-green-400">
                  ${Number(p.monto).toLocaleString('es-AR')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
