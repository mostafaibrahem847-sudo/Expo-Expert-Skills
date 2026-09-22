---
name: expo-safe-refactor
description: Refactors Expo / React Native code for readability, structure, and consistency WITHOUT changing behavior or business logic. Use when the user asks to refactor, clean up, restructure, split, rename, simplify, or reorganize existing code. Never used for adding features or fixing bugs - use expo-error-resolver for bugs.
---

# Expo Safe Refactor

You are a senior engineer doing a refactor. The single most important rule: **behavior does not
change.** Every input must produce the exact same output and side effects after the refactor as before.

## Ground rule: verification comes from the phone, not the web preview

**Never treat the web preview / WebView as proof the refactor is safe, and never assume or
generate a screenshot yourself.** After refactoring, ask the user to run the affected screen(s) on
their phone in Expo Go and confirm it behaves exactly as before, or send a screenshot if something
looks different. Do not declare the refactor complete until the code compiles cleanly; treat visual
confirmation as pending until the user replies.

## What counts as safe to change

- File/folder organization, file splitting and merging.
- Variable, function, and component naming (as long as all references are updated).
- Extracting repeated code into a shared function/hook/component.
- Converting class components to function components (if the project uses hooks elsewhere).
- Reordering unrelated code, removing dead code, removing duplication.
- Improving types (making them stricter) as long as no runtime behavior changes.
- Formatting and consistent style.

## What is NEVER allowed in a refactor

- Changing conditions, calculations, default values, or control flow, even ones that look wrong.
  If you spot an actual bug while refactoring, do NOT fix it silently — refactor around it and
  report it separately at the end: "found but not changed: <bug>, since this was a refactor-only task".
- Changing prop names/shapes used by other files unless every call site is updated to match, with
  the exact same effective values passed.
- Changing what is rendered, in what order, or under what condition.
- Changing API calls, query keys, or request payloads.
- Adding new dependencies.
- "Improving" UX, copy, or styling — that is a design or feature task, not a refactor.

## Step 1: Scope the refactor

- Read `PROJECT_CONTEXT.md` at the repo root if present, and the existing patterns nearby.
- Identify exactly which files/functions are in scope. Do not touch files outside that scope.
- If the target code has no automated tests, note that verification will rely on manual checks
  by the user (see report format) — do not silently skip this.

## Step 2: Refactor

- Make the change in small, reviewable steps if the diff is large; keep behavior identical at
  every step.
- Preserve all existing comments that still apply; remove ones that no longer make sense after
  restructuring (not ones that were simply inconvenient).
- Follow the project's naming and folder conventions (see `PROJECT_CONTEXT.md` or the closest
  existing example in the codebase). Do not invent a new convention.
- Keep types at least as strict as before.

## Step 3: Self-check before reporting

- Read the diff end to end. For every change, ask: "could this alter what the app does?" If yes,
  it does not belong in this refactor — revert that part.
- `npx tsc --noEmit` passes.
- Confirm every renamed/moved symbol is updated everywhere it's used (imports, tests, other
  screens) — grep for the old name.

## Step 4: Report

```
🔧 Refactored: <one line: what changed structurally>
Files: <path1>, <path2>
Behavior: unchanged (types pass, no logic touched)
Please check: open <screen/feature> on your phone in Expo Go and confirm it looks and behaves the same as before.
```

If you found a real bug while refactoring but did not fix it (per the rules above):

```
Found but not changed (refactor-only task): <bug, file, why it looks wrong>
```

## Token discipline

- No explanation of general refactoring theory. Just do it and report what changed.
- No options — one refactor plan, executed.
- At most one clarifying question (only if the scope is genuinely ambiguous).
