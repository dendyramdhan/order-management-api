import { Router } from 'express';
import { getOrdersController, getOrderDetailsController, createOrderController, editOrderController, deleteOrderController } from '../controllers/orderController';

const router = Router();

router.get('/', getOrdersController);
router.get('/:id', getOrderDetailsController);
router.post('/', createOrderController);
router.put('/:id', editOrderController);
router.delete('/:id', deleteOrderController);

export default router;
