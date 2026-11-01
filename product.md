# Product Specification & Engine Architecture: Autonomous NotebookLM-to-Video Engine

This document provides a comprehensive technical, pedagogical, and aesthetic specification of the **NotebookLM-to-Video Rendering Engine**. It is designed to give reviewing LLMs, engineers, and creators an exhaustive reference on current settings, system architecture, pedagogical decisions, and identified vectors for future enhancement.

---

## 1. Executive Summary & Core Mission

### What This System Is
An autonomous, domain-agnostic pedagogical video production engine built on **Remotion (React + TypeScript)**, **Tailwind CSS**, and a **Hybrid TTS Audio Compiler** (Edge-TTS + Gemini TTS). The engine transforms dense domain knowledge (books, research papers, technical documentation, or NotebookLM notebooks) into high-fidelity, narrated, 1080p educational videos.

### The Pedagogical Philosophy
Traditional educational videos suffer from two extremes:
1. **Static slide decks with voiceover:** Low engagement, wall-of-text fatigue, zero temporal rhythm.
2. **Chaotic AI avatar / brain-rot content:** Distracting b-roll, erratic pacing, lack of conceptual depth.

Our engine enforces a structured **12-slide cognitive arc**:
- **Novice Mistake:** An intuitive, flawed assumption made by an identifiable persona (e.g., Raju buying on good news).
- **The Paradox:** The market/system does the exact opposite, creating cognitive dissonance.
- **Mental Models & Visual Telemetry:** Progressively revealed charts, force balances, and conceptual cards dismantle the mistake.
- **Active Recall:** An interactive quiz with an intentional thinking pause forces the viewer to predict before seeing the answer.
- **Synthesis:** An 8-point summary thread with a memorable chapter takeaway and next-lesson teaser.

---

