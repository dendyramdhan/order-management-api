import { OrderProductDetailDto } from './OrderProductDetailDto'

export class OrderDetailDto {
    orderId: string;        // Order ID
    customerName: string;   // Customer Name
    totalPrice: number;     // Total price of the order
    orderDate: string;      // Order date
    products: OrderProductDetailDto[]; // List of product details
  
    constructor(orderId: string, customerName: string, totalPrice: number, orderDate: string, products: OrderProductDetailDto[]) {
      this.orderId = orderId;
      this.customerName = customerName;
      this.totalPrice = totalPrice;
      this.orderDate = orderDate;
      this.products = products;
    }
  }
  