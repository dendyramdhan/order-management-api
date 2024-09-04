import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IOrderService } from '../services/interfaces';
import logger from '../utils/logger';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { UpdateOrderDto } from '../dtos/UpdateOrderDto';

const orderService = container.resolve<IOrderService>('OrderService');

export const getOrdersController = async (req: Request, res: Response): Promise<void> => {
  const { customerName, orderDate, page = 1, limit = 10 } = req.query;

  try {
    // Correctly destructure `data` instead of `orders`
    const { total, pages, data } = await orderService.getOrders(
      customerName as string,
      orderDate as string,
      parseInt(page as string),
      parseInt(limit as string)
    );
    
    logger.info('Orders fetched successfully', { customerName, orderDate, total, pages });
    
    // Return the response with the correctly structured data
    res.status(200).json({ total, pages, data });
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Error fetching orders', { error: error.message });
      res.status(500).json({ error: error.message || 'Failed to fetch orders' });
    } else {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
};

export const getOrderDetailsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderDetails(parseInt(id));

    if (!order) {
      logger.warn('Order not found', { orderId: id });
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    logger.info('Order details fetched successfully', { orderId: id });
    res.json(order);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to fetch order details', { error: error.message });
      res.status(500).json({ error: error.message || 'Failed to fetch order details' });
    } else {
      res.status(500).json({ error: 'Failed to fetch order details' });
    }
  }
};

export const createOrderController = async (req: Request, res: Response): Promise<void> => {
  const createOrderDto: CreateOrderDto = req.body;

  try {
    const order = await orderService.createNewOrder(createOrderDto.customerName, createOrderDto.products);
    logger.info('Order created successfully', { orderId: order.id, customerName: createOrderDto.customerName });
    res.status(201).json(order);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Error creating order', { error: error.message });
      res.status(400).json({ error: error.message || 'Failed to create order' });
    } else {
      res.status(400).json({ error: 'Failed to create order' });
    }
  }
};

export const editOrderController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateOrderDto: UpdateOrderDto = req.body;

  try {
    const order = await orderService.updateExistingOrder(parseInt(id), updateOrderDto.products);
    logger.info('Order updated successfully', { orderId: id });
    res.json(order);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to update order', { error: error.message });
      res.status(500).json({ error: error.message || 'Failed to update order' });
    } else {
      res.status(500).json({ error: 'Failed to update order' });
    }
  }
};

export const deleteOrderController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await orderService.deleteExistingOrder(parseInt(id));
    logger.info('Order deleted successfully', { orderId: id });
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to delete order', { error: error.message });
      res.status(500).json({ error: error.message || 'Failed to delete order' });
    } else {
      res.status(500).json({ error: 'Failed to delete order' });
    }
  }
};
