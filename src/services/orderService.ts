import { inject, injectable } from 'tsyringe';
import { IOrderRepository, IProductRepository } from '../repositories/interfaces';
import { IOrderService } from './interfaces';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

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

  async createNewOrder(customerName: string, products: any[]) {
    const order = await this.orderRepository.createOrder(customerName);

    let totalPrice = 0;

    for (const product of products) {
      const dbProduct = await this.productRepository.findProductById(product.productId);

      if (!dbProduct) {
        throw new Error(`Product with ID ${product.productId} not found.`);
      }

      const orderProduct = await this.orderRepository.createOrderProduct({
        orderId: order.id,
        productId: product.productId,
        quantity: product.quantity,
        totalPrice: dbProduct.price * product.quantity,
      });

      totalPrice += orderProduct.totalPrice;
    }

    order.totalPrice = totalPrice;
    await this.orderRepository.updateOrder(order);

    return order;
  }

  async updateExistingOrder(orderId: number, customerName: string, products: any[]) {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (customerName) {
      order.customerName = customerName;
    }

    await this.orderRepository.deleteOrderProducts(orderId);
    let totalPrice = 0;

    for (const product of products) {
      const dbProduct = await this.productRepository.findProductById(product.productId);
      if (!dbProduct) continue;

      const orderProduct = await this.orderRepository.createOrderProduct({
        orderId,
        productId: product.productId,
        quantity: product.quantity,
        totalPrice: dbProduct.price * product.quantity,
      });

      totalPrice += orderProduct.totalPrice;
    }

    order.totalPrice = totalPrice;
    await this.orderRepository.updateOrder(order);

    return order;
  }

  async deleteExistingOrder(orderId: number) {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    await this.orderRepository.deleteOrderById(orderId);

    return { success: true };
  }
}
