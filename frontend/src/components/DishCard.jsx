import styles from './MenuCatalog.module.css';
import { AddToCartButton } from './AddToCartButton';
import { formatPrice } from '../utils/formatPrice';

// ─── Sub-components ───────────────────────────────────────────────────────────

function IngredientTag({ productId, ingredient, isSelected, onToggle }) {
  const ingredientId = `${productId}::${ingredient}`;

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

function IngredientList({ productId, ingredients, selectedIngredients, onToggle }) {
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

function CardActions({ product, quantity, onAdd, onRemove }) {
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

// ─── Main component ───────────────────────────────────────────────────────────

export function DishCard({
  product,
  quantity,
  selectedIngredients,
  onToggleIngredient,
  onAdd,
  onRemove,
}) {
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
        <CardActions
          product={product}
          quantity={quantity}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </div>
    </article>
  );
}
