import { Router } from 'express';
import Cliente from '../model/modelCliente.js';
import moment from 'moment-timezone';

const router = Router();

function formatearFecha(fecha) {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const año = d.getFullYear();
    return `${dia}-${mes}-${año}`;
}

function getSemanaActual() {
    const hoy = moment().tz('America/Argentina/Buenos_Aires');

    // Si hoy es lunes y todavía es muy temprano (por ejemplo, entre 00:00 y 06:00),
    // asumimos que estamos cerrando la semana anterior
    if (hoy.isoWeekday() === 1 && hoy.hour() < 6) {
        hoy.subtract(1, 'day'); // Retrocede al domingo
    }

    const lunes = hoy.clone().startOf('isoWeek').startOf('day');
    const domingo = hoy.clone().endOf('isoWeek').endOf('day');

    return { lunes, domingo };
}
router.get('/balance-semanal', async (req, res) => {
    const { lunes, domingo } = getSemanaActual();

    try {
        const nuevosClientes = await Cliente.countDocuments({
            createdAt: { $gte: lunes.toDate(), $lte: domingo.toDate() }
        });

        const clientes = await Cliente.find({});
        let totalPrestamos = 0;
        let totalPrestado = 0;
        let prestamosDeLaSemana = [];
        let totalCobrado = 0;
        const yaAgregados = new Set();
        
        clientes.forEach(cliente => {
        
            // Verificar prestamoActual
            if (cliente.prestamoActual && cliente.prestamoActual.fechaInicio && cliente.prestamoActual.monto) {
                const fechaInicio = moment(cliente.prestamoActual.fechaInicio).tz('America/Argentina/Buenos_Aires');
        
                // Verificar si está dentro del rango
                if (fechaInicio.isSameOrAfter(lunes) && fechaInicio.isSameOrBefore(domingo)) {
            
                    // Si aún no fue agregado
                    if (!yaAgregados.has(cliente.prestamoActual._id?.toString())) {
                        prestamosDeLaSemana.push({
                            cliente: `${cliente.nombre} ${cliente.apellido}`,
                            monto: cliente.prestamoActual.monto,
                            fechaFormateada: formatearFecha(fechaInicio)
                        });
                        totalPrestamos++;
                        totalPrestado += cliente.prestamoActual.monto;
                        console.log(`💰 Sumando préstamo: ${cliente.prestamoActual.monto}`);
                        yaAgregados.add(cliente.prestamoActual._id?.toString());
                    }
                }
            }
            
                // Pagos realizados
                if (Array.isArray(cliente.prestamoActual.pagos)) {
                    cliente.prestamoActual.pagos.forEach(pago => {
                        const fechaPago = moment(pago.fecha).tz('America/Argentina/Buenos_Aires');
                        if (fechaPago.isBetween(lunes, domingo, undefined, '[]')) {
                            totalCobrado += pago.monto;
                        }
                    });
                }
            

            // Verificar historialPrestamos
            cliente.historialPrestamos.forEach(prestamo => {
                const fecha = moment(prestamo.fechaInicio).tz('America/Argentina/Buenos_Aires');
                const idPrestamo = prestamo._id.toString();

                if (fecha.isSameOrAfter(lunes) && fecha.isSameOrBefore(domingo)) {
                    if (!yaAgregados.has(idPrestamo)) {
                        prestamosDeLaSemana.push({
                            cliente: `${cliente.nombre} ${cliente.apellido}`,
                            monto: prestamo.monto,
                            fechaFormateada: formatearFecha(fecha)
                        });
                        totalPrestamos++;
                        totalPrestado += prestamo.monto;
                        yaAgregados.add(idPrestamo);
                    }
                }

                if (Array.isArray(prestamo.pagos)) {
                    prestamo.pagos.forEach(pago => {
                        const fechaPago = moment(pago.fecha).tz('America/Argentina/Buenos_Aires');
                        if (fechaPago.isSameOrAfter(lunes) && fechaPago.isSameOrBefore(domingo)) {
                            totalCobrado += pago.monto;
                        }
                    });
                }
            });
        });

        res.json({
            nuevosClientes,
            totalPrestamos,
            totalPrestado,
            totalCobrado,
            prestamosDeLaSemana,
            fechaHoy: formatearFecha(new Date())
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al calcular balance semanal' });
    }
});

export default router;
