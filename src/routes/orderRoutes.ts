import { Router } from 'express';
import { getOrders, getOrderDetails, createOrder, editOrder, deleteOrder } from '../controllers/orderController';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrderDetails);
router.post('/', createOrder);
router.put('/:id', editOrder);
router.delete('/:id', deleteOrder);

export default router;
