<!-- OPENLECTERN-RESEARCH {"bookId":"demo","chapterId":"ch01","partId":"p1","connector":"demo","sourceIds":["demo-book/book/ch01-simple-and-compound-interest.md"],"query":"Chapter Extraction Prompt v1 for Chapter 1 Part 1 (Simple and Compound Interest)","timestamp":"2026-01-01T00:00:00Z","sha256":"220fb8d5a13660919fe897a9387093092d0c3e3161a460467f7aa39d087c3e82"} -->

# Research context: Money That Grows - Chapter 1, Part 1 (Simple and Compound Interest)

## Chapter scope

- This part covers the whole of Chapter 1: sections 1.1 to 1.6, pages 1 to 6.
- 1.1 Why money has a price (p. 1); 1.2 Simple interest (p. 2); 1.3 Compound interest (p. 3); 1.4 A worked example (p. 4); 1.5 A two-hundred-year experiment (p. 5); 1.6 Limits and common mistakes (p. 6).
- The next part of the course is Chapter 2, which compares quoted rates (APR and APY) and introduces the Rule of 72. Nothing from Chapter 2 belongs in this part.

## Fact ledger

### Definitions

- D1. Interest is the price a borrower pays for using someone else's money for a period of time. (Ch. 1, §1.1, p. 1)
- D2. The principal is the amount lent or deposited at the start. (Ch. 1, §1.1, p. 1)
- D3. The interest rate is the interest for one period expressed as a fraction or percentage of the principal; in this book the period is one year, written "per annum" or p.a. (Ch. 1, §1.1, p. 1)
- D4. A saver who deposits money in a bank is a lender: the bank borrows the deposit and pays interest for it; the same arithmetic works for a borrower paying a lender. (Ch. 1, §1.1, p. 1)
- D5. Simple interest is interest paid only on the original principal. (Ch. 1, §1.2, p. 2)
- D6. Compound interest adds each period's interest to the balance, so the next period's interest is calculated on the larger balance: interest starts earning interest. (Ch. 1, §1.3, p. 3)
- D7. Exponential growth is the pattern in which each period multiplies the balance by the same factor, so the curve gets steeper over time. (Ch. 1, §1.3, p. 3)

### Rules and formulas

- R1. Simple interest formula: I = P r t, where I is the interest in dollars, P the principal in dollars, r the annual rate as a decimal (per year), and t the time in years. The end balance is P + I. (Ch. 1, §1.2, p. 2)
- R2. Under simple interest the interest for each year is the same amount, so the balance grows in a straight line. (Ch. 1, §1.2, p. 2)
- R3. Compound interest formula with interest added once per year: A = P (1 + r)^t, where A is the balance in dollars after t years, P the principal in dollars, r the annual rate as a decimal, and t the number of years. In LaTeX: A = P(1 + r)^{t}. (Ch. 1, §1.3, p. 3)
- R4. Each year a compound balance is multiplied by the same factor (1 + r). (Ch. 1, §1.3, p. 3)

### Worked numerical example

- N1. Inputs: principal 1,000 dollars, rate 5% per year (r = 0.05), time 3 years. (Ch. 1, §1.4, p. 4)
- N2. Simple interest: I = 1,000 x 0.05 x 3 = 150 dollars; balance 1,150 dollars. (Ch. 1, §1.4, p. 4)
- N3. Compound interest, added yearly: year 1 balance 1,050.00 dollars; year 2 balance 1,102.50 dollars; year 3 balance 1,157.63 dollars (rounded to the cent); by formula A = 1,000 x 1.05^3 = 1,157.625. (Ch. 1, §1.4, p. 4)
- N4. The compound account earns 157.63 dollars of interest instead of 150 dollars; the extra 7.63 dollars is interest earned on earlier interest, and the gap widens every year. (Ch. 1, §1.4, p. 4)

### Historical case

- H1. In 1790 Benjamin Franklin's will left 1,000 pounds sterling each to Boston and Philadelphia, to be lent at 5% interest to young married craftsmen who had finished their apprenticeships; repaid loans were to be lent again. (Ch. 1, §1.5, p. 5)
- H2. Franklin calculated that each fund would hold about 131,000 pounds after 100 years; 100,000 pounds were then to be spent on public works and 31,000 pounds left to compound for another 100 years, reaching about 4,061,000 pounds. (Ch. 1, §1.5, p. 5)
- H3. Franklin's arithmetic was sound: 1,000 x 1.05^100 is about 131,501. (Ch. 1, §1.5, p. 5)
- H4. The real funds fell far short: fewer craftsmen borrowed than expected, some loans were never repaid, and money sometimes sat idle; when the trusts were wound up around 1990, Boston's fund was worth roughly 5 million dollars and Philadelphia's roughly 2 million dollars. (Ch. 1, §1.5, p. 5)
- H5. Lesson the author draws: compounding is powerful, but only for money actually invested at the assumed rate, year after year. (Ch. 1, §1.5, p. 5)

### Assumptions, limitations and common mistakes

- L1. Assumption: A = P (1 + r)^t assumes the rate stays the same for the whole period and nothing is withdrawn; real rates change. (Ch. 1, §1.6, p. 6)
- M1. Common mistake: multiplying the yearly interest by the number of years and calling it compound interest; that is simple interest and ignores interest on interest. (Ch. 1, §1.6, p. 6)
- M2. Common mistake: using the rate as a whole number; 5% must be written as 0.05 in the formulas. (Ch. 1, §1.6, p. 6)
- L2. Over short periods the two methods give similar answers; over long periods the difference becomes very large. (Ch. 1, §1.6, p. 6)

## Real-world problem

- Actors: Benjamin Franklin and the cities of Boston and Philadelphia; young married craftsmen who needed loans to start businesses. (Ch. 1, §1.5, p. 5)
- Situation: Franklin wanted a modest gift of 1,000 pounds per city to grow into a large public fund over two centuries by lending it at 5% and re-lending the repayments. (Ch. 1, §1.5, p. 5)
- Failure: the funds reached only roughly 5 million and 2 million dollars by about 1990, far below Franklin's projection, because money was not continuously invested at the assumed rate. (Ch. 1, §1.5, p. 5)
- Invention or idea: compound interest, A = P (1 + r)^t, where interest earns interest and growth is exponential; it explains both Franklin's projection and why idle money breaks it. (Ch. 1, §1.3, p. 3)

## Terms and acronyms

- Interest: the price paid for using someone else's money for a time. (p. 1)
- Principal (P): the starting amount lent or deposited. (p. 1)
- Interest rate (r): interest per period as a fraction or percentage of the principal. (p. 1)
- p.a.: per annum, meaning per year. (p. 1)
- Simple interest: interest on the original principal only. (p. 2)
- Compound interest: interest added to the balance so that interest earns interest. (p. 3)
- Exponential growth: growth by the same multiplying factor each period. (p. 3)

## Dependencies

- Earlier chapters: none; this is the first chapter. It assumes only percentages and basic multiplication.
- Later chapters: Chapter 2 builds on compound interest to compare APR and APY and to estimate doubling time with the Rule of 72; Chapter 3 uses growth rates to separate nominal and real returns.

## Exact quotations

- "Interest starts earning interest." (Ch. 1, §1.3, p. 3)
- "Compounding is powerful, but only for money that is actually invested at the assumed rate, year after year." (Ch. 1, §1.5, p. 5)

## Not in source

- The book does not give interest compounded more than once a year in this chapter: NOT IN SOURCE for this part.
- The book does not give exact year-by-year values of the Franklin funds: NOT IN SOURCE.
