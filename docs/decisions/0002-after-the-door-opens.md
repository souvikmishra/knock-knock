# 0002: After the door opens: hand off

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Open question: "After the door opens: chat, call, or both? Is the call the default?"
[0001](0001-target-user-and-purpose.md) says Knock Knock is a doorbell, and people then talk wherever they
already talk.

## Decision
**Hand off.** Every knock carries a **way in**: 📞 call, WhatsApp, Signal or 🤝 meet. When the door opens,
both people get one tap that takes them there:

| Way in   | One tap                               |
|----------|---------------------------------------|
| Call     | `tel:<number>`                        |
| WhatsApp | `https://wa.me/<number>`              |
| Signal   | `https://signal.me/#p/<number>`       |
| Meet     | no link; "Riya's coming out" confirmation |

The chosen way in is the big button. The other ways the person supports appear as smaller alternatives.
**There's no in-app chat or calling in v0.**

## Alternatives considered
- **A short-lived room, then hand off:** a disappearing in-app chat with buttons to jump out. It keeps
  everything in-app and ad-free, but means building real-time chat, and it starts turning back into a messenger.
- **In-app call by default (WebRTC):** the most literal "door opens". It's the biggest build, unreliable on mobile
  networks and low-end Android phones, and it competes with the apps we want to sit in front of.

## Consequences
- To hand off to a call, WhatsApp or Signal, a person must give a phone number. It's shown only to neighbours,
  and only after a door opens (see [spec](../spec-v0.md#data-model)).
- Many users will still land in WhatsApp. That's acceptable: the knock happens outside WhatsApp, and moving
  people to safer apps isn't a v0 goal.

## Principle check
- *Zero small talk:* one tap from "opened" to talking.
- *A knock is a moment, not a message:* nothing is stored after the hand-off.
