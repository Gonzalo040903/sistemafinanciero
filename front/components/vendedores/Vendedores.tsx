'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, UserPlus } from 'lucide-react';
import { useApi } from '@/lib/useApi';
import type { Vendedor } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Vendedores() {
  const api = useApi();
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState<'vendedor' | 'admin'>('vendedor');

  const fetchVendedores = () =>
    api.get<Vendedor[]>('/api/vendedores').then(r => setVendedores(r.data)).catch(() => {
      toast.error('Acceso denegado');
    });

  useEffect(() => { fetchVendedores(); }, [api]);

  const crear = async () => {
    if (!nombre || !contraseña) return toast.error('Completá nombre y contraseña');
    try {
      await api.post('/api/vendedores', { nombre, contraseña, rol });
      toast.success('Vendedor creado');
      setNombre('');
      setContraseña('');
      fetchVendedores();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al crear vendedor');
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este vendedor?')) return;
    try {
      await api.delete(`/api/vendedores/${id}`);
      toast.success('Vendedor eliminado');
      fetchVendedores();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[900px] space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">Gestión de Vendedores</h1>
      <p className="text-sm text-muted-foreground mb-6">Administrá usuarios del sistema</p>

      {/* Formulario nuevo */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-semibold text-primary uppercase tracking-widest">Nuevo Vendedor</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1.5 w-44">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Usuario</Label>
              <Input className="bg-secondary/50" value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>
            <div className="space-y-1.5 w-44">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Contraseña</Label>
              <Input className="bg-secondary/50" type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} />
            </div>
            <div className="space-y-1.5 w-36">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Rol</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-secondary/50 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={rol}
                onChange={e => setRol(e.target.value as 'vendedor' | 'admin')}
              >
                <option value="vendedor">Vendedor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button onClick={crear}>
              <UserPlus className="size-4" />
              Crear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {['Usuario', 'Rol', 'Creado', ''].map(h => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendedores.map(v => (
              <TableRow key={v.id}>
                <TableCell className="font-medium text-foreground">{v.nombre}</TableCell>
                <TableCell>
                  <Badge variant={v.rol === 'admin' ? 'destructive' : 'default'}>
                    {v.rol}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(v.creadoEn).toLocaleDateString('es-AR')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => eliminar(v.id)}
                  >
                    <Trash2 className="size-3.5 mr-1.5" />
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {vendedores.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                  No hay vendedores registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
