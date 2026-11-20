# Chapter Extraction Prompt (v1)

<!-- Template variables: {{bookTitle}}, {{author}}, {{edition}}, {{chapterNumber}}, {{chapterTitle}}, {{partId}}, {{partScope}}, {{nextPartScope}}. OpenLectern fills them in when it writes PASTE_INTO_NOTEBOOKLM.md or queries a connector. -->

You are helping turn the book **{{bookTitle}}** by {{author}} ({{edition}} edition) into a lesson video for absolute beginners. Answer only from the uploaded book. **Do not invent. If the book does not say it, write NOT IN SOURCE.**

Focus on **Chapter {{chapterNumber}}: {{chapterTitle}}**, part **{{partId}}**, which covers: {{partScope}}. Material that belongs to the next part ({{nextPartScope}}) must be listed under "Chapter scope" and otherwise left out.

Return your answer in Markdown with exactly these sections, in this order, using these headings:

## Chapter scope

The sections and page ranges this part covers, and what belongs to the next part.

## Fact ledger

An exhaustive list, one bullet per item, grouped under these sub-headings: Definitions; Rules and formulas; Worked numerical examples; Case studies and historical events; Assumptions, limitations and common mistakes. Include every definition, claim, rule, threshold, formula, numerical or worked example, case study, historical event (who, when, where, numbers), assumption, limitation, and mistake the author warns about.

- Every bullet ends with a citation in the form `(Ch. N, §section, p. page)`.
- Write every formula in LaTeX **and** in plain words, and define each variable with its unit.
- For every numerical or worked example give all inputs, every intermediate step, and the result.
- Target 15 to 40 bullets for this part; never fewer than 10.

## Real-world problem

The real-world problem the main idea of this part solves, as the author (or the field) describes it: the actors, the situation, the failure, and the invention or idea that fixed it. Cite pages.

## Terms and acronyms

Every term, acronym and symbol introduced in this part, with the author's definition and page.

## Dependencies

Which earlier chapters or concepts this part relies on; which later chapters build on it.

## Exact quotations

At most 2 short quotations (under 25 words each), only where the exact wording matters. Paraphrase everything else.

## Not in source

Anything a learner would expect here that the book does not cover, marked NOT IN SOURCE.

If your answer would be too long, answer one sub-topic at a time; OpenLectern will ask follow-up questions and join the answers.
