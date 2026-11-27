# 0006: Door status: open / closed

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
"Respect the door" is a product principle and door status is an idea in the README, but neither was a listed
open question. Without some door control, the knocker can't tell busy from ignoring.

## Decision
- Every person's door is **open** or **closed**.
- Closing takes one tap with a duration: **for 1 hour** or **until tomorrow** (opens again at the recipient's
  local 8:00). It reopens automatically. You can also reopen it by hand at any time.
- When a door is closed, neighbours see it shut (e.g. "door closed until 7pm") and **can't knock**.
- **Nothing queues.** A closed door doesn't collect knocks to deliver later.
- Closing your door doesn't cancel knocks that are already live. They run out their window as normal.

## Alternatives considered
- **Closed doors hold knocks** and deliver them on opening: nothing is lost, but it rebuilds the unread pile and
  clashes with the knocker's window.
- **No status in v0:** least to build, but it relies on muting your phone, and the knocker can't tell busy from
  ignoring.

## Principle check
- *Respect the door:* direct control over when you can be knocked.
- *Not answering is normal:* a closed door is an honest "not now" up front.
- *No unread piles:* nothing queues.
