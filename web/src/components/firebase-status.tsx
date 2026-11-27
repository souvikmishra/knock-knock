"use client";

import { signInAnonymously } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirebase } from "@/lib/firebase/client";

type Status = "connecting…" | "connected" | "offline";

export function FirebaseStatus() {
  const [status, setStatus] = useState<Status>("connecting…");

  useEffect(() => {
    let cancelled = false;
    signInAnonymously(getFirebase().auth)
      .then(() => !cancelled && setStatus("connected"))
      .catch(() => !cancelled && setStatus("offline"));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <p data-testid="firebase-status" className="text-sm text-muted-foreground">
      {status}
    </p>
  );
}
