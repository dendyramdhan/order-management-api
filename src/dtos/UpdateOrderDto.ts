import { OrderProductDto } from './OrderProductDto';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  @ArrayMinSize(1, { message: 'An order must contain at least one product.' })  // Ensure at least one product
  products: OrderProductDto[];

  constructor(products: OrderProductDto[]) {
    this.products = products;
  }
}
