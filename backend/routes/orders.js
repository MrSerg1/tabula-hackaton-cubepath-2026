import { Router } from 'express';
import { OrderController } from '../controllers/orders.js';

export const orderRouter = Router();

orderRouter.post('/', OrderController.create);
