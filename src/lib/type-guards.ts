export interface ShopifyErrorLike {
  status?: number;
  message?: unknown;
  cause?: unknown;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function inheritsFromErrorPrototype(value: object): boolean {
  return value instanceof Error || inheritsFromErrorPrototypeRecursive(value);
}

function inheritsFromErrorPrototypeRecursive(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null) {
    return false;
  }

  if (prototype instanceof Error) {
    return true;
  }

  return inheritsFromErrorPrototypeRecursive(prototype);
}

export function isShopifyError(error: unknown): error is ShopifyErrorLike {
  if (!isObject(error)) {
    return false;
  }

  if (inheritsFromErrorPrototype(error)) {
    return true;
  }

  const { message, status } = error as Record<string, unknown>;

  const hasMessage =
    typeof message === "string" ||
    (typeof message === "object" && message !== null);
  const hasStatus = status === undefined || typeof status === "number";

  return hasMessage && hasStatus;
}
