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

function getRangoSemana() {
    const hoy = moment().tz('America/Argentina/Buenos_Aires');

    // Domingo anterior a las 23:00 hs
    const inicio = hoy.clone().startOf('week').subtract(1, 'day').hour(23).minute(0).second(0).millisecond(0);
    // Domingo actual a las 22:59:59 hs
    const fin = hoy.clone().endOf('week').hour(22).minute(59).second(59).millisecond(999);

    return { inicio, fin };
}

router.get('/balance-semanal', async (req, res) => {
    const { inicio, fin } = getRangoSemana();
    const inicioUTC = inicio.clone().utc();
    const finUTC = fin.clone().utc();

    try {
        const nuevosClientes = await Cliente.countDocuments({
            createdAt: { $gte: inicioUTC.toDate(), $lte: finUTC.toDate() }
        });

        const clientes = await Cliente.find({});
        let totalPrestamos = 0;
        let totalPrestado = 0;
        let prestamosDeLaSemana = [];
        let totalCobrado = 0;
        const yaAgregados = new Set();

        clientes.forEach(cliente => {
            // Prestamo actual
            if (cliente.prestamoActual && cliente.prestamoActual.fechaInicio && cliente.prestamoActual.monto) {
                const fechaInicio = moment(cliente.prestamoActual.fechaInicio).tz('America/Argentina/Buenos_Aires');
                if (fechaInicio.isBetween(inicio, fin, undefined, '[]')) {
                    if (!yaAgregados.has(cliente.prestamoActual._id?.toString())) {
                        prestamosDeLaSemana.push({
                            cliente: `${cliente.nombre} ${cliente.apellido}`,
                            monto: cliente.prestamoActual.monto,
                            fechaFormateada: formatearFecha(fechaInicio)
                        });
                        totalPrestamos++;
                        totalPrestado += cliente.prestamoActual.monto;
                        yaAgregados.add(cliente.prestamoActual._id?.toString());
                    }
                }
            }

            // Pagos del prestamo actual
            if (Array.isArray(cliente.prestamoActual.pagos)) {
                cliente.prestamoActual.pagos.forEach(pago => {
                    const fechaPago = moment(pago.fecha).tz('America/Argentina/Buenos_Aires');
                    if (fechaPago.isBetween(inicio, fin, undefined, '[]')) {
                        totalCobrado += pago.monto;
                    }
                });
            }

            // Historial de préstamos
            cliente.historialPrestamos.forEach(prestamo => {
                const fecha = moment(prestamo.fechaInicio).tz('America/Argentina/Buenos_Aires');
                const idPrestamo = prestamo._id.toString();

                if (fecha.isBetween(inicio, fin, undefined, '[]')) {
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
                        if (fechaPago.isBetween(inicio, fin, undefined, '[]')) {
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
