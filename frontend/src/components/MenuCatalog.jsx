import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './MenuCatalog.module.css';
import products from '../assets/menuProducts.json';
import { FloatingCartBubble } from './FloatingCartBubble';
import { TableActionsButton } from './TableActionsButton';
import { DishCard } from './DishCard';
import { CartSheet } from './CartSheet';
import { useCartStore, cartItemKey } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useSelectedIngredients } from '../hooks/useSelectedIngredients';
import { useMenuUrlSync } from '../hooks/useMenuUrlSync';

export function MenuCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const submitOrder = useOrderStore((state) => state.submitOrder);
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
        <h1 id="menu-title">Tabula Food</h1>
        <p className={styles.menuSubtitle}>
          Menú prototipo para <strong>demostración</strong>.
        </p>
      </div>

      <div className={styles.menuGrid}>
        {products.map((product) => {
          const excluded = (product.ingredients ?? []).filter(
            (ing) => selectedIngredients[`${product.id}::${ing}`],
          );
          const key = cartItemKey(product.id, excluded);
          const quantity = cart.find((item) => item.cartKey === key)?.quantity ?? 0;

          return (
            <DishCard
              key={product.id}
              product={product}
              quantity={quantity}
              selectedIngredients={selectedIngredients}
              onToggleIngredient={toggleIngredient}
              onAdd={() => addToCart(product, excluded)}
              onRemove={() => removeFromCart(key)}
            />
          );
        })}
      </div>

      <TableActionsButton onAction={(actionId) => console.log('Mesa:', actionId)} />
      <FloatingCartBubble itemCount={itemCount} onClick={() => setIsCartOpen(true)} />
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrder={() => {
          submitOrder(cart);
          clearCart();
          setSelectedIngredients({});
          setIsCartOpen(false);
        }}
      />
    </section>
  );
}
