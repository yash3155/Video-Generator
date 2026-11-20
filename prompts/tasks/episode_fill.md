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
- Summary (summary_thread): exactly 8 rules of at most 30 words; beat ranges [0,0], [1,2], [3,4], [5,6], [7,8], [1,8] with `compact: true` on the last.
- On-screen text uses only the display language ({{displayLanguage}}).

## Template data schemas

{{templateSchemas}}

## Standards

{{standards}}
