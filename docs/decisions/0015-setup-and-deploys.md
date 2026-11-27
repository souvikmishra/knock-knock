# 0015: Setup and deploys

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Found in review: notifications can't be tested locally. The Firebase emulators don't send pushes, and Apple's
push service rejects `localhost`. So real-iPhone testing needs the app deployed on HTTPS, and early, because
push delivery is the biggest risk. AGENTS.md says not to push, create remotes or deploy unless asked. Firebase
App Hosting deploys automatically when a connected GitHub branch is pushed.

## Decision
- **The founder creates** the Firebase project (Blaze plan with a card, plus a small budget alert) and, when
  needed, the GitHub repo and the App Hosting backend connected to it.
- **The coding agent asks for an explicit OK before the first deploy**, and before pushing to any branch that
  App Hosting deploys from. The first deploy comes early (step 5 of the Getting started plan in AGENTS.md), so we
  can test push on a real iPhone before building the rest.
- Local development needs **no real Firebase project**: the emulators run under a `demo-knock-knock` project id.
- **Invite links use Firebase App Hosting's free default domain** (`…hosted.app`). "knock.app" in these docs is
  a placeholder. Moving to a custom domain later breaks invite links already shared, which is acceptable for a
  2-week test.

## Alternatives considered
- **Pre-approve test deploys:** faster iteration, but deploys are outward-facing and the founder preferred to be
  asked.
- **A custom domain now:** avoids broken links later, but the founder doesn't have one for this yet.

## Principle check
- Engineering rules in AGENTS.md: no deploys or remotes unless asked.
