import { inject, injectable } from 'tsyringe';
import { IOrderRepository, IProductRepository } from '../repositories/interfaces';
import { IOrderService } from './interfaces';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op, Transaction } from 'sequelize';
import sequelize from '../models';
import logger from '../utils/logger';
import { OrderDetailDto } from '../dtos/OrderDetailDto';
import { OrderSummaryDto } from '../dtos/OrderSummaryDto';
import { OrderProductDetailDto } from '../dtos/OrderProductDetailDto';
import { PaginatedResultDto } from '../dtos/PaginatedResultDto';
import Order from '../models/order';
import OrderProduct from '../models/orderproduct';


@injectable()
export class OrderService implements IOrderService {
  constructor(
    @inject('OrderRepository') private orderRepository: IOrderRepository,
    @inject('ProductRepository') private productRepository: IProductRepository
  ) {}

  async getOrders(customerName: string, orderDate: string, page: number, limit: number): Promise<PaginatedResultDto<OrderSummaryDto>> {
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

      const totalPages = Math.ceil(total / limit);  // Calculate total pages

      logger.info('Orders fetched successfully', { total, totalPages });

      // Map the fetched orders to OrderSummaryDto
      const ordersDto = orders.map((order: Order) => {
        const totalProducts = order.OrderProducts?.length || 0;
        const totalPrice = order.totalPrice;
        const orderDate = order.orderDate.toISOString(); // Format the date as needed

        return new OrderSummaryDto(order.id.toString(), order.customerName, totalProducts, totalPrice, orderDate);  // Convert order.id to string
      });

      // Return a paginated result DTO with `data` included
      return new PaginatedResultDto<OrderSummaryDto>(ordersDto, total, page, totalPages);
    } catch (error) {
      logger.error('Failed to fetch orders', { error });
      throw new Error((error as Error).message || 'Failed to fetch orders');
    }
  }

  async getOrderDetails(orderId: number): Promise<OrderDetailDto> {
    try {
      logger.info('Fetching order details', { orderId });
      const order = await this.orderRepository.findOrderById(orderId);

      if (!order) {
        logger.warn('Order not found', { orderId });
        throw new Error('Order not found');
      }

      logger.info('Order details fetched successfully', { orderId });

      // Map the order's products to OrderProductDetailDto
    const products = order.OrderProducts?.map((orderProduct: OrderProduct) => {
      if (orderProduct.Product) {
        const totalProductPrice = orderProduct.Product.price * orderProduct.quantity;
        return new OrderProductDetailDto(
          orderProduct.Product.name,
          orderProduct.Product.price,
          orderProduct.quantity,
          totalProductPrice
        );  
      }
    }) as OrderProductDetailDto[];

    // Create and return the OrderDetailDto
    return new OrderDetailDto(
      order.id.toString(),
      order.customerName,
      order.totalPrice,
      order.orderDate.toISOString(), // Make sure `orderDate` is correctly formatted
      products
    );
    } catch (error) {
      logger.error('Failed to fetch order details', { error });
      throw new Error((error as Error).message || 'Failed to fetch order details');
    }
  }

  async createNewOrder(customerName: string, products: any[]): Promise<OrderDetailDto> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      logger.info('Creating new order', { customerName, products });

      if (products.length === 0) {
        throw new Error('An order must contain at least one product.');
      }

      const order = await this.orderRepository.createOrder(customerName, transaction);

      let totalPrice = 0;
      const orderProducts: OrderProductDetailDto[] = [];

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
        orderProducts.push(new OrderProductDetailDto(dbProduct.name, dbProduct.price, product.quantity, dbProduct.price * product.quantity));
      }

      order.totalPrice = totalPrice;
      await this.orderRepository.updateOrder(order, transaction);
      await transaction.commit();

      logger.info('Order created successfully', { orderId: order.id, customerName });

      // Return the order as an OrderDetailDto
      return new OrderDetailDto(order.id.toString(), order.customerName, order.totalPrice, order.orderDate.toISOString(), orderProducts);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating order', { customerName, error: (error as Error).message });
      throw new Error((error as Error).message || 'Failed to create order');
    }
  }
  
  async updateExistingOrder(orderId: number, products: any[]): Promise<OrderDetailDto> {
    const transaction: Transaction = await sequelize.transaction();
  
    try {
      logger.info('Updating order', { orderId, products });
  
      if (products.length === 0) {
        throw new Error('An order must contain at least one product.');
      }
  
      const order = await this.orderRepository.findOrderById(orderId, transaction);
      if (!order) {
        throw new Error('Order not found');
      }
  
      // Validate product quantities
      for (const product of products) {
        if (product.quantity <= 0) {
          throw new Error(`Product with ID ${product.productId} has an invalid quantity: ${product.quantity}. Quantity must be at least 1.`);
        }
      }
  
      // Delete existing order products
      await this.orderRepository.deleteOrderProducts(orderId, transaction);
  
      let totalPrice = 0;
      const orderProducts: OrderProductDetailDto[] = [];
  
      // Recreate the order products with updated values
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
  
        // Create DTO for the product and add to the orderProducts array
        orderProducts.push(
          new OrderProductDetailDto(
            dbProduct.name,
            dbProduct.price,
            product.quantity,
            dbProduct.price * product.quantity
          )
        );
      }
  
      // Update the order's total price and save the updated order
      order.totalPrice = totalPrice;
      await this.orderRepository.updateOrder(order, transaction);
      await transaction.commit();
  
      logger.info('Order updated successfully', { orderId });
  
      // Return the updated order with the correct DTO
      return new OrderDetailDto(
        order.id.toString(),
        order.customerName,
        order.totalPrice,
        order.orderDate.toISOString(),  // Format the date
        orderProducts
      );
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
