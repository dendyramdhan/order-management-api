import 'reflect-metadata';
import { container } from 'tsyringe';
import { IOrderRepository, IProductRepository } from '../repositories/interfaces';
import { IOrderService, IProductService } from '../services/interfaces';
import { OrderRepository } from '../repositories/orderRepository';
import { ProductRepository } from '../repositories/productRepository';
import { OrderService } from '../services/orderService';
import { ProductService } from '../services/productService';

// Register repositories
container.register<IOrderRepository>('OrderRepository', {
  useClass: OrderRepository,
});
container.register<IProductRepository>('ProductRepository', {
  useClass: ProductRepository,
});

// Register services
container.register<IOrderService>('OrderService', {
  useClass: OrderService,
});
container.register<IProductService>('ProductService', {
  useClass: ProductService,
});
