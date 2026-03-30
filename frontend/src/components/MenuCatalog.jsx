import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './MenuCatalog.module.css';
import { FloatingCartBubble } from './FloatingCartBubble';
import { TableActionsButton } from './TableActionsButton';
import { DishCard } from './DishCard';
import { CartSheet } from './CartSheet';
import { useCartStore, cartItemKey } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useSelectedIngredients } from '../hooks/useSelectedIngredients';
import { useMenuUrlSync } from '../hooks/useMenuUrlSync';
import { useMesa } from '../context/MesaContext';

const PRODUCTS_PER_PAGE = 6;

export function MenuCatalog({ currentPage = 1, onTotalPagesChange }) {
  const { mesa } = useMesa();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const offset = Math.max(0, (currentPage - 1) * PRODUCTS_PER_PAGE);
  const menuUrl = useMemo(() => {
    if (!mesa) return null;

    const url = new URL('/menu', apiUrl);
    url.searchParams.set('mesa', String(mesa));
    url.searchParams.set('limit', String(PRODUCTS_PER_PAGE));
    url.searchParams.set('offset', String(offset));
    return url.toString();
  }, [apiUrl, mesa, offset]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);

  //Todo: refactor this, it's a bit too much to put in a single hook, but for demo purposes it's fine.
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
  // ── Load products from backend with pagination ───────────────────────────
  useEffect(() => {
    if (!menuUrl) return;

    let isMounted = true;

    async function loadProducts() {
      try {
        const response = await fetch(menuUrl);

        if (!response.ok) {
          throw new Error(`Error al obtener el menu: ${response.status}`);
        }

        const product1 = await response.json();

        if (isMounted) {
          setProducts(product1.data ?? []);
          const total = Number(product1.total ?? 0);
          const limit = Number(product1.limit ?? PRODUCTS_PER_PAGE) || PRODUCTS_PER_PAGE;
          const nextTotalPages = Math.max(1, Math.ceil(total / limit));
          if (onTotalPagesChange) {
            onTotalPagesChange(nextTotalPages);
          }
        }
      } catch (error) {
        console.error('No se pudo cargar el menu', error);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [menuUrl, onTotalPagesChange]);

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
