"use client";
import type { CartItem } from "@/lib/shopify/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { removeItem } from "./actions";

type OptimisticUpdateFn = (merchandiseId: string, op: "delete") => void;

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: OptimisticUpdateFn;
}) {
  // Server action: (prevState, merchandiseId: string) => Promise<string | void>
  // State type is string | undefined; payload type is string
  const [message, formAction] = useFormState<string | undefined, string>(
    removeItem,
    undefined
  );

  const merchandiseId = item.merchandise.id;
  const actionWithVariant = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, "delete");
        await actionWithVariant();
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
