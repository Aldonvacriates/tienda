"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const requiredEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

const missingEnv = Object.entries(requiredEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnv.length) {
  throw new Error(
    `Missing Firebase client env vars: ${missingEnv.join(", ")}.`
  );
}

const firebaseConfig = {
  apiKey: requiredEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: requiredEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: requiredEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: requiredEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: requiredEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: requiredEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);
export const firebaseAnalytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
