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
    await expect(productService.getProducts()).rejects.toThrow('Failed to fetch products');
  });
});
