---
name: expo-dependency-upgrade
description: Safely upgrades the Expo SDK and/or npm dependencies in a React Native / Expo project, handling breaking changes and deprecated APIs. Use when the user asks to upgrade Expo, update packages, bump the SDK version, or when an error turns out to be caused by an outdated/mismatched dependency. Never bumps versions blindly - checks what actually changed and fixes call sites.
---

# Expo Dependency Upgrade

You are a senior Expo engineer doing a controlled upgrade. Nothing breaks silently.

## Ground rule: verification comes from the phone, not the web preview

An upgrade can succeed on the web preview and still crash Expo Go on the phone (native module
version mismatches, config plugin issues), or the reverse. **Never treat the web preview as proof
the upgrade is safe, and never assume a screenshot or a working state yourself.** After upgrading,
ask the user to fully close and reopen Expo Go (rescan the QR code) and confirm the app opens and
the main flows work, or send the exact error/screenshot if something breaks.

## Step 0: Baseline

- Read `PROJECT_CONTEXT.md` if present.
- Record the current `expo` version and the versions of key dependencies from `package.json`.
- Confirm the project currently builds: `npx tsc --noEmit`, `npx expo-doctor`.
- If anything is already broken before the upgrade, tell the user before proceeding — don't mix
  pre-existing bugs into the upgrade report.

## Step 1: Scope the upgrade

- **Single package** requested by name: upgrade just that one with `npx expo install <pkg>@latest`
  (or the exact version asked for) and check its changelog for breaking changes.
- **Expo SDK upgrade**: use `npx expo install expo@latest` then `npx expo install --fix` to align
  all Expo-managed packages to the new SDK. Read the official Expo SDK changelog for the target
  version — do not assume from memory; changelogs change every release.
- **"Update everything"**: prefer the smallest safe scope unless the user confirms a full bump.
  Ask ONE question only if the scope is genuinely ambiguous ("just Expo SDK, or all packages?").

## Step 2: Apply and reconcile

- Run the install/fix commands.
- Read the diff in `package.json` / lockfile to see exactly what moved.
- For the Expo SDK specifically, check known removals/renames for the target version before
  touching code, for example: `expo-av` was removed in SDK 55, replaced by `expo-audio` /
  `expo-video`. Treat every major-version jump as having similar landmines — check the changelog,
  don't assume nothing changed.
- Update every call site that used a removed/renamed/changed API. Do not leave a mix of old and
  new APIs in the codebase.
- Re-run `npx expo-doctor` and `npx tsc --noEmit` until clean.

## Step 3: Config and native changes

- Check `app.json` / `app.config.*` for now-required or now-invalid config plugin entries tied to
  upgraded packages.
- If a package now requires a development build (no longer works in Expo Go), say so explicitly
  in the report — this is a real constraint change, not a detail to bury.

## Step 4: Report

```
⬆️ Upgraded: <package/SDK> <old version> → <new version>
Changed: <call sites updated, briefly>
Config: <app.json/plugin changes, or "none">
Please check: fully close and reopen Expo Go (rescan the QR code), open the app, and try your main screens.
Send me: confirmation it works, or the exact error/screenshot if it doesn't.
```

If something needs a dev build now that didn't before:

```
⚠️ Note: <package> now requires a development build; it will not run in Expo Go anymore.
```

Blocked:

```
❌ Can't complete the upgrade: <real reason - unresolved peer conflict, missing native config, etc.>
Needed from you: <one specific step>
```

## Token discipline

- No general "here's what a major upgrade usually involves" explanation — report only what
  actually changed in this project.
- One upgrade plan, not several options, unless scope is genuinely ambiguous (max one question).
- Don't re-list every dependency version if nothing about it changed.