## 2. Technical Stack & Environment

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Default AI Engine** | **Gemini 4 Argon** (`gemini-4-argon`) | Deep reasoning model; proxy routing via `free-gemini-api` |
| **Video Engine** | [Remotion](https://www.remotion.dev/) (v4.0.267) | Programmatic React-based canvas rendering |
| **Language & UI** | React 18, TypeScript, Tailwind CSS | Modular components, spring physics, zero external video assets |
| **Icons** | `lucide-react` | Dynamic icon mapping across domain templates |
| **Primary TTS** | `node-edge-tts` (`hi-IN-MadhurNeural`) | Fast, natural Indian Hindi/Hinglish male voice |
| **Secondary TTS** | `@google/genai` (`gemini-4-argon` / Charon) | High-fidelity voice fallback & direct audio synthesis |
| **Audio Analysis** | `music-metadata` | Precise per-beat duration parsing in seconds |
| **Schema Validation**| `zod` | Pre-render validation, strictly blocking Devanagari in UI |
| **Isolated Chapters**| `src/data/chapters/<slug>/` | Self-contained raw JSON, compiled JSON, and audio assets |
| **Rendering Format** | H.264 / AAC, 1920x1080, 30 FPS | Output directly to `out/<slug>.mp4` |

---

## 3. Visual Design System & Styling Rules

All visual layouts conform to a strict, high-contrast, editorial design system implemented in `src/components/SceneLayout.tsx`:

### 3.1. Canvas Specifications
- **Dimensions:** `1920 x 1080 px` (16:9 Full HD).
- **Framerate:** `30.0 fps`.
- **Canvas Background:** Warm editorial off-white `#F7F6F2`.
- **Padding:** Outer padding `56px 96px`.
- **Typography:**
  - Headings & Body: `'Inter', -apple-system, sans-serif`.
  - Breadcrumbs, Metrics & Code: `'JetBrains Mono', monospace`.

### 3.2. Top Header Bar
- **Top Row (Left):** Monospace uppercase breadcrumb in `#8B7355` (`COURSE · CHAPTER`).
- **Top Row (Right):** Horizontal segment indicator pills (`totalSegments` count):
  - Completed / Current: Solid terracotta `#C86D51` (`h-1.5 w-7 rounded-full`).
  - Upcoming: Neutral gray `#E2E0D8`.
- **Second Row:** Bold slide title (`scene.title`) in dark charcoal `#1E1E1E` (`text-4xl font-bold mt-2 tracking-tight`).

### 3.3. Center Main Card
- **Container:** `flex-1 my-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAE8E1] p-12 relative overflow-hidden`.
- **Dot-Grid Background:** `radial-gradient(#e5e7eb 1.5px, transparent 1.5px)` with `backgroundSize: '20px 20px'`.
- **Card Immobility:** The outer card container **never unmounts or flashes** between beats of the same scene. Only internal child elements enter via physics-based springs.

### 3.4. Bottom Subtitle Bar
- **Position:** Centered footer bar (`h-10 flex items-center justify-center`).
- **Typography:** `text-2xl text-[#2C2C2C] font-medium tracking-tight text-center truncate max-w-[1720px]`.
- **Role:** Strictly presents concise, professional English translations (`beat.en_subtitle`) under 16 words per beat.

### 3.5. Dynamic Bounding Box Collision Engine & Margin Guards
- **Defensive Multi-Pass Collision Resolver (`src/templates/DataVisualizer.tsx`):** Pre-calculates 2D bounding boxes for all active annotation pills. Runs a 3-pass loop checking horizontal overlap (`dx < w1 + w2 + 12px`) and vertical overlap (`dy < h + 10px`). When two pills collide on adjacent candles, the overlapping pill is automatically shifted by `±32px` (staggered downward for bottom callouts, upward for top callouts) and the SVG pointer line dynamically connects to the new shifted anchor.
- **Strict Y-Axis Margin Guard:** All chart elements (callout pills, peak indicators, live price badges) are strictly clamped within `[padTop - 15, svgH - padBottom - 28]` to guarantee zero clipping outside canvas borders or overlap with volume bars.
- **Text Wrapping Integrity (`src/templates/SummaryThread.tsx` & `src/templates/InteractiveQuiz.tsx`):** Summary steps use `leading-snug break-words` (replacing rigid `truncate`) so multi-word concepts are never clipped mid-sentence. Quiz cards dynamically scale typography between `text-2xl` and `text-3xl`.
- **Single-Pass Self-Correction Guardrail:** When automated QA detects a rendering collision or schema error, the engine automatically remedies the code and re-renders **strictly a maximum of one time per generation**, completely eliminating infinite build loops.

---

## 4. Current Audio, Pacing & Timing Settings

Following extensive calibration, the current engine enforces rapid, energetic pacing designed to eliminate dead air and maintain high cognitive engagement:

### 4.1. Edge-TTS Configuration
- **Voice:** `hi-IN-MadhurNeural` (warm, articulate Indian male mentor).
- **Speech Rate:** **`+2%`** (calibrated mentor pacing for clear, authoritative delivery).
- **Audio Format:** `audio-24khz-48kbitrate-mono-mp3`.

### 4.2. Calibrated Pause Rules (`scripts/compile_tts_audio.mjs`)
The duration of each beat in frames is calculated as:
$$\text{durationInFrames} = \left\lceil \frac{\text{audioDurationSec} \times 1000 + \text{pauseMs}}{1000} \times 30 \right\rceil$$

Where `pauseMs` is programmatically mapped based on the pedagogical beat category:
- **Standard Narration Beats (`pauseAfterMs: 120`, `260`, or `400`):** Compiles to **`260ms`** (~7.8 frames). Eliminates awkward sentence-ending silences between consecutive beats while giving the mentor's voice natural breathing room.
- **Chapter Takeaways & Phase Transitions (`pauseAfterMs: 600`):** Compiles to **`450ms`** (~13.5 frames). Provides clear conceptual punctuation before topic shifts.
- **Interactive Quiz Thinking Time (`pauseAfterMs: 4000`):** Compiles to **`3,200ms`** (~96 frames). Gives the viewer a deliberate thinking window with visual spinner before revealing the answer.

### 4.3. The 10-Second Hook Rule
- In earlier versions, introductory chat dialogue lasted over 25 seconds before showing a chart.
- **Current Pacing:** The opening scene is strictly limited to 2 beats:
  - **Beat b01:** 40% profit jump announcement (5.38s audio + 120ms pause = 165 frames).
  - **Beat b02:** Raju buys 100 shares at ₹152 (4.61s audio + 120ms pause = 142 frames).
- **Result:** The first candlestick chart and dramatic 7% price collapse begins at **exactly frame 307 (10.23 seconds)**.

---

## 5. Domain Personas & Bilingual Boundary

The project uses modular persona profiles defined in `src/data/personas.json`:

| Domain | Novice Persona | Mentor Persona | Environment & Analogy Context |
| :--- | :--- | :--- | :--- |
| **Finance / Trading** | **Raju** (Retail Trader, Amber) | **Sharma ji** (Chartist Mentor, Teal) | Indian NSE Market, Nifty, stocks in ₹ (Kesar Paints) |
| **Coding / Systems** | **Aarav** (Junior Dev, Amber) | **Vikram** (Staff Architect, Blue) | Production outage, P99 latency spikes, DB locks |
| **Psychology / Habits** | **Kabir** (Young Pro, Amber) | **Dr. Meera** (Psychologist, Purple) | Workplace stress, cognitive biases, dopamine spikes |

### Strict Bilingual Separation
- **Spoken Audio (`hindi_tts`):** Natural, warm Hinglish written in Devanagari script. Standard industry terms (`profit`, `volume`, `support`, `resistance`, `margin`) are retained phonetically.
- **UI State (`ui_state`):** **100% English only.** All card titles, subtitles, chart axis labels, annotations, quiz questions, and summaries must contain 0 Devanagari characters. This rule is enforced automatically via Zod regex:
  ```typescript
  const devanagariRegex = /[\u0900-\u097F]/;
  // If regex matches any UI string, validation halts with exit code 1.
  ```

---

## 6. The 7 Universal Scene Templates

### 6.1. `chat_story` (Opening Hook & Application Dialogue)
- **Visuals:** Vertical mobile-style message thread with stage direction pills (`italic text-base text-[#737373] bg-[#FAFAF8] rounded-full`).
- **Bubbles:** Themed message cards with persona badges (`RJ` in amber, `SJ` in teal), timestamp, and spring entrance (`damping: 15, stiffness: 120`).
- **State Management:** Messages accumulate across beats within the same scene. Previous messages stay locked in place; only newly added messages animate into view.

### 6.2. `data_visualizer` (Candlestick Charts & Telemetry Curves)
- **Math Engine:** Deterministic pseudo-random number generator (`src/utils/chartGenerators.ts`) generating reproducible OHLC candles, wicks, and volume bars.
- **Strictly Clean X-Axis Dates:** The bottom X-axis under volume bars is strictly reserved for clean dates/months (`Jan`, `Feb`, `Mar`, `Apr`). Pattern names (`Head`, `Shoulder`, `Breakdown`) are strictly prohibited from appearing on the X-axis.
- **Head & Shoulders On-Chart Geometry:** Draws 3 distinct amber highlight circles (`stroke="#D97706"`, `strokeWidth={2.5}`, `fill="none"`, `r={18}`) directly around the Left Shoulder, Head, and Right Shoulder peak candles, accompanied by callout pills positioned above each peak (`LEFT SHOULDER`, `HEAD (₹175)`, `RIGHT SHOULDER`) appearing only once `visibleCandles` reaches their respective candle indices (`>= 4`, `>= 12`, `>= 20`).
- **Neckline Geometry:** The neckline line segment starts cleanly at the first trough after the Left Shoulder (index 7), extends across the second trough to the right edge of the chart (never anchored at $x=50$ colliding with prior green candles), and places the `NECKLINE (₹142)` pill cleanly below the neckline near the breakdown candle.
- **Callout Pointers & Offsets:** Top callout pills are positioned at $y = \text{candleHighY} - 38 - \text{pillH}$ and bottom callout pills at $y = \text{candleLowY} + 38$, connected directly to the candle wick by a crisp `1.5px` vertical pointer line with a `3.5px` anchor dot at the wick tip.
- **Trendline Clipping:** All trendlines are clipped (`<clipPath>`) to the X-coordinate of currently visible candles so they never project into empty right-hand space, and only a single clean solid trendline is rendered (no duplicate dashed lines).
- **Live Price Tracking:**
  - A horizontal dashed line tracks the `close` of the latest visible candle.
  - A solid pill on the right Y-axis displays the exact live price in green (`#16A34A`) or red (`#DC2626`).
- **Y-Axis Formatting:** Formatted with currency symbol prefix (`₹160`, `₹150`, `₹140`).
- **Candle-Synced Annotations:** Annotations specify a `candleIndex` and remain hidden until that specific candle is revealed on the timeline.
- **Stacked Side Cards (30% right column):** Stacks up to 5 side cards. Older cards transition to `muted` (light gray border/text); the active beat's card highlights with colored borders and soft box-shadows.

### 6.3. `tug_of_war` (Market Depth & Supply/Demand Imbalance)
- **Layout:** 3-column force arena rendered directly on the dot-grid canvas.
- **Left Column:** Buyer count + green progress meter + 5-column grid of solid user silhouettes (`#16A34A`, max 25 count) animated with staggered springs.
- **Center Column:** Balance gauge displaying current asset price, trend direction (`up` / `down`), and animated tilt needle swinging dynamically between 24% and 76%.
- **Right Column:** Seller count + red progress meter + 5-column grid of solid seller silhouettes (`#DC2626`).
- **Bottom Status:** Colored badge reflecting the dominant force (e.g., *"Supply overwhelms fresh demand"*).

### 6.4. `progressive_cards` (Frameworks & Principles)
- **Layouts:** Supports `grid` (2x2 cards) or `stack` (vertical list).
- **Grouped Section Header:** The `sectionHeader` pill is anchored directly inside the centered card container wrapper (`mb-4`), visually grouping with the cards rather than floating disconnectedly at top-left.
- **Fixed 2x2 Grid Slots (Zero-Jumping Invariant):** When in `grid` layout, hidden cards render as invisible placeholder cells occupying their exact grid slot. This guarantees that Card 1 starts in Row 1 Col 1 and never jumps vertically when subsequent cards reveal.
- **Max 1 Card Revealed Per Beat:** Enforced by Zod validation, a scene may reveal at most 1 new card per beat to maintain measured pedagogical progression.
- **Visuals:** Dynamic Lucide icons in colored rounded containers, bold titles, and explanatory subtitles.
- **Immutability:** Card text remains strictly identical across beats within the scene; only the `state` changes (`hidden` $\rightarrow$ `active_*` $\rightarrow$ `muted`).

### 6.5. `split_comparison` (Contrasting Mental Models)
- **Layout:** 2 large comparison columns (e.g., Fundamental vs Technical) separated by a central `VS` badge.
- **Beat 1 Single-Column Focus:** When `rightColumn.active: false` and `bullets: []`, the right column and the center `VS` badge are completely hidden (`opacity-0 pointer-events-none`), allowing 100% focus on the Left Column.
- **Beat 2 & 3 Reveal:** Beat 2 animates in the right column and `VS` badge with spring physics; Beat 3 sets both active to highlight synthesis.
- **Content:** Header icon, title, subtitle, and bullet points with soft checkmark accents.

### 6.6. `interactive_quiz` (Active Recall & Viewer Prediction)
- **Self-Contained Scenario Invariant:** The question string (`ui_state.question`) must be a complete self-contained scenario + question with a minimum of 18 words (enforced by Zod validator) so viewers have complete context regardless of TTS timing.
- **Immutable Question Across Beats:** Must stay 100% identical across all beats of an `interactive_quiz` scene:
  - Beat 1: Question displayed (`showThinkingSpinner: false`, `answer: null`).
  - Beat 2: Same question + animated thinking spinner (`showThinkingSpinner: true`, `pauseAfterMs: 4000`).
  - Beat 3: Same question + answer reveal card (`showThinkingSpinner: false`, `answer: "..."`).
- **No Dialogue Inside Quiz:** Practical dialogue between Raju and Sharma ji is moved out of the quiz into a dedicated post-quiz `chat_story` scene.

### 6.7. `summary_thread` (The Whole Picture)
- **Header:** Monospace badge (`CHAPTER 1 · THE WHOLE PICTURE`) and immutable heading (`"Today's thread"`).
- **Active Step Range Support:** Supports `activeStepRange: [startStep, endStep]` to highlight multiple sequential steps simultaneously (e.g., `[1, 3]`, `[4, 6]`, `[7, 8]`) without skipping intermediate step numbers. Active steps render with solid amber `#F59E0B` badges; previous steps remain completed `#FEF3C7`/`#B45309`.
- **6 to 8 Steps Invariant:** The numbered list must contain between 6 and 8 steps (`steps.length >= 6 && steps.length <= 8`) walking through the full lesson arc.
- **Takeaway Banner Entrance:** On the final beat (`activeStepRange: [1, 8]`), all steps render in completed status and the amber `bottomTakeaway` banner animates in below the list.

---

## 7. Current Production Deliverable (Benchmark: Murphy Ch 1 Pt 1 v7)

The pipeline was run end-to-end to generate the final benchmark video:

- **File Path:** [`out/ch01_part1_v7.mp4`](file:///c:/Users/YashAggarwal/OneDrive%20-%207N%20A%20S/Desktop/study%20video/out/ch01_part1_v7.mp4)
- **Total Duration:** `9,968 frames` (332.27 seconds / 5 minutes 32 seconds at 30 fps)
- **Structure:** 13 scenes, 42 narration beats.
- **Audio Configuration:** Calibrated Edge-TTS `+2%` speech rate, standard pauses `260ms`, topic transitions `450ms`, active recall quiz pause `3,200ms`, phonetic normalization (`नतीजे`, `दवा रेगुलेटर`).

### Scene Breakdown & Timeline Map

| Scene # | Start Frame | End Frame | Template | Segment Title | Key Visual Event |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **0** | 0 | 333 | `chat_story` | Record profit, big confidence | Raju enters at ₹152 on 40% profit; scene badge anchored inside container |
| **1** | 333 | 1,143 | `data_visualizer` | Good news, falling price | Gap-down -7% to ₹141 on heavy volume; local 7-candle neighborhood bottom pill math |
| **2** | 1,143 | 2,187 | `progressive_cards` | The chartist's lens | 4 lenses: price discounts, supply/demand, trends, psychology |
| **3** | 2,187 | 2,867 | `data_visualizer` | The move before the news | 2-month prior runup ₹120 $\rightarrow$ ₹158 revealed (audio: *नतीजे*) |
| **4** | 2,867 | 3,510 | `tug_of_war` | Who was left to buy? | Buyer exhaustion (20:3 $\rightarrow$ 4:21 sellers; audio: *नतीजे*) |
| **5** | 3,510 | 4,180 | `progressive_cards` | Price discounts everything | Murphy's 1st premise: fundamentals, policy, fear enter price |
| **6** | 4,180 | 4,891 | `data_visualizer` | Trends carry forward | Green trendline holds $\rightarrow$ breaks on evidence |
| **7** | 4,891 | 5,632 | `data_visualizer` | Greed and fear repeat | Neckline pill at Trough 1 (`candleIndex=7`) & `BREAK ₹142` below breakdown candle |
| **8** | 5,632 | 6,557 | `progressive_cards` | One principle, many arenas | 5m, daily, long-term cycles & leverage survival |
| **9** | 6,557 | 7,295 | `split_comparison` | What versus when | Fundamental (*what to own*) vs Technical (*when to enter/exit*) |
| **10** | 7,295 | 8,168 | `interactive_quiz` | Your decision tomorrow | Pharma FDA approval scenario (smooth FDA TTS, 3,200ms thinking pause) |
| **11** | 8,168 | 8,613 | `chat_story` | Read news, trade price | Raju & Sharma ji dialogue; stage directions with em-dashes and `mb-6` spacing |
| **12** | 8,613 | 9,968 | `summary_thread` | The Whole Picture | Dedicated intro beat `[0, 0]` (all muted), sequential 2-step highlights `[1, 2]` to `[7, 8]`, final takeaway |

---

## 8. Evaluator's Checklist & Future Enhancement Roadmap

When reviewing this video or using an LLM to evaluate the render, examine the following criteria:

### 8.1. Quality Checklist
- [x] **No Whole-Card Flashing:** The outer white card remains mounted continuously throughout each scene; only child elements animate.
- [x] **Sub-12s Hook:** The chart appears at 10.23s, satisfying the immediate engagement requirement.
- [x] **No Devanagari in UI:** All chart text, card labels, and quiz UI strings are 100% English.
- [x] **Deterministic Rendering:** No flickering frames across repeated renders.
- [x] **Synchronized Annotations:** Callouts appear strictly when their corresponding candle has materialized.

---

### 8.2. High-Impact Areas for Future Engine Improvements

For another LLM or developer looking to elevate this engine to the next tier of production value:

#### 1. Audio Sound Design (SFX & Ambient Bed)
- **Current State:** Pure voice narration with zero sound effects or background music.
- **Improvement:**
  - Introduce subtle sound effects via Remotion `<Audio>`:
    - Soft "pop/click" when chat bubbles appear.
    - Low "whoosh" or "thud" on the -7% red candle gap-down.
    - Digital "ding/chime" when the quiz answer reveals.
    - Soft "tug" sound when Tug-of-War silhouettes balance shifts.
  - Add a very subtle, low-volume lo-fi / ambient acoustic background pad ducked to `-22dB` during speech.

#### 2. Dynamic Camera Pan & Zoom (Kinetic Focus)
- **Current State:** The 1920x1080 canvas is visually static; only internal SVGs and cards move.
- **Improvement:**
  - In `SceneLayout.tsx`, wrap the main card in a Remotion `interpolate()` transform that applies subtle camera zooms:
    - Gentle 1.04x slow push-in during key dramatic beats (e.g., Beat b05 when the price drops).
    - Slight pan towards the right Y-axis when the live price breaks the neckline in Scene 7.

#### 3. Word-Level Subtitle Highlighting (Karaoke Typography)
- **Current State:** Subtitles appear as full static sentences per beat in `footer`.
- **Improvement:**
  - Utilize Whisper or forced-alignment word timestamps from the TTS step.
  - Highlight active spoken words in accent amber `#D97706` while past words remain dark charcoal, creating kinetic visual tracking for the viewer.

#### 4. Expressive Character Portraits
- **Current State:** Raju and Sharma ji are represented by circular letter badges (`RJ`, `SJ`).
- **Improvement:**
  - Add illustrated SVG or vectorized cartoon character avatars with subtle idle breathing animations (`Math.sin(frame / 15)`) and reaction states (e.g., Raju looking shocked during the drop, Sharma ji smiling calmly).

#### 5. Additional Domain Telemetry Presets
- Expand `src/utils/chartGenerators.ts` with more non-finance presets:
  - **Coding:** Distributed trace waterfalls, Redis cache hit/miss waterfall, event-loop lag histograms.
  - **Psychology:** Dopamine receptor downregulation curves, habit cue-routine-reward loop diagrams.

---

## 9. Developer & CLI Operations Map

### Useful Commands

```powershell
# 1. Environment Setup (Node.js in PATH)
$env:Path = "C:\Users\YashAggarwal\AppData\Local\Programs\nodejs;$env:PATH"

# 2. Generate a new chapter using Gemini 4 Argon into an isolated folder
node scripts/generate_episode.mjs --chapter=ch01_argon_v1 --domain="Finance / Trading" --temperature=0.2

# 3. Validate episode raw JSON against strict Zod schema (supports --chapter or --dir)
npm run validate
node scripts/validate_episode.mjs --chapter=ch01_argon_v1
node scripts/validate_episode.mjs --dir=src/data/chapters/ch01_argon_v1

# 4. Synthesize narration audio via Edge-TTS targeting isolated chapter
node scripts/compile_tts_audio.mjs --chapter=ch01_argon_v1 --force

# 5. Synthesize narration audio via Gemini TTS
node scripts/compile_tts_audio.mjs --chapter=ch01_argon_v1 --tts=gemini --force

# 6. Render full MP4 video (H.264) with chapter props
npx remotion render src/index.ts EpisodeComposition out/ch01_argon_v1.mp4 --props=src/data/chapters/ch01_argon_v1/episode_compiled.json

# 7. Capture a single still frame for inspection
npx remotion still src/index.ts EpisodeComposition out/preview.png --frame=600

# 8. Launch interactive Remotion Studio preview in browser
npm run preview
```

### Core Repository File Map

```
├── AGENTS.md                         # Permanent Antigravity Agent protocol & workflow
├── product.md                        # This exhaustive product & architectural specification
├── package.json                      # Scripts & dependencies (remotion, edge-tts, zod, lucide)
├── scripts/
│   ├── generate_episode.mjs          # Gemini 4 Argon automated episode storyboard generator
│   ├── compile_tts_audio.mjs         # Edge-TTS + Gemini TTS compiler supporting isolated chapters
│   └── validate_episode.mjs          # Strict Zod schema validator (rejects Devanagari in UI)
├── public/
│   └── audio/                        # Generated MP3/WAV narration clips
│       └── <chapter_slug>/           # Isolated audio clips per chapter (e.g. ch01_argon_v1)
├── src/
│   ├── index.ts                      # Remotion root registration
│   ├── Root.tsx                      # Dynamic composition declarations & props handling
│   ├── EpisodeComposition.tsx        # Scene sequencing, timeline & isolated audio sync
│   ├── types.ts                      # TypeScript interfaces for all scenes, beats & UI schemas
│   ├── components/
│   │   ├── SceneLayout.tsx           # 1920x1080 canvas, breadcrumbs, dot-grid card & subtitles
│   │   └── DynamicIcon.tsx           # Lucide icon dynamic resolver
│   ├── data/
│   │   ├── chapters/                 # Isolated chapter outputs (raw, compiled & audio)
│   │   │   └── ch01_argon_v1/        # Example isolated chapter directory
│   │   │       ├── episode_raw.json
│   │   │       ├── episode_compiled.json
│   │   │       └── audio/
│   │   ├── episode_raw.json          # Production base script
│   │   ├── episode_compiled.json     # Production compiled script with frame durations
│   │   ├── personas.json             # Persona presets (Finance, Coding, Psychology)
│   │   ├── schema_reference.json     # Complete Zod schema reference specification
│   │   └── loadEpisode.ts            # Episode loader with stale-cache fallback protection
│   ├── templates/
│   │   ├── TemplateRenderer.tsx      # Template router
│   │   ├── ChatStory.tsx             # Dialogue thread template
│   │   ├── DataVisualizer.tsx        # Candlestick & telemetry chart template
│   │   ├── TugOfWar.tsx              # Force balance & silhouette arena template
│   │   ├── ProgressiveCards.tsx      # Step-by-step card reveal template
│   │   ├── SplitComparison.tsx       # Side-by-side comparison template
│   │   ├── InteractiveQuiz.tsx       # Prediction & recall template with spinner
│   │   └── SummaryThread.tsx         # 8-step thread & takeaway card template
│   └── utils/
│       ├── chartGenerators.ts        # Seeded deterministic OHLC & curve math generators
│       └── sanitize.ts               # Hindi TTS text cleaner (currencies, percentages, acronyms)
```

