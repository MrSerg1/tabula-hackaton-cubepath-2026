import { AnimatePresence, motion } from 'framer-motion';
import styles from './TableDetailSheet.module.css';
import { formatPrice } from '../utils/formatPrice';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sumItems(items) {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ExclusionNote({ ingredients }) {
  if (!ingredients?.length) return null;
  return (
    <p className={styles.exclusionNote}>
      Sin: {ingredients.join(', ')}
    </p>
  );
}

function TicketItem({ item }) {
  return (
    <li className={styles.ticketItem}>
      <div className={styles.ticketItemRow}>
        <span className={styles.quantity}>{item.quantity}×</span>
        <span className={styles.itemName}>{item.title}</span>
        <span className={styles.itemPrice}>
          {formatPrice(item.price * item.quantity)}
        </span>
      </div>
      <ExclusionNote ingredients={item.excludedIngredients} />
    </li>
  );
}

function OrderTicket({ order, index }) {
  const total = sumItems(order.items);

  return (
    <article className={styles.ticket}>
      <header className={styles.ticketHeader}>
        <span className={styles.ticketIndex}>Orden #{index + 1}</span>
        <span className={styles.ticketTime}>{formatTime(order.createdAt)}</span>
      </header>

      <ul className={styles.ticketList}>
        {order.items.map((item) => (
          <TicketItem key={item.id} item={item} />
        ))}
      </ul>

      <footer className={styles.ticketFooter}>
        <span>Total</span>
        <span className={styles.ticketTotal}>{formatPrice(total)}</span>
      </footer>
    </article>
  );
}

// ─── Animation variants ───────────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sheetVariants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } },
  exit: { y: '100%', transition: { duration: 0.22 } },
};

// ─── TableDetailSheet ─────────────────────────────────────────────────────────

export function TableDetailSheet({ tableNumber, orders, onClose }) {
  const isOpen = tableNumber !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div
            className={styles.backdrop}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            className={styles.sheet}
            variants={sheetVariants}
            role="dialog"
            aria-modal="true"
            aria-label={`Órdenes de la mesa ${tableNumber}`}
          >
            <div className={styles.handle} />

            <header className={styles.header}>
              <div className={styles.headerInfo}>
                <h2 className={styles.title}>Mesa {tableNumber}</h2>
                <span className={styles.count}>
                  {orders.length} orden{orders.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Cerrar"
              >
                <CloseIcon />
              </button>
            </header>

            <div className={styles.body}>
              {orders.map((order, index) => (
                <OrderTicket key={order.id} order={order} index={index} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
