<!-- openlectern-template: research_extract v1 -->
# Research extraction over local text

You are given the text of one chapter of a book the user owns (field `chapterText` in the input). Apply the Chapter Extraction Prompt below to that text only. Treat the chapter text as the uploaded book: never add knowledge from outside it, and write NOT IN SOURCE where the text is silent.

Citations: use the chapter number and the section numbers or headings that appear in the text, for example `(Ch. 2, §2.3)`. Use page numbers only when the text contains them.

Return a JSON object with one field, `markdown`, whose value is your complete Markdown answer with all required sections.

---

{{extractionPrompt}}
