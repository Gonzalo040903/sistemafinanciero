import {Router} from 'express';
import {getCliente, createCliente, updateCliente, deleteCliente, getClienteByApellido} from '../controllers/clienteController.js';
import autenticar from '../middlewares/autenticar.js';
import autorizar from '../middlewares/autorizar.js';
const router = Router();

router.post('/', autenticar, autorizar(['admin', 'vendedor']), createCliente);

router.get('/',autenticar, autorizar(['admin', 'vendedor']),getCliente);

router.get('/:apellido', autenticar, autorizar(['admin', 'vendedor']),getClienteByApellido);

router.patch('/:apellido',autenticar, autorizar(['admin', 'vendedor']),updateCliente);

router.delete('/:apellido',autenticar,autorizar(['admin', 'vendedor']),deleteCliente);
export default router;
