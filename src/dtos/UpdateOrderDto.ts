import { OrderProductDto } from './OrderProductDto';

export class UpdateOrderDto {
  customerName?: string;
  products: OrderProductDto[];

  constructor(products: OrderProductDto[], customerName?: string) {
    this.products = products;
    this.customerName = customerName;
  }
}
