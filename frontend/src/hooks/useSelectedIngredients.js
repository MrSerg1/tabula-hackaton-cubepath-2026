import { useState } from 'react';

/**
 * @typedef {import('../types').SelectedIngredientsMap} SelectedIngredientsMap
 * @typedef {import('../types').UseSelectedIngredientsResult} UseSelectedIngredientsResult
 */

/**
 * @param {SelectedIngredientsMap} [initial]
 * @returns {UseSelectedIngredientsResult}
 */
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
