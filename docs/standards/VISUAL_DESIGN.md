# Visual Design Standard

The on-screen visual (the "background slide") must be bespoke, dense and correct. One design-token file is the single source of truth: `src/theme/tokens.ts`. Themes are data.

## Default theme: Dark Technical Classroom

| Token | Value | Use |
| --- | --- | --- |
| background | `#171717` with a subtle vignette | canvas |
| panel | `#252525` | cards and panels |
| border | `#454545` | panel borders |
| gold | `#E5C45B` | headings, key terms, active caption phrase |
| teal | `#59BFC3` | definitions |
| green | `#8ACB91` | positive, correct |
| coral | `#D98278` | risk, error, trap |
| blue | `#79A9D8` | process, neutral |
| purple | `#B49AD9` | secondary |
| text | `#F2F2F2` | body text |

A light theme ships too. QA check R-07 samples background and panel pixels in rendered stills and compares them with the active theme.

## Layout

- Header: `COURSE · CHAPTER · PART` with segmented progress pills.
- Scene title under the header.
- Main teaching panel in the center.
- Persistent `POINTS TO REMEMBER` footer with at most three takeaways for the current scene.
- Captions centered above the footer, never overlapping it (R-06); the active phrase is highlighted in gold.

## Typography

- Fonts are open-licensed and bundled with their OFL licenses in `public/fonts/`: Inter (text), JetBrains Mono (numbers and code), Noto Sans Devanagari (Hindi).
- Minimum sizes: hero equation 44 px, card body 24 px, labels 18 px.
- Contrast meets WCAG AA. Never rely on red and green alone: correct and wrong states also get icons (check and cross badges).

## Density and derivation

- Every beat's visual is authored for that beat's narration in this part. Templates contain structure only.
- Each main panel shows the key term, the relationship (arrow, chain, comparison or chart), and the number or formula being discussed.
- At most about 45 words on the main panel at once.
- Placeholder tokens (`TODO`, `TBD`, `lorem`, `{{`, `}}`, `[insert`, `XXX`, `PLACEHOLDER`, `Sample`, `Example Title`) are BLOCKERs (C-09).

## Synchronization

Elements appear through `visualCues` anchored to word timestamps from TTS ("reveal step 2 when the narrator says 'multiply'"), never by percentage interpolation and never by parsing narration at render time.

## Charts

- Both axes labeled with variable and unit (C-14).
- Key points marked (break-even, peaks, doubling points).
- Curve data computed from the formula through a `generator`, not typed by hand.
- Hypothetical charts are watermarked `ILLUSTRATIVE MODEL`.

## Overflow

Every text container reports overflow (`scrollWidth > clientWidth` or `scrollHeight > clientHeight`) to the diagnostics channel; any overflow in a QA still is a BLOCKER (R-04).
