import { inject, injectable } from 'tsyringe';
import { IOrderRepository, IProductRepository } from '../repositories/interfaces';
import { IOrderService } from './interfaces';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import sequelize from '../models';
import { Transaction } from 'sequelize';

@injectable()
export class OrderService implements IOrderService {
  constructor(
    @inject('OrderRepository') private orderRepository: IOrderRepository,
    @inject('ProductRepository') private productRepository: IProductRepository
  ) {}

  async getOrders(customerName: string, orderDate: string, page: number, limit: number) {
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

    const total = await this.orderRepository.countOrders(whereClause);
    const offset = (page - 1) * limit;
    const orders = await this.orderRepository.findOrders(whereClause, limit, offset);

    return { total, pages: Math.ceil(total / limit), orders };
  }

  async getOrderDetails(orderId: number) {
    return this.orderRepository.findOrderById(orderId);
  }

  async createNewOrder(customerName: string, products: any[]): Promise<any> {
    const transaction: Transaction = await sequelize.transaction(); // Start a transaction

    try {
      // Create the order
      const order = await this.orderRepository.createOrder(customerName, transaction);

      let totalPrice = 0;

      // Loop through each product and add it to the order
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

      // Update the order with the calculated total price
      order.totalPrice = totalPrice;
      await this.orderRepository.updateOrder(order, transaction);

      await transaction.commit(); // Commit the transaction if everything is successful

      return order;
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      throw error; // Rethrow the error to be handled by the calling function
    }
  }

  async updateExistingOrder(orderId: number, customerName: string | undefined, products: any[]): Promise<any> {
    const transaction: Transaction = await sequelize.transaction(); // Start a transaction
  
    try {
      // Find the order
      const order = await this.orderRepository.findOrderById(orderId, transaction);
      if (!order) {
        throw new Error('Order not found');
      }
  
      // Update customer name if provided
      if (customerName) {
        order.customerName = customerName;
      }
  
      // Remove existing products from the order
      await this.orderRepository.deleteOrderProducts(orderId, transaction);
  
      let totalPrice = 0;
  
      // Add the new products to the order
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
  
      // Update the order with the new total price
      order.totalPrice = totalPrice;
      await this.orderRepository.updateOrder(order, transaction);
  
      await transaction.commit(); // Commit the transaction if everything is successful
  
      return order;
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      throw error; // Rethrow the error to be handled by the calling function
    }
  }

  async deleteExistingOrder(orderId: number): Promise<any> {
    const transaction: Transaction = await sequelize.transaction(); // Start a transaction

    try {
      // Find the order to ensure it exists
      const order = await this.orderRepository.findOrderById(orderId, transaction);
      if (!order) {
        throw new Error('Order not found');
      }

      // Delete all associated products from the order
      await this.orderRepository.deleteOrderProducts(orderId, transaction);

      // Delete the order itself
      await this.orderRepository.deleteOrderById(orderId, transaction);

      await transaction.commit(); // Commit the transaction if everything is successful

      return { success: true };
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      throw error; // Rethrow the error to be handled by the calling function
    }
  }
}
