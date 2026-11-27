# 0007: Platform: installable web app (PWA), iPhone-first

- **Status:** Accepted (revised the same day: the test group turned out to be all iPhone)
- **Date:** 2026-11-27

## Context
Open question: "Platform: mobile first, web, desktop menubar?"
Two forces pull against each other:
- Joining must take almost no effort: someone taps an invite link and is in.
- A knock only counts if it reaches a locked phone within its 5–60 minute window.

We first assumed an Android-heavy group. The founder then confirmed that **they and everyone in the test group
use iPhones**.

What iPhone web apps can and can't do (Nov 2026):
- Web push works only for a web app **added to the Home Screen** (iOS 16.4+). In a Safari tab it doesn't exist.
  There's no install prompt we can trigger: the user does Share → Add to Home Screen. Since iOS 26 this opens as a
  web app by default.
- Notification permission can only be requested from a user tap.
- **No action buttons, no vibration patterns, no custom sounds** on notifications.
- **Every push must show a notification.** Pushes that show nothing get the subscription revoked. The `silent`
  option (no sound) is supported.
- The Home Screen app has **its own storage**, separate from Safari's. Since iOS 17.2, adding to the Home Screen
  copies Safari's **cookies** once, but not localStorage or IndexedDB.
- Delivery goes through Apple's push service and is generally reliable. The Android OEM battery-saver problem
  doesn't apply.

## Decision
- v0 is an **installable web app (PWA)**, built and tested **iPhone-first** (Safari, iOS 17.2+; iOS 26 is the
  happy path).
- **Onboarding carries the invite through a cookie:**
  1. The invite link opens in Safari. The page shows who invited you and stores the invite code in a cookie.
  2. It shows a short how-to for Share → Add to Home Screen, with a picture.
  3. The person opens Knock Knock from the Home Screen. The app reads the copied cookie and shows
     "Arjun wants to be neighbours → Accept".
  4. Name → **[Allow notifications]** button (needs a tap) → done.
  The account is created **inside the Home Screen app**, never in the Safari tab. If the cookie didn't carry over,
  the fallback is "tap the invite link again" or a short code.
- The app calls `navigator.storage.persist()` on every start until it's granted, so iOS doesn't evict the
  account.
- Pushes are sent with high urgency.
- Android keeps working (it's the same web app) but isn't tested in v0.
- **Exit criterion:** if knocks routinely get missed during the test because they arrive late or don't stand out
  (no buttons, default sound, Focus modes), move to a native iPhone app (Expo/React Native via TestFlight,
  same Firebase backend).

## Alternatives considered
- **Native iPhone app via TestFlight (Expo):** custom knock sound, Open / Not now on the notification, a reliable
  fade, Time Sensitive delivery. But it costs $99/yr for the Apple Developer Program, friends have to install
  TestFlight and then the app, and Next.js shrinks to a landing page. Kept as the exit path.
- **Native Android first / cross-platform native:** ruled out once the group turned out to be all iPhone.

## Risks
- The Add to Home Screen step is real friction. It's the main onboarding risk and we watch it in the test.
- Knocks look like ordinary notifications (see [0008](0008-knock-feel.md)).
- Focus modes can silence knocks, as far as we know with no web-app way around it.
- Replacing a notification by `tag` (for the fade on expiry) must be checked on a real iPhone.

## Principle check
- *Respect the door:* the OS notification and Focus controls still apply.
- Serves the onboarding constraint from [0001](0001-target-user-and-purpose.md) as far as iOS allows: no store,
  no account form.
