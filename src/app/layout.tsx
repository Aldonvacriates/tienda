import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import { Analytics } from '@vercel/analytics/next';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aldo Website Shop",
  description: "The best products for the best prices.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = (await (cookies())).get("cartId")?.value;
  const cart = getCart(cartId);
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider cartPromise={cart}>
          <Navbar />
          {children}
          <Analytics />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
