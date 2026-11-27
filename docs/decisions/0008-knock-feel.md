# 0008: How a knock feels: a distinct knock

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Open question: "Notification design: how does a knock *feel* (sound, haptic)?"
Web app limits ([0007](0007-platform.md)): no custom notification sound and no full-screen ringing. On Android,
web notifications can vibrate, show action buttons and replace themselves (same `tag`).

## Decision
**When the app is closed** (push notification):
```
┌ Knock Knock · now ───────────────┐
│ 🚪 Arjun is knocking              │
│ 📞 call? · quick q · 15 min left  │
│  [ Open ]   [ Not now ]           │
└───────────────────────────────────┘
```
- A short **knock-knock vibration** pattern (best effort; browsers may ignore it).
- **Open** and **Not now** action buttons (Android; on iPhone tapping opens the app).
- When the window ends, the notification is **silently replaced** (same tag) by "Arjun knocked · 4:10". When the
  knock is opened or declined, it's removed.

**When the app is open:** a full-screen door with a real knock sound and the same Open / Not now buttons.

## Alternatives considered
- **Quiet knock** (a silent notification): the gentlest, but knocks would often be missed within their window.
- **Tag sets loudness** ("need you" louder and sticky): more expressive, but everyone will tag everything
  "need you", and it's more to tune.

## Principle check
- *A knock is a moment:* it feels like an arrival, and fades when the moment passes.
- *Not answering is normal:* the replacement text is neutral, with no "missed" or red badge.
