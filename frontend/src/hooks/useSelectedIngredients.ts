import { useState } from 'react';
import type { SelectedIngredientsMap, UseSelectedIngredientsResult } from '../types';

export function useSelectedIngredients(
  initial: SelectedIngredientsMap = {},
): UseSelectedIngredientsResult {
  const [selectedIngredients, setSelectedIngredients] = useState(initial);

  const toggleIngredient = (productId: string, ingredient: string): void => {
    const ingredientId = `${productId}::${ingredient}`;

    setSelectedIngredients((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  return { selectedIngredients, setSelectedIngredients, toggleIngredient };
}
