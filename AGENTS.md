# Knock Knock

Product idea: instead of texting "hi" and waiting, you **knock**. If they open, you're talking right away. If they don't, they're not around. See `README.md` for the pitch, the core flow and the open questions.

## Stage: pre-code
No stack has been chosen and there's no code yet. The first job is to make decisions, not to write code:
1. Settle the open questions in `README.md` together with the human. Ask, don't assume.
2. Write each decision to `docs/decisions/NNNN-title.md`: context, the decision, the alternatives considered.
3. Write the v0 spec in `docs/spec-v0.md`: who it's for, the 3 core screens, what happens after the door opens, and what's explicitly out of scope.
4. Only then pick a stack and scaffold it.

## Product principles (check every decision against these)
- **A knock is a moment, not a message.** No unread piles, no guilt. Knocks expire.
- **Zero small talk.** Once the door opens, you're in the conversation with no extra step.
- **Not answering is a normal outcome**, not a failure, and shouldn't feel rude to either side.
- **Respect the door.** People control when they can be knocked on.

## Engineering rules (from the first line of code)
- Set up the feedback loop before features: one command each for dev, test, lint/typecheck, and a smoke test of the core knock → open flow. Put the commands at the top of this file.
- The smallest thing that works end to end beats complete layers. Get one knock from user A to user B and opened, then build out.
- Prefer boring, well-supported tools. Every dependency should earn its place.
- Small commits on your branch, one concern each. Don't push, create remotes or deploy unless asked.
- Before saying something works, run it and show the output.

## Keep this file current
When the stack, commands or layout change, update this file in the same commit.
