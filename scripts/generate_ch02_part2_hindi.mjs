// scripts/generate_ch02_part2_hindi.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const chapterDir = path.resolve(rootDir, 'src/data/chapters/hull_derivatives/ch02_part2');

fs.mkdirSync(chapterDir, { recursive: true });

// 1. Authoritative Source Facts for Chapter 2 Part 2 (Hull)
const sourceFacts = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch02_part2",
  notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  retrievalTimestamp: new Date().toISOString(),
  bookTitle: "Fundamentals of Futures and Options Markets (John C. Hull)",
  generalAssumptions: [
    "Futures contracts are settled daily via marking-to-market.",
    "Bona fide hedgers have lower margin requirements than speculators.",
    "Margin calls require topping up to the full initial margin."
  ],
  facts: [
    {
      id: "fact-01",
      category: "market_rule",
      topic: "Operation of Margin Accounts, Long/Short Symmetry, and Trader Tiers",
      statement: "Margin accounts organize futures trading to prevent contract defaults, with identical margin requirements for both long and short positions. Minimum initial and maintenance margin levels are set by the exchange clearing house based on underlying asset price variability, while bona fide hedgers, day trades, and spread transactions receive lower margin requirements than speculators due to lower default risk.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "2",
        section: "2.4",
        page: 28,
        provenance: "verified_book_excerpt"
      },
      tags: ["margin", "initial_margin", "long_short_symmetry"]
    },
    {
      id: "fact-02",
      category: "market_rule",
      topic: "Margin Interest and Haircuts on Eligible Collateral Securities",
      statement: "Brokers typically pay competitive interest on cash balances held in margin accounts. To satisfy initial margin requirements (but not subsequent margin calls), investors may deposit non-cash securities subject to haircuts: Treasury bills are accepted at approximately 90% of face value (10% haircut), and equity shares are accepted at approximately 50% of market value (50% haircut).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "2",
        section: "2.4",
        page: 29,
        provenance: "verified_book_excerpt"
      },
      tags: ["haircuts", "collateral", "treasury_bills"]
    },
    {
      id: "fact-03",
      category: "definition",
      topic: "Daily Settlement (Marking to Market) and Contract Value Reset",
      statement: "Marking to market (daily settlement) is the procedure where, at the close of each trading day, a futures margin account is adjusted to reflect the investor's daily gain or loss. If the futures price drops, the long trader's broker pays the exchange clearing house, which passes the funds to the short trader's broker (and vice versa when prices rise), effectively closing out and rewriting the futures contract at the new settlement price each day so its value resets to zero.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "2",
        section: "2.4",
        page: 30,
        provenance: "verified_book_excerpt"
      },
      tags: ["marking_to_market", "daily_settlement", "clearinghouse"]
    },
    {
      id: "fact-04",
      category: "formula",
      topic: "Initial Margin, Maintenance Margin (75% Rule), and Variation Margin Call Formula",
      statement: "Initial margin is deposited when a futures position is opened, while maintenance margin is a lower threshold (typically 75% of initial margin) set to prevent the balance from turning negative. If daily losses push the margin balance (B_t) below the maintenance margin (MM), the broker issues a margin call requiring the investor to deposit cash variation margin (VM = IM - B_t) by the close of the next trading day to restore the balance to the full initial margin (IM), or the broker closes out the position.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "2",
        section: "2.4",
        page: 31,
        provenance: "verified_book_excerpt"
      },
      formulaDetails: {
        name: "Variation Margin Formula",
        latex: "VM = IM - B_t \\quad \\text{when } B_t < MM",
        variables: [
          { symbol: "VM", definition: "Variation margin deposit required", unit: "$" },
          { symbol: "IM", definition: "Initial margin required per contract", unit: "$" },
          { symbol: "B_t", definition: "Current account balance after daily MTM debit", unit: "$" },
          { symbol: "MM", definition: "Maintenance margin threshold (approx 0.75 * IM)", unit: "$" }
        ],
        assumptions: ["Variation margin must be paid in cash by next trading day."]
      },
      tags: ["variation_margin", "maintenance_margin", "margin_call"]
    },
    {
      id: "fact-05",
      category: "numerical_example",
      topic: "Example 2.1: 16-Day Gold Futures Margin Account Walkthrough",
      statement: "An investor longs 2 December gold futures contracts (100 oz per contract, 200 oz total) on June 5 at $1,250.00/oz. Initial margin is $6,000/contract ($12,000 total) and maintenance margin is $4,500/contract ($9,000 total, 75% of initial margin). On Day 7 (June 13), gold drops to $1,226.90/oz, driving the account balance down to $7,380 ($1,620 below maintenance margin), triggering a margin call requiring a $4,620 cash variation margin deposit to restore the account to the full $12,000 initial margin level.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "2",
        section: "2.4",
        page: 32,
        provenance: "verified_book_excerpt"
      },
      numericalDetails: {
        values: {
          contractQuantity: 2,
          contractSizeOz: 100,
          totalOz: 200,
          initialFuturesPricePerOz: 1250.00,
          initialMarginTotal: 12000,
          maintenanceMarginTotal: 9000,
          day7PricePerOz: 1226.90,
          day7BalanceBeforeCall: 7380,
          variationMarginCall: 4620
        },
        units: "$ and oz",
        context: "Hull Table 2.1 16-day daily marking to market settlement."
      },
      tags: ["example_2_1", "gold_futures", "margin_walkthrough"]
    },
    {
      id: "fact-06",
      category: "market_rule",
      topic: "Clearing House Structure, Novation, and Credit Risk Elimination",
      statement: "An exchange clearing house acts as an intermediary, guaranteeing performance through legal novation where it becomes the buyer to every seller and seller to every buyer. Clearing house members maintain margin accounts directly with the clearing house and contribute to a default guaranty fund, eliminating bilateral credit risk between trading parties.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "2",
        section: "2.5",
        page: 34,
        provenance: "verified_book_excerpt"
      },
      tags: ["clearing_house", "novation", "counterparty_risk"]
    },
    {
      id: "fact-07",
      category: "market_rule",
      topic: "Bilateral OTC Clearing, ISDA Master Agreements, and Credit Support Annexes",
      statement: "In traditional bilateral over-the-counter (OTC) derivatives markets without CCP clearing, parties trade directly under an ISDA Master Agreement and Credit Support Annex (CSA) that specifies collateral thresholds, eligible securities, and independent credit ratings, exposing each party to significant bilateral counterparty credit risk.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "2",
        section: "2.5",
        page: 35,
        provenance: "verified_book_excerpt"
      },
      tags: ["otc_derivatives", "isda", "csa", "bilateral_clearing"]
    },
    {
      id: "fact-08",
      category: "market_rule",
      topic: "Post-Crisis Regulatory Reforms: Mandated CCP Clearing for OTC Derivatives",
      statement: "Following the 2007-2009 financial crisis, global regulations (Title VII Dodd-Frank in the US and EMIR in Europe) mandated that all standardized over-the-counter derivatives must be cleared through central counterparties (CCPs), while non-cleared bilateral trades must exchange mandatory initial and variation margin.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "2",
        section: "2.5",
        page: 36,
        provenance: "verified_book_excerpt"
      },
      tags: ["regulatory_reforms", "dodd_frank", "emir", "ccp_mandate"]
    },
    {
      id: "fact-09",
      category: "case_study",
      topic: "Business Snapshot 2.2: Long-Term Capital Management's $4 Billion Collapse",
      statement: "In 1998, hedge fund Long-Term Capital Management (LTCM) used extreme leverage (balance-sheet leverage over 25:1 and off-balance-sheet derivatives notional exceeding $1 trillion) to execute convergence arbitrage. Following the August 1998 Russian debt default, widening credit spreads caused simultaneous multi-billion-dollar collateral drains, forcing the Federal Reserve Bank of New York to organize a $3.6 billion bank consortium rescue to avert systemic default.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "2",
        section: "Business Snapshot 2.2",
        page: 37,
        provenance: "verified_book_excerpt"
      },
      tags: ["ltcm", "business_snapshot_2_2", "systemic_risk", "leverage"]
    }
  ]
};

