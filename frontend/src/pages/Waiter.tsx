import { useEffect, useState } from 'react';
import styles from './Waiter.module.css';
import { TableCard } from '../components/TableCard';
import { TableDetailSheet } from '../components/TableDetailSheet';
import { requestJson } from '../utils/requestJson';
import type { SubmitOrderInput, WaiterDashboardResponse, WaiterPageState } from '../types';

function countTotalAlerts(alerts: WaiterPageState['alerts']): number {
  return Object.values(alerts).reduce((sum, entries) => sum + entries.length, 0);
}

function countTotalOrders(orders: WaiterPageState['orders']): number {
  return Object.values(orders).reduce((sum, entries) => sum + entries.length, 0);
}

export function Waiter() {
  const apiUrl: SubmitOrderInput['apiUrl'] = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const [alerts, setAlerts] = useState<WaiterPageState['alerts']>({});
  const [orders, setOrders] = useState<WaiterPageState['orders']>({});
  const [activeTables, setActiveTables] = useState<WaiterPageState['activeTables']>([]);
  const [selectedTable, setSelectedTable] = useState<WaiterPageState['selectedTable']>(null);
  const [loading, setLoading] = useState<WaiterPageState['loading']>(true);
  const [error, setError] = useState<WaiterPageState['error']>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);
        const data = await requestJson<WaiterDashboardResponse>(`${apiUrl}/waiter`, {
          signal: controller.signal,
        });

        const newAlerts: WaiterPageState['alerts'] = {};
        const newOrders: WaiterPageState['orders'] = {};
        const tableNumbers: WaiterPageState['activeTables'] = [];

        for (const entry of data.tables) {
          newAlerts[entry.table] = entry.alerts;
          newOrders[entry.table] = entry.orders;
          tableNumbers.push(entry.table);
        }

        setAlerts(newAlerts);
        setOrders(newOrders);
        setActiveTables(tableNumbers);
      } catch (err) {
        if (!(err instanceof Error) || err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
    return () => controller.abort();
  }, [apiUrl]);

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
