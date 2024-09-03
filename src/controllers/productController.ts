import { Request, Response } from 'express';
import Product from '../models/product';
import logger from '../utils/logger';

// Get Product List
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.findAll();
    logger.info('Products fetched successfully', { productsCount: products.length });
    res.json(products);
  } catch (error) {
    logger.error('Failed to fetch products', { error });
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
