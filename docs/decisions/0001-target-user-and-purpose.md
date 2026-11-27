# 0001: Target user and purpose

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
The README pitches the idea but doesn't say who it's for or why it should exist. That answer shapes every
other decision (what happens after the door opens, who can knock, platform).

In the founder's words:
- Sending a bare "hi" makes no sense. You want someone's attention, not small talk, and you hesitate before
  sending it.
- In the real world you went to someone's house and knocked. If they were in and willing, they opened. If not,
  they didn't, and you got the message without anyone saying anything. That unsaid context is the point.
- Once you're talking, you don't need to stay in one app. You can move to Signal, WhatsApp, Instagram, a call,
  or meet in person.
- **Missed-call ping-pong:** you call, they don't pick up, you make other plans, they call back 5 minutes later,
  and now you have to cancel on someone.
- In India WhatsApp is the default, but it's become a marketplace full of ads and feels less safe. Signal is
  better, but you can't get everyone onto it.

## Decision
- **Who:** people who already know each other (friends, family, close circles). Starting with the founder's
  own circle, which is all on iPhone ([0007](0007-platform.md)).
- **What:** a **doorbell in front of every messenger**, not a new messenger. Knock Knock gets two people to
  "yes, now" and then hands them off to wherever they already talk.
- **Constraint:** joining must take almost no effort, because onboarding is what keeps good apps like Signal
  from spreading.
- **Problem to solve:** a knock has a clear time window, so a late reply never puts anyone on the hook
  (see [0003](0003-unanswered-knocks.md)).

## Alternatives considered
- **A team/work tool** (competing with Slack presence). Rejected: that's not the founder's pain, and work tools
  already have status and huddles.
- **A full messenger** (competing with WhatsApp/Signal). Rejected: it would face the same onboarding wall as
  Signal and ignores the insight that people should be free to talk wherever they like.

## Principle check
- *A knock is a moment, not a message:* the product is the moment of contact, not the conversation.
- *Zero small talk:* the reason the product exists.
- *Not answering is normal:* mirrors the real-world door.
- *Respect the door:* people you already know, not strangers.
