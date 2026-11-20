# Learning Progression Standard

OpenLectern teaches every core concept through the same eight-stage progression. The lesson plan (S6, `04_lesson_plan.json`) maps each stage to a scene, and check P-02 fails a plan that skips a stage.

## The eight stages

1. **Intuition.** An everyday analogy the learner already understands. One fresh analogy per core concept; never reuse an analogy from another part (checked against `course_glossary.json`).
2. **Why it exists.** The real dilemma that made the idea necessary: who was stuck, what went wrong, what was at stake.
3. **What it means.** The plain definition first, then the notation. Symbols are introduced only after the idea is clear.
4. **How it works.** The mechanism step by step, answering the six causal questions: what causes it, why it happens, what changes, who is affected, what happens next, why it matters.
5. **Worked example.** Real numbers from the source, every intermediate step shown and spoken.
6. **Guided application.** A new situation where the narration pauses before each step and lets the learner predict it; the intermediate steps come before the answer.
7. **Independent application.** The quiz (Scene 9) with a thinking pause of at least three seconds.
8. **Limitations and boundaries.** Where the idea stops working, the assumptions behind it, and the mistakes the author warns about.

## Required per part

- At least one inline **prediction question** before a reveal ("Before I show you the third year, guess: will the gap grow or shrink?").
- At least one explicit **causal chain** card: `Condition -> Action -> Mechanism -> Result -> Consequence`.
- A **"Where we are"** course-positioning roadmap in Scene 0 and Scene 10.
- A **COMMON NOVICE TRAP** versus **PROFESSIONAL REALITY** split in Scene 6 or Scene 10.
- Learning outcomes (two to six) stated as observable abilities ("compute the balance after t years with annual compounding").

## Sequencing rules

- Never use a term before it is explained (see the Just-in-Time Concept Clarification standard).
- Concrete before abstract: a scene with a definition must be preceded by a scene that shows the problem.
- Guided application must come before the quiz (P-04).
- The quiz tests only terms registered as introduced in this part or earlier parts (P-07).

## How it is enforced

- P-02: every core concept in the lesson plan has all eight stages mapped to valid scene indexes.
- P-04: causal chain, prediction question, guided application before the quiz, misconception versus reality, and roadmaps in scenes 0 and 10 are all present in the episode.
- Findings carry a repair hint that names the missing stage, and the repair loop re-prompts only the affected scenes.
