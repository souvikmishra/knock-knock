# 0012: Stack: Next.js + Firebase

- **Status:** Accepted (revised the same day for the iPhone-first test group, see [0007](0007-platform.md))
- **Date:** 2026-11-27

## Context
The founder wanted Next.js for the frontend. They're "not a backend person" and asked for the backend that
real-world systems like this use and that fits best. They also asked to build on an existing best-practice
setup instead of wiring everything from scratch.

Every knock system needs:
1. The web app plus a **service worker** that shows notifications while the app is closed.
2. A **database**: people, neighbour pairs, invites, live knocks, push tokens.
3. **Push delivery** through the browser's push service (Apple's for iPhone, Google's FCM for Chrome).
4. A **live channel**, so "Riya opened" shows up instantly while the app is open.
5. A **delayed job per knock**: at `expiresAt`, expire it and fade its notification.

Research notes (Nov 2026):
- Vercel's free plan runs scheduled jobs at most once a day (a beta allows every 15 minutes), so serverless
  Next.js alone can't do (5).
- Next.js 16 builds with Turbopack by default, so webpack-based PWA plugins don't apply. Next's official PWA
  guide uses a hand-written service worker.
- iPhone web push: Home Screen apps only, **every push must show a notification** (pushes that show nothing
  get the subscription revoked), no action buttons or vibration, and `localhost` doesn't work with Apple's push
  service.
- Pushes should be sent with `Urgency: high`; the default "normal" can be held while the phone sleeps.

## Decision
**Next.js (App Router, TypeScript) + Firebase.**

| Need | Choice |
|------|--------|
| Frontend | Next.js App Router, TypeScript; `app/manifest.ts` (standalone display, icons); service worker hand-written at `public/firebase-messaging-sw.js` |
| UI kit | **shadcn/ui + Tailwind CSS**, with components copied in from Arc UI, Pin UI and sensory-ui through the shadcn CLI; **Motion** when a component needs it ([0016](0016-look-motion-and-sound.md)) |
| Hosting | **Firebase App Hosting** (Firebase's recommended path for Next.js; one vendor). Deploys on push to a connected GitHub branch, so only with the founder's OK ([0015](0015-setup-and-deploys.md)) |
| Accounts | Firebase **Anonymous Auth** + display name ([0010](0010-identity.md)), created inside the Home Screen app |
| Database + live | **Firestore**; screens subscribe with `onSnapshot` |
| Writes / rules | **All writes go through callable Cloud Functions** (`acceptInvite`, `knock`, `open`, `notNow`, `setDoor`, …). Firestore security rules allow clients to read only what they're entitled to and write nothing directly except their own push tokens. Knock rules (one live knock per pair, cooldown, closed door) run in transactions in one place |
| Push | **Firebase Cloud Messaging for web** (supports Safari on iOS 16.4+), sending **data messages** with `Urgency: high`. Our service worker builds **every** notification itself and always calls `showNotification` (iPhone requirement), using `tag` to replace and `silent` for quiet ones. *Builder's call:* if FCM misbehaves on real iPhones, switch the sender to the plain `web-push` library with VAPID keys; the service worker barely changes |
| Expiry | A **task-queue function** (`onTaskDispatched`), enqueued at knock time with `scheduleTime = expiresAt`. It flips `live → expired` and sends the silent fade push. The UI also counts down from `expiresAt`, so it never shows a stale knock even if the task is late. Door auto-reopen uses the same mechanism |
| Local dev & tests | **Firebase Emulator Suite** (Auth, Firestore, Functions) under project id `demo-knock-knock`, with no real project needed. Pushes can't be emulated, so in emulator mode the push sender writes to a `pushOutbox` collection that tests read. **Vitest** for unit and rules tests, **Playwright** (WebKit and Chromium) for the smoke test |

**Starting point.** We don't start from a blank page:
- Scaffold with the official generators: `create-next-app` (TypeScript, App Router, ESLint) and `firebase init`
  (Firestore, Functions in TypeScript, Emulators; App Hosting is added at the first deploy, once the founder has created the Firebase project on Blaze).
- Use Firebase's official Next.js sample, [firebase/friendlyeats-web](https://github.com/firebase/friendlyeats-web)
  `nextjs-end` (from the [Integrate Firebase with a Next.js app](https://firebase.google.com/codelabs/firebase-nextjs)
  codelab), as the **reference for the Firebase wiring**: client/server Firebase app setup, emulator config,
  rules and `apphosting.yaml`. We port those patterns to TypeScript. We don't fork the app itself, which is
  JavaScript, has no tests, and is a restaurant-review app with AI features.

**Cost.** Cloud Functions and App Hosting need the **Blaze (pay-as-you-go)** plan with a card. Usage for ~9
testers should sit within the free quotas. Set a small budget alert.

## Alternatives considered
- **Convex** (hosted TypeScript backend with built-in live queries and a durable per-document scheduler): the
  closest fit for per-knock expiry with the least wiring. Not chosen: the founder preferred Firebase, which is
  more widely used and documented, especially in India.
- **Self-hosted Next.js + SQLite on one server:** no vendors, but someone has to run, update and back up a server,
  which is the job the founder doesn't want.
- **create-t3-app:** no Firebase option, and its core (Prisma, tRPC, NextAuth) would duplicate Firestore, Cloud
  Functions and Firebase Auth. Community T3 + Firebase forks are stale or focused on native apps.
- **Next.js on Vercel + Supabase or a hosted push service:** spreads logic across more vendors, and Vercel's
  cron limits still don't help with per-knock expiry.

## Principle check
- *A knock is a moment:* expiry is a first-class scheduled job, not a cleanup chore.
- Engineering rules: boring, well-supported tools (Firebase, Next.js); the emulator suite gives a local
  feedback loop for the knock → open smoke test.
