"use client";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "./client";
import type { UserProfile } from "./types";

const usersCollection = collection(firebaseDb, "users");

export async function registerUser({
  email,
  password,
  name,
  address,
  phone,
}: {
  email: string;
  password: string;
  name?: string;
  address?: string;
  phone?: string;
}): Promise<User> {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );

  await setDoc(doc(usersCollection, credential.user.uid), {
    uid: credential.user.uid,
    email,
    name: name ?? "",
    address: address ?? "",
    phone: phone ?? "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return credential.user;
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> {
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );
  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(firebaseAuth);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(usersCollection, uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, "name" | "address" | "phone">>
): Promise<void> {
  await setDoc(
    doc(usersCollection, uid),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteUserAccount(user: User): Promise<void> {
  await deleteDoc(doc(usersCollection, user.uid));
  await deleteUser(user);
}
