# Expo Engineering Standards

Senior-level defaults for writing clean, consistent, professional Expo / React Native code.

**Precedence:** the project's own conventions (see `PROJECT_CONTEXT.md` and the existing code)
ALWAYS win over the defaults below. Use these defaults only where the project has no convention.
Never introduce a new library or pattern when the project already has one that does the job.

## Contents
1. Know the SDK first
2. Folder structure (default)
3. TypeScript
4. Theme, styling, RTL, strings
5. Components and screens
6. State and data
7. Audio and media
8. Errors, loading, empty states
9. Performance
10. Dependencies and config
11. Security
12. Code hygiene and change discipline
13. Running, testing, building
14. Definition of done

---

## 1. Know the SDK first

- Read `package.json` for the `expo` version. The SDK decides which APIs are valid.
- Expo Go on the phone must match the project SDK. A mismatch causes phone-only failures. Check with `npx expo-doctor` and `npx expo install --check`.
- APIs get deprecated and removed. Example: `expo-av` was removed in SDK 55; use `expo-audio` and `expo-video`. Use what the installed SDK supports; do not migrate unless something is broken or the user asks.
- The New Architecture is the default on recent SDKs (Expo Go supports it from SDK 53).
- If unsure about an API, read the installed package's types or README in `node_modules` before using it.
- Do not switch navigation libraries (React Navigation vs Expo Router) unless asked.

## 2. Folder structure (default, when the project has none)

```
src/
├── navigation/     # navigators, route types
├── screens/        # one folder per screen
├── components/     # shared, reusable UI
├── features/       # domain logic by feature: hooks, queries, types, utils
├── services/       # backend client, audio service, API helpers
├── store/          # client/UI state stores
├── theme/          # colors, typography, spacing, radii, shadows
├── i18n/           # user-facing strings (if localized)
├── utils/          # small pure helpers
├── types/          # shared types
└── constants/      # non-visual constants, env config
```

Rules:
- Screens are THIN: compose components and call hooks. Logic lives in hooks and services.
- One component per file. Component files PascalCase; hooks `useSomething.ts`.
- Use a path alias (e.g. `@/`) configured in `tsconfig.json` instead of long relative imports.
- Before creating anything new, search the repo for an existing component/hook/util that already does it.

## 3. TypeScript

- `strict: true`. No `any`, no `@ts-ignore` (use `unknown` and narrowing, or fix the type).
- Type navigation params in one place; use typed navigation hooks.
- Type backend rows (generate types from the backend schema when possible).
- Props typed next to the component. No implicit `any` in callbacks.

## 4. Theme, styling, RTL, strings

- Colors, font families, spacing, radii, shadows come from the theme. No hardcoded hex values, magic spacing numbers, or font names inside components.
- `StyleSheet.create` at the bottom of the file. No inline style objects in lists or hot paths.
- Fonts: load once at app entry (`useFonts`), keep the splash visible until ready, use explicit family names per weight.
- If the app supports RTL: set direction ONCE at app entry, use logical props (`start/end`), never hardcode `left/right` for layout.
- User-facing text comes from the project's strings/i18n layer, not literals inside components.
- Touch targets at least 44x44; readable text sizes.

## 5. Components and screens

- Small and single-purpose. If a component passes ~150-200 lines or mixes UI with data logic, split it.
- Function components and hooks only. Extract repeated UI immediately (second use = component).
- Lists: `FlatList` with `keyExtractor` and a stable `renderItem`. Never `.map()` a long list inside a `ScrollView`.
- Images: use `expo-image` with fixed dimensions and a placeholder.
- Every data-driven screen handles four states: loading, error, empty, success.

## 6. State and data

- Follow the project's data layer. If it uses React Query, server data goes through it and is never copied into a client store. UI/local state goes in Context or Zustand.
- Define query keys in one place per feature.
- One backend client, created in one file, with the correct storage adapter per target (see parity checklist). Import it everywhere; never create a second client.
- Data access functions live in `features/*` or `services/`, not inside components.
- Read env vars in one config file (`EXPO_PUBLIC_*` only) and fail loudly with a clear message if one is missing.

## 7. Audio and media

- One audio service or hook owns playback (`play`, `pause`, `seek`, `stop`, state). Screens never call the audio API directly.
- Prefer pre-generated / stored media over generating on demand at runtime.
- Start playback only from a user action (required on web, harmless on the phone).
- Release/unload players on screen exit; surface loading, buffering, and error states in the UI.

## 8. Errors, loading, empty states

- No silent `catch`. Catch at the service/hook level, convert to a friendly user-facing message, and show it.
- One top-level error boundary.
- No leftover `console.log` in finished work (remove temporary `[PARITY]` logs).
- Network failures never crash a screen; offer a retry.

## 9. Performance

- Memoize only where it matters (list items, expensive derived data); do not wrap everything.
- Avoid creating objects/functions inline in list items and context values.
- Paginate or limit queries; select only the columns you need.
- Optimize images (sized, cached). Avoid heavy libraries for small tasks.
- Do not block first render with slow work.

## 10. Dependencies and config

- Install with `npx expo install <pkg>` (matches the SDK). To fix mismatches run `npx expo install --fix`; never hand-edit versions.
- Add a dependency only if the task truly needs it. Prefer built-in React Native / Expo APIs. Confirm it works on web AND in Expo Go.
- Do not add packages that require a custom dev build unless the user agrees.
- Keep `app.json` / `app.config.ts` tidy. Commit the lockfile; do not mix package managers.

## 11. Security

- Only public/anon client keys in the app. NEVER service-role keys, third-party API secrets, or anything private in app code or `EXPO_PUBLIC_*` variables.
- Scripts that need secrets live outside the app bundle (e.g. `scripts/`) and read a git-ignored `.env`.
- Rely on backend access rules (e.g. Row Level Security) for data protection.
- `.env` stays in `.gitignore`. Never print secrets in logs or reports.

## 12. Code hygiene and change discipline

- Minimal diff: change only what the task needs. No drive-by refactors, renames, or reformatting.
- Match existing patterns and naming. Consistency beats personal preference.
- No dead code, commented-out code, duplicated logic, or TODO litter.
- Naming: components PascalCase, hooks `useX`, constants UPPER_SNAKE_CASE, booleans `is/has/should`.
- Small pure functions; early returns over deep nesting.
- Import order: React/RN, third-party, alias imports, relative imports.
- If a fix touches many files, fix the root cause once instead of patching many places.
- Before finishing, re-read the diff for side effects. Never break working features.

## 13. Running, testing, building

Daily dev:
- Start: `npx expo start` (add `-c` after config/env/dependency changes or when things look stale).
- Phone can't connect: `npx expo start --tunnel`.
- Android emulator: press `a` in the Expo terminal or `npx expo start --android`.
- Web preview: `npx expo start --web` (must match the phone; see the parity checklist).

Before reporting done:
- `npx tsc --noEmit` passes; lint passes if configured.
- `npx expo-doctor` clean when dependencies or config changed.
- Verified on both targets (web preview and Expo Go), or the gap is reported.

Building later:
- Expo Go is for development. Native modules or production builds need a development build / EAS Build (`eas build`); OTA updates use `eas update`. Suggest this only when a task truly needs it.

## 14. Definition of done

1. The user's request is fully implemented (every item), with the smallest clean diff.
2. Parity confirmed on web preview and Expo Go, or the gap is reported.
3. Types pass, no `any` added, no stray logs, no dead code.
4. Uses theme tokens, string layer, shared components, and existing patterns.
5. Loading / error / empty states handled wherever data is involved.
6. Report delivered in the short required format.
