import { Metadata } from "next";
import { getCollection } from "@/lib/store";
import { notFound } from "next/navigation";
import ProductList from "../components/product-list";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: `STS Store | ${collection.seo?.title || collection.title}`,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} products`,
  };
}

export default async function ShopCategory(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;

  return <ProductList collection={params.collection} />;
}
