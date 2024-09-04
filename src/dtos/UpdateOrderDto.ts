import { OrderProductDto } from './OrderProductDto';

export class UpdateOrderDto {
  products: OrderProductDto[];

  constructor(products: OrderProductDto[]) {
    this.products = products;
  }
}
