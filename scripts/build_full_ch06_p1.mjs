import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch06/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_06/Part_01/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_06/Part_01/script_hi.md', 'utf8');

const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
const hiMatches = [...hiScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];

const enBeats = {};
const hiBeats = {};
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());
hiMatches.forEach(m => hiBeats[m[1]] = m[2].trim());

for (let i = 1; i <= 39; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts!`);
  }
}

// 1. Facts with full numerical grounding from Chapter 6 Part 1
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch06",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "Day count conventions define how accrued interest is calculated: Actual/Actual for Treasury bonds, 30/360 for corporate/municipal bonds, and Actual/360 for money market instruments.",
      citation: { chapter: "6", section: "6.1", page: "131" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "Cash Price (Dirty Price) equals Quoted Clean Price plus Accrued Interest: Cash Price = Quoted Price + Accrued Interest.",
      citation: { chapter: "6", section: "6.1", page: "132" }
    },
    {
      id: "F03",
      category: "definition",
      statement: "CBOT Treasury bond futures allow delivery of any Treasury bond with remaining maturity >= 15 years, non-callable for >= 15 years. Prices quote in points and 32nds.",
      citation: { chapter: "6", section: "6.2", page: "133" }
    },
    {
      id: "F04",
      category: "definition",
      statement: "The Conversion Factor (CF) is the theoretical clean price of $1.00 face value of the bond if its yield to maturity were exactly 6.0% semi-annual.",
      citation: { chapter: "6", section: "6.2", page: "134" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "Invoice Price received by seller upon physical bond delivery is: Invoice Price = (Most Recent Settlement Price * Conversion Factor) + Accrued Interest.",
      citation: { chapter: "6", section: "6.2", page: "135" }
    },
    {
      id: "F06",
      category: "definition",
      statement: "The Cheapest-to-Deliver (CTD) bond minimizes Net Cost = Quoted Cash Price - (Futures Price * Conversion Factor).",
      citation: { chapter: "6", section: "6.2", page: "136" }
    },
    {
      id: "F07",
      category: "rule",
      statement: "When market yields > 6%, low-coupon long-maturity bonds tend to be CTD; when market yields < 6%, high-coupon short-maturity bonds tend to be CTD.",
      citation: { chapter: "6", section: "6.2", page: "137" }
    },
    {
      id: "F08",
      category: "definition",
      statement: "The Wild Card play exploits the settlement price being fixed at 2:00 PM while notice of intention to deliver can be filed up to 8:00 PM Chicago time.",
      citation: { chapter: "6", section: "6.2", page: "138" }
    },
    {
      id: "F09",
      category: "numerical_example",
      statement: "With futures settlement price $90.00, CF = 1.2000, and accrued interest $2.50 per $100 par, Invoice Price = ($90.00 * 1.2000) + $2.50 = $108.00 + $2.50 = $110.50.",
      citation: { chapter: "6", section: "6.2", page: "135" }
    }
  ],
  realWorldProblem: {
    actors: "Fixed income institutional traders, Treasury primary dealers, and bond portfolio managers",
    situation: "Hedging multi-billion dollar sovereign bond portfolios and calculating delivery obligations under CBOT futures",
    failure: "Misidentifying the Cheapest-to-Deliver bond or miscalculating conversion factor adjustments creates fatal delivery losses",
    invention: "Conversion Factor equalization system, CTD optimization algorithms, and Wild Card delivery options",
    factIds: ["F01", "F02", "F04", "F05", "F06", "F07", "F08", "F09"]
  }
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch06",
  partId: "p1",
  title: "Interest Rate Futures - Part 1",
  subtitle: "Day Counts, Treasury Bond Futures, Conversion Factors & The CTD Bond",
  targetAudience: "Fixed income portfolio managers, institutional traders, and quantitative analysts",
  prerequisites: ["Bond yield to maturity", "Clean vs. dirty bond pricing", "Mechanics of futures delivery"],
  scenes: [
    { sceneId: "s00", title: "The Exchange-Traded Rates Engine: Introducing Bond Futures", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "Day Count Conventions: Actual/Actual, 30/360 & Actual/360", beats: ["s01b1", "s01b2", "s01b3"] },
    { sceneId: "s02", title: "Clean Price vs. Dirty Price: The Cash Accrual Gap", beats: ["s02b1", "s02b2", "s02b3"] },
    { sceneId: "s03", title: "Treasury Bond Futures Contract Specifications", beats: ["s03b1", "s03b2", "s03b3"] },
    { sceneId: "s04", title: "The Conversion Factor System: Equalizing the 6% Baseline", beats: ["s04b1", "s04b2", "s04b3"] },
    { sceneId: "s05", title: "The Invoice Price Formula: What the Buyer Actually Pays", beats: ["s05b1", "s05b2", "s05b3"] },
    { sceneId: "s06", title: "The Cheapest-to-Deliver (CTD) Bond: The Short Seller's Choice", beats: ["s06b1", "s06b2", "s06b3"] },
    { sceneId: "s07", title: "Yield Regimes & CTD Behavior: The 6% Tipping Point", beats: ["s07b1", "s07b2", "s07b3"] },
    { sceneId: "s08", title: "The Wild Card Play: Exploiting After-Hours Asymmetry", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Calculating the Invoice Price", beats: ["s09b1", "s09b2", "s09b3"] },
    { sceneId: "s10", title: "Determining Treasury Futures Theoretical Fair Value", beats: ["s10b1", "s10b2", "s10b3"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Treasury Bond Futures", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch06",
  partId: "p1",
  formulas: [
    {
      id: "M01",
      name: "Cash Price (Dirty Price)",
      latex: "\\text{Cash Price} = \\text{Quoted Clean Price} + \\text{Accrued Interest}",
      variables: [
        { symbol: "Cash Price", description: "Actual invoice cash paid per $100 face value", unit: "currency" },
        { symbol: "Quoted Price", description: "Clean screen price without accrued coupon", unit: "currency" },
        { symbol: "Accrued Interest", description: "Interest earned during current coupon period", unit: "currency" }
      ]
    },
    {
      id: "M02",
      name: "Futures Invoice Price",
      latex: "\\text{Invoice Price} = (\\text{Futures Price} \\times \\text{CF}) + \\text{Accrued Interest}",
      variables: [
        { symbol: "Futures Price", description: "Most recent CBOT settlement price", unit: "currency" },
        { symbol: "CF", description: "Conversion Factor based on 6% YTM baseline", unit: "dimensionless" },
        { symbol: "Accrued Interest", description: "Interest accrued to physical delivery date", unit: "currency" }
      ]
    },
    {
      id: "M03",
      name: "Cheapest-to-Deliver Net Cost",
      latex: "\\text{Net Cost} = \\text{Quoted Cash Price} - (\\text{Futures Price} \\times \\text{CF})",
      variables: [
        { symbol: "Net Cost", description: "Dollar cost incurred by short seller upon delivery", unit: "currency" }
      ]
    },
    {
      id: "M04",
      name: "Theoretical Futures Fair Value",
      latex: "F_0 = \\frac{1}{\\text{CF}} \\left[ (S_0 - I) e^{rT} - A_T \\right]",
      variables: [
        { symbol: "F_0", description: "Theoretical clean futures price", unit: "currency" },
        { symbol: "S_0", description: "Spot cash price of CTD bond", unit: "currency" },
        { symbol: "I", description: "Present value of intermediate coupons", unit: "currency" },
        { symbol: "A_T", description: "Accrued interest at delivery date T", unit: "currency" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch06",
  partId: "p1",
  scenes: lessonPlan.scenes.map(s => ({
    sceneId: s.sceneId,
    title: s.title,
    beats: s.beats.map(b => ({
      beatId: b,
      narrationEn: enBeats[b] || "Narration text",
      narrationHi: hiBeats[b] || "Narration text"
    }))
  }))
};
fs.writeFileSync(path.join(targetDir, '04_pedagogical_script.json'), JSON.stringify(pedagogicalScript, null, 2));

// 5. Episode Schema Compliant Episode
const episode = {
  schemaVersion: 1,
  bookId: "hull",
  chapterId: "ch06",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 6",
  partLabel: "Part 1",
  title: "Interest Rate Futures - Part 1",
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
  progress: { index: 1, total: 2 },
  theme: "dark-classroom",
  provenance: { mock: false },
  scenes: [
    // Scene 0: Chat story (4 beats: opening dilemma + b01, b02, b03)
    {
      id: "s00",
      index: 0,
      title: "The Exchange-Traded Rates Engine: Introducing Bond Futures",
      purpose: "Introduce Treasury bond futures and contrast delivery mechanics with equity index contracts",
      takeaways: [
        "Treasury bond futures are the world's primary tool for institutional interest rate hedging",
        "Unlike stock index contracts, bond futures allow delivery of a multi-bond basket",
        "Chapter 6 Part 1 masters day count accruals, conversion factors, and CTD optimization"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m1", speaker: "novice", text: "How do institutional traders manage interest rate risk when bond futures allow the delivery of dozens of different bonds?" },
          { id: "m2", speaker: "mentor", text: "Treasury Bond Futures are the most heavily traded instruments for managing institutional interest rate risk, relied upon by central banks and sovereign funds." },
          { id: "m3", speaker: "mentor", text: "Yet bond futures differ fundamentally from equity futures: bond pricing requires day count accrual conventions and permits delivery of an entire eligible bond basket." },
          { id: "m4", speaker: "mentor", text: "In Chapter 6, we master Day Count conventions, the Conversion Factor system, identifying the Cheapest-to-Deliver bond, and exploiting the Wild Card Play." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["Bond Futures Intro", "Day Count Rules", "Clean vs Dirty Price", "CBOT Specs", "Conversion Factors", "CTD Bond"],
          current: 0
        }
      },
      beats: [
        {
          id: "s00b1",
          speaker: "novice",
          narration: {
            en: { display: "How do institutional traders manage interest rate risk when bond futures allow the delivery of dozens of different bonds?" },
            hi: { display: "ट्रेजरी बॉन्ड फ्यूचर्स में जब दर्जनों बॉन्ड्स की डिलीवरी हो सकती है, तो ट्रेडर्स रेट रिस्क कैसे मैनेज करते हैं?" }
          },
          onScreenIntent: "Opening question highlighting multi-bond delivery complexity",
          sourceFactIds: ["F01", "F03"],
          newTerms: ["treasury bond futures"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1"] },
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "The mentor highlights the global role of Treasury bond futures",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2"] },
          visualCues: []
        },
        {
          id: "s00b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b02 }, hi: { display: hiBeats.b02 } },
          onScreenIntent: "The mentor contrasts bond futures against equity index futures",
          sourceFactIds: ["F01", "F03"],
          newTerms: ["day count conventions", "deliverable basket"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3"] },
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "The mentor outlines Chapter 6 Part 1 learning objectives",
          sourceFactIds: ["F04", "F06", "F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3", "m4"] },
          visualCues: []
        }
      ]
    },
    // Scene 1: Table Compare (b04, b05, b06)
    {
      id: "s01",
      index: 1,
      title: "Day Count Conventions: Actual/Actual, 30/360 & Actual/360",
      purpose: "Compare the three standard fixed-income day count accrual conventions",
      takeaways: [
        "Day count conventions dictate how accrued interest is calculated between coupon dates",
        "Actual/Actual is standard for US Treasury bonds",
        "30/360 applies to corporate/municipal bonds; Actual/360 governs money market instruments"
      ],
      pedagogicalContinuation: false,
      template: "table_compare",
      data: {
        title: "Fixed Income Day Count Conventions",
        columns: ["Convention", "Market Segment", "Numerator Rule", "Denominator Rule"],
        rows: [
          {
            id: "dc-act-act",
            cells: ["Actual / Actual (in period)", "US Treasury Bonds & Notes", "Exact calendar days elapsed", "Actual calendar days in coupon period (181-184)"]
          },
          {
            id: "dc-30-360",
            cells: ["30 / 360", "US Corporate & Municipal Bonds", "Assumes 30 days per month", "Assumes exactly 360 days per calendar year"]
          },
          {
            id: "dc-act-360",
            cells: ["Actual / 360", "US Treasury Bills & Money Market", "Exact calendar days elapsed", "Assumes 360-day annualized money market year"]
          }
        ]
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Introduce the necessity of accrued interest when trading between coupon dates",
          sourceFactIds: ["F01"],
          newTerms: ["accrued interest"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Define Actual/Actual convention for US Treasury bonds",
          sourceFactIds: ["F01"],
          newTerms: ["actual/actual convention"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b06 }, hi: { display: hiBeats.b06 } },
          onScreenIntent: "Define 30/360 for corporates and Actual/360 for money market paper",
          sourceFactIds: ["F01"],
          newTerms: ["30/360 convention", "actual/360 convention"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: Split Comparison (b07, b08, b09)
    {
      id: "s02",
      index: 2,
      title: "Clean Price vs. Dirty Price: The Cash Accrual Gap",
      purpose: "Distinguish quoted clean screen price from total invoice cash dirty price",
      takeaways: [
        "Clean Price is the display quote that excludes accrued interest",
        "Dirty Price (Cash Price) is total actual settlement cash paid by the buyer",
        "Cash Price = Quoted Clean Price + Accrued Interest"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-clean",
          heading: "Clean Price (Quoted)",
          tone: "neutral",
          points: [
            "Displayed on market trading terminals and price quotation screens",
            "Excludes accrued coupon interest to prevent artificial jagged saw-tooth price drops",
            "Reflects true yield shifts without misleading calendar accrual distortion",
            "Standard quotation convention across global bond exchanges"
          ]
        },
        right: {
          id: "cmp-dirty",
          heading: "Dirty Price (Cash Settled)",
          tone: "positive",
          points: [
            "Actual invoice cash delivered from buyer's account to seller upon settlement",
            "Clean Price + Accrued Interest earned by seller during holding period",
            "Represents total legal economic value transferred in the transaction",
            "Directly drives physical futures delivery invoice settlements"
          ]
        },
        verdict: {
          id: "vrd-cash-price",
          text: "Clean price isolates interest rate shifts; dirty price delivers actual settlement cash."
        }
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Define Clean Price and Cash (Dirty) Price",
          sourceFactIds: ["F02"],
          newTerms: ["clean price", "dirty price"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Formulate relationship: Cash Price = Clean Price + Accrued Interest",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "Examine John Hull's numerical example: $41 clean + $0.97 accrued = $41.97 dirty",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Technical Panel (b10, b11, b12)
    {
      id: "s03",
      index: 3,
      title: "Treasury Bond Futures Contract Specifications",
      purpose: "Examine CBOT Treasury bond futures specifications, deliverable eligibility, and point quotation",
      takeaways: [
        "CBOT Treasury bond futures standardize a $100,000 par face value contract",
        "Deliverable bonds must have at least 15 years remaining maturity and non-callability",
        "Quotes trade in points and 32nds: e.g., 90-05 represents 90 + 5/32 = $90.15625"
      ],
      pedagogicalContinuation: false,
      template: "technical_panel",
      data: {
        title: "CBOT Treasury Bond Futures Specifications",
        subtitle: "Institutional Contract Architecture & Delivery Rules",
        sections: [
          {
            id: "spec-par",
            title: "Contract Notional Par",
            content: "$100,000 face value of a synthetic US Treasury bond with a 6.0% annual coupon."
          },
          {
            id: "spec-delivery",
            title: "Deliverable Eligibility",
            content: "Any US Treasury bond with remaining maturity >= 15 years and non-callable for >= 15 years from the first day of the delivery month."
          },
          {
            id: "spec-quote",
            title: "32nds Price Quotation",
            content: "Quoted in points and 32nds per $100 par. 1 point = $1,000. 1/32 point = $31.25 minimum tick."
          }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Introduce CBOT Treasury bond futures and $100,000 face value",
          sourceFactIds: ["F03"],
          newTerms: ["CBOT bond futures"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Detail deliverable eligibility: 15-year maturity and non-callable rule",
          sourceFactIds: ["F03"],
          newTerms: ["deliverable eligibility"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b12 }, hi: { display: hiBeats.b12 } },
          onScreenIntent: "Explain 32nds price quotation convention: 90-05 = $90.15625",
          sourceFactIds: ["F03"],
          newTerms: ["32nds quotation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Formula Breakdown (b13, b14, b15)
    {
      id: "s04",
      index: 4,
      title: "The Conversion Factor System: Equalizing the 6% Baseline",
      purpose: "Define the Conversion Factor system standardizing multi-bond delivery baskets to a 6% YTM baseline",
      takeaways: [
        "Conversion Factor (CF) normalizes diverse coupon and maturity bonds to a 6% yield baseline",
        "CF equals theoretical clean price of $1 face value of bond discounted at 6.0% semi-annual",
        "Bonds with coupon > 6% have CF > 1.0; bonds with coupon < 6% have CF < 1.0"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Conversion Factor Equalization Formula",
        formula: {
          latex: "\\text{CF} = \\text{Clean Price of } \\$1.00 \\text{ Face Value at } 6.0\\% \\text{ YTM}",
          expression: "Conversion Factor = Theoretical Clean Price discounted at 6.0% semi-annual",
          solvesFor: "Standardized Bond Delivery Conversion Factor (CF)",
          variables: [
            { symbol: "CF", latex: "\\text{CF}", meaning: "Exchange conversion factor published per deliverable bond", unit: "dimensionless" },
            { symbol: "YTM", latex: "y_0", meaning: "Standardized benchmark discount yield: exactly 6.0% per annum", unit: "decimal/year" },
            { symbol: "c", latex: "c", meaning: "Semi-annual coupon rate of the deliverable bond", unit: "decimal/year" },
            { symbol: "M", latex: "M", meaning: "Remaining maturity rounded to nearest quarter", unit: "years" }
          ]
        },
        parts: [
          { id: "cf1", symbolLatex: "c > 6.0\\% \\implies \\text{CF} > 1.0", meaning: "Premium bond: generates higher delivery cash credit", unit: "regime" },
          { id: "cf2", symbolLatex: "c < 6.0\\% \\implies \\text{CF} < 1.0", meaning: "Discount bond: generates lower delivery cash credit", unit: "regime" },
          { id: "cf3", symbolLatex: "c = 6.0\\% \\implies \\text{CF} = 1.0", meaning: "Exact benchmark coupon parity", unit: "benchmark" }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Explain why conversion factors are necessary across multi-bond baskets",
          sourceFactIds: ["F04"],
          newTerms: ["conversion factor"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Define Conversion Factor as theoretical clean price at 6.0% YTM",
          sourceFactIds: ["F04"],
          newTerms: ["6% baseline"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "State rule of thumb: coupon > 6% implies CF > 1.0; coupon < 6% implies CF < 1.0",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 5: Formula Breakdown (b16, b17, b18)
    {
      id: "s05",
      index: 5,
      title: "The Invoice Price Formula: What the Buyer Actually Pays",
      purpose: "Formulate total cash received by short seller and paid by long buyer upon delivery",
      takeaways: [
        "Invoice Price equals (Futures Settlement Price * Conversion Factor) + Accrued Interest",
        "Conversion factor scales futures price for coupon and maturity differences",
        "Accrued interest converts scaled clean futures price into dirty cash settlement"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Futures Delivery Invoice Price Formula",
        formula: {
          latex: "\\text{Invoice Price} = (\\text{Futures Price} \\times \\text{CF}) + \\text{Accrued Interest}",
          expression: "Invoice Price = (Futures Settlement * Conversion Factor) + Accrued Interest",
          solvesFor: "Total Cash Settlement per $100 Par Delivered (Invoice Price)",
          variables: [
            { symbol: "Invoice Price", latex: "\\text{Invoice}", meaning: "Actual cash paid by long buyer to short seller upon physical delivery", unit: "currency" },
            { symbol: "Futures Price", latex: "F_0", meaning: "Most recent CBOT futures daily settlement price", unit: "currency" },
            { symbol: "CF", latex: "\\text{CF}", meaning: "Published conversion factor for the delivered bond", unit: "dimensionless" },
            { symbol: "Accrued Interest", latex: "\\text{AI}", meaning: "Accrued coupon interest from last coupon date to delivery settlement date", unit: "currency" }
          ]
        },
        parts: [
          { id: "ip1", symbolLatex: "F_0 \\times \\text{CF}", meaning: "Adjusted clean delivery value standardized to 6% coupon baseline", unit: "currency" },
          { id: "ip2", symbolLatex: "\\text{AI}", meaning: "Coupon interest earned by bondholder prior to delivery date", unit: "currency" },
          { id: "ip3", symbolLatex: "\\times 1,000", meaning: "Multiply by 1,000 to convert $100 par quote to $100,000 contract face value", unit: "multiplier" }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Introduce Invoice Price as total cash paid upon delivery",
          sourceFactIds: ["F05"],
          newTerms: ["invoice price"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Formulate Invoice Price = (Futures Settlement * CF) + Accrued Interest",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Explain dual role of CF scaling clean price and accrued interest adjusting to dirty cash",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: Causal Chain (b19, b20, b21)
    {
      id: "s06",
      index: 6,
      title: "The Cheapest-to-Deliver (CTD) Bond: The Short Seller's Choice",
      purpose: "Define the Cheapest-to-Deliver bond and calculate Net Cost across eligible bonds",
      takeaways: [
        "The short party chooses which bond to deliver and selects the Cheapest-to-Deliver (CTD)",
        "Net Cost = Quoted Cash Price - (Futures Settlement Price * Conversion Factor)",
        "The eligible bond producing the lowest net cost is the CTD bond"
      ],
      pedagogicalContinuation: false,
      template: "causal_chain",
      data: {
        title: "Identifying the Cheapest-to-Deliver (CTD) Bond",
        links: [
          {
            id: "ctd1",
            role: "condition",
            text: "Multiple Treasury bonds qualify under the CBOT 15-year delivery specification"
          },
          {
            id: "ctd2",
            role: "action",
            text: "Calculate Net Delivery Cost for each eligible bond: Cash Price - (Futures Price * CF)"
          },
          {
            id: "ctd3",
            role: "mechanism",
            text: "Notice that Accrued Interest cancels out: Net Cost equals Cash Price - (Futures * CF)"
          },
          {
            id: "ctd4",
            role: "result",
            text: "Rank all deliverable bonds in order of net cost"
          },
          {
            id: "ctd5",
            role: "consequence",
            text: "Short seller delivers the bond minimizing net cost, anchoring theoretical futures price"
          }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Explain short seller incentive to minimize delivery cost",
          sourceFactIds: ["F06"],
          newTerms: ["cheapest-to-deliver"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Define CTD bond and algorithmic search across deliverable basket",
          sourceFactIds: ["F06"],
          newTerms: ["net delivery cost"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Formulate Net Cost = Bond Cash Price - (Futures Settlement * CF)",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Split Comparison (b22, b23, b24)
    {
      id: "s07",
      index: 7,
      title: "Yield Regimes & CTD Behavior: The 6% Tipping Point",
      purpose: "Examine CTD selection rules under market yields above vs. below 6.0%",
      takeaways: [
        "The 6.0% benchmark yield acts as a structural tipping point for CTD selection",
        "When market yields > 6%, low-coupon long-maturity bonds tend to be cheapest to deliver",
        "When market yields < 6%, high-coupon short-maturity bonds tend to be cheapest to deliver"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-yield-high",
          heading: "Market Yields > 6.0%",
          tone: "neutral",
          points: [
            "Conversion factors systematically overcompensate bonds with longer duration",
            "Long-maturity bonds suffer larger price discounts than conversion factors assume",
            "Low-coupon, long-maturity bonds are heavily favored as Cheapest-to-Deliver",
            "Upward-sloping yield curve further reinforces long-maturity delivery advantage"
          ]
        },
        right: {
          id: "cmp-yield-low",
          heading: "Market Yields < 6.0%",
          tone: "positive",
          points: [
            "Conversion factors undercompensate long-duration bonds at low yields",
            "Short-maturity bonds experience smaller capital gains, making them cheaper to deliver",
            "High-coupon, short-maturity bonds become the Cheapest-to-Deliver",
            "Downward-sloping (inverted) yield curve shifts advantage toward shorter maturities"
          ]
        },
        verdict: {
          id: "vrd-tipping",
          text: "Yields > 6% favor low-coupon long bonds; yields < 6% favor high-coupon short bonds."
        }
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Introduce 6% yield as critical tipping point for CTD selection",
          sourceFactIds: ["F07"],
          newTerms: ["6% tipping point"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Analyze yield regime > 6%: favors low-coupon long-maturity bonds",
          sourceFactIds: ["F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Analyze yield regime < 6%: favors high-coupon short-maturity bonds",
          sourceFactIds: ["F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Technical Panel (b25, b26, b27)
    {
      id: "s08",
      index: 8,
      title: "The Wild Card Play: Exploiting After-Hours Asymmetry",
      purpose: "Examine the Wild Card delivery timing option between 2:00 PM and 8:00 PM Chicago time",
      takeaways: [
        "CBOT futures settle at 2:00 PM Chicago time, fixing that day's invoice price",
        "Short sellers can issue intention to deliver until 8:00 PM that evening",
        "If bond prices drop after 2:00 PM, short sellers buy cheap bonds and tender delivery at 2:00 PM price"
      ],
      pedagogicalContinuation: false,
      template: "technical_panel",
      data: {
        title: "The Wild Card Play Execution Mechanics",
        subtitle: "Exploiting Settlement Timing Asymmetry in Chicago",
        sections: [
          {
            id: "wc-fix",
            title: "2:00 PM Settlement Fix",
            content: "CBOT futures trading halts at 2:00 PM, fixing the day's settlement price F_0 and delivery invoice formula."
          },
          {
            id: "wc-window",
            title: "2:00 PM to 8:00 PM Cash Window",
            content: "The cash bond market remains active. The short seller can submit a notice of intention to deliver until 8:00 PM."
          },
          {
            id: "wc-play",
            title: "Wild Card Arbitrage Capture",
            content: "If bond prices drop sharply after 2:00 PM, the short buys bonds at depressed cash prices and exercises delivery at the higher 2:00 PM price."
          }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Introduce the Wild Card Play delivery option",
          sourceFactIds: ["F08"],
          newTerms: ["wild card play"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Explain 2:00 PM futures settlement vs 8:00 PM delivery notice window",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Detail how post-2:00 PM bond price declines produce riskless profit",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 9: Interactive Quiz (b28, b29, b30)
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Calculating the Invoice Price",
      purpose: "Test student ability to compute the exact cash invoice price per $100 face value",
      takeaways: [
        "Futures settlement price = $90.00, CF = 1.2000, Accrued Interest = $2.50",
        "Scaled futures price: $90.00 * 1.2000 = $108.00",
        "Total invoice price: $108.00 + $2.50 = $110.50 per $100 par ($110,500 total)"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        title: "Active Recall: Treasury Bond Futures Invoice Price",
        question: "A Treasury bond futures contract settles at $90.00. The delivered bond has a Conversion Factor of 1.2000 and Accrued Interest of $2.50 per $100 par. What is the total invoice price per $100 par?",
        options: [
          "$108.00: The futures settlement price scaled by the conversion factor.",
          "$92.50: The futures settlement price plus accrued coupon interest.",
          "$110.50: Scaled futures price ($90.00 * 1.2000 = $108.00) plus accrued interest ($2.50).",
          "$112.50: The futures settlement price multiplied by CF and accrued interest combined."
        ],
        correctIndex: 2,
        explanation: "Invoice Price = (Futures Settlement Price * Conversion Factor) + Accrued Interest. Calculating directly: ($90.00 * 1.2000) + $2.50 = $108.00 + $2.50 = $110.50 per $100 of face value. For a standardized $100,000 CBOT contract, the buyer delivers total cash of $110,500."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Present the Invoice Price active recall scenario",
          sourceFactIds: ["F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Prompt calculation of scaled price and accrued interest addition",
          sourceFactIds: ["F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "Reveal Option C: $110.50 and trace cash invoice breakdown",
          sourceFactIds: ["F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Formula Breakdown (b31, b32, b33)
    {
      id: "s10",
      index: 10,
      title: "Determining Treasury Futures Theoretical Fair Value",
      purpose: "Formulate theoretical futures pricing anchored to the CTD bond",
      takeaways: [
        "Theoretical futures price F_0 is anchored directly to the Cheapest-to-Deliver bond",
        "Formula deducts coupon PV (I) and delivery accrued interest (A_T)",
        "F_0 = (1 / CF) * [(S_0 - I) * e^(r*T) - A_T]"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Theoretical Treasury Bond Futures Price Formula",
        formula: {
          latex: "F_0 = \\frac{1}{\\text{CF}} \\left[ (S_0 - I) e^{rT} - A_T \\right]",
          expression: "Futures Price = (1 / CF) * [(Spot Price - Coupon PV) * exp(r * T) - Accrued Interest at Delivery]",
          solvesFor: "Theoretical Clean Futures Equilibrium Price (F_0)",
          variables: [
            { symbol: "F_0", latex: "F_0", meaning: "Theoretical clean futures price quoted on exchange", unit: "currency" },
            { symbol: "CF", latex: "\\text{CF}", meaning: "Conversion factor of the CTD bond", unit: "dimensionless" },
            { symbol: "S_0", latex: "S_0", meaning: "Spot cash price of CTD bond today (dirty price)", unit: "currency" },
            { symbol: "I", latex: "I", meaning: "Present value of all intermediate coupons received before delivery T", unit: "currency" },
            { symbol: "A_T", latex: "A_T", meaning: "Accrued interest on the CTD bond at delivery date T", unit: "currency" },
            { symbol: "r", latex: "r", meaning: "Continuously compounded risk-free rate for horizon T", unit: "decimal/year" },
            { symbol: "T", latex: "T", meaning: "Time to futures delivery date", unit: "years" }
          ]
        },
        parts: [
          { id: "fv1", symbolLatex: "(S_0 - I) e^{rT}", meaning: "Forward dirty cash price of CTD bond compounded to maturity T", unit: "currency" },
          { id: "fv2", symbolLatex: "- A_T", meaning: "Deduct accrued coupon interest at delivery to isolate clean price", unit: "currency" },
          { id: "fv3", symbolLatex: "\\frac{1}{\\text{CF}}", meaning: "Scale down by CTD conversion factor to extract standard futures quote", unit: "scaling" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Introduce theoretical fair pricing anchored to CTD bond",
          sourceFactIds: ["F06"],
          newTerms: ["futures theoretical fair value"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Formulate F_0 = (1/CF) * [(S_0 - I)*e^(r*T) - A_T]",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Explain why deducting intermediate coupons and accrued interest prevents cash-and-carry arbitrage",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 11: Summary Thread (b34, b35, b36, b37, b38, b39)
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of Treasury Bond Futures",
      purpose: "Consolidate Chapter 6 Part 1 foundational pillars before advancing to Eurodollar futures and hedging",
      takeaways: [
        "Day count rules dictate that invoice cash equals clean price plus accrued interest",
        "Conversion factors normalize multi-bond baskets to a synthetic 6% yield baseline",
        "The short party delivers the CTD bond and retains valuable embedded delivery options"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The Four Pillars of Treasury Bond Futures",
        rules: [
          {
            id: "rul-1",
            title: "Day Count Standards",
            text: "Treasury bonds follow Actual/Actual; invoice cash equals clean price plus accrued interest."
          },
          {
            id: "rul-2",
            title: "Conversion Factor Equalization",
            text: "The exchange normalizes deliverable bonds to a synthetic 6.0% yield to maturity baseline."
          },
          {
            id: "rul-3",
            title: "Coupon Rule of Thumb",
            text: "Bonds with coupon > 6% have CF > 1.0; bonds with coupon < 6% have CF < 1.0."
          },
          {
            id: "rul-4",
            title: "Invoice Price Formula",
            text: "Invoice Price = (Futures Settlement Price * Conversion Factor) + Accrued Interest."
          },
          {
            id: "rul-5",
            title: "Cheapest-to-Deliver (CTD) Optimization",
            text: "The short seller delivers the bond minimizing Net Cost = Cash Price - (Futures Price * CF)."
          },
          {
            id: "rul-6",
            title: "The 6% Yield Tipping Point",
            text: "Market yields > 6% favor low-coupon long bonds; yields < 6% favor high-coupon short bonds."
          },
          {
            id: "rul-7",
            title: "The Wild Card Delivery Option",
            text: "Settlement price fixes at 2:00 PM while intention notice is open until 8:00 PM Chicago time."
          },
          {
            id: "rul-8",
            title: "Theoretical Futures Fair Value",
            text: "F_0 = (1/CF) * [(S_0 - I)*e^(r*T) - A_T] prevents cash-and-carry arbitrage on the CTD bond."
          }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Introduce consolidation of the four foundational pillars",
          sourceFactIds: ["F01", "F04", "F06", "F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Review Pillar One: Day Counts and Cash Pricing",
          sourceFactIds: ["F01", "F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Review Pillar Two: Conversion Factors",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Review Pillar Three: The CTD Bond",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Review Pillar Four: Embedded Delivery Options",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b6",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Preview Chapter 6 Part 2: Eurodollar futures, convexity, and hedging",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(episode, null, 2));

// 6. Register in course_map.json and book.config.json
const courseMapPath = 'c:/code/openlectern/workspace/books/hull/course_map.json';
const courseMap = JSON.parse(fs.readFileSync(courseMapPath, 'utf8'));
if (!courseMap.chapters.some(c => c.chapterId === 'ch06' && c.partId === 'p1')) {
  courseMap.chapters.push({
    chapterId: "ch06",
    partId: "p1",
    title: "Interest Rate Futures - Part 1",
    status: "in_progress"
  });
  fs.writeFileSync(courseMapPath, JSON.stringify(courseMap, null, 2));
}

const bookConfigPath = 'c:/code/openlectern/workspace/books/hull/book.config.json';
const bookConfig = JSON.parse(fs.readFileSync(bookConfigPath, 'utf8'));
let ch06 = bookConfig.chapters.find(c => c.id === 'ch06');
if (!ch06) {
  ch06 = {
    id: "ch06",
    number: 6,
    title: "Interest Rate Futures"
  };
  bookConfig.chapters.push(ch06);
  fs.writeFileSync(bookConfigPath, JSON.stringify(bookConfig, null, 2));
}

console.log('Chapter 6 Part 1 successfully built and registered in course_map and book.config!');
