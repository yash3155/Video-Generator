# Chapter 2: Rates That Compare: APR, APY and the Rule of 72

*Money That Grows: A Beginner's Primer on Interest, Rates and Inflation* - OpenLectern Contributors - CC BY 4.0

## 2.1 Two numbers for one loan (page 7)

Banks often quote two different rates for the same product. The **APR**, or **annual percentage rate**, is the yearly rate before compounding within the year is taken into account. If an account pays interest n times a year, each period pays APR / n.

The **APY**, or **annual percentage yield**, is the rate you actually earn in one year once the interest added during the year starts earning interest too. Savings products usually advertise the APY because it is the larger number; loans usually advertise the APR because it is the smaller one.

## 2.2 Converting APR to APY (page 8)

If interest is added n times per year, then

APY = (1 + APR / n)^n - 1

with both rates written as decimals. For example, a credit card that charges an APR of 12% with interest added monthly (n = 12) has APY = (1 + 0.12 / 12)^12 - 1 = 1.01^12 - 1, which is about 0.1268, or 12.68%. A borrower who never repays the card for a year owes 12.68% more, not 12%.

The more often interest is added, the larger the gap between APR and APY, but the gap shrinks with each extra compounding period: daily compounding of a 12% APR gives an APY of about 12.75%.

## 2.3 The Rule of 72 (page 9)

To estimate how many years it takes money to double at a fixed yearly rate, divide 72 by the rate written as a percentage:

years to double = 72 / rate

At 6% a year, money doubles in about 72 / 6 = 12 years. At 9% it doubles in about 8 years. The exact answer at 6% is ln(2) / ln(1.06), about 11.9 years, so the shortcut is close.

The rule is old. The Italian mathematician Luca Pacioli described it in his 1494 book *Summa de arithmetica*, without explaining where it came from. Merchants used it because 72 has many divisors (2, 3, 4, 6, 8, 9, 12), which makes mental arithmetic easy.

## 2.4 Limits and common mistakes (page 10)

- The Rule of 72 is an approximation. It is most accurate for rates between about 6% and 10%; at very high rates it underestimates the doubling time.
- Comparing an APR on one product with an APY on another is a common mistake. Convert both to APY before comparing.
- The APY formula assumes the rate stays fixed for the whole year and that no money is withdrawn.
