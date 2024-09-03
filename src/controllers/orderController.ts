import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IOrderService } from '../services/interfaces'; // Import the interface
import logger from '../utils/logger';

// Resolve OrderService from the container using the interface
const orderService = container.resolve<IOrderService>('OrderService');

export const getOrdersController = async (req: Request, res: Response): Promise<void> => {
  const { customerName, orderDate, page = 1, limit = 10 } = req.query;

  try {
    const { total, pages, orders } = await orderService.getOrders(
      customerName as string,
      orderDate as string,
      parseInt(page as string),
      parseInt(limit as string)
    );

    logger.info('Orders fetched successfully', {
      customerName,
      orderDate,
      total,
      pages,
    });

    res.status(200).json({
      total,
      pages,
      data: orders,
    });
  } catch (error) {
    logger.error('Error fetching orders', { error });
    res.status(500).json({ error: 'Failed to fetch orders' });
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
    logger.error('Failed to fetch order details', { error });
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

export const createOrderController = async (req: Request, res: Response): Promise<void> => {
  const { customerName, products } = req.body;

  if (!products || products.length === 0) {
    logger.warn('Attempted to create order without products', { customerName });
    res.status(400).json({ error: 'Order must contain at least one product.' });
    return;
  }

  try {
    const order = await orderService.createNewOrder(customerName, products);
    logger.info('Order created successfully', { orderId: order.id, customerName });
    res.status(201).json(order);
  } catch (error) {
    logger.error('Error creating order', { error });
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const editOrderController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { customerName, products } = req.body;

  try {
    const order = await orderService.updateExistingOrder(parseInt(id), customerName, products);
    logger.info('Order updated successfully', { orderId: id, customerName: order.customerName });
    res.json(order);
  } catch (error) {
    logger.error('Failed to update order', { error });
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const deleteOrderController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await orderService.deleteExistingOrder(parseInt(id));
    logger.info('Order deleted successfully', { orderId: id });
    res.json(result);
  } catch (error) {
    logger.error('Failed to delete order', { error });
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
