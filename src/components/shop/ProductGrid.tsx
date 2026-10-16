import type { Product } from "../../data/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  compact,
}: {
  products: Product[];
  compact?: boolean;
}) {
  return (
    <div className="productGrid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} compact={compact} />
      ))}
    </div>
  );
}
