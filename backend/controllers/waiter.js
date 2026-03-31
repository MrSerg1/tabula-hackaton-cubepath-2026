import { OrderModel } from '../models/order.js';
import { AlertModel } from '../models/alert.js';

export class WaiterController {
    static async getDashboard(req, res) {
        const [allOrders, allAlerts] = await Promise.all([
            OrderModel.getAll(),
            AlertModel.getAll(),
        ]);

        const pendingOrders = allOrders.filter(o => o.status === 'pending');
        const pendingAlerts = allAlerts.filter(a => a.status === 'pending');

        const tableMap = new Map();

        for (const order of pendingOrders) {
            const key = order.mesa;
            if (!tableMap.has(key)) tableMap.set(key, { table: key, orders: [], alerts: [] });
            tableMap.get(key).orders.push(order);
        }

        for (const alert of pendingAlerts) {
            const key = alert.table;
            if (!tableMap.has(key)) tableMap.set(key, { table: key, orders: [], alerts: [] });
            tableMap.get(key).alerts.push(alert);
        }

        const tables = Array.from(tableMap.values()).sort((a, b) => a.table - b.table);

        res.json({ tables });
    }
}
