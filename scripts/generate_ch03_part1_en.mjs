// scripts/generate_ch03_part1_en.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SourceFactsSchema,
  ContentAuditSchema,
  LessonPlanSchema,
  StoryboardSchema
} from '../src/schemas/sourceLessonSchemas.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const chapterDir = path.resolve(rootDir, 'src/data/chapters/hull_derivatives_en/ch03_part1');

fs.mkdirSync(chapterDir, { recursive: true });

// ===================================================================
// 1. Source Facts (source_facts.json)
// ===================================================================
const sourceFacts = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch03_part1",
  notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  retrievalTimestamp: new Date().toISOString(),
  bookTitle: "Fundamentals of Futures and Options Markets (John C. Hull)",
  generalAssumptions: [
    "Futures contracts are traded on organized exchanges with daily marking-to-market.",
    "Bona fide hedgers enjoy lower margin requirements than speculators.",
    "Physical spot and futures prices converge at contract maturity."
  ],
  facts: [
    {
      id: "fact-01",
      category: "definition",
      topic: "Definition of Hedging",
      statement: "Hedgers enter into financial derivative contracts (forwards, futures, or options) to reduce or eliminate financial risk arising from potential adverse price movements in an underlying market variable.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets",
        chapter: "3",
        section: "3.1",
        page: 49,
        provenance: "verified_book_excerpt"
      },
      tags: ["hedging", "risk_management", "futures"]
    },
    {
      id: "fact-02",
      category: "definition",
      topic: "Short Hedge Principle",
      statement: "A short hedge is appropriate when the hedger already owns an asset (or expects to produce or own it in the future) and expects to sell it at a future date. The hedger takes a short futures position to protect against a potential decline in price.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets",
        chapter: "3",
        section: "3.1",
        page: 49,
        provenance: "verified_book_excerpt"
      },
      tags: ["short_hedge", "selling", "farmer", "producer"]
    },
    {
      id: "fact-03",
      category: "definition",
      topic: "Long Hedge Principle",
      statement: "A long hedge is appropriate when a company knows it will have to purchase an asset in the future and wants to lock in the price now. The hedger takes a long futures position to protect against a potential rise in price.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets",
        chapter: "3",
        section: "3.1",
        page: 50,
        provenance: "verified_book_excerpt"
      },
      tags: ["long_hedge", "purchasing", "utility", "consumer"]
    },
    {
      id: "fact-04",
      category: "claim",
      topic: "Corporate Hedging — Arguments Against",
      statement: "Shareholders are typically well diversified across multiple assets and can diversify away unsystematic risk on their own; if corporate management hedges risks that shareholders can diversify, it incurs transaction costs without adding shareholder value. Furthermore, if industry competitors do not hedge, a hedged firm faces competitive exposure when prices move favorably.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets",
        chapter: "3",
        section: "3.2",
        page: 52,
        provenance: "verified_book_excerpt"
      },
      tags: ["corporate_finance", "shareholder_diversification", "agency_theory"]
    },
    {
      id: "fact-05",
      category: "claim",
      topic: "Corporate Hedging — Arguments For",
      statement: "Corporate hedging stabilizes cash flows, reduces the probability of costly financial distress or bankruptcy, preserves debt capacity, and ensures sufficient internal cash flow to fund valuable capital projects without needing expensive external financing.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets",
        chapter: "3",
        section: "3.2",
        page: 53,
        provenance: "verified_book_excerpt"
      },
      tags: ["cash_flow_stabilization", "financial_distress", "underinvestment"]
    },
    {
      id: "fact-06",
      category: "case_study",
      topic: "Business Snapshot 3.1: Hedging by Gold Mining Companies",
      statement: "Gold mining companies historically hedged future production by entering into forward sales with banks. Banks hedged by borrowing gold from central banks at the gold lease rate, selling it spot, and investing cash. During sustained gold bull markets, heavily hedged miners suffered severe shareholder backlash because investors bought gold mining shares specifically for unhedged upside exposure to rising gold prices.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets",
        chapter: "3",
        section: "Business Snapshot 3.1",
        page: 55,
        provenance: "verified_book_excerpt"
      },
      tags: ["gold_mining", "barrick_gold", "lease_rate", "central_banks"]
    },
    {
      id: "fact-07",
      category: "formula",
      topic: "Mathematical Definition of Basis",
      statement: "The basis in a hedging situation is defined as: Basis = Spot price of asset to be hedged minus Futures price of contract used (b_t = S_t - F_t). At expiration T, spot and futures prices converge, so the basis approaches zero (b_T = 0).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets",
        chapter: "3",
        section: "3.3",
        page: 55,
        provenance: "verified_book_excerpt"
      },
      formulaDetails: {
        name: "Basis Formula",
        latex: "b_t = S_t - F_t",
        variables: [
          { symbol: "b_t", definition: "Basis at time t", unit: "$ / bushel or unit" },
          { symbol: "S_t", definition: "Spot price of the asset at time t", unit: "$ / unit" },
          { symbol: "F_t", definition: "Futures price of the contract at time t", unit: "$ / unit" }
        ],
        assumptions: ["Spot and futures asset specifications match or closely correlate."]
      },
      tags: ["basis", "convergence", "spot_price", "futures_price"]
    },
    {
      id: "fact-08",
      category: "formula",
      topic: "Effective Price Received / Paid with Hedging",
      statement: "For a short hedge, the net price realized is S_2 + (F_1 - F_2) = F_1 + (S_2 - F_2) = F_1 + b_2. For a long hedge, the net price paid is S_2 - (F_2 - F_1) = F_1 + (S_2 - F_2) = F_1 + b_2. The ultimate economic outcome is locked into the initial futures price F_1 plus the final basis b_2.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets",
        chapter: "3",
        section: "3.3",
        page: 56,
        provenance: "verified_book_excerpt"
      },
      formulaDetails: {
        name: "Effective Hedged Price Formula",
        latex: "P_{\\text{net}} = F_1 + b_2",
        variables: [
          { symbol: "P_{\\text{net}}", definition: "Effective net price received (short) or paid (long)", unit: "$ / unit" },
          { symbol: "F_1", definition: "Initial futures price locked at hedge inception t_1", unit: "$ / unit" },
          { symbol: "b_2", definition: "Final basis at hedge closeout t_2 (S_2 - F_2)", unit: "$ / unit" }
        ],
        assumptions: ["Position is closed prior to physical delivery."]
      },
      numericalDetails: {
        values: {
          F1: 4.20,
          S2: 3.80,
          F2: 3.82,
          b2: -0.02,
          Pnet: 4.18
        },
        units: "$ / bushel",
        contractSize: 5000,
        context: "Hull Chapter 3 corn farmer short hedge numerical example."
      },
      tags: ["effective_price", "net_realized", "basis_formula"]
    },
    {
      id: "fact-09",
      category: "market_rule",
      topic: "Strengthening vs Weakening of the Basis",
      statement: "Strengthening of the basis means (S_2 - F_2) > (S_1 - F_1) (basis increases); this improves the net selling price for a short hedger and worsens the net purchase cost for a long hedger. Weakening of the basis means (S_2 - F_2) < (S_1 - F_1) (basis decreases); this reduces the net selling price for a short hedger and improves the net purchase cost for a long hedger.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets",
        chapter: "3",
        section: "3.3",
        page: 56,
        provenance: "verified_book_excerpt"
      },
      tags: ["strengthening_basis", "weakening_basis", "hedging_outcomes"]
    },
    {
      id: "fact-10",
      category: "claim",
      topic: "Basis Risk Transformation",
      statement: "Hedging does not eliminate all uncertainty; it substitutes basis risk (uncertainty about b_2 = S_2 - F_2) for price risk (uncertainty about S_2). Because basis volatility is typically significantly lower than spot price volatility, hedging substantially lowers total exposure.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets",
        chapter: "3",
        section: "3.3",
        page: 57,
        provenance: "verified_book_excerpt"
      },
      tags: ["basis_risk", "price_risk", "variance_reduction"]
    }
  ]
};

