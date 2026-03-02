"use server";

import { TAGS } from "@/lib/constants";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidateTag,
} from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { defaultSort, storeCatalog } from "./constants";
import { Product } from "./types";
import { mockProducts } from "./mock/products";
import { mockCollections } from "./mock/collections";

export async function getCollections() {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");
  return mockCollections.filter(
    (c) => c.handle !== storeCatalog.rootCategoryId
  );
}

export async function getCollection(id: string) {
  "use cache";
  cacheTag(TAGS.collections, id);
  cacheLife("days");

  return (
    mockCollections
      .filter((c) => c.handle !== storeCatalog.rootCategoryId)
      .find((c) => c.handle === id) ?? null
  );
}

export async function getProduct(handle: string) {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const product = mockProducts.find((p) => p.handle === handle);

  if (!product) {
    return null;
  }

  return product;
}

export async function getCollectionProducts({
  collection: collectionHandle,
  limit = 100,
  sortKey,
}: {
  collection: string;
  limit?: number;
  sortKey?: string;
}) {
  "use cache";
  cacheTag(TAGS.products, TAGS.collections);
  cacheLife("days");

  const collection = mockCollections.find(
    (c) => c.handle === collectionHandle
  );

  if (!collection) {
    return [];
  }

  const childCategoryIds = mockCollections
    .filter((c) =>
      c.parentCategoryTree.some((parent) => parent.id === collection.handle)
    )
    .map((c) => c.handle);

  const categoryIdsToSearch = [collection.handle, ...childCategoryIds];

  let filteredProducts = mockProducts.filter(
    (p) => p.categoryId && categoryIdsToSearch.includes(p.categoryId)
  );

  if (sortKey) {
    filteredProducts = sortProducts(filteredProducts, sortKey);
  }

  const uniqueProductIds = [...new Set(filteredProducts.map((p) => p.id))];
  const uniqueProducts = uniqueProductIds
    .map((id) => filteredProducts.find((p) => p.id === id))
    .filter(
      (product): product is NonNullable<typeof product> => product != null
    );

  return uniqueProducts.slice(0, limit);
}

export async function getProducts({
  query,
  sortKey,
}: {
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}) {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  let products = mockProducts;

  if (query) {
    const lowerQuery = query.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.categoryId?.toLowerCase().includes(lowerQuery)
    );
  }

  if (sortKey) {
    products = sortProducts(products, sortKey);
  }

  return products;
}

function sortProducts(products: Product[], sortKey: string): Product[] {
  const sorted = [...products];

  switch (sortKey) {
    case "price-low-to-high":
      return sorted.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount)
      );
    case "price-high-to-low":
      return sorted.sort(
        (a, b) =>
          parseFloat(b.priceRange.maxVariantPrice.amount) -
          parseFloat(a.priceRange.maxVariantPrice.amount)
      );
    case "product-name-ascending":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "product-name-descending":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "best-matches":
    default:
      return sorted;
  }
}

export async function getProductRecommendations(productId: string) {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const product = await getProduct(productId);
  const categoryId = product?.categoryId;

  if (!categoryId) return [];

  const products = await getCollectionProducts({
    collection: categoryId,
    limit: 11,
  });

  return products.filter((product) => product.id !== productId);
}

export async function revalidate(req: NextRequest) {
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];
  const topic = req.nextUrl.searchParams.get("topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export async function getShippingMethods() {
  return [
    {
      id: "standard",
      name: "Standard Shipping",
      description: "5-7 business days",
      price: { amount: "5.00", currencyCode: "USD" },
      isDefault: true,
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "2-3 business days",
      price: { amount: "15.00", currencyCode: "USD" },
      isDefault: false,
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      description: "Next business day",
      price: { amount: "25.00", currencyCode: "USD" },
      isDefault: false,
    },
  ];
}

export async function updateCustomerInfo(email: string) {
  console.log("Update customer info:", email);
}

export async function updateShippingAddress(shippingAddress: any) {
  console.log("Update shipping address:", shippingAddress);
}

export async function updateBillingAddress(billingAddress: any) {
  console.log("Update billing address:", billingAddress);
}

export async function updateShippingMethod(shippingMethodId: string) {
  console.log("Update shipping method:", shippingMethodId);
}

export async function addPaymentMethod(paymentData: any) {
  console.log("Add payment method:", paymentData);
}

export async function placeOrder() {
  console.log("Place order");
  return undefined;
}

export async function getCheckoutOrder() {
  return undefined;
}

// Deprecated server cart operations (cart is now client-side)
export async function createCart() {
  return null;
}

export async function getCart() {
  return null;
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
) {
  return undefined;
}

export async function removeFromCart(lineIds: string[]) {
  return undefined;
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
) {
  return undefined;
}
