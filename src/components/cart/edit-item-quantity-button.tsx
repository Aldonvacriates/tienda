"use client";

import type { CartItem } from "@/lib/firebase/types";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

function SubmitButton({
  type,
  onClick,
}: {
  type: "plus" | "minus";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        { "ml-auto": type === "minus" }
      )}
      onClick={onClick}
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
  return (
    <SubmitButton
      type={type}
      onClick={() => optimisticUpdate(item.merchandise.id, type)}
    />
  );
}
