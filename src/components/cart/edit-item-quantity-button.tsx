"use client";

import type { CartItem } from "@/lib/shopify/types";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useFormState } from "react-dom";
import { updateItemQuantity } from "./actions";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  return (
    <button
      type="submit"
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        { "ml-auto": type === "minus" }
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

type OptimisticUpdateFn = (merchandiseId: string, op: "plus" | "minus") => void;

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: OptimisticUpdateFn;
}) {
  // Server action signature: (prevState, payload: { merchandiseId: string; quantity: number }) => Promise<string | void>
  const [message, formAction] = useFormState<
    string | undefined,
    { merchandiseId: string; quantity: number }
  >(updateItemQuantity, undefined);

  const nextQty =
    type === "plus" ? item.quantity + 1 : Math.max(0, item.quantity - 1);

  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: nextQty,
  };

  const actionWithPayload = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        await actionWithPayload();
      }}
    >
      <SubmitButton type={type} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
