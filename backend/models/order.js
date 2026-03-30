import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../data/orders.json');

export class OrderModel {
    static async readOrders() {
        const data = await readFile(DB_PATH, 'utf-8').catch(() => '[]');
        const trimmed = data.trim();

        if (trimmed === '') {
            return [];
        }

        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [];
    }

    static async writeOrders(orders) {
        await writeFile(DB_PATH, JSON.stringify(orders, null, 2), 'utf-8');
    }

    static async create(orderData) {
        const orders = await OrderModel.readOrders();
        const now = new Date().toISOString();

        const newOrder = {
            id: randomUUID(),
            ...orderData,
            status: 'pending',
            createdAt: now,
            updatedAt: now,
        };

        orders.push(newOrder);
        await OrderModel.writeOrders(orders);
        return newOrder;
    }
}