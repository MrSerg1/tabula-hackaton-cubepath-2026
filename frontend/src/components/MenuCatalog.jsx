import { useSearchParams } from 'react-router-dom';
import styles from './MenuCatalog.module.css';
import products from '../assets/menuProducts.json';
import { FloatingCartBubble } from './FloatingCartBubble';
import { TableActionsButton } from './TableActionsButton';
import { DishCard } from './DishCard';
import { useCartStore } from '../store/useCartStore';
import { useSelectedIngredients } from '../hooks/useSelectedIngredients';
import { useMenuUrlSync } from '../hooks/useMenuUrlSync';

export function MenuCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const itemCount = useCartStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0),
  );

  const { selectedIngredients, setSelectedIngredients, toggleIngredient } =
    useSelectedIngredients();

  useMenuUrlSync({
    searchParams,
    setSearchParams,
    cart,
    setCart,
    selectedIngredients,
    setSelectedIngredients,
  });

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
        {products.map((product) => {
          const quantity = cart.find((item) => item.id === product.id)?.quantity ?? 0;
          const excluded = (product.ingredients ?? []).filter(
            (ing) => selectedIngredients[`${product.id}::${ing}`],
          );

          return (
            <DishCard
              key={product.id}
              product={product}
              quantity={quantity}
              selectedIngredients={selectedIngredients}
              onToggleIngredient={toggleIngredient}
              onAdd={() => addToCart(product, excluded)}
              onRemove={() => removeFromCart(product.id)}
            />
          );
        })}
      </div>

      <TableActionsButton onAction={(actionId) => console.log('Mesa:', actionId)} />
      <FloatingCartBubble itemCount={itemCount} />
    </section>
  );
}
