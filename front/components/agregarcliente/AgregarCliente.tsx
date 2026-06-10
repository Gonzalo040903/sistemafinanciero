'use client';

import { Formik, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useApi } from '@/lib/useApi';

const schema = Yup.object({
  formNombre:    Yup.string().min(2).max(20).required('Obligatorio'),
  formApellido:  Yup.string().min(2).max(20).required('Obligatorio'),
  formDni:       Yup.string().matches(/^\d+$/, 'Solo números').length(8, '8 dígitos').required('Obligatorio'),
  formTel:       Yup.string().matches(/^\d+$/).max(11).required('Obligatorio'),
  formTel2:      Yup.string().matches(/^\d+$/).max(11).required('Obligatorio'),
  formTel3:      Yup.string().matches(/^\d+$/).max(11).required('Obligatorio'),
  formDirec:     Yup.string().min(2).max(50).required('Obligatorio'),
  formMaps:      Yup.string().min(2).max(300).required('Obligatorio'),
  formVendedor:  Yup.string().min(2).required('Obligatorio'),
  formMonto:     Yup.number().required('Obligatorio'),
  formIntereses: Yup.number().max(99).required('Obligatorio'),
  formFecha:     Yup.string().required('Obligatorio'),
  soloInteres:   Yup.boolean(),
  formSemanas:   Yup.number().min(1).max(12).required('Obligatorio'),
});

type Values = Yup.InferType<typeof schema>;
type FormValues = Values & { _devuelve: string; _semanaPaga: string };

const initialValues: FormValues = {
  formNombre: '', formApellido: '', formDni: '',
  formTel: '', formTel2: '', formTel3: '',
  formDirec: '', formMaps: '', formVendedor: '',
  formMonto: 0, formIntereses: 0, formFecha: '',
  soloInteres: false, formSemanas: 1,
  _devuelve: '', _semanaPaga: '',
};

const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '0.875rem',
  boxShadow: 'var(--glow-purple)',
  padding: '1.75rem',
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

function Field({ label, id, type = 'text', formik }: { label: string; id: keyof FormValues; type?: string; formik: any }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} id={String(id)} type={type} {...formik.getFieldProps(id)} />
      <ErrorMessage name={String(id)} render={msg => <div style={{ color: '#f87171', fontSize: '0.7rem', marginTop: '0.2rem' }}>{msg}</div>} />
    </div>
  );
}

export default function AgregarCliente() {
  const api = useApi();

  const calcular = (values: FormValues, setFieldValue: (f: string, v: unknown) => void) => {
    const monto = Number(values.formMonto);
    const intereses = Number(values.formIntereses);
    const semanas = Number(values.formSemanas);
    const soloInteres = values.soloInteres;
    if (!monto || !intereses) return;
    const montoFinal = soloInteres ? monto * intereses / 100 : monto + monto * intereses / 100;
    setFieldValue('_devuelve', montoFinal.toFixed(2));
    setFieldValue('_semanaPaga', (montoFinal / semanas).toFixed(2));
  };

  const submit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      await api.post('/api/clientes', {
        nombre: values.formNombre, apellido: values.formApellido,
        dni: values.formDni, direccion: values.formDirec,
        googleMaps: values.formMaps, telefonoPersonal: values.formTel,
        telefonoReferencia: values.formTel2, telefonoTres: values.formTel3,
        prestamoActual: {
          monto: values.formMonto, semanas: values.formSemanas,
          intereses: values.formIntereses, soloInteres: values.soloInteres,
          fechaInicio: new Date(values.formFecha).toISOString(),
          vendedor: values.formVendedor,
        },
      });
      toast.success('Nuevo cliente creado');
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al crear el cliente');
    }
  };

  const sectionTitle: React.CSSProperties = {
    textAlign: 'center',
    color: 'var(--purple-400)',
    fontWeight: 600,
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid var(--border)',
  };

  return (
    <div className="p-6" style={{ color: 'var(--text-primary)' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Agregar Cliente</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={submit}
      >
        {formik => (
          <Form>
            <div style={card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                {/* Datos del cliente */}
                <div>
                  <div style={sectionTitle}>Datos del Cliente</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1rem' }}>
                    <Field label="Nombres" id="formNombre" formik={formik} />
                    <Field label="Apellidos" id="formApellido" formik={formik} />
                    <Field label="DNI" id="formDni" formik={formik} />
                    <Field label="Teléfono" id="formTel" formik={formik} />
                    <Field label="Teléfono 2" id="formTel2" formik={formik} />
                    <Field label="Teléfono 3" id="formTel3" formik={formik} />
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Field label="Dirección" id="formDirec" formik={formik} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Field label="Google Maps" id="formMaps" formik={formik} type="url" />
                    </div>
                  </div>
                </div>

                {/* Datos del préstamo */}
                <div>
                  <div style={sectionTitle}>Datos del Préstamo</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Field label="Vendedor" id="formVendedor" formik={formik} />
                    </div>
                    <Field label="Monto" id="formMonto" formik={formik} />
                    <Field label="% Intereses" id="formIntereses" formik={formik} />
                    <Field label="Fecha Inicio" id="formFecha" formik={formik} type="date" />
                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.25rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          name="soloInteres"
                          checked={formik.values.soloInteres}
                          onChange={formik.handleChange}
                          style={{ width: '1rem', height: '1rem', accentColor: '#8b5cf6' }}
                        />
                        Solo interés
                      </label>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Semanas</label>
                      <select id="formSemanas" {...formik.getFieldProps('formSemanas')} style={inputStyle}>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} Semana{i > 0 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    {/* Calculadora */}
                    <div>
                      <label style={labelStyle}>Monto Final</label>
                      <input style={{ ...inputStyle, background: 'rgba(139,92,246,0.05)', color: '#a78bfa' }} value={formik.values._devuelve ?? ''} type="text" readOnly />
                    </div>
                    <div>
                      <label style={labelStyle}>Por semana</label>
                      <input style={{ ...inputStyle, background: 'rgba(139,92,246,0.05)', color: '#a78bfa' }} value={formik.values._semanaPaga ?? ''} type="text" readOnly />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <button
                        type="button"
                        onClick={() => calcular(formik.values, formik.setFieldValue)}
                        style={{
                          width: '100%',
                          background: 'rgba(139,92,246,0.1)',
                          border: '1px solid var(--border)',
                          color: '#a78bfa', fontWeight: 600,
                          padding: '0.5rem', borderRadius: '0.5rem',
                          cursor: 'pointer', fontSize: '0.85rem',
                        }}
                      >
                        Calcular intereses
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.75rem' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%', maxWidth: '320px',
                    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                    boxShadow: '0 0 20px rgba(124,58,237,0.35)',
                    color: '#fff', fontWeight: 700,
                    padding: '0.65rem', borderRadius: '0.6rem',
                    border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  Registrar Nuevo Cliente
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
