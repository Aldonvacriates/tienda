"use client";

import type { Product, ProductVariant } from "@/lib/firebase/types";
import { useProduct } from "../product/product-context";
import { useCart } from "./cart-context";
import { useState } from "react";
import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/24/outline";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  onClick,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  onClick: () => void;
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
      type="button"
      onClick={onClick}
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
  const [message, setMessage] = useState<string | undefined>(undefined);

  const variant = variants.find((v: ProductVariant) =>
    v.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );

  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id ?? defaultVariantId;

  const finalVariant = variants.find((v) => v.id === selectedVariantId);

  return (
    <div>
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        onClick={() => {
          if (!finalVariant) {
            setMessage("Please select an option.");
            return;
          }
          addCartItem(finalVariant, product);
          setMessage("Added to cart.");
        }}
      />
      <p className="sr-only" role="status" aria-live="polite">
        {message ?? null}
      </p>
    </div>
  );
}
