# Parity Checklist: Web preview / WebView vs Expo Go (phone)

Goal: identical behavior on both targets. Work through the section that matches the task.
Fix the first real cause. Do not list causes to the user.

## Contents
1. Quick triage order
2. Divergence catalog by area
3. Package safety
4. Restart and cache commands

## 1. Quick triage order ("web shows X, phone shows Y")

1. **Stale cache.** Old bundle in Metro or Expo Go. Restart with `npx expo start -c`, fully close and reopen Expo Go.
2. **Different code running.** Search for `Platform.OS`, `Platform.select`, `*.web.tsx`, `*.native.tsx`. One target may be using a different file.
3. **Different data.** Different env vars, different backend URL/keys, `localhost` on the phone, a stale auth session, different cached query data.
4. **Version mismatch.** Expo Go SDK vs project SDK, or mismatched package versions. Run `npx expo-doctor` and `npx expo install --check`.
5. **Runtime error on one target only.** Read the Expo Go red screen / Metro terminal AND the browser console. A silent web error can hide a native crash and vice versa.
6. **Rendering differences.** See the catalog below.

## 2. Divergence catalog by area

### Layout and styles
- Web needs a parent height for `flex: 1` and `%` sizes; native is more forgiving. Give every parent up the tree an explicit `flex: 1`.
- Use `StyleSheet` numbers and flexbox only. No CSS strings, no `vh/vw`, no `position: fixed`, no hover/cursor.
- Shadows: iOS uses `shadow*`, Android uses `elevation`, web maps `shadow*` to box-shadow. Set both `shadow*` and `elevation`.
- `overflow`, `zIndex`, and `position: absolute` can differ. Test stacking on both.
- Do not hardcode widths from a phone screenshot. A web window can be huge; use flex and max widths.
- Safe areas: use `react-native-safe-area-context`. Web has no notch, phones do.
- ScrollView / FlatList: web needs a bounded height; nested scrolling behaves differently on each.

### Fonts
- Load with `useFonts` and hold the splash screen until loaded. Unloaded fonts fall back silently on one target only.
- On native, each weight is usually a SEPARATE font family (e.g. `Inter_700Bold`); `fontWeight` alone does not switch font files. Use explicit family names everywhere.

### RTL and text direction (if the app supports RTL languages)
- `I18nManager.forceRTL(true)` needs a full app reload to take effect on native; web applies direction differently (`dir` / CSS direction).
- Prefer `marginStart/End`, `paddingStart/End`, `start/end`. Avoid `left/right`, `row-reverse` hacks, and manual `scaleX: -1` flips unless the same logic runs on both.
- Set `textAlign` explicitly where needed; default alignment differs between targets.
- Direction-implying icons (back arrows, chevrons) must flip consistently.

### Audio and video
- Web requires a user gesture before audio plays (autoplay policy). Native does not. Start playback from a press handler.
- Configure the audio mode for native (silent mode, background playback); it is a no-op or different on web.
- Use public or signed HTTPS URLs and verify they load on the phone's network.
- Release players on screen exit; leaks behave differently on each target.
- Check the SDK: `expo-av` was removed in SDK 55. Use `expo-audio` / `expo-video` on SDK 55+.

### Images and assets
- `require()` paths and remote URLs must be valid on both targets. Remote images need `width` and `height`.
- Do not rely on web-only formats. SVG needs `react-native-svg` on native.

### Storage and auth
- Web uses localStorage-like storage; native needs AsyncStorage / SecureStore. Configure the backend client's storage adapter per target in ONE helper.
- Session persistence differences can make one target look "logged out". For Supabase, check the storage adapter and set `detectSessionInUrl` to false on native.
- Client env vars must start with `EXPO_PUBLIC_`. After changing `.env`, restart with `-c`.

### Networking
- `localhost` / `127.0.0.1` fails on the phone. Use the LAN IP or `npx expo start --tunnel`.
- CORS errors appear on web only; native ignores CORS. "Works on phone, fails on web" is often CORS. "Works on web, fails on phone" is often localhost, cleartext http, or a firewall.
- Android blocks plain `http://` in production builds; use `https://`.

### Navigation
- Web adds URL handling and the browser back button; native does not. Avoid logic that depends on URL state unless linking is configured for both.
- Confirm required setup imports exist at the app entry (e.g. `react-native-gesture-handler` first import for React Navigation stacks).

### WebView (if a `WebView` component is used)
- `react-native-webview` does not render on the web target like it does on the phone. If a screen must match on both, isolate an `iframe` fallback in one helper, or avoid WebView for that content.
- Check `source` (uri vs html), `originWhitelist`, `javaScriptEnabled`, mixed http/https, injected JS timing, and `onMessage` bridge behavior.

### Animation and gestures
- `react-native-reanimated` and gesture-handler need correct setup; failures can be silent on one target. Use `useNativeDriver: true` only where supported.
- Do not rely on hover, right-click, or mouse events.

### Keyboard, status bar, haptics
- Keyboard avoidance differs per platform; test inputs on the phone.
- `expo-haptics`, status bar styling, and similar APIs can be native-only or no-ops on web; guard or choose modules with web no-op support.

## 3. Package safety (before adding any dependency)

- Works in **Expo Go** (no custom native code that needs a dev build)?
- Works on **web**, or has a safe no-op?
- Install with `npx expo install <pkg>` so the version matches the SDK.
- If it fails either check, choose an alternative supported by Expo.

## 4. Restart and cache commands

- Clear Metro cache: `npx expo start -c`
- Phone can't reach the dev server: `npx expo start --tunnel`
- Dependency mismatch: `npx expo install --check`, then `npx expo-doctor`
- Full reset if still stale: delete `node_modules/.cache`, restart with `-c`, force-close Expo Go, rescan the QR code.
