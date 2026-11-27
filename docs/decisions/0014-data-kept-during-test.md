# 0014: Data kept during the test

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Found in review: the success numbers ([0011](0011-v0-success.md)), such as knocks per person per week, delivery
time and hand-off taps, need knock records kept for the 2-week test. But [0002](0002-after-the-door-opens.md)
first said "nothing is stored after the hand-off", and opening a knock copies the hand-off links, which contain
phone numbers or Apple ID emails, into the knock record.

## Decision
- **Keep full knock records for the test**, hand-off links included: who knocked whom, when, way in, tag,
  window, outcome, push sent and received times, and hand-off taps.
- **Delete all knock records and delivery logs when the test ends.** Accounts and neighbour links can stay if the
  app keeps running. Any tester can ask to be deleted entirely at any time *(builder's call)*.
- **Tell testers this up front**, in plain words, before they join: what's kept, why, and when it's deleted.
- Only the two people in a knock can read it (security rules). The founder can see records through the Firebase
  console for the metrics.
- Knock Knock never stores any conversation content. Wording in 0002 was changed to say that.

## Alternatives considered
- **Keep the metrics, drop the numbers:** erase hand-off links once a knock's screens close. More private, but
  more to build. Not needed for a small test among friends who've been told.
- **Keep nothing:** delete each knock when it ends. The habit and delivery numbers would then rely on testers'
  own reports, which are less reliable.

## Principle check
- *A knock is a moment, not a message:* records exist only to measure the test, never as a history users see.
  No history screen ([spec §6](../spec-v0.md#6-out-of-scope-for-v0)).
