"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import Price from "@/components/price";

type OrderSummary = {
  id: string;
  cartId: string;
  createdAt: string;
  totalAmount: { amount: string; currencyCode: string };
};

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadOrders = async () => {
      setIsLoading(true);
      setStatus(null);
      try {
        const response = await fetch(`/api/orders?userId=${user.uid}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error ?? "Failed to load orders.");
        }
        setOrders(data.orders ?? []);
      } catch (error) {
        console.error(error);
        setStatus("Unable to load your order history.");
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, [user]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <p className="text-sm text-neutral-500">Loading orders...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold">Order history</h1>
        <p className="mb-6 text-sm text-neutral-600">
          Sign in to view your previous orders.
        </p>
        <Link
          href="/login?redirect=/orders"
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
        <h1 className="text-3xl font-bold">Order history</h1>
        <Link
          href="/account"
          className="text-sm font-semibold text-blue-600"
        >
          Back to account
        </Link>
      </div>
      {status ? (
        <p className="mb-6 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
          {status}
        </p>
      ) : null}
      {isLoading ? (
        <p className="text-sm text-neutral-500">Loading orders...</p>
      ) : null}
      {!isLoading && orders.length === 0 ? (
        <p className="text-sm text-neutral-500">
          You have not placed any orders yet.
        </p>
      ) : null}
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block rounded-lg border border-neutral-200 p-4 hover:border-blue-600"
          >
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
          </Link>
        ))}
      </div>
    </main>
  );
}
