'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApi } from '@/lib/useApi';
import type { Cliente } from '@/types';
import { AlertTriangle, Clock, AlertCircle, ArrowRight, BarChart2, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

function calcularAlerta(c: Cliente): { urgencia: 'vencida' | 'hoy' | 'semana' } | null {
  const p = c.prestamoActual;
  if (!p || p.cuotas_pagadas >= p.cuotas_totales || p.monto_adeudado <= 0) return null;
  const diasAlerta = p.dias_alerta ?? 7;
  const proxima = new Date(p.fecha_inicio).getTime() + (p.cuotas_pagadas + 1) * 7 * 24 * 60 * 60 * 1000;
  const diff = proxima - Date.now();
  if (diff < 0) return { urgencia: 'vencida' };
  if (diff < 24 * 60 * 60 * 1000) return { urgencia: 'hoy' };
  if (diff < diasAlerta * 24 * 60 * 60 * 1000) return { urgencia: 'semana' };
  return null;
}

const alertaConfig = {
  vencida: { icon: AlertCircle,   badgeVariant: 'destructive' as const, label: 'Vencida',      rowClass: 'bg-destructive/5 border-l-2 border-l-destructive' },
  hoy:     { icon: AlertTriangle, badgeVariant: 'warning' as const,     label: 'Vence hoy',   rowClass: 'bg-yellow-500/5 border-l-2 border-l-yellow-500' },
  semana:  { icon: Clock,         badgeVariant: 'warning' as const,     label: 'Esta semana', rowClass: 'bg-yellow-500/3 border-l-2 border-l-yellow-500/50' },
};

export default function PanelControl() {
  const api = useApi();
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    api.get<Cliente[]>('/api/clientes').then(r => setClientes(r.data)).catch(console.error);
  }, [api]);

  const alertas = clientes
    .map(c => ({ c, alerta: calcularAlerta(c) }))
    .filter(x => x.alerta !== null)
    .sort((a, b) => ({ vencida: 0, hoy: 1, semana: 2 }[a.alerta!.urgencia] - { vencida: 0, hoy: 1, semana: 2 }[b.alerta!.urgencia]));

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] space-y-8">

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/balance">
          <Card className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Balance semanal</p>
                  <p className="text-xs text-muted-foreground">Ingresos, egresos y tendencias</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/calendario">
          <Card className="border-yellow-500/20 hover:border-yellow-500/40 hover:bg-yellow-500/5 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <CalendarDays className="size-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Calendario</p>
                  <p className="text-xs text-muted-foreground">Vencimientos de cuotas</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Alertas de vencimiento */}
      {alertas.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">
              Alertas de vencimiento
            </p>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/calendario" className="text-xs text-muted-foreground gap-1">
                Ver calendario <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            {alertas.map(({ c, alerta }) => {
              const p = c.prestamoActual!;
              const cfg = alertaConfig[alerta!.urgencia];
              return (
                <div key={c.dni} className={cn('flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm', cfg.rowClass)}>
                  <div className="flex items-center gap-2">
                    <cfg.icon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium text-foreground">{c.nombre} {c.apellido}</span>
                    <span className="text-muted-foreground text-xs">DNI {c.dni}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Adeuda: <strong className="text-foreground">${Number(p.monto_adeudado).toLocaleString('es-AR')}</strong></span>
                    <span>{p.cuotas_pagadas}/{p.cuotas_totales} cuotas</span>
                    <Badge variant={cfg.badgeVariant}>{cfg.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Tabla de clientes */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Clientes activos</p>
          <p className="text-xs text-muted-foreground mt-0.5">{clientes.length} registrados</p>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                {['Nombre', 'DNI', 'Teléfono', 'Vendedor', 'Monto adeudado', 'Cuotas'].map(h => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map(c => {
                const p = c.prestamoActual;
                return (
                  <TableRow key={c.dni}>
                    <TableCell className="font-medium text-foreground">{c.nombre} {c.apellido}</TableCell>
                    <TableCell className="text-muted-foreground">{c.dni}</TableCell>
                    <TableCell className="text-muted-foreground">{c.telefono_personal}</TableCell>
                    <TableCell className="text-muted-foreground">{p?.vendedor ?? '—'}</TableCell>
                    <TableCell className={cn('font-semibold', p ? 'text-green-400' : 'text-muted-foreground')}>
                      {p ? `$${Number(p.monto_adeudado).toLocaleString('es-AR')}` : '—'}
                    </TableCell>
                    <TableCell>
                      {p ? (
                        <Badge variant={p.cuotas_pagadas >= p.cuotas_totales ? 'success' : 'warning'}>
                          {p.cuotas_pagadas}/{p.cuotas_totales}
                        </Badge>
                      ) : '—'}
                    </TableCell>
                  </TableRow>
                );
              })}
              {clientes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No hay clientes registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}
