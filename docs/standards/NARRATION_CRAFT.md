# Narration Craft Standard

`05_teaching_script.md` is the narration every learner hears. It must sound like an excellent teacher talking, not like a textbook read aloud. Stage S7 writes it; check P-05 measures it.

## Vividness

- Open every part with a concrete scene: who, where, when, what is at stake, with real numbers from the source (or badged hypothetical ones). The listener should be able to picture it within 15 seconds.
- Use specific situational detail ("a saddle-maker's apprentice in 1790s Boston, asking the town for a loan to open his own shop") instead of abstractions ("economic agents need capital").
- One fresh, domain-appropriate analogy per core concept. Analogies used in other parts are recorded in the course glossary and may not be reused.
- Use contrast and tension: what most people believe versus what actually happens.

## Informativeness

- Every scene teaches at least one cited fact. No filler scenes.
- Every mechanism answers the six causal questions: cause, reason, change, who is affected, what happens next, why it matters.
- Every number is explained: what it is, where it comes from, and what it means for the learner.
- Worked examples are spoken step by step, matching the on-screen steps one to one.

## Clarity

- One idea per sentence. Average sentence length 8 to 22 words; no sentence over 35 words.
- Signpost transitions: "First...", "Now here is the problem...", "Let's put real numbers on it...".
- Recap the key idea in one line at the end of each scene.
- Speak numbers, units and symbols the way a teacher would. Every beat has a `display` form for the screen and subtitles and a `spoken` form for TTS ("1,157.63 dollars" is spoken "one thousand one hundred fifty-seven dollars and sixty-three cents").
- Words per beat: 25 to 75 (about 10 to 30 seconds). Split longer beats.
- Banned filler: "as we all know", "it goes without saying", "needless to say", "in today's world", "let's dive in", "without further ado", "at the end of the day".

## Dialogue

- The novice asks the questions real beginners ask, including wrong guesses; the mentor answers.
- No skits, jokes or off-topic banter.
- Hindi narration is natural conversational Hinglish in Devanagari script. Standard technical terms keep their English pronunciation (written in Devanagari or kept as Latin acronyms such as APR). On-screen text stays in the chosen display language.

## Script format

Per scene, per beat: `speaker`, `narration.<lang>.display` and `.spoken`, `subtitle.<lang>` (phrases of at most 16 words, built from word timings), `onScreenIntent`, `sourceFactIds`, `newTerms`, `pauseAfterMs`.

## Measured by P-05

Average and maximum sentence length, beat word budget, banned filler phrases, and a readability estimate against the audience level in `book.config.json`. Findings name the beat and the sentence that broke the rule.
