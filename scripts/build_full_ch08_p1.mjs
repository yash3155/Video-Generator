import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch08/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_08/Part_01/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_08/Part_01/script_hi.md', 'utf8');

const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
let hiMatches = [...hiScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];
if (hiMatches.length === 0) {
  hiMatches = [...hiScriptText.matchAll(/\*\*(b\d+):\*\*\s*"([^"]+)"/g)];
}

const enBeats = {};
const hiBeats = {};
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());
hiMatches.forEach(m => hiBeats[m[1]] = m[2].trim());

// Handle beat 38 / 39 synchronization in Chapter 8 Part 1:
// In EN, b38 has both the rule and conclusion: split into b38 and b39
if (enBeats['b38'] && !enBeats['b39']) {
  const fullText = enBeats['b38'];
  const splitIdx = fullText.indexOf('In Chapter Nine');
  if (splitIdx !== -1) {
    enBeats['b38'] = fullText.slice(0, splitIdx).trim();
    enBeats['b39'] = fullText.slice(splitIdx).trim();
  } else {
    enBeats['b39'] = "In Chapter Nine, we advance into OIS Discounting, Credit Issues, and Interbank Funding Costs.";
  }
}

for (let i = 1; i <= 39; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts! (EN: ${Boolean(enBeats[k])}, HI: ${Boolean(hiBeats[k])})`);
  }
}

// 1. Facts with full numerical grounding from Chapter 8
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch08",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "Securitization is the pooling of contractual debt obligations—such as residential mortgages or auto loans—into marketable Asset-Backed Securities (ABS) sold via an offshore Special Purpose Vehicle (SPV) to institutional investors.",
      citation: { chapter: "8", section: "8.1", page: "197" }
    },
    {
      id: "F02",
      category: "market_rule",
      statement: "The transition from Originate-to-Hold to Originate-to-Distribute separated loan origination from default risk, eliminating bank incentives to enforce strict underwriting discipline and fueling subprime NINJA lending.",
      citation: { chapter: "8", section: "8.1", page: "199" }
    },
    {
      id: "F03",
      category: "market_rule",
      statement: "Tranching waterfall: In Hull's canonical baseline ABS model, a mortgage pool is carved into an 80% Senior AAA tranche, a 15% Mezzanine BBB tranche, and a 5% Equity tranche. Cash flows cascade top-down, but credit default losses burn strictly bottom-up.",
      citation: { chapter: "8", section: "8.2", page: "200" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "ABS CDO Tranche Loss: An ABS CDO re-tranches BBB mezzanine tranches into 75% AAA, 20% Mezzanine, and 5% Equity. A 10% underlying mortgage loss causes a 33.3% loss on the BBB tranches (5% absorbed by Equity, remaining 5% / 15% = 33.3%). Because CDO subordination is 25%, the 33.3% loss entirely wipes out the AAA CDO tranche.",
      citation: { chapter: "8", section: "8.3", page: "203" }
    },
    {
      id: "F05",
      category: "market_rule",
      statement: "Gaussian Copula models assumed pairwise correlation of 0.0 to 0.2 across geographic housing markets based on historical data. During the nationwide housing downturn, defaults became systemic and correlations spiked toward 1.0, destroying assumed diversification.",
      citation: { chapter: "8", section: "8.4", page: "206" }
    },
    {
      id: "F06",
      category: "market_rule",
      statement: "The issuer-pays compensation model created perverse incentives for credit rating agencies (Moody's, S&P, Fitch) to award AAA ratings to fragile structured CDOs to prevent investment banks from fee-shopping across competitors.",
      citation: { chapter: "8", section: "8.5", page: "208" }
    },
    {
      id: "F07",
      category: "market_rule",
      statement: "The 2007-2008 liquidity run resulted from OTC opacity: banks could not ascertain counterparty toxic CDO exposure, causing the interbank repo and lending markets to freeze completely.",
      citation: { chapter: "8", section: "8.6", page: "210" }
    },
    {
      id: "F08",
      category: "regulation",
      statement: "The US Dodd-Frank Wall Street Reform Act and international Basel III framework mandated the Skin-in-the-Game rule (5% risk retention), the Volcker Rule, punitive capital weights on securitized tranches, and mandatory central clearing for standardized OTC derivatives.",
      citation: { chapter: "8", section: "8.7", page: "212" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch08",
  partId: "p1",
  title: "Securitization and the Credit Crisis of 2007",
  subtitle: "Tranching Waterfalls, ABS CDO Wipeout Mechanics, Correlation Breakdown & Dodd-Frank",
  targetAudience: "Quantitative finance students, risk managers, structured credit analysts, and fixed-income traders",
  prerequisites: ["Bond duration and credit ratings", "Basic probability and correlation", "Fixed income cash flow structures"],
  scenes: [
    { sceneId: "s00", title: "The Alchemy of Structured Finance: The 2007 Credit Crisis", beats: ["s00b1", "s00b2", "s00b3"] },
    { sceneId: "s01", title: "Banking Evolution: Originate-to-Hold vs. Originate-to-Distribute", beats: ["s01b1", "s01b2", "s01b3"] },
    { sceneId: "s02", title: "The Tranching Waterfall: Senior, Mezzanine & Equity Slices", beats: ["s02b1", "s02b2", "s02b3"] },
    { sceneId: "s03", title: "The Subprime Accelerator & The Causal Chain of Collapse", beats: ["s03b1", "s03b2", "s03b3"] },
    { sceneId: "s04", title: "The ABS CDO: Engineering AAA Gold Out of BBB Toxic Waste", beats: ["s04b1", "s04b2", "s04b3"] },
    { sceneId: "s05", title: "The Math of the Wipeout: How a 7% Loss Destroys 'AAA' CDOs", beats: ["s05b1", "s05b2", "s05b3"] },
    { sceneId: "s06", title: "Correlation Breakdown: The Fatal Quantitative Model Flaw", beats: ["s06b1", "s06b2", "s06b3"] },
    { sceneId: "s07", title: "Institutional Incentives: The Ratings Agency Conflict of Interest", beats: ["s07b1", "s07b2", "s07b3"] },
    { sceneId: "s08", title: "The Systemic Freeze & Guided Loss Calculation", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Analyzing ABS CDO Loss Absorption", beats: ["s09b1", "s09b2", "s09b3"] },
    { sceneId: "s10", title: "Regulatory Aftermath: Dodd-Frank, Basel III & Skin-in-the-Game", beats: ["s10b1", "s10b2", "s10b3"] },
    { sceneId: "s11", title: "Summary Thread: 8 Hard Lessons of the Credit Crisis", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch08",
  partId: "p1",
  formulas: [
    {
      id: "M01",
      name: "Tranche Loss Percentage",
      latex: "L_{\\text{mezz}} = \\frac{\\max(0, L_{\\text{pool}} - S_{\\text{equity}})}{W_{\\text{mezz}}}",
      variables: [
        { symbol: "L_mezz", description: "Percentage loss suffered by Mezzanine tranche", unit: "percentage" },
        { symbol: "L_pool", description: "Cumulative portfolio default loss", unit: "percentage" },
        { symbol: "S_equity", description: "Subordination provided by Equity tranche (e.g. 5%)", unit: "percentage" },
        { symbol: "W_mezz", description: "Thickness of Mezzanine tranche (e.g. 15%)", unit: "percentage" }
      ]
    },
    {
      id: "M02",
      name: "ABS CDO Senior Tranche Loss",
      latex: "L_{\\text{CDO, AAA}} = \\frac{\\max(0, L_{\\text{mezz}} - S_{\\text{CDO, sub}})}{W_{\\text{CDO, AAA}}}",
      variables: [
        { symbol: "L_CDO, AAA", description: "Loss suffered by AAA CDO tranche", unit: "percentage" },
        { symbol: "S_CDO, sub", description: "Subordination below AAA CDO tranche (e.g. 25%)", unit: "percentage" },
        { symbol: "W_CDO, AAA", description: "Thickness of AAA CDO tranche (e.g. 75%)", unit: "percentage" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch08",
  partId: "p1",
  scenes: lessonPlan.scenes.map(s => ({
    sceneId: s.sceneId,
    title: s.title,
    beats: s.beats.map(b => ({
      beatId: b,
      narrationEn: enBeats[b.replace('s', 'b').replace(/s\d{2}/, '')] || enBeats['b' + b.slice(-2)] || "Narration text",
      narrationHi: hiBeats[b.replace('s', 'b').replace(/s\d{2}/, '')] || hiBeats['b' + b.slice(-2)] || "Narration text"
    }))
  }))
};
fs.writeFileSync(path.join(targetDir, '04_pedagogical_script.json'), JSON.stringify(pedagogicalScript, null, 2));

// 5. Episode Compliant Structure
const episode = {
  schemaVersion: 1,
  bookId: "hull",
  chapterId: "ch08",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 8",
  partLabel: "Part 1",
  title: "Securitization and the Credit Crisis of 2007",
  displayLanguage: "en",
  languages: ["en", "hi"],
  personas: {
    en: {
      novice: { name: "Professor", voice: "en-US-ChristopherNeural" },
      mentor: { name: "Professor", voice: "en-US-ChristopherNeural" }
    },
    hi: {
      novice: { name: "Professor", voice: "hi-IN-MadhurNeural" },
      mentor: { name: "Professor", voice: "hi-IN-MadhurNeural" }
    }
  },
  progress: { index: 1, total: 1 },
  theme: "dark-classroom",
  provenance: { mock: false },
  scenes: [
    // Scene 0: The Alchemy of Structured Finance
    {
      id: "s00",
      index: 0,
      title: "The Alchemy of Structured Finance: The 2007 Credit Crisis",
      purpose: "Introduce securitization, SPV pooling, and the 2007 global systemic crisis roadmap",
      takeaways: [
        "In 2007, global credit markets suffered the worst systemic collapse since the Great Depression",
        "Securitization pools illiquid debt into marketable Asset-Backed Securities (ABS)",
        "Chapter 8 examines tranching waterfalls, ABS CDOs, correlation breakdown, and Dodd-Frank"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Securitization Architecture & 2007 Subprime Detonation",
        steps: [
          { label: "Step 1: Debt Origination", detail: "Thousands of illiquid residential mortgages & loans originated by banks" },
          { label: "Step 2: SPV Pooling", detail: "Loans sold to bankruptcy-remote Special Purpose Vehicle" },
          { label: "Step 3: Tranching Waterfall", detail: "Cash flows sliced into Senior (80% AAA), Mezzanine (15% BBB), Equity (5%)" },
          { label: "Step 4: Institutional Distribution", detail: "Marketable ABS notes sold to global pension funds and asset managers" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b01'] }, hi: { display: hiBeats['b01'] } },
          visualCues: [{ target: "step_0", anchor: { en: "2007", hi: "Two thousand seven" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b02'] }, hi: { display: hiBeats['b02'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Securitization", hi: "Securitization" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b03'] }, hi: { display: hiBeats['b03'] } },
          visualCues: [{ target: "step_2", anchor: { en: "masterclass", hi: "masterclass" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 1: Originate-to-Hold vs. Originate-to-Distribute
    {
      id: "s01",
      index: 1,
      title: "Banking Evolution: Originate-to-Hold vs. Originate-to-Distribute",
      purpose: "Contrast traditional commercial banking underwriting against modern securitized fee generation",
      takeaways: [
        "Originate-to-Hold aligned bank incentives with loan creditworthiness via 100% balance sheet retention",
        "Originate-to-Distribute transferred default risk to remote investors, sparking moral hazard",
        "Underwriting discipline decayed into subprime NINJA lending with zero down payments"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "Banking Model Paradigm Shift",
        left: {
          title: "Originate-to-Hold (Traditional)",
          items: [
            "Bank retains mortgage on balance sheet for full 30-year maturity",
            "100% default loss risk borne directly by lending bank",
            "Rigorous underwriting: strict income verification & 20% down payment",
            "Incentives perfectly aligned with borrower solvency"
          ]
        },
        right: {
          title: "Originate-to-Distribute (Securitization)",
          items: [
            "Mortgage sold immediately to offshore SPV for upfront fee income",
            "Default risk shifted 100% to remote global institutional investors",
            "Underwriting standards collapsed: No Income, No Job, No Assets (NINJA)",
            "Extreme moral hazard: volume prioritized over credit quality"
          ]
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b04'] }, hi: { display: hiBeats['b04'] } },
          visualCues: [{ target: "left_title", anchor: { en: "historic structural evolution", hi: "structural evolution" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b05'] }, hi: { display: hiBeats['b05'] } },
          visualCues: [{ target: "left_items", anchor: { en: "traditional Originate-to-Hold", hi: "Originate-to-Hold" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b06'] }, hi: { display: hiBeats['b06'] } },
          visualCues: [{ target: "right_items", anchor: { en: "Originate-to-Distribute", hi: "Originate-to-Distribute" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 2: The Tranching Waterfall
    {
      id: "s02",
      index: 2,
      title: "The Tranching Waterfall: Senior, Mezzanine & Equity Slices",
      purpose: "Detail priority cash flow distribution and bottom-up credit loss absorption mechanics",
      takeaways: [
        "In Hull's baseline ABS model: 80% Senior (AAA), 15% Mezzanine (BBB), 5% Equity",
        "Cash flows cascade top-down: Senior receives first interest and principal claims",
        "Credit default losses burn strictly bottom-up: Equity absorbed first, then Mezzanine, then Senior"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Canonical Baseline ABS Tranching Structure",
        steps: [
          { label: "Senior Tranche (80% · AAA)", detail: "First priority cash flows; absorbs losses only after 20% cumulative pool default" },
          { label: "Mezzanine Tranche (15% · BBB)", detail: "Intermediate yield; absorbs losses between 5% and 20% cumulative default" },
          { label: "Equity Tranche (5% · Unrated)", detail: "High yield equity residual; first-loss buffer absorbing initial 0% to 5% pool default" },
          { label: "Fundamental Waterfall Rule", detail: "Cash Flows Cascade Top-Down · Credit Losses Burn Strictly Bottom-Up" }
        ]
      },
      beats: [
        {
          id: "s02b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b07'] }, hi: { display: hiBeats['b07'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Special Purpose Vehicle", hi: "Special Purpose Vehicle" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b08'] }, hi: { display: hiBeats['b08'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Senior Tranche", hi: "Senior Tranche" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b09'] }, hi: { display: hiBeats['b09'] } },
          visualCues: [{ target: "step_2", anchor: { en: "Mezzanine Tranche", hi: "Mezzanine Tranche" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 3: The Subprime Accelerator & Causal Chain
    {
      id: "s03",
      index: 3,
      title: "The Subprime Accelerator & The Causal Chain of Collapse",
      purpose: "Trace the 5-stage macroeconomic transmission mechanism from Fed rate hikes to interbank freezing",
      takeaways: [
        "Fed rate hikes from 1% to 5.25% triggered adjustable-rate teaser payment resets",
        "Falling home prices eliminated refinancing, causing negative equity and mass defaults",
        "Defaults burned through equity and mezzanine tranches, freezing global interbank repo markets"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Five-Stage Subprime Detonation Chain",
        steps: [
          { label: "1. Macro Shift", detail: "Fed raises rates from 1% to 5.25%; US house price appreciation turns negative" },
          { label: "2. Payment Shock", detail: "Teaser mortgage rates reset: monthly payments spike from $625 to ~$3,000" },
          { label: "3. Negative Equity", detail: "Borrowers owe more than home value; cannot refinance or sell; default rate surges" },
          { label: "4. Tranche Wipeout", detail: "Losses exceed 5% equity buffer; 15% BBB mezzanine wiped out; AAA CDOs hit" },
          { label: "5. Interbank Freeze", detail: "Opaque counterparty exposure causes repo haircuts to spike and liquidity to vanish" }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b10'] }, hi: { display: hiBeats['b10'] } },
          visualCues: [{ target: "step_0", anchor: { en: "insatiable securitization", hi: "insatiable securitization" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b11'] }, hi: { display: hiBeats['b11'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Condition", hi: "Condition" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b12'] }, hi: { display: hiBeats['b12'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Mechanism", hi: "Mechanism" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 4: The ABS CDO: Engineering AAA Gold Out of BBB Toxic Waste
    {
      id: "s04",
      index: 4,
      title: "The ABS CDO: Engineering AAA Gold Out of BBB Toxic Waste",
      purpose: "Demonstrate how investment banks re-securitized unsold BBB mezzanine debt into synthetic AAA notes",
      takeaways: [
        "Unsold BBB mezzanine tranches were pooled into secondary Asset-Backed CDOs",
        "Re-tranching carved 75% AAA, 20% Mezzanine, and 5% Equity from BBB collateral",
        "Re-securitization created extreme non-linear loss amplification under correlated defaults"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "ABS CDO Re-Tranching Architecture",
        steps: [
          { label: "Collateral Intake", detail: "Hundreds of 15% BBB Mezzanine tranches pooled into an ABS CDO" },
          { label: "Re-Tranching Waterfall", detail: "Cash flows re-sliced: 75% Senior (AAA), 20% Mezzanine (BBB), 5% Equity" },
          { label: "Alchemy Illusion", detail: "Rating agencies stamped 75% of BBB debt as pristine AAA institutional grade" },
          { label: "Loss Amplifier", detail: "Modest losses in underlying mortgages wipe out entire AAA CDO tranches" }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b13'] }, hi: { display: hiBeats['b13'] } },
          visualCues: [{ target: "step_0", anchor: { en: "fatal structural vulnerability", hi: "fatal structural vulnerability" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b14'] }, hi: { display: hiBeats['b14'] } },
          visualCues: [{ target: "step_1", anchor: { en: "ABS Collateralized Debt Obligation", hi: "ABS Collateralized Debt Obligation" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b15'] }, hi: { display: hiBeats['b15'] } },
          visualCues: [{ target: "step_3", anchor: { en: "extreme, non-linear loss amplifier", hi: "extreme, non-linear loss amplifier" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 5: The Math of the Wipeout
    {
      id: "s05",
      index: 5,
      title: "The Math of the Wipeout: How a 7% Loss Destroys 'AAA' CDOs",
      purpose: "Walk through Hull's exact quantitative derivation proving how small mortgage losses wipe out AAA CDOs",
      takeaways: [
        "A 7% mortgage pool loss wipes out 5% Equity and 13.3% of the BBB Mezzanine tranche",
        "A 10% mortgage pool loss inflicts a 33.3% loss on the BBB Mezzanine tranche",
        "Because CDO subordination is only 25%, a 33.3% mezzanine loss wipes out 33% of the AAA CDO"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Hull's CDO Wipeout Loss Mathematics",
        formula: "L_{\\text{mezz}} = \\frac{L_{\\text{pool}} - 5\\%}{15\\%}, \\quad L_{\\text{CDO, AAA}} = \\frac{L_{\\text{mezz}} - 25\\%}{75\\%}",
        steps: [
          { label: "Step 1: Primary Equity Absorption", detail: "First 5% of mortgage default loss is absorbed 100% by Equity tranche." },
          { label: "Step 2: Primary Mezzanine Loss (at 10% pool loss)", detail: "Remaining 5% loss hits 15% Mezzanine: 5% / 15% = 33.3% Mezzanine loss." },
          { label: "Step 3: CDO Subordination Breach", detail: "CDO subordination is 25% (20% Mezzanine + 5% Equity). Loss of 33.3% exceeds 25%." },
          { label: "Step 4: AAA CDO Tranche Impairment", detail: "(33.3% - 25%) / 75% = 11.1% loss directly burning the AAA CDO tranche!" }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b16'] }, hi: { display: hiBeats['b16'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "rigorous quantitative demonstration", hi: "quantitative demonstration" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b17'] }, hi: { display: hiBeats['b17'] } },
          visualCues: [{ target: "step_1", anchor: { en: "cumulative default loss of seven percent", hi: "seven percent" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b18'] || enBeats['b17'] }, hi: { display: hiBeats['b18'] || hiBeats['b17'] } },
          visualCues: [{ target: "step_3", anchor: { en: "ten percent mortgage loss", hi: "ten percent" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 6: Correlation Breakdown
    {
      id: "s06",
      index: 6,
      title: "Correlation Breakdown: The Fatal Quantitative Model Flaw",
      purpose: "Examine David Li's Gaussian Copula model and why geographic diversification failed during systemic crises",
      takeaways: [
        "Gaussian Copula models assumed low pairwise correlation (0.0 to 0.2) based on tranquil periods",
        "In a macro housing downturn, national home prices dropped simultaneously and correlation spiked toward 1.0",
        "Under correlation near 1.0, tranching diversification vanishes and entire CDO portfolios default together"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "Gaussian Copula Assumption vs. Crisis Reality",
        left: {
          title: "Tranquil Market Assumption (Pre-2007)",
          items: [
            "Low pairwise correlation (0.0 to 0.2) between regional real estate markets",
            "Assumed Florida, California, and Ohio defaults were uncorrelated independent events",
            "Mathematical diversification justified 75% AAA ratings on CDO pools",
            "Models calibrated using only benign historical data (2000-2005)"
          ]
        },
        right: {
          title: "Systemic Crisis Reality (2007-2008)",
          items: [
            "Pairwise default correlation spiked toward 1.0 nationwide",
            "Nationwide housing appreciation went negative across all 50 states simultaneously",
            "Diversification completely vanished; defaults cascaded in tight unison",
            "Senior AAA CDO tranches suffered catastrophic 80% to 100% loss rates"
          ]
        }
      },
      beats: [
        {
          id: "s06b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b19'] }, hi: { display: hiBeats['b19'] } },
          visualCues: [{ target: "left_title", anchor: { en: "fatal quantitative flaw", hi: "fatal flaw" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b20'] }, hi: { display: hiBeats['b20'] } },
          visualCues: [{ target: "left_items", anchor: { en: "Gaussian Copula", hi: "Gaussian Copula" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b21'] }, hi: { display: hiBeats['b21'] } },
          visualCues: [{ target: "right_items", anchor: { en: "systemic downturn", hi: "systemic downturn" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 7: Institutional Incentives & Ratings Agency Conflicts
    {
      id: "s07",
      index: 7,
      title: "Institutional Incentives: The Ratings Agency Conflict of Interest",
      purpose: "Analyze rating agency fee structures, ratings shopping, and regulatory reliance distortion",
      takeaways: [
        "The issuer-pays model meant investment banks paid rating agencies directly for structured ratings",
        "Banks engaged in ratings shopping, threatening to withhold business if AAA was not granted",
        "Institutional mandates forced pension funds to buy AAA securities, creating artificial demand"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Ratings Agency Conflict Transmission Cycle",
        steps: [
          { label: "1. Issuer-Pays Model", detail: "Investment bank underwriters pay Moody's, S&P, and Fitch millions in structuring fees" },
          { label: "2. Ratings Shopping", detail: "Banks pitch models to competing agencies; select the agency with most lenient loss model" },
          { label: "3. Reverse Engineering", detail: "Bank quants tweak tranche thickness to achieve AAA with absolute minimal subordination" },
          { label: "4. Regulatory Enshrinement", detail: "Pension funds legally mandated to hold AAA; massive capital flows into fragile paper" }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b22'] }, hi: { display: hiBeats['b22'] } },
          visualCues: [{ target: "step_0", anchor: { en: "institutional distortion", hi: "institutional distortion" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b23'] }, hi: { display: hiBeats['b23'] } },
          visualCues: [{ target: "step_1", anchor: { en: "issuer-pays model", hi: "issuer-pays model" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b24'] }, hi: { display: hiBeats['b24'] } },
          visualCues: [{ target: "step_2", anchor: { en: "ratings shopping", hi: "ratings shopping" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 8: The Systemic Freeze & Guided Loss Calculation
    {
      id: "s08",
      index: 8,
      title: "The Systemic Freeze & Guided Loss Calculation",
      purpose: "Examine Bear Stearns collapse, repo haircut explosion, and calculate exact CDO losses",
      takeaways: [
        "In summer 2007, Bear Stearns subprime hedge funds collapsed, triggering acute counterparty fear",
        "Because CDO exposures were hidden OTC, banks stopped lending overnight repo liquidity",
        "A 13% pool loss causes 53.3% loss to Mezzanine and a 37.7% destruction of the AAA CDO"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Repo Haircut Spike & Guided 13% Pool Loss Allocation",
        formula: "L_{\\text{mezz}} = \\frac{13\\% - 5\\%}{15\\%} = 53.33\\%, \\quad L_{\\text{CDO, AAA}} = \\frac{53.33\\% - 25\\%}{75\\%} = 37.78\\%",
        steps: [
          { label: "Step 1: Equity Wipeout", detail: "First 5% of mortgage pool loss completely destroys the 5% Equity tranche." },
          { label: "Step 2: Mezzanine Tranche Loss", detail: "Remaining 8% loss hits 15% Mezzanine: 8% / 15% = 53.33% loss." },
          { label: "Step 3: CDO Subordination Exceeded", detail: "53.33% mezzanine loss exceeds CDO 25% subordination by 28.33%." },
          { label: "Step 4: Severe AAA CDO Wipeout", detail: "28.33% / 75% = 37.78% of the pristine AAA CDO tranche is destroyed!" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b25'] }, hi: { display: hiBeats['b25'] } },
          visualCues: [{ target: "step_0", anchor: { en: "summer of 2007", hi: "summer of 2007" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b26'] }, hi: { display: hiBeats['b26'] } },
          visualCues: [{ target: "step_1", anchor: { en: "counterparty trust", hi: "counterparty trust" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b27'] }, hi: { display: hiBeats['b27'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Lehman Brothers collapse", hi: "Lehman Brothers collapse" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 9: Active Recall Quiz
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Analyzing ABS CDO Loss Absorption",
      purpose: "Test student mastery of tranche loss waterfall calculations under a 12% mortgage pool loss",
      takeaways: [
        "Given 80% Senior, 15% Mezzanine, 5% Equity: a 12% pool loss wipes out 46.7% of Mezzanine",
        "Equity absorbs 5%; remaining 7% loss hits 15% Mezzanine tranche: 7% / 15% = 46.67%",
        "The 80% Senior AAA tranche remains fully intact with zero loss under a 12% pool loss"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "A mortgage pool has 80% Senior (AAA), 15% Mezzanine (BBB), and 5% Equity tranches. If the underlying pool suffers a 12% cumulative default loss, what percentage of the Mezzanine tranche is wiped out?",
        options: [
          { label: "Option A", text: "20.0% loss" },
          { label: "Option B", text: "35.5% loss" },
          { label: "Option C", text: "46.7% loss" },
          { label: "Option D", text: "80.0% loss" }
        ],
        correctIndex: 2,
        explanation: "Equity absorbs first 5% of losses. Remaining 12% - 5% = 7% loss hits Mezzanine. 7% / 15% = 46.67% wipeout. Senior AAA tranche remains untouched."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b28'] }, hi: { display: hiBeats['b28'] } },
          visualCues: [{ target: "question_box", anchor: { en: "quantitative mastery", hi: "quantitative mastery" } }],
          pauseAfterMs: 400
        },
        {
          id: "s09b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b29'] }, hi: { display: hiBeats['b29'] } },
          visualCues: [{ target: "options_grid", anchor: { en: "twelve percent", hi: "twelve percent" } }],
          pauseAfterMs: 400
        },
        {
          id: "s09b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b30'] }, hi: { display: hiBeats['b30'] } },
          visualCues: [{ target: "explanation_box", anchor: { en: "Option C", hi: "Option C" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 10: Regulatory Aftermath & Misconceptions Debunked
    {
      id: "s10",
      index: 10,
      title: "Regulatory Aftermath & Common Misconception Debunked",
      purpose: "Examine Dodd-Frank, Basel III, Skin-in-the-Game rules, and dispel the AAA zero-risk myth",
      takeaways: [
        "Dodd-Frank mandated the 5% Skin-in-the-Game risk retention rule for securitization originators",
        "Basel III increased capital requirements, risk weights on structured tranches, and liquidity ratios",
        "A AAA rating does not imply zero risk: structured ratings rely heavily on fragile correlation models"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Key Post-Crisis Regulatory Reforms & Structural Protections",
        steps: [
          { label: "Skin-in-the-Game (Dodd-Frank)", detail: "Originators legally mandated to retain at least 5% credit risk on own balance sheet" },
          { label: "The Volcker Rule", detail: "Prohibits commercial banks from conducting proprietary trading with customer deposits" },
          { label: "Basel III Capital & Liquidity", detail: "Punitive risk-weights on securitizations; mandatory Liquidity Coverage Ratios (LCR)" },
          { label: "Mandatory Central Clearing", detail: "Standardized OTC derivatives cleared through CCPs with daily margin and CSAs" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b31'] }, hi: { display: hiBeats['b31'] } },
          visualCues: [{ target: "step_0", anchor: { en: "fundamentally redesigned", hi: "fundamentally redesigned" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b32'] }, hi: { display: hiBeats['b32'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Skin-in-the-Game rule", hi: "Skin-in-the-Game rule" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b33'] }, hi: { display: hiBeats['b33'] } },
          visualCues: [{ target: "step_2", anchor: { en: "persistent misconception", hi: "persistent misconception" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 11: Summary Thread: 8 Hard Lessons of the Credit Crisis
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: 8 Hard Lessons of the Credit Crisis",
      purpose: "Synthesize the 8 structural rules of securitization, credit crises, and post-crisis regulation",
      takeaways: [
        "Originate-to-distribute created moral hazard; losses cascade top-down, burn bottom-up",
        "ABS CDOs amplify losses non-linearly; correlation spikes to 1.0 eliminate diversification",
        "Never confuse a mathematical rating with asset safety; Dodd-Frank & Basel III enforce reform"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Eight Structural Lessons of the 2007 Credit Crisis",
        rules: [
          { number: 1, title: "Moral Hazard", text: "Originate-to-distribute banking requires mandatory skin-in-the-game risk retention." },
          { number: 2, title: "Loss Waterfall", text: "Credit losses burn strictly bottom-up: Equity absorbs first, then Mezzanine, then Senior." },
          { number: 3, title: "Non-Linear Amplification", text: "Re-tranching BBB debt into ABS CDOs creates catastrophic loss sensitivity." },
          { number: 4, title: "Correlation Breakdown", text: "Pairwise default correlations spike toward 1.0 during systemic macroeconomic shocks." },
          { number: 5, title: "Rating Conflicts", text: "Issuer-pays rating agency compensation structures create severe conflicts of interest." },
          { number: 6, title: "Liquidity Vulnerability", text: "OTC derivative opacity can trigger instant interbank liquidity runs against solvent banks." },
          { number: 7, title: "Regulatory Cleansing", text: "Global reforms enforce mandatory CCP clearing, Volcker trading bans, and strict LCR buffers." },
          { number: 8, title: "Model vs Reality", text: "Never confuse a mathematical rating model with genuine economic asset safety." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b34'] }, hi: { display: hiBeats['b34'] } },
          visualCues: [{ target: "rule_1", anchor: { en: "eight enduring structural lessons", hi: "chaar foundational lessons" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b35'] }, hi: { display: hiBeats['b35'] } },
          visualCues: [{ target: "rule_2", anchor: { en: "Rule One", hi: "Pillar One" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b36'] }, hi: { display: hiBeats['b36'] } },
          visualCues: [{ target: "rule_3", anchor: { en: "Rule Three", hi: "Pillar Two" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b37'] }, hi: { display: hiBeats['b37'] } },
          visualCues: [{ target: "rule_5", anchor: { en: "Rule Five", hi: "Pillar Three" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b5",
          speaker: "instructor",
          narration: { en: { display: enBeats['b38'] }, hi: { display: hiBeats['b38'] } },
          visualCues: [{ target: "rule_7", anchor: { en: "Rule Seven", hi: "Pillar Four" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b6",
          speaker: "instructor",
          narration: { en: { display: enBeats['b39'] }, hi: { display: hiBeats['b39'] } },
          visualCues: [{ target: "rule_8", anchor: { en: "Chapter Nine", hi: "Chapter Nine" } }],
          pauseAfterMs: 600
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(episode, null, 2));
console.log('Chapter 8 Part 1 successfully built!');
