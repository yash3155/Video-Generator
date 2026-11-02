// src/domain/finance/financeValidation.mjs

/**
 * Validates financial directional logic (e.g. price drop vs price rally consistency).
 */
export function validateFinancialDirectionalConsistency(subtitle) {
  const issues = [];
  if (!subtitle) return issues;

  const dropMatch = subtitle.match(
    /(?:bought|entered|chased).*?₹\s*(\d+(?:,\d+)?(?:\.\d+)?).*?(?:drop|slump|fell|sink|crash|breakdown).*?₹\s*(\d+(?:,\d+)?(?:\.\d+)?)/i
  );
  if (dropMatch) {
    const buyPrice = Number(dropMatch[1].replace(/,/g, ''));
    const dropPrice = Number(dropMatch[2].replace(/,/g, ''));
    if (dropPrice >= buyPrice) {
      issues.push({
        code: 'FIN_DIR_001',
        message: `Illogical price drop! Bought at ₹${buyPrice} but dropped to higher/equal price ₹${dropPrice}.`,
        severity: 'CRITICAL',
      });
    }
  }

  const rallyMatch = subtitle.match(
    /(?:short|shorted|sold).*?₹\s*(\d+(?:,\d+)?(?:\.\d+)?).*?(?:rally|surged|spiked|squeezed|broke\s*out).*?₹\s*(\d+(?:,\d+)?(?:\.\d+)?)/i
  );
  if (rallyMatch) {
    const shortPrice = Number(rallyMatch[1].replace(/,/g, ''));
    const squeezePrice = Number(rallyMatch[2].replace(/,/g, ''));
    if (squeezePrice <= shortPrice) {
      issues.push({
        code: 'FIN_DIR_002',
        message: `Illogical short squeeze! Shorted at ₹${shortPrice} but squeezed to lower/equal price ₹${squeezePrice}.`,
        severity: 'CRITICAL',
      });
    }
  }

  return issues;
}

/**
 * Validates whether Head & Shoulders preset is appropriately used.
 */
export function validateHeadAndShouldersEligibility(sceneTitle, preset) {
  const issues = [];
  if (preset !== 'head_and_shoulders') return issues;

  const isHS = /head\s*(?:&|and)\s*shoulders|neckline/i.test(sceneTitle || '');
  if (!isHS) {
    issues.push({
      code: 'FIN_HS_001',
      message: `Do not use "head_and_shoulders" preset on a non-H&S scene ("${sceneTitle}"). Use a directional preset instead.`,
      severity: 'CRITICAL',
    });
  }
  return issues;
}

