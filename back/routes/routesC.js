import {Router} from 'express';
import {getClientes, createCliente, updateCliente, deleteCliente, getClienteByApellido} from '../controllers/clienteController.js';
import authenticate from '../middlewares/autenticar.js';
import authorize from '../middlewares/autorizar.js';
const router = Router();

router.post('/', authenticate, authorize(['admin', 'vendedor']), createCliente);

router.get('/',authenticate, authorize(['admin', 'vendedor']),getClientes);

router.get('/:apellido', authenticate, authorize(['admin', 'vendedor']),getClienteByApellido);

router.patch('/:apellido',authenticate, authorize(['admin', 'vendedor']),updateCliente);

router.delete('/:apellido',authenticate,authorize(['admin', 'vendedor']),deleteCliente);
export default router;
