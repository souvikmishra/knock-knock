# Knock Knock

> Don't text "hi". Knock.

## Pitch
Most conversations start with a "hi", a "hello", a "you there?", and then waiting. Knock Knock skips that. If you want to talk to someone, you go up and **knock**. If they open the door, they're free: you go straight in and talk or call, no hesitation. If they don't open, they're not around, and that's fine.

## Core flow
1. **Pick a person** (or a room).
2. **Knock**: one tap. You can add a reason, like "quick q", "call?" or "5 min?".
3. **They see the knock** and can:
   - **Open**: you're both in a chat or call right away.
   - **Not now**: a soft decline, maybe with a "knock again in 30m".
   - **Ignore it**: the knock fades after N minutes, and you see "they're not in".
4. No unread pile, no guilt. A knock is a moment, not a message.

## Ideas to explore
- **Door status**: open / closed / do not disturb. If someone's door is closed, knocking is discouraged, or the knock waits until the door opens.
- **Knocks expire** instead of piling up like unread messages.
- **No history before the door opens.** The conversation starts when both people are there.
- **Rooms**: knock on a group space (a team, friends, a house) and whoever's in answers.
- **Knock back**: one tap to return a missed knock once you're free.

## Open questions: decided
All settled for v0 on 2026-11-27. See [`docs/spec-v0.md`](docs/spec-v0.md) and [`docs/decisions/`](docs/decisions/).
- After the door opens → hand off to call, FaceTime, WhatsApp, Signal or meet ([0002](docs/decisions/0002-after-the-door-opens.md))
- Unanswered knocks → the knocker picks a 5/15/60 min window, then a faint "knocked" line with Knock back ([0003](docs/decisions/0003-unanswered-knocks.md))
- Why you're knocking → one optional preset tag, no free text ([0004](docs/decisions/0004-knock-reason.md))
- Who can knock → mutual neighbours via invite link, with limits ([0005](docs/decisions/0005-who-can-knock.md))
- Platform → installable web app, iPhone-first ([0007](docs/decisions/0007-platform.md))
- How a knock feels → [0008](docs/decisions/0008-knock-feel.md)
- Different from presence → [0009](docs/decisions/0009-different-from-presence.md)

## Next steps
- [x] Pick a platform for v0.
- [x] Sketch the 3 core screens: people/door list, incoming knock, the open conversation.
- [x] Decide what happens after the door opens.
- [ ] Scaffold the stack (see "Getting started" in `AGENTS.md`).
