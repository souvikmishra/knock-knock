# 0009: How this differs from presence

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Open question: "How is this different from presence/status in Slack, WhatsApp or Discord?"
This is a positioning decision, written from the answers to 0001–0008.

## Decision
- **Presence is passive and one-sided.** WhatsApp's "online" and "last seen", Slack's green dot and Discord's
  status say someone's app is open, not that they're willing to talk *to you, now*. You still send "hi" and wait.
- **A knock is a scoped ask with an explicit answer:** to you, now, this way, for this long. The answer is
  open, not now, or silence, and silence is normal.
- **Knock Knock sits in front of whatever messenger you already use** instead of replacing it.
- To keep it that way, Knock Knock shows **no read receipts, no "last seen", no online dot and no typing
  indicators**. The knocker only ever sees **opened**, **not now** or **not in**. The door's open/closed
  state ([0006](0006-door-status.md)) is the only status, and the person sets it on purpose.

## Alternatives considered
- **Showing presence too** (e.g. "active 2m ago"): it would help knockers time their knocks, but it brings back
  the surveillance feeling and the "they saw it and ignored me" anxiety.

## Principle check
- *Not answering is normal:* without "seen" there's nothing to feel ignored by.
- *Respect the door:* the only status is the one you set.
