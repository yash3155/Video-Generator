# Just-in-Time Concept Clarification Standard

The core law: never assume the learner knows a term. At the first mention of any term, acronym, symbol or specialized concept, the narration explains it before moving on.

## The six-step sequence

At the first mention:

1. Say the term.
2. Expand the abbreviation ("APR, the annual percentage rate").
3. Give a one-sentence plain meaning.
4. Say what it means in this context ("here it is the rate the card company quotes").
5. Give a short analogy or example.
6. Continue the main thread.

## Explanation depth

The concept register (S5, `03_concept_register.json`) assigns each concept a depth:

| Depth | Name | Typical time |
| --- | --- | --- |
| L1 | Quick gloss | 5 to 12 seconds |
| L2 | Intuition | 12 to 25 seconds |
| L3 | Mechanism | 25 to 45 seconds |
| L4 | Application with worked numbers | 45 seconds and more |

Core concepts of the part are L3 or L4. Supporting vocabulary is L1 or L2.

## Re-glossing and bridging

- When a term reappears after three or more scenes, re-gloss it in three to five words ("the principal, your starting amount").
- Bridge every new concept to something already taught ("Earlier we saw simple interest; compound interest is the same idea, except the interest joins the pile").
- Terms introduced in earlier parts are marked `introduced_earlier` in the register (resolved from `course_glossary.json`) and need only a brief reminder.

## The on-screen companion

The Concept Clarification panel shows TERM, FULL FORM, SIMPLE MEANING, ROLE HERE and CONNECTS TO. It is compact, sits beside or below the main diagram, and never covers it. It appears on the beat where the term is first explained (`visual.concept`) or as a dedicated `concept_clarification` scene for central terms.

## The term detector (check P-03)

The detector scans narration in every language for:

- acronyms matching `\b[A-Z]{2,6}s?\b` (ignoring a small list of everyday words such as "OK" and Roman numerals),
- domain terms listed in the book's domain preset and in the course glossary,
- formula symbols that appear in the part's formulas,
- every term listed in `newTerms` on a beat.

Each detected term must be registered in the concept register. At its first occurrence the same beat or the next beat must contain the expansion (for acronyms) and words from the plain-language definition. An unexplained acronym is a HIGH finding with a repair hint that names the beat.
