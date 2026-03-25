import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './MenuCatalog.module.css';
import products from '../assets/menuProducts.json';
import { FloatingCartBubble } from './FloatingCartBubble';
import { useCartStore } from '../store/useCartStore';
import { AddToCartButton } from './AddToCartButton';

export function MenuCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const itemCount = useCartStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0),
  );
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const hasHydratedFromUrl = useRef(false);

  useEffect(() => {
    if (hasHydratedFromUrl.current) {
      return;
    }

    const hydratedCart = searchParams
      .getAll('cart')
      .map((entry) => {
        const [productId, quantityValue] = entry.split(':');
        const quantity = Number.parseInt(quantityValue, 10);
        const product = products.find((item) => item.id === productId);

        if (!product || Number.isNaN(quantity) || quantity <= 0) {
          return null;
        }

        return { ...product, quantity };
      })
      .filter(Boolean);

    const hydratedSelectedIngredients = {};
    searchParams.getAll('ing').forEach((entry) => {
      if (entry.includes('::')) {
        hydratedSelectedIngredients[entry] = true;
      }
    });

    setCart(hydratedCart);
    setSelectedIngredients(hydratedSelectedIngredients);
    hasHydratedFromUrl.current = true;
  }, [searchParams, setCart]);

  useEffect(() => {
    if (!hasHydratedFromUrl.current) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('cart');
    nextParams.delete('ing');

    cart.forEach((item) => {
      if (item.quantity > 0) {
        nextParams.append('cart', `${item.id}:${item.quantity}`);
      }
    });

    Object.entries(selectedIngredients).forEach(([entry, isSelected]) => {
      if (isSelected) {
        nextParams.append('ing', entry);
      }
    });

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [cart, searchParams, selectedIngredients, setSearchParams]);

  const toggleIngredient = (productId, ingredient) => {
    const ingredientId = `${productId}::${ingredient}`;

    setSelectedIngredients((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(value);

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

          return (
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
                      {product.ingredients.map((ingredient) => {
                        const ingredientId = `${product.id}::${ingredient}`;
                        const isSelected = Boolean(selectedIngredients[ingredientId]);

                        return (
                          <li key={ingredientId}>
                            <button
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => toggleIngredient(product.id, ingredient)}
                              className={`${styles.ingredientTag} ${isSelected ? styles.ingredientTagSelected : ''}`}
                            >
                              {ingredient}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className={styles.footerText}>Sin ingredientes definidos</p>
                  )}
                </footer>

                <div className={styles.cardActionSlot}>
                  <div className={styles.actionRow}>
                    <span
                      className={`${styles.actionPriceTag} ${quantity > 0 ? styles.actionPriceTagExpanded : ''}`}
                    >
                      {formatPrice(product.price ?? 0)}
                    </span>
                    <AddToCartButton
                      quantity={quantity}
                      onAdd={() => addToCart(product)}
                      onRemove={() => removeFromCart(product.id)}
                      productTitle={product.title}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <FloatingCartBubble itemCount={itemCount} />
    </section>
  );
}
