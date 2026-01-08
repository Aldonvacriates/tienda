import type { Menu } from "@/lib/firebase/types";

const primaryMenu: Menu[] = [
  { title: "Shop", path: "/search" },
  { title: "Account", path: "/account" },
  { title: "Orders", path: "/orders" },
  { title: "Manage Products", path: "/admin/products" },
];

const footerMenu: Menu[] = [
  { title: "Shop", path: "/search" },
  { title: "Account", path: "/account" },
  { title: "Orders", path: "/orders" },
];

export async function getMenu(handle: string): Promise<Menu[]> {
  if (handle === "footer") return footerMenu;
  return primaryMenu;
}
