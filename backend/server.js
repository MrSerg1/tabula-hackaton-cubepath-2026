import express from 'express';
import { menuRouter } from './routes/products.js';
import { orderRouter } from './routes/orders.js';
import { alertRouter } from './routes/alerts.js';
import { waiterRouter } from './routes/waiter.js';
import { corsMiddleware } from './middleware/cors.js';

process.loadEnvFile();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware());
app.use(express.json());


// Ruta de salud para monitoreo
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

app.use('/menu', menuRouter);
app.use('/orders', orderRouter);
app.use('/alerts', alertRouter);
app.use('/waiter', waiterRouter);

app.listen(PORT, () => {
    console.log(`Servidor tabula corriendo en http://localhost:${PORT}`);
});