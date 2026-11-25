import fs from 'node:fs';

const input = JSON.parse(fs.readFileSync('workspace/.tasks/ch04-p1-episode_fill-fce465c7/input.json', 'utf8'));

// Build scenes
const scenes = [
  // Scene 0: Hook
  {
    index: 0,
    title: "The Single Rate Trap",
    takeaways: [
      "Banks price complex multi-year derivative contracts",
      "Flat yield to maturity discounting causes severe mispricing",
      "Arbitrage-free pricing requires spot zero curves"
    ],
    data: {
      messages: [
        { "id": "m1", "speaker": "novice", "text": "Can a bank discount ten-year cash flows with flat yield?" },
        { "id": "m2", "speaker": "mentor", "text": "Flat yield to maturity causes dangerous pricing distortion" },
        { "id": "m3", "speaker": "novice", "text": "Arbitrage traders exploit upward sloping yield curves" },
        { "id": "m4", "speaker": "mentor", "text": "A Treasury rate is sovereign borrowing without default; desks construct spot zero curves using recursive bootstrapping." }
      ],
      whereWeAre: {
        label: "WHERE WE ARE",
        items: [
          "Rates & Compounding",
          "Zero Curve & Bootstrap",
          "Forward Rates",
          "Duration & FRAs"
        ],
        current: 0
      }
    },
    beats: [
      {
        id: "s00b1",
        visual: { show: ["m1"] },
        visualCues: [{ target: "m1", anchor: { en: "derivative", hi: "डेरिवेटिव" } }]
      },
      {
        id: "s00b2",
        visual: { show: ["m1", "m2"] },
        visualCues: [{ target: "m2", anchor: { en: "maturity", hi: "मैच्योरिटी" } }]
      },
      {
        id: "s00b3",
        visual: { show: ["m1", "m2", "m3"] },
        visualCues: [{ target: "m3", anchor: { en: "Arbitrage", hi: "आर्बिट्राज" } }]
      },
      {
        id: "s00b4",
        visual: { show: ["m4"] },
        visualCues: [{ target: "m4", anchor: { en: "Treasury", hi: "ट्रेजरी" } }]
      }
    ]
  },

  // Scene 1: Tug of War
  {
    index: 1,
    title: "Discrete vs Continuous Compounding",
    takeaways: [
      "Commercial banks quote discrete compounding rates",
      "Derivatives modeling requires continuous compounding",
      "Natural logarithm provides exact conversion bridge"
    ],
    data: {
      left: {
        id: "left_disc",
        label: "Discrete Compounding",
        points: [
          "Commercial banking quotes",
          "Fixed calendar intervals",
          "Compounded m times per year"
        ]
      },
      right: {
        id: "right_cont",
        label: "Continuous Compounding",
        points: [
          "Analytical derivatives calculus",
          "Infinite compounding frequency",
          "Exponential terminal growth"
        ]
      },
      resolution: {
        id: "res_bridge",
        label: "Conversion Bridge",
        text: "Exact mathematical rate conversion"
      }
    },
    beats: [
      {
        id: "s01b1",
        visual: { show: ["left_disc"] },
        visualCues: [{ target: "left_disc", anchor: { en: "discrete", hi: "डिस्क्रीट" } }]
      },
      {
        id: "s01b2",
        visual: { show: ["left_disc", "right_cont"] },
        visualCues: [{ target: "right_cont", anchor: { en: "continuous", hi: "कंटीन्यूअस" } }]
      },
      {
        id: "s01b3",
        visual: { show: ["left_disc", "right_cont", "res_bridge"] },
        visualCues: [{ target: "res_bridge", anchor: { en: "logarithm", hi: "लॉगरिदम" } }]
      }
    ]
  },

  // Scene 2: Progressive Cards
  {
    index: 2,
    title: "Four Pillars of Interest Rate Mechanics",
    takeaways: [
      "Benchmark Treasury and repo rates anchor money markets",
      "Continuous discount factors convert future cash flows",
      "Zero curves and forward rates enable fair valuation"
    ],
    data: {
      cards: [
        {
          id: "c1",
          title: "Pillar 1: Benchmark Rates",
          body: "Sovereign Treasury rates and collateralized repo rates anchor the money markets."
        },
        {
          id: "c2",
          title: "Pillar 2: Continuous Discounting",
          body: "Present values multiply future cash flows by continuous discount factors."
        },
        {
          id: "c3",
          title: "Pillar 3: Spot Zero Curve",
          body: "Zero rates for pure discount single cash flows derived via the recursive Bootstrap."
        },
        {
          id: "c4",
          title: "Pillar 4: Forward Rates",
          body: "Implied borrowing rates between future dates T1 and T2 extracted from zero curves."
        }
      ]
    },
    beats: [
      {
        id: "s02b1",
        visual: { show: ["c1"] },
        visualCues: [{ target: "c1", anchor: { en: "repo", hi: "रेपो" } }]
      },
      {
        id: "s02b2",
        visual: { show: ["c1", "c2"] },
        visualCues: [{ target: "c2", anchor: { en: "discount", hi: "डिस्काउंट" } }]
      },
      {
        id: "s02b3",
        visual: { show: ["c1", "c2", "c3"] },
        visualCues: [{ target: "c3", anchor: { en: "bootstrapping", hi: "बूटस्ट्रैपिंग" } }]
      },
      {
        id: "s02b4",
        visual: { show: ["c1", "c2", "c3", "c4"] },
        visualCues: [{ target: "c4", anchor: { en: "forward", hi: "फॉरवर्ड" } }]
      }
    ]
  },

  // Scene 3: Formula Breakdown
  {
    index: 3,
    title: "Continuous Compounding Mechanics",
    takeaways: [
      "Formula converts discrete rates into continuous rates",
      "Stated 10% semiannual rate equals 9.758% continuous rate",
      "Continuous compounding requires lower stated rate"
    ],
    data: {
      title: "Continuous Compounding Rate Conversion",
      formula: {
        id: "f_conv",
        latex: "R_c = m \\times \\ln\\left(1 + \\frac{R_m}{m}\\right)",
        expression: "m * log(1 + R_m / m)",
        solvesFor: "R_c",
        variables: [
          { symbol: "R_c", latex: "R_c", meaning: "Continuous equivalent rate", unit: "dimensionless" },
          { symbol: "m", latex: "m", meaning: "Compounding frequency per annum", unit: "count" },
          { symbol: "R_m", latex: "R_m", meaning: "Stated discrete rate", unit: "dimensionless" }
        ]
      },
      parts: [
        { id: "p1", symbolLatex: "R_c", meaning: "Continuous compounding equivalent", unit: "dimensionless" },
        { id: "p2", symbolLatex: "m", meaning: "Compounding frequency per year", unit: "count" },
        { id: "p3", symbolLatex: "R_m", meaning: "Stated annual compounding rate", unit: "dimensionless" },
        { id: "p4", symbolLatex: "1 + \\frac{R_m}{m}", meaning: "Periodic gross return factor", unit: "dimensionless" }
      ],
      note: "10% semiannual compounding converts to 9.758% continuous rate"
    },
    beats: [
      {
        id: "s03b1",
        visual: { show: ["p1", "p2", "p3"] },
        visualCues: [{ target: "p1", anchor: { en: "logarithm", hi: "लॉग" } }]
      },
      {
        id: "s03b2",
        visual: { show: ["p1", "p2", "p3", "p4"] },
        visualCues: [{ target: "p4", anchor: { en: "semiannually", hi: "अर्धवार्षिक" } }]
      },
      {
        id: "s03b3",
        visual: { show: ["p1", "p2", "p3", "p4"] },
        visualCues: [{ target: "p2", anchor: { en: "0.09758", hi: "0.09758" } }]
      }
    ]
  },

  // Scene 4: Causal Chain
  {
    index: 4,
    title: "Causal Architecture of the Bootstrap",
    takeaways: [
      "Market coupon bond prices bundle multiple maturities",
      "Recursive coupon stripping solves each zero rate in order",
      "Produces complete continuous zero curve without arbitrage"
    ],
    data: {
      links: [
        {
          id: "n1",
          role: "condition",
          text: "Market bond prices bundle multiple coupon cash flows"
        },
        {
          id: "n2",
          role: "action",
          text: "Strip prior coupons recursively using known zero discount factors"
        },
        {
          id: "n3",
          role: "mechanism",
          text: "Isolate final cash flow to solve directly for next zero rate"
        },
        {
          id: "n4",
          role: "result",
          text: "Complete spot zero curve across all maturity tenors"
        },
        {
          id: "n5",
          role: "consequence",
          text: "Enables exact valuation of multi-period corporate derivatives"
        }
      ]
    },
    beats: [
      {
        id: "s04b1",
        visual: { show: ["n1"] },
        visualCues: [{ target: "n1", anchor: { en: "bundle", hi: "बंडल" } }]
      },
      {
        id: "s04b2",
        visual: { show: ["n1", "n2", "n3"] },
        visualCues: [{ target: "n2", anchor: { en: "strips", hi: "एल्गोरिदम" } }]
      },
      {
        id: "s04b3",
        visual: { show: ["n1", "n2", "n3", "n4", "n5"] },
        visualCues: [{ target: "n4", anchor: { en: "isolates", hi: "अंतिम" } }]
      }
    ]
  },

  // Scene 5: Worked Example
  {
    index: 5,
    title: "Bootstrapping Treasury Zero Rates",
    takeaways: [
      "6-month bill trading at $97.50 yields discount ratio 0.975",
      "Continuous rate formula R = -ln(P/F) / T gives 5.064%",
      "Exact zero rate discounts coupons on longer bonds"
    ],
    data: {
      title: "Bootstrapping 6-Month Zero Rate",
      formula: {
        id: "f_bill",
        latex: "R = -\\frac{\\ln(P / F)}{T}",
        expression: "-log(P / F) / T",
        solvesFor: "R",
        variables: [
          { symbol: "R", latex: "R", meaning: "Continuously compounded zero rate", unit: "dimensionless" },
          { symbol: "P", latex: "P", meaning: "Market price of bill", unit: "dollars" },
          { symbol: "F", latex: "F", meaning: "Face value", unit: "dollars" },
          { symbol: "T", latex: "T", meaning: "Maturity in years", unit: "years" }
        ]
      },
      given: [
        { id: "g_p", symbol: "P", label: "Market Price P", value: 97.5, unit: "dollars", display: "$97.50" },
        { id: "g_f", symbol: "F", label: "Face Value F", value: 100, unit: "dollars", display: "$100.00" },
        { id: "g_t", symbol: "T", label: "Maturity T", value: 0.5, unit: "years", display: "0.5 yr" }
      ],
      steps: [
        { id: "s1", label: "Price Ratio", latex: "\\frac{P}{F} = \\frac{97.50}{100} = 0.975", expr: "97.5 / 100", value: 0.975 },
        { id: "s2", label: "Continuous Rate", latex: "R = -\\frac{\\ln(0.975)}{0.5} = 0.05064", expr: "-log(0.975) / 0.5", value: 0.05064 }
      ],
      result: {
        id: "res_r",
        label: "6-Month Zero Rate",
        value: 0.05064,
        unit: "dimensionless",
        display: "5.064%",
        rounding: 5
      },
      conclusion: "The 6-month continuous Treasury zero rate is 5.064%."
    },
    beats: [
      {
        id: "s05b1",
        visual: { show: ["g_p", "g_f", "g_t"] },
        visualCues: [{ target: "g_p", anchor: { en: "97.50", hi: "97.50" } }]
      },
      {
        id: "s05b2",
        visual: { show: ["g_p", "g_f", "g_t", "s1", "s2"] },
        visualCues: [{ target: "s1", anchor: { en: "0.975", hi: "0.975" } }]
      },
      {
        id: "s05b3",
        visual: { show: ["g_p", "g_f", "g_t", "s1", "s2", "res_r"] },
        visualCues: [{ target: "res_r", anchor: { en: "0.05064", hi: "0.05064" } }]
      }
    ]
  },

  // Scene 6: Misconception Split
  {
    index: 6,
    title: "Flat YTM vs Spot Zero Curve",
    takeaways: [
      "Flat YTM ignores upward or downward sloping curve shapes",
      "Each cash flow must be discounted at its unique spot rate",
      "Par yield makes price equal par without replacing spot rates"
    ],
    data: {
      left: {
        id: "left_trap",
        heading: "Novice Flat YTM Trap",
        tone: "trap",
        points: [
          "Discounts all cash flows at single flat rate",
          "Distorts multi-period derivative pricing",
          "Creates severe market arbitrage vulnerability"
        ]
      },
      right: {
        id: "right_reality",
        heading: "Professional Zero Curve",
        tone: "positive",
        points: [
          "Discounts each coupon at its unique spot rate",
          "Matches no-arbitrage market conditions",
          "Par yields reflect curve shape accurately"
        ]
      },
      verdict: {
        id: "v_verdict",
        text: "Discount each cash flow at its specific spot zero rate."
      }
    },
    beats: [
      {
        id: "s06b1",
        visual: { show: ["left_trap"] },
        visualCues: [{ target: "left_trap", anchor: { en: "misconception", hi: "गलत" } }]
      },
      {
        id: "s06b2",
        visual: { show: ["left_trap", "right_reality"] },
        visualCues: [{ target: "right_reality", anchor: { en: "unique", hi: "अद्वितीय" } }]
      },
      {
        id: "s06b3",
        visual: { show: ["left_trap", "right_reality", "v_verdict"] },
        visualCues: [{ target: "v_verdict", anchor: { en: "par", hi: "पार" } }]
      }
    ]
  },

  // Scene 7: Forward Rate Formula
  {
    index: 7,
    title: "Extracting Implied Forward Rates",
    takeaways: [
      "Forward rate formula uses rate-time products difference",
      "With 1-year rate 3% and 2-year rate 4%, forward rate is 5%",
      "Forward rates prevent profitable multi-year borrowing arbitrage"
    ],
    data: {
      title: "Implied Forward Rate Calculation",
      formula: {
        id: "f_fwd",
        latex: "R_F = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}",
        expression: "(R_2 * T_2 - R_1 * T_1) / (T_2 - T_1)",
        solvesFor: "R_F",
        variables: [
          { symbol: "R_F", latex: "R_F", meaning: "Implied forward rate", unit: "dimensionless" },
          { symbol: "R_1", latex: "R_1", meaning: "Zero rate for maturity T1", unit: "dimensionless" },
          { symbol: "T_1", latex: "T_1", meaning: "First maturity", unit: "years" },
          { symbol: "R_2", latex: "R_2", meaning: "Zero rate for maturity T2", unit: "dimensionless" },
          { symbol: "T_2", latex: "T_2", meaning: "Second maturity", unit: "years" }
        ]
      },
      parts: [
        { id: "p1", symbolLatex: "R_F", meaning: "Implied forward interest rate", unit: "dimensionless" },
        { id: "p2", symbolLatex: "R_2 T_2", meaning: "Cumulative return to maturity T2", unit: "dimensionless" },
        { id: "p3", symbolLatex: "R_1 T_1", meaning: "Cumulative return to maturity T1", unit: "dimensionless" },
        { id: "p4", symbolLatex: "T_2 - T_1", meaning: "Duration of forward borrowing period", unit: "years" }
      ],
      note: "With 1-year rate 3% and 2-year rate 4%, forward rate is 5.0%"
    },
    beats: [
      {
        id: "s07b1",
        visual: { show: ["p1", "p2", "p3"] },
        visualCues: [{ target: "p1", anchor: { en: "formula", hi: "फॉर्मूला" } }]
      },
      {
        id: "s07b2",
        visual: { show: ["p1", "p2", "p3", "p4"] },
        visualCues: [{ target: "p2", anchor: { en: "numerator", hi: "अंश" } }]
      },
      {
        id: "s07b3",
        visual: { show: ["p1", "p2", "p3", "p4"] },
        visualCues: [{ target: "p3", anchor: { en: "0.05", hi: "0.05" } }]
      }
    ]
  },

  // Scene 8: Data Chart
  {
    index: 8,
    title: "Zero Rates vs Forward Curve",
    takeaways: [
      "Upward sloping zero curve places forward curve strictly above",
      "At year 1 rate 3% and year 2 rate 4%, forward rate is 5%",
      "Geometric relationship is critical for bond portfolio trading"
    ],
    data: {
      kind: "line",
      title: "Zero Curve vs Forward Curve",
      xAxis: { label: "Maturity", unit: "years" },
      yAxis: { label: "Interest Rate", unit: "%" },
      series: [
        {
          id: "s_zero",
          label: "Zero Curve R(T)",
          color: "teal",
          points: [
            { x: 0.5, y: 2.5 },
            { x: 1.0, y: 3.0 },
            { x: 1.5, y: 3.5 },
            { x: 2.0, y: 4.0 },
            { x: 3.0, y: 4.6 }
          ]
        },
        {
          id: "s_fwd",
          label: "Forward Curve RF",
          color: "gold",
          points: [
            { x: 0.5, y: 2.5 },
            { x: 1.0, y: 3.5 },
            { x: 1.5, y: 4.5 },
            { x: 2.0, y: 5.0 },
            { x: 3.0, y: 5.8 }
          ]
        }
      ],
      markers: [
        { id: "m1", x: 1.0, y: 3.0, label: "1-Yr Zero: 3.0%" },
        { id: "m2", x: 2.0, y: 4.0, label: "2-Yr Zero: 4.0%" },
        { id: "m3", x: 2.0, y: 5.0, label: "Forward: 5.0%" }
      ]
    },
    beats: [
      {
        id: "s08b1",
        visual: { show: ["s_zero", "s_fwd"] },
        visualCues: [{ target: "s_fwd", anchor: { en: "upward", hi: "ढलान" } }]
      },
      {
        id: "s08b2",
        visual: { show: ["s_zero", "s_fwd", "m1", "m2", "m3"] },
        visualCues: [{ target: "m1", anchor: { en: "3.0%", hi: "3.0%" } }]
      },
      {
        id: "s08b3",
        visual: { show: ["s_zero", "s_fwd", "m1", "m2", "m3"] },
        visualCues: [{ target: "s_zero", anchor: { en: "downward", hi: "नीचे" } }]
      }
    ]
  },

  // Scene 9: Interactive Quiz
  {
    index: 9,
    title: "Interactive Assessment",
    takeaways: [
      "Quiz tests calculating 1-year forward rate from zero rates",
      "Using forward rate formula yields exactly 5.0%",
      "Correct option highlights green after thinking pause"
    ],
    data: {
      question: "Suppose a sovereign zero curve quotes a 1-year zero rate of 3.0% and a 2-year zero rate of 4.0%. What is the implied 1-year forward rate starting at year 1?",
      options: [
        "3.5% per annum",
        "4.0% per annum",
        "5.0% per annum",
        "7.0% per annum"
      ],
      correctIndex: 2,
      explanation: "Forward rate equals 0.04 times 2 minus 0.03 times 1 divided by 1, which equals 5.0%."
    },
    beats: [
      {
        id: "s09b1",
        visual: { show: [], phase: "question", hypothetical: true },
        visualCues: []
      },
      {
        id: "s09b2",
        visual: { show: [], phase: "thinking", hypothetical: true },
        visualCues: []
      },
      {
        id: "s09b3",
        visual: { show: [], phase: "reveal", hypothetical: true },
        visualCues: []
      }
    ]
  },

  // Scene 10: Roadmap
  {
    index: 10,
    title: "Where We Are on the Journey",
    takeaways: [
      "Mastered Treasury benchmark rates and continuous compounding",
      "Constructed sovereign zero curve via recursive bootstrapping",
      "Extracted forward rates to prepare for FRAs and duration in Part 2"
    ],
    data: {
      title: "Interest Rate Modeling Journey",
      items: [
        { id: "rm1", label: "Benchmarks", sublabel: "Treasury and repo rates", status: "done" },
        { id: "rm2", label: "Compounding", sublabel: "Continuous discounting", status: "done" },
        { id: "rm3", label: "Zero Curve", sublabel: "Bootstrap algorithm", status: "done" },
        { id: "rm4", label: "Forward Rates", sublabel: "Implied borrowing rates", status: "done" },
        { id: "rm5", label: "Part 2", sublabel: "FRAs and Duration", status: "next" }
      ]
    },
    beats: [
      {
        id: "s10b1",
        visual: { show: ["rm1", "rm2", "rm3"] },
        visualCues: [{ target: "rm1", anchor: { en: "foundational", hi: "बुनियादी" } }]
      },
      {
        id: "s10b2",
        visual: { show: ["rm1", "rm2", "rm3", "rm4"] },
        visualCues: [{ target: "rm4", anchor: { en: "extracted", hi: "निकाली" } }]
      },
      {
        id: "s10b3",
        visual: { show: ["rm1", "rm2", "rm3", "rm4", "rm5"] },
        visualCues: [{ target: "rm5", anchor: { en: "Duration", hi: "ड्यूरेशन" } }]
      }
    ]
  },

  // Scene 11: Summary Thread
  {
    index: 11,
    title: "The 8 Golden Rules",
    takeaways: [
      "Eight golden rules govern interest rate mechanics and zero curves",
      "Continuous compounding and bootstrapping ensure no-arbitrage pricing",
      "Solid foundation established for pricing multi-period derivatives"
    ],
    data: {
      title: "The 8 Golden Rules of Interest Rates",
      rules: [
        { id: "rule_1", title: "Rule 1: Sovereign Benchmark", text: "Treasury rates represent default-free borrowing." },
        { id: "rule_2", title: "Rule 2: Continuous Compounding", text: "Terminal value is given by continuous compounding." },
        { id: "rule_3", title: "Rule 3: Rate Conversion", text: "Convert discrete rates using natural logarithms." },
        { id: "rule_4", title: "Rule 4: Discount Factors", text: "Present value cash flow multiplier is exponential." },
        { id: "rule_5", title: "Rule 5: Spot Zero Rates", text: "Zero rates discount single coupon-free payments." },
        { id: "rule_6", title: "Rule 6: Par Yields", text: "Coupon rate causing bond price to equal face value." },
        { id: "rule_7", title: "Rule 7: Bootstrap Method", text: "Recursive coupon stripping builds the spot curve." },
        { id: "rule_8", title: "Rule 8: Forward Rates", text: "Implied forward rate uses rate-time product difference." }
      ]
    },
    beats: [
      {
        id: "s11b1",
        visual: { show: [], range: [0, 0] },
        visualCues: []
      },
      {
        id: "s11b2",
        visual: { show: ["rule_1", "rule_2"], range: [1, 2] },
        visualCues: [{ target: "rule_1", anchor: { en: "Rule 1", hi: "नियम 1" } }]
      },
      {
        id: "s11b3",
        visual: { show: ["rule_3", "rule_4"], range: [3, 4] },
        visualCues: [{ target: "rule_3", anchor: { en: "Rule 3", hi: "नियम 3" } }]
      },
      {
        id: "s11b4",
        visual: { show: ["rule_5", "rule_6"], range: [5, 6] },
        visualCues: [{ target: "rule_5", anchor: { en: "Rule 5", hi: "नियम 5" } }]
      },
      {
        id: "s11b5",
        visual: { show: ["rule_7", "rule_8"], range: [7, 8] },
        visualCues: [{ target: "rule_7", anchor: { en: "Rule 7", hi: "नियम 7" } }]
      },
      {
        id: "s11b6",
        visual: { show: ["rule_1", "rule_2", "rule_3", "rule_4", "rule_5", "rule_6", "rule_7", "rule_8"], range: [1, 8], compact: true },
        visualCues: [{ target: "rule_8", anchor: { en: "Rule 8", hi: "नियम 8" } }]
      }
    ]
  }
];

const output = { scenes };

fs.writeFileSync('workspace/.tasks/ch04-p1-episode_fill-fce465c7/output.json', JSON.stringify(output, null, 2));
console.log('S9 output written to output.json');
