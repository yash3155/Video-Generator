import fs from 'node:fs';

const input = JSON.parse(fs.readFileSync('workspace/.tasks/ch04-p1-storyboard-818fd072/input.json', 'utf8'));

const visualBriefScenes = [
  {
    index: 0,
    topology: "hook",
    visualIntent: "Two-party institutional hook showing bank trading desk pricing 10-year derivatives, flat yield trap, and resolution with Treasury zero curve",
    keyElements: [
      "10-year corporate derivative contract",
      "bank trading desk cash flow exposure",
      "flat yield to maturity discount assumption",
      "arbitrage mismatch and trading losses",
      "sovereign Treasury rate benchmark",
      "spot zero curve reconstruction"
    ],
    factIds: ["F01", "F06", "F08"]
  },
  {
    index: 1,
    topology: "tension",
    visualIntent: "Tug of war between discrete commercial banking compounding and continuous quantitative derivatives modeling",
    keyElements: [
      "discrete compounding calendar intervals",
      "continuous compounding analytical curve",
      "frequency m approaching infinity",
      "terminal value A*e^(Rn)",
      "natural logarithm conversion bridge"
    ],
    factIds: ["F02", "F03"]
  },
  {
    index: 2,
    topology: "pillars",
    visualIntent: "Four progressive cards displaying benchmark rates, continuous discounting, zero curves, and forward rate derivation",
    keyElements: [
      "Card 1: Sovereign Treasury rates and collateralized repo rate",
      "Card 2: Exponential discount factor e^(-RT)",
      "Card 3: Spot zero rate stripping via bootstrap",
      "Card 4: Implied forward interest rate extraction"
    ],
    factIds: ["F01", "F04", "F05", "F09"]
  },
  {
    index: 3,
    topology: "formula",
    visualIntent: "Formula breakdown of continuous compounding rate conversion R_c = m * ln(1 + R_m / m) with semiannual 10% worked numbers",
    keyElements: [
      "formula R_c = m * ln(1 + R_m / m)",
      "compounding frequency m = 2",
      "discrete annual rate R_m = 0.10 (10%)",
      "periodic 6-month rate 1.05",
      "continuous equivalent rate R_c = 0.09758 (9.758%)"
    ],
    factIds: ["F02", "F03", "F11"]
  },
  {
    index: 4,
    topology: "process",
    visualIntent: "Three-step causal chain showing observed bond prices, recursive coupon stripping, and extraction of spot zero rates",
    keyElements: [
      "Node 1: Multi-year coupon bond market prices",
      "Node 2: Recursive stripping of prior discounted coupons",
      "Node 3: Isolation of final payment to solve next zero rate"
    ],
    factIds: ["F06", "F08"]
  },
  {
    index: 5,
    topology: "worked_example",
    visualIntent: "Step-by-step bootstrapping of 6-month zero rate from a Treasury bill trading at 97.50 dollars",
    keyElements: [
      "Treasury bill price 97.50 dollars",
      "face value 100 dollars",
      "maturity T = 0.5 years",
      "price ratio 97.50 / 100 = 0.975",
      "6-month continuous zero rate R = 0.05064 (5.064%)"
    ],
    factIds: ["F05", "F08", "F12"]
  },
  {
    index: 6,
    topology: "comparison",
    visualIntent: "Split comparison between flat yield to maturity assumption and professional multi-period spot zero curve",
    keyElements: [
      "Left: Novice trap discounting all cash flows at single flat YTM",
      "Right: Professional zero curve discounting each cash flow at spot rate",
      "Par yield coupon rate benchmark making bond price equal face value"
    ],
    factIds: ["F05", "F06", "F07"]
  },
  {
    index: 7,
    topology: "formula",
    visualIntent: "Interactive formula breakdown calculating 1-year forward rate starting at year 1 from 3% and 4% zero rates",
    keyElements: [
      "forward rate formula R_F = (R_2*T_2 - R_1*T_1) / (T_2 - T_1)",
      "1-year zero rate R_1 = 3.0% at T_1 = 1",
      "2-year zero rate R_2 = 4.0% at T_2 = 2",
      "rate-time numerator product 0.08 - 0.03 = 0.05",
      "implied forward rate R_F = 5.0%"
    ],
    factIds: ["F09", "F10"]
  },
  {
    index: 8,
    topology: "quantity_over_time",
    visualIntent: "Term structure chart showing upward sloping zero curve and the implied forward curve lying strictly above it",
    keyElements: [
      "Horizontal axis: Maturity in years (0 to 5 years)",
      "Vertical axis: Annual interest rate percentage (0% to 8%)",
      "Zero curve starting at 3.0% for 1 year and 4.0% for 2 years",
      "Forward curve plotted above spot curve reaching 5.0% for year 2"
    ],
    factIds: ["F05", "F09", "F10"]
  },
  {
    index: 9,
    topology: "quiz",
    visualIntent: "Interactive 4-choice quiz testing forward rate calculation from 3% 1-year and 4% 2-year zero rates",
    keyElements: [
      "Question banner with 1-year 3% and 2-year 4% zero rates",
      "Option A: 3.5%",
      "Option B: 4.0%",
      "Option C: 5.0% (Correct)",
      "Option D: 7.0%",
      "3.2-second thinking countdown spinner",
      "Green highlight and no-arbitrage explanation banner"
    ],
    factIds: ["F09", "F10"]
  },
  {
    index: 10,
    topology: "roadmap",
    visualIntent: "Where We Are roadmap reviewing interest rate mechanics, zero curves, and bridging to Part 2 FRAs and duration",
    keyElements: [
      "Stage 1: Sovereign benchmark Treasury rates",
      "Stage 2: Continuous compounding and discount factors",
      "Stage 3: Bootstrap recursive zero curve construction",
      "Stage 4: Forward interest rate extraction",
      "Preview: Part 2 FRAs, Duration, and Convexity"
    ],
    factIds: ["F01", "F08", "F09"]
  },
  {
    index: 11,
    topology: "summary",
    visualIntent: "The 8 Golden Rules summary grid progressive reveal from Rule 1 through Rule 8",
    keyElements: [
      "Rule 1: Default-free sovereign Treasury rates",
      "Rule 2: Continuous terminal value A*e^(Rn)",
      "Rule 3: Conversion formula R_c = m * ln(1 + R_m / m)",
      "Rule 4: Exponential discount factor e^(-RT)",
      "Rule 5: Zero rates for single coupon-free cash flows",
      "Rule 6: Par yield equating bond price to face value",
      "Rule 7: Recursive Bootstrap coupon stripping",
      "Rule 8: Forward rate formula (R2*T2 - R1*T1) / (T2 - T1)"
    ],
    factIds: ["F01", "F02", "F03", "F04", "F05", "F07", "F08", "F09"]
  }
];

