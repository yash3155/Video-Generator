# Course-to-Video Engine: Quality & Pedagogical Standards

This document establishes the permanent, reusable quality standards for educational video generation and rendering across all book domains.

---

## 1. Non-Negotiable Source Grounding & Traceability

1. **Source Fact Ledger (`source_facts.json`) as Authoritative Truth**:
   - Every educational claim, formula, numerical value, unit, and definition must derive directly from approved textbook source facts.
   - Hallucinated formulas, arbitrary market figures, or ungrounded historical claims are strictly prohibited.
2. **Explicit Fact Citation (`sourceFactIds`)**:
   - Every scene and beat must bind its structured visual specification to explicit `sourceFactIds` defined in `source_facts.json`.
   - The validation engine (`scripts/validate_episode.mjs`) and QA Release Gate (`src/qa/qaEngine.mjs`) verify all cited IDs against the fact ledger.
3. **Mandatory Badging of Illustrative / Hypothetical Scenarios**:
   - Pedagogical desk examples or illustrative trade numbers (e.g., ₹250 entry, ₹215 crash) that do not originate verbatim from textbook source facts must be explicitly badged in the UI:
     `badge: "HYPOTHETICAL DESK EXAMPLE"` or `"HYPOTHETICAL TRADING SCENARIO"`.
   - Prevents learners from confusing illustrative teaching exercises with textbook historical facts or formulas.

---

## 2. Complete Domain Decoupling & Configuration Architecture

1. **Zero Domain Logic in Shared Renderers**:
   - Shared template components (`FormulaBreakdown.tsx`, `SummaryThread.tsx`, `DataVisualizer.tsx`, `ConceptQuiz.tsx`) must remain 100% domain-agnostic.
   - Never hardcode book titles, subject terms, currency symbols (`₹`, `$`), or domain equations into shared React code.
2. **Course Configuration Isolation**:
   - Theme palettes, typography, allowed templates, currency formats, and character personas are defined exclusively in `src/courses/<course_id>.json`.
   - Adding a new book requires only a JSON configuration and fact ledger—**zero engine TypeScript changes**.
3. **Isolated Domain Modules**:
   - Subject-specific rules (e.g. candlestick logic, option payoff charts, directional consistency) are isolated inside optional domain modules (`src/domain/finance/`).
   - The engine operates identically for physics, history, mathematics, or finance.

---

## 3. Mathematical Formula Standards (`FormulaBreakdown`)

