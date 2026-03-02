// Client-side cart utilities
import { Cart, CartItem } from "./types";
import { mockProducts } from "./mock/products";
import { v4 as uuidv4 } from 'uuid';

// Re-export server functions for convenience
export * from "./server";

export function createEmptyCart(): Cart {
  return {
    id: uuidv4(),
    checkoutUrl: "/checkout",
    lines: [],
    totalQuantity: 0,
    cost: {
      subtotalAmount: { amount: "0.00", currencyCode: "USD" },
      totalAmount: { amount: "0.00", currencyCode: "USD" },
      totalTaxAmount: { amount: "0.00", currencyCode: "USD" },
    },
  };
}

export function addToCartLocal(
  cart: Cart,
  lines: { merchandiseId: string; quantity: number }[]
): Cart {
  const newLines = [...cart.lines];

  lines.forEach(({ merchandiseId, quantity }) => {
    const product = mockProducts.find((p) =>
      p.variants.some((v) => v.id === merchandiseId)
    );

    if (!product) return;

    const variant = product.variants.find((v) => v.id === merchandiseId);
    if (!variant) return;

    const existingLine = newLines.find(
      (l) => l.merchandise.id === merchandiseId
    );

    if (existingLine) {
      existingLine.quantity += quantity;
      existingLine.cost.totalAmount.amount = (
        parseFloat(variant.price.amount) * existingLine.quantity
      ).toFixed(2);
    } else {
      newLines.push({
        id: uuidv4(),
        quantity,
        cost: {
          totalAmount: {
            amount: (parseFloat(variant.price.amount) * quantity).toFixed(2),
            currencyCode: "USD",
          },
        },
        merchandise: {
          id: merchandiseId,
          title: variant.title,
          selectedOptions: variant.selectedOptions,
          product: {
            id: product.id,
            handle: product.handle,
            title: product.title,
            images: product.images,
            featuredImage: product.featuredImage,
          },
        },
      });
    }
  });

  return recalculateCart({ ...cart, lines: newLines });
}

export function removeFromCartLocal(cart: Cart, lineIds: string[]): Cart {
  const newLines = cart.lines.filter((line) => !lineIds.includes(line.id!));
  return recalculateCart({ ...cart, lines: newLines });
}

export function updateCartLocal(
  cart: Cart,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Cart {
  const newLines = cart.lines.map((line) => {
    const update = lines.find((l) => l.id === line.id);
    if (update) {
      const product = mockProducts.find((p) =>
        p.variants.some((v) => v.id === update.merchandiseId)
      );
      const variant = product?.variants.find(
        (v) => v.id === update.merchandiseId
      );

      if (variant) {
        return {
          ...line,
          quantity: update.quantity,
          cost: {
            totalAmount: {
              amount: (
                parseFloat(variant.price.amount) * update.quantity
              ).toFixed(2),
              currencyCode: "USD",
            },
          },
        };
      }
    }
    return line;
  });

  return recalculateCart({ ...cart, lines: newLines });
}

function recalculateCart(cart: Cart): Cart {
  const subtotal = cart.lines.reduce(
    (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
    0
  );
  const tax = subtotal * 0.0;
  const total = subtotal + tax;

  return {
    ...cart,
    totalQuantity: cart.lines.reduce((sum, line) => sum + line.quantity, 0),
    cost: {
      subtotalAmount: {
        amount: subtotal.toFixed(2),
        currencyCode: "USD",
      },
      totalAmount: {
        amount: total.toFixed(2),
        currencyCode: "USD",
      },
      totalTaxAmount: {
        amount: tax.toFixed(2),
        currencyCode: "USD",
      },
    },
  };
}
