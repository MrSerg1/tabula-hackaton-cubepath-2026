import { useEffect, useRef } from 'react';
import { requestJson } from '../utils/requestJson';

const CART_ITEM_PARAM = 'item';
const LEGACY_CART_PARAM = 'cart';
const SELECTED_INGREDIENT_PARAM = 'sin';

function normalizeIngredients(ingredients) {
  if (!Array.isArray(ingredients)) return [];

  return [...new Set(
    ingredients
      .filter((ingredient) => typeof ingredient === 'string')
      .map((ingredient) => ingredient.trim())
      .filter(Boolean),
  )].sort();
}

function parseSerializedCartItems(searchParams) {
  return searchParams
    .getAll(CART_ITEM_PARAM)
    .map((entry) => {
      try {
        const parsed = JSON.parse(entry);
        const id = typeof parsed?.id === 'string' ? parsed.id.trim() : '';
        const quantity = Number.parseInt(String(parsed?.q ?? ''), 10);
        const excludedIngredients = normalizeIngredients(parsed?.x);

        if (!id || !Number.isInteger(quantity) || quantity <= 0) {
          return null;
        }

        return { id, quantity, excludedIngredients };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function parseLegacyCartFromParams(searchParams) {
  return searchParams
    .getAll(LEGACY_CART_PARAM)
    .map((entry) => {
      const separatorIndex = entry.lastIndexOf(':');
      if (separatorIndex === -1) return null;

      const id = entry.slice(0, separatorIndex).trim();
      const quantity = Number.parseInt(entry.slice(separatorIndex + 1), 10);

      if (!id || !Number.isInteger(quantity) || quantity <= 0) {
        return null;
      }

      return { id, quantity };
    })
    .filter(Boolean);
}

function serializeCartItem(item) {
  return JSON.stringify({
    id: item.id,
    q: item.quantity,
    x: normalizeIngredients(item.excludedIngredients ?? []),
  });
}

function parseSelectedIngredientsFromParams(searchParams) {
  const selectedIngredients = {};

  searchParams.getAll(SELECTED_INGREDIENT_PARAM).forEach((entry) => {
    const separatorIndex = entry.indexOf('::');
    if (separatorIndex === -1) return;

    const productId = entry.slice(0, separatorIndex).trim();
    const ingredient = entry.slice(separatorIndex + 2).trim();

    if (!productId || !ingredient) return;

    selectedIngredients[`${productId}::${ingredient}`] = true;
  });

  return selectedIngredients;
}

function buildExcludedByProductId(selectedIngredients) {
  const excludedByProductId = {};

  Object.entries(selectedIngredients).forEach(([entry, isSelected]) => {
    if (!isSelected) return;

    const separatorIndex = entry.indexOf('::');
    if (separatorIndex === -1) return;

    const productId = entry.slice(0, separatorIndex);
    const ingredient = entry.slice(separatorIndex + 2);

    if (!excludedByProductId[productId]) {
      excludedByProductId[productId] = [];
    }

    excludedByProductId[productId].push(ingredient);
  });

  return excludedByProductId;
}

export function useMenuUrlSync({
  apiUrl,
  mesa,
  searchParams,
  setSearchParams,
  cart,
  setCart,
  selectedIngredients,
  setSelectedIngredients,
}) {
  const hasHydrated = useRef(false);

  // ── Hydrate state from URL on first render ─────────────────────────────────
  useEffect(() => {
    if (hasHydrated.current) return;
    if (!mesa) return;

    const controller = new AbortController();

    async function hydrateFromUrl() {
      const selectedIngredientsFromUrl = parseSelectedIngredientsFromParams(searchParams);
      const hasSerializedCartItems = searchParams.has(CART_ITEM_PARAM);
      const cartFromUrl = hasSerializedCartItems
        ? parseSerializedCartItems(searchParams)
        : parseLegacyCartFromParams(searchParams);

      if (cartFromUrl.length === 0) {
        setCart([]);
        setSelectedIngredients(selectedIngredientsFromUrl);
        hasHydrated.current = true;
        return;
      }

      const uniqueProductIds = [...new Set(cartFromUrl.map((item) => item.id))];
      const productsById = new Map();

      await Promise.all(
        uniqueProductIds.map(async (productId) => {
          try {
            const url = new URL(`/menu/${productId}`, apiUrl);
            url.searchParams.set('mesa', String(mesa));

            const payload = await requestJson(url.toString(), { signal: controller.signal });
            if (payload?.data?.id) {
              productsById.set(payload.data.id, payload.data);
            }
          } catch (error) {
            if (!(error instanceof Error && error.name === 'AbortError')) {
              console.warn(`No se pudo hidratar el producto ${productId} desde la URL.`, error);
            }
          }
        }),
      );

      const excludedByProductId = hasSerializedCartItems
        ? null
        : buildExcludedByProductId(selectedIngredientsFromUrl);

      const hydratedCart = cartFromUrl
        .map((item) => {
          const { id, quantity } = item;
          const product = productsById.get(id);
          if (!product) return null;

          return {
            ...product,
            quantity,
            excludedIngredients: hasSerializedCartItems
              ? item.excludedIngredients
              : (excludedByProductId?.[id] ?? []),
          };
        })
        .filter(Boolean);

      setCart(hydratedCart);
      setSelectedIngredients(selectedIngredientsFromUrl);
      hasHydrated.current = true;
    }

    hydrateFromUrl();

    return () => {
      controller.abort();
    };
  }, [apiUrl, mesa, searchParams, setCart, setSelectedIngredients]);

  // ── Sync state changes back to URL ─────────────────────────────────────────
  useEffect(() => {
    if (!hasHydrated.current) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(CART_ITEM_PARAM);
    nextParams.delete(LEGACY_CART_PARAM);
    nextParams.delete(SELECTED_INGREDIENT_PARAM);

    cart.forEach((item) => {
      if (item.quantity > 0 && item.id) {
        // Keep quantity and exclusions coupled per entry to avoid variant ambiguity.
        nextParams.append(CART_ITEM_PARAM, serializeCartItem(item));
      }
    });

    Object.entries(selectedIngredients).forEach(([entry, isSelected]) => {
      if (!isSelected) return;
      nextParams.append(SELECTED_INGREDIENT_PARAM, entry);
    });

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [cart, searchParams, selectedIngredients, setSearchParams]);
}
