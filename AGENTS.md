# Knock Knock

## Commands
> **Planned. None of these exist yet.** Step 1 of "Getting started" below creates them. Replace this note once
> they run.

```sh
npm run dev     # Firebase emulators (Auth, Firestore, Functions; project demo-knock-knock) + next dev
npm test        # Vitest: knock rules, Firestore security rules, callable functions (against emulators)
npm run check   # tsc --noEmit + ESLint, for web/ and functions/
npm run smoke   # emulators + Playwright (WebKit + Chromium): B invites, A accepts, A knocks, B opens,
                #   A sees "Riya opened" with a tel: link; asserts pushOutbox entries
```

Product idea: instead of texting "hi" and waiting, you **knock**. If they open, you're talking right away. If they
don't, they're not around. See `README.md` for the pitch.

## Stage: spec done, stack chosen, ready to scaffold
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

## Layout (planned)
```
web/                 Next.js app (app/, public/firebase-messaging-sw.js, lib/firebase/)
functions/           Cloud Functions (TypeScript): callables, expiry task, push sender
functions/src/rules/ pure knock rules (cooldown, one live knock, door, transitions), unit-tested
e2e/                 Playwright smoke test
firebase.json  firestore.rules  firestore.indexes.json  apphosting.yaml
package.json         root scripts: dev, test, check, smoke
```

## Getting started (feedback loop first, then features)
Prereqs: Node 22+, Java 21 (emulators), `firebase-tools`. Steps 1–4 need no real Firebase project.

1. **Scaffold and the four commands.** `create-next-app` into `web/` (TypeScript, App Router, ESLint),
   `firebase init` (Firestore, Functions in TS, Emulators, App Hosting), `shadcn init` in `web/`, port
   friendlyeats' `lib/firebase` setup to TS. Add Vitest and Playwright. `dev`, `test`, `check` and `smoke` all pass on an empty app (smoke can
   just load the home page at this point). Commit.
2. **Smallest knock → open, end to end.** Two emulator users made neighbours by a seed script; `knock()` and
   `open()` callables with the rules in transactions; Doors screen, knock sheet, full-screen door, Door's open
   screen, live via `onSnapshot`. No push. Turn the smoke test into the real knock → open → `tel:` check.
3. **Invites and names.** `/k/[code]`, `acceptInvite`, name step, the Safari → Home Screen cookie hand-over
   and the short-code fallback. The smoke test starts from an invite link.
4. **Push, locally.** Service worker, token registration, push sender writing to `pushOutbox` in emulator mode:
   knock push to the recipient, "opened" push to the knocker. Tests assert the outbox.
5. **First deploy and a real iPhone.** **Ask the founder first** ([0015](docs/decisions/0015-setup-and-deploys.md));
   they create the project and repo. Check the pre-test list in spec §8 items 1–4 on real iPhones. If delivery
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
