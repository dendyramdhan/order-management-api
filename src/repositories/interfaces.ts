import { Transaction } from 'sequelize';
import Order from '../models/order';
import OrderProduct from '../models/orderproduct';
import Product from '../models/product';

export interface IOrderRepository {
  findOrders(whereClause: any, limit: number, offset: number, transaction?: Transaction): Promise<Order[]>;
  countOrders(whereClause: any, transaction?: Transaction): Promise<number>;
  findOrderById(orderId: number, transaction?: Transaction): Promise<Order | null>;
  createOrder(customerName: string, transaction?: Transaction): Promise<Order>;
  updateOrder(order: any, transaction?: Transaction): Promise<Order>;
  deleteOrderById(orderId: number, transaction?: Transaction): Promise<number>;
  deleteOrderProducts(orderId: number, transaction?: Transaction): Promise<number>;
  createOrderProduct(orderProductData: any, transaction?: Transaction): Promise<OrderProduct>;
}

export interface IProductRepository {
  findAllProducts(transaction?: Transaction): Promise<Product[]>;
  findProductById(productId: number, transaction?: Transaction): Promise<Product | null>;
}
