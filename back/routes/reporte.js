import { Router } from 'express';
import Cliente from '../model/modelCliente.js';
import Prestamo from '../model/modelPrestamo.js';

const router = Router();
function formatearFecha(fecha) {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const año = d.getFullYear();
    return `${dia}-${mes}-${año}`;
}


function getSemanaActual() {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
    const diffLunes = hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
    const lunes = new Date(hoy.setDate(diffLunes));
    lunes.setHours(0, 0, 0, 0);

    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);

    return { lunes, domingo };
}

router.get('/balance-semanal', async (req, res) => {
    const { lunes, domingo } = getSemanaActual();

    try {
        // 🔹 Contar clientes nuevos en la semana
        const nuevosClientes = await Cliente.countDocuments({
            createdAt: { $gte: lunes, $lte: domingo }
        });

        // 🔹 Contar préstamos nuevos en la semana
        /**const clientesConPrestamos = await Cliente.find({
            "historialPrestamos.fechaInicio": { $gte: lunes, $lte: domingo }
        });**/
        

        const todosLosClientes = await Cliente.find({});
        let totalPrestamos = 0;
        let totalPrestado = 0;
        let prestamosDeLaSemana = [];

        todosLosClientes.forEach(cliente => {
            cliente.historialPrestamos.forEach(prestamo => {
                const fecha = new Date(prestamo.fechaInicio);
                if (fecha >= lunes && fecha <= domingo) {
                    prestamosDeLaSemana.push({
                        cliente: `${cliente.nombre} ${cliente.apellido}`,
                        monto: prestamo.monto,
                        fechaFormateada: formatearFecha(prestamo.fechaInicio)
                    });
                    totalPrestamos++;
                    totalPrestado += prestamo.monto;
                }
            });
        });
        
         const prestamosConPagos = await Prestamo.find({
            "pagos.fecha": { $gte: lunes, $lte: domingo }
        });
        let totalCobrado = 0;
        prestamosConPagos.forEach(prestamo => {
            prestamo.pagos.forEach(pago => {
                if (pago.fecha >= lunes && pago.fecha <= domingo) {
                    totalCobrado += pago.monto;
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
