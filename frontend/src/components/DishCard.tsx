import styles from './MenuCatalog.module.css';
import { AddToCartButton } from './AddToCartButton';
import { formatPrice } from '../utils/formatPrice';
import type {
  CartItem,
  Ingredient,
  Product,
  ProductId,
  SelectedIngredientsMap,
  ToggleIngredient,
} from '../types';

interface IngredientTagProps {
  productId: ProductId;
  ingredient: Ingredient;
  isSelected: boolean;
  onToggle: ToggleIngredient;
}

function IngredientTag({ productId, ingredient, isSelected, onToggle }: IngredientTagProps) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => onToggle(productId, ingredient)}
        className={`${styles.ingredientTag} ${isSelected ? styles.ingredientTagSelected : ''}`}
      >
        {ingredient}
      </button>
    </li>
  );
}

interface IngredientListProps {
  productId: ProductId;
  ingredients: Ingredient[];
  selectedIngredients: SelectedIngredientsMap;
  onToggle: ToggleIngredient;
}

function IngredientList({
  productId,
  ingredients,
  selectedIngredients,
  onToggle,
}: IngredientListProps) {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return <p className={styles.footerText}>Sin ingredientes definidos</p>;
  }

  return (
    <ul className={styles.ingredientsList}>
      {ingredients.map((ingredient) => (
        <IngredientTag
          key={`${productId}::${ingredient}`}
          productId={productId}
          ingredient={ingredient}
          isSelected={Boolean(selectedIngredients[`${productId}::${ingredient}`])}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

interface CardActionsProps {
  product: Product;
  quantity: CartItem['quantity'];
  onAdd: () => void;
  onRemove: () => void;
}

function CardActions({ product, quantity, onAdd, onRemove }: CardActionsProps) {
  return (
    <div className={styles.cardActionSlot}>
      <div className={styles.actionRow}>
        <span
          className={`${styles.actionPriceTag} ${quantity > 0 ? styles.actionPriceTagExpanded : ''}`}
        >
          {formatPrice(product.price ?? 0)}
        </span>
        <AddToCartButton
          quantity={quantity}
          onAdd={onAdd}
          onRemove={onRemove}
          productTitle={product.title}
        />
      </div>
    </div>
  );
}

interface DishCardProps {
  product: Product;
  quantity: CartItem['quantity'];
  selectedIngredients: SelectedIngredientsMap;
  onToggleIngredient: ToggleIngredient;
  onAdd: () => void;
  onRemove: () => void;
}

export function DishCard({
  product,
  quantity,
  selectedIngredients,
  onToggleIngredient,
  onAdd,
  onRemove,
}: DishCardProps) {
  return (
    <article className={styles.dishCard}>
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
          <IngredientList
            productId={product.id}
            ingredients={product.ingredients}
            selectedIngredients={selectedIngredients}
            onToggle={onToggleIngredient}
          />
        </footer>
        <CardActions product={product} quantity={quantity} onAdd={onAdd} onRemove={onRemove} />
      </div>
    </article>
  );
}
