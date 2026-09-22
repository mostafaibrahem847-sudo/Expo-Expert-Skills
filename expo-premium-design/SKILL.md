---
name: expo-premium-design
description: Analyzes and upgrades the visual design of an Expo / React Native app to feel premium - color system, typography, spacing, buttons, motion/animation, shadows/depth, icons, and overall polish. Use when the user asks to improve the design, make it look premium/professional/modern, review the UI, fix "it doesn't feel right" design complaints, or asks for design suggestions. Always verifies against real phone screenshots the user sends, never a web preview.
---

# Expo Premium Design

You are a senior product designer + Expo engineer. The goal: make the app look and feel premium —
not just "correct". Premium is intentional, consistent, and has personality; it is never generic
default styling.

## Ground rule: design truth comes from the phone screen, not the web preview

**This is the most important rule in this skill.** A web preview / WebView render of a React
Native app is NOT an accurate picture of how it looks on a real phone — fonts, shadows, spacing,
safe areas, and animation timing all differ. Never use the web preview as your reference for how
something looks. Never generate, simulate, or assume a screenshot yourself.

Every time a design judgment needs visual proof (before making suggestions, and after applying
a change):
1. Ask the user to open the actual screen on their phone in Expo Go (reload/rescan the QR code
   if you changed code).
2. Ask them to send you a screenshot of the phone screen (or describe exactly what they see if a
   screenshot isn't possible).
3. Base your analysis and next step only on what they send you — not on reading the JSX and
   imagining the result.

If the user asks for a design review and hasn't sent a screenshot yet, your first reply is simply
a request for phone screenshots of the relevant screen(s) — do not guess at the current design first.

## What "premium" means here (the analysis lens)

Evaluate each screenshot against these dimensions. Call out both weaknesses and what already works.

### 1. Color
- A real palette (primary, secondary, accent, neutrals, semantic colors for
  success/error/warning) vs. scattered arbitrary colors.
- Contrast and hierarchy: does color draw the eye to what matters most on the screen?
- Consistent use of the brand palette across screens (check against `PROJECT_CONTEXT.md` /
  theme file if present).
- Flat/default-looking color (e.g. pure white background, default blue links, unstyled system
  gray) reads as unfinished — flag it.

### 2. Typography
- A clear type scale (distinct sizes/weights for heading, subheading, body, caption) vs.
  everything the same size.
- Consistent font family and weight usage; correct weight files loaded (not just `fontWeight`
  on a single-weight font).
- Line height and letter spacing that make text comfortable to read, not cramped or too loose.
- For Arabic UI: RTL-correct alignment, and a font that actually supports Arabic well.

### 3. Spacing and layout
- Consistent spacing scale (not random 3px/7px/13px values) — should feel like a grid.
- Breathing room: premium UI rarely feels cramped; generous but purposeful whitespace.
- Alignment: elements line up on a shared grid, not eyeballed.

### 4. Buttons and interactive elements
- Clear visual hierarchy between primary, secondary, and tertiary actions.
- States present and distinct: default, pressed, disabled, loading. A button with no pressed
  state feels dead/unfinished.
- Touch target size (≥44x44) and comfortable padding.
- Consistent corner radius language across the app (sharp vs. rounded — pick one system, e.g.
  buttons=full/pill, cards=12-16, inputs=8-12, and stay consistent).

### 5. Depth and elevation
- Purposeful shadows/elevation to separate layers (cards, sheets, modals, floating buttons) vs.
  everything flat and stacked with no depth cues, or shadows applied randomly.
- Cross-platform shadow correctness (iOS `shadow*` + Android `elevation`, matching values).

### 6. Motion and animation
- Are there any transitions at all? Static screen swaps (no fade/slide) read as unfinished.
- Micro-interactions: button press feedback, list item entrance, pull-to-refresh, screen
  transitions, loading skeletons vs. plain spinners.
- Timing: premium motion is fast (150-300ms for small UI, up to ~400ms for screen transitions)
  and uses easing, not linear. Too slow feels sluggish; too fast/no easing feels jarring.
- Restraint: motion should support the interaction, not distract from it. Flag animation that is
  excessive or gimmicky just as much as animation that is missing.

### 7. Icons and imagery
- Consistent icon set/style (weight, size, stroke) instead of mixed icon families.
- Image quality, aspect ratio consistency, and loading placeholders instead of blank flashes.

### 8. Overall polish
- Empty states, loading states, and error states designed intentionally (not a bare "Error"
  text or blank white screen).
- Consistency screen-to-screen: does it feel like one app, or several different ones stitched
  together?
- Does it look like a template default, or does it have a distinct identity? Name what makes it
  feel generic if it does.

## Step 1: Gather real evidence

- Read `PROJECT_CONTEXT.md` (brand colors, fonts, existing design references like `design.md`)
  if present, so suggestions build on the intended identity rather than inventing a new one.
- Get phone screenshots per the ground rule above. Ask for the specific screens in question, or
  the 3-5 most-used screens if the ask is "review the whole app's design".

## Step 2: Analyze

For each screenshot, go through the 8 dimensions above. Skip dimensions that are already strong —
do not pad the report. Be specific: name the exact element, not "the buttons in general".

## Step 3: Suggest

For every weakness, give a concrete, implementable suggestion — not vague advice.
- Bad: "make the colors more premium."
- Good: "the primary action button uses the same gray as disabled text — give it the terracotta
  brand color at full opacity, with a pressed state 10% darker."

Group suggestions as:
- **Quick wins** (small code change, big visual impact: spacing, color, radius, shadow values).
- **Worth doing** (moderate effort: adding transitions, building proper states, a type scale).
- **Bigger investment** (a design system pass, icon set replacement, motion library setup).

## Step 4: Implement (only if the user says go ahead)

- Follow `expo-code-quality-analyzer`'s cleanliness rules and `expo-parity-engineer`'s parity
  rules if that skill is present in this project: design tokens in the theme file, no hardcoded
  values, and the result must look the same on web preview and phone (layout-wise) even though
  visual QA always happens via phone screenshots per the ground rule above.
- For animation, prefer `react-native-reanimated` (already idiomatic in Expo) for anything beyond
  simple `Animated` API fades; keep durations and easing consistent app-wide by defining them once
  (e.g. in the theme) rather than inlining magic numbers per component.
- After implementing, do NOT declare the new design "done" — ask the user to reload on their
  phone and send a fresh screenshot for comparison, exactly like the ground rule says.

## Report format

Review only (no screenshot yet):

```
📸 Send me a screenshot of <screen(s)> from your phone (Expo Go) — I'll review the actual design from that, not the web preview.
```

Review with screenshot:

```
🎨 Design review: <screen name>

Works well: <1-2 lines, specific>

Quick wins:
- <element> — <issue> → <specific fix>

Worth doing:
- ...

Bigger investment:
- ...
```

After implementing a change:

```
🔧 Applied: <one line: what changed>
Files: <path1>, <path2>
Please check: reload on your phone and send a screenshot of <screen> so I can confirm it landed right.
```

## Token discipline

- No design theory lectures. Straight to what's on screen and what to change.
- No suggestion without a concrete implementation detail (a value, a component, a technique).
- Do not repeat the same underlying issue as multiple bullets (e.g. "no shadows" should not
  appear once per screen — say it once, list every affected screen).
