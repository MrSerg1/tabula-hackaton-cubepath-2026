import styles from './CartItem.module.css';
import { formatPrice } from '../utils/formatPrice';
import { useCartStore } from '../store/useCartStore';

// ─── Icons ────────────────────────────────────────────────────────────────────

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7l16 0" />
      <path d="M10 11l0 6" />
      <path d="M14 11l0 6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l14 0" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CartItem({ item }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const deleteCartItem = useCartStore((state) => state.deleteCartItem);

  const subtotal = item.price * item.quantity;
  const hasExcluded = item.excludedIngredients?.length > 0;

  return (
    <div className={styles.cartItem}>
      <div className={styles.header}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{item.title}</span>
          {item.quantity > 1 && (
            <span className={styles.badge}>x{item.quantity}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => deleteCartItem(item.cartKey)}
          className={styles.deleteButton}
          aria-label={`Eliminar ${item.title} del carrito`}
        >
          <TrashIcon />
        </button>
      </div>

      {hasExcluded && (
        <p className={styles.excluded}>
          Sin: {item.excludedIngredients.join(', ')}
        </p>
      )}

      <div className={styles.footer}>
        <span className={styles.priceInfo}>
          {formatPrice(item.price)}&nbsp;c/u&nbsp;·&nbsp;
          <strong>{formatPrice(subtotal)}</strong>
        </span>

        <div className={styles.stepper}>
          <button
            type="button"
            onClick={() => removeFromCart(item.cartKey)}
            className={styles.stepButton}
            aria-label={`Quitar una unidad de ${item.title}`}
          >
            <MinusIcon />
          </button>
          <span className={styles.stepCount} aria-live="polite" aria-atomic="true">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => addToCart(item, item.excludedIngredients)}
            className={`${styles.stepButton} ${styles.stepButtonAccent}`}
            aria-label={`Agregar otra unidad de ${item.title}`}
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
