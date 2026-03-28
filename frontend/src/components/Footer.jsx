import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>Tabula Food</p>
      <small className={styles.copy}>Gracias por tu visita</small>
    </footer>
  );
}