import cron from 'node-cron';
import Cliente from '../model/modelCliente.js';
import { enviarMensajeWhatsApp } from '../services/whatsappService.js';

// 🚀 Modifico la función para que reciba el grupo como parámetro
// Contador semanal en memoria
let resumenSemanal = {
    cuotasPagadas: 0,
    totalIngresado: 0,
    totalAdeudado: 0,
    clientesQuePagaron: new Set(),
    clientesPendientes: new Set()
};

// Función para resetear el resumen semanal (se llamaría cada domingo 9PM)
export function resetearResumenSemanal() {
    resumenSemanal = {
        cuotasPagadas: 0,
        totalIngresado: 0,
        totalAdeudado: 0,
        clientesQuePagaron: new Set(),
        clientesPendientes: new Set()
    };
    console.log('🔄 Resumen semanal reseteado.');
}

// Función para actualizar los contadores
export async function enviarResumenSemanal(grupoId = '120363399349813689@g.us') {
    console.log('Ejecutando resumen semanal...');

    try {
        const clientes = await Cliente.find();

        for (const cliente of clientes) {
            const prestamo = cliente.prestamoActual;
            if (!prestamo) continue;

            const montoFinal = prestamo.montoFinal || 0;
            const cuotasPagadas = prestamo.cuotasPagadas || 0;
            const cuotasTotales = prestamo.cuotasTotales || prestamo.semanas || 1;
            const montoPorCuota = montoFinal / cuotasTotales;
            const montoPagado = cuotasPagadas * montoPorCuota;
            const montoDeuda = montoFinal - montoPagado;

            resumenSemanal.cuotasPagadas += cuotasPagadas;
            resumenSemanal.totalIngresado += montoPagado;
            resumenSemanal.totalAdeudado += montoDeuda;

            if (montoPagado > 0) {
                resumenSemanal.clientesQuePagaron.add(`${cliente.nombre} ${cliente.apellido}: $${montoPagado.toLocaleString('es-AR')}`);
            }
            if (montoDeuda > 0) {
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
    //0 21 * * 0
    cron.schedule('30 15 * * 4', async () => {
        console.log('📋 Enviando resumen semanal y reseteando contadores...');
        
        await enviarResumenSemanal(); // Primero enviar el resumen
        resetearResumenSemanal();     // Después resetear los contadores
        // await enviarResumenSemanal();
      });
}
