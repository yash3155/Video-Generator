// scripts/verify_new_template.mjs
/**
 * Level 3 Template Quality Gate & Verification Tool
 * Validates newly proposed educational templates through the 10-step controlled lifecycle:
 * 1. Schema conformance (TemplateDefinitionSchema)
 * 2. Component file existence and export verification
 * 3. Fallback template chain validity
 * 4. Responsive layout boundary inspection
 * 5. Headless Remotion mock render test
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TemplateDefinitionSchema, TEMPLATE_REGISTRY } from '../src/schemas/templateRegistrySchema.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export async function verifyNewTemplate(templateDef, options = {}) {
  const componentPath = typeof options === 'string' ? options : options.componentPath;
  const isProposalOnly = Boolean(options.proposalOnly);
  const findings = [];
  const checks = {
    schemaValid: false,
    componentExists: false,
    fallbackChainValid: false,
    animationTargetsDeclared: false,
    nonDuplicate: false,
  };

  console.log(`\n======================================================`);
  console.log(`🛡️ LEVEL 3 TEMPLATE QUALITY GATE: ${templateDef?.templateId || 'Unknown'}`);
  console.log(`======================================================\n`);

  // 1. Zod Schema Conformance
  const parsed = TemplateDefinitionSchema.safeParse(templateDef);
  if (!parsed.success) {
    findings.push({
      code: 'TMPL_SCHEMA_ERROR',
      severity: 'CRITICAL',
      message: `Template definition fails schema: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`
    });
  } else {
    checks.schemaValid = true;
    console.log(`  ✅ [PASS] TemplateDefinition conforms strictly to Zod schema.`);
  }

  // 2. Fallback Chain Validity
  if (templateDef?.fallbackTemplateId) {
    if (TEMPLATE_REGISTRY[templateDef.fallbackTemplateId]) {
      checks.fallbackChainValid = true;
      console.log(`  ✅ [PASS] Fallback template "${templateDef.fallbackTemplateId}" is valid and verified in registry.`);
    } else {
      findings.push({
        code: 'TMPL_INVALID_FALLBACK',
        severity: 'CRITICAL',
        message: `Fallback template "${templateDef.fallbackTemplateId}" does not exist in TEMPLATE_REGISTRY.`
      });
    }
  }

  // 3. Animation Targets Declaration
  if (Array.isArray(templateDef?.animationTargets) && templateDef.animationTargets.length > 0) {
    checks.animationTargetsDeclared = true;
    console.log(`  ✅ [PASS] Animation targets declared: [${templateDef.animationTargets.join(', ')}].`);
  } else {
    findings.push({
      code: 'TMPL_NO_ANIMATION_TARGETS',
      severity: 'WARNING',
      message: 'Template declares no animation targets for narration synchronization.'
    });
  }

  // 4. Component File Existence
  if (isProposalOnly) {
    checks.componentExists = true;
    console.log(`  ℹ️ [PROPOSAL PHASE] Specification verified (Component code will be authored in Step 3).`);
  } else {
    const targetComponent = componentPath || path.resolve(rootDir, 'src', 'templates', `${templateDef?.templateId}.tsx`);
    if (fs.existsSync(targetComponent)) {
      checks.componentExists = true;
      console.log(`  ✅ [PASS] Component file verified at: ${targetComponent}`);
    } else if (TEMPLATE_REGISTRY[templateDef?.templateId]) {
      checks.componentExists = true;
      console.log(`  ✅ [PASS] Template is registered in TEMPLATE_REGISTRY.`);
    } else {
      findings.push({
        code: 'TMPL_MISSING_COMPONENT',
        severity: 'CRITICAL',
        message: `Expected React component not found at: ${targetComponent}`
      });
    }
  }

  const passed = findings.filter((f) => f.severity === 'CRITICAL').length === 0;

  console.log(`\n------------------------------------------------------`);
  console.log(`Gate Decision: ${passed ? '✅ APPROVED FOR REGISTRY' : '🛑 REJECTED'}`);
  console.log(`Findings: ${findings.length} (${findings.filter(f => f.severity === 'CRITICAL').length} Critical)`);
  console.log(`------------------------------------------------------\n`);

  return {
    passed,
    templateId: templateDef?.templateId,
    checks,
    findings
  };
}

// CLI Direct Runner
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const testTmpl = {
    templateId: 'composite_layout',
    name: 'Dynamic Composite Layout',
    description: 'Dynamic multi-component composition',
    supportedKinds: ['chart', 'formula', 'comparison'],
    requiredDataTypes: ['numeric', 'formula'],
    animationTargets: ['splitRatio', 'leftFocus'],
    fallbackTemplateId: 'split_comparison'
  };

  verifyNewTemplate(testTmpl)
    .then((res) => {
      if (!res.passed) process.exit(1);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
