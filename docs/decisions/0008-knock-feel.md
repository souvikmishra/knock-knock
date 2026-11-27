# 0008: How a knock feels: a distinct knock

- **Status:** Accepted (revised the same day for iPhone limits, see [0007](0007-platform.md))
- **Date:** 2026-11-27

## Context
Open question: "Notification design: how does a knock *feel* (sound, haptic)?"
The founder chose a "distinct knock" when we assumed Android. On iPhone web apps, notifications get **no action
buttons, no vibration patterns and no custom sound**, and every push must show a notification.

## Decision
**When the app is closed** (push notification, iPhone):
```
┌ Knock Knock · now ───────────────┐
│ 🚪 Arjun is knocking              │
│ 📞 call? · quick q · 15 min left  │
└───────────────────────────────────┘
  default sound · tap → full-screen door
```
- The text does the work: 🚪, who's knocking, way in, tag and time left, with the default notification sound.
- **Tapping opens the full-screen door** in the app, with **Open** and **Not now**.
- When the window ends, the push is replaced by a **silent** notification with the same `tag`,
  "Arjun knocked · 4:10". When the knock is opened, declined or taken back, the service worker closes it if it can.
  Replacing by tag must be checked on a real iPhone. If it doesn't replace, the fallback is a silent notification
  that the app clears on next launch.

**When the app is open:** a full-screen door with a real **knock-knock sound** and Open / Not now.

**On Android** (works, not tested in v0): the same notification plus Open / Not now buttons and a knock-knock
vibration pattern.

## Alternatives considered
- **Quiet knock** (silent notification): the gentlest, but knocks would often be missed within their window.
- **Tag sets loudness:** on iPhone web apps there's nothing to vary except sound on or off, and people would tag
  everything "need you".
- **Native app for a truly distinct knock** (custom sound, buttons, Time Sensitive): see the exit criterion in
  [0007](0007-platform.md).

## Principle check
- *A knock is a moment:* it arrives, and fades when the moment passes.
- *Not answering is normal:* the fade text is neutral, with no "missed" and no red badge.
