export class OrderSummaryDto {
    orderId: string;        // Order ID
    customerName: string;   // Customer Name
    totalProducts: number;  // Total number of products in the order
    totalPrice: number;     // Total price of the order
    orderDate: string;      // Order date (formatted as needed)
  
    constructor(orderId: string, customerName: string, totalProducts: number, totalPrice: number, orderDate: string) {
      this.orderId = orderId;
      this.customerName = customerName;
      this.totalProducts = totalProducts;
      this.totalPrice = totalPrice;
      this.orderDate = orderDate;
    }
  }
  