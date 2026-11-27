# 0007: Platform: installable web app (PWA)

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Open question: "Platform: mobile first, web, desktop menubar?"
Two forces pull against each other:
- Joining must take almost no effort: someone taps an invite link in WhatsApp and is in.
- A knock only counts if it reaches a locked phone within its 5–60 minute window.
Most first users are on Android in India.

## Decision
- v0 is an **installable web app (PWA)**, tested **Android-first**.
- An invite link opens straight in the browser, with no app store. Onboarding asks for a name, then
  "Add to home screen" and permission for notifications.
- On iPhone, adding to the home screen is required before notifications work.
- Pushes are sent as **high urgency**. Android may hold back normal-urgency pushes while the phone sleeps.
- Onboarding includes a tip for Xiaomi, Oppo, Vivo and Realme phones: set Chrome's battery usage to
  "No restrictions". These phones' battery savers can delay web notifications.
- **Exit criterion:** if knocks routinely arrive late during the test (see [0011](0011-v0-success.md)), move to a
  native app.

## Alternatives considered
- **Native Android first:** the most reliable notifications, custom sounds and full-screen ringing. But
  link → Play Store → install → open is exactly the friction that keeps friends off Signal.
- **Cross-platform native (e.g. Expo):** reliable push on both platforms, but the same install friction plus app
  store review and release work. More than v0 needs to prove the idea.

## Risks
- OEM battery savers can delay web push even at high urgency. We can't fully fix this from the web, which is why
  the test measures delivery time.
- Web notifications can't use custom sounds or ring like a call (see [0008](0008-knock-feel.md)).

## Principle check
- *Respect the door:* the OS notification controls still apply.
- Serves the onboarding constraint from [0001](0001-target-user-and-purpose.md).
