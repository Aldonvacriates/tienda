"use client";

import type { Product, ProductVariant } from "@/lib/shopify/types";
import { useProduct } from "../product/product-context";
import { useCart } from "./cart-context";
import { useFormState } from "react-dom";
import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/24/outline";
import { addItem } from "./actions";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add to Cart
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, { "hover:opacity-90": true })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();

  // Server action signature: (prevState, selectedVariantId: string | undefined) => Promise<string | void>
  // State type becomes string | undefined; payload type is string | undefined (we bind it below).
  const [message, formAction] = useFormState<
    string | undefined,
    string | undefined
  >(addItem, undefined);

  const variant = variants.find((v: ProductVariant) =>
    v.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );

  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id ?? defaultVariantId;

  const actionWithVariant = formAction.bind(null, selectedVariantId);

  const finalVariant = variants.find((v) => v.id === selectedVariantId);

  return (
    <form
      action={async () => {
        // Optimistic update only if we truly have a variant to add.
        if (finalVariant) {
          addCartItem(finalVariant, product);
        }
        await actionWithVariant();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p className="sr-only" role="status" aria-live="polite">
        {message ?? null}
      </p>
    </form>
  );
}
