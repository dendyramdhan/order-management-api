import { injectable } from 'tsyringe';
import Product from '../models/product';
import { IProductRepository } from './interfaces';
import { Transaction } from 'sequelize';

@injectable()
export class ProductRepository implements IProductRepository {
  findAllProducts(): Promise<Product[]> {
    return Product.findAll();
  }

  findProductById(productId: number, transaction?: Transaction): Promise<Product | null> {
    return Product.findByPk(productId, { transaction });
  }
}
