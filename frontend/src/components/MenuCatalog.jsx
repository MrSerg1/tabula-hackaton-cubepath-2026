import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sileo } from 'sileo';
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
import { requestJson } from '../utils/requestJson';

const PRODUCTS_PER_PAGE = 6;
const TABLE_ACTION_MESSAGES = {
  'clean-table': 'Le avisamos al equipo para limpiar tu mesa.',
  'request-bill': 'La cuenta va en camino.',
  'call-waiter': 'Un mesero se acercara en breve.',
};

async function sendTableAlert({ apiUrl, table, type }) {
  return requestJson(`${apiUrl}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table, type }),
  });
}

export function MenuCatalog({ currentPage = 1, onTotalPagesChange }) {
  const { mesa } = useMesa();
  const tableNumber = Number(mesa);
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

  async function handleOrder() {
    await submitOrder({ apiUrl, mesa: Number(mesa), cart });
  }

  function handleOrderSuccess() {
    clearCart();
    setSelectedIngredients({});
  }

  const handleTableAction = useCallback(
    async (actionId) => {
      if (!Number.isInteger(tableNumber) || tableNumber <= 0) {
        sileo.error({
          title: 'Mesa invalida',
          description: 'No se pudo identificar el numero de mesa.',
        });
        return;
      }

      try {
        await sendTableAlert({
          apiUrl,
          table: tableNumber,
          type: actionId,
        });

        sileo.success({
          title: 'Solicitud enviada',
          description: TABLE_ACTION_MESSAGES[actionId] ?? 'Atenderemos tu solicitud pronto.',
        });
      } catch (error) {
        sileo.error({
          title: 'No se pudo enviar la solicitud',
          description: error instanceof Error ? error.message : 'Intenta nuevamente.',
        });
      }
    },
    [apiUrl, tableNumber],
  );

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

    const controller = new AbortController();

    async function loadProducts() {
      try {
        const payload = await requestJson(menuUrl, { signal: controller.signal });

        setProducts(payload.data ?? []);
        const total = Number(payload.total ?? 0);
        const limit = Number(payload.limit ?? PRODUCTS_PER_PAGE) || PRODUCTS_PER_PAGE;
        const nextTotalPages = Math.max(1, Math.ceil(total / limit));
        if (onTotalPagesChange) {
          onTotalPagesChange(nextTotalPages);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('No se pudo cargar el menu', error);
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [menuUrl, onTotalPagesChange]);

  return (
    <section className={styles.menuShell} aria-labelledby="menu-title">
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

      <TableActionsButton onAction={handleTableAction} />
      <FloatingCartBubble itemCount={itemCount} onClick={() => setIsCartOpen(true)} />
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrder={handleOrder}
        onOrderSuccess={handleOrderSuccess}
      />
    </section>
  );
}