1. **No Unrelated Placeholder Equations**:
   - A formula renderer must never fall back to dummy equations (e.g. Newton's `F = m · a` in finance or economics).
   - If formula data is missing, the validator blocks generation with a `BLOCKER` finding.
2. **Proper Mathematical Subscript Typography**:
   - Learner-facing text must never display raw programming underscores (e.g. `S_T - K` or `Payoff_Long`).
   - The mathematical formatter converts underscore tokens into formatted subscript typography:
     - `S_T - K` $\implies S_t - K$ or $Sₜ − K$
     - `Payoff_Long` $\implies \text{Payoff}_{\text{Long}}$
     - Arithmetic operators are normalized (`−` for minus, `×` for multiplication, `≥`, `≤`, `⟹`).
3. **Structured Formula Contract**:
   Every displayed formula must provide:
   - **Purpose**: Clear teaching objective (e.g., "Calculate terminal delivery cash payoff").
   - **Variables**: Symbol, definition, unit, and description for every term.
   - **Substitutions / Derivation Steps**: Step 1 (definition), Step 2 (numerical substitution), Step 3 (result).
   - **Interpretation & Assumptions**: Practical real-world meaning and underlying constraints.
4. **Narration-Synchronized Cues**:
   - Substitution steps and variable highlights are driven by structured narration cues (`visualCues`) anchored to measured audio timestamps (`activeStepIndex`, `variableHighlight`).

---

## 4. Progressive Summary & Cognitive Load Standards (`SummaryThread`)

1. **Progressive 2-Item Focus Group & Rule 8 Dedicated Spotlight**:
   - Replacing the obsolete 8-rule text wall, progressive body beats display **at most two concise rules at a time** in large, readable card containers ($20\text{px}$ font, high contrast).
   - Prevents visual clutter and cognitive overload while narration explains each pair of rules.
   - **Mandatory 8-Rule Summary Progression Invariant**:
     - **Beat 0**: `activeStepRange: [0, 0]` — Executive Roadmap overview banner.
     - **Beat 1**: `activeStepRange: [1, 2]` — Focus Rules 1 & 2 ("First and second...").
     - **Beat 2**: `activeStepRange: [3, 4]` — Focus Rules 3 & 4 ("Third and fourth...").
     - **Beat 3**: `activeStepRange: [5, 6]` — Focus Rules 5 & 6 ("Fifth and sixth...").
     - **Beat 4**: `activeStepRange: [7, 8]` — Focus Rules 7 & 8 ("Seventh and eighth..."). **Rule 8 must receive dedicated spotlight and never be skipped or lumped!**
     - **Beat 5**: `compactOverview: true` (`[1, 8]`) — Complete 2-column whole-chapter synthesis grid during the concluding takeaway.
2. **Strict Spoken-to-Visual Alignment**:
   - The spoken narration in each summary beat must explicitly match the rules displayed in that beat's focus range (e.g. Beat 1 says "First and second", Beat 4 says "Seventh and eighth").
3. **Strict Density Limit**:
   - Summary steps must not exceed **30 words per step** (optimal: 14–22 words). Verbose paragraphs belong in narrative explanations, not summary takeaways.
4. **Compact Final Whole-Chapter Synthesis**:
   - Only on the final takeaway beat does the template transition into a compact 2-column overview grid of all chapter rules with the bottom takeaway banner.
5. **Layout Collision Prevention**:
   - Containers use fixed spacing, responsive font scaling, and explicit boundaries to eliminate title/badge/text overlap across all aspect ratios.

---

## 5. Pedagogical Sequence & Concept Separation

1. **Single-Concept Scene Pacing**:
   - Concepts that address distinct mechanisms must never be overloaded into a single visual template.
   - Example: Terminal derivative payoff mechanics ($S_t - K$) and bank leverage capital buffers ($1 / \text{Leverage}$) must be partitioned into separate, focused scenes.
2. **Standard 8-Stage Educational Arc**:
   Every chapter follows a proven pedagogical journey:
   $$\text{Real-World Risk} \longrightarrow \text{Intuition} \longrightarrow \text{Concept} \longrightarrow \text{Mechanism} \longrightarrow \text{Worked Example} \longrightarrow \text{Visual Proof} \longrightarrow \text{Active Recall} \longrightarrow \text{Recap}$$

---

## 6. Unified Phase 2C Release Gate Protocol

Every video must pass the automated Release Gate (`node scripts/run_qa.mjs`) before deployment:

| Severity | Definition | Release Action |
|---|---|---|
| **`BLOCKER`** | Missing audio, corrupt container, schema violation, placeholder formula, duration drift $>10\text{s}$, content audit fail. | **Release Strictly Blocked** |
| **`HIGH`** | Duration drift $>1.0\text{s}$, unlabelled hypothetical scenario, quiz scenario $<18$ words, cue timing violation. | **Release Blocked** (requires `--allow-high` exception) |
| **`MEDIUM`** | Subtitle $>16$ words, summary step $>30$ words, minor duration drift ($0.5\text{s}–1.0\text{s}$). | Review telemetry; non-blocking |
| **`LOW`** | Informational styling suggestions. | Review telemetry |

Videos are released **only when 0 Blockers and 0 Highs remain**.

---

## 7. Adaptive Visual Storytelling & Dynamic Template Architecture

1. **Pedagogical Function vs. Visual Presentation**:
   - The 5-Act Cognitive Micro-Kernel structure is an **educational journey**, not a rigid visual template sequence.
   - The story, concept topology, and subject domain dictate the visual language: Technical Analysis uses dynamic order books and candlestick formations; Derivatives uses payoff profiles and margin cascade balances; Computer Science uses call-stack architectures and memory lifecycle animations.
2. **Three-Level Template Intelligence**:
   - **Level 1 (Existing Template Selection — ~80% of scenes)**: The model selects from `TEMPLATE_REGISTRY` based on concept topology with custom data, visual hierarchy, and animation cues.
   - **Level 2 (Dynamic Multi-Component Composition — ~15% of scenes)**: The model combines two existing tested components using `composite_layout` (`CompositeLayout.tsx`) for split-view or multi-faceted concepts (e.g. Chart on left + Formula proof on right) with 0 new code.
   - **Level 3 (New Template Proposal & Controlled Lifecycle — ~5% of scenes)**: When a genuine capability gap exists, new templates progress through the 10-step lifecycle and must pass `node scripts/verify_new_template.mjs` before admission to `TEMPLATE_REGISTRY`.
3. **Visual Diversity & Anti-Repetition Standards (`diversityEngine.mjs`)**:
   - **No Consecutive Identical Templates**: Two adjacent scenes must not share the same visual template unless explicitly flagged as `pedagogicalContinuation: true`.
   - **Template Saturation Limit**: No single template may exceed 30% of total scenes in a chapter part.
   - **Format Variety**: Every chapter part must employ at least 5 distinct visual templates.
   - **Metaphor Freshness**: Narrative metaphors and desk analogies must remain grounded in approved source facts without repeating identical trade scenarios across chapters.

---

## 8. Chapter Visual Creative Brief (`visual_creative_brief.json`)

1. **Mandatory Phase 1 Creative Alignment**:
   - Synthesized after lesson planning and before storyboard creation.
   - Grounded strictly in approved `source_facts.json` and lesson learning outcomes.
2. **Required Specification Elements**:
   - **Creative Direction & Narrative Style**: Establishes documentary tone and Socratic pacing.
   - **Visual Metaphors**: Explicit mapping of textbook concepts to visual expressions grounded in `groundedFactIds`.
   - **Scene Composition Strategy**: Pacing of full-frame vs composite split-screen layouts.
   - **Template Selection Plan**: Pre-planned assignment of Level 1, Level 2, or Level 3 templates per scene.
   - **Visual Diversity Objectives**: Enforces diversity thresholds before storyboard generation.


