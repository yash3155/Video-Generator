// src/domain/finance/financeFormatters.ts

/**
 * Formats a numeric value into an Indian Rupee string (e.g. ₹152 or ₹1,52,000).
 */
export function formatRupee(
  value: number,
  options: { showPaisa?: boolean; shortNotation?: boolean } = {}
): string {
  if (value === undefined || value === null || isNaN(value)) return '₹0';

  if (options.shortNotation) {
    if (Math.abs(value) >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(value) >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
  }

  const parts = value.toFixed(options.showPaisa ? 2 : 0).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  const isNegative = integerPart.startsWith('-');
  if (isNegative) integerPart = integerPart.slice(1);

  // Indian number grouping: 3 digits for first group from right, then 2 digits
  let lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInteger =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `${isNegative ? '-' : ''}₹${formattedInteger}${decimalPart}`;
}

/**
 * Formats a derivative strike price.
 */
export function formatStrikePrice(strike: number): string {
  return `₹${Math.round(strike)}`;
}

/**
 * Formats option premium with symbol.
 */
export function formatPremium(premium: number): string {
  return `₹${premium.toFixed(2)}`;
}
