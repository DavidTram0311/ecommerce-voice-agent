"use server";

import { TAGS } from "@/lib/constants";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

// Cart operations are now handled client-side with localStorage
// These server actions are simplified/stubbed

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  // Cart operations now handled client-side
  revalidateTag(TAGS.cart);
  return undefined;
}

export async function removeItem(prevState: any, merchandiseId: string) {
  // Cart operations now handled client-side
  revalidateTag(TAGS.cart);
  return undefined;
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  // Cart operations now handled client-side
  revalidateTag(TAGS.cart);
  return undefined;
}

export async function redirectToCheckout() {
  redirect("/checkout");
}

export async function createCartAndSetCookie() {
  // Cart is now created and managed client-side
  return undefined;
}
