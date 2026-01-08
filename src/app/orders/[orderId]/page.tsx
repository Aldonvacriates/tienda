"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import Price from "@/components/price";
import type { CartItem } from "@/lib/firebase/types";

type OrderDetail = {
  id: string;
  cartId: string;
  createdAt: string;
  totalAmount: { amount: string; currencyCode: string };
  items: CartItem[];
};

export default function OrderDetailPage() {
  const { user, loading } = useAuth();
  const params = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !params?.orderId) return;
    const loadOrder = async () => {
      setIsLoading(true);
      setStatus(null);
      try {
        const response = await fetch(
          `/api/orders/${params.orderId}?userId=${user.uid}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error ?? "Failed to load order.");
        }
        setOrder(data as OrderDetail);
      } catch (error) {
        console.error(error);
        setStatus("Unable to load order details.");
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [params?.orderId, user]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <p className="text-sm text-neutral-500">Loading order...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold">Order details</h1>
        <p className="mb-6 text-sm text-neutral-600">
          Sign in to view your order details.
        </p>
        <Link
          href={`/login?redirect=/orders/${params?.orderId ?? ""}`}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order details</h1>
        <Link
          href="/orders"
          className="text-sm font-semibold text-blue-600"
        >
          Back to orders
        </Link>
      </div>
      {status ? (
        <p className="mb-6 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
          {status}
        </p>
      ) : null}
      {isLoading ? (
        <p className="text-sm text-neutral-500">Loading order...</p>
      ) : null}
      {order ? (
        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Order {order.id}</p>
                <p className="text-xs text-neutral-500">
                  Cart ID: {order.cartId}
                </p>
                <p className="text-xs text-neutral-500">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "Processing"}
                </p>
              </div>
              <Price
                className="text-right text-sm font-semibold"
                amount={order.totalAmount.amount}
                currencyCode={order.totalAmount.currencyCode}
              />
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h2 className="mb-4 text-lg font-semibold">Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.merchandise.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {item.merchandise.product.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <Price
                    className="text-right text-sm font-semibold"
                    amount={item.cost.totalAmount.amount}
                    currencyCode={item.cost.totalAmount.currencyCode}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
