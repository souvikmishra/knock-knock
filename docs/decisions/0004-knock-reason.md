# 0004: Knock reason: one optional preset tag

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Open question: "Can you say *why* you're knocking, and does that make it a text message again?"
A knock already says who is knocking, the way in ([0002](0002-after-the-door-opens.md)) and the window
([0003](0003-unanswered-knocks.md)). The founder values the *unsaid* context of a knock.

## Decision
A knock can carry **at most one tag from a fixed list**:

- `quick q`
- `5 min?`
- `plans?`
- `need you`

There's **no free text**. A knock is: who + way in + window (+ optional tag).

## Alternatives considered
- **Short free text (≈40 characters):** more expressive, but people will write "hey are you free to talk
  about…", which turns it back into texting, and it adds a channel for unwanted content.
- **Nothing extra:** the purest form, but there's no way to tell urgent from casual, so people may hesitate to open.

## Principle check
- *A knock is a moment, not a message:* it can't hold a message.
- *Zero small talk:* the tag sets expectations without starting a conversation before the door opens.
