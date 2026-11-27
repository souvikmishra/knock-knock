# Knock Knock: v0 spec

> Don't text "hi". Knock.

- **Status:** Agreed, 2026-11-27
- **Decisions:** [docs/decisions/](decisions/) (0001–0016). This spec summarizes them. If they ever disagree, the
  decision file wins until this spec is updated.

Items marked *(builder's call)* were filled in while writing this spec, not discussed with the founder. They're
easy to change.

---

## 1. Who it's for and why

**For** people who already know each other: friends, family, close circles. The first users are the founder's own
circle, **all on iPhone** ([0001](decisions/0001-target-user-and-purpose.md), [0007](decisions/0007-platform.md)).

**Why:**
- Sending "hi" and waiting is pointless. You want attention, not small talk.
- In the real world you knocked. If they were in and willing, they opened. If not, the silence said it all, and
  nobody was rude.
- Missed-call ping-pong: you call, they don't pick up, you make other plans, they call back 5 minutes later.
- WhatsApp feels like an ad-filled marketplace, and better apps like Signal are hard to get everyone onto.

**What it is:** a **doorbell in front of every messenger**. Knock Knock gets two people to "yes, now", then hands
them off to a call, FaceTime, WhatsApp, Signal or meeting up. It never becomes the conversation itself.

**How it differs from presence** ([0009](decisions/0009-different-from-presence.md)): "online" and green dots are
passive and say nothing about *you, now*. A knock is a scoped ask (to you, now, this way, for this long) with an
explicit answer. There are no read receipts, no last seen and no typing indicators. The knocker only ever sees
**opened**, **not now** or **not in**.

## 2. Vocabulary

| Word | Meaning |
|------|---------|
| **Neighbour** | Someone you've connected with through an invite link **and the link's owner accepted**. Only neighbours can knock on each other |
| **Neighbour request** | What opening someone's invite link sends to its owner: "Riya wants to be neighbours" with **[Accept]** and **[No thanks]**. It expires after 7 days |
| **Door** | Your availability: **open** or **closed** (for 1 hour / until tomorrow) |
| **Knock** | A short-lived ask to talk. It has a **way in**, a **window** and an optional **tag** |
| **Way in** | How you want to talk if they open: 📞 call, FaceTime audio, FaceTime video, WhatsApp, Signal, 🤝 meet |
| **Window** | How long you're free: 5, 15 (default) or 60 minutes. The knock expires after it |
| **Tag** | At most one of: `quick q`, `5 min?`, `plans?`, `need you`. No free text |
| **Open** | Accept the knock. Both people get a one-tap hand-off |
| **Not now** | A soft decline the knocker hears about right away, with an optional "later today" |
| **Not in** | What the knocker sees when the window ends unanswered: "Riya's not in. That's fine." |
| **Knock back** | Returning a missed knock. It's a fresh knock with its own window and no obligation |

## 3. The flow

### 3.1 Knock → open → talk (the core path)
```
 Arjun (knocker)              Firebase                           Riya (neighbour)
 ───────────────              ────────                           ────────────────
 tap Knock on Riya
 pick 📞 call · 15 min · quick q
        │  knock() ──────────►  check rules (transaction):
        │                       neighbours? door open?
        │                       no live knock in pair? cooldown over?
        │                       create knocks/{id} status=live
        │                       enqueue expire task @ expiresAt
        │                       push to Riya (Urgency: high) ───►  🚪 "Arjun is knocking"
 "Knocking… 14:59"                                                  tap notification
 (locks phone)                                                      → full-screen door
                                                                    tap Open
                                        ◄──────────── open() ──────┘
                                status=opened, attach hand-off links
 🔔 "Riya opened · call now" ◄── push to Arjun (high)
 tap → Door's open                                                  "Arjun is calling you…"
 [ Call Riya now ]
        │ tel:+91…
        ▼
   phone call (outside Knock Knock)
```
When either app is on screen, it also updates live (`onSnapshot`), so nobody waits for a push they don't need.

### 3.2 Knock states
```
                 open()                      ┌───────────┐
          ┌────────────────────────────────► │  opened   │  hand-off shown to both; knocker pushed
          │                                  └───────────┘
          │      notNow(laterToday?)         ┌───────────┐
   ┌──────┴─┐ ─────────────────────────────► │  not_now  │  knocker: silent push "not now"
   │  live  │                                └───────────┘
   └──────┬─┘    expire task @ expiresAt     ┌───────────┐
          ├────────────────────────────────► │  expired  │  knocker: "not in" (in app only)
          │                                  └───────────┘  recipient: faint line + [Knock back]
          │      cancelKnock() by knocker    ┌───────────┐
          └────────────────────────────────► │ cancelled │  recipient's notification quietly replaced
                                             └───────────┘
```
- All end states are final. The first transition wins: a transaction checks `status == live`. User actions
  (`open`, `notNow`, `cancelKnock`) also require `now < expiresAt`; the `expireKnock` task is the one transition
  allowed at `now >= expiresAt`. An `open()` after `expiresAt` fails with "This knock has passed. Knock back?"
- **Take it back** (`cancelled`) *(builder's call)*: no cooldown, no faint line for the recipient.
- **Open but nobody acts** ([0013](decisions/0013-knocker-notifications.md)): if neither person taps a hand-off
  button within 5 minutes, both screens change to "Door's open · reach out when you can". The knock stays
  `opened`.

### 3.3 Rules
- Only **neighbours** can knock on each other ([0005](decisions/0005-who-can-knock.md)).
- **Opening an invite link never makes you neighbours.** It creates a **neighbour request** to the link's owner.
  Only after the owner accepts can either side knock.
  - A pending request **expires after 7 days**. No pile, no badge count, no history after it ends.
  - **No thanks is silent**: the requester only sees "waiting" until it expires.
  - One pending request per pair; asking again while one is pending changes nothing *(builder's call)*.
  - **Invite codes** *(builder's call)*: link codes are random with at least 128 bits of entropy (for example 22
    base62 characters) and are never human-typed. The type-in fallback is a **separate 6-character code**, single-use,
    expiring after 10 minutes. `requestNeighbour` is rate-limited per caller (for example 10 attempts per hour) and
    answers a bad, used or expired code only with "link not valid".
- You can't knock on a **closed door**. Nothing queues ([0006](decisions/0006-door-status.md)).
- **One live knock per pair**, in either direction *(builder's call: direction doesn't matter)*.
- **10-minute cooldown** before knocking the same person again after their `not_now`, or after your knock to them
  `expired`.
- **Knock back** is a normal knock and passes the same rules, except it skips the cooldown, since the cooldown
  protects the recipient and here the recipient is the one reaching back ([0005](decisions/0005-who-can-knock.md)).
  Each missed knock allows **one** cooldown-free Knock back; any further knock to that person follows the normal
  10-minute cooldown.
- Closing your door doesn't cancel knocks already live.
- Several missed knocks from one person collapse into one faint line, the latest *(builder's call)*. The line
  disappears at the recipient's local midnight ([0003](decisions/0003-unanswered-knocks.md)).

### 3.4 Hand-off ([0002](decisions/0002-after-the-door-opens.md))
| Way in | Knocker sees | Recipient sees |
|--------|--------------|----------------|
| 📞 Call | **[ Call Riya now ]** → `tel:` | "Arjun is calling you…" + [ Call Arjun ] fallback |
| FaceTime audio | **[ FaceTime Riya ]** → `facetime-audio:` | "Arjun is FaceTiming you…" + fallback |
| FaceTime video | **[ FaceTime Riya ]** → `facetime:` | "Arjun is FaceTiming you…" + fallback |
| WhatsApp | **[ Open WhatsApp ]** → `https://wa.me/<riya>` | **[ Open WhatsApp ]** → `https://wa.me/<arjun>` |
| Signal | **[ Open Signal ]** → `https://signal.me/#p/<riya>` | **[ Open Signal ]** → `https://signal.me/#p/<arjun>` |
| 🤝 Meet | "Riya's coming out 👋" | "Arjun's expecting you 👋" |

- For call and FaceTime, the **knocker dials**, so both phones don't call each other at once *(builder's call)*.
  The recipient's fallback button appears only if the knocker has the matching contact saved.
- The knock sheet only offers ways in the recipient accepts and has the contact for.
- For WhatsApp and Signal the recipient's button appears only if the knocker has added that contact (same rule as
  the call fallback above); otherwise the recipient sees just "Arjun is messaging you on WhatsApp", with no button.
- Other ways the other person accepts appear as small alternates.

### 3.5 Notifications ([0008](decisions/0008-knock-feel.md), [0013](decisions/0013-knocker-notifications.md))
iPhone web apps: no buttons, no vibration patterns, no custom sounds, and **every push must show a notification**.

| Event | Who | Notification | Sound |
|-------|-----|--------------|-------|
| Knock | recipient | "🚪 Arjun is knocking · 📞 call? · quick q · 15 min left" (tag `knock-<id>`) | default |
| Expired | recipient | replaces it: "Arjun knocked · 4:10" (same tag) | silent |
| Cancelled | recipient | replaces it: "Arjun's knock has passed" (same tag) | silent |
| Opened | knocker | "🚪 Riya opened · 📞 call now" | default, high urgency |
| Not now | knocker | "Riya: not now" (+ " · maybe later today" only if she chose it) | silent |
| Not in | knocker | none (shown in app) | — |
| Neighbour request | link owner | "Riya wants to be neighbours" (tag `request-<id>`) *(builder's call)* | default |

- A request push is one notification with no count. It isn't repeated, and nothing is sent when a request expires
  or is declined.

- Tapping any notification opens the app on the matching screen.
- When the recipient opens or declines **in the app**, the app closes the knock notification locally
  (`registration.getNotifications`), with no push needed.
- With the app open, an incoming knock shows the full-screen door with a knock-knock sound instead.

## 4. The three core screens

Mobile-first (iPhone), one column. Wireframes show layout, not visual design.

### Screen 1: Doors (home)
```
┌─────────────────────────────────────┐
│ Knock Knock              ⚙          │
│                                     │
│ Your door   ● Open                  │
│             [ Close for 1h ]        │
│             [ Close till tomorrow ] │
├─────────────────────────────────────┤
│ Arjun knocked · 4:10pm  [Knock back]│  ← faint, only today, one per person
├─────────────────────────────────────┤
│ Riya wants to be neighbours         │  ← one small row per request, gone after 7 days
│             [ Accept ] [ No thanks ]│
├─────────────────────────────────────┤
│ Neighbours                          │
│                                     │
│  Riya          🟢        [ Knock ]  │
│  Kabir         🚪 closed till 7pm   │
│  Meera         🟢        [ Knock ]  │
│  Dev           knocking… 12:40      │  ← your live knock
│  Tara          waiting for Tara…    │  ← your pending request (no Knock button)
│                                     │
│ [ + Invite a neighbour ]            │  → share sheet with your link; they become neighbours only once you accept
└─────────────────────────────────────┘
```
- 🟢 means only "door open". It is **not** an online indicator.
- Neighbour requests are plain rows, with no badge or counter on the app icon or in the header. A declined or
  expired request just disappears. The requester's pending row says only "waiting" and gives no hint of a decline.
- During a cooldown, the Knock button reads "Knock in 7 min" and is disabled.
- ⚙ Settings (not a core screen): name, phone number / FaceTime handle, which ways in I accept, my invite link
  (copy/reset, and "Get a one-time code" for the 6-character type-in fallback), remove a neighbour, notification help.

### Screen 2: Knock (knocker's sheet → recipient's incoming knock)
Knocker, after tapping **Knock** on Riya:
```
┌─────────────────────────────────────┐
│ Knock on Riya                       │
│                                     │
│ How?                                │  ← only ways Riya accepts
│  (📞 Call) ( FaceTime ) ( WhatsApp ) │
│  ( Signal ) ( 🤝 Meet )              │
│ Free for?   ( 5 )  (•15 )  ( 60 ) min│
│ Tag (optional)                      │
│  ( quick q ) ( 5 min? ) ( plans? )  │
│  ( need you )                       │
│                                     │
│            [  🚪 Knock  ]            │
└─────────────────────────────────────┘
        ↓ after knocking
┌─────────────────────────────────────┐
│ Knocking on Riya…                   │
│ 📞 call? · quick q                  │
│ 14:59 left                          │
│                     [ Take it back ]│
└─────────────────────────────────────┘
```
Recipient. With the app closed, a plain notification (no buttons on iPhone):
```
┌ Knock Knock · now ───────────────┐
│ 🚪 Arjun is knocking              │
│ 📞 call? · quick q · 15 min left  │
└───────────────────────────────────┘
```
Tapping it (or the app being open when the knock arrives, with a knock sound) shows the full-screen door:
```
┌─────────────────────────────────────┐
│                                     │
│               🚪                    │
│        Arjun is knocking            │
│     📞 call? · quick q              │
│          14:52 left                 │
│                                     │
│   [   Open   ]     [ Not now ▾ ]    │  ▾ = "later today"
│                                     │
└─────────────────────────────────────┘
```

### Screen 3: Door's open (both sides)
```
 Arjun                                  Riya
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ Riya opened ✓                │      │ Door's open ✓                │
│                              │      │                              │
│ You asked: 📞 call · quick q │      │ Arjun is calling you…        │
│                              │      │                              │
│  [    Call Riya now     ]    │      │  [    Call Arjun     ]       │
│                              │      │                              │
│  or [ FaceTime ] [ WhatsApp ]│      │  or [ FaceTime ] [ WhatsApp ]│
│                     [ Done ] │      │                     [ Done ] │
└──────────────────────────────┘      └──────────────────────────────┘
        after 5 min with no tap on either side:
        "Door's open · reach out when you can"
```
Other outcomes for the knocker (replacing the "Knocking…" card):
```
  Riya: Not now · maybe later today        Riya's not in. That's fine.
                         [ OK ]                                [ OK ]
```

### Small flow: invite + onboarding on iPhone ([0005](decisions/0005-who-can-knock.md), [0007](decisions/0007-platform.md), [0010](decisions/0010-identity.md))
Safari tabs and Home Screen apps don't share storage on iPhone, so the account is created **inside** the Home
Screen app, and the invite crosses over in a cookie (copied once when you add to Home Screen, iOS 17.2+).
```
 Message from Arjun: "knock on my door → <app domain>/k/<22-char-random-code>"
    ↓ tap (opens in Safari)
 Safari: "Arjun invited you to Knock Knock."
         Store invite code in a cookie.
         "First, add Knock Knock to your Home Screen:"
         [picture: Share ⬆ → Add to Home Screen → Add]
    ↓ user adds it, opens the 🚪 icon
 Home Screen app: reads the invite cookie
         "Arjun invited you to be neighbours."
    ↓
 "What should neighbours call you?"   [ Riya        ]  [ Next ]
    ↓
 "Knocks only reach you with notifications on."   [ Allow notifications ]  (needs a tap on iPhone)
    ↓
 Optional: "Add your number for calls, FaceTime, WhatsApp and Signal"  [ Add ] [ Later ]
    ↓
 Account created → app calls requestNeighbour(code) → request sent to Arjun
    ↓
 Doors screen: "Waiting for Arjun to accept"  (Arjun is a pending row, not yet a neighbour)

 Arjun's phone: "Riya wants to be neighbours"  [ Accept ]  [ No thanks ]
    ↓ Accept: both are neighbours, Riya's list shows Arjun with [ Knock ]
      No thanks: nothing is sent; Riya keeps seeing "waiting" until the request expires (7 days)
```
- The request is sent only after the account exists, because the callable needs a signed-in caller.
- If the cookie didn't carry over: "Tap Arjun's link again", or type a **6-character one-time code** that Arjun gets
  from Settings (single-use, valid 10 minutes, never the link code) *(builder's call)*.
- If the person already has the app, the link opens in Safari, which can't hand it to the app. Show
  "Open Knock Knock from your Home Screen and tap ‘Have a code?’" and ask Arjun for a one-time code *(builder's call)*.
- The app calls `navigator.storage.persist()` on every start until granted.
- Android/desktop (works, not tested in v0): the same flow with the browser's install prompt.

## 5. Data model (Firestore)
```
users/{uid}
  name: string
  door: 'open' | 'closed'
  doorUntil: Timestamp | null        // auto-reopen time
  ways: Way[]                        // ways in I accept
  timeZone: string                   // IANA, for "local midnight" and "tomorrow 8:00"
  createdAt: Timestamp

  Way = 'call'|'facetime_audio'|'facetime_video'|'whatsapp'|'signal'|'meet'

users/{uid}/private/contact          // owner-only; read by functions
  phone: string | null               // E.164
  facetime: string | null            // phone or Apple ID email

users/{uid}/tokens/{token}           // one per device/browser
  updatedAt: Timestamp

invites/{code}                       // one active personal link per user; reset = new code
  owner: uid                         // code: random, >= 128 bits (e.g. 22 base62 chars), never typed
  createdAt: Timestamp

inviteCodes/{shortCode}              // type-in fallback only; 6 chars, single-use
  owner: uid
  createdAt, expiresAt: Timestamp    // expiresAt = createdAt + 10 min
  usedAt: Timestamp | null

neighbourRequests/{id}               // owner-side record; one pending per pair; readable only by `to`
  from: uid                          // the person who opened the link
  to: uid                            // the link's owner
  fromName: string                   // snapshot of the requester's name, so the owner sees who is asking
  createdAt, expiresAt: Timestamp    // expiresAt = createdAt + 7 days
  status: 'pending'|'accepted'|'declined'|'expired'   // the real status, never readable by `from`

sentRequests/{id}                    // requester-side view, same id; written only by functions; readable only by `from`
  from: uid                          // the requester (the person who opened the link); the read rule matches on this
  to: uid                            // the link's owner
  toName: string                     // snapshot of the link owner's name, for the "waiting for Tara…" row
  createdAt, expiresAt: Timestamp
  status: 'pending'|'accepted'       // never 'declined': a decline leaves it 'pending' until expiresAt, then it is deleted

neighbours/{pairId}                  // pairId = sorted(uidA, uidB).join('_')
  members: [uidA, uidB]
  createdAt: Timestamp

knocks/{knockId}
  from, to: uid
  fromName, toName: string           // snapshot for display
  wayIn: Way
  tag: 'quick q'|'5 min?'|'plans?'|'need you' | null
  windowMin: 5 | 15 | 60
  createdAt, expiresAt: Timestamp
  status: 'live'|'opened'|'not_now'|'expired'|'cancelled'
  laterToday: boolean                // with not_now
  answeredAt: Timestamp | null
  handoff: { forFrom: Link[], forTo: Link[] } | null   // set by open(); Link = {way, url}
  handoffTappedAt: Timestamp | null  // first hand-off tap; drives the 5-min fallback + usefulness metric
  pushSentAt, pushReceivedAt: Timestamp | null          // delivery metric, recipient's knock push

pushOutbox/{id}                      // emulator/test only: what would have been sent
```
- **Contact privacy:** a phone number or FaceTime handle never sits in a document another user can read until
  `open()` copies the needed hand-off links into that knock. Only the two parties can read a knock.
- **Security rules:** clients can read their own `users` doc and its subcollections, neighbours' public `users`
  fields (name, door, doorUntil, ways), `neighbours` docs they're in, `neighbourRequests` where they're `to` (the owner side, with the real status), `sentRequests` where they're `from`
  (the requester's view, which never shows a decline), and `knocks` where they're `from` or `to`. The `invites` and `inviteCodes` collections are not client-readable.
  **Clients write nothing directly** except their own push tokens. Everything else goes through callable functions.
- **Callable functions:** `createAccount(name, timeZone)`, `requestNeighbour(code)`, `answerNeighbourRequest(id, accept)`,
  `createInviteCode()` (the 6-character fallback), `resetInvite()`,
  `removeNeighbour(uid)`, `knock(to, wayIn, windowMin, tag?)`, `cancelKnock(id)`, `open(id)`,
  `notNow(id, laterToday)`, `markHandoffTapped(id)`, `setDoor(state, until?)`, `updateProfile(name?, ways?, phone?, facetime?)`.
- **Neighbour requests** *(builder's call)*: `requestNeighbour(code)` looks up a link code or a short code and creates
  a `pending` `neighbourRequests` doc for its owner (with the requester's `fromName`) and the matching `sentRequests` doc for the requester (with `from`, `to` and the owner's `toName`). It is rate-limited per caller (for example 10 attempts per hour) and replies
  "link not valid" for anything unknown, used or expired. Only the request's `to` can call
  `answerNeighbourRequest`; accepting creates the `neighbours` doc and sets the `sentRequests` doc to `accepted` in the same transaction. A decline
  sets only the owner-side status to `declined` and sends nothing to the requester; their `sentRequests` doc stays
  `pending` until `expiresAt`. Expired requests are treated as gone even before cleanup runs.
- **Scheduled work:** the `expireKnock` task runs at `expiresAt`. A `expireNeighbourRequest` task runs at each
  request's `expiresAt` and deletes both the owner-side and requester-side docs. Door auto-reopen is a task at `doorUntil`. When it runs it rechecks the user's current `doorUntil` and does nothing
  if it has changed or been cleared, so a closure that was extended or ended early is never broken by the earlier task.
- **Delivery metric** *(builder's call)*: the knock push carries a single-use token. The service worker posts it to
  an HTTPS function on receipt (inside `event.waitUntil`), which sets `pushReceivedAt`.
- **Retention** ([0014](decisions/0014-data-kept-during-test.md)): knock records, hand-off links included, are
  kept for the 2-week test, then all knocks and delivery logs are deleted. Testers are told this before joining.

## 6. Out of scope for v0
- Rooms and group knocks
- In-app chat or calls
- Free-text notes on knocks
- Finding people by phone number, contacts or search
- Native iPhone/Android apps (the exit path if web push isn't good enough, [0007](decisions/0007-platform.md))
- Testing on Android (it should work, but nobody in the group has one)
- Scheduled quiet hours (e.g. "door closed 11pm–8am every day")
- Knock history, stats, streaks
- Multiple devices per account and account recovery
- Custom domain ([0015](decisions/0015-setup-and-deploys.md))
- Desktop menubar app, browser extension
- Blocking/reporting beyond silently removing a neighbour
- A request inbox, request counts or badges, and reminders about pending requests

## 7. Risks
- **Add to Home Screen is real friction.** Every iPhone tester must do it before anything works. We measure how
  many invited friends finish onboarding.
- **Knocks look like ordinary notifications** on iPhone: no buttons, default sound. Focus modes may silence them.
  If knocks get missed for this reason, the exit criterion is a native app ([0007](decisions/0007-platform.md)).
- **The invite cookie must cross from Safari to the Home Screen app.** Check this first on a real iPhone. A
  short-code fallback (single-use, 10 minutes) is in the flow.
- **Replacing a notification by `tag`** (the fade) is unconfirmed on iPhone. Check it on a real device.
- **Lost accounts** if someone deletes the Home Screen app ([0010](decisions/0010-identity.md)). Acceptable for a
  2-week test.
- **Blaze plan** needs a card. Set a budget alert.

## 8. How we'll know v0 works ([0011](decisions/0011-v0-success.md))
The founder + ~8 friends, all on iPhone, use it for **2 weeks**. v0 works if:

| Signal | Target | Measured by |
|--------|--------|-------------|
| Delivery | ≤ 30 s to a locked phone in ≥ 9/10 knocks | `pushReceivedAt − createdAt` per knock (`pushSentAt` is kept for server-side diagnostics) |
| Habit | each person knocks ≥ 3×/week unprompted | knock counts per person per week |
| Usefulness | most opens lead to a real call/chat | `handoffTappedAt` on opened knocks, plus asking testers |
| Feel | nobody finds it rude or naggy | a short chat with each tester at the end |
| Onboarding (watched, no target) | invited friends who finish onboarding | accounts created vs invites sent |

**Before the test starts**, each of these must pass on at least two real iPhones with the deployed app:
1. Invite link in Safari → Add to Home Screen → the Home Screen app shows the invite, creates the account and
   sends the request; the link owner accepts and both can knock.
2. A knock arrives with the screen locked; tapping it opens the full-screen door. A knock sent while the app is
   visible also shows a notification, and a later locked-phone knock still arrives.
3. Open → the knocker gets "Riya opened" with their phone locked.
4. `tel:`, `facetime:`, `wa.me` and `signal.me` links work from the Home Screen app.
5. On expiry the notification fades to "Arjun knocked · 4:10" (or the fallback works).
6. A closed door blocks knocks, and it reopens on time.

## 9. Setup and deploys ([0015](decisions/0015-setup-and-deploys.md))
- Local development uses the Firebase emulators under `demo-knock-knock`. No real project or account needed.
- The founder creates the Firebase project (Blaze, budget alert), the GitHub repo and the App Hosting backend.
- The coding agent asks before the first deploy and before any push to a deploying branch.
- Invite links use the App Hosting default domain; "knock.app" in these docs is a placeholder.

## 10. Look, motion and sound ([0016](decisions/0016-look-motion-and-sound.md))
- **Sources:** Inspora for mood; Arc UI and Pin UI components through shadcn/ui; Linejig or the `anatomy` skill
  for illustrations; sensory-ui for UI sound cues; Bencho's Knock/Rap for the knock sound if its licence allows.
- **The hero:** the full-screen door (Screen 2) and the door opening into Screen 3. That's where motion and sound
  go. Everything else stays quiet and fast.
- **Rules:** motion reviewed with the `web-animation-design` skill; nothing delays the hand-off; no error sounds or
  red for "not now"/"not in"; no presence-style indicators; sounds can be switched off; respect reduced motion.
- **iPhone limits:** in-app sound only after a tap in the session and follows the silent switch; no web haptics;
  pointer-reactive figures must work with touch.
- **Open:** palette, type, light or dark. Decided with mockups while building the screens.
