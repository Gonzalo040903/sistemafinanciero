import Prestamo from '../model/modelPrestamo.js';
import Cliente from '../model/modelCliente.js';

export const createPrestamo = async (req, res) => {
    const {clienteId, monto, interes} = req.body;
    try {
        const cliente = await Cliente.findOne(clienteId);
        if(!cliente) {
            return res.status(404).json({message:"'Cliente no encontrado"});
        }
        const nuevoPrestamo = new Prestamo({
            cliente: clienteId,
            monto,
            semanas,
            interes,
            fechaInicio: fechaInicio || Date.now(),

        });
        await nuevoPrestamo.save();
        res.status(201).json(nuevoPrestamo);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
// Obtener préstamos por cliente
export const getPrestamosByCliente = async (req, res) => {
    const { clienteId } = req.params;

    try {
        const prestamos = await Prestamo.find({ cliente: clienteId }).populate('cliente');
        if (prestamos.length === 0) {
            return res.status(404).json({ message: 'Préstamos no encontrados para este cliente' });
        }
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//actualizar prestamo(cuotas y montoadeudado)
export const updatePrestamo = async(req,res) =>{
    const {cuotasPagadas} = req.body;
    try {
        const prestamo = await Prestamo.findById(req.params.id);
        if(!prestamo){
            return res.status(404).json({message: 'Prestamo no encontrado'});
        }
        prestamo.cuotasPagadas = cuotasPagadas;
        prestamo.montoAdeudado = prestamo.montoFinal - ((prestamo.montoFinal / prestamo.semanas) * cuotasPagadas);
        const prestamoActualizado = await prestamo.save();
        res.json(prestamoActualizado);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
// Eliminar un préstamo
export const deletePrestamo = async (req, res) => {
    const { id } = req.params;

    try {
        const prestamoEliminado = await Prestamo.findByIdAndDelete(id);
        if (!prestamoEliminado) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }
        res.json({ message: 'Préstamo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
    