const storyboardScenes = [
  {
    index: 0,
    template: "chat_story",
    justification: "Fixed hook template presenting two-party institutional dilemma and flat yield trap",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s00b1",
        visualIntent: "Display bank trading desk managing multi-year corporate derivative contract with 10-year cash flow exposure"
      },
      {
        id: "s00b2",
        visualIntent: "Show novice analyst applying single flat yield to maturity across all payment dates"
      },
      {
        id: "s00b3",
        visualIntent: "Highlight upward sloping curve mispricing, arbitrage exploitation, and trading losses"
      },
      {
        id: "s00b4",
        visualIntent: "Reveal resolution: sovereign Treasury rate definition and spot zero curve construction"
      }
    ]
  },
  {
    index: 1,
    template: "tug_of_war",
    justification: "Tension topology contrasting discrete commercial banking quotes against continuous modeling reality",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s01b1",
        visualIntent: "Left side: Commercial discrete compounding quotes at fixed calendar intervals"
      },
      {
        id: "s01b2",
        visualIntent: "Right side: Continuous compounding analytical curve with terminal value A*e^(Rn)"
      },
      {
        id: "s01b3",
        visualIntent: "Center fulcrum: Natural logarithm formula bridging discrete and continuous rates"
      }
    ]
  },
  {
    index: 2,
    template: "progressive_cards",
    justification: "Pillars topology revealing the four core building blocks of interest rate mechanics",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s02b1",
        visualIntent: "Card 1: Sovereign Treasury rates and collateralized repo rate definition"
      },
      {
        id: "s02b2",
        visualIntent: "Card 2: Continuous discount factor e^(-RT) calculating present values"
      },
      {
        id: "s02b3",
        visualIntent: "Card 3: Spot zero rate definition and recursive Bootstrap method"
      },
      {
        id: "s02b4",
        visualIntent: "Card 4: Forward rate definition implied for future borrowing periods"
      }
    ]
  },
  {
    index: 3,
    template: "formula_breakdown",
    justification: "Formula topology breaking down continuous compounding rate conversion R_c = m * ln(1 + R_m / m)",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s03b1",
        visualIntent: "Display rate conversion formula R_c = m * ln(1 + R_m / m) with highlighted parameters"
      },
      {
        id: "s03b2",
        visualIntent: "Show bank quote numbers: annual rate 10%, semiannual frequency m = 2, periodic rate 1.05"
      },
      {
        id: "s03b3",
        visualIntent: "Show calculation result: R_c = 0.09758 (9.758%) achieving equal terminal balance"
      }
    ]
  },
  {
    index: 4,
    template: "causal_chain",
    justification: "Process topology showing the three-step causal architecture of coupon stripping",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s04b1",
        visualIntent: "Node 1: Market bond prices observed bundling periodic coupon cash flows"
      },
      {
        id: "s04b2",
        visualIntent: "Node 2: Recursive coupon stripping discounting prior payments at known zero rates"
      },
      {
        id: "s04b3",
        visualIntent: "Node 3: Final payment isolated to solve next zero rate and complete spot curve"
      }
    ]
  },
  {
    index: 5,
    template: "worked_example",
    justification: "Worked example topology calculating 6-month Treasury bill continuous zero rate",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s05b1",
        visualIntent: "Given panel: Treasury bill price 97.50 dollars, face value 100 dollars, maturity 0.5 years"
      },
      {
        id: "s05b2",
        visualIntent: "Step 1: Set 97.50 = 100*e^(-0.5*R), compute ratio 0.975, apply -ln(0.975) / 0.5"
      },
      {
        id: "s05b3",
        visualIntent: "Result card: 6-month continuously compounded zero rate equals 0.05064 (5.064%)"
      }
    ]
  },
  {
    index: 6,
    template: "split_comparison",
    justification: "Comparison topology contrasting novice flat YTM myth against professional zero curves",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s06b1",
        visualIntent: "Novice trap: Single flat yield to maturity applied across all cash flow tenors"
      },
      {
        id: "s06b2",
        visualIntent: "Professional reality: Unique spot zero rates discounting each cash flow independently"
      },
      {
        id: "s06b3",
        visualIntent: "Par yield definition: Coupon rate causing bond theoretical price to equal face value"
      }
    ]
  },
  {
    index: 7,
    template: "formula_breakdown",
    justification: "Formula topology for forward rate extraction with prediction question and reveal",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s07b1",
        visualIntent: "Display forward rate formula R_F = (R_2*T_2 - R_1*T_1) / (T_2 - T_1)"
      },
      {
        id: "s07b2",
        visualIntent: "Prediction question: 1-year rate 3% and 2-year rate 4%, calculate 0.04*2 - 0.03*1"
      },
      {
        id: "s07b3",
        visualIntent: "Reveal step: 0.05 divided by 1 year gives forward rate 5.0% with no-arbitrage proof"
      }
    ]
  },
  {
    index: 8,
    template: "data_chart",
    justification: "Quantity over time topology plotting zero curve against implied forward curve",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s08b1",
        visualIntent: "Plot upward sloping zero curve with forward rate curve lying strictly above it"
      },
      {
        id: "s08b2",
        visualIntent: "Highlight data points: Year 1 zero rate 3%, Year 2 zero rate 4%, Year 2 forward rate 5%"
      },
      {
        id: "s08b3",
        visualIntent: "Display inverted curve comparison: downward sloping zero curve places forward rates below"
      }
    ]
  },
  {
    index: 9,
    template: "interactive_quiz",
    justification: "Fixed assessment template testing forward rate calculation in 3 beats",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s09b1",
        visualIntent: "Question beat: 1-year zero rate 3.0% and 2-year zero rate 4.0%, four options A to D"
      },
      {
        id: "s09b2",
        visualIntent: "Thinking pause: 3.2-second countdown timer with visible formula guidance"
      },
      {
        id: "s09b3",
        visualIntent: "Reveal beat: Option C (5.0%) highlights green with calculation explanation"
      }
    ]
  },
  {
    index: 10,
    template: "roadmap",
    justification: "Wisdom and course positioning roadmap reviewing progress and bridging to Part 2",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s10b1",
        visualIntent: "Roadmap steps 1-3 completed: Benchmarks, Continuous Compounding, and Zero Curve Bootstrap"
      },
      {
        id: "s10b2",
        visualIntent: "Roadmap step 4: Implied forward rates unlocked for swap and derivative pricing"
      },
      {
        id: "s10b3",
        visualIntent: "Bridge to Part 2: FRAs, Macaulay Duration, Convexity, and Term Structure Theories"
      }
    ]
  },
  {
    index: 11,
    template: "summary_thread",
    justification: "Fixed summary template presenting the 8 golden rules across 6 progressive beats",
    pedagogicalContinuation: false,
    beats: [
      {
        id: "s11b1",
        visualIntent: "Display summary title: The 8 Golden Rules of Interest Rates and Zero Curves"
      },
      {
        id: "s11b2",
        visualIntent: "Reveal Rule 1 (Treasury Rates) and Rule 2 (Continuous Terminal Value)"
      },
      {
        id: "s11b3",
        visualIntent: "Reveal Rule 3 (Rate Conversion R_c) and Rule 4 (Discount Factors e^(-RT))"
      },
      {
        id: "s11b4",
        visualIntent: "Reveal Rule 5 (Zero Rates) and Rule 6 (Par Yield Face Value Equality)"
      },
      {
        id: "s11b5",
        visualIntent: "Reveal Rule 7 (Bootstrap Stripping) and Rule 8 (Forward Rate Formula)"
      },
      {
        id: "s11b6",
        visualIntent: "Show complete 8-rule review grid from Rule 1 through Rule 8"
      }
    ]
  }
];

const output = {
  visualBrief: {
    scenes: visualBriefScenes
  },
  storyboard: {
    scenes: storyboardScenes
  }
};

fs.writeFileSync('workspace/.tasks/ch04-p1-storyboard-818fd072/output.json', JSON.stringify(output, null, 2));
console.log('S8 output written to output.json');
