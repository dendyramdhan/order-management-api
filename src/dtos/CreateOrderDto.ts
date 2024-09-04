import { OrderProductDto } from './OrderProductDto';
import { IsString, IsArray, IsNotEmpty, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  @ArrayMinSize(1, { message: 'An order must contain at least one product.' }) // Ensure at least one product is in the array
  products: OrderProductDto[];

  constructor(customerName: string, products: OrderProductDto[]) {
    this.customerName = customerName;
    this.products = products;
  }
}