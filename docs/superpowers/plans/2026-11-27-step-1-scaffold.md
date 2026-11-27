# Step 1: Scaffold and the four commands, implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** An empty Knock Knock app where `npm run dev`, `npm test`, `npm run check` and `npm run smoke` all run
and pass, so every later feature lands on a working feedback loop.

**Architecture:** An npm-workspaces monorepo. `web/` is a Next.js App Router app (TypeScript, Tailwind,
shadcn/ui) and `functions/` is Firebase Cloud Functions in TypeScript. Firestore rules and the emulator config
live at the root. Everything local runs against the Firebase Emulator Suite under project id
`demo-knock-knock`, so no real Firebase project or login is needed. The smoke test proves the wiring end to end:
the home page signs in anonymously against the Auth emulator and shows that it's connected.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Firebase JS SDK 13,
firebase-functions 7 / firebase-admin 14, firebase-tools 15 (as a devDependency), Vitest 5,
`@firebase/rules-unit-testing` 6, Playwright 1.65 (WebKit + Chromium).

**Spec:** `docs/spec-v0.md`, plus `docs/decisions/0012-stack.md`, `0015-setup-and-deploys.md`,
`0016-look-motion-and-sound.md`, and the Getting started section of `AGENTS.md`.

## Global Constraints
- Local project id is exactly `demo-knock-knock`. Nothing in step 1 talks to a real Firebase project.
- **No deploys, no remotes, no `firebase login`** ([0015](../../decisions/0015-setup-and-deploys.md)). App Hosting
  setup (`apphosting.yaml`) waits for step 5.
- Clients write nothing directly. Step 1's `firestore.rules` denies all reads and writes, and step 2 opens
  exactly what the spec allows.
- UI comes through shadcn/ui + Tailwind ([0016](../../decisions/0016-look-motion-and-sound.md)). Step 1 only
  initialises shadcn; it adds no components.
- Use the versions the official generators (`create-next-app`, `firebase init`, `shadcn init`) install, then
  `npm install` the rest at their current majors (listed above). Commit `package-lock.json`.
- Prereqs: Node 22+ (this machine has 24) and **Java 21+** for the emulators.
- Small commits, one concern each, on branch `scaffold/step-1`.

## Review Focus
1. **Java missing:** `npm test`, `npm run smoke` and `npm run dev` should stop at once with
   "Java 21+ is required for the Firebase emulators: brew install openjdk@21", not an emulator stack trace.
   Pinned in Task 2.
2. **Signed-in users writing to Firestore:** step 1 rules must deny a *signed-in* user too, not just a signed-out
   one. Pinned in Task 2.
3. **The web app run without the emulator flag** must never point at a real project. With env unset, config falls
   back to `demo-knock-knock`. Pinned in Task 3.
4. **WebKit (iPhone) actually runs** in the smoke test, not only Chromium. Pinned in Task 3: both Playwright projects
   must pass.
5. **Smoke while `npm run dev` is already running** (port 3000 taken) reuses that server instead of failing. Pinned
   in Task 3 (`reuseExistingServer` outside CI).

---

### Task 1: Workspace, Next.js app and `npm run check`

**Files:**
- Create: `package.json` (root, `"private": true`, `"workspaces": ["web", "functions"]`)
- Create: `web/` via `npx create-next-app@latest web --ts --app --eslint --tailwind --src-dir --import-alias "@/*" --use-npm --disable-git --yes` (non-interactive; if a flag is rejected, check `npx create-next-app@latest --help`; make sure no `web/.git` is left)
- Create: `web/components.json`, `web/src/lib/utils.ts` via `npx shadcn@latest init` (base colour: neutral; CSS variables: yes)
- Modify: `web/src/app/page.tsx`: replace the starter page with an `<h1>Knock Knock</h1>` and a one-line tagline "Don't text "hi". Knock."
- Modify: `web/src/app/layout.tsx`: `metadata.title = "Knock Knock"`
- Modify: `.gitignore`: add `.next/`, `out/`, `functions/lib/`, `*.log`, `.env*.local`, `playwright-report/`, `test-results/`, `.firebase/`

**Interfaces:**
- Produces: root script `check` = `npm run check --workspaces --if-present`; `web` script `check` = `tsc --noEmit && eslint .`

- [x] **Step 1:** Scaffold `web/` and run `npx shadcn@latest init` inside it.
- [x] **Step 2:** Add the root `package.json` and the `check` scripts. Run `npm install` at the root.
- [x] **Step 3:** Run `npm run check`. Expected: exit 0, no type or lint errors.
- [x] **Step 4:** Run `npm run build -w web`. Expected: "Compiled successfully" and the `/` route listed.
- [x] **Step 5:** Commit: `Scaffold Next.js app in web/ with Tailwind and shadcn/ui`.

### Task 2: Firebase config, functions, rules and `npm test`

