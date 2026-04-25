import { useState } from 'react';
import type { SelectedIngredientsMap, ToggleIngredient, UseSelectedIngredientsResult } from '../types';

export function useSelectedIngredients(
  initial: SelectedIngredientsMap = {},
): UseSelectedIngredientsResult {
  const [selectedIngredients, setSelectedIngredients] = useState(initial);

  const toggleIngredient: ToggleIngredient = (productId, ingredient) => {
    const ingredientId = `${productId}::${ingredient}`;

    setSelectedIngredients((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  return { selectedIngredients, setSelectedIngredients, toggleIngredient };
}