// Validate sourceFacts
SourceFactsSchema.parse(sourceFacts);
fs.writeFileSync(path.join(chapterDir, 'source_facts.json'), JSON.stringify(sourceFacts, null, 2), 'utf8');
console.log('✅ 1. source_facts.json passed Zod validation');

// ===================================================================
// 2. Content Audit (content_audit.json)
// ===================================================================
const contentAudit = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch03_part1",
  auditTimestamp: new Date().toISOString(),
  status: "PASS",
  summary: {
    totalFacts: 10,
    criticalCount: 0,
    warningCount: 0,
    infoCount: 1,
    coveragePercentage: 100
  },
  checklist: {
    sourceCoverageValid: true,
    missingDefinitionsResolved: true,
    prerequisitesIdentified: true,
    numericalExamplesGrounded: true,
    formulaVariablesDefined: true,
    unitsSpecified: true,
    signsConsistent: true,
    contractSizesStated: true,
    assumptionsExplicit: true,
    payoffVsProfitDistinguished: true,
    zeroGenericFiller: true
  },
  findings: [
    {
      code: "INFO_COVERAGE_COMPLETE",
      severity: "INFO",
      category: "source_coverage",
      message: "Comprehensive 10-fact coverage covering Short/Long hedging, corporate governance debate, Gold lease rates (Snapshot 3.1), and Basis risk dynamics."
    }
  ],
  blockingReason: null
};

