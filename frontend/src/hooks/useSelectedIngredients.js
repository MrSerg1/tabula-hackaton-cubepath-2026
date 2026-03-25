import { useState } from 'react';

export function useSelectedIngredients(initial = {}) {
  const [selectedIngredients, setSelectedIngredients] = useState(initial);

  const toggleIngredient = (productId, ingredient) => {
    const ingredientId = `${productId}::${ingredient}`;

    setSelectedIngredients((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  return { selectedIngredients, setSelectedIngredients, toggleIngredient };
}
