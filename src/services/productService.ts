import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../repositories/interfaces';

@injectable()
export class ProductService {
  constructor(
    @inject('ProductRepository') private productRepository: IProductRepository
  ) {}

  async getProducts() {
    return this.productRepository.findAllProducts();
  }
}
