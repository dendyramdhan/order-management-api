import { IsNumber, Min } from 'class-validator';

export class OrderProductDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })  // Ensure quantity is at least 1
  quantity: number;

  constructor(productId: number, quantity: number) {
    this.productId = productId;
    this.quantity = quantity;
  }
}