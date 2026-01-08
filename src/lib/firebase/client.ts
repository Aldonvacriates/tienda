"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQXVvGIKaKWBMsn3isQoysT67witRgujo",
  authDomain: "aldowebsitetienda.firebaseapp.com",
  projectId: "aldowebsitetienda",
  storageBucket: "aldowebsitetienda.firebasestorage.app",
  messagingSenderId: "331229090142",
  appId: "1:331229090142:web:407b565b62ec40dde3bfcf",
  measurementId: "G-BNR9Z102EH",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);
export const firebaseAnalytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
