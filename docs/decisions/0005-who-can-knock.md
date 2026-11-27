# 0005: Who can knock: neighbours via invite link

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Open question: "Spam and abuse: who can knock on you? Rate limits?"
This also decides how new people join, and onboarding friction is a core constraint
([0001](0001-target-user-and-purpose.md)). The founder distrusts WhatsApp partly because anyone with your
number can reach you.

## Decision
- Two people become **neighbours** through a personal **invite link**, like `knock.app/k/<long-random-code>`, which
  you share anywhere (WhatsApp, Instagram, in person). Opening the link does **not** make you neighbours. It sends
  a **neighbour request** to the link's owner, who sees "Riya wants to be neighbours" with **[Accept]** and
  **[No thanks]**. Only after the owner accepts can either side knock. (*Clarification, same day, founder
  decision:* originally opening the link and tapping Accept made you neighbours directly. See below.)
- **Only neighbours can knock** on each other. Both sides agreed.
- **Neighbour requests:**
  - A pending request **expires after 7 days**. There is no pile and no badge count.
  - **No thanks is silent.** The requester just keeps seeing "waiting" until it expires.
  - Accepting makes the pair neighbours both ways.
- **Invite codes** *(builder's call)*:
  - Link codes are random with **at least 128 bits of entropy** (for example 22 base62 characters) and are
    **never meant to be typed by a person**.
  - The **type-in fallback** (see [0007](0007-platform.md)) uses a **separate 6-character code** that is
    **single-use** and **expires after 10 minutes**. It is not the permanent link code.
  - Asking for a neighbour is **rate-limited per caller** (for example 10 attempts per hour), and a wrong or
    expired code only ever says "link not valid", so nobody learns whether a code exists.
  - The link stays valid until its owner resets it. Because a leaked link can only produce a request the owner
    must accept, it is not given an expiry.
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
- **Permanent link, no confirmation** (the first version of this decision): opening the link made you neighbours at
  once. Rejected because a link leaked on Instagram or guessed would give a stranger permanent knocking access
  until the owner noticed and reset it. Also a review finding: the whole trust boundary rested on the code alone.
- **7-day link expiry** (links stop working after a week): shrinks the leak window, but people would have to keep
  re-sharing links, and a link in an old chat would silently stop working. Double opt-in covers the same risk
  without that friction.

## Principle check
- *Respect the door:* nobody can knock without mutual consent, and the link owner confirms every new neighbour;
  cooldown stops nagging.
- *No unread piles:* a neighbour request is a single row that expires after 7 days, with no badge count and no
  history. A decline is silent, so nobody gets a rejection to dwell on.
