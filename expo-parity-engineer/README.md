# expo-parity-engineer

An agent skill for **Expo / React Native** projects. It makes your coding agent behave like a
senior Expo engineer with three priorities:

1. **Clean, professional code.** Typed, consistent, minimal diffs, no mess.
2. **Web/phone parity.** Whatever you see in the web preview / WebView is what you get on the
   phone when you scan the QR code with Expo Go. No more "works on web, broken on my phone."
3. **Requests fully executed.** The agent turns your request into a checklist, implements
   every item, and verifies it before saying "done."

It is also built to save tokens: no long explanations, one solution at a time, and short reports.

## What's inside

```
expo-parity-engineer/
├── SKILL.md                            # core rules the agent reads on every task
├── references/
│   ├── parity-checklist.md             # causes of web vs Expo Go differences, by area
│   └── expo-standards.md               # clean-code, structure, data, security, workflow standards
└── assets/
    └── PROJECT_CONTEXT.template.md     # template describing YOUR app to the agent
```

`SKILL.md` stays short. The two reference files are read only when the task needs them.

## Install

Copy the `expo-parity-engineer` folder into wherever your agent loads skills from
(check your agent's docs for its skills/rules location).

- **Skill-aware agents** (for example Claude Code): place the folder in your skills directory.
- **Other agents** (Cursor, Codex, opencode, etc.): put the contents of `SKILL.md` into your
  `AGENTS.md` or rules file and keep the `references/` folder in the repo so the agent can open it.

## Make it understand your app

1. Copy `assets/PROJECT_CONTEXT.template.md` to the root of your Expo project as `PROJECT_CONTEXT.md`.
2. Fill it in: stack, structure, conventions, how you run the web preview and Expo Go, known issues.
3. The skill reads this file at the start of every task, then follows YOUR project's stack and
   patterns over its own defaults.

## Use it

Start any request with:

> Use the expo-parity-engineer skill. <your request>

Example:

> Use the expo-parity-engineer skill. The recipe screen looks right in the web preview but the
> spacing is wrong on my phone. Fix it.

The agent replies in a short fixed format:

```
✅ Done: <what was wrong / what was built>
Files: <changed files>
Parity: web ✔ | Expo Go ✔
Run: npx expo start -c
```

## Contributing

Issues and pull requests are welcome, especially new entries for `references/parity-checklist.md`
(real cases where web preview and Expo Go behave differently).

## License

Add a `LICENSE` file of your choice (MIT is a common option).
