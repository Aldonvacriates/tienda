export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type Image = {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
};

export type SEO = {
  title: string;
  description: string;
};

export type Product = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml?: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
  featuredImage?: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  collections?: string[];
  updatedAt: string;
  createdAt?: string;
};

export type Collection = {
  handle: string;
  title: string;
  description?: string;
  seo?: SEO;
  updatedAt: string;
  path: string;
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: Image;
};

export type CartItem = {
  id?: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

export type Cart = {
  id?: string;
  checkoutUrl?: string;
  totalQuantity: number;
  lines: CartItem[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
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
  bodySummary?: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  uid: string;
  email: string;
  name?: string;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  userId: string;
  userEmail: string;
  cartId: string;
  items: CartItem[];
  totalAmount: Money;
  createdAt: string;
  status?: string;
};
