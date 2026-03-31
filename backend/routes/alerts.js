import { Router } from 'express';
import { AlertController } from '../controllers/alerts.js';

export const alertRouter = Router();

alertRouter.post('/', AlertController.create);
