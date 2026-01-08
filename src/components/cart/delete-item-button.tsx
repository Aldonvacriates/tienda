"use client";
import type { CartItem } from "@/lib/firebase/types";
import { XMarkIcon } from "@heroicons/react/24/outline";

type OptimisticUpdateFn = (merchandiseId: string, op: "delete") => void;

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: OptimisticUpdateFn;
}) {
  return (
    <button
      type="button"
      aria-label="Remove cart item"
      onClick={() => optimisticUpdate(item.merchandise.id, "delete")}
      className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
    >
      <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
    </button>
  );
}
