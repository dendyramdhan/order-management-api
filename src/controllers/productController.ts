import { Request, Response } from 'express';
import Product from '../models/product';

// Get Product List
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