**Files:**
- Create: `firebase.json`: `firestore.rules`; `functions` source `functions` with predeploy build; emulators `auth` 9099, `firestore` 8080, `functions` 5001, `ui` enabled, `singleProjectMode: true`
- Create: `.firebaserc`: `{ "projects": { "default": "demo-knock-knock" } }`
- Create: `firestore.rules`: `rules_version = '2'`, match `/{document=**}` with `allow read, write: if false;`
- Create: `functions/` via `npx firebase-tools@latest init functions` choices (TypeScript, ESLint yes, install no), or by hand to match: `package.json` (`engines.node` `"22"`, `main` `lib/index.js`, scripts `build` = `tsc`, `check` = `tsc --noEmit && eslint .`), `tsconfig.json`, `src/index.ts` (exports nothing yet, just a comment that callables arrive in step 2)
- Create: `functions/src/rules/windows.ts`
- Create: `scripts/require-java.mjs`
- Create: `vitest.config.ts` (root): two projects, `unit` (`functions/src/**/*.test.ts`, node env) and `rules` (`tests/rules/**/*.test.ts`, node env)
- Test: `functions/src/rules/windows.test.ts`, `tests/rules/deny-all.test.ts`, `scripts/require-java.test.mjs` (in the `unit` project; widen its include to `scripts/**/*.test.mjs`)
- Modify: root `package.json`: devDependencies `firebase-tools`, `vitest`, `@firebase/rules-unit-testing`, `firebase`; scripts below

**Interfaces:**
- Produces (`functions/src/rules/windows.ts`):
  - `export const KNOCK_WINDOWS = [5, 15, 60] as const`
  - `export type KnockWindow = (typeof KNOCK_WINDOWS)[number]`
  - `export const DEFAULT_KNOCK_WINDOW: KnockWindow = 15`
  - `export function isKnockWindow(n: unknown): n is KnockWindow`
- Produces (`scripts/require-java.mjs`): `export function javaMajor(versionOutput: string): number | null` (parses `java -version` stderr), plus a CLI entry that exits 1 with the exact message from Review Focus 1 when Java is missing or older than 21
- Produces root scripts:
  - `pretest` = `node scripts/require-java.mjs`
  - `test` = `firebase emulators:exec --project demo-knock-knock --only auth,firestore "vitest run"`

- [x] **Step 1: Write the failing tests**
  - `windows.test.ts`: `KNOCK_WINDOWS` equals `[5, 15, 60]`; `DEFAULT_KNOCK_WINDOW` is `15`; `isKnockWindow(15)` true; `isKnockWindow(10)`, `isKnockWindow("15")`, `isKnockWindow(undefined)` false.
  - `require-java.test.mjs`: `javaMajor('openjdk version "21.0.5" 2024-10-15')` → `21`; `javaMajor('java version "1.8.0_391"')` → `8`; `javaMajor('The operation couldn’t be completed. Unable to locate a Java Runtime.')` → `null`.
  - `deny-all.test.ts` (uses `initializeTestEnvironment({ projectId: "demo-knock-knock", firestore: { rules: <contents of firestore.rules> } })`): `assertFails` for an unauthenticated read of `users/a`, an unauthenticated write to `users/a`, **and** a write to `users/alice` by authenticated `alice`.
- [x] **Step 2:** Run `npx vitest run --project unit`. Expected: FAIL, modules not found.
- [x] **Step 3:** Implement `windows.ts` and `require-java.mjs` with the interfaces above.
- [x] **Step 4:** Run `npx vitest run --project unit`. Expected: PASS (6+ assertions).
- [x] **Step 5:** With Java absent, run `npm test`. Expected: exits 1 printing exactly "Java 21+ is required for the Firebase emulators: brew install openjdk@21". (Skip if Java is already installed and note it.)
- [x] **Step 6:** With Java 21 installed, run `npm test`. Expected: emulators start, both projects pass, emulators shut down, exit 0.
- [x] **Step 7:** Add `functions` to `npm run check` (root `check` already fans out). Run it. Expected: exit 0.
- [x] **Step 8:** Commit: `Add Firebase emulator config, deny-all rules, functions workspace and npm test`.

### Task 3: Firebase in the web app and `npm run smoke`

**Files:**
- Create: `web/src/lib/firebase/config.ts`
- Create: `web/src/lib/firebase/client.ts`
- Create: `web/src/components/firebase-status.tsx` (`"use client"`)
- Modify: `web/src/app/page.tsx`: render `<FirebaseStatus />` under the tagline
- Create: `playwright.config.ts` (root), `e2e/smoke.spec.ts`
- Test: `web/src/lib/firebase/config.test.ts` (add a `web` project to `vitest.config.ts`, node env, `web/src/**/*.test.ts`)
- Modify: root `package.json`: devDependency `@playwright/test`; `firebase` dependency in `web`; scripts below

