import express from 'express';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;


process.loadEnvFile();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to read JSON bodies

// Temporal data storage (in-memory)
let orders = [];

// test route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
    });

// Create a new order
app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: Date.now(),
        ...req.body,
        status: 'pending'
    };
    orders.push(newOrder);
    console.log('Nuevo pedido recibido:', newOrder);
    res.status(201).json(newOrder);
});

// Get all orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// start the server
app.listen(PORT, () => {
    console.log(`Servidor tabula corriendo en http://localhost:${PORT}`);
});