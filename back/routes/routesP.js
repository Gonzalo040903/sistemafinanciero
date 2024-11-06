import { Router } from 'express';
import { createPrestamo, deletePrestamo, getPrestamosByCliente, updatePrestamo } from '../controllers/prestamoController';

const router = Router();

//Crear prestamo
router.post('/',createPrestamo);
router.get('/:clienteId', getPrestamosByCliente);
router.patch('/:id',updatePrestamo);
router.delete('/:id',deletePrestamo)

export default router;