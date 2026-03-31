import { useState } from 'react';
import styles from './Waiter.module.css';
import { TableCard } from '../components/TableCard';

// ─── Mock Data (temporal) ────────────────────────────────────────────────────
// Replace with real API calls once the backend endpoints are ready.

const ALL_TABLES = Array.from({ length: 12 }, (_, i) => i + 1);

const MOCK_ALERTS = {
  2: [{ id: '1', type: 'call-waiter' }],
  5: [
    { id: '2', type: 'request-bill' },
    { id: '3', type: 'clean-table' },
  ],
  7: [{ id: '4', type: 'call-waiter' }],
};

const MOCK_ORDERS = { 2: 1, 3: 2, 5: 3, 7: 1, 9: 2 };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countTotalAlerts(alerts) {
  return Object.values(alerts).reduce((sum, arr) => sum + arr.length, 0);
}

function countTotalOrders(orders) {
  return Object.values(orders).reduce((sum, n) => sum + n, 0);
}

// Only tables with at least one alert or pending order are shown.
function getActiveTables(tables, alerts, orders) {
  return tables.filter(
    (n) => (alerts[n]?.length ?? 0) > 0 || (orders[n] ?? 0) > 0,
  );
}

// ─── Waiter ──────────────────────────────────────────────────────────────────

export function Waiter() {
  const [alerts] = useState(MOCK_ALERTS);
  const [orders] = useState(MOCK_ORDERS);

  const activeTables = getActiveTables(ALL_TABLES, alerts, orders);
  const totalAlerts  = countTotalAlerts(alerts);
  const totalOrders  = countTotalOrders(orders);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <h1 className={styles.title}>Panel del Mesero</h1>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span>Alertas activas</span>
            <span className={styles.statValue}>{totalAlerts}</span>
          </div>
          <div className={styles.statItem}>
            <span>Órdenes pendientes</span>
            <span className={styles.statValue}>{totalOrders}</span>
          </div>
        </div>
      </header>

      {activeTables.length === 0 ? (
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>Todo en orden</h2>
          <p className={styles.emptyText}>Sin actividad en este momento.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {activeTables.map((tableNumber) => (
            <TableCard
              key={tableNumber}
              tableNumber={tableNumber}
              alerts={alerts[tableNumber] ?? []}
              ordersCount={orders[tableNumber] ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
