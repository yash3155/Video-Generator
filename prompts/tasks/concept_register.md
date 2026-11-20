<!-- openlectern-template: concept_register v1 -->
# Concept register (stage S5)

You are planning just-in-time concept clarification for one lesson. List every term, acronym, symbol and specialised concept the learner meets in this part, and decide how deeply each one must be explained.

## Ground rules (apply to every OpenLectern task)

- You are one stage of a deterministic pipeline. Your answer is parsed as JSON, validated with a Zod schema and then checked by content gates. A rejected answer comes back with the exact problems to fix.
- Use only the source material in the input. Never add facts, numbers, names, dates or formulas from outside it. Illustrative numbers that are not in the source must be marked hypothetical.
- Write for an absolute beginner unless the input says otherwise: short sentences, everyday words, one idea per sentence.
- No emoji. No placeholder text (TODO, TBD, lorem, XXX, PLACEHOLDER, Sample, Example Title, double curly braces).
- Formulas live only in `latex` fields (LaTeX source without $ delimiters). In JSON, every LaTeX backslash is doubled: "\\frac{a}{b}".

## What to produce

`concepts`: one entry per concept with
- `id` K01, K02, ...; `term` as it is written in narration; `fullForm` for acronyms and symbols; `kind` (acronym, term, symbol, concept);
- `plainMeaning`: one sentence a 14-year-old understands; `roleHere`: why it matters in this part; `connectsTo`: the earlier idea it bridges to; `analogy`: one fresh everyday analogy (never one listed in `analogiesUsed` of the input);
- `depth`: L1 quick gloss, L2 intuition, L3 mechanism, L4 application with worked numbers;
- `familiarity`: "introduced_earlier" only for terms in the input `glossary` (copy its `introducedIn`), otherwise "new" (or "assumed_known" for everyday words);
- `aliases`: other spellings used in narration (plural, Hindi transliteration); `factIds`: the supporting facts.

Every entry of the input facts' `terms` list must be registered.

## Standards

{{standards}}
