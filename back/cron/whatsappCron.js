import cron from 'node-cron';
import supabase from '../db/supabase.js';
import { enviarMensajeWhatsApp } from '../services/whatsappService.js';

export async function enviarResumenSemanal(grupoId = '120363399349813689@g.us') {
  console.log('Ejecutando resumen semanal...');

  const hace7Dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const { data: clientes } = await supabase
      .from('clientes')
      .select('id, nombre, apellido, prestamos(id, monto_final, cuotas_totales, cuotas_pagadas, activo, pagos(fecha, monto))');

    let cuotasPagadas = 0;
    let totalIngresado = 0;
    let totalAdeudado = 0;
    const clientesQuePagaron = new Set();
    const clientesPendientes = new Set();

    for (const cliente of clientes ?? []) {
      const nombre = `${cliente.nombre} ${cliente.apellido}`;
      const prestamo = cliente.prestamos?.find(p => p.activo);
      if (!prestamo) continue;

      for (const pago of prestamo.pagos ?? []) {
        if (pago.fecha >= hace7Dias) {
          cuotasPagadas++;
          totalIngresado += Number(pago.monto);
          clientesQuePagaron.add(`${nombre}: $${Number(pago.monto).toLocaleString('es-AR')}`);
        }
      }

      const cuotaValor = Number(prestamo.monto_final) / prestamo.cuotas_totales;
      const deuda = Number(prestamo.monto_final) - cuotaValor * prestamo.cuotas_pagadas;
      if (deuda > 0) {
        totalAdeudado += deuda;
        clientesPendientes.add(`${nombre}: $${deuda.toLocaleString('es-AR')}`);
      }
    }

    const mensaje = `
📋 *Resumen Semanal* 📋

✅ *Cuotas pagadas:* ${cuotasPagadas}
💵 *Total ingresado:* $${totalIngresado.toLocaleString('es-AR')}
💸 *Total deudor:* $${totalAdeudado.toLocaleString('es-AR')}

👥 *Clientes que pagaron:*
${clientesQuePagaron.size > 0 ? Array.from(clientesQuePagaron).join('\n') : 'Ninguno'}

🚨 *Clientes pendientes:*
${clientesPendientes.size > 0 ? Array.from(clientesPendientes).join('\n') : 'Todos al día 👏'}
    `.trim();

    await enviarMensajeWhatsApp(grupoId, mensaje);
    console.log('Resumen semanal enviado.');
  } catch (error) {
    console.error('Error enviando resumen semanal:', error.message);
  }
}

export function iniciarCron() {
  cron.schedule('0 21 * * 0', () => {
    console.log('📋 Enviando resumen semanal...');
    enviarResumenSemanal();
  }, { timezone: 'America/Argentina/Buenos_Aires' });
}
