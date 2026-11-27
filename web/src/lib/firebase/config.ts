import type { FirebaseOptions } from "firebase/app";

export const DEMO_PROJECT_ID = "demo-knock-knock";

type Env = Record<string, string | undefined>;

export function getFirebaseConfig(env: Env): FirebaseOptions {
  const raw = env.NEXT_PUBLIC_FIREBASE_CONFIG;
  if (raw) return JSON.parse(raw) as FirebaseOptions;
  return {
    projectId: DEMO_PROJECT_ID,
    apiKey: "demo-api-key",
    authDomain: `${DEMO_PROJECT_ID}.firebaseapp.com`,
    appId: "demo-app",
  };
}

export function shouldUseEmulators(env: Env): boolean {
  if (env.NEXT_PUBLIC_FIREBASE_EMULATORS === "1") return true;
  return (getFirebaseConfig(env).projectId ?? "").startsWith("demo-");
}
