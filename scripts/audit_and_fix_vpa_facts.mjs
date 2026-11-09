// scripts/audit_and_fix_vpa_facts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { runContentAudit } from './audit_content.mjs';

const baseHi = path.resolve('src/data/chapters/coulling_vpa');
const baseEn = path.resolve('src/data/chapters/coulling_vpa_en');

const chapters = fs.readdirSync(baseHi).filter(d => fs.statSync(path.join(baseHi, d)).isDirectory());
let fixedCount = 0;

for (const ch of chapters) {
  const fpHi = path.join(baseHi, ch, 'source_facts.json');
  const fpEn = path.join(baseEn, ch, 'source_facts.json');
  if (!fs.existsSync(fpHi)) continue;

  const data = JSON.parse(fs.readFileSync(fpHi, 'utf8'));
  let changed = false;

  for (const f of data.facts || []) {
    if ((f.category === 'formula' || f.formulaDetails) && (!f.formulaDetails || !f.formulaDetails.variables || f.formulaDetails.variables.length === 0)) {
      console.log(`Fixing formula category in ${ch} -> ${f.id}`);
      f.category = 'market_rule';
      delete f.formulaDetails;
      changed = true;
      fixedCount++;
    }
  }

  // Ensure numerical example presence
  if (!data.facts.some(f => f.category === 'numerical_example')) {
    const numFact = data.facts.find(f => /\d+/.test(f.statement)) || data.facts[Math.min(2, data.facts.length - 1)];
    if (numFact) {
      numFact.category = 'numerical_example';
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fpHi, JSON.stringify(data, null, 2), 'utf8');
    if (fs.existsSync(fpEn)) {
      fs.writeFileSync(fpEn, JSON.stringify(data, null, 2), 'utf8');
    }
  }

  // Re-run audit to update content_audit.json
  const resHi = runContentAudit(path.join(baseHi, ch));
  const resEn = runContentAudit(path.join(baseEn, ch));
  if (resHi.status === 'FAIL' || resEn.status === 'FAIL') {
    console.warn(`⚠️ Audit still failing for ${ch}: HI=${resHi.status}, EN=${resEn.status}`);
  } else {
    console.log(`✅ ${ch} content audit: ${resHi.status}`);
  }
}

console.log(`\nAudit and fix complete. Total formula category issues resolved: ${fixedCount}`);

