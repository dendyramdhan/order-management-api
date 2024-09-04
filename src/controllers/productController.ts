import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IProductService } from '../services/interfaces';
import logger from '../utils/logger';

const productService = container.resolve<IProductService>('ProductService');

export const getProductsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getProducts();
    logger.info('Products fetched successfully', { productsCount: products.length });
    res.json(products);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to fetch products', { error: error.message });
      res.status(500).json({ error: error.message || 'Failed to fetch products' });
    } else {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
};