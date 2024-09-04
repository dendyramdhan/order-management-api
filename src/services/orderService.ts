import { inject, injectable } from 'tsyringe';
import { IOrderRepository, IProductRepository } from '../repositories/interfaces';
import { IOrderService } from './interfaces';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op, Transaction } from 'sequelize';
import sequelize from '../models';
import logger from '../utils/logger';

@injectable()
export class OrderService implements IOrderService {
  constructor(
    @inject('OrderRepository') private orderRepository: IOrderRepository,
    @inject('ProductRepository') private productRepository: IProductRepository
  ) {}

  async getOrders(customerName: string, orderDate: string, page: number, limit: number) {
    try {
      const whereClause: any = {};

      if (customerName) {
        whereClause.customerName = {
          [Op.like]: `%${customerName}%`,
        };
      }

      if (orderDate) {
        const parsedDate = parseISO(orderDate);
        whereClause.orderDate = {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        };
      }

      logger.info('Fetching orders', { customerName, orderDate, page, limit });

      const total = await this.orderRepository.countOrders(whereClause);
      const offset = (page - 1) * limit;
      const orders = await this.orderRepository.findOrders(whereClause, limit, offset);

      logger.info('Orders fetched successfully', { total, pages: Math.ceil(total / limit) });

      return { total, pages: Math.ceil(total / limit), orders };
    } catch (error) {
      logger.error('Failed to fetch orders', { error });
      throw new Error((error as Error).message || 'Failed to fetch orders');
    }
  }

  async getOrderDetails(orderId: number) {
    try {
      logger.info('Fetching order details', { orderId });
      const order = await this.orderRepository.findOrderById(orderId);

      if (!order) {
        logger.warn('Order not found', { orderId });
        throw new Error('Order not found');
      }

      logger.info('Order details fetched successfully', { orderId });
      return order;
    } catch (error) {
      logger.error('Failed to fetch order details', { error });
      throw new Error((error as Error).message || 'Failed to fetch order details');
    }
  }

  async createNewOrder(customerName: string, products: any[]): Promise<any> {
    const transaction: Transaction = await sequelize.transaction();
  
    try {
      logger.info('Creating new order', { customerName, products });
  
      for (const product of products) {
        if (product.quantity <= 0) {
          throw new Error(`Product with ID ${product.productId} has an invalid quantity: ${product.quantity}. Quantity must be at least 1.`);
        }
      }
  
      const order = await this.orderRepository.createOrder(customerName, transaction);
  
      let totalPrice = 0;
  
      for (const product of products) {
        const dbProduct = await this.productRepository.findProductById(product.productId, transaction);
  
        if (!dbProduct) {
          throw new Error(`Product with ID ${product.productId} not found.`);
        }
  
        const orderProduct = await this.orderRepository.createOrderProduct({
          orderId: order.id,
          productId: product.productId,
          quantity: product.quantity,
          totalPrice: dbProduct.price * product.quantity,
        }, transaction);
  
        totalPrice += orderProduct.totalPrice;
      }
  
      order.totalPrice = totalPrice;
      await this.orderRepository.updateOrder(order, transaction);
      await transaction.commit();
  
      logger.info('Order created successfully', { orderId: order.id, customerName });
  
      return order;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating order', { customerName, error: (error as Error).message });
      throw new Error((error as Error).message || 'Failed to create order');
    }
  }
  
  async updateExistingOrder(orderId: number, products: any[]): Promise<any> {
    const transaction: Transaction = await sequelize.transaction();
  
    try {
      logger.info('Updating order', { orderId, products });
  
      const order = await this.orderRepository.findOrderById(orderId, transaction);
      if (!order) {
        throw new Error('Order not found');
      }
  
      for (const product of products) {
        if (product.quantity <= 0) {
          throw new Error(`Product with ID ${product.productId} has an invalid quantity: ${product.quantity}. Quantity must be at least 1.`);
        }
      }
  
      await this.orderRepository.deleteOrderProducts(orderId, transaction);
  
      let totalPrice = 0;
  
      for (const product of products) {
        const dbProduct = await this.productRepository.findProductById(product.productId, transaction);
        if (!dbProduct) {
          throw new Error(`Product with ID ${product.productId} not found.`);
        }
  
        const orderProduct = await this.orderRepository.createOrderProduct({
          orderId,
          productId: product.productId,
          quantity: product.quantity,
          totalPrice: dbProduct.price * product.quantity,
        }, transaction);
  
        totalPrice += orderProduct.totalPrice;
      }
  
      order.totalPrice = totalPrice;
      await this.orderRepository.updateOrder(order, transaction);
      await transaction.commit();
  
      logger.info('Order updated successfully', { orderId });
  
      return order;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating order', { orderId, error: (error as Error).message });
      throw new Error((error as Error).message || 'Failed to update order');
    }
  }
  
  async deleteExistingOrder(orderId: number): Promise<any> {
    const transaction: Transaction = await sequelize.transaction();
  
    try {
      logger.info('Deleting order', { orderId });
  
      const order = await this.orderRepository.findOrderById(orderId, transaction);
      if (!order) {
        throw new Error('Order not found');
      }
  
      await this.orderRepository.deleteOrderProducts(orderId, transaction);
      await this.orderRepository.deleteOrderById(orderId, transaction);
      
      await transaction.commit(); // Commit the transaction if everything is successful
      logger.info('Order deleted successfully', { orderId });
  
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deleting order', { orderId, error: (error as Error).message });
      throw new Error((error as Error).message || 'Failed to delete order');
    }
  }  
}
