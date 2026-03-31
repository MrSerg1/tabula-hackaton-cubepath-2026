import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../data/orders.json');
const TEMPORARY_MAX_STORED_ORDERS = 15;

// Provisional safeguard. When it is no longer needed, delete this function
// and replace its usage in create() with: const nextOrders = orders;
function applyTemporaryOrderStorageLimit(orders) {
    if (orders.length < TEMPORARY_MAX_STORED_ORDERS) {
        return orders;
    }

    return [];
}

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

    static async getAll() {
        return OrderModel.readOrders();
    }

    static async create(orderData) {
        const orders = await OrderModel.readOrders();

        const now = new Date().toISOString();
        const nextOrders = applyTemporaryOrderStorageLimit(orders);

        const newOrder = {
            id: randomUUID(),
            ...orderData,
            status: 'pending',
            createdAt: now,
            updatedAt: now,
        };

        nextOrders.push(newOrder);
        await OrderModel.writeOrders(nextOrders);
        return newOrder;
    }
}