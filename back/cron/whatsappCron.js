import cron from 'node-cron';
import Cliente from '../model/modelCliente.js';
import { enviarMensajeWhatsApp } from '../services/whatsappService.js';

async function enviarRecordatorios() {
    console.log('Ejecutando cronjob de recordatorios...');

    try {
        const clientes = await Cliente.find();

        for (const cliente of clientes) {
            const prestamo = cliente.prestamoActual;
            if (!prestamo) continue;

            // Calculamos correctamente la deuda REAL
            const montoFinal = prestamo.montoFinal || 0;
            const cuotasPagadas = prestamo.cuotasPagadas || 0;
            const cuotasTotales = prestamo.cuotasTotales || prestamo.semanas || 1;
            const montoPorCuota = montoFinal / cuotasTotales;
            const montoPagado = cuotasPagadas * montoPorCuota;
            const montoAdeudado = montoFinal - montoPagado;

            // Solo enviamos mensaje si todavía debe algo
            if (montoAdeudado > 0) {
                const mensaje = `Hola ${cliente.nombre}, te recordamos que debes $${montoAdeudado.toFixed(2)}.`;
                await enviarMensajeWhatsApp(cliente.telefonoPersonal, mensaje);
                console.log(`Mensaje enviado a ${cliente.nombre}: Debe $${montoAdeudado.toFixed(2)}`);
            }
        }
    } catch (error) {
        console.error('Error enviando recordatorios:', error.message);
    }
}

export function iniciarCron() {
    // Ejecutar inmediatamente
    enviarRecordatorios();

    // Programarlo para las 9 AM
    cron.schedule('0 9 * * *', () => {
        enviarRecordatorios();
    });
}
