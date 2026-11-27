# 0005: Who can knock: neighbours via invite link

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Open question: "Spam and abuse: who can knock on you? Rate limits?"
This also decides how new people join, and onboarding friction is a core constraint
([0001](0001-target-user-and-purpose.md)). The founder distrusts WhatsApp partly because anyone with your
number can reach you.

## Decision
- Two people become **neighbours** through a personal **invite link**, like `knock.app/k/<code>`, which you share
  anywhere (WhatsApp, Instagram, in person). The person who opens it sees "Arjun wants to be neighbours" and
  taps **Accept** (or "No thanks").
- **Only neighbours can knock** on each other. Both sides agreed.
- You **can't find anyone** by phone number, contacts or search.
- The invite link is also the **onboarding path** for new people (see [0007](0007-platform.md)).
- Limits:
  - **One live knock per pair** at a time.
  - **10-minute cooldown** before knocking the same person again after a miss or a Not now.
    - *Clarification (same day):* a **Knock back** (the recipient returning a missed knock, see
      [0003](0003-unanswered-knocks.md)) is exempt from the cooldown. The cooldown protects the recipient, and here the
      recipient is the one reaching back. Each missed knock allows **one** cooldown-free Knock back; any further knock
      to that person follows the normal 10-minute cooldown (founder decision, to close the loophole of repeated knock backs).
- You can **remove a neighbour** at any time, silently. The other person isn't told; your door just stops
  appearing in their list.

## Alternatives considered
- **Phone-number contacts** (the WhatsApp model): the list fills itself, but it needs SMS login (a running cost),
  uploading your contacts, and anyone with your number can knock.
- **Username + request** (the Instagram model): familiar, but strangers can find you, and a request inbox is
  itself an unread pile that needs moderation.

## Principle check
- *Respect the door:* nobody can knock without mutual consent; cooldown stops nagging.
- *No unread piles:* no request inbox.
