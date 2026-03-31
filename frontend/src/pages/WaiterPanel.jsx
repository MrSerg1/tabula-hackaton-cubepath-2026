import { useState } from 'react';
import styles from './Waiter.module.css';

// ─── Mock Data (temporal) ───────────────────────────────────────────────

const MOCK_TABLES = Array.from({ length: 12 }, (_, i) => i + 1);

const MOCK_ALERTS = {
  2: [
    { id: '1', type: 'call-waiter', label: 'Llamar mesero' },
  ],
  5: [
    { id: '2', type: 'request-bill', label: 'Pedir cuenta' },
    { id: '3', type: 'clean-table', label: 'Limpiar mesa' },
  ],
  7: [
    { id: '4', type: 'call-waiter', label: 'Llamar mesero' },
  ],
};

const MOCK_ORDERS = {
  2: 1,
  3: 2,
  5: 3,
  7: 1,
  9: 2,
};

// ─── Sub-components ─────────────────────────────────────────────────────

function TableCard({ tableNumber, alerts, ordersCount }) {
  const hasAlerts = alerts && alerts.length > 0;
  const hasOrders = ordersCount > 0;

  let cardClass = styles.tableCard;
  if (hasAlerts && alerts.some(a => a.type === 'clean-table')) {
    cardClass = `${styles.tableCard} ${styles.alert}`;
  } else if (hasAlerts) {
    cardClass = `${styles.tableCard} ${styles.warning}`;
  }

  const getAlertBadgeClass = () => {
    if (!alerts || alerts.length === 0) return null;
    const hasCleanTable = alerts.some(a => a.type === 'clean-table');
    const hasRequestBill = alerts.some(a => a.type === 'request-bill');
    
    if (hasCleanTable) return styles.alertsBadgeDanger;
    if (hasRequestBill) return styles.alertsBadgeWarning;
    return styles.alertsBadgePrimary;
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'clean-table':
        return '🧹';
      case 'request-bill':
        return '💰';
      case 'call-waiter':
        return '🔔';
      default:
        return '⚠️';
    }
  };

  return (
    <div className={cardClass}>
      <h3 className={styles.tableName}>Mesa {tableNumber}</h3>

      {hasAlerts && (
        <>
          <div className={`${styles.alertsBadge} ${getAlertBadgeClass()}`}>
            {alerts.length} alerta{alerts.length !== 1 ? 's' : ''}
          </div>
          <div className={styles.alertsList}>
            {alerts.map((alert) => (
              <div key={alert.id} className={styles.alertItem}>
                <span className={styles.alertIcon}>{getAlertIcon(alert.type)}</span>
                <span>{alert.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {hasOrders && (
        <div className={styles.ordersCount}>
          {ordersCount} orden{ordersCount !== 1 ? 'es' : ''} pendiente{ordersCount !== 1 ? 's' : ''}
        </div>
      )}

      {!hasAlerts && !hasOrders && (
        <div className={styles.ordersCount}>
          Sin actividad
        </div>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────

export function Waiter() {
  const [tables] = useState(MOCK_TABLES);
  const [alerts] = useState(MOCK_ALERTS);
  const [orders] = useState(MOCK_ORDERS);

  const totalAlerts = Object.values(alerts).reduce((sum, arr) => sum + arr.length, 0);
  const totalOrders = Object.values(orders).reduce((sum, count) => sum + count, 0);

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

      {tables.length === 0 ? (
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>Sin mesas configuradas</h2>
          <p className={styles.emptyText}>Configura mesas para comenzar.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {tables.map((tableNumber) => (
            <TableCard
              key={tableNumber}
              tableNumber={tableNumber}
              alerts={alerts[tableNumber] || []}
              ordersCount={orders[tableNumber] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
