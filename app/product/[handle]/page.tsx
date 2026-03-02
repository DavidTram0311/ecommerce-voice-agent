import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCollection, getProduct } from "@/lib/store";
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { SidebarLinks } from "@/components/layout/sidebar/product-sidebar-links";
import { AddToCart } from "@/components/cart/add-to-cart";
import { storeCatalog } from "@/lib/store/constants";
import Prose from "@/components/prose";
import { formatPrice } from "@/lib/store/utils";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { PageLayout } from "@/components/layout/page-layout";
import { VariantSelectorSlots } from "./components/variant-selector-slots";
import { MobileGallerySlider } from "./components/mobile-gallery-slider";
import { DesktopGallery } from "./components/desktop-gallery";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const collection = product.categoryId
    ? await getCollection(product.categoryId)
    : null;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  const [rootParentCategory] = collection?.parentCategoryTree.filter(
    (c) => c.id !== storeCatalog.rootCategoryId
  ) ?? [undefined];

  const hasVariants = product.variants.length > 1;

  return (
    <PageLayout className="bg-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <div className="flex flex-col md:grid md:grid-cols-12 md:gap-sides">
        {/* Mobile Gallery Slider */}
        <div className="md:hidden col-span-full h-[60vh] min-h-[400px]">
          <Suspense fallback={null}>
            <MobileGallerySlider product={product} />
          </Suspense>
        </div>

        <div className="col-span-5 flex flex-col 2xl:col-span-4 max-md:col-span-full md:h-screen max-md:p-sides md:pl-sides md:pt-top-spacing sticky max-md:static top-0">
          <div className="col-span-full">
            <Breadcrumb className="col-span-full mb-3 md:mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/shop" prefetch>
                      Shop
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {rootParentCategory && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={`/shop/${rootParentCategory.id}`} prefetch>
                          {rootParentCategory.name}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col gap-4 col-span-full mb-10 max-md:order-2">
              <div className="rounded bg-card py-2 px-3 flex flex-col md:grid grid-cols-2 md:gap-x-4 md:gap-y-10 place-items-baseline">
                <h1 className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-balance max-md:mb-4">
                  {product.title}
                </h1>
                <p className="text-sm font-medium">{product.description}</p>
                <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold max-md:mt-8">
                  {formatPrice(
                    product.priceRange.minVariantPrice.amount,
                    product.priceRange.minVariantPrice.currencyCode
                  )}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Suspense fallback={null}>
                  <VariantSelectorSlots product={product} />
                </Suspense>

                <Suspense fallback={null}>
                  <AddToCart
                    product={product}
                    size="lg"
                    className={cn("w-full", {
                      "col-span-full": !hasVariants,
                    })}
                  />
                </Suspense>
              </div>
            </div>
          </div>

          <Prose
            className="col-span-full opacity-70 mb-auto max-md:order-3 max-md:mt-6"
            html={product.descriptionHtml}
          />

          <SidebarLinks className="max-md:hidden py-sides w-full max-w-[408px] pr-sides max-md:pr-0 max-md:py-0" />
        </div>

        {/* Desktop Gallery */}
        <div className="hidden md:block col-start-6 col-span-7 w-full overflow-y-auto relative">
          <Suspense fallback={null}>
            <DesktopGallery product={product} />
          </Suspense>
        </div>
      </div>
    </PageLayout>
  );
}
