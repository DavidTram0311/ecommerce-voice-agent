export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  parentCategoryTree: {
    id: string;
    name: string;
  }[];
  updatedAt: string;
  path: string;
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  categoryId?: string;
  description: string;
  descriptionHtml: string;
  featuredImage: Image;
  currencyCode: string;
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  seo: SEO;
  options: ProductOption[];
  tags: string[];
  variants: ProductVariant[];
  images: Image[];
  availableForSale: boolean;
  variationValues?: Record<string, string>;
};

export type SelectedOptions = {
  name: string;
  value: string;
}[];

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOptions;
  price: Money;
};

export type ProductOption = {
  id: string;
  name: string;
  values: {
    id: string;
    name: string;
  }[];
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string;
  height: number;
  width: number;
  selectedOptions?: SelectedOptions;
};

export type SEO = {
  title: string;
  description: string;
};

export type ShippingMethod = {
  id: string;
  name?: string;
  description?: string;
  price?: Money;
  isDefault?: boolean;
};

export type Cart = {
  id: string | undefined;
  checkoutUrl: string;
  customerEmail?: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
    shippingAmount?: Money;
  };
  lines: CartItem[];
  totalQuantity: number;
  shippingAddress?: Address;
  billingAddress?: Address;
  shippingMethod?: ShippingMethod;
  paymentInstruments?: any[];
};

export type Address = {
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
};

export type Order = Cart & {
  orderNumber: string;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOptions;
    product: CartProduct;
  };
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  images: Image[];
  description?: string;
  featuredImage: Image;
  variationValues?: Record<string, string>;
};

export type ProductRecommendations = {
  id: string;
  name: string;
  recommendations: RecommendedProduct[];
};

export type RecommendedProduct = {
  recommended_item_id: string;
  recommendation_type: {
    _type: string;
    display_value: string;
    value: number;
  };
};

export type Menu = {
  title: string;
  path: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

