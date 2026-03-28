import styles from './Home.module.css';

export function Home() {
  return (
    <main className={styles.homeShell}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Tabula Food</p>
        <h1 className={styles.title}>Mesa lista, menu listo</h1>
        <p className={styles.subtitle}>
          Entra directo al menu digital y empieza a pedir en segundos.
        </p>
        <a className={styles.cta} href="https://stejondev.com/menu?mesa=1">
          Ir al menu -&gt;
        </a>
      </section>
    </main>
  );
}
