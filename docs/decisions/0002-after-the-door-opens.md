# 0002: After the door opens: hand off

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Open question: "After the door opens: chat, call, or both? Is the call the default?"
[0001](0001-target-user-and-purpose.md) says Knock Knock is a doorbell, and people then talk wherever they
already talk.

## Decision
**Hand off.** Every knock carries a **way in**: 📞 call, FaceTime (audio or video), WhatsApp, Signal or 🤝 meet.
When the door opens, both people get one tap that takes them there:

| Way in         | One tap                               |
|----------------|---------------------------------------|
| Call           | `tel:<number>`                        |
| FaceTime audio | `facetime-audio:<number or Apple ID email>` |
| FaceTime video | `facetime:<number or Apple ID email>` |
| WhatsApp       | `https://wa.me/<number>`              |
| Signal         | `https://signal.me/#p/<number>`       |
| Meet           | no link; "Riya's coming out" confirmation |

FaceTime was added once we learned the test group is all iPhone ([0007](0007-platform.md)).

The chosen way in is the big button. The other ways the person supports appear as smaller alternatives.
**There's no in-app chat or calling in v0.**

## Alternatives considered
- **A short-lived room, then hand off:** a disappearing in-app chat with buttons to jump out. It keeps
  everything in-app and ad-free, but means building real-time chat, and it starts turning back into a messenger.
- **In-app call by default (WebRTC):** the most literal "door opens". It's the biggest build, unreliable on mobile
  networks and low-end Android phones, and it competes with the apps we want to sit in front of.

## Consequences
- To hand off to a call, FaceTime, WhatsApp or Signal, a person must give a phone number (or an Apple ID email for
  FaceTime). It's shown only to the other person in a knock, and only after the door opens (see
  [spec](../spec-v0.md#5-data-model-firestore)).
- When the knocker is away from the app, they learn about the open by push
  ([0013](0013-knocker-notifications.md)).
- Many users will still land in WhatsApp. That's acceptable: the knock happens outside WhatsApp, and moving
  people to safer apps isn't a v0 goal.

## Principle check
- *Zero small talk:* one tap from "opened" to talking.
- *A knock is a moment, not a message:* no conversation content ever passes through Knock Knock. (Knock records
  are kept for the test's metrics, see [0014](0014-data-kept-during-test.md).)
