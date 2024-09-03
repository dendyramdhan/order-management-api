import { OrderProductDto } from './OrderProductDto';

export class CreateOrderDto {
    customerName: string;
    products: OrderProductDto[];
  
    constructor(customerName: string, products: OrderProductDto[]) {
      this.customerName = customerName;
      this.products = products;
    }
}