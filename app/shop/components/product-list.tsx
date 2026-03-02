import { getCollectionProducts, getCollections } from "@/lib/store";
import { ProductListContent } from "./product-list-content";
import { ProductsProvider } from "../providers/products-provider";

export default async function ProductList({
  collection,
}: {
  collection: string;
}) {
  const products = await getCollectionProducts({ collection });
  const collections = await getCollections();

  return (
    <ProductsProvider>
      <ProductListContent products={products} collections={collections} />
    </ProductsProvider>
  );
}