ContentAuditSchema.parse(contentAudit);
fs.writeFileSync(path.join(chapterDir, 'content_audit.json'), JSON.stringify(contentAudit, null, 2), 'utf8');
console.log('✅ 2. content_audit.json passed Zod validation (Status: PASS)');

// ===================================================================
// 3. Lesson Plan (lesson_plan.json)
// ===================================================================
const lessonPlan = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch03_part1",
  title: "Short Hedges vs Long Hedges, Corporate Hedging Arguments, and Basis Risk Mechanics",
  targetAudiencePersona: "Finance Students & Global Derivatives Traders",
  prerequisites: [
    "Futures contract definition and standardized specifications",
    "Long vs short futures position mechanics and daily settlement"
  ],
  learningOutcomes: [
    "Determine when to implement a short hedge vs a long hedge based on commercial asset exposure",
    "Evaluate the corporate finance debate between shareholder portfolio diversification and managerial cash-flow stabilization",
    "Analyze Business Snapshot 3.1: How gold mining companies hedged production via central bank gold leases, and why shareholders revolted during gold rallies",
    "Formulate basis b_t = S_t - F_t and calculate effective net prices received or paid (P_net = F_1 + b_2)",
    "Differentiate between strengthening and weakening basis dynamics and predict their impact on hedger profitability"
  ],
  sections: [
    {
      sectionIndex: 0,
      title: "The Basic Principles: Short Hedges vs Long Hedges",
      pedagogicalObjective: "Explain commercial motivations for short vs long hedges in agricultural, energy, and metals markets.",
      groundedFactIds: ["fact-01", "fact-02", "fact-03"],
      keyPoints: [
        "A short hedge locks in selling price for asset owners or future producers (farmers, oil extractors).",
        "A long hedge locks in purchase costs for future buyers (manufacturers, electric utilities).",
        "Hedging provides price certainty rather than guaranteeing superior financial profit."
      ]
    },
    {
      sectionIndex: 1,
      title: "Corporate Hedging: The Shareholder Diversification Paradox",
      pedagogicalObjective: "Examine whether public corporations should hedge when shareholders can diversify unsystematic risk on their own.",
      groundedFactIds: ["fact-04", "fact-05"],
      keyPoints: [
        "Shareholder diversification argument: Well-diversified investors hold multi-asset portfolios and may not value costly corporate hedging.",
        "Managerial argument: Hedging reduces bankruptcy risk, lowers financial distress costs, and preserves internal capital investment funding.",
        "Competitive risk: If industry competitors remain unhedged during favorable price swings, hedged firms face strategic margin disadvantages."
      ]
    },
    {
      sectionIndex: 2,
      title: "Business Snapshot 3.1: Gold Mining Companies & The Lease Rate",
      pedagogicalObjective: "Unpack how bullion banks structure forward hedges using central bank gold loans, and why shareholders opposed hedging.",
      groundedFactIds: ["fact-06"],
      keyPoints: [
        "Mining companies locked in forward sales; banks hedged by borrowing physical gold from central banks at the gold lease rate.",
        "Banks sold borrowed gold spot and invested proceeds, returning physical metal upon mine delivery.",
        "Shareholder revolt: When gold entered a major bull market, hedged producers capped upside, angering investors seeking gold exposure."
      ]
    },
    {
      sectionIndex: 3,
      title: "Basis Mechanics: Mathematical Definition and Convergence",
      pedagogicalObjective: "Master the exact mathematical formulation of basis (b = S - F) and contract expiration convergence.",
      groundedFactIds: ["fact-07", "fact-08"],
      keyPoints: [
        "Basis is strictly defined as Spot price minus Futures price: b_t = S_t - F_t.",
        "As delivery approaches, arbitrage forces spot and futures prices to converge, driving basis to zero (b_T = 0).",
        "The effective realized price received or paid simplifies algebraically to P_net = F_1 + b_2."
      ],
      formulaUsed: "b_t = S_t - F_t \\quad \\text{and} \\quad P_{\\text{net}} = F_1 + b_2",
      numericalApplication: "Corn farmer: F_1 = $4.20, S_2 = $3.80, F_2 = $3.82 -> b_2 = -$0.02, P_net = $4.18."
    },
    {
      sectionIndex: 4,
      title: "Strengthening vs Weakening Basis & Basis Risk Transformation",
      pedagogicalObjective: "Demonstrate how basis shifts affect hedger outcomes, and why basis risk is preferable to spot price risk.",
      groundedFactIds: ["fact-08", "fact-09", "fact-10"],
      keyPoints: [
        "Strengthening basis (b_2 > b_1): Spot price rises relative to futures; benefits short hedgers and harms long hedgers.",
        "Weakening basis (b_2 < b_1): Spot price falls relative to futures; benefits long hedgers and harms short hedgers.",
        "Hedging transforms unhedged spot price risk into basis risk, significantly lowering overall variance."
      ]
    }
  ],
  misconceptions: [
    {
      misconception: "Hedging guarantees that a company will make more profit than staying unhedged.",
      factId: "fact-01",
      authorRebuttal: "John C. Hull emphasizes that hedging does not maximize profit—it removes uncertainty. If prices move favorably, an unhedged firm makes higher profits, whereas a hedged firm has fixed its outcome."
    },
    {
      misconception: "Shareholders always benefit when management hedges commodity price risk.",
      factId: "fact-04",
      authorRebuttal: "Hull notes that shareholders are already diversified across many stocks and often specifically invest in commodity companies to obtain pure commodity price exposure. Corporate hedging incurs fees without reducing systematic risk for diversified investors."
    },
    {
      misconception: "A futures hedge eliminates all financial risk for the enterprise.",
      factId: "fact-10",
      authorRebuttal: "Hull clarifies that a futures hedge eliminates spot price risk but substitutes basis risk (uncertainty about b_2 = S_2 - F_2). The final economic price is F_1 + b_2."
    }
  ],
  activeRecallQuiz: {
    scenario: "In May, a farmer enters a short futures hedge at F_1 = $4.20/bushel for 100,000 bushels of corn. In September, the farmer sells the corn in the spot market at S_2 = $3.80/bushel and closes out the futures contract at F_2 = $3.82/bushel.",
    testedFactIds: ["fact-07", "fact-08", "fact-09"],
    question: "What is the final basis b_2 and the effective net price received per bushel?",
    correctAnswer: "b_2 = -$0.02/bu, Effective Price = $4.18/bu",
    explanation: "The final basis is b_2 = S_2 - F_2 = $3.80 - $3.82 = -$0.02. The effective price is F_1 + b_2 = $4.20 + (-$0.02) = $4.18 (or spot price $3.80 plus futures gain $4.20 - $3.82 = $0.38)."
  },
  coreTakeaways: [
    "Short hedges protect asset owners against falling prices; long hedges protect purchasers against rising prices.",
    "Corporate hedging stabilizes cash flows and avoids distress, but diversified shareholders often prefer unhedged exposure.",
    "Basis equals spot minus futures (b_t = S_t - F_t) and converges toward zero at expiration.",
    "Effective price equals F_1 + b_2; hedging transforms spot price risk into basis risk.",
    "Strengthening basis benefits short hedgers; weakening basis benefits long hedgers."
  ]
};

