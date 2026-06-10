'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { useApi } from '@/lib/useApi';
import type { Cliente } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function EliminarCliente() {
  const api = useApi();
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const fetchClientes = () =>
    api.get<Cliente[]>('/api/clientes').then(r => setClientes(r.data)).catch(console.error);

  useEffect(() => { fetchClientes(); }, [api]);

  const eliminar = async (dni: string) => {
    if (!confirm('¿Eliminar este cliente y todos sus préstamos?')) return;
    try {
      await api.delete(`/api/clientes/${dni}`);
      toast.success('Cliente eliminado');
      fetchClientes();
    } catch {
      toast.error('Error al eliminar el cliente');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">Eliminar Cliente</h1>
      <p className="text-sm text-muted-foreground mb-6">Eliminá un cliente y todo su historial de préstamos</p>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {['Nombre', 'DNI', 'Dirección', 'Teléfono', ''].map(h => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map(c => (
              <TableRow key={c.dni}>
                <TableCell className="font-medium text-foreground">{c.nombre} {c.apellido}</TableCell>
                <TableCell className="text-muted-foreground">{c.dni}</TableCell>
                <TableCell className="text-muted-foreground">{c.direccion}</TableCell>
                <TableCell className="text-muted-foreground">{c.telefono_personal}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => eliminar(c.dni)}
                  >
                    <Trash2 className="size-3.5 mr-1.5" />
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {clientes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
