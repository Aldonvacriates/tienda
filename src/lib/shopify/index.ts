import { SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from "../constants";
import { isShopifyError, ShopifyErrorLike } from "../type-guards";
import { ensureStartsWith } from "../utils";
import { getMenuQuery } from "./queries/menu";
import { Menu, ShopifyMenuOperation } from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

type ShopifyResponse<T> = T & { errors?: unknown[] };

export async function shopifyFetch<T>({
  cache = "force-cache",
  headers,
  query,
  tags,
  variables,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T }> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key ?? "",
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = (await response.json()) as ShopifyResponse<T>;

    if (Array.isArray(body.errors) && body.errors.length > 0) {
      throw body.errors[0];
    }

    return {
      status: response.status,
      body,
    };
  } catch (error) {
    if (isShopifyError(error)) {
      const shopifyError = error as ShopifyErrorLike;
      throw {
        cause: shopifyError.cause?.toString?.() ?? "unknown",
        status: shopifyError.status ?? 500,
        message: shopifyError.message?.toString?.() ?? "Unknown Shopify error",
        query,
      };
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Shopify fetch failed: ${message}`);
  }
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle,
    },
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, "")
        .replace("/collections/", "/search")
        .replace("/pages", ""),
    })) || []
  );
}
