# 0003: Unanswered knocks: a window, then knock back

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Open question: "What exactly happens to an unanswered knock? How long does it last?"
This is also where the founder's missed-call pain lives (a callback 5 minutes after you've made other plans).

## Decision
- The knocker picks a **window**, meaning how long they're free: **5, 15 (default) or 60 minutes**.
- While the window is open, the knock is live. The recipient can:
  - **Open:** hand off, see [0002](0002-after-the-door-opens.md).
  - **Not now:** a soft decline the knocker sees right away, with an optional "later today" hint.
  - **Ignore:** do nothing.
- When the window ends unanswered:
  - The knocker sees: **"Riya's not in. That's fine."**
  - The recipient sees **one faint line**, "Arjun knocked · 4:10pm", with no badge or counter. It disappears at
    the recipient's local midnight.
  - That line has a **Knock back** button. A knock back is a **fresh knock** with its own way in and window,
    so the original knocker is free to ignore it. A late reply becomes a question, not an obligation.
    Each missed knock allows one cooldown-free knock back; further knocks follow the normal cooldown
    ([0005](0005-who-can-knock.md)).
- Several missed knocks from the same person collapse into one line (the latest).

## Alternatives considered
- **Window, then vanish:** no trace at all. It's the purest "moment", but the recipient never learns someone
  knocked, so there's no gentle way to reach back.
- **A fixed 10 minutes for everyone, then vanish:** simplest, but it can't express "I'm free for the next hour",
  so it does less for the missed-call problem.

## Principle check
- *A knock is a moment, not a message:* knocks expire; the faint line is gone by midnight.
- *Not answering is normal:* "Not in. That's fine." wording; no badge, no counter.
- *No guilt:* a knock back carries no obligation for either side.
