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

const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '0.875rem',
  boxShadow: 'var(--glow-purple)',
  overflowX: 'auto',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: '0.5rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.85rem',
  color: 'var(--text-primary)',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  marginBottom: '0.25rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

function CustomField({ label, id, type = 'text' }: { label: string; id: string; type?: string }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <Field name={id}>
        {({ field }: any) => <input style={inputStyle} id={id} type={type} {...field} />}
      </Field>
      <ErrorMessage name={id} render={msg => <div style={{ color: '#f87171', fontSize: '0.7rem', marginTop: '0.2rem' }}>{msg}</div>} />
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
    <div style={{ padding: '2rem', color: 'var(--text-primary)', maxWidth: '1300px' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Modificar Clientes</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>Editá los datos personales de un cliente</p>
      <div style={card}>
        <table style={{ width: '100%', fontSize: '0.83rem', textAlign: 'center', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Nombre', 'DNI', 'Dirección', 'Teléfono', 'Teléfono 2', 'Teléfono 3', ''].map(h => (
                <th key={h} style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.dni} style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-primary)' }}>{c.nombre} {c.apellido}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>{c.dni}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>{c.direccion}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>{c.telefono_personal}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>{c.telefono_referencia}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>{c.telefono_tres}</td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <button
                    onClick={() => { setSelected(c); setOpen(true); }}
                    style={{
                      background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.3)',
                      color: '#facc15', fontSize: '0.75rem', padding: '0.3rem 0.75rem',
                      borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(250,204,21,0.22)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(250,204,21,0.1)'; }}
                  >
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && selected && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,15,0.75)' }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'relative', zIndex: 10,
            background: 'linear-gradient(145deg, #1a1a3e, #111127)',
            border: '1px solid rgba(139,92,246,0.35)',
            boxShadow: '0 0 0 1px rgba(139,92,246,0.1), 0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(139,92,246,0.15)',
            borderRadius: '1.25rem',
            width: '100%', maxWidth: '38rem', margin: '0 1rem',
            animation: 'none',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.35rem 1.75rem',
              borderBottom: '1px solid rgba(139,92,246,0.12)',
              background: 'rgba(139,92,246,0.04)',
              borderRadius: '1.25rem 1.25rem 0 0',
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Modificar Cliente</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                  {selected.nombre} {selected.apellido} — DNI {selected.dni}
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{
                background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
                color: '#f87171', cursor: 'pointer',
                width: '2rem', height: '2rem', borderRadius: '50%',
                fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>&times;</button>
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
                <div style={{ padding: '1.5rem 1.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem 1.25rem' }}>
                  <CustomField label="Nombre" id="formNombre" />
                  <CustomField label="Apellido" id="formApellido" />
                  <CustomField label="DNI" id="formDni" />
                  <CustomField label="Teléfono" id="formTel" />
                  <CustomField label="Teléfono 2" id="formTel2" />
                  <CustomField label="Teléfono 3" id="formTel3" />
                  <div style={{ gridColumn: '1 / -1' }}><CustomField label="Dirección" id="formDirec" /></div>
                  <div style={{ gridColumn: '1 / -1' }}><CustomField label="Google Maps" id="formMaps" /></div>
                </div>
                <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid rgba(139,92,246,0.12)', display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                      boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                      color: '#fff', fontWeight: 700,
                      padding: '0.65rem', borderRadius: '0.6rem',
                      border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    style={{
                      padding: '0.65rem 1.25rem', borderRadius: '0.6rem',
                      background: 'rgba(100,116,139,0.1)', border: '1px solid rgba(100,116,139,0.2)',
                      color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem',
                    }}
                  >
                    Cancelar
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