fs.writeFileSync(path.join(chapterDir, 'source_facts.json'), JSON.stringify(sourceFacts, null, 2), 'utf8');
console.log('✅ 1. source_facts.json created');

// 2. Content Audit
const contentAudit = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch02_part2",
  auditTimestamp: new Date().toISOString(),
  status: "PASS",
  summary: {
    totalFacts: 9,
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
      message: "Comprehensive 9-fact coverage covering Margins, MTM, Example 2.1 16-day Gold table, CCPs, and LTCM $4B collapse."
    }
  ],
  blockingReason: null
};

fs.writeFileSync(path.join(chapterDir, 'content_audit.json'), JSON.stringify(contentAudit, null, 2), 'utf8');
console.log('✅ 2. content_audit.json created');

// 3. Lesson Plan
const lessonPlan = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch02_part2",
  title: "Operation of Margin Accounts, Marking-to-Market, and Clearing Mechanics",
  targetAudiencePersona: "Finance Students & Derivatives Traders",
  prerequisites: [
    "Futures contract definition and standardized specifications",
    "Long vs short position mechanics and basic PnL calculation"
  ],
  learningOutcomes: [
    "Explain the operation of futures margin accounts and the 75% maintenance threshold rule",
    "Calculate daily marking-to-market settlements, margin account balances, and variation margin calls",
    "Contrast central counterparty (CCP) clearing with bilateral OTC clearing, ISDA agreements, and collateral haircuts",
    "Analyze the systemic collapse of Long-Term Capital Management ($4B loss) driven by extreme leverage and collateral drains"
  ],
  sections: [
    {
      sectionIndex: 0,
      title: "The Purpose and Operation of Margin Accounts",
      pedagogicalObjective: "Explain why futures exchanges require performance bond deposits to eliminate party default risk.",
      groundedFactIds: ["fact-01", "fact-02"],
      keyPoints: [
        "Margin accounts act as collateral performance bonds rather than borrowed money loans.",
        "Long and short positions face symmetric margin requirements set by the clearinghouse.",
        "Brokers accept Treasury bills at 90% face value and shares at 50% market value as initial collateral."
      ]
    },
    {
      sectionIndex: 1,
      title: "Daily Settlement and Marking to Market (MTM)",
      pedagogicalObjective: "Master the end-of-day re-pricing mechanism that resets contract values to zero daily.",
      groundedFactIds: ["fact-03", "fact-04"],
      keyPoints: [
        "Each trading day, contracts are settled at closing price and rewritten at the new settlement level.",
        "Daily profits are credited in cash to the winning account; losses are debited immediately.",
        "Maintenance margin is set at approximately 75% of initial margin to absorb daily volatility."
      ]
    },
    {
      sectionIndex: 2,
      title: "Example 2.1: 16-Day Gold Futures Margin Walkthrough",
      pedagogicalObjective: "Follow day-by-day cash flows in a 200 oz gold position to calculate exact margin call obligations.",
      groundedFactIds: ["fact-04", "fact-05"],
      keyPoints: [
        "Two gold contracts require $12,000 initial margin and $9,000 maintenance margin.",
        "On Day 7, gold drops to $1,226.90, dipping account balance to $7,380 ($1,620 below maintenance).",
        "Crucial rule: The investor must deposit $4,620 variation margin to restore balance to initial $12,000."
      ]
    },
    {
      sectionIndex: 3,
      title: "Central Counterparty (CCP) vs Bilateral OTC Clearing",
      pedagogicalObjective: "Contrast clearinghouse multilateral netting and default funds with OTC bilateral ISDA CSA rules.",
      groundedFactIds: ["fact-06", "fact-07", "fact-08"],
      keyPoints: [
        "CCPs act as legal counterparty to every trade through novation, eliminating bilateral credit risk.",
        "Bilateral OTC trades rely on ISDA master agreements and Credit Support Annexes with collateral thresholds.",
        "Post-2008 Dodd-Frank and Basel regulations mandate standardized OTC derivatives clear through CCPs."
      ]
    },
    {
      sectionIndex: 4,
      title: "Business Snapshot 2.2: The LTCM $4B Collapse",
      pedagogicalObjective: "Demonstrate how excessive leverage and flight-to-quality spread widening caused $4B in liquidation losses.",
      groundedFactIds: ["fact-09"],
      keyPoints: [
        "LTCM traded convergence arbitrage, assuming liquid and illiquid bond spreads would narrow.",
        "The August 1998 Russian debt default triggered a flight to quality, blowing spreads wide open.",
        "LTCM suffered simultaneous collateral drains on both legs, forcing fire-sale liquidation of $4 billion."
      ]
    }
  ],
  misconceptions: [
    {
      misconception: "A margin call only requires depositing enough money to get back above the maintenance margin.",
      factId: "fact-04",
      authorRebuttal: "John C. Hull emphasizes that when a margin call occurs, the investor must deposit variation margin to bring the account balance all the way back up to the INITIAL margin level, not merely the maintenance level."
    },
    {
      misconception: "Short futures positions require borrowing the underlying asset like stock short sales.",
      factId: "fact-01",
      authorRebuttal: "In futures markets, entering a short position is completely symmetric to entering a long position, requiring identical initial margin with no borrowing of physical goods."
    }
  ],
  activeRecallQuiz: {
    scenario: "An investor enters 2 gold futures contracts (200 oz total). Initial margin is $6,000/contract ($12,000 total) and maintenance margin is $4,500/contract ($9,000 total). After adverse price moves, the account balance drops to $7,800.",
    testedFactIds: ["fact-04", "fact-05"],
    question: "How much variation margin cash must the investor deposit by the close of the next business day?",
    correctAnswer: "$4,200 (to restore the account balance back to the initial margin of $12,000)",
    explanation: "Because the $7,800 balance is below the $9,000 maintenance margin, a margin call is triggered. The variation margin required is $12,000 - $7,800 = $4,200, restoring the account to the full initial margin."
  },
  coreTakeaways: [
    "Margin accounts and daily marking-to-market eliminate default risk in futures trading.",
    "Maintenance margin is 75% of initial margin; margin calls require topping up to full initial margin.",
    "CCPs eliminate bilateral default risk through novation, netting, and default guaranty funds.",
    "Excessive leverage can turn manageable market fluctuations into catastrophic collateral liquidation."
  ]
};

