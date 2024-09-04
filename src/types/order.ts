import { OrderProduct } from './orderProduct';

export interface Order {
  id: number;
  customerName: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  OrderProducts: OrderProduct[];  // Array of OrderProduct objects, not just Product[]
}
