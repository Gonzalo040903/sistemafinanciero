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
  formFecha:     Yup.date().required('Obligatorio'),
  soloInteres:   Yup.boolean(),
  formSemanas:   Yup.number().min(1).max(12).required('Obligatorio'),
});

type Values = Yup.InferType<typeof schema>;

const initialValues: Values = {
  formNombre: '', formApellido: '', formDni: '',
  formTel: '', formTel2: '', formTel3: '',
  formDirec: '', formMaps: '', formVendedor: '',
  formMonto: 0, formIntereses: 0, formFecha: '',
  soloInteres: false, formSemanas: 1,
};

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500';

function Field({ label, id, type = 'text', formik }: { label: string; id: keyof Values; type?: string; formik: any }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input className={inputCls} id={String(id)} type={type} {...formik.getFieldProps(id)} />
      <ErrorMessage name={String(id)} component="div" className="text-red-500 text-xs mt-1" />
    </div>
  );
}

export default function AgregarCliente() {
  const api = useApi();

  const calcular = (values: Values, setFieldValue: (f: string, v: unknown) => void) => {
    const monto = Number(values.formMonto);
    const intereses = Number(values.formIntereses);
    const semanas = Number(values.formSemanas);
    const soloInteres = values.soloInteres;
    if (!monto || !intereses) return;
    const montoFinal = soloInteres ? monto * intereses / 100 : monto + monto * intereses / 100;
    setFieldValue('_devuelve', montoFinal.toFixed(2));
    setFieldValue('_semanaPaga', (montoFinal / semanas).toFixed(2));
  };

  const submit = async (values: Values, { resetForm }: FormikHelpers<Values>) => {
    try {
      await api.post('/api/clientes', {
        nombre: values.formNombre, apellido: values.formApellido,
        dni: values.formDni, direccion: values.formDirec,
        googleMaps: values.formMaps, telefonoPersonal: values.formTel,
        telefonoReferencia: values.formTel2, telefonoTres: values.formTel3,
        prestamoActual: {
          monto: values.formMonto, semanas: values.formSemanas,
          intereses: values.formIntereses, soloInteres: values.soloInteres,
          fechaInicio: new Date(values.formFecha as string).toISOString(),
          vendedor: values.formVendedor,
        },
      });
      toast.success('Nuevo cliente creado');
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al crear el cliente');
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-700 mb-6">Agregar Cliente</h3>
      <Formik
        initialValues={{ ...initialValues, _devuelve: '', _semanaPaga: '' } as any}
        validationSchema={schema}
        onSubmit={submit}
      >
        {formik => (
          <Form className="bg-white rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h5 className="text-center text-gray-500 font-medium mb-4">Cliente</h5>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="Nombres" id="formNombre" formik={formik} />
                  <Field label="Apellidos" id="formApellido" formik={formik} />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="DNI" id="formDni" formik={formik} />
                  <Field label="Teléfono" id="formTel" formik={formik} />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="Teléfono 2" id="formTel2" formik={formik} />
                  <Field label="Teléfono 3" id="formTel3" formik={formik} />
                </div>
                <div className="mb-3"><Field label="Dirección" id="formDirec" formik={formik} /></div>
                <Field label="Google Maps" id="formMaps" formik={formik} type="url" />
              </div>

              <div>
                <h5 className="text-center text-gray-500 font-medium mb-4">Préstamo</h5>
                <div className="mb-3"><Field label="Vendedor" id="formVendedor" formik={formik} /></div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="Monto" id="formMonto" formik={formik} />
                  <Field label="% Intereses" id="formIntereses" formik={formik} />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="Fecha Inicio" id="formFecha" formik={formik} type="date" />
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        name="soloInteres"
                        checked={formik.values.soloInteres}
                        onChange={formik.handleChange}
                        className="w-4 h-4"
                      />
                      Solo interés
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">Semanas</label>
                  <select id="formSemanas" {...formik.getFieldProps('formSemanas')} className={inputCls}>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} Semana{i > 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Monto Final</label>
                    <input className={inputCls + ' bg-gray-50'} value={formik.values._devuelve ?? ''} type="text" readOnly />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Por semana</label>
                    <input className={inputCls + ' bg-gray-50'} value={formik.values._semanaPaga ?? ''} type="text" readOnly />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => calcular(formik.values, formik.setFieldValue)}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Calcular intereses
                </button>
              </div>
            </div>

            <div className="mt-6 w-full md:w-1/2">
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Registrar Nuevo Cliente
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
