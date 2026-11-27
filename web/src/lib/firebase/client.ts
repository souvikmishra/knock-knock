import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import {
  connectFunctionsEmulator,
  getFunctions,
  type Functions,
} from "firebase/functions";
import { getFirebaseConfig, shouldUseEmulators } from "./config";

export type Firebase = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  functions: Functions;
};

let instance: Firebase | undefined;

export function getFirebase(): Firebase {
  if (instance) return instance;

  // NEXT_PUBLIC_* must be referenced statically so Next inlines them.
  const env = {
    NEXT_PUBLIC_FIREBASE_CONFIG: process.env.NEXT_PUBLIC_FIREBASE_CONFIG,
    NEXT_PUBLIC_FIREBASE_EMULATORS: process.env.NEXT_PUBLIC_FIREBASE_EMULATORS,
  };
  const app = getApps().length ? getApp() : initializeApp(getFirebaseConfig(env));
  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app);

  if (shouldUseEmulators(env)) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  }

  instance = { app, auth, db, functions };
  return instance;
}
