import styles from './TableCard.module.css';
import type { Alert, TableCardProps, WaiterAlertConfigMap, WaiterCardVariant } from '../types';

const ALERT_CONFIG: WaiterAlertConfigMap = {
  'call-waiter': { label: 'Llamar mesero', icon: '🔔' },
  'request-bill': { label: 'Pedir cuenta', icon: '💰' },
  'clean-table': { label: 'Limpiar mesa', icon: '🧹' },
};

function resolveVariant(alerts: Alert[]): WaiterCardVariant {
  if (alerts.some((alert) => alert.type === 'clean-table')) return 'danger';
  if (alerts.some((alert) => alert.type === 'request-bill')) return 'warning';
  if (alerts.length > 0) return 'primary';
  return null;
}

function AlertBadge({ alerts }: Pick<TableCardProps, 'alerts'>) {
  const variant = resolveVariant(alerts);
  const count = alerts.length;

  return (
    <div className={`${styles.badge} ${styles[`badge--${variant}`]}`}>
      {count} alerta{count !== 1 ? 's' : ''}
    </div>
  );
}

function AlertList({ alerts }: Pick<TableCardProps, 'alerts'>) {
  return (
    <ul className={styles.alertList}>
      {alerts.map((alert) => {
        const config = ALERT_CONFIG[alert.type] ?? { label: alert.type, icon: '⚠️' };
        return (
          <li key={alert.id} className={styles.alertItem}>
            <span aria-hidden="true">{config.icon}</span>
            <span>{config.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

function OrdersRow({ count }: { count: TableCardProps['ordersCount'] }) {
  return (
    <p className={styles.ordersRow}>
      {count} orden{count !== 1 ? 'es' : ''} pendiente{count !== 1 ? 's' : ''}
    </p>
  );
}

export function TableCard({ tableNumber, alerts, ordersCount, onSelect }: TableCardProps) {
  const hasAlerts = alerts.length > 0;
  const hasOrders = ordersCount > 0;
  const variant = resolveVariant(alerts);

  return (
    <article className={`${styles.card} ${variant ? styles[`card--${variant}`] : ''}`} onClick={onSelect}>
      <h3 className={styles.tableNumber}>Mesa {tableNumber}</h3>

      {hasAlerts && (
        <>
          <AlertBadge alerts={alerts} />
          <AlertList alerts={alerts} />
        </>
      )}

      {hasOrders && <OrdersRow count={ordersCount} />}
    </article>
  );
}
