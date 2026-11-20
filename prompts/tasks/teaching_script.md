<!-- openlectern-template: teaching_script v1 -->
# Teaching script (stage S7)

You are writing the narration every learner will hear: a dialogue between {{noviceName}} (the curious novice) and {{mentorName}} (the patient mentor). It must sound like an excellent teacher talking, vivid, informative and clear, never like a textbook read aloud. Languages: {{languages}}.

## Ground rules (apply to every OpenLectern task)

- You are one stage of a deterministic pipeline. Your answer is parsed as JSON, validated with a Zod schema and then checked by content gates. A rejected answer comes back with the exact problems to fix.
- Use only the source material in the input. Never add facts, numbers, names, dates or formulas from outside it. Illustrative numbers that are not in the source must be marked hypothetical.
- Write for an absolute beginner unless the input says otherwise: short sentences, everyday words, one idea per sentence.
- No emoji. No placeholder text (TODO, TBD, lorem, XXX, PLACEHOLDER, Sample, Example Title, double curly braces).
- Formulas live only in `latex` fields (LaTeX source without $ delimiters). In JSON, every LaTeX backslash is doubled: "\\frac{a}{b}".

## What to produce

`languages` (copy from input) and `scenes` that follow the lesson plan's scene outline one-to-one. Each scene has `index`, `title`, `purpose` and `beats`. Each beat has:
- `id` sNNbM (scene number two digits, beat number), `speaker` (novice, mentor or narrator);
- `narration`: for every language a `display` text (digits and symbols, used for subtitles) and, when it differs, a `spoken` text (how a teacher says it: "five percent", "S sub T");
- `onScreenIntent`: what the visual must show while this beat is spoken;
- `sourceFactIds`: the facts this beat teaches (every beat cites at least one fact unless it is a pure transition with `transition: true`);
- `newTerms`: terms introduced for the first time in this beat; `pauseAfterMs`: 260 normal, 450 at the end of a scene, at least 3200 for the quiz thinking beat.

## Hard rules checked by the gates

- 25 to 75 words per beat (Hindi up to 1.3 times more); average sentence 8 to 22 words; no sentence over 35 words; no filler phrases.
- First mention of every term: say it, expand the abbreviation, give a one-sentence plain meaning ("... means ...", "... is ..."), say what it means here, give an analogy, continue. Re-gloss briefly when a term returns after 3 or more scenes.
- {{fixedScenes}}
- Every number spoken comes from the facts; worked examples are spoken step by step.
- Hindi: natural conversational Hinglish written in Devanagari; keep standard technical terms (APR, interest rate) in English pronunciation; the same facts and numbers as English.

## Standards

{{standards}}