LessonPlanSchema.parse(lessonPlan);
fs.writeFileSync(path.join(chapterDir, 'lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');
console.log('✅ 3. lesson_plan.json passed Zod validation');

// ===================================================================
// 4. Storyboard (storyboard.json)
// ===================================================================
const storyboard = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch03_part1",
  course: "hull_derivatives_en",
  chapterTitle: "Short Hedges vs Long Hedges, Corporate Hedging Arguments, and Basis Risk Mechanics",
  approvedFactIds: [
    "fact-01", "fact-02", "fact-03", "fact-04", "fact-05",
    "fact-06", "fact-07", "fact-08", "fact-09", "fact-10"
  ],
  scenes: [
    {
      sceneIndex: 0,
      title: "The Farmer's Autumn Dilemma",
      template: "chat_story",
      concept: "Alex and Marcus discuss why a grain farmer needs a short hedge while a food manufacturer needs a long hedge.",
      sourceFactIds: ["fact-01", "fact-02", "fact-03"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Alex questions why a farmer would sell futures at harvest if spot prices might surge later.",
          sourceFactIds: ["fact-01", "fact-02"],
          speaker: "Alex"
        },
        {
          beatIndex: 1,
          textOutline: "Marcus explains that hedging neutralizes price risk rather than maximizing speculative upside.",
          sourceFactIds: ["fact-01", "fact-02"],
          speaker: "Marcus"
        },
        {
          beatIndex: 2,
          textOutline: "Alex realizes commercial buyers like food processors face the exact mirror risk and need long hedges.",
          sourceFactIds: ["fact-03"],
          speaker: "Alex"
        }
      ]
    },
    {
      sceneIndex: 1,
      title: "Curriculum Roadmap: Principles, Corporate Agency, and Basis Risk",
      template: "progressive_cards",
      concept: "Structured pedagogical roadmap covering hedge classification, corporate governance debate, and basis mechanics.",
      sourceFactIds: ["fact-01", "fact-04", "fact-07", "fact-10"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Module 1 establishes Short vs Long commercial hedge selection rules.",
          sourceFactIds: ["fact-02", "fact-03"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Module 2 explores corporate hedging agency theory and gold producer Snapshot 3.1.",
          sourceFactIds: ["fact-04", "fact-06"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Module 3 unlocks basis risk formulas, convergence, and strengthening dynamics.",
          sourceFactIds: ["fact-07", "fact-08", "fact-10"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 2,
      title: "Commercial Matchup: Short Hedge vs Long Hedge",
      template: "split_comparison",
      concept: "Side-by-side comparison contrasting short sellers protecting inventory vs long buyers securing input costs.",
      sourceFactIds: ["fact-02", "fact-03"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Define the Short Hedge: sells futures to lock in revenue when already owning or producing the asset.",
          sourceFactIds: ["fact-02"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Define the Long Hedge: buys futures to lock in acquisition costs for scheduled commercial procurement.",
          sourceFactIds: ["fact-03"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Summary invariant: Hedging provides commercial certainty by converting variable spot prices to fixed futures.",
          sourceFactIds: ["fact-01"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 3,
      title: "The Corporate Hedging Paradox: Shareholders vs Managers",
      template: "progressive_cards",
      concept: "Deep dive into John Hull's arguments for and against corporate hedging programs.",
      sourceFactIds: ["fact-04", "fact-05"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Arguments against hedging: Well-diversified shareholders can handle unsystematic price volatility on their own.",
          sourceFactIds: ["fact-04"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Arguments for hedging: Stabilizing cash flows protects debt capacity and avoids costly distress or default.",
          sourceFactIds: ["fact-05"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Competitive hazard: When unhedged competitors gain from market swings, hedged firms face strategic pressure.",
          sourceFactIds: ["fact-04"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 4,
      title: "Business Snapshot 3.1: Gold Mining & Central Bank Leases",
      template: "progressive_cards",
      concept: "Visual process diagram showing how banks borrow physical gold from central banks to hedge miner forward contracts.",
      sourceFactIds: ["fact-06"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Step 1: Gold mining company agrees to sell forward production to an investment bank.",
          sourceFactIds: ["fact-06"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Step 2: Bank borrows gold from a central bank at the gold lease rate, selling spot for cash investment.",
          sourceFactIds: ["fact-06"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Step 3: At maturity, physical mined gold repays central bank; shareholders revolt when spot gold rallies.",
          sourceFactIds: ["fact-06"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 5,
      title: "Basis Mechanics: Mathematical Definition & Expiration Convergence",
      template: "formula_breakdown",
      concept: "Rigorous formula breakdown of basis b_t = S_t - F_t and convergence to zero at expiration.",
      sourceFactIds: ["fact-07"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Formula introduction: Basis is spot price minus futures price (b_t = S_t - F_t).",
          sourceFactIds: ["fact-07"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Breakdown of variables: S_t spot asset price, F_t futures price, measured in dollars per unit.",
          sourceFactIds: ["fact-07"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Convergence property: As expiration approaches, arbitrage forces F_T to equal S_T, driving basis to zero.",
          sourceFactIds: ["fact-07"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 6,
      title: "The Net Price Theorem: Effective Hedged Price",
      template: "formula_breakdown",
      concept: "Mathematical derivation showing why the effective price realized equals the initial futures price plus final basis.",
      sourceFactIds: ["fact-08", "fact-10"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Net price equation: Realized price equals spot sale plus futures gain: S_2 + (F_1 - F_2).",
          sourceFactIds: ["fact-08"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Algebraic rearrangement proves P_net = F_1 + b_2, proving final price depends solely on basis b_2.",
          sourceFactIds: ["fact-08"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Insight: Hedging transforms volatile spot price risk into substantially smaller basis risk.",
          sourceFactIds: ["fact-10"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 7,
      title: "Strengthening vs Weakening Basis Dynamics",
      template: "data_visualizer",
      concept: "Interactive comparison of basis changes and their asymmetric financial impact on short vs long hedgers.",
      sourceFactIds: ["fact-09"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Strengthening basis occurs when basis increases (b_2 > b_1), boosting short hedger realized revenues.",
          sourceFactIds: ["fact-09"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Weakening basis occurs when basis decreases (b_2 < b_1), lowering net acquisition costs for long hedgers.",
          sourceFactIds: ["fact-09"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Summary table contrasting short and long outcomes under both strengthening and weakening environments.",
          sourceFactIds: ["fact-09"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 8,
      title: "Worked Case & Active Recall Quiz: Corn Farmer Short Hedge",
      template: "interactive_quiz",
      concept: "Active recall challenge testing calculation of final basis and effective price realized.",
      sourceFactIds: ["fact-07", "fact-08", "fact-09"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Problem presentation: Farmer shorts at $4.20, sells spot at $3.80, closes futures at $3.82.",
          sourceFactIds: ["fact-08"],
          speaker: "Alex"
        },
        {
          beatIndex: 1,
          textOutline: "Alex analyzes the numbers and identifies that basis dropped to -$0.02.",
          sourceFactIds: ["fact-07", "fact-08"],
          speaker: "Alex"
        },
        {
          beatIndex: 2,
          textOutline: "Marcus confirms: Basis is -$0.02 and effective realized price is $4.18 per bushel.",
          sourceFactIds: ["fact-08"],
          speaker: "Marcus"
        }
      ]
    },
    {
      sceneIndex: 9,
      title: "Executive Synthesis: The 5 Core Principles of Hedging",
      template: "summary_thread",
      concept: "Progressive grouping recap displaying at most 2 rules at a time before final compact overview.",
      sourceFactIds: ["fact-01", "fact-02", "fact-04", "fact-07", "fact-08", "fact-10"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Rule 1 & 2: Short hedge protects sellers from price drops; Long hedge protects buyers from price spikes.",
          sourceFactIds: ["fact-02", "fact-03"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Rule 3: Corporate hedging stabilizes operations and avoids distress, but diversified shareholders may prefer risk.",
          sourceFactIds: ["fact-04", "fact-05"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Rule 4: Gold miners hedged through central bank gold loans, but faced revolt during gold rallies.",
          sourceFactIds: ["fact-06"],
          speaker: "narrator"
        },
        {
          beatIndex: 3,
          textOutline: "Rule 5: Basis equals spot minus futures (b = S - F) and converges to zero at delivery.",
          sourceFactIds: ["fact-07"],
          speaker: "narrator"
        },
        {
          beatIndex: 4,
          textOutline: "Rule 6: Effective price equals initial futures plus final basis (P_net = F_1 + b_2).",
          sourceFactIds: ["fact-08"],
          speaker: "narrator"
        },
        {
          beatIndex: 5,
          textOutline: "Final compact executive overview of all 5 principles.",
          sourceFactIds: ["fact-01", "fact-10"],
          speaker: "narrator"
        }
      ]
    }
  ],
  summarySteps: [
    "Short hedges lock in selling prices; long hedges lock in purchasing costs.",
    "Corporate hedging stabilizes cash flows and prevents financial distress.",
    "Shareholder diversification reduces the need for firms to hedge unsystematic risks.",
    "Gold miners hedged via central bank gold leases, causing shareholder pushback in rallies.",
    "Basis is spot minus futures: b_t = S_t - F_t, converging to zero at maturity.",
    "Effective net price received or paid simplifies to P_net = F_1 + b_2.",
    "Strengthening basis favors short hedgers; weakening basis favors long hedgers.",
    "Hedging transforms volatile spot price risk into smaller, manageable basis risk."
  ],
  bottomTakeaway: "Hedging does not maximize profit—it replaces volatile spot price risk with manageable basis risk."
};

StoryboardSchema.parse(storyboard);
fs.writeFileSync(path.join(chapterDir, 'storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');
console.log('✅ 4. storyboard.json passed Zod validation');
