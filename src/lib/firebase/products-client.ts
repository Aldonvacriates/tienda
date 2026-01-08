"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firebaseDb } from "./client";
import { mapProductData, type ProductInput, toProductPayload } from "./products-shared";
import type { Product } from "./types";

const productsCollection = collection(firebaseDb, "products");

export async function getProductsClient(): Promise<Product[]> {
  const snapshot = await getDocs(query(productsCollection, orderBy("updatedAt", "desc")));
  return snapshot.docs.map((docSnap) =>
    mapProductData(docSnap.id, docSnap.data() as ProductInput)
  );
}

export async function createProduct(input: ProductInput): Promise<string> {
  const payload = {
    ...toProductPayload(input),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(productsCollection, payload);
  return docRef.id;
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<void> {
  const payload = {
    ...toProductPayload(input),
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(productsCollection, id), payload);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(productsCollection, id));
}
