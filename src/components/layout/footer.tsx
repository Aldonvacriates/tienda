import Link from "next/link";
import { getMenu } from "@/lib/shopify";
import type { Menu } from "@/lib/shopify/types";

export default async function Footer() {
  let menu: Menu[] = [];

  try {
    menu = await getMenu("footer");
  } catch (error) {
    console.error("[Footer] Failed to load footer menu:", error);
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t px-4 py-6 text-sm text-neutral-500 dark:border-t-black dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center sm:text-left">
          &copy; {currentYear} Aldo Website LLC. All rights reserved.
        </p>
        {menu.length > 0 ? (
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            {menu.map((item: Menu) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className="text-gray-700 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </footer>
  );
}
