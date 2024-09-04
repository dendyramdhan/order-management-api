import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../repositories/interfaces';
import { IProductService } from './interfaces'; // Import the IProductService interface
import { ProductDto } from '../dtos/ProductDto'; // Import the ProductDto
import logger from '../utils/logger'; // Import the logger
import { Product } from '../types/product'; // Sequelize model

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
      
      // Map the products to the ProductDto
      return products.map((product: Product) => new ProductDto(product.id, product.name, product.price));
    } catch (error) {
      logger.error('Error fetching products', { error });
      throw new Error((error as Error).message || 'Failed to fetch products');
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

      // Return the product as a ProductDto
      return new ProductDto(product.id, product.name, product.price);
    } catch (error) {
      logger.error('Error fetching product details', { productId, error });
      throw new Error((error as Error).message || 'Failed to fetch product details');
    }
  }
}
