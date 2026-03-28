import { useEffect, useRef } from "react";
import products from "../assets/menuProducts.json";
import { toSlug, slugToProduct } from "../utils/slugs";

export function useMenuUrlSync({
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

    const hydratedCart = searchParams
      .getAll("cart")
      .map((entry) => {
        const [slug, quantityValue] = entry.split(":");
        const quantity = Number.parseInt(quantityValue, 10);
        const product = slugToProduct.get(slug);

        if (!product || Number.isNaN(quantity) || quantity <= 0) return null;

        return { ...product, quantity, excludedIngredients: [] };
      })
      .filter(Boolean);

    const hydratedSelectedIngredients = {};
    searchParams.getAll("sin").forEach((entry) => {
      const sepIdx = entry.indexOf("::");
      if (sepIdx === -1) return;

      const slug = entry.slice(0, sepIdx);
      const ingredient = entry.slice(sepIdx + 2);
      const product = slugToProduct.get(slug);

      if (product) {
        hydratedSelectedIngredients[`${product.id}::${ingredient}`] = true;
      }
    });

    hydratedCart.forEach((item) => {
      item.excludedIngredients = Object.keys(hydratedSelectedIngredients)
        .filter((key) => key.startsWith(`${item.id}::`))
        .map((key) => key.split("::")[1]);
    });

    setCart(hydratedCart);
    setSelectedIngredients(hydratedSelectedIngredients);
    hasHydrated.current = true;
  }, [searchParams, setCart, setSelectedIngredients]);

  // ── Sync state changes back to URL ─────────────────────────────────────────
  useEffect(() => {
    if (!hasHydrated.current) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("cart");
    nextParams.delete("sin");

    cart.forEach((item) => {
      if (item.quantity > 0) {
        nextParams.append("cart", `${toSlug(item.title)}:${item.quantity}`);
      }
    });

    Object.entries(selectedIngredients).forEach(([entry, isSelected]) => {
      if (!isSelected) return;

      const [productId, ingredient] = entry.split("::");
      const product = products.find((p) => p.id === productId);
      if (product) {
        nextParams.append("sin", `${toSlug(product.title)}::${ingredient}`);
      }
    });

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [cart, searchParams, selectedIngredients, setSearchParams]);
}
