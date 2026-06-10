'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useApi } from '@/lib/useApi';
import type { Cliente } from '@/types';

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

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500';

function CustomField({ label, id, type = 'text' }: { label: string; id: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <Field name={id}>
        {({ field }: any) => <input className={inputCls} id={id} type={type} {...field} />}
      </Field>
      <ErrorMessage name={id} component="div" className="text-red-500 text-xs mt-1" />
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
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-700 mb-6">Modificar Clientes</h3>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">DNI</th>
              <th className="px-4 py-3">Dirección</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Teléfono 2</th>
              <th className="px-4 py-3">Teléfono 3</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clientes.map(c => (
              <tr key={c.dni} className="hover:bg-gray-50">
                <td className="px-4 py-3">{c.nombre} {c.apellido}</td>
                <td className="px-4 py-3">{c.dni}</td>
                <td className="px-4 py-3">{c.direccion}</td>
                <td className="px-4 py-3">{c.telefono_personal}</td>
                <td className="px-4 py-3">{c.telefono_referencia}</td>
                <td className="px-4 py-3">{c.telefono_tres}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { setSelected(c); setOpen(true); }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-10">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h5 className="font-semibold text-gray-800">Modificar Cliente</h5>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
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
                <div className="p-5 grid grid-cols-2 gap-4">
                  <CustomField label="Nombre" id="formNombre" />
                  <CustomField label="Apellido" id="formApellido" />
                  <CustomField label="DNI" id="formDni" />
                  <CustomField label="Teléfono" id="formTel" />
                  <CustomField label="Teléfono 2" id="formTel2" />
                  <CustomField label="Teléfono 3" id="formTel3" />
                  <div className="col-span-2"><CustomField label="Dirección" id="formDirec" /></div>
                  <div className="col-span-2"><CustomField label="Google Maps" id="formMaps" /></div>
                </div>
                <div className="p-5 border-t border-gray-100">
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
