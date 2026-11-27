# 0010: Identity: a name, kept in the browser

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
Neighbours connect through invite links ([0005](0005-who-can-knock.md)), so nobody needs to be discoverable. An
account only needs to persist on a person's phone. Onboarding friction is a core constraint.

## Decision
- Opening an invite (or the app for the first time) asks only: **"What should neighbours call you?"**
- The account is an anonymous account that lives in the Knock Knock Home Screen app on that phone (Firebase
  Anonymous Auth, see [0012](0012-stack.md)), plus the display name. It's created inside the Home Screen app,
  never in a Safari tab, because the two don't share storage on iPhone ([0007](0007-platform.md)).
- A phone number (or Apple ID email for FaceTime) is asked for **only** when you want call, FaceTime, WhatsApp
  or Signal hand-offs ([0002](0002-after-the-door-opens.md)). It's for those hand-off links only, not for logging in.
- **Deleting the Home Screen app, clearing its data or switching phones loses the account.** Recovery is re-sharing invite links. This
  is acceptable for a 2-week test; proper sign-in is a v1 question.

## Alternatives considered
- **Sign in with Google:** one tap on Android and it survives a phone change, but it adds a Google sign-in for
  a product pitched as feeling safer than WhatsApp.
- **Email magic link:** survives a phone change, but means leaving the app to check email, which is real
  friction for people who live in WhatsApp, and it needs an email service.

## Principle check
- Serves the onboarding constraint; collects the least personal data possible.
