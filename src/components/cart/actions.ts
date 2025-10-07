"use server";

import { TAGS } from "@/lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/** Minimal shapes used by these actions. Extend if your lib returns more. */
type CartLine = {
  id: string;
  merchandise: { id: string };
};

type Cart = {
  id: string;
  checkoutUrl: string;
  lines: CartLine[];
};

export async function addItem(
  _prevState: unknown,
  selectedVariantId: string | undefined
): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  if (!cartId || !selectedVariantId) return "Error adding item to cart";

  try {
    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    revalidateTag(TAGS.cart);
  } catch {
    return "Error adding item to cart";
  }
}

export async function updateItemQuantity(
  _prevState: unknown,
  payload: { merchandiseId: string; quantity: number }
): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  if (!cartId) return "Missing cart ID";

  const { merchandiseId, quantity } = payload;

  try {
    const cart = (await getCart(cartId)) as Cart | null;
    if (!cart) return "Error fetching cart";

    const lineItem = cart.lines?.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem?.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        // Your helper expects merchandiseId on the update payload.
        await updateCart(cartId, [
          { id: lineItem.id, merchandiseId, quantity },
        ]);
      }
    } else if (quantity > 0) {
      await addToCart(cartId, [{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (err) {
    console.error(err);
    return "Error updating item quantity";
  }
}

export async function removeItem(
  _prevState: unknown,
  merchandiseId: string
): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  if (!cartId) return "Missing cart ID";

  try {
    const cart = (await getCart(cartId)) as Cart | null;
    if (!cart) return "Error fetching cart";

    const lineItem = cart.lines?.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem?.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch {
    return "Error removing item from cart";
  }
}

export async function redirectToCheckout(): Promise<void> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  if (!cartId) {
    // Optionally: create a new cart then return (or redirect elsewhere)
    return;
  }

  const cart = (await getCart(cartId)) as Cart | null;
  if (!cart) {
    return;
  }

  // Next.js redirect throws and never returns
  redirect(cart.checkoutUrl);
}

export async function createCartAndSetCookie(): Promise<string | undefined> {
  const cart = (await createCart()) as { id?: string } | null;
  if (!cart?.id) return "Error creating cart";

  const cookieStore = await cookies();
  cookieStore.set("cartId", cart.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    // maxAge: 60 * 60 * 24 * 30, // optional: 30 days
  });
}
