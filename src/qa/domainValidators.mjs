// src/qa/domainValidators.mjs
import {
  validateFinancialDirectionalConsistency,
  validateHeadAndShouldersEligibility,
} from '../domain/finance/financeValidation.mjs';

const domainValidators = new Map();

/**
 * Register a custom domain validator.
 */
export function registerDomainValidator(domain, validatorFn) {
  domainValidators.set(domain.toLowerCase(), validatorFn);
}

/**
 * Built-in Finance Domain Validator
 */
function validateFinanceDomain(context) {
  const findings = [];
  const { rawEpisode } = context;
  if (!rawEpisode) return findings;

  (rawEpisode.scenes || []).forEach((scene, sIdx) => {
    const beats = scene.beats || [];

    if (scene.template === 'data_visualizer') {
      const sceneTitleCombo = `${scene.title || ''} ${beats[0]?.ui_state?.chartTitle || ''} ${beats[0]?.ui_state?.chartSubtitle || ''}`;

      beats.forEach((beat, bIdx) => {
        const ui = beat.ui_state || {};
        const preset = ui.preset;

        // Head and Shoulders pattern validation
        if (preset) {
          const hsIssues = validateHeadAndShouldersEligibility(sceneTitleCombo, preset);
          hsIssues.forEach((iss) => {
            findings.push({
              id: `fin_hs_${sIdx}_${bIdx}`,
              category: 'domain_rules',
              severity: 'HIGH',
              message: iss.message,
              sceneIndex: sIdx,
              beatId: beat.id,
              target: 'preset',
              cause: 'Head & Shoulders pattern used in scene not titled for Head & Shoulders.',
              suggestedRepair: 'Rename scene to include "Head and Shoulders" or change chart preset.',
            });
          });
        }

        // Directional Consistency Check
        const dirIssues = validateFinancialDirectionalConsistency(beat.en_subtitle || '');
        dirIssues.forEach((iss) => {
          findings.push({
            id: `fin_dir_${sIdx}_${bIdx}`,
            category: 'domain_rules',
            severity: 'HIGH',
            message: iss.message,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'en_subtitle',
            cause: 'Subtitle text conflicts with financial price direction.',
            suggestedRepair: 'Align subtitle tone with chart movement direction.',
          });
        });

        // Rupee Currency Symbol Check
        if (ui.yAxisUnit && ui.yAxisUnit !== '₹') {
          findings.push({
            id: `fin_rupee_${sIdx}_${bIdx}`,
            category: 'domain_rules',
            severity: 'MEDIUM',
            message: `Finance chart yAxisUnit is "${ui.yAxisUnit}" instead of "₹".`,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'yAxisUnit',
            cause: 'Indian market context requires standard ₹ currency symbol.',
            suggestedRepair: 'Set yAxisUnit to "₹".',
          });
        }
      });
    }

    if (scene.template === 'formula_breakdown') {
      beats.forEach((beat, bIdx) => {
        const formulaData = beat.visual?.data || beat.ui_state || {};
        const expr = (formulaData.expression || '').toLowerCase();
        // Payoff vs Profit distinction check
        if (expr.includes('payoff') && expr.includes('premium') && !expr.includes('profit')) {
          findings.push({
            id: `fin_payoff_profit_${sIdx}_${bIdx}`,
            category: 'domain_rules',
            severity: 'HIGH',
            message: 'Formula conflates Payoff with Profit (Payoff includes premium subtraction without naming Profit).',
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'expression',
            cause: 'Payoff is S_T - K (options/futures payoff at maturity without premium subtraction).',
            suggestedRepair: 'Use "Profit = Payoff - Premium" or "Payoff = S_T - K".',
          });
        }
      });
    }
  });

  return findings;
}

// Register built-in finance validator
registerDomainValidator('finance', validateFinanceDomain);

/**
 * Run all domain validators applicable to the given context.
 */
export function runDomainValidators(context) {
  const findings = [];
  const activeDomains = new Set([
    (context.domain || '').toLowerCase(),
    ...(context.domainModules || []).map((m) => m.toLowerCase()),
  ]);

  for (const domain of activeDomains) {
    if (domainValidators.has(domain)) {
      const validator = domainValidators.get(domain);
      try {
        const domainFindings = validator(context);
        if (Array.isArray(domainFindings)) {
          findings.push(...domainFindings);
        }
      } catch (err) {
        findings.push({
          id: `domain_val_err_${domain}`,
          category: 'domain_rules',
          severity: 'HIGH',
          message: `Error executing ${domain} validator: ${err.message}`,
          cause: err.stack || err.message,
          suggestedRepair: 'Review domain validator code.',
        });
      }
    }
  }

  return findings;
}

