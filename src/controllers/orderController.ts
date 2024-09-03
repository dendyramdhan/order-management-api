import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay, format } from 'date-fns';
import Order from '../models/order';
import Product from '../models/product';
import OrderProduct from '../models/orderproduct';

// View Order List
export const getOrders = async (req: Request, res: Response) => {
  const { customerName, orderDate, page = 1, limit = 10 } = req.query;

  const whereClause: any = {};

  if (customerName) {
    whereClause.customerName = {
      [Op.like]: `%${customerName}%`,
    };
  }

  if (orderDate) {
    const parsedDate = parseISO(orderDate as string);
    whereClause.orderDate = {
      [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
    };
  }

  try {
    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderProduct,
          include: [Product],
        },
      ],
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string),
    });

    const formattedRows = rows.map((order) => {
      return {
        ...order.toJSON(),
        orderDate: format(order.orderDate, "yyyy-MM-dd'T'HH:mm:ssXXX"), // Include both date and time in the response
      };
    });

    res.status(200).json({
      total: count,
      pages: Math.ceil(count / parseInt(limit as string)),
      data: formattedRows,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
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
    // Create the order without totalPrice initially
    const order = await Order.create({ customerName, totalPrice: 0 });

    let totalPrice = 0;

    // Iterate over products and create OrderProduct entries
    for (const product of products) {
      const dbProduct = await Product.findByPk(product.productId);

      if (!dbProduct) {
        res.status(400).json({ error: `Product with ID ${product.productId} not found.` });
        return;
      }

      const orderProduct = await OrderProduct.create({
        orderId: order.id,
        productId: product.productId,
        quantity: product.quantity,
        totalPrice: dbProduct.price * product.quantity,
      });

      totalPrice += orderProduct.totalPrice;
    }

    // Update the order with the calculated totalPrice
    await order.update({ totalPrice });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
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
