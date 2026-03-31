import { AlertModel } from '../models/alert.js';

const VALID_TYPES = ['call-waiter', 'request-bill', 'clean-table'];

function parsePositiveInteger(value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed <= 0) return null;
    return parsed;
}

export class AlertController {
    static async create(req, res) {
        try {
            // Prefer the English field name, but keep backward compatibility with `mesa`.
            const table = parsePositiveInteger(req.body?.table ?? req.body?.mesa);
            if (table === null) {
                return res.status(400).json({ error: 'Field "table" is required and must be a positive integer' });
            }

            const type = req.body?.type;
            if (typeof type !== 'string' || !VALID_TYPES.includes(type)) {
                return res.status(400).json({
                    error: `Field "type" is required. Allowed values: ${VALID_TYPES.join(', ')}`,
                });
            }

            const alert = await AlertModel.create({ table, type });

            return res.status(201).json(alert);
        } catch (error) {
            console.error('Failed to create alert:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
