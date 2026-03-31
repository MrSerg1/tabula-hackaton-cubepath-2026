import { useState, useEffect } from 'react';
import styles from './Waiter.module.css';
import { TableCard } from '../components/TableCard';
import { TableDetailSheet } from '../components/TableDetailSheet';
import { requestJson } from '../utils/requestJson';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countTotalAlerts(alerts) {
  return Object.values(alerts).reduce((sum, arr) => sum + arr.length, 0);
}

// orders is { [table]: orderArray } — sum the lengths of each array
function countTotalOrders(orders) {
  return Object.values(orders).reduce((sum, arr) => sum + arr.length, 0);
}

// ─── Waiter ──────────────────────────────────────────────────────────────────

export function Waiter() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const [alerts, setAlerts] = useState({});
  const [orders, setOrders] = useState({}); // { [table]: orderObject[] }
  const [activeTables, setActiveTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);
        const data = await requestJson(`${apiUrl}/waiter`, { signal: controller.signal });

        const newAlerts = {};
        const newOrders = {};
        const tableNumbers = [];

        for (const entry of data.tables) {
          newAlerts[entry.table] = entry.alerts;
          newOrders[entry.table] = entry.orders; // full array, not just count
          tableNumbers.push(entry.table);
        }

        setAlerts(newAlerts);
        setOrders(newOrders);
        setActiveTables(tableNumbers);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
    return () => controller.abort();
  }, []);

  const totalAlerts = countTotalAlerts(alerts);
  const totalOrders = countTotalOrders(orders);

  return (
    <>
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

      {loading ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Cargando…</p>
        </div>
      ) : error ? (
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>Error</h2>
          <p className={styles.emptyText}>{error}</p>
        </div>
      ) : activeTables.length === 0 ? (
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
              ordersCount={(orders[tableNumber] ?? []).length}
              onSelect={() => setSelectedTable(tableNumber)}
            />
          ))}
        </div>
      )}
    </div>

    <TableDetailSheet
      tableNumber={selectedTable}
      orders={selectedTable !== null ? (orders[selectedTable] ?? []) : []}
      onClose={() => setSelectedTable(null)}
    />
    </>
  );
}
