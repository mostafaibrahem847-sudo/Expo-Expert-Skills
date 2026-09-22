# expo-agent-skills

A collection of agent skills for building **Expo / React Native** apps with an AI coding agent
(Claude Code, Cursor, Codex, opencode, or similar). Each skill is a focused set of instructions
the agent follows for a specific kind of task.

## Skills in this collection

| Skill | Use it for |
|---|---|
| [`expo-parity-engineer`](./expo-parity-engineer) | Every task: writes clean code, and guarantees the web preview and the real phone (Expo Go via QR code) behave identically. Also enforces professional project structure and standards. |
| [`expo-error-resolver`](./expo-error-resolver) | Any error — TypeScript, bundler, runtime crash, build failure, backend/API error. |
| [`expo-safe-refactor`](./expo-safe-refactor) | Restructuring/cleaning up code without changing what it does. |
| [`expo-code-quality-analyzer`](./expo-code-quality-analyzer) | Reviewing the codebase for performance issues, cleanliness, and complexity, with prioritized suggestions. Read-only — it reports, it doesn't edit. |
| [`expo-premium-design`](./expo-premium-design) | Reviewing and upgrading the visual design — color, type, spacing, buttons, motion, depth — to feel premium instead of generic. |

## The rule that applies to every skill: verify on the real phone

None of these skills trust a web preview / WebView render, and none of them generate or assume
screenshots on their own. For anything visual or runtime-behavior related, the agent will ask you
to:
1. Reload / rescan the QR code in **Expo Go** on your phone.
2. Reproduce the screen or the issue.
3. Send back what you see — a screenshot, or the exact error text.

This is intentional: a web preview is not an accurate stand-in for how the app actually looks and
behaves on a phone. The agent reasons from what you show it, not from what it imagines the code
would render.

## Install

Copy the skill folder(s) you want into wherever your agent loads skills from.

- **Skill-aware agents** (e.g. Claude Code): drop the folder(s) into your skills directory.
- **Other agents** (Cursor, Codex, opencode, etc.): paste the relevant `SKILL.md` content into your
  `AGENTS.md` / rules file, and keep each skill's `references/` folder in the repo so the agent can
  open it when needed.

You can use one skill or all five — they don't depend on each other, except that
`expo-code-quality-analyzer` and `expo-premium-design` hand off implementation work to
`expo-safe-refactor` / `expo-error-resolver` / `expo-parity-engineer` when you ask them to apply a
fix, if those are present.

## Tell it about your app: `PROJECT_CONTEXT.md`

Copy `expo-parity-engineer/assets/PROJECT_CONTEXT.template.md` to the ROOT of your Expo project as
`PROJECT_CONTEXT.md` and fill it in (stack, structure, conventions, brand, known issues). Every
skill here reads this file first, so the agent understands YOUR app before doing anything.

## Use it

Name the skill you want at the start of your request:

> Use the expo-error-resolver skill. I'm getting this error: <paste error>

> Use the expo-premium-design skill. Review the Home screen design.

> Use the expo-code-quality-analyzer skill on the RecipeDetail screen.

## Contributing

Issues and pull requests are welcome — especially real-world cases for
`expo-parity-engineer/references/parity-checklist.md` (web vs. Expo Go differences) and new
findings/patterns for `expo-code-quality-analyzer`.

## License

Add a `LICENSE` file of your choice (MIT is a common option).
