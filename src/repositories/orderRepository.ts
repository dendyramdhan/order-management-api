import { injectable } from 'tsyringe';
import Order from '../models/order';
import OrderProduct from '../models/orderproduct';
import Product from '../models/product';
import { IOrderRepository } from './interfaces';
import { Transaction } from 'sequelize';

@injectable()
export class OrderRepository implements IOrderRepository {
  findOrders(whereClause: any, limit: number, offset: number): Promise<Order[]> {
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

  findOrderById(orderId: number, transaction?: Transaction): Promise<Order | null> {
    return Order.findByPk(orderId, {
      include: [
        {
          model: OrderProduct,
          include: [Product],
        },
      ],
      transaction,
    });
  }

  createOrder(customerName: string, transaction?: Transaction): Promise<Order> {
    return Order.create({ customerName, totalPrice: 0 }, { transaction });
  }

  updateOrder(order: any, transaction?: Transaction): Promise<Order> {
    return order.save({ transaction });
  }

  deleteOrderById(orderId: number, transaction?: Transaction): Promise<number> {
    return Order.destroy({
      where: { id: orderId },
      transaction,
    });
  }

  deleteOrderProducts(orderId: number, transaction?: Transaction): Promise<number> {
    return OrderProduct.destroy({ where: { orderId }, transaction });
  }

  createOrderProduct(orderProductData: any, transaction?: Transaction): Promise<OrderProduct> {
    return OrderProduct.create(orderProductData, { transaction });
  }
}