**Interfaces:**
- Consumes: emulator ports from Task 2 (`auth` 9099, `firestore` 8080, `functions` 5001)
- Produces (`config.ts`):
  - `export const DEMO_PROJECT_ID = "demo-knock-knock"`
  - `export function getFirebaseConfig(env: Record<string, string | undefined>): FirebaseOptions`. Parses `env.NEXT_PUBLIC_FIREBASE_CONFIG` (JSON) when set. Otherwise it returns `{ projectId: DEMO_PROJECT_ID, apiKey: "demo-api-key", authDomain: "demo-knock-knock.firebaseapp.com", appId: "demo-app" }`.
  - `export function shouldUseEmulators(env): boolean` (not `use…`, which ESLint would treat as a React hook): true when `env.NEXT_PUBLIC_FIREBASE_EMULATORS === "1"` **or** the resolved project id starts with `demo-`
- Produces (`client.ts`): `export function getFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore; functions: Functions }`. A singleton; connects Auth/Firestore/Functions emulators on `127.0.0.1` when `shouldUseEmulators`. Port the singleton and emulator-connection pattern from friendlyeats-web `nextjs-end/src/lib/firebase/clientApp.js`.
- Produces (`firebase-status.tsx`): on mount, `signInAnonymously`, then renders `<p data-testid="firebase-status">connected</p>`. While pending it renders `connecting…`, and on error `offline`.
- Produces root scripts:
  - `presmoke` = `node scripts/require-java.mjs && npx playwright install webkit chromium`
  - `smoke` = `firebase emulators:exec --project demo-knock-knock --only auth,firestore,functions "playwright test"`

- [x] **Step 1: Write the failing tests**
  - `config.test.ts`: with `{}`, `getFirebaseConfig` returns projectId `demo-knock-knock` and `shouldUseEmulators` is `true`; with `NEXT_PUBLIC_FIREBASE_CONFIG` = `{"projectId":"knock-prod","apiKey":"k","appId":"a"}` it returns projectId `knock-prod` and `shouldUseEmulators` is `false`; with that config **and** `NEXT_PUBLIC_FIREBASE_EMULATORS=1`, `shouldUseEmulators` is `true`.
  - `e2e/smoke.spec.ts`, test "home page connects to Firebase emulators": `page.goto("/")`; expect heading "Knock Knock" visible; expect `getByTestId("firebase-status")` to have text `connected` within 15 s.
- [x] **Step 2:** Run `npx vitest run --project web`. Expected: FAIL, module not found.
- [x] **Step 3:** Implement `config.ts`, `client.ts`, `firebase-status.tsx`; wire into `page.tsx`.
- [x] **Step 4:** Run `npx vitest run --project web`. Expected: PASS.
- [x] **Step 5:** Write `playwright.config.ts`: `testDir: "e2e"`; projects `webkit-iphone` (`devices["iPhone 15"]`) and `chromium` (`devices["Desktop Chrome"]`); `webServer` = `npm run dev -w web`, url `http://localhost:3000`, `reuseExistingServer: !process.env.CI`, env `NEXT_PUBLIC_FIREBASE_EMULATORS=1`, timeout 120 s.
- [x] **Step 6:** Run `npm run smoke`. Expected: 2 passed (`webkit-iphone`, `chromium`), exit 0.
- [x] **Step 7:** Run `npm test` and `npm run check`. Expected: both exit 0.
- [x] **Step 8:** Commit: `Wire Firebase client to emulators and add Playwright smoke test`.

### Task 4: `npm run dev` and AGENTS.md

**Files:**
- Modify: root `package.json`: devDependency `concurrently`; scripts below
- Modify: `AGENTS.md`: remove the "Planned" note above Commands; correct the command comments to what they now do (smoke = home page connects to emulators, until step 2 extends it); Layout: drop `apphosting.yaml` (step 5), add `scripts/`, `tests/rules/`, `vitest.config.ts`, `playwright.config.ts`; Prereqs: Java 21 via `brew install openjdk@21` and how it's found on PATH; Stage: "step 1 done"
- Modify: `docs/superpowers/plans/2026-11-27-step-1-scaffold.md`: tick the boxes

**Interfaces:**
- Produces root scripts:
  - `predev` = `node scripts/require-java.mjs && npm run build -w functions`
  - `dev` = `concurrently -k -n emu,web "firebase emulators:start --project demo-knock-knock" "NEXT_PUBLIC_FIREBASE_EMULATORS=1 npm run dev -w web"`

- [x] **Step 1:** Add the scripts. Start `npm run dev` in the background.
- [x] **Step 2:** Verify: `curl -s localhost:3000 | grep -o "Knock Knock" | head -1` prints `Knock Knock`, and `curl -s localhost:4000` (Emulator UI) returns HTML. Stop the process.
- [x] **Step 3:** Update `AGENTS.md` as listed.
- [x] **Step 4:** Final check: `npm run check && npm test && npm run smoke`. Expected: all exit 0. Paste the summary lines into the hand-off message.
- [x] **Step 5:** Commit: `Add npm run dev and mark the feedback loop live in AGENTS.md`.
