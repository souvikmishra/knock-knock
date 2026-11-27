import { FirebaseStatus } from "@/components/firebase-status";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Knock Knock</h1>
      <p className="text-muted-foreground">Don&apos;t text &quot;hi&quot;. Knock.</p>
      <FirebaseStatus />
    </main>
  );
}
