"use client";

import { Cart, CartItem, Product, ProductVariant } from "@/lib/store/types";
import {
  createEmptyCart,
  addToCartLocal,
  removeFromCartLocal,
  updateCartLocal,
} from "@/lib/store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type UpdateType = "plus" | "minus" | "delete";

type CartContextType = {
  cart: Cart | null;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  clearCart: () => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "ecommerce_cart";

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise?: Promise<Cart | null>;
}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          setCart(parsed);
        } else {
          const emptyCart = createEmptyCart();
          setCart(emptyCart);
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(emptyCart));
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        const emptyCart = createEmptyCart();
        setCart(emptyCart);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart && !isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    }
  }, [cart, isLoading]);

  const updateCartItem = useCallback(
    (merchandiseId: string, updateType: UpdateType) => {
      if (!cart) return;

      let updatedCart: Cart;

      if (updateType === "delete") {
        const lineToRemove = cart.lines.find(
          (line) => line.merchandise.id === merchandiseId
        );
        if (lineToRemove?.id) {
          updatedCart = removeFromCartLocal(cart, [lineToRemove.id]);
        } else {
          return;
        }
      } else {
        const lineToUpdate = cart.lines.find(
          (line) => line.merchandise.id === merchandiseId
        );
        if (!lineToUpdate?.id) return;

        const newQuantity =
          updateType === "plus"
            ? lineToUpdate.quantity + 1
            : lineToUpdate.quantity - 1;

        if (newQuantity <= 0) {
          updatedCart = removeFromCartLocal(cart, [lineToUpdate.id]);
        } else {
          updatedCart = updateCartLocal(cart, [
            {
              id: lineToUpdate.id,
              merchandiseId: lineToUpdate.merchandise.id,
              quantity: newQuantity,
            },
          ]);
        }
      }

      setCart(updatedCart);
    },
    [cart]
  );

  const addCartItem = useCallback(
    (variant: ProductVariant, product: Product) => {
      if (!cart) return;

      const updatedCart = addToCartLocal(cart, [
        { merchandiseId: variant.id, quantity: 1 },
      ]);

      setCart(updatedCart);
    },
    [cart]
  );

  const clearCart = useCallback(() => {
    const emptyCart = createEmptyCart();
    setCart(emptyCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(emptyCart));
  }, []);

  const value = useMemo(
    () => ({
      cart,
      updateCartItem,
      addCartItem,
      clearCart,
      isLoading,
    }),
    [cart, updateCartItem, addCartItem, clearCart, isLoading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
