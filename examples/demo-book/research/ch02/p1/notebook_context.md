<!-- OPENLECTERN-RESEARCH {"bookId":"demo","chapterId":"ch02","partId":"p1","connector":"demo","sourceIds":["demo-book/book/ch02-apr-apy-and-the-rule-of-72.md"],"query":"Chapter Extraction Prompt v1 for Chapter 2 Part 1 (APR, APY and the Rule of 72)","timestamp":"2026-01-01T00:00:00Z","sha256":"11d245a0d8a8685f143cc32eeb8a11363e3a3f6b02fe0cbf53ec0fc293821d5f"} -->

# Research context: Money That Grows - Chapter 2, Part 1 (APR, APY and the Rule of 72)

## Chapter scope

- This part covers the whole of Chapter 2: sections 2.1 to 2.4, pages 7 to 10.
- 2.1 Two numbers for one loan (p. 7); 2.2 Converting APR to APY (p. 8); 2.3 The Rule of 72 (p. 9); 2.4 Limits and common mistakes (p. 10).
- Inflation and real returns belong to Chapter 3, not to this part.

## Fact ledger

### Definitions

- D1. APR (annual percentage rate) is the yearly rate before compounding within the year is taken into account; if interest is added n times a year, each period pays APR / n. (Ch. 2, §2.1, p. 7)
- D2. APY (annual percentage yield) is the rate actually earned in one year once interest added during the year also earns interest. (Ch. 2, §2.1, p. 7)
- D3. Savings products usually advertise the APY because it is the larger number; loans usually advertise the APR because it is the smaller one. (Ch. 2, §2.1, p. 7)

### Rules and formulas

- R1. APY = (1 + APR / n)^n - 1, with both rates as decimals and n the number of compounding periods per year. In LaTeX: \mathrm{APY} = \left(1 + \frac{\mathrm{APR}}{n}\right)^{n} - 1. (Ch. 2, §2.2, p. 8)
- R2. The more often interest is added, the larger the gap between APR and APY, but each extra period adds less. (Ch. 2, §2.2, p. 8)
- R3. Rule of 72: years to double is approximately 72 divided by the yearly rate written as a percentage. (Ch. 2, §2.3, p. 9)

### Worked numerical examples

- N1. A credit card with APR 12% compounded monthly (n = 12): APY = 1.01^12 - 1, about 0.1268, or 12.68%. (Ch. 2, §2.2, p. 8)
- N2. Daily compounding of a 12% APR gives an APY of about 12.75%. (Ch. 2, §2.2, p. 8)
- N3. At 6% a year money doubles in about 72 / 6 = 12 years; at 9% in about 8 years. (Ch. 2, §2.3, p. 9)
- N4. The exact doubling time at 6% is ln(2) / ln(1.06), about 11.9 years. (Ch. 2, §2.3, p. 9)

### Historical case

- H1. Luca Pacioli described the Rule of 72 in his 1494 book Summa de arithmetica without explaining where it came from. (Ch. 2, §2.3, p. 9)
- H2. Merchants used 72 because it has many divisors (2, 3, 4, 6, 8, 9, 12), which makes mental arithmetic easy. (Ch. 2, §2.3, p. 9)

### Limitations and common mistakes

- L1. The Rule of 72 is most accurate for rates between about 6% and 10%; at very high rates it underestimates the doubling time. (Ch. 2, §2.4, p. 10)
- M1. Comparing an APR on one product with an APY on another is a common mistake; convert both to APY first. (Ch. 2, §2.4, p. 10)
- L2. The APY formula assumes a fixed rate for the year and no withdrawals. (Ch. 2, §2.4, p. 10)

## Real-world problem

- Actors: a borrower with a credit card and a saver comparing accounts. (Ch. 2, §2.1, p. 7)
- Situation: two products quote different kinds of rate, so the numbers cannot be compared directly. (Ch. 2, §2.1, p. 7)
- Failure: a borrower who reads 12% APR and never repays owes 12.68% more after a year. (Ch. 2, §2.2, p. 8)
- Invention or idea: the APY conversion formula and the Rule of 72 as a mental shortcut. (Ch. 2, §2.2-2.3, pp. 8-9)

## Terms and acronyms

- APR: annual percentage rate. (p. 7)
- APY: annual percentage yield. (p. 7)
- Compounding period (n): how many times per year interest is added. (p. 8)
- Rule of 72: doubling-time shortcut. (p. 9)

## Dependencies

- Earlier: Chapter 1 (compound interest, A = P (1 + r)^t).
- Later: Chapter 3 uses yearly growth rates to separate nominal and real returns.

## Exact quotations

- None needed; all content is paraphrased.

## Not in source

- Continuous compounding is NOT IN SOURCE.
