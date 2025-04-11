import { Router } from 'express';
import Cliente from '../model/modelCliente.js';
import Prestamo from '../model/modelPrestamo.js';

const router = Router();

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
        // Clientes nuevos en la semana
        const clientesNuevos = await Cliente.find({
            createdAt: { $gte: lunes, $lte: domingo }
        });

        // Prestamos otorgados en la semana
        const prestamos = await Prestamo.find({
            fechaInicio: { $gte: lunes, $lte: domingo }
        });

        const totalPrestado = prestamos.reduce((suma, p) => suma + p.monto, 0);

        // Cuotas pagadas esta semana
        const cuotasPagadas = prestamos.filter(p => {
            return p.updatedAt >= lunes && p.updatedAt <= domingo && p.cuotasPagadas > 0;
        });

        const totalCobrado = cuotasPagadas.reduce((suma, p) => {
            const cuota = p.montoFinal / p.semanas;
            return suma + cuota * p.cuotasPagadas;
        }, 0);

        res.json({
            nuevosClientes: clientesNuevos.length,
            totalPrestado,
            totalCobrado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al calcular balance semanal' });
    }
});

export default router;
