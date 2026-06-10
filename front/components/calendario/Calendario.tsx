'use client';

import { useEffect, useState, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { format, isSameDay, startOfDay, parseISO } from 'date-fns';
import { CalendarDays, AlertCircle, Clock, Circle } from 'lucide-react';
import { useApi } from '@/lib/useApi';
import type { Cliente } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import 'react-day-picker/style.css';

interface Vencimiento {
  fecha: Date;
  cliente: Cliente;
  numeroCuota: number;
  totalCuotas: number;
  monto: number;
  estado: 'vencida' | 'proxima' | 'futura';
}

function calcularVencimientos(clientes: Cliente[]): Vencimiento[] {
  const hoy = startOfDay(new Date());
  const result: Vencimiento[] = [];

  for (const cliente of clientes) {
    const p = cliente.prestamoActual;
    if (!p || p.monto_adeudado <= 0) continue;

    const base = parseISO(p.fecha_inicio.slice(0, 10));
    base.setHours(12, 0, 0, 0);
    const cuotaValor = p.monto_final / p.cuotas_totales;

    for (let i = p.cuotas_pagadas; i < p.cuotas_totales; i++) {
      const fecha = new Date(base);
      fecha.setDate(fecha.getDate() + (i + 1) * 7);
      const fechaDay = startOfDay(fecha);
      const diff = fechaDay.getTime() - hoy.getTime();

      const estado: Vencimiento['estado'] =
        diff < 0 ? 'vencida' :
        diff < 7 * 24 * 60 * 60 * 1000 ? 'proxima' :
        'futura';

      result.push({
        fecha,
        cliente,
        numeroCuota: i + 1,
        totalCuotas: p.cuotas_totales,
        monto: cuotaValor,
        estado,
      });
    }
  }

  return result.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
}

const estadoConfig = {
  vencida: { color: 'bg-destructive',  label: 'Vencida',   badge: 'destructive' as const, icon: AlertCircle,  dot: 'bg-destructive' },
  proxima: { color: 'bg-yellow-400',   label: 'Próxima',   badge: 'warning' as const,     icon: Clock,        dot: 'bg-yellow-400' },
  futura:  { color: 'bg-primary/60',   label: 'Pendiente', badge: 'secondary' as const,   icon: Circle,       dot: 'bg-primary/60' },
};

export default function Calendario() {
  const api = useApi();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState<Date>(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState<Date | undefined>();

  useEffect(() => {
    api.get<Cliente[]>('/api/clientes')
      .then(r => { setClientes(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [api]);

  const vencimientos = useMemo(() => calcularVencimientos(clientes), [clientes]);

  const vencPorDia = useMemo(() => {
    const map = new Map<string, Vencimiento[]>();
    for (const v of vencimientos) {
      const key = format(v.fecha, 'yyyy-MM-dd');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(v);
    }
    return map;
  }, [vencimientos]);

  const diasVencidas  = useMemo(() => vencimientos.filter(v => v.estado === 'vencida').map(v => v.fecha), [vencimientos]);
  const diasProximas  = useMemo(() => vencimientos.filter(v => v.estado === 'proxima').map(v => v.fecha), [vencimientos]);
  const diasFuturas   = useMemo(() => vencimientos.filter(v => v.estado === 'futura').map(v => v.fecha), [vencimientos]);

  const vencimientosDelDia = diaSeleccionado
    ? (vencPorDia.get(format(diaSeleccionado, 'yyyy-MM-dd')) ?? [])
    : [];

  const resumen = {
    vencidas: vencimientos.filter(v => v.estado === 'vencida').length,
    proximas: vencimientos.filter(v => v.estado === 'proxima').length,
    futuras:  vencimientos.filter(v => v.estado === 'futura').length,
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendario de vencimientos</h1>
        <p className="text-sm text-muted-foreground mt-1">Vista mensual de todas las cuotas pendientes</p>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'vencidas', label: 'Vencidas',  color: 'text-destructive',  bg: 'bg-destructive/10',  border: 'border-destructive/20' },
          { key: 'proximas', label: 'Esta semana', color: 'text-yellow-400', bg: 'bg-yellow-400/10',   border: 'border-yellow-400/20' },
          { key: 'futuras',  label: 'Futuras',    color: 'text-primary',     bg: 'bg-primary/10',      border: 'border-primary/20' },
        ].map(s => (
          <Card key={s.key} className={cn('border', s.border)}>
            <CardContent className="p-4 text-center">
              <div className={cn('text-3xl font-bold', s.color)}>
                {resumen[s.key as keyof typeof resumen]}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
        {/* Calendario */}
        <Card className="w-fit">
          <CardContent className="p-4">
            {loading ? (
              <Skeleton className="w-72 h-72" />
            ) : (
              <DayPicker
                locale={es}
                month={mes}
                onMonthChange={setMes}
                selected={diaSeleccionado}
                onDayClick={(day) =>
                  setDiaSeleccionado(prev => prev && isSameDay(prev, day) ? undefined : day)
                }
                modifiers={{
                  vencida: diasVencidas,
                  proxima: diasProximas,
                  futura:  diasFuturas,
                }}
                modifiersClassNames={{
                  vencida: 'rdp-vencida',
                  proxima: 'rdp-proxima',
                  futura:  'rdp-futura',
                }}
                classNames={{
                  root: 'rdp-custom',
                  month_caption: 'flex justify-center py-1 relative items-center mb-2',
                  caption_label: 'text-sm font-semibold capitalize',
                  nav: 'flex items-center',
                  button_previous: 'absolute left-0 p-1 rounded-md hover:bg-accent transition-colors',
                  button_next: 'absolute right-0 p-1 rounded-md hover:bg-accent transition-colors',
                  weekdays: 'flex',
                  weekday: 'text-muted-foreground w-9 text-center text-xs font-normal pb-1',
                  week: 'flex mt-1',
                  day: 'relative w-9 h-9 text-center text-sm',
                  day_button: cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors',
                    'hover:bg-accent',
                  ),
                  selected: '!bg-primary !text-primary-foreground rounded-full',
                  today: 'font-bold text-primary',
                  outside: 'text-muted-foreground/40',
                  disabled: 'text-muted-foreground/30 cursor-not-allowed',
                }}
                components={{
                  DayButton: ({ day, modifiers, children, ...props }) => {
                    const key = format(day.date, 'yyyy-MM-dd');
                    const dayVenc = vencPorDia.get(key) ?? [];
                    const hasVencida = dayVenc.some(v => v.estado === 'vencida');
                    const hasProxima = dayVenc.some(v => v.estado === 'proxima');
                    const hasFutura  = dayVenc.some(v => v.estado === 'futura');
                    const isSelected = modifiers.selected;

                    return (
                      <button
                        {...props}
                        className={cn(
                          'w-9 h-9 rounded-full flex flex-col items-center justify-center text-sm transition-colors relative',
                          'hover:bg-accent',
                          isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                          modifiers.today && !isSelected && 'font-bold text-primary',
                          modifiers.outside && 'text-muted-foreground/40',
                        )}
                      >
                        <span className="leading-none">{children}</span>
                        {dayVenc.length > 0 && (
                          <span className="flex gap-0.5 mt-0.5">
                            {hasVencida && <span className="size-1.5 rounded-full bg-destructive" />}
                            {hasProxima && <span className="size-1.5 rounded-full bg-yellow-400" />}
                            {hasFutura && !hasVencida && !hasProxima && <span className="size-1.5 rounded-full bg-primary/60" />}
                          </span>
                        )}
                      </button>
                    );
                  },
                }}
              />
            )}

            {/* Leyenda */}
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border">
              {[
                { dot: 'bg-destructive', label: 'Vencida' },
                { dot: 'bg-yellow-400',  label: 'Esta semana' },
                { dot: 'bg-primary/60',  label: 'Futura' },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={cn('size-2 rounded-full', l.dot)} />
                  {l.label}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Panel derecho: vencimientos del día o lista próximos */}
        <div className="space-y-4">
          {diaSeleccionado ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <CalendarDays className="size-4" />
                  {format(diaSeleccionado, "EEEE d 'de' MMMM", { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {vencimientosDelDia.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay vencimientos este día.</p>
                ) : (
                  <div className="space-y-2">
                    {vencimientosDelDia.map((v, i) => {
                      const cfg = estadoConfig[v.estado];
                      return (
                        <div key={i} className={cn(
                          'flex items-center justify-between rounded-lg border px-4 py-3',
                          v.estado === 'vencida' ? 'bg-destructive/5 border-destructive/20' :
                          v.estado === 'proxima' ? 'bg-yellow-500/5 border-yellow-500/20' :
                          'bg-secondary/50 border-border',
                        )}>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {v.cliente.nombre} {v.cliente.apellido}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              DNI {v.cliente.dni} · Cuota {v.numeroCuota}/{v.totalCuotas}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-semibold text-foreground">
                              ${v.monto.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                            </p>
                            <Badge variant={cfg.badge}>{cfg.label}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Próximos vencimientos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <div className="space-y-2">
                    {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-14" />)}
                  </div>
                ) : vencimientos.filter(v => v.estado !== 'futura').length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay vencimientos pendientes.</p>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {vencimientos
                      .filter(v => v.estado === 'vencida' || v.estado === 'proxima')
                      .slice(0, 20)
                      .map((v, i) => {
                        const cfg = estadoConfig[v.estado];
                        return (
                          <div
                            key={i}
                            className={cn(
                              'flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer transition-colors',
                              v.estado === 'vencida' ? 'bg-destructive/5 border-destructive/20 hover:bg-destructive/10' :
                              'bg-yellow-500/5 border-yellow-500/20 hover:bg-yellow-500/10',
                            )}
                            onClick={() => setDiaSeleccionado(v.fecha)}
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {v.cliente.nombre} {v.cliente.apellido}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(v.fecha, "d 'de' MMM", { locale: es })} · Cuota {v.numeroCuota}/{v.totalCuotas}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <p className="text-sm font-semibold">
                                ${v.monto.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                              </p>
                              <Badge variant={cfg.badge}>{cfg.label}</Badge>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
