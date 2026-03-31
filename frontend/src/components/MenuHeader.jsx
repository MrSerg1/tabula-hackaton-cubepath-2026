import styles from './MenuHeader.module.css';

export function MenuHeader() {
  return (
    <header className={styles.menuHead}>
      <p className={styles.eyebrow}>Menú del día</p>
      <h1 id="menu-title" className={styles.title}>Tabula Food</h1>
      <p className={styles.menuSubtitle}>Menú prototipo para <strong>demostración.</strong></p>
    </header>
  );
}