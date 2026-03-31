import styles from './TableCard.module.css';

// Maps each backend type to its display config.
// Add new types here as the backend grows.
const ALERT_CONFIG = {
  'call-waiter':  { label: 'Llamar mesero', icon: '🔔' },
  'request-bill': { label: 'Pedir cuenta',  icon: '💰' },
  'clean-table':  { label: 'Limpiar mesa',  icon: '🧹' },
};

// Priority order: clean-table is most urgent → red, request-bill → yellow, rest → orange
function resolveVariant(alerts) {
  if (alerts.some(a => a.type === 'clean-table'))  return 'danger';
  if (alerts.some(a => a.type === 'request-bill')) return 'warning';
  if (alerts.length > 0)                           return 'primary';
  return null;
}

// ─── Private sub-components ──────────────────────────────────────────────────

function AlertBadge({ alerts }) {
  const variant  = resolveVariant(alerts);
  const count    = alerts.length;

  return (
    <div className={`${styles.badge} ${styles[`badge--${variant}`]}`}>
      {count} alerta{count !== 1 ? 's' : ''}
    </div>
  );
}

function AlertList({ alerts }) {
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

function OrdersRow({ count }) {
  return (
    <p className={styles.ordersRow}>
      {count} orden{count !== 1 ? 'es' : ''} pendiente{count !== 1 ? 's' : ''}
    </p>
  );
}

// ─── TableCard ───────────────────────────────────────────────────────────────

export function TableCard({ tableNumber, alerts, ordersCount }) {
  const hasAlerts = alerts.length > 0;
  const hasOrders = ordersCount > 0;
  const variant   = resolveVariant(alerts);

  return (
    <article
      className={`${styles.card} ${variant ? styles[`card--${variant}`] : ''}`}
    >
      <h3 className={styles.tableNumber}>Mesa {tableNumber}</h3>

      {hasAlerts && (
        <>
          <AlertBadge alerts={alerts} />
          <AlertList  alerts={alerts} />
        </>
      )}

      {hasOrders && <OrdersRow count={ordersCount} />}
    </article>
  );
}
