import { Request, Response } from 'express';
import Order from '../models/order';
import Product from '../models/product';
import OrderProduct from '../models/orderproduct';

// View Order List
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, orderDate, page = 1, limit = 10 } = req.query;
    const where: any = {};

    if (customerName) where.customerName = customerName;
    if (orderDate) where.createdAt = new Date(orderDate as string);

    const orders = await Order.findAndCountAll({
      where,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      include: [OrderProduct]
    });

    res.json({
      total: orders.count,
      pages: Math.ceil(orders.count / Number(limit)),
      data: orders.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// View Order Details
export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [OrderProduct]
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

// Create a New Order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { customerName, products } = req.body;

  if (!products || products.length === 0) {
    res.status(400).json({ error: 'Order must contain at least one product.' });
    return;
  }

  try {
    const order = await Order.create({ customerName });
    let totalPrice = 0;

    for (const product of products) {
      const dbProduct = await Product.findByPk(product.productId);
      if (!dbProduct) continue;

      const orderProduct = await OrderProduct.create({
        orderId: order.id,
        productId: product.productId,
        quantity: product.quantity,
        totalPrice: dbProduct.price * product.quantity
      });

      totalPrice += orderProduct.totalPrice;
    }

    order.totalPrice = totalPrice;
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Edit an Order (Cannot change customer name)
export const editOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { products } = req.body;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Update products in the order
    await OrderProduct.destroy({ where: { orderId: id } });
    let totalPrice = 0;

    for (const product of products) {
      const dbProduct = await Product.findByPk(product.productId);
      if (!dbProduct) continue;

      const orderProduct = await OrderProduct.create({
        orderId: id,
        productId: product.productId,
        quantity: product.quantity,
        totalPrice: dbProduct.price * product.quantity
      });

      totalPrice += orderProduct.totalPrice;
    }

    order.totalPrice = totalPrice;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Delete an Order
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await Order.destroy({ where: { id } });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
