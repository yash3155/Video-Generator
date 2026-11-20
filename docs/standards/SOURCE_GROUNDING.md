# Source Grounding Standard

Every claim, number and formula a learner sees or hears must be traceable to the book. This standard explains how OpenLectern keeps lessons faithful, and which checks enforce it.

## The fact ledger is the only source

- Stage S3 turns the research file (`research/notebook_context.md`) into `01_source_facts.json`. It is the only allowed source of claims, numbers and formulas for the part.
- Each fact has an `id` (`F01`, `F02`, ...), a `category` (definition, claim, rule, formula, numerical_example, case_study, historical_event, assumption, limitation, misconception), a `statement`, and a `citation` (chapter, section, page).
- Formula facts carry a typed `formula` object: `latex` (no `$` delimiters), an optional mathjs `expression` with the symbol it `solvesFor`, and `variables[]` with `symbol`, `meaning` and `unit` for every variable.
- Numerical examples carry `numbers`: `inputs`, intermediate `steps`, a `result`, and the declared `rounding`. The content audit (S4) recomputes every step with mathjs and fails on disagreement.
- A part needs at least 10 cited facts. Fewer means the research is too thin: go back to S1 rather than padding.

## Every beat cites facts

- Every beat in `08_episode.json` lists `sourceFactIds`, and every id must resolve to a fact of this part (check L1 schema, C-01). Pure transition beats are the only exception and must set `transition: true`.
- Fact coverage (C-02): at least 85% of the part's facts are taught somewhere, and every formula and worked-example fact is taught.

## Numbers on screen

- Every number on screen appears in the facts, is derived by a recorded computation (worked-example steps, chart generators), or is badged hypothetical (C-03).
- Illustrative numbers that are not in the source must set `isHypothetical: true` (or `visual.hypothetical: true` on the beat) and show the visible badge `HYPOTHETICAL EXAMPLE`; hypothetical charts are watermarked `ILLUSTRATIVE MODEL` (C-04).

## What "faithful" means

- Paraphrase; quote at most two short passages (under 25 words) where the wording matters, and always cite them.
- Never add facts from general knowledge, even true ones. If the book is silent, the research file says `NOT IN SOURCE` and the lesson stays silent too.
- Never change a number to make an example rounder. Keep the author's rounding and units.
- Historical cases keep who, when, where and the numbers exactly as the source gives them.

## Bespoke, not inherited

Visual and narration text is generated from this part's facts. Templates hold structure only. The bespoke-content checks (C-05 to C-09) fail any part whose on-screen strings or narration were copied from another part or from a denylist of known boilerplate, unless this part's own fact ledger contains them.
