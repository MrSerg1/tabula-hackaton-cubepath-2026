import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../data/products.json');

export class ProductModel {
    static async readProducts() {
        const data = await readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    }

    static async getAll({ limit = 10, offset = 0 } = {}) {
        const products = await ProductModel.readProducts();
        return {
            total: products.length,
            data: products.slice(offset, offset + limit),
        };
    }

    static async getById(id) {
        const products = await ProductModel.readProducts();
        return products.find((p) => p.id === id) ?? null;
    }
}
