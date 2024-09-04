import { OrderProductDto } from './OrderProductDto';
import { IsArray, IsNotEmpty, IsString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  constructor(customerName: string, products: OrderProductDto[]) {
    this.customerName = customerName;
    this.products = products;
  }
}