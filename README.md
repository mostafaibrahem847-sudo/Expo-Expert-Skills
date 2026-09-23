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

The collection contains ten skills:

1. **Expo Parity Engineer** — writes clean code and keeps the web preview and the real phone
   (Expo Go via QR code) behaving identically.
2. **Expo Error Resolver** — diagnoses and fixes any error: TypeScript, Metro, runtime crashes,
   build failures, or backend/API errors.
3. **Expo Safe Refactor** — restructures and cleans up code without changing what it does.
4. **Expo Code Quality Analyzer** — reviews the codebase for performance, cleanliness, and
   complexity, with prioritized suggestions (read-only; it reports, it does not edit).
5. **Expo Premium Design** — reviews and upgrades visual design (color, type, spacing, motion,
   depth) so an app feels premium instead of generic.
6. **Expo Accessibility Auditor** — reviews and improves accessibility: screen reader support,
   touch target sizes, color contrast, focus order, RTL-correct accessibility, and dynamic text
   sizing.
7. **Expo Dependency Upgrade** — safely upgrades the Expo SDK and/or npm dependencies, handling
   breaking changes and deprecated APIs.
8. **Expo Release Manager** — prepares and manages app builds and releases: EAS Build config,
   versioning, EAS Submit, OTA updates, and environment/secrets setup.
9. **Expo Supabase Guardian** — reviews and improves the Supabase backend: database schema,
   Row Level Security (RLS) policies, auth setup, storage buckets, and query safety.
10. **Expo Test Writer** — writes and maintains automated tests with Jest and React Native
    Testing Library: unit tests for hooks/utils, component tests, and screen integration tests.

## Skill Table

| Skill | Purpose | When to use it |
|---|---|---|
| [`expo-parity-engineer`](./expo-parity-engineer) | Clean, professional code with identical web/phone behavior, and fully executed requests | Every task in an Expo / React Native project — bug fixes, blank screens, web-vs-phone differences, layout, fonts, RTL, audio, navigation, storage, networking, new features, refactors, dependency changes |
| [`expo-error-resolver`](./expo-error-resolver) | Find the root cause of an error, fix it, and prove the fix on a real device | Any error report — TypeScript, Metro bundler, red-screen runtime crashes, build failures, dependency conflicts, Supabase/API errors, console warnings |
| [`expo-safe-refactor`](./expo-safe-refactor) | Improve structure and readability without changing behavior or business logic | Refactoring, cleanup, restructuring, splitting, renaming, or simplifying existing code |
| [`expo-code-quality-analyzer`](./expo-code-quality-analyzer) | Read-only analysis of performance, cleanliness, and complexity with severity/effort ratings | Code review, audit, or "what can be improved" requests — it reports findings and does not edit code |
| [`expo-premium-design`](./expo-premium-design) | Make an app look and feel premium: color, typography, spacing, buttons, motion, depth | Design review, UI upgrades, "make it look professional/modern", or "it doesn't feel right" complaints |
| [`expo-accessibility-auditor`](./expo-accessibility-auditor) | Review and improve accessibility: screen reader support, touch target sizes, color contrast, focus order, RTL accessibility, dynamic text sizing | Accessibility review, screen reader (VoiceOver/TalkBack) checks, "is this usable by people with disabilities", inclusive/reachable requests |
| [`expo-dependency-upgrade`](./expo-dependency-upgrade) | Safely upgrade the Expo SDK and/or npm dependencies, handling breaking changes and deprecated APIs | Upgrading Expo, updating packages, bumping the SDK version, or fixing errors caused by outdated/mismatched dependencies |
| [`expo-release-manager`](./expo-release-manager) | Prepare and manage Expo builds and releases: EAS Build, versioning, EAS Submit, OTA updates, secrets setup | Building a real installable app, publishing to Google Play / App Store, bumping version numbers, pushing an over-the-air update |
| [`expo-supabase-guardian`](./expo-supabase-guardian) | Review and improve the Supabase backend: schema, RLS policies, auth setup, storage buckets, query safety | Reviewing/designing the database, adding a table, checking security/RLS, debugging "data doesn't show" issues, or checking if data is exposed |
| [`expo-test-writer`](./expo-test-writer) | Write and maintain automated tests with Jest and React Native Testing Library | Adding tests, checking coverage, or protecting a fix/feature from regressions |

## Installation

The package is published to npm. Install the skills with a single command:

```bash
npx expo-expert-skills install
```

This installs all ten skills. You can also install them individually:

```bash
npx expo-expert-skills install expo-parity-engineer
```

```bash
npx expo-expert-skills install expo-error-resolver
npx expo-expert-skills install expo-safe-refactor
npx expo-expert-skills install expo-code-quality-analyzer
npx expo-expert-skills install expo-premium-design
npx expo-expert-skills install expo-accessibility-auditor
npx expo-expert-skills install expo-dependency-upgrade
npx expo-expert-skills install expo-release-manager
npx expo-expert-skills install expo-supabase-guardian
npx expo-expert-skills install expo-test-writer
```

The CLI also supports:

```bash
npx expo-expert-skills install all
npx expo-expert-skills list
npx expo-expert-skills help
```

By default, skills are installed into `~/.agents/skills/`, the global skills directory defined
by the Agent Skills standard. This single shared location is auto-discovered by compatible
agents such as Pi and OpenCode, so one installation serves them all. Override the destination
with the `EXPO_EXPERT_SKILLS_DIR` environment variable:

```bash
EXPO_EXPERT_SKILLS_DIR=/path/to/your/skills npx expo-expert-skills install
```

## Usage

The skills are plain Markdown instruction files, so they work with any coding agent that can
read project files. How you point your agent at them depends on the agent:

- **Agent Skills-compatible agents** (Pi and OpenCode) discover skills installed into
  `~/.agents/skills/` automatically — no extra step needed.
- **Other agents** (Cursor, Codex, etc.): paste the relevant `SKILL.md` content into your
  `AGENTS.md` / rules file and keep each skill's `references/` folder in the repo so the agent
  can open it when needed.

Then name the skill you want at the start of your request:

> Use the expo-error-resolver skill. I'm getting this error: `<paste error>`

> Use the expo-premium-design skill. Review the Home screen design.

> Use the expo-code-quality-analyzer skill on the RecipeDetail screen.

The skills are independent — use one or all ten. The only hand-off is that
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
├── expo-accessibility-auditor/
│   └── SKILL.md
├── expo-dependency-upgrade/
│   └── SKILL.md
├── expo-release-manager/
│   └── SKILL.md
├── expo-supabase-guardian/
│   └── SKILL.md
├── expo-test-writer/
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
