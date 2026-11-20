# Orientation and Synthesis Standard

Besides one video per chapter part, OpenLectern can produce an Orientation video (watched before Chapter 1) and a Synthesis video (the capstone). Both are generated from this book's course map, facts and glossary. Neither may reuse another book's orientation or synthesis.

## Orientation (about 5 to 7 minutes)

Purpose: dismantle intimidation and give the learner a map before the first chapter.

Scene paradigm:

1. **Hook and myth.** Open with the single biggest myth about the subject and bust it with a fact from the book.
2. **Why this matters.** A concrete situation where not knowing the subject costs a real person something.
3. **Four superpowers.** The four abilities the book gives the learner (`progressive_cards`).
4. **The reading journey.** The modules and chapters as a roadmap (`roadmap` or `diagram_flow` in timeline mode).
5. **The scariest formula, demystified.** The single most intimidating formula in the book, explained in plain words, with each symbol defined (`formula_breakdown`).
6. **Quiz.** Three beats, same rules as chapter quizzes.
7. **Reader's commandments.** Exactly eight rules for getting the most out of the course (`summary_thread`).

Facts come from all chapter research files of the book; the orientation part id is `p1` and the chapter id is `orientation`.

## Synthesis (capstone)

Purpose: connect the whole book into one argument.

Scene paradigm:

1. **The dialectical chain.** Tool A, its fatal limitation, the failure that limitation caused, the author's next invention (Tool B), and so on across the chapters (`causal_chain` or `diagram_flow`).
2. **Side-by-side toolkit.** What each tool answers and when to use it (`table_compare`).
3. **How to use the whole toolkit together.** One worked scenario that needs several chapters' tools in sequence (`worked_example`).
4. **Quiz.** Three beats.
5. **Eight master laws.** Exactly eight rules distilled from the whole book (`summary_thread`).

Synthesis facts come from every part's `01_source_facts.json` and the course glossary. Its chapter id is `synthesis`.

## Shared rules

- All Part D standards apply: source grounding, just-in-time clarification, narration craft, assessment, diversity.
- The "where we are" roadmap shows the whole course.
- Orientation and Synthesis are listed first and last in the course index (`out/<book>/index.html`).
