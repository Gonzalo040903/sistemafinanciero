'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { useApi } from '@/lib/useApi';
import type { Cliente, Prestamo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CuotasPreview } from '@/components/prestamo/CuotasPreview';
import { cn } from '@/lib/utils';

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR');
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-secondary/50 border border-border p-3 space-y-1">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('text-lg font-bold', highlight ? 'text-green-400' : 'text-foreground')}>{value}</p>
    </div>
  );
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
    <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">Cobros</h1>
      <p className="text-sm text-muted-foreground mb-6">Gestioná préstamos y pagos de tus clientes</p>

      {/* Tabla de clientes */}
      {!seleccionado && (
        <Card>
          <div className="p-4 border-b border-border">
            <Input
              className="max-w-xs bg-secondary/50"
              placeholder="Buscar por nombre o DNI..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                {['Nombre', 'DNI', 'Monto adeudado', 'Cuotas', ''].map(h => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map(c => {
                const p = c.prestamoActual;
                return (
                  <TableRow key={c.dni}>
                    <TableCell className="font-medium text-foreground">{c.apellido}, {c.nombre}</TableCell>
                    <TableCell className="text-muted-foreground">{c.dni}</TableCell>
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
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => gestionar(c)}>
                        Gestionar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    No hay clientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Panel del cliente seleccionado */}
      {seleccionado && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={volver}>
              <ArrowLeft className="size-4" />
              Volver
            </Button>
            <h2 className="text-base font-semibold text-foreground">
              {seleccionado.nombre} {seleccionado.apellido}
              <span className="text-muted-foreground text-sm font-normal ml-2">DNI {seleccionado.dni}</span>
            </h2>
          </div>

          {/* Préstamo activo */}
          {prestamo && !nuevoModo && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Préstamo activo</CardTitle>
                  <Badge variant={pagado ? 'success' : 'warning'}>
                    {pagado ? <><CheckCircle className="size-3 mr-1" />Saldado</> : <><Clock className="size-3 mr-1" />En curso</>}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Monto original" value={`$${Number(prestamo.monto).toLocaleString('es-AR')}`} />
                  <StatCard label="Monto final" value={`$${Number(prestamo.monto_final).toLocaleString('es-AR')}`} />
                  <StatCard label="Monto adeudado" value={`$${Number(prestamo.monto_adeudado).toLocaleString('es-AR')}`} highlight />
                  <StatCard label="Cuota semanal" value={`$${cuotaValor.toLocaleString('es-AR')}`} />
                </div>
                <div className="flex flex-wrap items-end gap-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Cuotas pagadas</Label>
                    <Input
                      type="number"
                      className="w-28 bg-secondary/50"
                      value={cuotasPagadas}
                      min={prestamo.cuotas_pagadas}
                      max={prestamo.cuotas_totales}
                      onChange={e => setCuotasPagadas(Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">{prestamo.cuotas_pagadas}/{prestamo.cuotas_totales} pagadas</p>
                  </div>
                  <Button variant="outline" className="text-green-400 border-green-500/30 hover:bg-green-500/10 hover:text-green-300" onClick={registrarPago}>
                    Registrar pago
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!pagado}
                    title={!pagado ? `Saldo pendiente: $${Number(prestamo.monto_adeudado).toLocaleString('es-AR')}` : ''}
                    onClick={() => setNuevoModo(true)}
                  >
                    Nuevo préstamo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline de cuotas del préstamo activo */}
          {prestamo && !nuevoModo && (
            <CuotasPreview
              fechaInicio={prestamo.fecha_inicio}
              semanas={prestamo.cuotas_totales}
              cuotasPagadas={prestamo.cuotas_pagadas}
              montoCuota={prestamo.monto_final / prestamo.cuotas_totales}
            />
          )}

          {/* Sin préstamo activo */}
          {!prestamo && !nuevoModo && (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-sm mb-4">Este cliente no tiene préstamo activo.</p>
                <Button onClick={() => setNuevoModo(true)}>Crear préstamo</Button>
              </CardContent>
            </Card>
          )}

          {/* Formulario nuevo préstamo */}
          {nuevoModo && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Nuevo préstamo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Monto</Label>
                    <Input className="bg-secondary/50" type="number" value={nMonto} onChange={e => setNMonto(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">% Intereses</Label>
                    <Input className="bg-secondary/50" type="number" value={nIntereses} onChange={e => setNIntereses(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Semanas</Label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-secondary/50 px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={nSemanas}
                      onChange={e => setNSemanas(Number(e.target.value))}
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} semana{i > 0 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Fecha inicio</Label>
                    <Input className="bg-secondary/50" type="date" value={nFecha} onChange={e => setNFecha(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Vendedor</Label>
                    <Input className="bg-secondary/50" value={nVendedor} onChange={e => setNVendedor(e.target.value)} />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <Checkbox checked={nSoloInteres} onCheckedChange={v => setNSoloInteres(!!v)} />
                      Solo interés
                    </label>
                  </div>
                </div>
                {/* Preview de cuotas */}
                {nFecha && nSemanas >= 1 && (
                  <CuotasPreview
                    fechaInicio={nFecha}
                    semanas={nSemanas}
                    montoCuota={nMonto && nIntereses
                      ? (() => {
                          const monto = Number(nMonto);
                          const intereses = Number(nIntereses);
                          const mf = nSoloInteres ? monto * intereses / 100 : monto + monto * intereses / 100;
                          return mf / nSemanas;
                        })()
                      : undefined
                    }
                  />
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="text-green-400 border-green-500/30 hover:bg-green-500/10" onClick={registrarNuevo}>
                    Confirmar
                  </Button>
                  <Button variant="ghost" onClick={() => setNuevoModo(false)}>Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historial */}
          {historial.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Historial de préstamos</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    {['Fecha', 'Monto', 'Monto final', 'Intereses', 'Cuotas', 'Vendedor'].map(h => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historial.map(h => (
                    <TableRow key={h.id}>
                      <TableCell className="text-muted-foreground">{fmt(h.fecha_inicio)}</TableCell>
                      <TableCell className="text-muted-foreground">${Number(h.monto).toLocaleString('es-AR')}</TableCell>
                      <TableCell className="text-muted-foreground">${Number(h.monto_final).toLocaleString('es-AR')}</TableCell>
                      <TableCell className="text-muted-foreground">{h.intereses}%{h.solo_interes ? ' (solo int.)' : ''}</TableCell>
                      <TableCell className="text-muted-foreground">{h.cuotas_pagadas}/{h.cuotas_totales}</TableCell>
                      <TableCell className="text-muted-foreground">{h.vendedor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
