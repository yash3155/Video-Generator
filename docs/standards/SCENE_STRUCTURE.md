# Scene Structure Standard

Chapter parts follow a canonical 12-scene structure. Orientation and Synthesis videos use their own paradigms (see the Orientation and Synthesis standard). Scene purposes and beat counts for scenes 0, 9 and 11 are fixed; templates for the deep-dive scenes are chosen by concept topology.

| Scene | Default template | Beats | Purpose |
| --- | --- | --- | --- |
| 0 | technical_panel / chat_story | 4 | Problem-first hook presented through a structured pedagogical layout (e.g. Two-Party Economic Mechanism or 4-Pillar Institutional Framework) instead of on-screen speech bubbles. b1: real-world dilemma and commercial stakes. b2: concrete situation and counterparty roles. b3: commercial breakdown and default risk. b4: institutional invention and resolution. Includes the "where we are" roadmap. No conversational banter. |
| 1 | tug_of_war | 3 | The two opposing forces from the hook, and how the concept resolves them. |
| 2 | progressive_cards | 4 | The four pillars of the solution: the part's roadmap. |
| 3 to 8 | chosen per concept | 1 to 3 each | Deep dive: definitions, mechanisms, formulas, charts, causal chains, worked example, guided application, limitations. |
| 9 | interactive_quiz | 3 | b1: the question (a scenario of at least 18 words) with four options A to D in a 2x2 grid. b2: thinking pause of at least 3 seconds, spinner visible, options visible. b3: reveal: the correct option turns green with a check badge, the others fade to 45% opacity, and an explanation banner appears. |
| 10 | chat_story / roadmap | 2 to 3 | Mentor wisdom tied back to the opening trap; misconception versus reality; "where we are" roadmap with an explicit forward link (both narration and on-screen upcoming step) detailing what the learner will understand in the next part or chapter. |
| 11 | summary_thread | 6 | Exactly 8 rules recapping only concepts taught in this part (no preview-only topics). Beats show ranges [0,0] roadmap, [1,2], [3,4], [5,6], [7,8] (rule 8 gets its own spotlight), then [1,8] as a compact two-column overview. Each rule on screen matches the narration 1-to-1. |

## Diversity engine

- No identical template in adjacent scenes unless the second scene sets `pedagogicalContinuation: true`.
- No template is used for more than 30% of the scenes.
- At least five distinct templates per part.
- Template choice follows concept topology: a process goes to `causal_chain` or `diagram_flow`; a comparison to `split_comparison` or `table_compare`; a quantity over time to `data_chart`; a formula to `formula_breakdown` or `worked_example`.

Check P-10 enforces these rules and S8 records the justification of every template choice in `07_storyboard.json`.

## Beats

- A beat is one narration unit of 25 to 75 words with one visual state.
- Each beat has stable id `sNNbM` (scene number, beat number), a speaker, narration per language, `visual` state (which elements are shown, which is focused, ranges for summaries, quiz phase) and `visualCues` anchored to spoken words.
- Pauses: 260 ms between normal beats, 450 ms at scene transitions, at least 3200 ms for the quiz thinking beat.

## Layout per scene

Header `COURSE · CHAPTER · PART` with segmented progress pills, scene title, main teaching panel, persistent `POINTS TO REMEMBER` footer (at most three takeaways for the current scene), and captions centered above the footer.
