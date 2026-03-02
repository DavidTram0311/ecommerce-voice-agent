import { storeCatalog } from "@/lib/store/constants";
import ProductList from "./components/product-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "STS Store | Shop",
  description: "STS Store, your one-stop shop for all your needs.",
};

export default async function Shop() {
  return <ProductList collection={storeCatalog.rootCategoryId} />;
}
