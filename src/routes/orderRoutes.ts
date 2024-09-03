import { Router } from 'express';
import {
  getOrdersController,
  getOrderDetailsController,
  createOrderController,
  editOrderController,
  deleteOrderController
} from '../controllers/orderController';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { UpdateOrderDto } from '../dtos/UpdateOrderDto';

const router = Router();

router.get('/', getOrdersController);
router.get('/:id', getOrderDetailsController);
router.post('/', validationMiddleware(CreateOrderDto), createOrderController);
router.put('/:id', validationMiddleware(UpdateOrderDto), editOrderController);
router.delete('/:id', deleteOrderController);

export default router;
