import express from 'express';
import cors from 'cors';
import { menuRouter } from './routes/products.js';

process.loadEnvFile();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// Ruta de salud para monitoreo
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

app.use('/menu', menuRouter);

app.listen(PORT, () => {
    console.log(`Servidor tabula corriendo en http://localhost:${PORT}`);
});