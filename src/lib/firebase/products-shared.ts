import { DEFAULT_OPTION } from "@/lib/constants";
import type {
  Image,
  Money,
  Product,
  ProductOption,
  ProductVariant,
  SEO,
} from "./types";

export type ProductInput = {
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  price: number;
  currencyCode?: string;
  images?: Image[];
  featuredImage?: Image;
  tags?: string[];
  collections?: string[];
  availableForSale?: boolean;
  seo?: SEO;
  options?: ProductOption[];
  variants?: ProductVariant[];
  createdAt?: unknown;
  updatedAt?: unknown;
};

function toIsoString(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "object" && "toDate" in (value as object)) {
    const date = (value as { toDate: () => Date }).toDate();
    return date.toISOString();
  }
  return new Date().toISOString();
}

function toAmount(price: number | string | undefined): string {
  if (price === undefined || price === null) return "0";
  if (typeof price === "number") return price.toFixed(2);
  return price;
}

function buildMoney(amount: string, currencyCode: string): Money {
  return { amount, currencyCode };
}

function buildDefaultVariant(
  id: string,
  amount: string,
  currencyCode: string,
  availableForSale: boolean
): ProductVariant {
  return {
    id,
    title: DEFAULT_OPTION,
    availableForSale,
    selectedOptions: [{ name: "Title", value: DEFAULT_OPTION }],
    price: buildMoney(amount, currencyCode),
  };
}

function computePriceRange(variants: ProductVariant[]): {
  maxVariantPrice: Money;
  minVariantPrice: Money;
} {
  if (!variants.length) {
    return {
      maxVariantPrice: buildMoney("0", "USD"),
      minVariantPrice: buildMoney("0", "USD"),
    };
  }

  const amounts = variants.map((variant) => Number(variant.price.amount));
  const currencyCode = variants[0]?.price.currencyCode ?? "USD";
  const max = Math.max(...amounts);
  const min = Math.min(...amounts);

  return {
    maxVariantPrice: buildMoney(max.toFixed(2), currencyCode),
    minVariantPrice: buildMoney(min.toFixed(2), currencyCode),
  };
}

export function mapProductData(id: string, data: ProductInput): Product {
  const currencyCode = data.currencyCode ?? "USD";
  const amount = toAmount(data.price);
  const defaultVariant = buildDefaultVariant(
    `${id}-default`,
    amount,
    currencyCode,
    data.availableForSale ?? true
  );
  const variants = data.variants?.length ? data.variants : [defaultVariant];
  const options = data.options ?? [];
  const priceRange = computePriceRange(variants);
  const images = data.images ?? [];
  const featuredImage = data.featuredImage ?? images[0];

  return {
    id,
    handle: data.handle,
    availableForSale: data.availableForSale ?? true,
    title: data.title,
    description: data.description,
    descriptionHtml: data.descriptionHtml ?? data.description,
    options,
    priceRange,
    variants,
    featuredImage,
    images,
    seo: data.seo ?? {
      title: data.title,
      description: data.description,
    },
    tags: data.tags ?? [],
    collections: data.collections ?? [],
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
}

export function toProductPayload(data: ProductInput) {
  return {
    title: data.title,
    handle: data.handle,
    description: data.description,
    descriptionHtml: data.descriptionHtml ?? data.description,
    price: data.price,
    currencyCode: data.currencyCode ?? "USD",
    images: data.images ?? [],
    featuredImage: data.featuredImage ?? data.images?.[0] ?? null,
    tags: data.tags ?? [],
    collections: data.collections ?? [],
    availableForSale: data.availableForSale ?? true,
    seo: data.seo ?? {
      title: data.title,
      description: data.description,
    },
    options: data.options ?? [],
    variants: data.variants ?? [],
  };
}
