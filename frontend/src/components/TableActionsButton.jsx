import { useEffect, useRef, useState } from 'react';
import styles from './TableActionsButton.module.css';

// ─── Icons ───────────────────────────────────────────────────────────────────

function BellIcon() {
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
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19.364 4.636a2 2 0 0 1 0 2.828a7 7 0 0 1 -1.414 7.072l-2.122 2.12a4 4 0 0 0 -.707 3.536l-11.313 -11.312a4 4 0 0 0 3.535 -.707l2.121 -2.123a7 7 0 0 1 7.072 -1.414a2 2 0 0 1 2.828 0" />
      <path d="M7.343 12.414l-.707 .707a3 3 0 0 0 4.243 4.243l.707 -.707" />
    </svg>
  );
}

function CleanIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7l16 0" />
      <path d="M10 11l0 6" />
      <path d="M14 11l0 6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
      <path d="M14 8h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5m2 0v1.5m0 -9v1.5" />
    </svg>
  );
}

function WaiterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 16v5" />
      <path d="M14 16v5" />
      <path d="M6 16h12v-7a6 6 0 0 0 -12 0v7z" />
      <path d="M6 10h12" />
    </svg>
  );
}

// ─── Menu options ─────────────────────────────────────────────────────────────

const MENU_ACTIONS = [
  {
    id: 'clean-table',
    label: 'Limpiar mesa',
    icon: <CleanIcon />,
    variant: 'danger',
  },
  {
    id: 'request-bill',
    label: 'Pedir cuenta',
    icon: <ReceiptIcon />,
    variant: 'default',
  },
  {
    id: 'call-waiter',
    label: 'Llamar mesero',
    icon: <WaiterIcon />,
    variant: 'default',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActionMenuItem({ icon, label, variant, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.menuItem} ${variant === 'danger' ? styles.menuItemDanger : ''}`}
    >
      <span className={styles.menuItemIcon}>{icon}</span>
      <span className={styles.menuItemLabel}>{label}</span>
    </button>
  );
}

function ActionsMenu({ onAction }) {
  return (
    <div className={styles.menu} role="menu">
      {MENU_ACTIONS.map((action) => (
        <ActionMenuItem
          key={action.id}
          icon={action.icon}
          label={action.label}
          variant={action.variant}
          onClick={() => onAction(action.id)}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TableActionsButton({ onAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const toggle = () => setIsOpen((prev) => !prev);

  const handleAction = (actionId) => {
    setIsOpen(false);
    onAction?.(actionId);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <button
        type="button"
        onClick={toggle}
        aria-label="Acciones de mesa"
        aria-expanded={isOpen}
        className={`${styles.bubble} ${isOpen ? styles.bubbleActive : ''}`}
      >
        <BellIcon />
      </button>

      {isOpen && <ActionsMenu onAction={handleAction} />}
    </div>
  );
}
