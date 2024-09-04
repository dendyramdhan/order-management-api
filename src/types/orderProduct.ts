import { Product } from './product'

export interface OrderProduct {
    orderId: number;
    productId: number;
    quantity: number;
    totalPrice: number;
    product: Product;  // This includes the associated Product details
  }
  