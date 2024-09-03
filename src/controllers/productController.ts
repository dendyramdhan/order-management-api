import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IProductService } from '../services/interfaces'; // Import the interface
import logger from '../utils/logger';

// Resolve ProductService from the container using the interface
const productService = container.resolve<IProductService>('ProductService');

export const getProductsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getProducts();
    logger.info('Products fetched successfully', { productsCount: products.length });
    res.json(products);
  } catch (error) {
    logger.error('Failed to fetch products', { error });
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
