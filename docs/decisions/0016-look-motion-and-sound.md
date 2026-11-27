# 0016: Look, motion and sound: sources and rules

- **Status:** Accepted
- **Date:** 2026-11-27

## Context
The founder named the design references to use for v0. What each one is (checked Nov 2026):

| Source | What it is | Licence / cost |
|--------|------------|----------------|
| [Inspora](https://www.inspora.design/) | A curated gallery of recent visual work (web, product, motion, illustration). It leans toward polished, animated, dark UI with vivid accents | Inspiration only, credited to individual creators |
| [Linejig](https://linejig.com/) | Interactive 3D line illustrations that react to the pointer, with an open-source engine (npm) and an agent skill. Ready-made figures for empty states, onboarding, errors and loaders | Engine, skill and styles MIT. 12 library figures free. Pro is $37 one-time, with checkout opening 5 Dec 2026 |
| `anatomy` skill | Crafted interactive isometric SVG figures of physical objects | Ours to make |
| [Arc UI](https://uiarc.dev/) | A React component library (256 components, 131 blocks) with lots of motion, installed through the shadcn CLI (`@uiarc/…`) and an MCP server | 122 components free. Pro is paid; keep Arc notices in the code |
| [Pin UI](https://www.pinui.xyz/#components) | Shadcn Labs. Components recreated from design shots (Lamp Switch, Liquid Tabs, Presence Cards…). Plain React + CSS + [Motion](https://motion.dev), installed through the shadcn CLI | MIT (name, logo and demo media excluded) |
| [Bencho](https://bencho.dev/) | About 200 interactive React blocks, plus **182 UI sounds**, including **Knock**, **Rap**, Latch, Creak, Chime and Bell | Has a paid tier. Licence terms weren't readable; **check before shipping anything from it** |
| [sensory-ui](https://www.sensory-ui.com/) | Shadcn Labs. Sound for shadcn/ui components through a `sound` prop. Cues are synthesized live with Web Audio (no audio files, about 28 kB). Respects reduced motion; can be switched off globally or per category | MIT |
| `web-animation-design` skill | Emil Kowalski's "Animations on the Web" (animations.dev) guidance | Ours to use |

## Decision

**1. Component setup.** Arc UI, Pin UI and sensory-ui all install through the shadcn CLI. So `web/` adopts
**shadcn/ui with Tailwind CSS**, and components are copied in as source we own. **Motion** comes in with the first
component that needs it, which Pin UI's will. *(Builder's call: this is the boring, well-supported way to use
all three sources. It's added to the stack in [0012](0012-stack.md).)*

**2. Where each source is used**

| Place | Source |
|-------|--------|
| Mood, colour, type | Inspora, for direction only. Never copy a specific creator's shot |
| **Full-screen door** (Screen 2), the hero of the app | A door figure from Linejig or made with the `anatomy` skill, reacting to touch. Plays the knock sound |
| **Door opening** (Screen 2 → 3) | The one hero animation of the app |
| Doors list, door toggle, knock sheet chips, settings | Arc UI and Pin UI components, restyled to one theme |
| Empty states, onboarding (Add to Home Screen how-to), "not in" | Linejig figures or `anatomy` figures |
| UI sound cues (tap, toggle, sheet open/close, door open) | sensory-ui |
| The knock sound itself | Bencho's **Knock** or **Rap** if its licence allows; otherwise synthesize one with Web Audio |

**3. Rules**
- **Motion review:** every piece of motion is reviewed with the `web-animation-design` skill before it's called
  done.
- **Motion never delays the conversation** (*zero small talk*). The door-opening animation can't hold back the
  hand-off button. Interface transitions stay short, and everything respects `prefers-reduced-motion`.
- **Not answering stays calm** (*not answering is normal*). "Not now" and "not in" get no error sound, no shake and
  no red. They're quiet, neutral states.
- **No fake presence** ([0009](0009-different-from-presence.md)). Components like Pin UI's Presence Cards may show
  only "door open/closed", never online, active or last seen.
- **Sound respects the door.** All in-app sounds can be switched off in settings. Notifications themselves can't
  have custom sounds on iPhone ([0008](0008-knock-feel.md)).
- **iPhone audio limits:** Web Audio only plays after a tap in the current session, and it follows the silent
  switch. If the app hasn't been tapped since opening, an incoming knock shows the door without sound.
- **iPhone has no web haptics.** Don't design around vibration.
- **Touch, not cursor:** Linejig figures react to the pointer. On a phone they must respond to touch or idle
  gently, so check this on a real iPhone.
- **Licences first:** check the licence before adding any component, figure or sound, and keep required
  notices. **Buying Pro tiers (Linejig, Arc, Bencho) is the founder's call**, so ask first. Default to free tiers.
- **Weight:** the door screen must open fast on a phone. Pull in only the components we use.

**Still open:** the actual visual direction (palette, type, light or dark). We'll settle it with mockups when
we build the screens (Getting started steps 2 and 7), using these sources.

## Alternatives considered
- **Build every component and sound from scratch:** full control, but slow, and it ignores sources the founder
  chose.
- **One large kit (e.g. MUI):** consistent, but generic, and it fits none of the references.

## Principle check
- *A knock is a moment:* the door and its opening are the one place we spend motion and sound.
- *Zero small talk:* animation never stands between "opened" and the hand-off.
- *Not answering is normal:* no failure sounds or visuals.
- *Respect the door:* sound is optional; nothing pretends to be presence.
