# Formula Rules

Broken formulas on screen (`/text{Profit}`, raw `\text{...}`, `ext{` after a tab ate `\t`, `rac{a}{b}` after a form feed ate `\f`) were the most visible failure of the reference project. Their root cause is LaTeX inside JSON strings with wrong escaping, plus renderers that print strings instead of typesetting them. These rules make that class of bug impossible or caught.

## 1. LaTeX lives only in `latex` fields

Formulas are stored only in the `latex` field of a typed `Formula` object (`latex`, `expression`, `solvesFor`, `variables[]`). Free text that needs math uses inline segments: `[{ "type": "text", "text": "The rate " }, { "type": "math", "latex": "r" }]`.

## 2. Swallowed backslashes are detected after parsing

After every LLM output is parsed as JSON, every string is scanned for control characters U+0000 to U+001F; in `latex` fields this includes newlines. Their presence means a JSON escape swallowed a LaTeX backslash:

| Escape | Swallowed commands |
| --- | --- |
| `\t` (tab) | `\text`, `\times`, `\theta`, `\tau` |
| `\f` (form feed) | `\frac` |
| `\b` (backspace) | `\beta`, `\bar`, `\binom` |
| `\r` (carriage return) | `\right`, `\rho` |
| `\n` (newline) | `\neq`, `\nu`, `\nabla` |

JSON parse failures caused by `\u` (`\underline`) or invalid escapes such as `\v` are caught too. The sanitizer re-escapes from the raw text when possible (for example tab + `ext{` becomes `\text{`); otherwise the finding is a BLOCKER (C-10).

## 3. Forbidden forms

- `/text`, `/frac` and other slash-commands (C-11).
- Doubled commands such as `\\frac` inside a parsed `latex` value.
- Unbalanced braces.
- `$` delimiters inside `latex` fields.
- Raw `_` or `^` in plain-text fields shown on screen; use a math segment instead.
- Raw `\text`, `\frac` or `\left` outside `latex` fields.

## 4. Strict compilation

Every `latex` value is compiled with KaTeX using `throwOnError: true, strict: "error"`. Any error is a BLOCKER (C-12).

## 5. Typeset, never print

Remotion renders the KaTeX HTML. LaTeX source is never printed as text. OCR of QA stills (R-05) fails on visible `\text`, `\frac`, `/text`, `\left`, `^{` or `_{`.

## 6. Six-way agreement

The typeset equation, the recomputed arithmetic (mathjs over the declared variables and substitution steps), the chart data, the on-screen annotations, the spoken narration numbers, and the stated conclusion must agree within the declared rounding. Any mismatch is a BLOCKER (C-13).

## 7. Variables and steps

Every formula lists every variable with its meaning and unit (C-14). Worked examples go definition, then substitution, then result, and each step's value is recomputed from its `expr`.
