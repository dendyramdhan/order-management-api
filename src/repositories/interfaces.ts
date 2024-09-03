import { Transaction } from 'sequelize';

export interface IOrderRepository {
  findOrders(whereClause: any, limit: number, offset: number, transaction?: Transaction): Promise<any>;
  countOrders(whereClause: any, transaction?: Transaction): Promise<number>;
  findOrderById(orderId: number, transaction?: Transaction): Promise<any>;
  createOrder(customerName: string, transaction?: Transaction): Promise<any>;
  updateOrder(order: any, transaction?: Transaction): Promise<any>;
  deleteOrderById(orderId: number, transaction?: Transaction): Promise<number>;
  deleteOrderProducts(orderId: number, transaction?: Transaction): Promise<number>;
  createOrderProduct(orderProductData: any, transaction?: Transaction): Promise<any>;
}

export interface IProductRepository {
  findAllProducts(transaction?: Transaction): Promise<any>;
  findProductById(productId: number, transaction?: Transaction): Promise<any>;
}
