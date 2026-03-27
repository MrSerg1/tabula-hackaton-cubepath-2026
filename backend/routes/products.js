import { Router } from 'express';
import { ProductController } from '../controllers/products.js';

export const menuRouter = Router();

menuRouter.get('/', ProductController.getAll);
menuRouter.get('/:id', ProductController.getById);

