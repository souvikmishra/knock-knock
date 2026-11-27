# Knock Knock

## Commands
```sh
npm run dev     # Firebase emulators (Auth 9099, Firestore 8080, Functions 5001, UI 4000; project demo-knock-knock)
                #   + next dev on :3000 (smoke uses :3100) pointed at them. Builds functions first; needs Java 21.
npm test        # Vitest under the Auth + Firestore emulators: unit, Firestore rules and web config tests.
                #   The functions emulator isn't started yet (step 2 extends this).
npm run check   # tsc --noEmit + ESLint for root tests/configs (tests/, e2e/, *.config.ts), web/ and functions/
                #   (web runs `next typegen` first so it works in a fresh checkout)
npm run smoke   # builds functions, then Playwright (WebKit iPhone 15 + Chromium) under the emulators:
                #   loads the home page, which signs in anonymously and shows "connected".
                #   Step 2 extends it to the real knock -> open -> tel: flow.
```
- Stop `npm run dev` before `npm run smoke` or `npm test`; emulator ports can't be shared.
- The functions emulator warns that Node 22 doesn't match the host's Node 24. Expected locally; Cloud Functions
  runs Node 22.

Product idea: instead of texting "hi" and waiting, you **knock**. If they open, you're talking right away. If they
don't, they're not around. See `README.md` for the pitch.

## Stage: step 1 done (scaffold + feedback loop); next: step 2
- The v0 spec is in `docs/spec-v0.md`. Every decision behind it is in `docs/decisions/` (0001–0016). Read
  both before building. If code and spec disagree, raise it; don't silently pick one.
- New product decisions get a new `docs/decisions/NNNN-title.md` (context, decision, alternatives, principle check).

## Stack ([0012](docs/decisions/0012-stack.md))
- **Next.js** (App Router, TypeScript) as an installable web app, tested **iPhone-first**
  ([0007](docs/decisions/0007-platform.md)). Hand-written service worker at `public/firebase-messaging-sw.js`.
- **UI:** shadcn/ui + Tailwind CSS; components copied in from Arc UI, Pin UI and sensory-ui through the shadcn
  CLI; Motion when a component needs it ([0016](docs/decisions/0016-look-motion-and-sound.md)).
- **Firebase:** Anonymous Auth, Firestore (live via `onSnapshot`), callable Cloud Functions for **all** writes,
  task-queue functions for knock expiry, FCM web push, App Hosting.
- **Tests:** Vitest, `@firebase/rules-unit-testing`, Playwright. Emulators for everything local.
- **Reference for Firebase wiring:** [firebase/friendlyeats-web](https://github.com/firebase/friendlyeats-web)
  `nextjs-end`. Port its patterns to TypeScript; don't fork the app.

## Layout
```
web/                 Next.js app (src/app, src/lib/firebase/, src/components/); web/AGENTS.md has Next 16 agent
                     notes: read it before writing Next-specific code
functions/           Cloud Functions (TypeScript, builds to functions/lib/): callables, expiry task, push sender
functions/src/rules/ pure knock rules (cooldown, one live knock, door, transitions), unit-tested (only the window helpers so far)
scripts/             helper scripts (require-java.mjs)
tests/rules/         Firestore security rules tests
e2e/                 Playwright smoke test
vitest.config.ts  playwright.config.ts  firebase.json  .firebaserc  firestore.rules
tsconfig.json  eslint.config.mjs   root type-check/lint for tests/, e2e/ and the root configs (web/ and functions/ have their own)
package.json         root scripts: dev, test, check, smoke
```
`apphosting.yaml` (step 5) and `firestore.indexes.json` do not exist yet.
`web/src/lib/utils.ts` is `export { cn } from "cn"`: the shadcn 4.x generator's output (the `cn` package is a
clsx + tailwind-merge drop-in) and registry components import it. Intended; don't replace it with a hand-written helper.

## Getting started (feedback loop first, then features)
Prereqs: Node 24.12+ (the Firebase client and test packages require it; the deployed Functions runtime stays on Node 22), Java 21 (emulators; `brew install openjdk@21`), `firebase-tools` (a root devDependency).
Steps 1–4 need no real Firebase project. Java 21 is keg-only: it's on PATH via `~/.zshrc` for interactive shells;
non-interactive shells (agents, scripts) need `export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"`.

