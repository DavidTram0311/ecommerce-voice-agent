import { getProducts } from "@/lib/store/server";
import { ProductCard } from "@/app/shop/components/product-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | STS Store",
  description: "Search for products",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q;
  const products = query ? await getProducts({ query }) : [];

  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        {query ? (
          <p className="text-muted-foreground mb-8">
            {products.length} result{products.length !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>
        ) : (
          <p className="text-muted-foreground mb-8">
            Enter a search query to find products
          </p>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            No products found matching your search.
          </p>
          <p className="text-sm text-muted-foreground">
            Try different keywords or browse our collections.
          </p>
        </div>
      ) : null}
    </div>
  );
}
