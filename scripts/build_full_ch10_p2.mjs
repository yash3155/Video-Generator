import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch10/p2';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_10/Part_02/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_10/Part_02/script_hi.md', 'utf8');

const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
let hiMatches = [...hiScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];
if (hiMatches.length === 0) {
  hiMatches = [...hiScriptText.matchAll(/\*\*(b\d+):\*\*\s*"([^"]+)"/g)];
}

const enBeats = {};
const hiBeats = {};
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());
hiMatches.forEach(m => hiBeats[m[1]] = m[2].trim());

for (let i = 1; i <= 39; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts! (EN: ${Boolean(enBeats[k])}, HI: ${Boolean(hiBeats[k])})`);
  }
}

// 1. Facts with full numerical grounding from Chapter 10 Part 2
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch10",
  partId: "p2",
  facts: [
    {
      id: "F01",
      category: "market_rule",
      statement: "Market makers quote continuous two-sided bid and ask prices, earning the bid-ask spread while dynamically managing inventory risk by hedging option delta in the underlying stock market.",
      citation: { chapter: "10", section: "10.6", page: "253" }
    },
    {
      id: "F02",
      category: "market_rule",
      statement: "Option buyers face strictly capped downside (100% of upfront premium) and post zero margin. Option writers face open-ended liabilities and must maintain margin accounts.",
      citation: { chapter: "10", section: "10.7", page: "254" }
    },
    {
      id: "F03",
      category: "formula",
      statement: "CBOE Naked Option Margin: Margin = Premium + max(20% of Spot - OTM Amount, 10% of Spot for calls / 10% of Strike for puts).",
      citation: { chapter: "10", section: "10.7", page: "255" }
    },
    {
      id: "F04",
      category: "case_study",
      statement: "For a naked call writer with Stock S = $100, Strike K = $110 (OTM = $10), Premium = $4: Margin = $4 + max(0.20*$100 - $10, 0.10*$100) = $4 + max($10, $10) = $14 per share ($1,400 per 100-share contract).",
      citation: { chapter: "10", section: "10.7", page: "256" }
    },
    {
      id: "F05",
      category: "market_rule",
      statement: "The Options Clearing Corporation (OCC) acts as the central counterparty for all US exchange-traded options, performing novation, guaranteeing contract performance, and assigning exercise randomly to clearing members.",
      citation: { chapter: "10", section: "10.8", page: "257" }
    },
    {
      id: "F06",
      category: "market_rule",
      statement: "When an option holder exercises, the OCC assigns the exercise randomly or FIFO to a brokerage firm, which randomly assigns it to a customer with a short position in that series.",
      citation: { chapter: "10", section: "10.8", page: "258" }
    },
    {
      id: "F07",
      category: "definition",
      statement: "Warrants are call options issued directly by a corporation on its own stock. Unlike exchange-traded options, exercising a warrant creates new shares, diluting existing shareholders and bringing new cash into the firm.",
      citation: { chapter: "10", section: "10.9", page: "260" }
    },
    {
      id: "F08",
      category: "definition",
      statement: "Employee Stock Options (ESOs) are non-transferable call options granted by firms to employees to align executive incentives, typically featuring multi-year vesting periods and strike prices set at-the-money on grant date.",
      citation: { chapter: "10", section: "10.10", page: "262" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch10",
  partId: "p2",
  title: "Mechanics of Options Markets - Part 2",
  subtitle: "Market Microstructure, Naked Margin Calculations, OCC Assignment & Corporate Warrants",
  targetAudience: "Derivatives traders, risk managers, clearing operations analysts, and corporate treasurers",
  prerequisites: ["Part 1 Options Mechanics", "Payoff diagrams", "Basic algebra"],
  scenes: [
    { sceneId: "s00", title: "The Institutional Plumbing of Options: Market Microstructure", beats: ["s00b1", "s00b2", "s00b3"] },
    { sceneId: "s01", title: "Market Makers: Continuous Quotes & Delta Inventory Hedging", beats: ["s01b1", "s01b2", "s01b3"] },
    { sceneId: "s02", title: "Margin Requirements for Option Writers: Naked vs. Covered Positions", beats: ["s02b1", "s02b2", "s02b3"] },
    { sceneId: "s03", title: "Numerical Walkthrough: Calculating Naked Call & Put Margin", beats: ["s03b1", "s03b2", "s03b3"] },
    { sceneId: "s04", title: "The Options Clearing Corporation (OCC): Central Clearing & Novation", beats: ["s04b1", "s04b2", "s04b3"] },
    { sceneId: "s05", title: "The Exercise & Assignment Workflow: How Short Writers Get Assigned", beats: ["s05b1", "s05b2", "s05b3"] },
    { sceneId: "s06", title: "Warrants vs. Exchange Call Options: The Corporate Dilution Divide", beats: ["s06b1", "s06b2", "s06b3"] },
    { sceneId: "s07", title: "Taxation & Wash Sale Rules: Snapshot 10.2", beats: ["s07b1", "s07b2", "s07b3"] },
    { sceneId: "s08", title: "Employee Stock Options (ESOs): Corporate Alignment vs. Distortions", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Calculating Naked Put Margin Requirements", beats: ["s09b1", "s09b2", "s09b3"] },
    { sceneId: "s10", title: "Over-the-Counter (OTC) Options: Bespoke Terms & Interbank Flow", beats: ["s10b1", "s10b2", "s10b3"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Options Market Plumbing", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch10",
  partId: "p2",
  formulas: [
    {
      id: "M01",
      name: "CBOE Naked Call Margin",
      latex: "\\text{Margin}_{\\text{call}} = \\text{Premium} + \\max(0.20 S - \\max(K - S, 0), 0.10 S)",
      variables: [
        { symbol: "Margin_call", description: "Dollar margin required per share for a naked call writer", unit: "currency" },
        { symbol: "Premium", description: "Current market premium of the option", unit: "currency" },
        { symbol: "S", description: "Current stock spot price", unit: "currency" },
        { symbol: "K", description: "Strike price of the call option", unit: "currency" }
      ]
    },
    {
      id: "M02",
      name: "CBOE Naked Put Margin",
      latex: "\\text{Margin}_{\\text{put}} = \\text{Premium} + \\max(0.20 S - \\max(S - K, 0), 0.10 K)",
      variables: [
        { symbol: "Margin_put", description: "Dollar margin required per share for a naked put writer", unit: "currency" },
        { symbol: "Premium", description: "Current market premium of the option", unit: "currency" },
        { symbol: "S", description: "Current stock spot price", unit: "currency" },
        { symbol: "K", description: "Strike price of the put option", unit: "currency" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch10",
  partId: "p2",
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
  chapterId: "ch10",
  partId: "p2",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 10",
  partLabel: "Part 2",
  title: "Mechanics of Options Markets - Part 2",
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
  progress: { index: 2, total: 2 },
  theme: "dark-classroom",
  provenance: { mock: false },
  scenes: [
    // Scene 0: Market Microstructure
    {
      id: "s00",
      index: 0,
      title: "The Institutional Plumbing of Options: Market Microstructure",
      purpose: "Introduce market microstructure, clearing infrastructure, margin rules, and assignment mechanics",
      takeaways: [
        "Trading options in practice requires understanding execution microstructure and clearing",
        "Market makers, margin rules, and the OCC ensure trade execution and financial integrity",
        "Part 2 masters naked margin formulas, OCC novation, warrants vs options, and ESOs"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Options Institutional Infrastructure Ecosystem",
        steps: [
          { label: "1. Trading Floor / Electronic Book", detail: "Market makers provide continuous bid/ask quotes and inventory depth" },
          { label: "2. The Central Clearinghouse (OCC)", detail: "Novation inserts OCC as buyer to every seller and seller to every buyer" },
          { label: "3. Margin & Collateral Desk", detail: "Brokers enforce CBOE naked option margin rules to prevent writer insolvency" },
          { label: "4. Exercise & Settlement Clearing", detail: "Random assignment protocol matches exercising holders to short option writers" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b01'] }, hi: { display: hiBeats['b01'] } },
          visualCues: [{ target: "step_0", anchor: { en: "institutional plumbing", hi: "institutional plumbing" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b02'] }, hi: { display: hiBeats['b02'] } },
          visualCues: [{ target: "step_1", anchor: { en: "market makers", hi: "market makers" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b03'] }, hi: { display: hiBeats['b03'] } },
          visualCues: [{ target: "step_2", anchor: { en: "Part Two", hi: "Part Two" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 1: Market Makers & Delta Hedging
    {
      id: "s01",
      index: 1,
      title: "Market Makers: Continuous Quotes & Delta Inventory Hedging",
      purpose: "Explain the role of market makers, the bid-ask spread, and delta-neutral inventory risk hedging",
      takeaways: [
        "Market makers quote two-sided markets, facilitating immediate execution for retail and institutions",
        "Profit is earned from the bid-ask spread while neutralizing directional exposure",
        "Delta hedging involves dynamically buying or selling underlying shares to offset option delta"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Market Maker Liquidity & Delta Hedging Cycle",
        steps: [
          { label: "Quote Posting", detail: "Market maker posts continuous Bid (e.g. $4.00) and Ask (e.g. $4.20)" },
          { label: "Client Execution", detail: "Client buys call at Ask; Market Maker is now Short Call with negative delta" },
          { label: "Dynamic Delta Hedging", detail: "Market Maker buys Delta * 100 shares of underlying stock to neutralize directional risk" },
          { label: "Spread Capture", detail: "Net position is delta-neutral; dealer captures $0.20 bid-ask spread risk-free" }
        ]
      },
      beats: [
        {
          id: "s01b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b04'] }, hi: { display: hiBeats['b04'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Market makers", hi: "Market makers" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b05'] }, hi: { display: hiBeats['b05'] } },
          visualCues: [{ target: "step_1", anchor: { en: "bid-ask spread", hi: "bid-ask spread" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b06'] }, hi: { display: hiBeats['b06'] } },
          visualCues: [{ target: "step_2", anchor: { en: "delta risk", hi: "delta risk" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 2: Margin Requirements: Naked vs Covered
    {
      id: "s02",
      index: 2,
      title: "Margin Requirements for Option Writers: Naked vs. Covered Positions",
      purpose: "Contrast zero buyer margin with covered calls and strict naked option writer margin requirements",
      takeaways: [
        "Option buyers post zero margin because loss is strictly capped at upfront premium paid",
        "Covered call writers own the 100 shares of stock, requiring zero additional cash margin",
        "Naked writers hold unhedged short positions and must post substantial cash collateral"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "Option Margin Rules Comparison",
        left: {
          title: "Covered Call Writers",
          items: [
            "Writer owns 100 shares of underlying stock per short call contract",
            "The physical stock serves as 100% collateral to satisfy call delivery obligation",
            "Zero additional cash margin required by brokerage or OCC",
            "Stock cannot be sold while call position remains open"
          ]
        },
        right: {
          title: "Naked Option Writers (Uncovered)",
          items: [
            "Writer does not own underlying stock; faces unlimited upside loss liability",
            "Strict CBOE margin rules mandate premium plus 20% of stock value minus OTM amount",
            "Daily mark-to-market margin calls if stock moves against writer",
            "Failure to meet margin call triggers immediate forced liquidation"
          ]
        }
      },
      beats: [
        {
          id: "s02b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b07'] }, hi: { display: hiBeats['b07'] } },
          visualCues: [{ target: "left_title", anchor: { en: "margin requirements", hi: "margin requirements" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b08'] }, hi: { display: hiBeats['b08'] } },
          visualCues: [{ target: "left_items", anchor: { en: "Covered call", hi: "Covered call" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b09'] }, hi: { display: hiBeats['b09'] } },
          visualCues: [{ target: "right_items", anchor: { en: "Naked option writers", hi: "Naked option writers" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 3: Numerical Margin Calculation
    {
      id: "s03",
      index: 3,
      title: "Numerical Walkthrough: Calculating Naked Call & Put Margin",
      purpose: "Walk through Hull's exact CBOE margin calculation example for naked calls and puts",
      takeaways: [
        "Margin equals Premium + max(20% of Spot - OTM Amount, 10% of Spot for calls)",
        "For S=$100, K=$110 call, Premium=$4: Margin = $4 + max(20-10, 10) = $14/share ($1,400/contract)",
        "For naked puts, the floor is 10% of Strike Price K"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "CBOE Naked Call Margin Step-by-Step Numerical Proof",
        formula: "\\text{Margin} = \\text{Premium} + \\max(0.20 S - \\text{OTM}, 0.10 S)",
        steps: [
          { label: "Step 1: Given Parameters", detail: "Stock Spot S = $100, Call Strike K = $110, Current Premium = $4.00." },
          { label: "Step 2: Calculate OTM Distance", detail: "OTM Amount = max(K - S, 0) = $110 - $100 = $10.00." },
          { label: "Step 3: Evaluate Formula Components", detail: "Component A: 20% of $100 - $10 = $20 - $10 = $10.00; Component B (Floor): 10% of $100 = $10.00." },
          { label: "Step 4: Total Required Margin", detail: "Margin = $4.00 + max($10, $10) = $4.00 + $10.00 = $14.00 per share ($1,400 per contract)." }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b10'] }, hi: { display: hiBeats['b10'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "exact numerical walkthrough", hi: "numerical walkthrough" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b11'] }, hi: { display: hiBeats['b11'] } },
          visualCues: [{ target: "step_1", anchor: { en: "hundred dollars", hi: "hundred dollars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b12'] }, hi: { display: hiBeats['b12'] } },
          visualCues: [{ target: "step_3", anchor: { en: "fourteen dollars per share", hi: "fourteen dollars" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 4: The OCC & Novation
    {
      id: "s04",
      index: 4,
      title: "The Options Clearing Corporation (OCC): Central Clearing & Novation",
      purpose: "Explain the legal role of the OCC, central clearing novation, and systemic risk mitigation",
      takeaways: [
        "The OCC acts as the buyer to every seller and seller to every buyer via legal novation",
        "Novation eliminates bilateral counterparty credit risk for exchange-traded options",
        "The OCC guarantees option contract performance through clearing fund deposits and daily margin"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "OCC Novation & Performance Guarantee Architecture",
        steps: [
          { label: "Trade Execution", detail: "Buyer and Seller agree on trade on exchange (CBOE, PHLX, ISE)" },
          { label: "Legal Novation", detail: "OCC steps in between: Buyer faces OCC; Seller faces OCC; original bilateral link severed" },
          { label: "Collateral & Clearing Fund", detail: "Clearing member firms post margin and contribute to mutualized OCC guaranty fund" },
          { label: "AAA Performance Guarantee", detail: "Option buyers never bear default risk of individual option writers" }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b13'] }, hi: { display: hiBeats['b13'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Options Clearing Corporation", hi: "Options Clearing Corporation" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b14'] }, hi: { display: hiBeats['b14'] } },
          visualCues: [{ target: "step_1", anchor: { en: "novation", hi: "novation" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b15'] }, hi: { display: hiBeats['b15'] } },
          visualCues: [{ target: "step_3", anchor: { en: "guarantees contract performance", hi: "contract performance" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 5: Exercise & Assignment Workflow
    {
      id: "s05",
      index: 5,
      title: "The Exercise & Assignment Workflow: How Short Writers Get Assigned",
      purpose: "Trace the 4-step exercise notice transmission and random assignment workflow",
      takeaways: [
        "Option buyer submits exercise notice to broker before cutoff time (5:30 PM ET on expiry)",
        "Broker transmits notice to OCC; OCC randomly selects a clearing member firm",
        "Clearing member allocates assignment to a customer holding short position (random or FIFO)"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Exercise Notice & Assignment Transmission Pipeline",
        steps: [
          { label: "1. Notice Submission", detail: "Option holder instructs broker to exercise by 5:30 PM ET" },
          { label: "2. OCC Allocation", detail: "OCC allocates exercise notice randomly among clearing firms short that contract" },
          { label: "3. Broker Assignment", detail: "Brokerage firm allocates assignment to client short writer randomly or FIFO" },
          { label: "4. Settlement Delivery", detail: "Stock delivered on T+1; short call writer sells 100 shares at strike K" }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b16'] }, hi: { display: hiBeats['b16'] } },
          visualCues: [{ target: "step_0", anchor: { en: "exercise and assignment workflow", hi: "exercise and assignment" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b17'] }, hi: { display: hiBeats['b17'] } },
          visualCues: [{ target: "step_1", anchor: { en: "OCC randomly selects", hi: "OCC randomly selects" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b18'] }, hi: { display: hiBeats['b18'] } },
          visualCues: [{ target: "step_3", anchor: { en: "obligated to deliver", hi: "obligated to deliver" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 6: Warrants vs. Exchange Call Options
    {
      id: "s06",
      index: 6,
      title: "Warrants vs. Exchange Call Options: The Corporate Dilution Divide",
      purpose: "Contrast exchange-traded options (zero-sum secondary market) with corporate warrants (dilutive)",
      takeaways: [
        "Exchange call options trade between investors without firm involvement or share issuance",
        "Warrants are issued directly by the corporation, creating new shares upon exercise",
        "Warrant exercise brings new cash capital into the company but dilutes existing equity ownership"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "Exchange Options vs. Corporate Warrants",
        left: {
          title: "Exchange-Traded Call Options",
          items: [
            "Issued and cleared by the OCC; traded exclusively on secondary exchanges",
            "Zero participation by the underlying company; zero corporate balance sheet impact",
            "Zero-sum financial transfer between buyer and writer",
            "Exercise transfers existing shares; zero share dilution"
          ]
        },
        right: {
          title: "Corporate Warrants",
          items: [
            "Issued directly by the corporation as a financing sweetener (e.g. attached to bonds)",
            "Upon exercise, company creates brand new treasury shares and receives strike cash",
            "Dilutes existing shareholder earnings per share (EPS)",
            "Longer maturities typically extending 5 to 10 years"
          ]
        }
      },
      beats: [
        {
          id: "s06b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b19'] }, hi: { display: hiBeats['b19'] } },
          visualCues: [{ target: "left_title", anchor: { en: "Warrants", hi: "Warrants" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b20'] }, hi: { display: hiBeats['b20'] } },
          visualCues: [{ target: "left_items", anchor: { en: "Exchange-traded call options", hi: "Exchange-traded options" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b21'] }, hi: { display: hiBeats['b21'] } },
          visualCues: [{ target: "right_items", anchor: { en: "dilution divide", hi: "dilution divide" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 7: Taxation & Wash Sale Rules
    {
      id: "s07",
      index: 7,
      title: "Taxation & Wash Sale Rules: Snapshot 10.2",
      purpose: "Examine option tax treatment: short-term vs long-term capital gains, exercise cost basis, and wash sales",
      takeaways: [
        "Unexercised options generate capital gains or losses upon sale or expiration",
        "When a call is exercised, the premium paid is added to the stock purchase cost basis",
        "Wash sale rules disallow tax loss deductions if substantially identical options are repurchased within 30 days"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Key Taxation Principles for Option Trades (Snapshot 10.2)",
        steps: [
          { label: "1. Trading Gains & Losses", detail: "Options held under 1 year treated as short-term capital gains taxed at ordinary income rates" },
          { label: "2. Call Exercise Cost Basis", detail: "Stock acquisition cost basis = Strike Price K + Call Premium Paid" },
          { label: "3. Put Exercise Sale Basis", detail: "Net stock proceeds received = Put Strike Price K - Put Premium Paid" },
          { label: "4. Wash Sale Restriction", detail: "Losses disallowed if replacement option acquired within 30 days before or after sale" }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b22'] }, hi: { display: hiBeats['b22'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Taxation", hi: "Taxation" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b23'] }, hi: { display: hiBeats['b23'] } },
          visualCues: [{ target: "step_1", anchor: { en: "call option is exercised", hi: "call option is exercised" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b24'] }, hi: { display: hiBeats['b24'] } },
          visualCues: [{ target: "step_3", anchor: { en: "wash sale rule", hi: "wash sale rule" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 8: Employee Stock Options (ESOs)
    {
      id: "s08",
      index: 8,
      title: "Employee Stock Options (ESOs): Corporate Alignment vs. Distortions",
      purpose: "Analyze features of ESOs: vesting schedules, non-transferability, executive risk-taking incentives",
      takeaways: [
        "ESOs are call options granted to executives and employees, usually at-the-money on grant date",
        "ESOs are non-transferable and feature 3-to-5 year vesting schedules requiring employment retention",
        "Because options reward upside while capping downside, ESOs can incentivize excessive corporate risk-taking"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Employee Stock Option Structural Lifecycle",
        steps: [
          { label: "1. Grant Date", detail: "Options awarded at-the-money (Strike K = current stock price); zero intrinsic value" },
          { label: "2. Vesting Period", detail: "Employee must remain with company for 3-5 years before options can be exercised" },
          { label: "3. Non-Transferability", detail: "Cannot be sold on exchanges; must either be exercised or held to expiration" },
          { label: "4. Incentive Asymmetry", detail: "Convex payoff rewards aggressive corporate volatility expansion and share buybacks" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b25'] }, hi: { display: hiBeats['b25'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Employee Stock Options", hi: "Employee Stock Options" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b26'] }, hi: { display: hiBeats['b26'] } },
          visualCues: [{ target: "step_1", anchor: { en: "vesting schedules", hi: "vesting schedules" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b27'] }, hi: { display: hiBeats['b27'] } },
          visualCues: [{ target: "step_3", anchor: { en: "asymmetric payoff", hi: "asymmetric payoff" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 9: Active Recall Quiz
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Calculating Naked Put Margin Requirements",
      purpose: "Test quantitative calculation of CBOE margin for naked out-of-the-money puts",
      takeaways: [
        "Margin formula for naked put: Premium + max(20% of Spot - OTM Amount, 10% of Strike)",
        "Given S=$50, K=$45 (OTM=$5), Premium=$2: Margin = $2 + max(0.20*$50 - $5, 0.10*$45) = $7/share",
        "Total margin required per 100-share contract equals $700"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "An investor writes a naked put option with strike K = $45 on a stock currently trading at S = $50. The current put premium is $2.00. Using CBOE margin rules, what is the required initial margin per share?",
        options: [
          { label: "Option A", text: "$4.50 per share ($450 per contract)" },
          { label: "Option B", text: "$6.50 per share ($650 per contract)" },
          { label: "Option C", text: "$7.00 per share ($700 per contract)" },
          { label: "Option D", text: "$12.00 per share ($1,200 per contract)" }
        ],
        correctIndex: 2,
        explanation: "OTM amount = max(S - K, 0) = $50 - $45 = $5. Component A: 20% of $50 - $5 = $10 - $5 = $5. Component B (Floor): 10% of Strike = 10% of $45 = $4.50. Max($5, $4.50) = $5. Total margin = Premium + $5 = $2 + $5 = $7.00 per share ($700 per contract)."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b28'] }, hi: { display: hiBeats['b28'] } },
          visualCues: [{ target: "question_box", anchor: { en: "test your mastery of options market plumbing", hi: "market plumbing" } }],
          pauseAfterMs: 400
        },
        {
          id: "s09b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b29'] }, hi: { display: hiBeats['b29'] } },
          visualCues: [{ target: "options_grid", anchor: { en: "naked put option", hi: "naked put option" } }],
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

    // Scene 10: OTC Options & Interbank Flow
    {
      id: "s10",
      index: 10,
      title: "Over-the-Counter (OTC) Options: Bespoke Terms & Interbank Flow",
      purpose: "Examine over-the-counter options, customized strikes/maturities, and ISDA documentation",
      takeaways: [
        "OTC options allow institutional participants to negotiate non-standard strikes, tenors, and barriers",
        "OTC contracts carry bilateral counterparty credit risk and require ISDA master agreements and CSAs",
        "Interbank dealers manage large exotic books by decomposing OTC options into exchange-traded hedges"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "OTC vs. Exchange-Traded Option Ecosystem",
        steps: [
          { label: "Bespoke Customization", detail: "Corporate clients customize non-standard strikes, maturities, and exotic barrier features" },
          { label: "ISDA Master Documentation", detail: "Parties negotiate bilateral credit terms, CSA collateral thresholds, and netting rules" },
          { label: "Bilateral Credit Risk", detail: "Participants face bank dealer credit risk; mitigate risk via daily cash variation margin" },
          { label: "Dealer Interbank Flow", detail: "Dealers offset residual net Greek exposures in liquid listed exchange markets" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b31'] }, hi: { display: hiBeats['b31'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Over-the-Counter", hi: "Over-the-Counter" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b32'] }, hi: { display: hiBeats['b32'] } },
          visualCues: [{ target: "step_1", anchor: { en: "ISDA Master Agreements", hi: "ISDA Master Agreements" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b33'] }, hi: { display: hiBeats['b33'] } },
          visualCues: [{ target: "step_3", anchor: { en: "interbank market", hi: "interbank market" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 11: Summary Thread
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of Options Market Plumbing",
      purpose: "Synthesize the 8 essential rules of options market microstructure, margin rules, and institutional clearing",
      takeaways: [
        "Market makers manage inventory via delta hedging; OCC novation guarantees trade performance",
        "Naked writers must post margin equal to premium plus max(20% S - OTM, 10% floor)",
        "Warrants dilute corporate share count while exchange options represent zero-sum investor transfers"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Eight Core Rules of Options Market Plumbing",
        rules: [
          { number: 1, title: "Microstructure Liquidity", text: "Market makers provide two-sided liquidity and hedge delta risk in underlying shares." },
          { number: 2, title: "Asymmetric Margin", text: "Option buyers post zero margin; naked writers face strict CBOE cash margin requirements." },
          { number: 3, title: "Naked Margin Formula", text: "Margin equals Premium plus max(20% Spot minus OTM amount, 10% asset floor)." },
          { number: 4, title: "OCC Novation", text: "The Options Clearing Corporation acts as central counterparty, guaranteeing performance." },
          { number: 5, title: "Random Assignment", text: "Exercise notices are routed by the OCC and allocated randomly to short option writers." },
          { number: 6, title: "Warrant Dilution", text: "Corporate warrants issue new shares and dilute equity, unlike zero-sum listed options." },
          { number: 7, title: "Tax Discipline", text: "Track option premiums as adjustments to stock cost basis and avoid 30-day wash sales." },
          { number: 8, title: "Theoretical Foundations", text: "In Chapter 11, we unlock Upper and Lower Bounds, Early Exercise, and Put-Call Parity." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b34'] }, hi: { display: hiBeats['b34'] } },
          visualCues: [{ target: "rule_1", anchor: { en: "four foundational pillars", hi: "chaar foundational pillars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b35'] }, hi: { display: hiBeats['b35'] } },
          visualCues: [{ target: "rule_2", anchor: { en: "Pillar One", hi: "Pillar One" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b36'] }, hi: { display: hiBeats['b36'] } },
          visualCues: [{ target: "rule_3", anchor: { en: "Pillar Two", hi: "Pillar Two" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b37'] }, hi: { display: hiBeats['b37'] } },
          visualCues: [{ target: "rule_5", anchor: { en: "Pillar Three", hi: "Pillar Three" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b5",
          speaker: "instructor",
          narration: { en: { display: enBeats['b38'] }, hi: { display: hiBeats['b38'] } },
          visualCues: [{ target: "rule_6", anchor: { en: "Pillar Four", hi: "Pillar Four" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b6",
          speaker: "instructor",
          narration: { en: { display: enBeats['b39'] }, hi: { display: hiBeats['b39'] } },
          visualCues: [{ target: "rule_8", anchor: { en: "Chapter Eleven", hi: "Chapter Eleven" } }],
          pauseAfterMs: 600
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(episode, null, 2));
console.log('Chapter 10 Part 2 successfully built!');
