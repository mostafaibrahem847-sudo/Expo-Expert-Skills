<p align="center">
  <img src="assets/hero.svg" alt="Expo Expert Skills" width="100%" />
</p>

<h1 align="center">Expo Expert Skills</h1>

<p align="center">
  Professional agent skills for <strong>Expo</strong> and <strong>React Native</strong> development —
  written for AI coding agents that verify their work on a real device.
</p>

## What Is This?

`Expo Expert Skills` is a collection of specialized **agent skills** for Expo / React Native
development. Each skill is a focused set of instructions an AI coding agent follows for a
specific kind of task: writing clean code, debugging errors, refactoring safely, reviewing
code quality, or upgrading visual design.

The collection contains five skills:

1. **Expo Parity Engineer** — writes clean code and keeps the web preview and the real phone
   (Expo Go via QR code) behaving identically.
2. **Expo Error Resolver** — diagnoses and fixes any error: TypeScript, Metro, runtime crashes,
   build failures, or backend/API errors.
3. **Expo Safe Refactor** — restructures and cleans up code without changing what it does.
4. **Expo Code Quality Analyzer** — reviews the codebase for performance, cleanliness, and
   complexity, with prioritized suggestions (read-only; it reports, it does not edit).
5. **Expo Premium Design** — reviews and upgrades visual design (color, type, spacing, motion,
   depth) so an app feels premium instead of generic.

## Skill Table

| Skill | Purpose | When to use it |
|---|---|---|
| [`expo-parity-engineer`](./expo-parity-engineer) | Clean, professional code with identical web/phone behavior, and fully executed requests | Every task in an Expo / React Native project — bug fixes, blank screens, web-vs-phone differences, layout, fonts, RTL, audio, navigation, storage, networking, new features, refactors, dependency changes |
| [`expo-error-resolver`](./expo-error-resolver) | Find the root cause of an error, fix it, and prove the fix on a real device | Any error report — TypeScript, Metro bundler, red-screen runtime crashes, build failures, dependency conflicts, Supabase/API errors, console warnings |
| [`expo-safe-refactor`](./expo-safe-refactor) | Improve structure and readability without changing behavior or business logic | Refactoring, cleanup, restructuring, splitting, renaming, or simplifying existing code |
| [`expo-code-quality-analyzer`](./expo-code-quality-analyzer) | Read-only analysis of performance, cleanliness, and complexity with severity/effort ratings | Code review, audit, or "what can be improved" requests — it reports findings and does not edit code |
| [`expo-premium-design`](./expo-premium-design) | Make an app look and feel premium: color, typography, spacing, buttons, motion, depth | Design review, UI upgrades, "make it look professional/modern", or "it doesn't feel right" complaints |

## Installation

This repository is being prepared for publishing to npm. Once published, you will be able to
install the skills with a single command:

```bash
npx expo-expert-skills install
```

This installs all five skills. You can also install them individually:

```bash
npx expo-expert-skills install expo-parity-engineer
```

```bash
npx expo-expert-skills install expo-error-resolver
npx expo-expert-skills install expo-safe-refactor
npx expo-expert-skills install expo-code-quality-analyzer
npx expo-expert-skills install expo-premium-design
```

The CLI also supports:

```bash
npx expo-expert-skills install all
npx expo-expert-skills list
npx expo-expert-skills help
```

By default, skills are installed into `~/.agents/skills/`, the shared global skills directory
used by compatible agents such as Pi and OpenCode. Override the destination with the
`EXPO_EXPERT_SKILLS_DIR` environment variable:

```bash
EXPO_EXPERT_SKILLS_DIR=/path/to/your/skills npx expo-expert-skills install
```

> **Note:** npm publication has not happened yet. The commands above document the intended
> usage of the included CLI; they are not currently runnable via `npx`.

Until then, you can use the skills directly from this repository by copying the folder(s) you
want into wherever your agent loads skills from (see [Usage](#usage)).

## Usage

The skills are plain Markdown instruction files, so they work with any coding agent that can
read project files. How you point your agent at them depends on the agent:

- **Skill-aware agents** load a skills directory automatically. Drop the skill folder(s) into
  that directory (for example, the installer targets `~/.agents/skills/`).
- **Other agents** (Cursor, Codex, opencode, etc.): paste the relevant `SKILL.md` content into
  your `AGENTS.md` / rules file and keep each skill's `references/` folder in the repo so the
  agent can open it when needed.

Then name the skill you want at the start of your request:

> Use the expo-error-resolver skill. I'm getting this error: `<paste error>`

> Use the expo-premium-design skill. Review the Home screen design.

> Use the expo-code-quality-analyzer skill on the RecipeDetail screen.

The skills are independent — use one or all five. The only hand-off is that
`expo-code-quality-analyzer` and `expo-premium-design` may direct implementation work to
`expo-safe-refactor`, `expo-error-resolver`, or `expo-parity-engineer` when you ask them to
apply a fix, if those skills are present.

## PROJECT_CONTEXT.md

`PROJECT_CONTEXT.md` is a short, factual file at the root of your Expo project that describes
your app: stack, structure, conventions, how to run the web preview and Expo Go, and known
issues. Every skill reads it first so the agent understands **your** app before doing anything.

To create one, copy the included template:

```text
expo-parity-engineer/assets/PROJECT_CONTEXT.template.md
```

into your Expo project root as:

```text
PROJECT_CONTEXT.md
```

and fill it in.

## Verification Philosophy

These skills share one rule: **verification comes from the real device, not the web preview.**

A web preview / WebView is not an accurate stand-in for how an Expo app actually looks and
behaves on a phone — fonts, shadows, spacing, safe areas, and animation timing all differ, and
an error can appear on one target but not the other. For anything visual or runtime-related,
the skills instruct the agent to ask you to:

1. Reload or rescan the QR code in **Expo Go** on your phone.
2. Reproduce the screen or the issue.
3. Send back what you see — a screenshot or the exact error text.

The agent reasons from what you show it, not from what it imagines the code would render. This
repository encodes that philosophy in the skills; it does not itself run Expo Go or perform
that verification on your behalf.

## Repository Structure

```text
.
├── bin/
│   └── expo-expert-skills.js            # CLI installer (Node.js built-ins only)
├── assets/
│   └── hero.svg                         # project hero graphic
├── expo-parity-engineer/
│   ├── SKILL.md
│   ├── README.md
│   ├── references/
│   │   ├── expo-standards.md
│   │   └── parity-checklist.md
│   └── assets/
│       └── PROJECT_CONTEXT.template.md
├── expo-error-resolver/
│   └── SKILL.md
├── expo-safe-refactor/
│   └── SKILL.md
├── expo-code-quality-analyzer/
│   └── SKILL.md
├── expo-premium-design/
│   └── SKILL.md
├── package.json
├── README.md
└── LICENSE
```

## Contributing

Issues and pull requests are welcome. In particular:

- Real-world cases for `expo-parity-engineer/references/parity-checklist.md` (web vs. Expo Go
  differences).
- New findings and patterns for `expo-code-quality-analyzer`.
- New skills that follow the same real-device verification philosophy.

Please keep changes focused and preserve the existing skill content.

## License

[MIT](./LICENSE) © 2026 Mostafa Ibrahim.
