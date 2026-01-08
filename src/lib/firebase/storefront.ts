import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import { adminDb } from "./admin";
import { mapProductData, type ProductInput } from "./products-shared";
import type { Collection, Page, Product } from "./types";

const productsCollection = adminDb.collection("products");
const collectionsCollection = adminDb.collection("collections");
const pagesCollection = adminDb.collection("pages");

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

function titleize(handle: string): string {
  return handle
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

function mapCollectionDoc(id: string, data: Record<string, unknown>): Collection {
  const handle = (data.handle as string) ?? id;
  const title = (data.title as string) ?? titleize(handle);
  return {
    handle,
    title,
    description: (data.description as string) ?? "",
    seo: data.seo as Collection["seo"],
    updatedAt: toIsoString(data.updatedAt),
    path: `/search/${handle}`,
  };
}

function filterProductsForQuery(products: Product[], query?: string): Product[] {
  if (!query) return products;
  const normalized = query.toLowerCase();
  return products.filter((product) => {
    const inTitle = product.title.toLowerCase().includes(normalized);
    const inDescription = product.description.toLowerCase().includes(normalized);
    const inTags = product.tags.some((tag) =>
      tag.toLowerCase().includes(normalized)
    );
    return inTitle || inDescription || inTags;
  });
}

function sortFieldFromKey(sortKey?: string): string {
  switch (sortKey) {
    case "PRICE":
      return "price";
    case "CREATED_AT":
      return "createdAt";
    case "BEST_SELLING":
      return "salesCount";
    default:
      return "updatedAt";
  }
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const sortField = sortFieldFromKey(sortKey);
  const direction = reverse ? "desc" : "asc";

  const snapshot = await productsCollection.orderBy(sortField, direction).get();
  const products = snapshot.docs
    .map((doc) => mapProductData(doc.id, doc.data() as ProductInput))
    .filter((product) => !product.tags.includes(HIDDEN_PRODUCT_TAG));

  return filterProductsForQuery(products, query);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const snapshot = await productsCollection
    .where("handle", "==", handle)
    .limit(1)
    .get();

  const doc = snapshot.docs[0];
  if (!doc) return undefined;

  return mapProductData(doc.id, doc.data() as ProductInput);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const sortField = sortFieldFromKey(sortKey);
  const direction = reverse ? "desc" : "asc";

  const snapshot = await productsCollection
    .where("collections", "array-contains", collection)
    .orderBy(sortField, direction)
    .get();

  return snapshot.docs.map((doc) =>
    mapProductData(doc.id, doc.data() as ProductInput)
  );
}

export async function getCollections(): Promise<Collection[]> {
  const snapshot = await collectionsCollection.get();
  const collections = snapshot.docs.map((doc) =>
    mapCollectionDoc(doc.id, doc.data())
  );

  if (collections.length) {
    return [
      {
        handle: "",
        title: "All",
        description: "All products",
        path: "/search",
        updatedAt: new Date().toISOString(),
      },
      ...collections,
    ];
  }

  const products = await productsCollection.get();
  const handles = new Set<string>();
  products.docs.forEach((doc) => {
    const data = doc.data();
    const productCollections = (data.collections as string[]) ?? [];
    productCollections.forEach((handle) => handles.add(handle));
  });

  const derived = Array.from(handles).map((handle) =>
    mapCollectionDoc(handle, { handle, updatedAt: new Date().toISOString() })
  );

  return [
    {
      handle: "",
      title: "All",
      description: "All products",
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    ...derived,
  ];
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  const products = await getProducts({});
  return products.filter((product) => product.id !== productId).slice(0, 4);
}

export async function getPage(handle: string): Promise<Page | undefined> {
  const snapshot = await pagesCollection.where("handle", "==", handle).limit(1).get();
  const doc = snapshot.docs[0];
  if (!doc) return undefined;
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title as string,
    handle: data.handle as string,
    body: (data.body as string) ?? "",
    bodySummary: data.bodySummary as string,
    seo: data.seo as Page["seo"],
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
}

export async function getPages(): Promise<Page[]> {
  const snapshot = await pagesCollection.get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title as string,
      handle: data.handle as string,
      body: (data.body as string) ?? "",
      bodySummary: data.bodySummary as string,
      seo: data.seo as Page["seo"],
      createdAt: toIsoString(data.createdAt),
      updatedAt: toIsoString(data.updatedAt),
    };
  });
}
