import styles from './MenuCatalog.module.css';
import products from '../assets/menuProducts.json';
import { FloatingCartBubble } from './FloatingCartBubble';
import { useCartStore } from '../store/useCartStore';
import { AddToCartButton } from './AddToCartButton';

export function MenuCatalog() {
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const cart = useCartStore((state) => state.cart);
  const itemCount = useCartStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <section className={styles.menuShell} aria-labelledby="menu-title">
      <div className={styles.menuHead}>
        <p className={styles.eyebrow}>Menú del día</p>
        <h1 id="menu-title">Comidas que abren el apetito</h1>
        <p className={styles.menuSubtitle}>
          Agrega o reemplaza productos editando el archivo JSON y cambiando la ruta de la imagen.
        </p>
      </div>

      <div className={styles.menuGrid}>
        {products.map((product) => (
          <article className={styles.dishCard} key={product.id}>
            <div className={styles.dishMediaWrap}>
              <img
                className={styles.dishMedia}
                src={product.image}
                alt={product.title}
                loading="lazy"
              />
            </div>
            <div className={styles.dishBody}>
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <footer className={styles.dishFooter}>
                {Array.isArray(product.ingredients) && product.ingredients.length > 0 ? (
                  <ul className={styles.ingredientsList}>
                    {product.ingredients.map((ingredient) => (
                      <li className={styles.ingredientTag} key={`${product.id}-${ingredient}`}>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.footerText}>Sin ingredientes definidos</p>
                )}
              </footer>

              <div className={styles.cardActionSlot}>
                <AddToCartButton
                  quantity={cart.find((item) => item.id === product.id)?.quantity ?? 0}
                  onAdd={() => addToCart(product)}
                  onRemove={() => removeFromCart(product.id)}
                  productTitle={product.title}
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      <FloatingCartBubble itemCount={itemCount} />
    </section>
  );
}
