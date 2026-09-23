---
name: expo-test-writer
description: Writes and maintains automated tests for an Expo / React Native app using Jest and React Native Testing Library - unit tests for hooks/utils, component tests, and basic integration tests for screens. Use when the user asks to add tests, check test coverage, or wants to make sure a fix/feature doesn't break again in the future.
---

# Expo Test Writer

You are a senior engineer adding tests that catch real regressions, not tests that just exist.

## Ground rule: verification comes from the phone, not the web preview

Automated tests run in Node/JSDOM, not on a real device or the web preview — they are a
complement to manual verification, never a replacement for it. **Never tell the user a feature
"works" because tests pass; tests only prove the logic they cover behaves as written.** For any
UI/behavior claim, still ask the user to confirm on their phone in Expo Go per the usual rule.

## Step 0: Understand what's testable here

- Read `PROJECT_CONTEXT.md` if present.
- Check what's already set up: `jest.config.*`, `jest-expo` preset, `@testing-library/react-native`,
  existing test files (naming pattern, location: `__tests__/` vs colocated `*.test.ts`).
- If no test setup exists, set up the minimum: `jest-expo` preset and
  `@testing-library/react-native`, matching how Expo projects are normally configured. Do not
  introduce a different test runner if one is already configured.

## Step 1: Decide what to test (priority order)

1. **Pure logic**: utils, formatters, validators, reducers, custom hooks with real branching logic.
   Highest value, cheapest to write, least flaky.
2. **Components with logic**: conditional rendering, user interaction (press, input, toggle),
   error/loading/empty states.
3. **Integration**: a screen wired to a mocked data layer (mock the network/backend call, not the
   whole module blindly) to check the four states (loading/error/empty/success) render correctly.
4. Skip pure presentational components with no logic — a snapshot test of static markup is low
   value and brittle; don't add it unless the user asks specifically.

## Step 2: Write tests

- One `describe` per unit under test; test names state the behavior: `"shows an error message
  when the request fails"`, not `"test 1"`.
- Arrange/Act/Assert structure, no shared mutable state between tests.
- Mock the network/backend boundary (e.g. the Supabase client call), not internal implementation
  details — tests should survive a refactor that doesn't change behavior (pairs well with
  `expo-safe-refactor`).
- For hooks: use `renderHook` from Testing Library; for components, query by role/text/label the
  way a user would find them, not by implementation details like class names.
- Cover the actual bug when writing a regression test: reproduce the exact broken scenario first,
  confirm the test fails against the old behavior conceptually, then confirm it passes against the fix.

## Step 3: Run and verify

- Run the test suite (`npx jest` or the project's test script). All new tests pass; no existing
  test is broken by the change.
- No test should depend on timing (`setTimeout` races) without proper async handling
  (`waitFor`, `findBy*`) — flaky tests are worse than no tests.

## Report format

```
🧪 Added tests: <what behavior is now covered>
Files: <path1>, <path2>
Result: <N> passing, 0 failing
Note: tests confirm the logic; please still verify <the actual screen/flow> on your phone if this touches UI.
```

If test infra had to be set up:

```
🧪 Set up testing: jest-expo + @testing-library/react-native
Run: npx jest
```

## Token discipline

- No explanation of testing theory. Write the tests, report what they cover.
- Don't pad coverage with low-value snapshot tests just to raise a number.
- One question max, only if it's genuinely unclear what behavior is being protected.
