"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { firebaseDb } from "./client";
import type { Cart } from "./types";

const ordersCollection = collection(firebaseDb, "orders");

export async function createOrder({
  cart,
  user,
}: {
  cart: Cart;
  user: User;
}): Promise<string> {
  const cartId = cart.id ?? crypto.randomUUID();
  const payload = {
    userId: user.uid,
    userEmail: user.email ?? "",
    cartId,
    items: cart.lines,
    totalAmount: cart.cost.totalAmount,
    createdAt: serverTimestamp(),
    status: "placed",
  };
  const docRef = await addDoc(ordersCollection, payload);
  return docRef.id;
}
