# 0011: How we'll know v0 works

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
We need a test small enough to watch closely and fix fast, but real enough to show whether people want to use it.

## Decision
**Test group:** the founder plus ~8 friends, **all on iPhone** ([0007](0007-platform.md)), for **2 weeks**.

**v0 works if all of these hold:**

| Signal | Target | How we measure |
|--------|--------|----------------|
| Delivery | A knock reaches a locked phone within **30 s** in **≥ 9 of 10** knocks | Server logs push-sent time; the service worker records push-received time against the knock |
| Habit | Each person knocks **≥ 3×/week** without being nudged | Knock counts per person per week |
| Usefulness | **Most** opened knocks turn into a real call or chat | Hand-off button taps after opens, plus asking testers |
| Feel | **Nobody** says it feels rude or naggy | A short chat with each tester at the end |

We also note how many invited friends finish onboarding (the Add to Home Screen step is the main friction).

If delivery fails, or knocks get missed because web notifications don't stand out, that triggers the
native-app exit criterion in [0007](0007-platform.md). Knock records are kept for the test to measure all this
([0014](0014-data-kept-during-test.md)).

## Alternatives considered
- **Founder + 1–2 people for a few days:** fastest check of push and hand-off, but says little about habit and may
  miss delivery problems.
- **A wider beta (30+):** would test whether invites spread on their own, but needs more polish, support and abuse
  handling. Better for v1.

## Principle check
- The "feel" signal checks *not answering is normal* and *respect the door* with real people.
