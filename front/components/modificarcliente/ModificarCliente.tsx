'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import { useApi } from '@/lib/useApi';
import type { Cliente } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const schema = Yup.object({
  formNombre:   Yup.string().min(2).max(20).required('Obligatorio'),
  formApellido: Yup.string().min(2).max(20).required('Obligatorio'),
  formDni:      Yup.string().matches(/^\d+$/).length(8).required('Obligatorio'),
  formTel:      Yup.string().matches(/^\d+$/).max(11).required('Obligatorio'),
  formTel2:     Yup.string().matches(/^\d+$/).max(11).required('Obligatorio'),
  formTel3:     Yup.string().matches(/^\d+$/).max(11).required('Obligatorio'),
  formDirec:    Yup.string().min(2).max(50).required('Obligatorio'),
  formMaps:     Yup.string().min(2).max(300).required('Obligatorio'),
});

type Values = Yup.InferType<typeof schema>;

function DialogField({ label, id }: { label: string; id: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Field name={id}>
        {({ field }: any) => <Input id={id} className="bg-secondary/50" {...field} />}
      </Field>
      <ErrorMessage name={id} render={msg => <p className="text-xs text-destructive">{msg}</p>} />
    </div>
  );
}

export default function ModificarCliente() {
  const api = useApi();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selected, setSelected] = useState<Cliente | null>(null);
  const [open, setOpen] = useState(false);

  const fetchClientes = () =>
    api.get<Cliente[]>('/api/clientes').then(r => setClientes(r.data)).catch(console.error);

  useEffect(() => { fetchClientes(); }, [api]);

  const submit = async (values: Values, { resetForm }: FormikHelpers<Values>) => {
    try {
      await api.patch(`/api/clientes/${selected!.dni}`, {
        nombre: values.formNombre, apellido: values.formApellido,
        dni: values.formDni, direccion: values.formDirec,
        googleMaps: values.formMaps, telefonoPersonal: values.formTel,
        telefonoReferencia: values.formTel2, telefonoTres: values.formTel3,
      });
      toast.success('Cliente modificado');
      resetForm();
      setSelected(null);
      setOpen(false);
      fetchClientes();
    } catch {
      toast.error('Error al modificar el cliente');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1300px] space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">Modificar Clientes</h1>
      <p className="text-sm text-muted-foreground mb-6">Editá los datos personales de un cliente</p>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {['Nombre', 'DNI', 'Dirección', 'Teléfono', 'Tel. 2', 'Tel. 3', ''].map(h => (
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
                <TableCell className="text-muted-foreground">{c.telefono_referencia ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">{c.telefono_tres ?? '—'}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                    onClick={() => { setSelected(c); setOpen(true); }}
                  >
                    <Pencil className="size-3.5 mr-1.5" />
                    Modificar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {clientes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modificar Cliente</DialogTitle>
            {selected && (
              <p className="text-xs text-muted-foreground">
                {selected.nombre} {selected.apellido} — DNI {selected.dni}
              </p>
            )}
          </DialogHeader>

          {selected && (
            <Formik
              enableReinitialize
              initialValues={{
                formNombre:   selected.nombre,
                formApellido: selected.apellido,
                formDni:      selected.dni,
                formTel:      selected.telefono_personal,
                formTel2:     selected.telefono_referencia ?? '',
                formTel3:     selected.telefono_tres ?? '',
                formDirec:    selected.direccion,
                formMaps:     selected.google_maps ?? '',
              }}
              validationSchema={schema}
              onSubmit={submit}
            >
              <Form>
                <div className="grid grid-cols-2 gap-3 py-2">
                  <DialogField label="Nombre" id="formNombre" />
                  <DialogField label="Apellido" id="formApellido" />
                  <DialogField label="DNI" id="formDni" />
                  <DialogField label="Teléfono" id="formTel" />
                  <DialogField label="Teléfono 2" id="formTel2" />
                  <DialogField label="Teléfono 3" id="formTel3" />
                  <div className="col-span-2"><DialogField label="Dirección" id="formDirec" /></div>
                  <div className="col-span-2"><DialogField label="Google Maps" id="formMaps" /></div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit">Guardar cambios</Button>
                </DialogFooter>
              </Form>
            </Formik>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
