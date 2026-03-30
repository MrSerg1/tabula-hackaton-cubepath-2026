import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './CartSheet.module.css';
import { CartItem } from './CartItem';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../utils/formatPrice';

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

function EmptyCartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="52"
      height="52"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 11h16a1 1 0 0 1 1 1v.5c0 1.5 -2.517 5.573 -4 6.5v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1c-1.687 -1.054 -4 -5 -4 -6.5v-.5a1 1 0 0 1 1 -1" />
      <path d="M12 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
      <path d="M16 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
      <path d="M8 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>
        <EmptyCartIcon />
      </span>
      <p className={styles.emptyTitle}>Tu carrito está vacío</p>
      <p className={styles.emptyHint}>Agrega productos desde el menú</p>
    </div>
  );
}

function CartFooter({ total, onOrder, orderStatus }) {
  const isLoading = orderStatus === 'loading';
  const isSuccess = orderStatus === 'success';
  const isError = orderStatus === 'error';

  const buttonClass = [
    styles.orderButton,
    isLoading && styles.orderButtonLoading,
    isSuccess && styles.orderButtonSuccess,
    isError && styles.orderButtonError,
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.footer}>
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>{formatPrice(total)}</span>
      </div>
      <button
        type="button"
        onClick={onOrder}
        className={buttonClass}
        disabled={isLoading || isSuccess}
        aria-live="polite"
      >
        {isLoading && (
          <>
            <span className={styles.skChase} aria-hidden="true">
              <span className={styles.skChaseDot} />
              <span className={styles.skChaseDot} />
              <span className={styles.skChaseDot} />
              <span className={styles.skChaseDot} />
              <span className={styles.skChaseDot} />
              <span className={styles.skChaseDot} />
            </span>
            Enviando…
          </>
        )}
        {isSuccess && (
          <>
            <CheckIcon />
            ¡Orden enviada!
          </>
        )}
        {isError && 'Error · Reintentar'}
        {!isLoading && !isSuccess && !isError && 'Pedir a cocina'}
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CartSheet({ isOpen, onClose, onOrder }) {
  const cart = useCartStore((state) => state.cart);
  const [orderStatus, setOrderStatus] = useState('idle');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = cart.length === 0;

  useEffect(() => {
    if (!isOpen) setOrderStatus('idle');
  }, [isOpen]);

  async function handleOrder() {
    setOrderStatus('loading');
    try {
      await onOrder();
      setOrderStatus('success');
      setTimeout(onClose, 1500);
    } catch {
      setOrderStatus('error');
      setTimeout(() => setOrderStatus('idle'), 2000);
    }
  }

  // Lock body scroll while sheet is open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Tu pedido"
        >
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          <motion.div
            className={styles.sheet}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 38 }}
          >
            <div className={styles.handle} aria-hidden="true" />

            <div className={styles.header}>
              <h2 className={styles.title}>Tu pedido</h2>
              <button
                type="button"
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Cerrar carrito"
              >
                <CloseIcon />
              </button>
            </div>

            <div className={styles.itemsList}>
              {isEmpty ? (
                <EmptyState />
              ) : (
                cart.map((item) => <CartItem key={item.cartKey} item={item} />)
              )}
            </div>

            {!isEmpty && <CartFooter total={total} onOrder={handleOrder} orderStatus={orderStatus} />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
