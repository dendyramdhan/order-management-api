import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../repositories/interfaces';
import { IProductService } from './interfaces'; // Import the IProductService interface
import logger from '../utils/logger'; // Import the logger

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject('ProductRepository') private productRepository: IProductRepository
  ) {}

  async getProducts() {
    try {
      logger.info('Fetching products');
      const products = await this.productRepository.findAllProducts();
      logger.info('Products fetched successfully', { productsCount: products.length });
      return products;
    } catch (error) {
      logger.error('Error fetching products', { error });
      throw new Error('Failed to fetch products');
    }
  }

  async getProductById(productId: number) {
    try {
      logger.info('Fetching product details', { productId });
      const product = await this.productRepository.findProductById(productId);

      if (!product) {
        logger.warn('Product not found', { productId });
        throw new Error('Product not found');
      }

      logger.info('Product details fetched successfully', { productId });
      return product;
    } catch (error) {
      logger.error('Error fetching product details', { productId, error });
      throw new Error('Failed to fetch product details');
    }
  }
}
