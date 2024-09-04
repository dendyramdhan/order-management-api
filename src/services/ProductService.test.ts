import 'reflect-metadata';
import { ProductService } from './productService';
import { ProductRepository } from '../repositories/productRepository';
import { mock, instance, when } from 'ts-mockito';
import { ProductDto } from '../dtos/ProductDto';
import { Product } from '../models';

describe('ProductService', () => {
  let productService: ProductService;
  let mockedProductRepository: ProductRepository;

  beforeEach(() => {
    // Mock the repository
    mockedProductRepository = mock(ProductRepository);
    // Inject the mock repository into the service
    productService = new ProductService(instance(mockedProductRepository));
  });

  // Tests for getProducts method
  describe('getProducts', () => {
    it('should fetch products and map them to ProductDto', async () => {
      // Arrange
      const products: Product[] = [
        Product.build({ id: 1, name: 'Product 1', price: 100 }), // Sequelize product instance
        Product.build({ id: 2, name: 'Product 2', price: 200 }),
      ];

      // Mock the repository behavior
      when(mockedProductRepository.findAllProducts()).thenResolve(products);

      // Act
      const result = await productService.getProducts();

      // Assert
      expect(result).toEqual([
        new ProductDto(1, 'Product 1', 100),
        new ProductDto(2, 'Product 2', 200),
      ]);
    });

    it('should handle repository errors and throw an error', async () => {
      // Arrange
      when(mockedProductRepository.findAllProducts()).thenReject(new Error('Database error'));

      // Act & Assert
      await expect(productService.getProducts()).rejects.toThrow('Database error');
    });
  });

  // Tests for getProductById method
  describe('getProductById', () => {
    it('should fetch product by ID and map it to ProductDto', async () => {
      // Arrange
      const product = Product.build({ id: 1, name: 'Product 1', price: 100 }); // Sequelize product instance

      // Mock the repository behavior
      when(mockedProductRepository.findProductById(1)).thenResolve(product);

      // Act
      const result = await productService.getProductById(1);

      // Assert
      expect(result).toEqual(new ProductDto(1, 'Product 1', 100));
    });

    it('should throw an error when product is not found', async () => {
      // Arrange
      when(mockedProductRepository.findProductById(999)).thenResolve(null); // No product found

      // Act & Assert
      await expect(productService.getProductById(999)).rejects.toThrow('Product not found');
    });

    it('should handle repository errors and throw an error', async () => {
      // Arrange
      when(mockedProductRepository.findProductById(1)).thenReject(new Error('Database error'));

      // Act & Assert
      await expect(productService.getProductById(1)).rejects.toThrow('Database error');
    });
  });
});
