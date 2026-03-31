import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../data/alerts.json');
const TEMPORARY_MAX_STORED_ALERTS = 15;

// Provisional safeguard. When it is no longer needed, delete this function
// and replace its usage in create() with: const nextAlerts = alerts;
function applyTemporaryAlertStorageLimit(alerts) {
    if (alerts.length < TEMPORARY_MAX_STORED_ALERTS) {
        return alerts;
    }

    return [];
}

export class AlertModel {
    static async readAlerts() {
        const data = await readFile(DB_PATH, 'utf-8').catch(() => '[]');
        const trimmed = data.trim();

        if (trimmed === '') {
            return [];
        }

        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [];
    }

    static async writeAlerts(alerts) {
        await writeFile(DB_PATH, JSON.stringify(alerts, null, 2), 'utf-8');
    }

    static async create(alertData) {
        const alerts = await AlertModel.readAlerts();

        const now = new Date().toISOString();
        const nextAlerts = applyTemporaryAlertStorageLimit(alerts);

        const newAlert = {
            id: randomUUID(),
            ...alertData,
            status: 'pending',
            createdAt: now,
            updatedAt: now,
        };

        nextAlerts.push(newAlert);
        await AlertModel.writeAlerts(nextAlerts);
        return newAlert;
    }
}
