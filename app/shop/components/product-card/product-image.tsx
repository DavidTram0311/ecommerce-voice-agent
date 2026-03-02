"use client";

import {
  useProductImages,
  useSelectedVariant,
} from "@/components/products/variant-selector";
import { Product } from "@/lib/store/types";
import Image from "next/image";

export const ProductImage = ({ product }: { product: Product }) => {
  const selectedVariant = useSelectedVariant(product);

  const [variantImage] = useProductImages(product, selectedVariant?.selectedOptions);

  return (
    <div className="size-full flex items-center justify-center p-4">
    <Image
      src={variantImage.url}
      alt={variantImage.altText || product.title}
      width={variantImage.width}
      height={variantImage.height}
      className="w-3/4 h-3/4 object-contain"
      quality={100}
    />
  </div>
  );
};
