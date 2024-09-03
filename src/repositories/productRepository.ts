import { injectable } from 'tsyringe';
import Product from '../models/product';
import { IProductRepository } from './interfaces';

@injectable()
export class ProductRepository implements IProductRepository {
  findAllProducts(): Promise<any> {
    return Product.findAll();
  }

  findProductById(productId: number): Promise<any> {
    return Product.findByPk(productId);
  }
}
