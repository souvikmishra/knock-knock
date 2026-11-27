# 0013: What the knocker hears back

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Found in review: the first spec only sent pushes to the person being knocked. The knocker learned the outcome
from a live update, which only works with the app on screen. With a 15 or 60 minute window, the knocker will
usually have locked their phone. For calls and FaceTime the **knocker dials**
([0002](0002-after-the-door-opens.md)), so if "Riya opened" doesn't reach them, Riya sits waiting. That's the
missed-call problem the product exists to fix.

## Decision
| Outcome | What the knocker gets |
|---------|-----------------------|
| **Opened** | A **high-urgency push** with the normal notification sound: "🚪 Riya opened · 📞 call now". Tapping it opens the Door's open screen with the big hand-off button. (iPhone web notifications can't carry a Call button, see [0007](0007-platform.md).) |
| **Not now** | A **silent** push (shown, no sound): "Riya: not now · maybe later today". |
| **Not in** (window ended) | **Nothing.** The knocker sees "Riya's not in. That's fine." the next time they open the app. |
| **Taken back** by the knocker | The recipient's knock notification is silently replaced by "Arjun's knock has passed" *(builder's call: iPhone requires every push to show something, so we can't just delete it)*. |

**After an open, if nobody acts:** when neither person has tapped a hand-off button within **5 minutes**, both
Door's open screens quietly change to "Door's open · reach out when you can". This is an in-app change only,
with no extra push *(builder's call)*. The knock stays `opened`.

## Alternatives considered
- **Push every outcome**, including "not in": the knocker always knows where they stand, but a buzz for silence
  turns not answering into an event.
- **The recipient dials instead:** no push to the knocker at all, but then the knocker may miss the call, and the
  recipient does the work for a knock they didn't start.

## Principle check
- *Zero small talk:* the knocker hears "opened" right away, so the conversation can start.
- *Not answering is normal:* silence produces no notification.
- *A knock is a moment:* an open that nobody acts on softens after 5 minutes instead of hanging there.
