"use client";

import { ArrowRight, TriangleAlert, PlusCircleIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { CartItemCard } from "./cart-item";
import { formatPrice } from "@/lib/store/utils";
import Link from "next/link";

const CartItems = ({ closeCart }: { closeCart: () => void }) => {
  const { cart, updateCartItem } = useCart();

  if (!cart) return <></>;

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden">
      <div className="flex justify-between text-sm text-muted-foreground px-2">
        <span>Products</span>
        <span>{cart.lines.length} items</span>
      </div>
      <div className="grow overflow-auto py-4 space-y-3">
        <AnimatePresence>
          {cart.lines
            .sort((a, b) =>
              a.merchandise.product.title.localeCompare(
                b.merchandise.product.title
              )
            )
            .map((item, i) => (
              <motion.div
                key={`${item.id}-${item.merchandise.id}`}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: i * 0.1, ease: "easeOut" }}
              >
                <CartItemCard
                  item={item}
                  optimisticUpdate={updateCartItem}
                  onCloseCart={closeCart}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
      <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
          <p>Taxes</p>
          <p className="text-right text-base text-black dark:text-white">
            {formatPrice(
              cart.cost.totalTaxAmount.amount,
              cart.cost.totalTaxAmount.currencyCode
            )}
          </p>
        </div>
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
          <p>Shipping</p>
          {cart.cost.shippingAmount ? (
            <p className="text-right text-base text-black dark:text-white">
              {formatPrice(
                cart.cost.shippingAmount.amount,
                cart.cost.shippingAmount.currencyCode
              )}
            </p>
          ) : (
            <p className="text-right">Calculated at checkout</p>
          )}
        </div>
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
          <p>Total</p>
          <p className="text-right text-base text-black dark:text-white">
            {formatPrice(
              cart.cost.totalAmount.amount,
              cart.cost.totalAmount.currencyCode
            )}
          </p>
        </div>
      </div>
      <form action={redirectToCheckout}>
        <CheckoutButton />
      </form>
    </div>
  );
};

export default function CartModal() {
  const { cart, mode } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  useEffect(() => {
    if (pathname === "/checkout") closeCart();
  }, [pathname]);

  const renderCartContent = () => {
    if (mode === "mock") {
      return (
        <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
          <TriangleAlert className="size-12" />
          <p className="mt-6 text-center text-2xl font-semibold">
            Cart is not available in mock mode.
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Complete the SFCC setup.
          </p>
        </div>
      );
    }

    if (!cart || cart.lines.length === 0) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex"
          >
            <Link
              href="/shop"
              className="bg-background rounded-lg p-2 border border-dashed border-border w-full"
              onClick={closeCart}
            >
              <div className="flex flex-row gap-6">
                <div className="relative size-20 overflow-hidden rounded-sm shrink-0 border border-dashed border-border flex items-center justify-center">
                  <PlusCircleIcon className="size-6 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-2 2xl:gap-3 flex-1 justify-center">
                  <span className="text-lg 2xl:text-xl font-semibold">
                    Cart is empty
                  </span>
                  <p className="text-sm text-muted-foreground hover:underline">
                    Start shopping to get started
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      );
    }

    return <CartItems closeCart={closeCart} />;
  };

  return (
    <>
      <Button
        aria-label="Open cart"
        onClick={openCart}
        className="uppercase"
        size={"sm"}
      >
        <span className="max-md:hidden">cart</span> ({cart?.totalQuantity || 0})
      </Button>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-foreground/30 z-50"
              onClick={closeCart}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 bottom-0 right-0 flex w-full md:w-[500px] p-modal-sides z-50"
            >
              <div className="flex flex-col bg-muted p-3 md:p-4 rounded w-full">
                <div className="pl-2 flex items-baseline justify-between mb-10">
                  <p className="text-2xl font-semibold">Cart</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Close cart"
                    onClick={closeCart}
                  >
                    Close
                  </Button>
                </div>

                {renderCartContent()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="w-full relative flex items-center justify-between gap-3"
    >
      {pending ? "Processing..." : "Proceed to Checkout"}
      <ArrowRight className="size-6" />
    </Button>
  );
}
