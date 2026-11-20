# Demo book: Money That Grows

*Money That Grows: A Beginner's Primer on Interest, Rates and Inflation* is a short, original book written for OpenLectern by the OpenLectern Contributors. It exists so that the whole pipeline can run offline, in tests and in CI, without shipping anyone else's copyrighted text.

- `book/` - the three chapters (simple and compound interest; APR, APY and the Rule of 72; inflation and real returns).
- `book.config.json` - the book configuration the wizard would create (`--book demo` uses it).
- `research/<chapter>/p1/notebook_context.md` - research files in exactly the format the Chapter Extraction Prompt asks NotebookLM to return, so stage S1 needs no network.
- `recorded/` - recorded LLM task outputs used by `--llm replay` (created by the end-to-end demo run).

## License

The book text, research files and recorded outputs in this folder are licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0); see `LICENSE`. Attribution: "Money That Grows, by the OpenLectern Contributors, CC BY 4.0".

The historical figures in Chapter 1 (Benjamin Franklin's 1790 bequest) and Chapter 2 (Luca Pacioli's 1494 description of the Rule of 72) and the economist Irving Fisher in Chapter 3 are summarised from widely published history; the numbers in the worked examples are computed in the text.
