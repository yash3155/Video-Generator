# Adding a New Book to the Universal Video Engine

This guide details how any new book (e.g. Psychology, Biology, Physics, Systems Engineering, World History) is added to the autonomous video generation engine **without making any changes to TypeScript renderer code**.

---

## The 3-Artifact Rule
To render educational videos for a completely new book or subject, you only need to supply:
1. **Course Configuration** (`src/courses/<course_id>.json`)
2. **Source Facts** (`src/data/chapters/<slug>/source_facts.json`)
3. **Lesson Plan & Storyboard** (`lesson_plan.json` & `storyboard.json`)

**Zero TypeScript renderer edits are required.**

---

## Step 1: Create the Course Configuration (`src/courses/<course_id>.json`)
Create a JSON file conforming to `CourseConfigSchema` in `src/courses/`:

```json
{
  "schemaVersion": "1.0.0",
  "courseId": "classical_mechanics",
  "bookTitle": "Classical Mechanics (John R. Taylor)",
  "subject": "physics",
  "audience": "Undergraduate Physics Students",
  "narrationLanguage": "hi-IN-devanagari",
  "visualTheme": {
    "primaryColor": "#1D4ED8",
    "accentColor": "#0F766E",
    "backgroundColor": "#F8FAFC",
    "textColor": "#0F172A"
  },
  "allowedTemplates": [
    "formula_breakdown",
    "data_visualizer",
    "diagram_flow",
    "progressive_cards",
    "chat_story",
    "interactive_quiz",
    "summary_thread"
  ],
  "domainModules": [],
  "unitsAndFormats": {
    "defaultUnit": "m/s",
    "allowedUnits": ["m/s", "m/s²", "N", "J", "kg", "s"],
    "numberNotation": "standard",
    "decimalPlaces": 2
  },
  "persona": {
    "novice": { "name": "Kabir", "avatar": "K", "role": "Physics Student", "theme": "amber" },
    "mentor": { "name": "Dr. Sen", "avatar": "S", "role": "Theoretical Physicist", "theme": "blue" }
  }
}
```

### Key Configuration Directives
- **`domainModules`**: Leave empty `[]` for standard generic courses. Set to `["finance"]` only if using derivatives payoff diagrams or candlestick presets.
- **`unitsAndFormats`**: Controls units and formatting. Non-finance subjects (e.g., `m/s`, `BCE`, `kg`) will render clean metrics without currency signs.
- **`allowedTemplates`**: Whitelists visual templates from the template registry.

---

## Step 2: Ingest Author Facts into `source_facts.json`
Run the NotebookLM query or source extractor to populate `src/data/chapters/<slug>/source_facts.json`. Each fact contains:
- `id`: `fact-01`, `fact-02`, etc.
- `category`: `definition`, `claim`, `formula`, `numerical_example`, `case_study`, or `assumption`.
- `statement`: 1-2 sentence core author claim.
- `sourceCitation`: Book title, chapter, section, page.
- `formulaDetails` / `numericalDetails`: Optional explicit mathematical symbols, units, and values.

---

## Step 3: Run the Pre-Generation Content Audit
Audit the source facts against the 11-point pedagogical contract:

```bash
node scripts/audit_content.mjs --dir=src/data/chapters/<slug>
```

Verify that status is `PASS` or `CONDITIONAL_PASS`. Unresolved critical findings block generation and rendering.

---

## Step 4: Generate Lesson Plan & Structured Visuals in `storyboard.json`
When designing beats, supply structured visual specifications inside `visual`:

### A. Generic Chart (`visual.kind = "chart"`)
```json
"visual": {
  "kind": "chart",
  "data": {
    "chartType": "line",
    "title": "Velocity vs Time",
    "xAxis": { "label": "Time", "unit": "s", "categories": ["0s", "2s", "4s", "6s"] },
    "yAxis": { "label": "Velocity", "unit": "m/s", "min": 0, "max": 30 },
    "series": [
      {
        "id": "v-series",
        "name": "Velocity",
        "type": "line",
        "data": [
          { "x": "0s", "y": 0 },
          { "x": "2s", "y": 5 },
          { "x": "4s", "y": 10 },
          { "x": "6s", "y": 15 }
        ]
      }
    ]
  },
  "semantics": {
    "teachingObjective": "Illustrate uniform acceleration",
    "sourceFactIds": ["fact-02"]
  }
}
```

### B. Generic Formula (`visual.kind = "formula"`)
```json
"visual": {
  "kind": "formula",
  "data": {
    "title": "Newton's Second Law",
    "expression": "F = m · a",
    "variables": [
      { "symbol": "F", "label": "Force", "unit": "N" },
      { "symbol": "m", "label": "Mass", "unit": "kg" },
      { "symbol": "a", "label": "Acceleration", "unit": "m/s²" }
    ],
    "steps": [
      { "stepIndex": 1, "label": "General Form", "equation": "F = m · a" },
      { "stepIndex": 2, "label": "Substitution", "equation": "F = (1000 kg) × (2.5 m/s²)" },
      { "stepIndex": 3, "label": "Result", "equation": "F = 2500 N" }
    ],
    "activeStepIndex": 2
  },
  "semantics": {
    "teachingObjective": "Calculate force from mass and acceleration",
    "sourceFactIds": ["fact-01"]
  }
}
```

### C. Generic Diagram or Timeline (`visual.kind = "diagram"` / `"timeline"`)
```json
"visual": {
  "kind": "timeline",
  "data": {
    "title": "Agricultural Origins",
    "layout": "timeline",
    "nodes": [
      { "id": "n1", "label": "Fertile Crescent", "subtitle": "Wheat Domestication", "state": "active", "group": "11,000 BCE" },
      { "id": "n2", "label": "Yangtze Valley", "subtitle": "Rice Domestication", "state": "default", "group": "7,500 BCE" }
    ],
    "edges": [
      { "from": "n1", "to": "n2", "label": "Independent Centers" }
    ],
    "activeNodeIds": ["n1"]
  },
  "semantics": {
    "teachingObjective": "Trace chronological milestones",
    "sourceFactIds": ["fact-03"]
  }
}
```

---

## Step 5: Validate, Synthesize Audio & Render
```bash
# Validate against Zod schemas and visual template registry
node scripts/validate_episode.mjs --dir=src/data/chapters/<slug>

# Compile TTS audio
node scripts/compile_tts_audio.mjs --dir=src/data/chapters/<slug> --force

# Render Final MP4
npx remotion render src/index.ts EpisodeComposition out/<slug>.mp4 --props=src/data/chapters/<slug>/episode_compiled.json
```

