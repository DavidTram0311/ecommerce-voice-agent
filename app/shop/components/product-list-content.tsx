"use client";

import { useEffect, useMemo } from "react";
import { Product, Collection } from "@/lib/store/types";
import { useProducts } from "../providers/products-provider";
import { ProductCard } from "./product-card";
import { Suspense } from "react";
import ResultsControls from "./results-controls";
import { useQueryState, parseAsString } from "nuqs";

interface ProductListContentProps {
  products: Product[];
  collections: Pick<Collection, "handle" | "title">[];
}

export function ProductListContent({
  products,
  collections,
}: ProductListContentProps) {
  const { setProducts } = useProducts();
  const [searchQuery] = useQueryState("q", parseAsString);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.categoryId?.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery]);

  // Set products in the provider whenever they change
  useEffect(() => {
    setProducts(filteredProducts);
  }, [filteredProducts, setProducts]);

  return (
    <>
      <Suspense>
        <ResultsControls
          className="max-md:hidden"
          collections={collections}
          products={filteredProducts}
        />
      </Suspense>
      {searchQuery && (
        <div className="px-sides py-4 text-sm text-foreground/70">
          Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for "{searchQuery}"
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
