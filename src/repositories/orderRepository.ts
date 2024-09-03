import { injectable } from 'tsyringe';
import Order from '../models/order';
import OrderProduct from '../models/orderproduct';
import Product from '../models/product';
import { IOrderRepository } from './interfaces';

@injectable()
export class OrderRepository implements IOrderRepository {
  findOrders(whereClause: any, limit: number, offset: number): Promise<any> {
    return Order.findAll({
      where: whereClause,
      include: [
        {
          model: OrderProduct,
          include: [Product],
        },
      ],
      limit,
      offset,
    });
  }

  countOrders(whereClause: any): Promise<number> {
    return Order.count({ where: whereClause });
  }

  findOrderById(orderId: number): Promise<any> {
    return Order.findByPk(orderId, {
      include: [OrderProduct],
    });
  }

  createOrder(customerName: string): Promise<any> {
    return Order.create({ customerName, totalPrice: 0 });
  }

  updateOrder(order: any): Promise<any> {
    return order.save();
  }

  deleteOrderById(orderId: number): Promise<number> {
    return Order.destroy({ where: { id: orderId } });
  }

  deleteOrderProducts(orderId: number): Promise<number> {
    return OrderProduct.destroy({ where: { orderId } });
  }

  createOrderProduct(orderProductData: any): Promise<any> {
    return OrderProduct.create(orderProductData);
  }
}
