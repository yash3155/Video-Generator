# Assessment Standard

Each chapter part ends its teaching with an interactive quiz (Scene 9). The quiz is the "independent application" stage of the learning progression: it must make the learner think, and it must be fair.

## Structure (check P-06)

- Exactly three beats:
  - **b1 question.** A scenario of at least 18 words that describes a concrete situation, followed by the question. Four options A to D appear in a 2x2 grid.
  - **b2 thinking pause.** At least 3000 ms of pause (`pauseAfterMs >= 3000`), a spinner, and all four options still visible. The narration invites the learner to commit to an answer ("Pause and pick one before I reveal it").
  - **b3 reveal.** The correct option turns green with a check badge; the other options fade to 45% opacity; an explanation banner says why the answer is right and why the most tempting wrong option is wrong.
- Exactly four distinct options; `correctIndex` is 0 to 3.

## Option quality

- Options are plausible. Each wrong option encodes a real misconception (for example "simple interest computed as if it were compound", or "the rate used as a whole number").
- Options are distinct: no two options mean the same thing, and none is a joke.
- Options are similar in length and grammar so the answer cannot be guessed from form.
- Numbers in options are computed, not invented; wrong numeric options come from the misconception they represent.

## No spoilers (check P-09)

The answer is identified only by `correctIndex`. Options never contain spoiler markers, in any language. The check uses this pattern on every option string:

```
/\((?:correct|answer|true|right|उचित|सही|उत्तर)\)/i
```

## Fairness (check P-07)

The quiz may test only terms registered as introduced in this part or earlier parts. A quiz that relies on a term from a later chapter, or a term never explained, is a HIGH finding.

## Explanation

The reveal explanation names the correct option, recomputes the key number when there is one, and names the misconception behind the most tempting wrong option. It cites the facts it uses.

## Orientation and Synthesis

Orientation and Synthesis videos also contain a quiz with the same three-beat structure; their questions test the course-level ideas taught in that video.