1. **Scaffold and the four commands. (Done.)** `create-next-app` into `web/` (TypeScript, App Router, ESLint),
   `firebase init` (Firestore, Functions in TS, Emulators; App Hosting waits for step 5, it needs a real project), `shadcn init` in `web/`, port
   friendlyeats' `lib/firebase` setup to TS. Add Vitest and Playwright. `dev`, `test`, `check` and `smoke` all pass on an empty app (smoke can
   just load the home page at this point). Commit.
2. **Smallest knock → open, end to end.** Two emulator users made neighbours by a seed script; `knock()` and
   `open()` callables with the rules in transactions; Doors screen, knock sheet, full-screen door, Door's open
   screen, live via `onSnapshot`. No push. Turn the smoke test into the real knock → open → `tel:` check.
   Carry-overs from the step 1 review:
   - `npm run dev` should also watch-build functions (today it builds once in `predev`).
   - `npm test` needs the functions emulator and a functions build, and `fileParallelism: false` for the rules
     project once rules tests clear shared emulator state.
   - `firebase-status` can show "connected" from a cached anonymous user (fresh Playwright contexts are unaffected).
3. **Invites and names.** `/k/[code]`, `acceptInvite`, name step, the Safari → Home Screen cookie hand-over
   and the short-code fallback. The smoke test starts from an invite link.
4. **Push, locally.** Service worker, token registration, push sender writing to `pushOutbox` in emulator mode:
   knock push to the recipient, "opened" push to the knocker. Tests assert the outbox.
5. **First deploy and a real iPhone.** **Ask the founder first** ([0015](docs/decisions/0015-setup-and-deploys.md));
   they create the project and repo. Then add App Hosting (`firebase init apphosting`, `apphosting.yaml`). Check the pre-test list in spec §8 items 1–4 on real iPhones. If delivery
   or the invite hand-over fails, stop and report before building further.
6. **Expiry and the quiet outcomes.** Expiry task + fade push + faint line + knock back; Not now (+ later today);
   take it back; cooldown; the 5-minute "reach out when you can" fallback.
7. **Door and settings.** Open/closed with auto-reopen; settings (phone, FaceTime handle, ways in, invite reset,
   remove neighbour).
8. **Ready for the test.** Delivery-metric logging, `handoffTappedAt`, onboarding polish, the full spec §8
   checklist on real iPhones, the tester data notice ([0014](docs/decisions/0014-data-kept-during-test.md)).

## Design, motion and sound ([0016](docs/decisions/0016-look-motion-and-sound.md))
- **Mood:** [Inspora](https://www.inspora.design/) for direction only. Never copy a specific creator's work.
- **Components:** [Arc UI](https://uiarc.dev/), [Pin UI](https://www.pinui.xyz/#components),
  [Bencho](https://bencho.dev/), installed through the shadcn CLI and restyled to one theme.
- **Illustrations:** [Linejig](https://linejig.com/) (engine MIT, 12 free figures) or the `anatomy` skill.
- **Sounds:** [sensory-ui](https://www.sensory-ui.com/) for UI cues; [Bencho](https://bencho.dev/) sounds (Knock,
  Rap) for the knock, once its licence is checked.
- **Motion review:** use the `web-animation-design` skill (Emil Kowalski's animations.dev) for every piece of
  motion before calling it done.
- Motion never delays the hand-off. No error sounds or red for "not now"/"not in". Nothing that looks like online
  presence. Sounds can be switched off. Respect `prefers-reduced-motion`.
- Check the licence before adding any component, figure or sound. **Ask the founder before buying any Pro tier.**

## Product principles (check every decision against these)
- **A knock is a moment, not a message.** No unread piles, no guilt. Knocks expire.
- **Zero small talk.** Once the door opens, you're in the conversation with no extra step.
- **Not answering is a normal outcome**, not a failure, and shouldn't feel rude to either side.
- **Respect the door.** People control when they can be knocked on.

## Engineering rules (from the first line of code)
- Set up the feedback loop before features: one command each for dev, test, lint/typecheck, and a smoke test of the core knock → open flow. Put the commands at the top of this file.
- The smallest thing that works end to end beats complete layers. Get one knock from user A to user B and opened, then build out.
- Prefer boring, well-supported tools. Every dependency should earn its place.
- Small commits on your branch, one concern each. Don't push, create remotes or deploy unless asked.
- Before saying something works, run it and show the output.

## Keep this file current
When the stack, commands or layout change, update this file in the same commit.
