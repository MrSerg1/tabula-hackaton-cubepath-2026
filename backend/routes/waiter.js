import { Router } from 'express';
import { WaiterController } from '../controllers/waiter.js';

export const waiterRouter = Router();

waiterRouter.get('/', WaiterController.getDashboard);
