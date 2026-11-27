import { describe, expect, it } from "vitest";
import { getFirebaseConfig, shouldUseEmulators } from "./config";

const PROD = '{"projectId":"knock-prod","apiKey":"k","appId":"a"}';

describe("firebase config", () => {
  it("falls back to the demo project with emulators on", () => {
    expect(getFirebaseConfig({}).projectId).toBe("demo-knock-knock");
    expect(shouldUseEmulators({})).toBe(true);
  });

  it("uses NEXT_PUBLIC_FIREBASE_CONFIG and turns emulators off for a real project", () => {
    const env = { NEXT_PUBLIC_FIREBASE_CONFIG: PROD };
    expect(getFirebaseConfig(env).projectId).toBe("knock-prod");
    expect(shouldUseEmulators(env)).toBe(false);
  });

  it("lets NEXT_PUBLIC_FIREBASE_EMULATORS=1 force emulators on", () => {
    const env = {
      NEXT_PUBLIC_FIREBASE_CONFIG: PROD,
      NEXT_PUBLIC_FIREBASE_EMULATORS: "1",
    };
    expect(shouldUseEmulators(env)).toBe(true);
  });
});
