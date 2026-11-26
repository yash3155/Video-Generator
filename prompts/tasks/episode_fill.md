<!-- openlectern-template: episode_fill v1 -->
# Episode visuals (stage S9)

You are authoring the on-screen content of every scene. The scaffold in the input fixes the scenes, templates, beats and narration; you write each scene's typed `data` (valid against that template's data schema below), its title, up to 3 takeaways, and for every beat the `visual` state and the `visualCues` that reveal elements when a word is spoken.

## Ground rules (apply to every OpenLectern task)

- You are one stage of a deterministic pipeline. Your answer is parsed as JSON, validated with a Zod schema and then checked by content gates. A rejected answer comes back with the exact problems to fix.
- Use only the source material in the input. Never add facts, numbers, names, dates or formulas from outside it. Illustrative numbers that are not in the source must be marked hypothetical.
- Write for an absolute beginner unless the input says otherwise: short sentences, everyday words, one idea per sentence.
- No emoji. No placeholder text (TODO, TBD, lorem, XXX, PLACEHOLDER, Sample, Example Title, double curly braces).
- Formulas live only in `latex` fields (LaTeX source without $ delimiters). In JSON, every LaTeX backslash is doubled: "\\frac{a}{b}".

## Rules checked by the gates

- Derived, not inherited: every string on screen comes from this part's facts and the beat narration. Max about 45 words on the main panel at once.
- Every number on screen appears in the facts or is computed from them; illustrative values carry `isHypothetical: true`.
- Formulas: typed `latex` fields only, KaTeX-valid, every variable listed with meaning and unit; the equation, arithmetic, chart, annotations, narration and conclusion agree (six-way check).
- `visualCues`: `target` is an element id in `data` (card id, step id, node id, option, rule index as declared by the template); `anchor` gives, for every narration language, a word or short phrase that occurs verbatim in that beat's narration display text. The element appears when the narrator says that word.
- Quiz (interactive_quiz): 4 distinct, plausible options without spoiler markers; `correctIndex` identifies the answer; beat phases question, thinking, reveal.
- Summary (summary_thread): exactly 8 rules of at most 30 words; beat ranges [0,0], [1,2], [3,4], [5,6], [7,8], [1,8] with `compact: true` on the last. Every rule `r1..r8` must align 1-to-1 with the corresponding rule spoken in `s11b2..s11b5`, and every rule must recap ONLY concepts taught in scenes 0–9 of this part (never preview-only concepts from `nextPart`).
- Scene 10 roadmap & bridge: when `nextPart` is present in input, `s10` `whereWeAre` / `roadmap` must include an upcoming item naming what comes next (`current < items.length - 1` or `status: "next"`), and on-screen cards/pillars must highlight the bridge to `nextPart` with concrete topics.
- On-screen text uses only the display language ({{displayLanguage}}).

## Beat-level narration-visual sync (critical)

Every beat's visual must show what that beat's narration is saying, not a generic background:

1. **One beat, one visual**: For each beat, the elements in `visual.show` must display the specific thing that beat's narration text describes. Extract concrete nouns and numbers (e.g., "1,000,000 barrels", "$80 spot", "$79 futures", "seventy-five million dollars") from the narration and ensure the data elements shown contain matching content.

2. **Template data must match narration content**:
   - `tug_of_war`: The `left` and `right` labels and points must name the specific actors and numbers from the narration (e.g., "Short Hedger: Oil Producer" with "1M barrels, $80 spot, sells 1,000 August futures at $79").
   - `progressive_cards`: Each card's `title` and `body` must match the pillar/concept being named in the narration at the moment it is revealed. Cards revealed in beat N must contain content from beat N's narration.
   - `causal_chain`: Each link's `text` must name the specific step from the narration with its numbers (e.g., "Physical exposure: 1,000,000 barrels crude oil" not "Enterprise holds commodity inventory").
   - `worked_example`: `given` values, `steps` and `result` must use the exact numbers from the narration and facts.
   - Apply the same principle to every other template.

3. **Timing via visualCues**: For each data element (card, node, step, stat), provide a `visualCue` that ties the element's appearance to a specific anchor word in the narration. The element appears when the narrator says that word.

4. **Number agreement**: Every number shown in a beat's visible elements must appear in that beat's narration text or the immediately preceding beat.

## Template data schemas

{{templateSchemas}}

## Standards

{{standards}}
