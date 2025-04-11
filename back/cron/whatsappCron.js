import cron from 'node-cron';
import Cliente from '../model/modelCliente.js';
import { enviarMensajeWhatsApp } from '../services/whatsappService.js';

export async function enviarResumenSemanal(grupoId = '120363399349813689@g.us') {
    console.log('Ejecutando resumen semanal...');

    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);

    let resumenSemanal = {
        cuotasPagadas: 0,
        totalIngresado: 0,
        totalAdeudado: 0,
        clientesQuePagaron: new Set(),
        clientesPendientes: new Set()
    };

    try {
        const clientes = await Cliente.find();

        for (const cliente of clientes) {
            const prestamo = cliente.prestamoActual;
            if (!prestamo) continue;

            for (const pago of prestamo.pagos || []) {
                if (new Date(pago.fecha) >= hace7Dias) {
                    resumenSemanal.cuotasPagadas += 1;
                    resumenSemanal.totalIngresado += pago.monto;
                    resumenSemanal.clientesQuePagaron.add(`${cliente.nombre} ${cliente.apellido}: $${pago.monto.toLocaleString('es-AR')}`);
                }
            }

            const montoFinal = prestamo.montoFinal || 0;
            const cuotasTotales = prestamo.cuotasTotales || prestamo.semanas || 1;
            const cuotaValor = montoFinal / cuotasTotales;
            const montoPagadoTotal = (prestamo.cuotasPagadas || 0) * cuotaValor;
            const montoDeuda = montoFinal - montoPagadoTotal;

            if (montoDeuda > 0) {
                resumenSemanal.totalAdeudado += montoDeuda;
                resumenSemanal.clientesPendientes.add(`${cliente.nombre} ${cliente.apellido}: $${montoDeuda.toLocaleString('es-AR')}`);
            }
        }

        const mensaje = `
📋 *Resumen Semanal* 📋

✅ *Cuotas pagadas:* ${resumenSemanal.cuotasPagadas}
💵 *Total ingresado:* $${resumenSemanal.totalIngresado.toLocaleString('es-AR')}
💸 *Total debiente:* $${resumenSemanal.totalAdeudado.toLocaleString('es-AR')}

👥 *Clientes que pagaron:*
${resumenSemanal.clientesQuePagaron.size > 0 ? Array.from(resumenSemanal.clientesQuePagaron).join('\n') : 'Ninguno'}

🚨 *Clientes pendientes:*
${resumenSemanal.clientesPendientes.size > 0 ? Array.from(resumenSemanal.clientesPendientes).join('\n') : 'Todos al día 👏'}
        `;

        await enviarMensajeWhatsApp(grupoId, mensaje.trim());
        console.log('Resumen semanal enviado exitosamente.');
        
    } catch (error) {
        console.error('Error enviando resumen semanal:', error.message);
    }
}

export function iniciarCron() {
    cron.schedule('7 13 * * 5', async () => { // Cada jueves a las 15:30
        console.log('📋 Enviando resumen semanal...');
        await enviarResumenSemanal();
    });
}
