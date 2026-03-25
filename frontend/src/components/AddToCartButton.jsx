import { AnimatePresence, motion } from 'framer-motion';
import styles from './AddToCartButton.module.css';

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5l0 14" />
      <path d="M5 12l14 0" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l14 0" />
    </svg>
  );
}

export function AddToCartButton({ quantity, onAdd, onRemove, productTitle }) {
  return (
    <div className={styles.shell}>
      <AnimatePresence mode="wait" initial={false}>
        {quantity === 0 ? (
          <motion.div
            key="add"
            initial={{ scale: 0.84, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.84, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={styles.actionWrap}
          >
            <button
              type="button"
              onClick={onAdd}
              className={styles.addButton}
              aria-label={`Agregar ${productTitle} al carrito`}
            >
              <PlusIcon />
              <span className={styles.addHint} aria-hidden="true">
                Pedir
              </span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="quantity"
            initial={{ width: 42, opacity: 0 }}
            animate={{ width: 126, opacity: 1 }}
            exit={{ width: 42, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={styles.quantityControl}
          >
            <button
              type="button"
              onClick={onRemove}
              className={styles.stepButton}
              aria-label={`Quitar una unidad de ${productTitle}`}
            >
              <MinusIcon />
            </button>

            <span className={styles.quantityValue} aria-live="polite" aria-atomic="true">
              {quantity}
            </span>

            <button
              type="button"
              onClick={onAdd}
              className={`${styles.stepButton} ${styles.stepButtonAccent}`}
              aria-label={`Agregar otra unidad de ${productTitle}`}
            >
              <PlusIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