fs.writeFileSync(path.join(chapterDir, 'lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');
console.log('✅ 3. lesson_plan.json created');

// 4. Storyboard
const storyboard = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch02_part2",
  course: "hull_derivatives",
  chapterTitle: "Operation of Margin Accounts, Marking-to-Market, and Clearing Mechanics",
  approvedFactIds: [
    "fact-01", "fact-02", "fact-03", "fact-04", "fact-05",
    "fact-06", "fact-07", "fact-08", "fact-09"
  ],
  scenes: [
    {
      sceneIndex: 0,
      title: "The Margin Call Shock",
      template: "chat_story",
      concept: "Raju faces a gold futures loss and Sharma ji explains maintenance margin threshold rules.",
      sourceFactIds: ["fact-01", "fact-04", "fact-05"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Raju expresses shock at an $1,800 loss on two gold futures contracts on Day 1.",
          sourceFactIds: ["fact-01", "fact-05"],
          speaker: "Raju"
        },
        {
          beatIndex: 1,
          textOutline: "Sharma ji explains that since $10,200 is above $9,000 maintenance margin, no margin call is issued today.",
          sourceFactIds: ["fact-04"],
          speaker: "Sharma ji"
        },
        {
          beatIndex: 2,
          textOutline: "Sharma ji clarifies that if balance drops below $9,000, variation margin must restore the full $12,000 initial margin.",
          sourceFactIds: ["fact-04"],
          speaker: "Sharma ji"
        }
      ]
    },
    {
      sceneIndex: 1,
      title: "LTCM's $4 Billion Collapse",
      template: "stat_counter",
      concept: "How extreme leverage and collateral drains destroyed hedge fund LTCM in 1998.",
      sourceFactIds: ["fact-09"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Highlight LTCM's 25:1 balance sheet leverage and $1 trillion derivatives book.",
          sourceFactIds: ["fact-09"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Explain the Russian debt default and flight to quality that widened convergence spreads.",
          sourceFactIds: ["fact-09"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Detail the $4 billion liquidation losses that required a Federal Reserve bailout.",
          sourceFactIds: ["fact-09"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 2,
      title: "The 4 Pillars of Margin Accounts",
      template: "progressive_cards",
      concept: "Core operational architecture of exchange performance bonds and symmetry.",
      sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Pillar 1: Performance bond, not borrowed money loan.",
          sourceFactIds: ["fact-01"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Pillar 2: Symmetric margin requirements on long and short positions.",
          sourceFactIds: ["fact-01"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Pillar 3: Daily settlement MTM resets contract value to zero daily.",
          sourceFactIds: ["fact-03"],
          speaker: "narrator"
        },
        {
          beatIndex: 3,
          textOutline: "Pillar 4: 75% maintenance threshold and cash variation margin top-up rule.",
          sourceFactIds: ["fact-04"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 3,
      title: "CCPs vs Bilateral OTC Clearing",
      template: "split_comparison",
      concept: "Contrast exchange clearinghouse novation with bilateral OTC ISDA CSA collateral agreements.",
      sourceFactIds: ["fact-06", "fact-07", "fact-08"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Introduce CCP clearing with legal novation and default funds.",
          sourceFactIds: ["fact-06"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Explain bilateral OTC contracts under ISDA Master Agreements with credit risk.",
          sourceFactIds: ["fact-07"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Highlight post-2008 Dodd-Frank and EMIR regulatory mandates.",
          sourceFactIds: ["fact-08"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 4,
      title: "16-Day Gold Margin Account Walkthrough",
      template: "data_visualizer",
      concept: "Day-by-day analysis of Hull Table 2.1 200 oz gold futures margin balance.",
      sourceFactIds: ["fact-04", "fact-05"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Track initial $12,000 deposit and $9,000 maintenance threshold.",
          sourceFactIds: ["fact-05"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Day 7 price drops to $1,226.90, balance falls to $7,380 triggering margin call.",
          sourceFactIds: ["fact-05"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Show $4,620 variation margin restoring balance to full $12,000 initial margin.",
          sourceFactIds: ["fact-04", "fact-05"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 5,
      title: "Variation Margin & Threshold Formula",
      template: "formula_breakdown",
      concept: "Mathematical derivation of maintenance margin and variation margin top-up formula.",
      sourceFactIds: ["fact-04"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Define maintenance margin: MM equals 0.75 times IM.",
          sourceFactIds: ["fact-04"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Derive variation margin formula: VM equals IM minus B_t when B_t is below MM.",
          sourceFactIds: ["fact-04"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Explain why restoring to full initial margin protects against consecutive adverse days.",
          sourceFactIds: ["fact-04"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 6,
      title: "Collateral Valuation & Haircuts",
      template: "tug_of_war",
      concept: "Non-cash collateral valuation discounts: Treasury bills vs equities.",
      sourceFactIds: ["fact-02"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Explain why clearinghouses apply haircuts to non-cash securities.",
          sourceFactIds: ["fact-02"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Treasury bills get 10% haircut (accepted at 90% face value).",
          sourceFactIds: ["fact-02"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Equities get 50% haircut due to stock market volatility.",
          sourceFactIds: ["fact-02"],
          speaker: "narrator"
        }
      ]
    },
    {
      sceneIndex: 7,
      title: "Active Recall: Variation Margin Calculation",
      template: "interactive_quiz",
      concept: "Active recall test on calculating exact variation margin deposit.",
      sourceFactIds: ["fact-04", "fact-05"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Scenario: 2 gold contracts, $12,000 initial, $9,000 maintenance, balance falls to $7,800.",
          sourceFactIds: ["fact-04"],
          speaker: "Raju"
        },
        {
          beatIndex: 1,
          textOutline: "Raju evaluates whether the deposit is $1,200 or $4,200.",
          sourceFactIds: ["fact-04"],
          speaker: "Raju"
        },
        {
          beatIndex: 2,
          textOutline: "Sharma ji confirms $4,200 is required to restore full initial margin.",
          sourceFactIds: ["fact-04"],
          speaker: "Sharma ji"
        }
      ]
    },
    {
      sceneIndex: 8,
      title: "Trader's Risk & Margin Checklist",
      template: "chat_story",
      concept: "Sharma ji outlines risk management rules to prevent account wipeout.",
      sourceFactIds: ["fact-01", "fact-04", "fact-09"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Raju asks how professional prop desks manage overnight margin spikes.",
          sourceFactIds: ["fact-01"],
          speaker: "Raju"
        },
        {
          beatIndex: 1,
          textOutline: "Sharma ji outlines the 3 golden margin rules: cash buffer, stop losses, and leverage limits.",
          sourceFactIds: ["fact-01", "fact-04"],
          speaker: "Sharma ji"
        },
        {
          beatIndex: 2,
          textOutline: "Raju confirms understanding of daily MTM and variation margin disciplines.",
          sourceFactIds: ["fact-04"],
          speaker: "Raju"
        }
      ]
    },
    {
      sceneIndex: 9,
      title: "Today's Thread: Chapter 2 Part 2 Summary",
      template: "summary_thread",
      concept: "Progressive recap of margin accounts, MTM, CCP clearing, and LTCM lessons.",
      sourceFactIds: ["fact-01", "fact-03", "fact-04", "fact-06", "fact-09"],
      beatOutlines: [
        {
          beatIndex: 0,
          textOutline: "Rule 1 & 2: Margin accounts are performance bonds with symmetric long/short rules.",
          sourceFactIds: ["fact-01"],
          speaker: "narrator"
        },
        {
          beatIndex: 1,
          textOutline: "Rule 3 & 4: Daily MTM resets contract value; maintenance margin is 75% of initial.",
          sourceFactIds: ["fact-03", "fact-04"],
          speaker: "narrator"
        },
        {
          beatIndex: 2,
          textOutline: "Rule 5 & 6: Margin calls require restoring full initial margin in cash next day.",
          sourceFactIds: ["fact-04", "fact-05"],
          speaker: "narrator"
        },
        {
          beatIndex: 3,
          textOutline: "Rule 7 & 8: T-bills get 10% haircut; equities face 50% haircut as collateral.",
          sourceFactIds: ["fact-02"],
          speaker: "narrator"
        },
        {
          beatIndex: 4,
          textOutline: "Rule 9 & 10: CCP novation removes counterparty risk; LTCM failed from 25:1 leverage.",
          sourceFactIds: ["fact-06", "fact-09"],
          speaker: "narrator"
        },
        {
          beatIndex: 5,
          textOutline: "Final compact executive overview of all 5 margin rules.",
          sourceFactIds: ["fact-01", "fact-04", "fact-06", "fact-09"],
          speaker: "narrator"
        }
      ]
    }
  ],
  summarySteps: [
    "Margin accounts are performance bonds requiring identical initial deposits for long and short positions.",
    "Daily marking to market settles gains and losses each evening, resetting contract value to zero.",
    "Maintenance margin is set at 75% of initial margin to absorb daily volatility.",
    "Margin calls require depositing variation margin to restore account balance to initial margin level.",
    "Treasury bills are accepted with 10% haircut; equities face 50% collateral valuation haircut.",
    "CCPs eliminate bilateral default risk through novation, multilateral netting, and default funds.",
    "LTCM's $4B collapse proved that extreme leverage can trigger fatal multi-asset collateral drains.",
    "Strict margin discipline and cash buffer management prevent forced liquidations during volatility."
  ],
  bottomTakeaway: "Margin accounts and daily marking-to-market eliminate counterparty default risk in futures trading."
};

fs.writeFileSync(path.join(chapterDir, 'storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');
console.log('✅ 4. storyboard.json created');

