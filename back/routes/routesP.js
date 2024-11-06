import { Router } from 'express';
import { createPrestamo, deletePrestamo, getPrestamosByCliente, updatePrestamo } from '../controllers/prestamoController.js';
import autorizar from '../middlewares/autorizar.js';
import autenticar from '../middlewares/autenticar.js';
const router = Router();

//Crear prestamo
router.post('/',autenticar, autorizar(['admin', 'vendedor']),createPrestamo);
router.get('/:clienteId',autenticar, autorizar(['admin', 'vendedor']), getPrestamosByCliente);
router.patch('/:id',autenticar, autorizar(['admin']),updatePrestamo);
router.delete('/:id',autenticar, autorizar(['admin']),deletePrestamo)

export default router;