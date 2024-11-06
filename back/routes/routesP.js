import { Router } from 'express';

const router = Router();

//Crear prestamo
router.post('/',
//actualizar prestamo(cuotas y montoadeudado)
router.patch('/:id', async (req, res) => {
    const {cuotasPagadas} = req.body;
    try {
        const prestamo = await Prestamo.findById(req.params.id);
        if(!prestamo){
            return res.status(404).json({message: 'Prestamo no encontrado'});
        }
        prestamo.cuotasPagadas = cuotasPagadas;
        prestamo.montoAdeudado = prestamo.montoFinal - ((prestamo.montoFinal / prestamo.semanas) * cuotasPagadas);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
export default router;