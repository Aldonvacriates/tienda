import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://aldowebsite.shop"),
  title: "Aldo Website Shop",
  description: "Premium digital products to power your next big idea.",
  openGraph: {
    title: "Aldo Website Shop",
    description: "Shop curated digital assets and tools from Aldo Website.",
    url: "https://aldowebsite.shop",
    siteName: "Aldo Website Shop",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Featured digital products from Aldo Website Shop",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aldo Website Shop",
    description: "Shop curated digital assets and tools from Aldo Website.",
    images: ["/og.jpg"],
  },
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
          <Footer />
        </CartProvider>
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}
