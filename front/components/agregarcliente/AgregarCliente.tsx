'use client';

import { Formik, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useApi } from '@/lib/useApi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CuotasPreview } from '@/components/prestamo/CuotasPreview';

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

function FormField({ label, id, type = 'text', formik }: { label: string; id: keyof FormValues; type?: string; formik: any }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={String(id)} className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input id={String(id)} type={type} className="bg-secondary/50" {...formik.getFieldProps(id)} />
      <ErrorMessage name={String(id)} render={msg => <p className="text-xs text-destructive">{msg}</p>} />
    </div>
  );
}

export default function AgregarCliente() {
  const api = useApi();

  const calcular = (values: FormValues, setFieldValue: (f: string, v: unknown) => void) => {
    const monto = Number(values.formMonto);
    const intereses = Number(values.formIntereses);
    const semanas = Number(values.formSemanas);
    if (!monto || !intereses) return;
    const montoFinal = values.soloInteres ? monto * intereses / 100 : monto + monto * intereses / 100;
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

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1100px] space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">Agregar Cliente</h1>
      <p className="text-sm text-muted-foreground mb-6">Registrá un nuevo cliente con su préstamo inicial</p>

      <Formik initialValues={initialValues} validationSchema={schema} onSubmit={submit}>
        {formik => (
          <Form>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* Datos del cliente */}
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest pb-2 border-b border-border">
                      Datos del Cliente
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Nombre" id="formNombre" formik={formik} />
                      <FormField label="Apellido" id="formApellido" formik={formik} />
                      <FormField label="DNI" id="formDni" formik={formik} />
                      <FormField label="Teléfono" id="formTel" formik={formik} />
                      <FormField label="Teléfono 2" id="formTel2" formik={formik} />
                      <FormField label="Teléfono 3" id="formTel3" formik={formik} />
                      <div className="col-span-2">
                        <FormField label="Dirección" id="formDirec" formik={formik} />
                      </div>
                      <div className="col-span-2">
                        <FormField label="Google Maps" id="formMaps" formik={formik} type="url" />
                      </div>
                    </div>
                  </div>

                  {/* Datos del préstamo */}
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest pb-2 border-b border-border">
                      Datos del Préstamo
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <FormField label="Vendedor" id="formVendedor" formik={formik} />
                      </div>
                      <FormField label="Monto" id="formMonto" formik={formik} />
                      <FormField label="% Intereses" id="formIntereses" formik={formik} />
                      <FormField label="Fecha inicio" id="formFecha" formik={formik} type="date" />
                      <div className="flex items-end pb-1">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                          <Checkbox
                            name="soloInteres"
                            checked={formik.values.soloInteres}
                            onCheckedChange={v => formik.setFieldValue('soloInteres', v)}
                          />
                          Solo interés
                        </label>
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Semanas</Label>
                        <select
                          id="formSemanas"
                          className="flex h-9 w-full rounded-md border border-input bg-secondary/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          {...formik.getFieldProps('formSemanas')}
                        >
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1} Semana{i > 0 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>

                      {/* Calculadora */}
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Monto final</Label>
                        <Input value={formik.values._devuelve ?? ''} readOnly className="bg-primary/5 text-primary border-primary/20" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Por semana</Label>
                        <Input value={formik.values._semanaPaga ?? ''} readOnly className="bg-primary/5 text-primary border-primary/20" />
                      </div>
                      <div className="col-span-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => calcular(formik.values, formik.setFieldValue)}
                        >
                          Calcular intereses
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview de cuotas */}
                {formik.values.formFecha && Number(formik.values.formSemanas) >= 1 && (
                  <div className="mt-6">
                    <CuotasPreview
                      fechaInicio={formik.values.formFecha}
                      semanas={Number(formik.values.formSemanas)}
                      montoCuota={formik.values._semanaPaga ? Number(formik.values._semanaPaga) : undefined}
                    />
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-border">
                  <Button type="submit" className="w-full sm:w-auto min-w-[200px]">
                    Registrar Nuevo Cliente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
}
