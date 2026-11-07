import fs from 'fs';
import path from 'path';

const summarySteps = [
  "1. Asset Classification: Investment assets allow two-way arbitrage; consumption assets only define upper bounds.",
  "2. Short Selling Rules: Short sellers must remit all dividends to lenders and provide collateral margin.",
  "3. Spot-Forward Parity: F_0 = S_0 · e^(rT) represents the cost of financing spot storage until maturity.",
  "4. Cash-and-Carry Bounds: Divergence from parity triggers instant riskless borrowing and spot replication.",
  "5. Known Cash Income: Interim cash payments reduce forward prices: F_0 = (S_0 - I) · e^(rT).",
  "6. Continuous Dividend Yield: Continuous dividends offset financing costs: F_0 = S_0 · e^((r - q)T).",
  "7. Kidder Peabody Disaster: Software failure to discount forward STRIPs created $350M in phantom profits.",
  "8. Repo Special Squeezes: High short interest drives repo rates negative and triggers violent forced buy-ins."
];

const episode = {
  schemaVersion: "1.0.0",
  meta: {
    course: "hull_derivatives",
    chapter: "CHAPTER 5 · PART 1",
    chapterTitle: "Determination of Forward and Futures Prices: Part 1",
    domain: "finance",
    primaryColor: "#0F766E",
    accentColor: "#F59E0B",
    narrationLanguage: "hi-IN-devanagari"
  },
  scenes: [
    // Scene 0: The Forward Price Puzzle (chat_story)
    {
      segmentIndex: 0,
      title: "The Forward Price Puzzle",
      template: "chat_story",
      badge: "Derivative Trading Desk",
      beats: [
        {
          id: "b01",
          hindi_tts: "शर्मा जी! सोने का एक साल का फॉरवर्ड भाव स्पॉट से महंगा बिक रहा है। क्या इसका मतलब सोना बढ़ना तय है?",
          en_subtitle: "Sharma ji, gold 1-year forward trades above spot. Does this guarantee prices will rise?",
          en_narration: "Sharma ji, the one-year gold forward trades above spot. Does this guarantee gold prices will rise?",
          pauseAfterMs: 400,
          ui_state: {
            stageDirections: ["— Raju examines gold forward prices —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! Gold 1-year forward is higher than spot. Does this mean the market predicts a rally?",
                theme: "amber",
                align: "left"
              }
            ]
          },
          visual: {
            kind: "conversation",
            data: {
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "Sharma ji! Gold 1-year forward is higher than spot. Does this mean the market predicts a rally?",
                  theme: "amber",
                  align: "left"
                }
              ]
            },
            semantics: {
              teachingObjective: "Present retail misconception that forward prices forecast future spot prices",
              sourceFactIds: ["fact-01", "fact-03"]
            }
          }
        },
        {
          id: "b02",
          hindi_tts: "बिल्कुल नहीं राजू! फॉरवर्ड प्राइस कोई भविष्यवाणी नहीं, बल्कि सोने को आज खरीदकर एक साल रखने का ब्याज खर्च है।",
          en_subtitle: "Not at all, Raju! Forward price reflects carrying cost, not a price forecast.",
          en_narration: "Not at all Raju! The forward price is not a price forecast, but the financing cost of carrying inventory.",
          pauseAfterMs: 400,
          ui_state: {
            stageDirections: ["— Sharma ji reveals cost of carry principle —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! Gold 1-year forward is higher than spot. Does this mean the market predicts a rally?",
                theme: "amber",
                align: "left"
              },
              {
                sender: "Sharma ji",
                avatar: "S",
                text: "Not at all Raju! Forward prices reflect financing cost, not market direction forecasts. It's pure cost of carry.",
                theme: "teal",
                align: "right"
              }
            ]
          },
          visual: {
            kind: "conversation",
            data: {
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "Sharma ji! Gold 1-year forward is higher than spot. Does this mean the market predicts a rally?",
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "Not at all Raju! Forward prices reflect financing cost, not market direction forecasts. It's pure cost of carry.",
                  theme: "teal",
                  align: "right"
                }
              ]
            },
            semantics: {
              teachingObjective: "Introduce cost of carry principle and debunk forecasting fallacy",
              sourceFactIds: ["fact-03"]
            }
          }
        },
        {
          id: "b03",
          hindi_tts: "अगर फॉरवर्ड भाव ब्याज खर्च से अलग हुआ, तो आर्बिट्राजर्स बिना रिस्क लिए तुरंत मुफ्त का मुनाफा कमा लेंगे!",
          en_subtitle: "If forward price departs from carry cost, arbitrageurs harvest riskless profits.",
          en_narration: "If forward price deviates from carry cost, arbitrageurs instantly lock riskless profits.",
          pauseAfterMs: 500,
          ui_state: {
            stageDirections: ["— Raju discovers no-arbitrage bounds —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! Gold 1-year forward is higher than spot. Does this mean the market predicts a rally?",
                theme: "amber",
                align: "left"
              },
              {
                sender: "Sharma ji",
                avatar: "S",
                text: "Not at all Raju! Forward prices reflect financing cost, not market direction forecasts. It's pure cost of carry.",
                theme: "teal",
                align: "right"
              },
              {
                sender: "Raju",
                avatar: "R",
                text: "So arbitrage locks the price mathematically, regardless of bullish or bearish sentiment?",
                theme: "amber",
                align: "left"
              }
            ]
          },
          visual: {
            kind: "conversation",
            data: {
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "Sharma ji! Gold 1-year forward is higher than spot. Does this mean the market predicts a rally?",
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "Not at all Raju! Forward prices reflect financing cost, not market direction forecasts. It's pure cost of carry.",
                  theme: "teal",
                  align: "right"
                },
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "So arbitrage locks the price mathematically, regardless of bullish or bearish sentiment?",
                  theme: "amber",
                  align: "left"
                }
              ]
            },
            semantics: {
              teachingObjective: "Establish no-arbitrage pricing independence from market expectations",
              sourceFactIds: ["fact-03", "fact-04"]
            }
          }
        }
      ]
    },

    // Scene 1: Investment vs Consumption Assets (tug_of_war)
    {
      segmentIndex: 1,
      title: "Investment vs Consumption Assets",
      template: "tug_of_war",
      badge: "Asset Classification",
      beats: [
        {
          id: "b04",
          hindi_tts: "इन्वेस्टमेंट एसेट्स जैसे सोना, शेयर और बॉन्ड्स केवल निवेश के लिए रखे जाते हैं।",
          en_subtitle: "Investment assets like gold, stocks, and bonds are held purely for financial gain.",
          en_narration: "Investment assets like gold, stocks, and bonds are held strictly for financial gain.",
          pauseAfterMs: 400,
          ui_state: {
            leftLabel: "Investment Assets",
            rightLabel: "Consumption Assets",
            leftValue: "F_0 = S_0 e^{rT}",
            rightValue: "F_0 \\le S_0 e^{(r+u)T}",
            tensionRatio: 0.7,
            centerMessage: "Can market participants freely short the physical commodity?",
            leftDetails: [
              "Held exclusively for financial wealth accumulation",
              "Stocks, sovereign bonds, gold, and silver",
              "Two-way cash-and-carry arbitrage enforces exact parity"
            ],
            rightDetails: [
              "Held primarily for consumption or industrial processing",
              "Crude oil, copper, agricultural grains, livestock",
              "Shorting physical inventory is restricted; one-way upper bound"
            ]
          },
          visual: {
            kind: "diagram",
            data: {
              tensionRatio: 0.7,
              focusSide: "left",
              leftLabel: "Investment Assets",
              rightLabel: "Consumption Assets"
            },
            semantics: {
              teachingObjective: "Define investment assets and two-way arbitrage pricing condition",
              sourceFactIds: ["fact-01"]
            }
          }
        },
        {
          id: "b05",
          hindi_tts: "लेकिन कच्चा तेल या तांबा जैसी कंजम्पशन एसेट्स फैक्ट्रियों में इस्तेमाल के लिए खरीदी जाती हैं।",
          en_subtitle: "In contrast, consumption assets like crude oil and copper are held for industrial consumption.",
          en_narration: "In contrast, consumption assets like crude oil and copper are held for manufacturing consumption.",
          pauseAfterMs: 400,
          ui_state: {
            leftLabel: "Investment Assets",
            rightLabel: "Consumption Assets",
            leftValue: "F_0 = S_0 e^{rT}",
            rightValue: "F_0 \\le S_0 e^{(r+u)T}",
            tensionRatio: 0.3,
            centerMessage: "Physical shorting constraints break reverse cash-and-carry",
            leftDetails: [
              "Held exclusively for financial wealth accumulation",
              "Stocks, sovereign bonds, gold, and silver",
              "Two-way cash-and-carry arbitrage enforces exact parity"
            ],
            rightDetails: [
              "Held primarily for consumption or industrial processing",
              "Crude oil, copper, agricultural grains, livestock",
              "Shorting physical inventory is restricted; one-way upper bound"
            ]
          },
          visual: {
            kind: "diagram",
            data: {
              tensionRatio: 0.3,
              focusSide: "right",
              leftLabel: "Investment Assets",
              rightLabel: "Consumption Assets"
            },
            semantics: {
              teachingObjective: "Explain consumption asset utility and physical short sale barriers",
              sourceFactIds: ["fact-01"]
            }
          }
        },
        {
          id: "b06",
          hindi_tts: "इन्वेस्टमेंट एसेट्स में दोनों तरफ से आर्बिट्राज होता है, जबकि कंजम्पशन में सिर्फ ऊपरी सीमा तय होती है।",
          en_subtitle: "Investment assets obey strict parity; consumption assets only define an upper bound.",
          en_narration: "Investment assets obey exact equalities, while consumption assets only establish upper bounds.",
          pauseAfterMs: 500,
          ui_state: {
            leftLabel: "Investment Assets",
            rightLabel: "Consumption Assets",
            leftValue: "Exact Parity Equality",
            rightValue: "Upper Bound Limit Only",
            tensionRatio: 0.5,
            centerMessage: "Asset classification determines arbitrage enforceability",
            leftDetails: [
              "Exact equality: F_0 = S_0 · e^(rT)",
              "Arbitrageurs short spot and buy forward freely"
            ],
            rightDetails: [
              "Inequality: F_0 <= S_0 · e^((r + u)T)",
              "Reflects convenience yield of physical inventory"
            ]
          },
          visual: {
            kind: "diagram",
            data: {
              tensionRatio: 0.5,
              focusSide: "center",
              leftLabel: "Investment Assets",
              rightLabel: "Consumption Assets"
            },
            semantics: {
              teachingObjective: "Contrast exact parity equality with consumption upper bound",
              sourceFactIds: ["fact-01"]
            }
          }
        }
      ]
    },

    // Scene 2: No-Income Forward Price Formula (formula_breakdown)
    {
      segmentIndex: 2,
      title: "No-Income Forward Price Formula",
      template: "formula_breakdown",
      badge: "Spot-Forward Parity",
      beats: [
        {
          id: "b07",
          hindi_tts: "अगर किसी इन्वेस्टमेंट एसेट पर कोई डिविडेंड या इनकम नहीं मिलती, तो उसका फॉरवर्ड प्राइस सीधे स्पॉट पर ब्याज जोड़कर निकाला जाता है।",
          en_subtitle: "For no-income investment assets, forward price equals spot compounded at risk-free rate.",
          en_narration: "For no-income investment assets, the forward price equals spot price compounded at the risk-free rate.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Forward Price Formula (No Income)",
            expression: "F_0 = S_0 e^{rT}",
            variables: [
              { symbol: "F_0", label: "Forward Price", description: "Theoretical forward contract price today", unit: "$" },
              { symbol: "S_0", label: "Spot Price", description: "Current market spot price of underlying asset", unit: "$" },
              { symbol: "r", label: "Risk-Free Rate", description: "Continuously compounded risk-free rate", unit: "%" },
              { symbol: "T", label: "Maturity", description: "Time to contract delivery in years", unit: "years" }
            ],
            steps: [
              { stepIndex: 0, label: "Financing Equivalence", equation: "F_0 = S_0 e^{rT}", note: "Forward price exactly offsets spot purchase plus debt interest" }
            ],
            assumptions: ["Zero transaction costs, unrestricted short sales, and flat risk-free borrowing rate."],
            interpretation: "Forward price is the break-even level equating delayed purchase with immediate debt-financed purchase."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Forward Price Formula (No Income)",
              expression: "F_0 = S_0 e^{rT}",
              variables: [
                { symbol: "F_0", label: "Forward Price", description: "Theoretical forward contract price today", unit: "$" },
                { symbol: "S_0", label: "Spot Price", description: "Current market spot price of underlying asset", unit: "$" },
                { symbol: "r", label: "Risk-Free Rate", description: "Continuously compounded risk-free rate", unit: "%" },
                { symbol: "T", label: "Maturity", description: "Time to contract delivery in years", unit: "years" }
              ],
              steps: [
                { stepIndex: 0, label: "Financing Equivalence", equation: "F_0 = S_0 e^{rT}", note: "Forward price exactly offsets spot purchase plus debt interest" }
              ],
              assumptions: ["Zero transaction costs, unrestricted short sales, and flat risk-free borrowing rate."],
              interpretation: "Forward price is the break-even level equating delayed purchase with immediate debt-financed purchase."
            },
            semantics: {
              teachingObjective: "Present fundamental no-income forward pricing equation F_0 = S_0 * e^(rT)",
              sourceFactIds: ["fact-03"]
            }
          }
        },
        {
          id: "b08",
          hindi_tts: "फार्मूला है: F-जीरो बराबर S-जीरो गुणा e की पावर r गुणा T।",
          en_subtitle: "The mathematical formula is: F_0 = S_0 * e^(r*T).",
          en_narration: "The mathematical formula is: F zero equals S zero times e to the power r times T.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Forward Price Formula (No Income)",
            expression: "F_0 = S_0 e^{rT}",
            variables: [
              { symbol: "F_0", label: "Forward Price", description: "Theoretical forward contract price today", unit: "$" },
              { symbol: "S_0", label: "Spot Price", description: "Current market spot price of underlying asset", unit: "$" },
              { symbol: "r", label: "Risk-Free Rate", description: "Continuously compounded risk-free rate", unit: "%" },
              { symbol: "T", label: "Maturity", description: "Time to contract delivery in years", unit: "years" }
            ],
            steps: [
              { stepIndex: 0, label: "Financing Equivalence", equation: "F_0 = S_0 e^{rT}", note: "Cost of debt-financed spot carry" },
              { stepIndex: 1, label: "Continuous Growth Factor", equation: "e^{rT} = 1 + rT + \\frac{(rT)^2}{2!} + \\dots", note: "Continuous compounding exponential multiplier" }
            ],
            assumptions: ["Zero transaction costs, unrestricted short sales, and flat risk-free borrowing rate."],
            interpretation: "Compounding growth reflects pure financing charges over the life of the trade."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Forward Price Formula (No Income)",
              expression: "F_0 = S_0 e^{rT}",
              variables: [
                { symbol: "F_0", label: "Forward Price", description: "Theoretical forward contract price today", unit: "$" },
                { symbol: "S_0", label: "Spot Price", description: "Current market spot price of underlying asset", unit: "$" },
                { symbol: "r", label: "Risk-Free Rate", description: "Continuously compounded risk-free rate", unit: "%" },
                { symbol: "T", label: "Maturity", description: "Time to contract delivery in years", unit: "years" }
              ],
              steps: [
                { stepIndex: 0, label: "Financing Equivalence", equation: "F_0 = S_0 e^{rT}", note: "Cost of debt-financed spot carry" },
                { stepIndex: 1, label: "Continuous Growth Factor", equation: "e^{rT} = 1 + rT + \\frac{(rT)^2}{2!} + \\dots", note: "Continuous compounding exponential multiplier" }
              ],
              assumptions: ["Zero transaction costs, unrestricted short sales, and flat risk-free borrowing rate."],
              interpretation: "Compounding growth reflects pure financing charges over the life of the trade."
            },
            semantics: {
              teachingObjective: "Break down continuous compounding exponential factor in forward pricing",
              sourceFactIds: ["fact-03"]
            }
          }
        },
        {
          id: "b09",
          hindi_tts: "अगर 50 डॉलर का शेयर 6% ब्याज दर पर 6 महीने के लिए लिया जाए, तो फॉरवर्ड भाव ठीक 51.52 डॉलर होगा।",
          en_subtitle: "A $50 stock at 6% interest for 6 months yields a forward price of $51.52.",
          en_narration: "A fifty dollar stock at six percent interest for six months yields a forward price of fifty-one point fifty-two.",
          pauseAfterMs: 500,
          ui_state: {
            title: "Forward Price Formula (No Income)",
            expression: "F_0 = S_0 e^{rT}",
            variables: [
              { symbol: "S_0 = \\$50", label: "Spot Price", description: "Current stock price", unit: "$" },
              { symbol: "r = 6\\%", label: "Risk-Free Rate", description: "Continuous annual rate", unit: "%" },
              { symbol: "T = 0.5\\text{y}", label: "Maturity", description: "6-month contract length", unit: "years" },
              { symbol: "F_0 = \\$51.52", label: "Fair Forward", description: "Theoretical no-arbitrage price", unit: "$" }
            ],
            steps: [
              { stepIndex: 0, label: "Substitute Hull Example Values", equation: "F_0 = 50 \\times e^{0.06 \\times 0.5} = 50 \\times e^{0.03}", note: "Compute exponent r * T = 0.03" },
              { stepIndex: 1, label: "Evaluate Compounding Multiplier", equation: "e^{0.03} \\approx 1.0304545", note: "Continuous growth over half year" },
              { stepIndex: 2, label: "Calculate Final Forward Price", equation: "F_0 = 50 \\times 1.0304545 = \\$51.52", note: "Spot compounded forward with zero arbitrage" }
            ],
            assumptions: ["Stock pays no dividends during the 6-month period."],
            interpretation: "Holding the forward contract is economically identical to borrowing $50 to buy the stock today."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Forward Price Formula (No Income)",
              expression: "F_0 = S_0 e^{rT}",
              variables: [
                { symbol: "S_0 = \\$50", label: "Spot Price", description: "Current stock price", unit: "$" },
                { symbol: "r = 6\\%", label: "Risk-Free Rate", description: "Continuous annual rate", unit: "%" },
                { symbol: "T = 0.5\\text{y}", label: "Maturity", description: "6-month contract length", unit: "years" },
                { symbol: "F_0 = \\$51.52", label: "Fair Forward", description: "Theoretical no-arbitrage price", unit: "$" }
              ],
              steps: [
                { stepIndex: 0, label: "Substitute Hull Example Values", equation: "F_0 = 50 \\times e^{0.06 \\times 0.5} = 50 \\times e^{0.03}", note: "Compute exponent r * T = 0.03" },
                { stepIndex: 1, label: "Evaluate Compounding Multiplier", equation: "e^{0.03} \\approx 1.0304545", note: "Continuous growth over half year" },
                { stepIndex: 2, label: "Calculate Final Forward Price", equation: "F_0 = 50 \\times 1.0304545 = \\$51.52", note: "Spot compounded forward with zero arbitrage" }
              ],
              assumptions: ["Stock pays no dividends during the 6-month period."],
              interpretation: "Holding the forward contract is economically identical to borrowing $50 to buy the stock today."
            },
            semantics: {
              teachingObjective: "Execute worked numerical example calculating $51.52 forward stock price",
              sourceFactIds: ["fact-03"]
            }
          }
        }
      ]
    },

    // Scene 3: Cash-and-Carry vs Reverse Cash-and-Carry (split_comparison)
    {
      segmentIndex: 3,
      title: "Cash-and-Carry vs Reverse Cash-and-Carry",
      template: "split_comparison",
      badge: "Arbitrage Enforcement",
      beats: [
        {
          id: "b10",
          hindi_tts: "अगर बाजार में फॉरवर्ड का भाव 51.52 डॉलर से ज्यादा हो, तो कैश-एंड-कैरी आर्बिट्राज शुरू हो जाता है।",
          en_subtitle: "If market forward exceeds $51.52, cash-and-carry arbitrage locks guaranteed profit.",
          en_narration: "If market forward price exceeds fifty-one point fifty-two, cash-and-carry locks guaranteed profits.",
          pauseAfterMs: 400,
          ui_state: {
            leftTitle: "Cash-and-Carry (F_0 > Fair)",
            rightTitle: "Reverse Cash-and-Carry (F_0 < Fair)",
            leftBadge: "Overpriced Forward",
            rightBadge: "Underpriced Forward",
            leftSubtitle: "Market F_0 = $53.00 (> $51.52)",
            rightSubtitle: "Market F_0 = $50.00 (< $51.52)",
            comparisonPoints: [
              "Time 0: Borrow $50 at 6% for 6 months",
              "Time 0: Buy spot stock for $50 cash",
              "Time 0: Short forward contract at market $53.00",
              "Time 0 Net Cash Outlay: Exactly $0.00",
              "At Maturity (T = 0.5): Deliver stock into forward, collect $53.00",
              "At Maturity: Repay loan with interest: $50 * e^(0.03) = $51.52",
              "Locked Riskless Profit: $53.00 - $51.52 = $1.48 per share"
            ],
            winnerBanner: "Arbitrage Selling Forces Market Forward Back Down to $51.52"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "Cash-and-Carry (F_0 > Fair)",
              rightTitle: "Reverse Cash-and-Carry (F_0 < Fair)",
              comparisonPoints: [
                "Borrow $50, buy spot, short forward at $53.00",
                "Zero initial capital outlay required",
                "Locks guaranteed riskless profit: $1.48 per share"
              ]
            },
            semantics: {
              teachingObjective: "Present cash-and-carry arbitrage mechanics when forward is overpriced",
              sourceFactIds: ["fact-04"]
            }
          }
        },
        {
          id: "b11",
          hindi_tts: "आर्बिट्राजर 50 डॉलर उधार लेता है, शेयर खरीदता है, और फॉरवर्ड को महंगे में बेचकर 1.48 डॉलर का रिस्क-फ्री मुनाफा पक्का कर लेता है।",
          en_subtitle: "Arbitrageurs borrow $50, buy spot, and sell forward, locking $1.48 risk-free profit.",
          en_narration: "Arbitrageurs borrow fifty dollars, buy spot, and sell forward, locking one point forty-eight risk-free profit.",
          pauseAfterMs: 400,
          ui_state: {
            leftTitle: "Cash-and-Carry (F_0 > Fair)",
            rightTitle: "Reverse Cash-and-Carry (F_0 < Fair)",
            leftBadge: "Overpriced Forward",
            rightBadge: "Underpriced Forward",
            leftSubtitle: "Market F_0 = $53.00 (> $51.52)",
            rightSubtitle: "Market F_0 = $50.00 (< $51.52)",
            comparisonPoints: [
              "Time 0: Short 1 share of spot stock, receiving $50 cash",
              "Time 0: Invest $50 proceeds at 6% risk-free for 6 months",
              "Time 0: Buy forward contract at market $50.00",
              "At Maturity (T = 0.5): Receive investment proceeds: $50 * e^(0.03) = $51.52",
              "At Maturity: Pay $50.00 to take delivery of stock under forward",
              "At Maturity: Return stock to original lender to close short",
              "Locked Riskless Profit: $51.52 - $50.00 = $1.52 per share"
            ],
            winnerBanner: "Arbitrage Buying Forces Market Forward Back Up to $51.52"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "Cash-and-Carry",
              rightTitle: "Reverse Cash-and-Carry",
              comparisonPoints: [
                "Short spot, invest proceeds at 6%, buy forward at $50",
                "Receive $51.52 investment, pay $50.00 for stock",
                "Locks guaranteed riskless profit: $1.52 per share"
              ]
            },
            semantics: {
              teachingObjective: "Explain reverse cash-and-carry arbitrage mechanics when forward is underpriced",
              sourceFactIds: ["fact-04"]
            }
          }
        },
        {
          id: "b12",
          hindi_tts: "और अगर फॉरवर्ड सस्ता हुआ, तो शेयर शॉर्ट कर के और फॉरवर्ड खरीदकर मुनाफा कमाया जाता है। इसे आर्बिट्राज कहते हैं!",
          en_subtitle: "If forward is underpriced, short spot and buy forward to extract guaranteed profits.",
          en_narration: "And if forward is underpriced, short spot and buy forward to extract guaranteed profits.",
          pauseAfterMs: 500,
          ui_state: {
            leftTitle: "Arbitrage Equilibrium",
            rightTitle: "No-Arbitrage Invariant",
            leftBadge: "Market Self-Correction",
            rightBadge: "Theoretical Price",
            leftSubtitle: "F_0 > $51.52 -> Selling Pressure",
            rightSubtitle: "F_0 < $51.52 -> Buying Pressure",
            comparisonPoints: [
              "Two-way arbitrage creates an inescapable pricing cage",
              "Any deviation from $51.52 is instantly eliminated by Wall Street algorithms",
              "Zero capital and zero risk required to extract deviations",
              "Guarantees that market forward prices equal F_0 = S_0 * e^(rT)"
            ],
            winnerBanner: "No-Arbitrage Condition Closes the Spot-Forward Spread"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "Selling Pressure",
              rightTitle: "Buying Pressure",
              comparisonPoints: [
                "High forward triggers cash-and-carry selling",
                "Low forward triggers reverse cash-and-carry buying",
                "Forces market equilibrium precisely at F_0 = S_0 * e^(rT)"
              ]
            },
            semantics: {
              teachingObjective: "Show how two-way arbitrage locks the forward price at theoretical parity",
              sourceFactIds: ["fact-04"]
            }
          }
        }
      ]
    },

    // Scene 4: Short Selling Mechanics & Repo Specials (progressive_cards)
    {
      segmentIndex: 4,
      title: "Short Selling Mechanics & Repo Specials",
      template: "progressive_cards",
      badge: "Securities Lending Market",
      beats: [
        {
          id: "b13",
          hindi_tts: "रिवर्स कैश-एंड-कैरी के लिए शेयर शॉर्ट करना पड़ता है, जिसके अपने सख्त कानूनी और वित्तीय नियम होते हैं।",
          en_subtitle: "Executing reverse cash-and-carry requires short selling, which carries strict market rules.",
          en_narration: "Executing reverse cash-and-carry requires short selling, which is governed by strict market rules.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Security Borrowing",
                subtitle: "Prime Brokerage Lending Desks",
                value: "Institutional Borrow",
                badge: "Locate Required",
                state: "active_teal",
                bulletPoints: [
                  "Trader borrows shares from existing long holders (e.g., pension funds)",
                  "Short seller sells borrowed shares in the open market for cash",
                  "Must return identical shares to lender upon position termination"
                ]
              },
              {
                title: "2. Manufactured Dividends",
                subtitle: "Lender Must Be Kept Whole",
                value: "Dividend Remittance",
                badge: "Cash Liability",
                state: "muted",
                bulletPoints: [
                  "Lender is entitled to all dividends and coupon payments",
                  "Short seller must pay manufactured dividends out of pocket",
                  "Short sellers lose money on corporate distribution dates"
                ]
              },
              {
                title: "3. Repo 'On Special'",
                subtitle: "Scarce Collateral Financing",
                value: "Negative Repo Rates",
                badge: "Borrowing Premium",
                state: "muted",
                bulletPoints: [
                  "High short demand creates acute borrow scarcity in Treasury repo",
                  "Repo rates fall far below general collateral rates (trade 'on special')",
                  "Short sellers must pay significant daily fees to maintain borrow"
                ]
              },
              {
                title: "4. The Short Squeeze Trap",
                subtitle: "Forced Buy-In Cascades",
                value: "Liquidity Evaporation",
                badge: "Snapshot 5.2",
                state: "muted",
                bulletPoints: [
                  "Lenders can recall borrowed securities at any time",
                  "If borrow dries up, broker executes mandatory open-market buy-in",
                  "Cascading buy orders trigger violent upward price spikes"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 0,
              cardCount: 4,
              focusTopic: "1. Security Borrowing"
            },
            semantics: {
              teachingObjective: "Present institutional security borrowing process and short sales",
              sourceFactIds: ["fact-02"]
            }
          }
        },
        {
          id: "b14",
          hindi_tts: "शॉर्ट सेलर को शेयर के सारे डिविडेंड्स और कूपन्स असली मालिक को अपनी जेब से चुकाने पड़ते हैं।",
          en_subtitle: "Short sellers must pay all manufactured dividends and coupons to the lender.",
          en_narration: "Short sellers must pay all manufactured dividends and coupons to the lender out of pocket.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Security Borrowing",
                subtitle: "Prime Brokerage Lending Desks",
                value: "Institutional Borrow",
                badge: "Locate Required",
                state: "muted",
                bulletPoints: [
                  "Trader borrows shares from existing long holders",
                  "Sells borrowed shares in open market for cash"
                ]
              },
              {
                title: "2. Manufactured Dividends",
                subtitle: "Lender Must Be Kept Whole",
                value: "Dividend Remittance",
                badge: "Cash Liability",
                state: "active_teal",
                bulletPoints: [
                  "Lender is entitled to all corporate dividend distributions",
                  "Short seller must remit manufactured dividends out of pocket",
                  "Holding short over dividend record date triggers automatic cash debit"
                ]
              },
              {
                title: "3. Repo 'On Special'",
                subtitle: "Scarce Collateral Financing",
                value: "Negative Repo Rates",
                badge: "Borrowing Premium",
                state: "muted",
                bulletPoints: [
                  "High short demand creates acute borrow scarcity in Treasury repo",
                  "Repo rates fall far below general collateral rates (trade 'on special')",
                  "Short sellers must pay significant daily fees to maintain borrow"
                ]
              },
              {
                title: "4. The Short Squeeze Trap",
                subtitle: "Forced Buy-In Cascades",
                value: "Liquidity Evaporation",
                badge: "Snapshot 5.2",
                state: "muted",
                bulletPoints: [
                  "Lenders can recall borrowed securities at any time",
                  "If borrow dries up, broker executes mandatory open-market buy-in",
                  "Cascading buy orders trigger violent upward price spikes"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 1,
              cardCount: 4,
              focusTopic: "2. Manufactured Dividends"
            },
            semantics: {
              teachingObjective: "Explain manufactured dividend liability for short sellers",
              sourceFactIds: ["fact-02"]
            }
          }
        },
        {
          id: "b15",
          hindi_tts: "जब किसी बॉन्ड में भारी शॉर्ट सेलिंग होती है, तो रेपो रेट गिरकर नेगेटिव हो जाता है, जिसे 'ऑन स्पेशल' कहते हैं।",
          en_subtitle: "Heavy short demand pushes repo rates negative, trading 'on special'.",
          en_narration: "When heavy short selling hits a bond, its repo rate turns negative, trading on special.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Security Borrowing",
                subtitle: "Prime Brokerage Lending Desks",
                value: "Institutional Borrow",
                badge: "Locate Required",
                state: "muted",
                bulletPoints: [
                  "Trader borrows shares from existing long holders"
                ]
              },
              {
                title: "2. Manufactured Dividends",
                subtitle: "Lender Must Be Kept Whole",
                value: "Dividend Remittance",
                badge: "Cash Liability",
                state: "muted",
                bulletPoints: [
                  "Short seller must remit dividends out of pocket"
                ]
              },
              {
                title: "3. Repo 'On Special'",
                subtitle: "Scarce Collateral Financing",
                value: "Negative Repo Rates",
                badge: "Borrowing Premium",
                state: "active_amber",
                bulletPoints: [
                  "Cash lenders accept zero or negative interest to borrow the specific bond",
                  "The bond holder effectively earns high interest by lending the scarce security",
                  "Short sellers pay large borrow fees, increasing the cost of carry"
                ]
              },
              {
                title: "4. The Short Squeeze Trap",
                subtitle: "Forced Buy-In Cascades",
                value: "Liquidity Evaporation",
                badge: "Snapshot 5.2",
                state: "muted",
                bulletPoints: [
                  "Lenders can recall borrowed securities at any time",
                  "If borrow dries up, broker executes mandatory open-market buy-in",
                  "Cascading buy orders trigger violent upward price spikes"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 2,
              cardCount: 4,
              focusTopic: "3. Repo 'On Special'"
            },
            semantics: {
              teachingObjective: "Analyze repo on special phenomenon and negative lending rates",
              sourceFactIds: ["fact-08"]
            }
          }
        },
        {
          id: "b16",
          hindi_tts: "अगर लेंडर अपना शेयर वापस मांग ले, तो शॉर्ट सेलर को तुरंत मार्केट से शेयर खरीदना पड़ता है, जिससे शॉर्ट स्क्वीज बनता है! ",
          en_subtitle: "Lender recalls force immediate market buy-ins, sparking violent short squeezes.",
          en_narration: "If lenders recall borrowed shares, short sellers face forced market buy-ins, sparking short squeezes.",
          pauseAfterMs: 500,
          ui_state: {
            cards: [
              {
                title: "1. Security Borrowing",
                subtitle: "Prime Brokerage Lending Desks",
                value: "Institutional Borrow",
                badge: "Locate Required",
                state: "muted",
                bulletPoints: [
                  "Trader borrows shares"
                ]
              },
              {
                title: "2. Manufactured Dividends",
                subtitle: "Lender Must Be Kept Whole",
                value: "Dividend Remittance",
                badge: "Cash Liability",
                state: "muted",
                bulletPoints: [
                  "Remit dividends to lender"
                ]
              },
              {
                title: "3. Repo 'On Special'",
                subtitle: "Scarce Collateral Financing",
                value: "Negative Repo Rates",
                badge: "Borrowing Premium",
                state: "muted",
                bulletPoints: [
                  "Repo trades on special"
                ]
              },
              {
                title: "4. The Short Squeeze Trap",
                subtitle: "Forced Buy-In Cascades",
                value: "Liquidity Evaporation",
                badge: "Snapshot 5.2",
                state: "active_amber",
                bulletPoints: [
                  "Lenders exercise recall rights during market volatility",
                  "Short sellers cannot find replacement borrow in the market",
                  "Mandatory broker liquidation creates explosive upward price spikes (Snapshot 5.2)"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 3,
              cardCount: 4,
              focusTopic: "4. The Short Squeeze Trap"
            },
            semantics: {
              teachingObjective: "Examine short squeeze mechanics and forced buy-in dynamics",
              sourceFactIds: ["fact-08"]
            }
          }
        }
      ]
    },

    // Scene 5: Forward Price with Known Cash Income (formula_breakdown)
    {
      segmentIndex: 5,
      title: "Forward Price with Known Income",
      template: "formula_breakdown",
      badge: "Dividend Adjustment",
      beats: [
        {
          id: "b17",
          hindi_tts: "जब कोई एसेट बीच में पक्का कैश डिविडेंड या कूपन देता है, तो फॉरवर्ड भाव बढ़ नहीं, बल्कि घट जाता है!",
          en_subtitle: "When an asset pays known cash dividends, its fair forward price decreases.",
          en_narration: "When an asset pays known cash dividends, its fair forward price actually decreases.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Forward Price with Known Cash Income",
            expression: "F_0 = (S_0 - I) e^{rT}",
            variables: [
              { symbol: "F_0", label: "Forward Price", description: "Theoretical forward contract price", unit: "$" },
              { symbol: "S_0", label: "Spot Price", description: "Current market spot price of asset", unit: "$" },
              { symbol: "I", label: "PV of Income", description: "Present value of all dividends during contract term", unit: "$" },
              { symbol: "r", label: "Risk-Free Rate", description: "Continuous annual risk-free rate", unit: "%" },
              { symbol: "T", label: "Maturity", description: "Contract time to maturity in years", unit: "years" }
            ],
            steps: [
              { stepIndex: 0, label: "Discount Interim Cash Flow", equation: "I = \\sum D_i e^{-r t_i}", note: "Present value of all dividends paid prior to maturity T" }
            ],
            assumptions: ["Dividends and coupon amounts and payment dates are known with certainty."],
            interpretation: "Dividends belong to spot holders; forward buyers are not entitled to interim cash."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Forward Price with Known Cash Income",
              expression: "F_0 = (S_0 - I) e^{rT}",
              variables: [
                { symbol: "F_0", label: "Forward Price", description: "Theoretical forward contract price", unit: "$" },
                { symbol: "S_0", label: "Spot Price", description: "Current market spot price of asset", unit: "$" },
                { symbol: "I", label: "PV of Income", description: "Present value of all dividends during contract term", unit: "$" },
                { symbol: "r", label: "Risk-Free Rate", description: "Continuous annual risk-free rate", unit: "%" },
                { symbol: "T", label: "Maturity", description: "Contract time to maturity in years", unit: "years" }
              ],
              steps: [
                { stepIndex: 0, label: "Discount Interim Cash Flow", equation: "I = \\sum D_i e^{-r t_i}", note: "Present value of all dividends paid prior to maturity T" }
              ],
              assumptions: ["Dividends and coupon amounts and payment dates are known with certainty."],
              interpretation: "Dividends belong to spot holders; forward buyers are not entitled to interim cash."
            },
            semantics: {
              teachingObjective: "Present forward pricing formula adjusted for discrete cash income F_0 = (S_0 - I) * e^(rT)",
              sourceFactIds: ["fact-05"]
            }
          }
        },
        {
          id: "b18",
          hindi_tts: "कारण यह है कि डिविडेंड स्पॉट शेयर रखने वाले को मिलता है, फॉरवर्ड खरीदने वाले को नहीं।",
          en_subtitle: "Because spot holders collect dividends, forward buyers must receive a price discount.",
          en_narration: "Because spot holders collect dividends, forward buyers must receive an offsetting price discount.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Forward Price with Known Cash Income",
            expression: "F_0 = (S_0 - I) e^{rT}",
            variables: [
              { symbol: "F_0", label: "Forward Price", description: "Theoretical forward contract price", unit: "$" },
              { symbol: "S_0", label: "Spot Price", description: "Current market spot price of asset", unit: "$" },
              { symbol: "I", label: "PV of Income", description: "Present value of all dividends during contract term", unit: "$" },
              { symbol: "r", label: "Risk-Free Rate", description: "Continuous annual risk-free rate", unit: "%" },
              { symbol: "T", label: "Maturity", description: "Contract time to maturity in years", unit: "years" }
            ],
            steps: [
              { stepIndex: 0, label: "Discount Interim Cash Flow", equation: "I = \\sum D_i e^{-r t_i}", note: "Present value of all dividends paid prior to maturity T" },
              { stepIndex: 1, label: "Deduct Income from Spot", equation: "S_0^* = S_0 - I", note: "Net capital required to finance spot asset" },
              { stepIndex: 2, label: "Compound Net Investment", equation: "F_0 = S_0^* e^{rT} = (S_0 - I) e^{rT}", note: "Carry only applies to un-recovered spot principal" }
            ],
            assumptions: ["Dividends and coupon amounts and payment dates are known with certainty."],
            interpretation: "Cash dividends reduce the financing required to carry the spot position."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Forward Price with Known Cash Income",
              expression: "F_0 = (S_0 - I) e^{rT}",
              variables: [
                { symbol: "F_0", label: "Forward Price", description: "Theoretical forward contract price", unit: "$" },
                { symbol: "S_0", label: "Spot Price", description: "Current market spot price of asset", unit: "$" },
                { symbol: "I", label: "PV of Income", description: "Present value of all dividends during contract term", unit: "$" },
                { symbol: "r", label: "Risk-Free Rate", description: "Continuous annual risk-free rate", unit: "%" },
                { symbol: "T", label: "Maturity", description: "Contract time to maturity in years", unit: "years" }
              ],
              steps: [
                { stepIndex: 0, label: "Discount Interim Cash Flow", equation: "I = \\sum D_i e^{-r t_i}", note: "Present value of all dividends paid prior to maturity T" },
                { stepIndex: 1, label: "Deduct Income from Spot", equation: "S_0^* = S_0 - I", note: "Net capital required to finance spot asset" },
                { stepIndex: 2, label: "Compound Net Investment", equation: "F_0 = S_0^* e^{rT} = (S_0 - I) e^{rT}", note: "Carry only applies to un-recovered spot principal" }
              ],
              assumptions: ["Dividends and coupon amounts and payment dates are known with certainty."],
              interpretation: "Cash dividends reduce the financing required to carry the spot position."
            },
            semantics: {
              teachingObjective: "Derive net capital deduction (S_0 - I) in cash income forward pricing",
              sourceFactIds: ["fact-05"]
            }
          }
        },
        {
          id: "b19",
          hindi_tts: "इसलिए फॉर्मूला बनता है: S-जीरो में से डिविडेंड की प्रेजेंट वैल्यू I घटाइए, और बचे हुए पर ब्याज लगाइए।",
          en_subtitle: "Subtract the present value of income I from spot, then compound at rate r.",
          en_narration: "Subtract the present value of income I from spot price, then compound the net capital at rate r.",
          pauseAfterMs: 500,
          ui_state: {
            title: "Forward Price with Known Cash Income",
            expression: "F_0 = (S_0 - I) e^{rT}",
            variables: [
              { symbol: "S_0 = \\$900", label: "Bond Price", description: "Current market price of coupon bond", unit: "$" },
              { symbol: "I = \\$38.80", label: "PV of Coupon", description: "Coupon of $40 in 4 months discounted at 9%", unit: "$" },
              { symbol: "r = 9\\%", label: "Risk-Free Rate", description: "Continuous annual rate", unit: "%" },
              { symbol: "T = 0.75\\text{y}", label: "Maturity", description: "9-month forward contract", unit: "years" }
            ],
            steps: [
              { stepIndex: 0, label: "Discount 4-Month Coupon", equation: "I = 40 \\times e^{-0.09 \\times (4/12)} = 40 \\times e^{-0.03} = \\$38.81", note: "Present value of interim coupon" },
              { stepIndex: 1, label: "Deduct PV of Coupon", equation: "S_0 - I = 900 - 38.81 = \\$861.19", note: "Net financed spot principal" },
              { stepIndex: 2, label: "Compound to 9 Months", equation: "F_0 = 861.19 \\times e^{0.09 \\times 0.75} = 861.19 \\times 1.0698 = \\$921.32", note: "Hull Example 5.2 forward bond price" }
            ],
            assumptions: ["A single $40 coupon is received after 4 months."],
            interpretation: "Interim coupon cash flow directly reduces fair forward price by $41.52 at maturity."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Forward Price with Known Cash Income",
              expression: "F_0 = (S_0 - I) e^{rT}",
              variables: [
                { symbol: "S_0 = \\$900", label: "Bond Price", description: "Current market price of coupon bond", unit: "$" },
                { symbol: "I = \\$38.80", label: "PV of Coupon", description: "Coupon of $40 in 4 months discounted at 9%", unit: "$" },
                { symbol: "r = 9\\%", label: "Risk-Free Rate", description: "Continuous annual rate", unit: "%" },
                { symbol: "T = 0.75\\text{y}", label: "Maturity", description: "9-month forward contract", unit: "years" }
              ],
              steps: [
                { stepIndex: 0, label: "Discount 4-Month Coupon", equation: "I = 40 \\times e^{-0.09 \\times (4/12)} = 40 \\times e^{-0.03} = \\$38.81", note: "Present value of interim coupon" },
                { stepIndex: 1, label: "Deduct PV of Coupon", equation: "S_0 - I = 900 - 38.81 = \\$861.19", note: "Net financed spot principal" },
                { stepIndex: 2, label: "Compound to 9 Months", equation: "F_0 = 861.19 \\times e^{0.09 \\times 0.75} = 861.19 \\times 1.0698 = \\$921.32", note: "Hull Example 5.2 forward bond price" }
              ],
              assumptions: ["A single $40 coupon is received after 4 months."],
              interpretation: "Interim coupon cash flow directly reduces fair forward price by $41.52 at maturity."
            },
            semantics: {
              teachingObjective: "Execute Hull Example 5.2 coupon bond forward calculation yielding $921.32",
              sourceFactIds: ["fact-05"]
            }
          }
        }
      ]
    },

    // Scene 6: Forward Price with Continuous Dividend Yield (split_comparison)
    {
      segmentIndex: 6,
      title: "Continuous Dividend Yield Dynamics",
      template: "split_comparison",
      badge: "Cost of Carry Framework",
      beats: [
        {
          id: "b20",
          hindi_tts: "स्टॉक इंडेक्स जैसे निफ्टी या S&P 500 में सैकड़ों कंपनियां लगातार डिविडेंड देती हैं, जिसे यील्ड q कहते हैं।",
          en_subtitle: "Broad stock indices pay dividends continuously, modeled as an annual dividend yield q.",
          en_narration: "Broad stock indices pay dividends continuously, modeled as an annual dividend yield q.",
          pauseAfterMs: 400,
          ui_state: {
            leftTitle: "No-Dividend Asset",
            rightTitle: "Continuous Dividend Asset",
            leftBadge: "Pure Financing Cost",
            rightBadge: "Net Cost of Carry",
            leftSubtitle: "F_0 = S_0 · e^{rT}",
            rightSubtitle: "F_0 = S_0 · e^{(r - q)T}",
            comparisonPoints: [
              "Financing cost rate: r",
              "Net Cost of Carry: c = r",
              "Forward price is ALWAYS strictly higher than spot (F_0 > S_0)",
              "Financing cost rate: r; Dividend yield offset: q",
              "Net Cost of Carry: c = r - q",
              "If q > r, forward trades at a DISCOUNT to spot (F_0 < S_0)!"
            ],
            winnerBanner: "Continuous Dividend Yield q Directly Offsets Financing Rate r"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "No-Dividend: F_0 = S_0 e^{rT}",
              rightTitle: "Dividend Yield: F_0 = S_0 e^{(r-q)T}",
              comparisonPoints: [
                "Net carry cost is reduced from r to (r - q)",
                "Dividends continuously offset debt financing interest",
                "When dividend yield q exceeds interest rate r, forward trades below spot"
              ]
            },
            semantics: {
              teachingObjective: "Formulate continuous dividend yield forward pricing F_0 = S_0 * e^((r-q)T)",
              sourceFactIds: ["fact-06"]
            }
          }
        },
        {
          id: "b21",
          hindi_tts: "डिविडेंड यील्ड ब्याज के खर्च को सीधे घटा देती है, जिससे नेट कॉस्ट ऑफ कैरी r माइनस q बन जाता है।",
          en_subtitle: "Dividend yield directly offsets financing expenses, making net cost of carry (r - q).",
          en_narration: "Dividend yield directly offsets financing expenses, making the net cost of carry r minus q.",
          pauseAfterMs: 400,
          ui_state: {
            leftTitle: "Interest Rate Dominates (r > q)",
            rightTitle: "Dividend Yield Dominates (q > r)",
            leftBadge: "Normal Contango Carry",
            rightBadge: "Forward Discount (Backwardation)",
            leftSubtitle: "Net carry (r - q) > 0",
            rightSubtitle: "Net carry (r - q) < 0",
            comparisonPoints: [
              "Holding spot costs more in interest than earned in dividends",
              "Forward price trades at a premium to spot: F_0 > S_0",
              "Standard condition for most global stock market indices",
              "Dividends earned on spot exceed the cost of borrowing cash",
              "Forward price trades at a discount to spot: F_0 < S_0",
              "Observed in high-dividend utility indices and low-rate environments"
            ],
            winnerBanner: "Cost of Carry c = r - q Dictates Forward Premium or Discount"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "r > q: Forward Premium",
              rightTitle: "q > r: Forward Discount",
              comparisonPoints: [
                "When r > q, forward price trades above spot",
                "When q > r, forward price trades below spot",
                "Generalizes to foreign currency forwards where q is foreign risk-free rate"
              ]
            },
            semantics: {
              teachingObjective: "Analyze conditions where forward price trades above or below spot",
              sourceFactIds: ["fact-06"]
            }
          }
        },
        {
          id: "b22",
          hindi_tts: "अगर डिविडेंड यील्ड ब्याज से ज्यादा हो जाए, तो फॉरवर्ड भाव स्पॉट से भी सस्ता हो जाता है! ",
          en_subtitle: "When dividend yield exceeds interest rates, forward contracts trade below spot prices.",
          en_narration: "When dividend yield exceeds the interest rate, forward contracts trade below spot prices.",
          pauseAfterMs: 500,
          ui_state: {
            leftTitle: "Universal Carry Framework",
            rightTitle: "Asset Class Application",
            leftBadge: "F_0 = S_0 · e^{cT}",
            rightBadge: "Cross-Market Unity",
            leftSubtitle: "Carry Cost c = r - q + u",
            rightSubtitle: "Equities, Currencies, & Commodities",
            comparisonPoints: [
              "Equities with continuous yield: c = r - q",
              "Currencies (Interest Rate Parity): c = r - r_f",
              "Commodities with storage cost u: c = r + u",
              "Unified formula powers all derivatives pricing engines"
            ],
            winnerBanner: "Single Unified Cost of Carry Framework Covers All Assets"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "Universal Cost of Carry",
              rightTitle: "Cross-Asset Application",
              comparisonPoints: [
                "Stocks: c = r - q",
                "Currencies: c = r - r_f",
                "Commodities: c = r + u",
                "Universal bedrock of all derivatives pricing"
              ]
            },
            semantics: {
              teachingObjective: "Unify equity, currency, and commodity pricing under generalized cost of carry",
              sourceFactIds: ["fact-06"]
            }
          }
        }
      ]
    },

    // Scene 7: Kidder Peabody's $350M Accounting Disaster (progressive_cards)
    {
      segmentIndex: 7,
      title: "Kidder Peabody's $350M Phantom Forward STRIPs",
      template: "progressive_cards",
      badge: "Accounting Glitch Disaster (Snapshot 5.1)",
      beats: [
        {
          id: "b23",
          hindi_tts: "1992 से 1994 के बीच, किडर पीबॉडी के सरकारी बॉन्ड ट्रेडर जोसेफ जेट ने एक ऐसा लूपहोल पकड़ा जिसने कंपनी डुबो दी।",
          en_subtitle: "Between 1992 and 1994, Kidder Peabody trader Joseph Jett exploited a fatal software flaw.",
          en_narration: "Between 1992 and 1994, Kidder Peabody trader Joseph Jett exploited a fatal software flaw.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. The Forward STRIPs Trade",
                subtitle: "Treasury Bond Reconstitution",
                value: "Zero-Coupon STRIPs",
                badge: "Government Desk",
                state: "active_amber",
                bulletPoints: [
                  "Trader bought zero-coupon Treasury STRIPs",
                  "Agreed to reconstitute them into coupon bonds for forward delivery",
                  "In reality, trade produced modest or zero economic profit"
                ]
              },
              {
                title: "2. The System Glitch",
                subtitle: "Undiscounted Forward Booking",
                value: "Discounting Blindspot",
                badge: "Software Flaw",
                state: "muted",
                bulletPoints: [
                  "Trading system credited future delivery price today at face value",
                  "Failed to discount future cash obligation back to present value",
                  "Every forward reconstitution booked instant phantom paper profits"
                ]
              },
              {
                title: "3. $350M Phantom Profits",
                subtitle: "Trader of the Year Illusion",
                value: "Fictitious P&L",
                badge: "Hiding $210M Loss",
                state: "muted",
                bulletPoints: [
                  "Jett generated $350M in fictitious accounting gains",
                  "Awarded 'Trader of the Year' and millions in bonuses",
                  "Concealed real trading losses of $210M on underlying positions"
                ]
              },
              {
                title: "4. GE Liquidation",
                subtitle: "130-Year-Old Wall Street Firm Collapses",
                value: "Forced Fire-Sale",
                badge: "PaineWebber Sale",
                state: "muted",
                bulletPoints: [
                  "When forward contracts matured, missing cash flows triggered panic",
                  "Parent General Electric suffered $210M write-down",
                  "Kidder Peabody was dismantled and sold off to PaineWebber"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 0,
              cardCount: 4,
              focusTopic: "1. The Forward STRIPs Trade"
            },
            semantics: {
              teachingObjective: "Present Joseph Jett's Treasury STRIPs forward reconstitution trades",
              sourceFactIds: ["fact-07"]
            }
          }
        },
        {
          id: "b24",
          hindi_tts: "ट्रेडिंग सॉफ्टवेयर भविष्य के फॉरवर्ड भाव को बिना डिस्काउंट किए आज ही पूरा मुनाफा मान लेता था!",
          en_subtitle: "The computer system booked undiscounted future delivery value as instant profit today.",
          en_narration: "The trading software booked undiscounted future delivery commitments as instant profit today.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. The Forward STRIPs Trade",
                subtitle: "Treasury Bond Reconstitution",
                value: "Zero-Coupon STRIPs",
                badge: "Government Desk",
                state: "muted",
                bulletPoints: [
                  "Trader bought zero-coupon Treasury STRIPs"
                ]
              },
              {
                title: "2. The System Glitch",
                subtitle: "Undiscounted Forward Booking",
                value: "Discounting Blindspot",
                badge: "Software Flaw",
                state: "active_amber",
                bulletPoints: [
                  "Computer system booked forward price F_0 without present value discounting",
                  "Every forward trade generated an immediate paper gain on trade date",
                  "Rolling larger and larger forward trades postponed the day of reckoning"
                ]
              },
              {
                title: "3. $350M Phantom Profits",
                subtitle: "Trader of the Year Illusion",
                value: "Fictitious P&L",
                badge: "Hiding $210M Loss",
                state: "muted",
                bulletPoints: [
                  "Jett generated $350M in fictitious accounting gains",
                  "Awarded 'Trader of the Year' and millions in bonuses"
                ]
              },
              {
                title: "4. GE Liquidation",
                subtitle: "130-Year-Old Wall Street Firm Collapses",
                value: "Forced Fire-Sale",
                badge: "PaineWebber Sale",
                state: "muted",
                bulletPoints: [
                  "Parent General Electric suffered $210M write-down",
                  "Kidder Peabody was dismantled and sold off to PaineWebber"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 1,
              cardCount: 4,
              focusTopic: "2. The System Glitch"
            },
            semantics: {
              teachingObjective: "Explain software failure to discount future forward delivery obligations",
              sourceFactIds: ["fact-07"]
            }
          }
        },
        {
          id: "b25",
          hindi_tts: "कंप्यूटर ने 350 मिलियन डॉलर का फर्जी मुनाफा दिखाया, जबकि हकीकत में 210 मिलियन का भारी घाटा हो रहा था।",
          en_subtitle: "Software showed $350M in phantom profits while hiding $210M in actual trading losses.",
          en_narration: "The software recorded 350 million in phantom profits while concealing 210 million in real losses.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. The Forward STRIPs Trade",
                subtitle: "Treasury Bond Reconstitution",
                value: "Zero-Coupon STRIPs",
                badge: "Government Desk",
                state: "muted",
                bulletPoints: [
                  "Treasury STRIPs reconstitution"
                ]
              },
              {
                title: "2. The System Glitch",
                subtitle: "Undiscounted Forward Booking",
                value: "Discounting Blindspot",
                badge: "Software Flaw",
                state: "muted",
                bulletPoints: [
                  "Failed to discount future delivery"
                ]
              },
              {
                title: "3. $350M Phantom Profits",
                subtitle: "Trader of the Year Illusion",
                value: "Fictitious P&L",
                badge: "Hiding $210M Loss",
                state: "active_teal",
                bulletPoints: [
                  "Phantom profits accounted for a huge fraction of the firm's total earnings",
                  "Management failed to inspect the source of abnormal trading returns",
                  "Underlying Treasury positions were hemorrhaging real money every day"
                ]
              },
              {
                title: "4. GE Liquidation",
                subtitle: "130-Year-Old Wall Street Firm Collapses",
                value: "Forced Fire-Sale",
                badge: "PaineWebber Sale",
                state: "muted",
                bulletPoints: [
                  "Parent General Electric suffered $210M write-down",
                  "Kidder Peabody was dismantled and sold off to PaineWebber"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 2,
              cardCount: 4,
              focusTopic: "3. $350M Phantom Profits"
            },
            semantics: {
              teachingObjective: "Contrast fictitious accounting profits with underlying cash losses",
              sourceFactIds: ["fact-07"]
            }
          }
        },
        {
          id: "b26",
          hindi_tts: "जब कॉन्ट्रैक्ट मैच्योर हुए, तो भ्रम टूटा और 130 साल पुरानी किडर पीबॉडी बंद होकर बिक गई!",
          en_subtitle: "When contracts matured, the illusion broke, forcing the liquidation of Kidder Peabody.",
          en_narration: "When forward contracts matured, the illusion vanished, destroying 130-year-old Kidder Peabody.",
          pauseAfterMs: 500,
          ui_state: {
            cards: [
              {
                title: "1. The Forward STRIPs Trade",
                subtitle: "Treasury Bond Reconstitution",
                value: "Zero-Coupon STRIPs",
                badge: "Government Desk",
                state: "muted",
                bulletPoints: [
                  "Treasury STRIPs"
                ]
              },
              {
                title: "2. The System Glitch",
                subtitle: "Undiscounted Forward Booking",
                value: "Discounting Blindspot",
                badge: "Software Flaw",
                state: "muted",
                bulletPoints: [
                  "No discounting"
                ]
              },
              {
                title: "3. $350M Phantom Profits",
                subtitle: "Trader of the Year Illusion",
                value: "Fictitious P&L",
                badge: "Hiding $210M Loss",
                state: "muted",
                bulletPoints: [
                  "Phantom $350M P&L"
                ]
              },
              {
                title: "4. GE Liquidation",
                subtitle: "130-Year-Old Wall Street Firm Collapses",
                value: "Forced Fire-Sale",
                badge: "PaineWebber Sale",
                state: "active_amber",
                bulletPoints: [
                  "In April 1994, Kidder Peabody recognized the $210M loss and fired Jett",
                  "Reputational collapse led parent GE to sell the broker to PaineWebber",
                  "Core lesson: In derivatives, ignoring time value discounting is fatal"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 3,
              cardCount: 4,
              focusTopic: "4. GE Liquidation"
            },
            semantics: {
              teachingObjective: "Highlight collapse of Kidder Peabody and fundamental lesson on discounting timing",
              sourceFactIds: ["fact-07"]
            }
          }
        }
      ]
    },

    // Scene 8: Repo Specials & Treasury Short Squeeze (progressive_cards)
    {
      segmentIndex: 8,
      title: "Repo Specials & Treasury Short Squeeze",
      template: "progressive_cards",
      badge: "Market Microstructure (Snapshot 5.2)",
      beats: [
        {
          id: "b27",
          hindi_tts: "ट्रेजरी मार्केट में जब ट्रेडर्स किसी खास बॉन्ड को बहुत ज्यादा शॉर्ट कर देते हैं, तो एक अनोखा संकट पैदा होता है।",
          en_subtitle: "Excessive short interest in specific Treasury bonds creates an acute borrowing crisis.",
          en_narration: "Excessive short interest in specific Treasury bonds creates an acute borrowing crisis.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Massive Short Congestion",
                subtitle: "Crowded Treasury Short Hedges",
                value: "Demand Spikes",
                badge: "Borrow Scarcity",
                state: "active_teal",
                bulletPoints: [
                  "Hedgers and speculators short newly issued on-the-run Treasury bonds",
                  "Every short seller requires borrow collateral through repo desks",
                  "Borrow demand rapidly outstrips the physical supply of negotiable bonds"
                ]
              },
              {
                title: "2. The Special Repo Rate",
                subtitle: "Borrowing at Zero or Negative Rates",
                value: "Repo Rates Plunge",
                badge: "Trading on Special",
                state: "muted",
                bulletPoints: [
                  "General collateral repo rate might be 5.0%",
                  "Specific scarce issue repo rate plunges toward 0% or negative",
                  "Cash borrowers accept zero interest simply to obtain the physical bond"
                ]
              },
              {
                title: "3. Short Seller Punishment",
                subtitle: "Daily Carry Cost Skyrockets",
                value: "Negative Carry Trap",
                badge: "Expensive Borrow",
                state: "muted",
                bulletPoints: [
                  "Short sellers must pay massive daily borrowing fees",
                  "Reverse cash-and-carry becomes economically unviable",
                  "Short sellers bleed capital holding positions open"
                ]
              },
              {
                title: "4. The Violent Squeeze",
                subtitle: "Mandatory Buy-In Cascade",
                value: "Short Squeeze Rally",
                badge: "Forced Liquidations",
                state: "muted",
                bulletPoints: [
                  "Lenders recall bonds, triggering mandatory broker buy-ins",
                  "Short sellers scramble to buy back bonds at any price",
                  "Bond price surges despite negative fundamental news"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 0,
              cardCount: 4,
              focusTopic: "1. Massive Short Congestion"
            },
            semantics: {
              teachingObjective: "Present short congestion in Treasury repo markets",
              sourceFactIds: ["fact-08"]
            }
          }
        },
        {
          id: "b28",
          hindi_tts: "उस बॉन्ड को उधार लेने की इतनी होड़ मचती है कि लेंडर्स को कैश पर ब्याज मिलने के बजाय उलटा पैसा देना पड़ता है!",
          en_subtitle: "Borrowing demand surges so high that cash lenders accept negative interest rates.",
          en_narration: "Borrowing demand surges so high that cash lenders actually accept negative interest rates.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Massive Short Congestion",
                subtitle: "Crowded Treasury Short Hedges",
                value: "Demand Spikes",
                badge: "Borrow Scarcity",
                state: "muted",
                bulletPoints: [
                  "Hedgers short benchmark Treasury bonds"
                ]
              },
              {
                title: "2. The Special Repo Rate",
                subtitle: "Borrowing at Zero or Negative Rates",
                value: "Repo Rates Plunge",
                badge: "Trading on Special",
                state: "active_amber",
                bulletPoints: [
                  "Repo rate on scarce bond decouples from general collateral",
                  "Bond owner earns the difference between general repo and special repo",
                  "Demonstrates that asset borrowing is never frictionless in live markets"
                ]
              },
              {
                title: "3. Short Seller Punishment",
                subtitle: "Daily Carry Cost Skyrockets",
                value: "Negative Carry Trap",
                badge: "Expensive Borrow",
                state: "muted",
                bulletPoints: [
                  "Short sellers must pay massive daily borrowing fees",
                  "Reverse cash-and-carry becomes economically unviable"
                ]
              },
              {
                title: "4. The Violent Squeeze",
                subtitle: "Mandatory Buy-In Cascade",
                value: "Short Squeeze Rally",
                badge: "Forced Liquidations",
                state: "muted",
                bulletPoints: [
                  "Lenders recall bonds, triggering mandatory broker buy-ins"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 1,
              cardCount: 4,
              focusTopic: "2. The Special Repo Rate"
            },
            semantics: {
              teachingObjective: "Explain repo on special mechanics and negative rates",
              sourceFactIds: ["fact-08"]
            }
          }
        },
        {
          id: "b29",
          hindi_tts: "शॉर्ट सेलर्स को भारी उधारी फीस देनी पड़ती है, जिससे उनकी रिवर्स आर्बिट्राज स्ट्रैटेजी घाटे में चली जाती है।",
          en_subtitle: "Short sellers incur heavy borrow fees, undermining reverse cash-and-carry arbitrage.",
          en_narration: "Short sellers incur heavy borrow fees, completely undermining reverse cash-and-carry arbitrage.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Massive Short Congestion",
                subtitle: "Crowded Treasury Short Hedges",
                value: "Demand Spikes",
                badge: "Borrow Scarcity",
                state: "muted",
                bulletPoints: [
                  "Hedgers short benchmark Treasuries"
                ]
              },
              {
                title: "2. The Special Repo Rate",
                subtitle: "Borrowing at Zero or Negative Rates",
                value: "Repo Rates Plunge",
                badge: "Trading on Special",
                state: "muted",
                bulletPoints: [
                  "Repo trades on special"
                ]
              },
              {
                title: "3. Short Seller Punishment",
                subtitle: "Daily Carry Cost Skyrockets",
                value: "Negative Carry Trap",
                badge: "Expensive Borrow",
                state: "active_teal",
                bulletPoints: [
                  "Borrow cost erodes theoretical reverse cash-and-carry profit",
                  "Creates lower bound friction: market forward price can trade below fair parity",
                  "Arbitrageurs cannot discipline underpriced forwards if borrow is too costly"
                ]
              },
              {
                title: "4. The Violent Squeeze",
                subtitle: "Mandatory Buy-In Cascade",
                value: "Short Squeeze Rally",
                badge: "Forced Liquidations",
                state: "muted",
                bulletPoints: [
                  "Lenders recall bonds, triggering mandatory broker buy-ins"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 2,
              cardCount: 4,
              focusTopic: "3. Short Seller Punishment"
            },
            semantics: {
              teachingObjective: "Show how borrow costs create one-sided arbitrage limits in practice",
              sourceFactIds: ["fact-08"]
            }
          }
        },
        {
          id: "b30",
          hindi_tts: "और जब मालिक शेयर वापस मांगते हैं, तो मजबूरी में शेयर खरीदने से भाव आसमान छूने लगता है!",
          en_subtitle: "When lenders recall shares, forced buy-ins trigger explosive price rallies.",
          en_narration: "When lenders recall securities, forced buy-ins trigger explosive price rallies.",
          pauseAfterMs: 500,
          ui_state: {
            cards: [
              {
                title: "1. Massive Short Congestion",
                subtitle: "Crowded Treasury Short Hedges",
                value: "Demand Spikes",
                badge: "Borrow Scarcity",
                state: "muted",
                bulletPoints: [
                  "Short congestion"
                ]
              },
              {
                title: "2. The Special Repo Rate",
                subtitle: "Borrowing at Zero or Negative Rates",
                value: "Repo Rates Plunge",
                badge: "Trading on Special",
                state: "muted",
                bulletPoints: [
                  "Special repo rates"
                ]
              },
              {
                title: "3. Short Seller Punishment",
                subtitle: "Daily Carry Cost Skyrockets",
                value: "Negative Carry Trap",
                badge: "Expensive Borrow",
                state: "muted",
                bulletPoints: [
                  "Heavy borrowing fees"
                ]
              },
              {
                title: "4. The Violent Squeeze",
                subtitle: "Mandatory Buy-In Cascade",
                value: "Short Squeeze Rally",
                badge: "Forced Liquidations",
                state: "active_amber",
                bulletPoints: [
                  "Brokers enforce regulatory delivery buy-ins within 1 business day",
                  "Desperate short covers cause price to spike disconnected from fundamentals",
                  "Proves short sellers face structural squeeze risk on scarce assets"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 3,
              cardCount: 4,
              focusTopic: "4. The Violent Squeeze"
            },
            semantics: {
              teachingObjective: "Detail mandatory delivery buy-ins and short squeeze dynamics",
              sourceFactIds: ["fact-08"]
            }
          }
        }
      ]
    },

    // Scene 9: Active Recall: 6-Month Forward Stock Pricing (interactive_quiz)
    {
      segmentIndex: 9,
      title: "Active Recall: 6-Month Forward Stock Pricing",
      template: "interactive_quiz",
      badge: "Knowledge Verification",
      beats: [
        {
          id: "b31",
          hindi_tts: "राजू के लिए सवाल: एक शेयर 50 डॉलर का है, ब्याज दर 6% है और कोई डिविडेंड नहीं है। 6 महीने का फॉरवर्ड भाव क्या होगा?",
          en_subtitle: "Quiz: If stock is $50, risk-free rate is 6%, what is 6-month forward price?",
          en_narration: "A question for Raju: If a stock is $50 and the risk-free rate is 6%, what is the 6-month forward price?",
          pauseAfterMs: 400,
          ui_state: {
            question: "A stock trades at $50. The risk-free interest rate is 6% per annum continuous. What is the 6-month forward price?",
            options: [
              "A) $53.00",
              "B) $51.52",
              "C) $50.75",
              "D) $52.25"
            ],
            selectedOption: null,
            isCorrect: null,
            answer: "B) $51.52",
            showThinkingSpinner: false,
            feedback: "Raju computes the cost of carry: F_0 = S_0 * e^(r*T)..."
          },
          visual: {
            kind: "quiz",
            data: {
              question: "A stock trades at $50. The risk-free interest rate is 6% per annum continuous. What is the 6-month forward price?",
              options: [
                "A) $53.00",
                "B) $51.52",
                "C) $50.75",
                "D) $52.25"
              ],
              selectedOption: null,
              isCorrect: null,
              answer: "B) $51.52",
              showThinkingSpinner: false
            },
            semantics: {
              teachingObjective: "Present active recall forward pricing calculation question",
              sourceFactIds: ["fact-03"]
            }
          }
        },
        {
          id: "b32",
          hindi_tts: "राजू ने फार्मूला लगाया: 50 गुणा e की पावर 0.03, यानी 50 गुणा 1.03045, जो बनता है ठीक 51.52 डॉलर!",
          en_subtitle: "Raju computes: 50 * e^(0.06 * 0.5) = 50 * 1.03045 = $51.52.",
          en_narration: "Raju calculates: 50 times e to the power 0.03 equals 50 times 1.03045, giving exactly $51.52!",
          pauseAfterMs: 3200,
          ui_state: {
            question: "A stock trades at $50. The risk-free interest rate is 6% per annum continuous. What is the 6-month forward price?",
            options: [
              "A) $53.00",
              "B) $51.52",
              "C) $50.75",
              "D) $52.25"
            ],
            selectedOption: 1,
            isCorrect: true,
            answer: "B) $51.52",
            showThinkingSpinner: true,
            feedback: "Raju evaluates: F_0 = 50 * e^(0.06 * 0.5) = 50 * e^(0.03) = 50 * 1.030455 = $51.52."
          },
          visual: {
            kind: "quiz",
            data: {
              question: "A stock trades at $50. The risk-free interest rate is 6% per annum continuous. What is the 6-month forward price?",
              options: [
                "A) $53.00",
                "B) $51.52",
                "C) $50.75",
                "D) $52.25"
              ],
              selectedOption: 1,
              isCorrect: true,
              answer: "B) $51.52",
              showThinkingSpinner: true
            },
            semantics: {
              teachingObjective: "Show thinking pause and selection of correct answer B ($51.52)",
              sourceFactIds: ["fact-03"]
            }
          }
        },
        {
          id: "b33",
          hindi_tts: "बिल्कुल सही राजू! 51.52 डॉलर सही जवाब है। यह शेयर रखने के ब्याज का सटीक गणित है।",
          en_subtitle: "Correct! Option B is verified: $51.52 is the exact no-arbitrage forward price.",
          en_narration: "Brilliant Raju! Option B is correct. $51.52 is the exact no-arbitrage cost of carry price.",
          pauseAfterMs: 500,
          ui_state: {
            question: "A stock trades at $50. The risk-free interest rate is 6% per annum continuous. What is the 6-month forward price?",
            options: [
              "A) $53.00",
              "B) $51.52",
              "C) $50.75",
              "D) $52.25"
            ],
            selectedOption: 1,
            isCorrect: true,
            answer: "B) $51.52",
            showThinkingSpinner: false,
            feedback: "Verified! F_0 = 50 * e^(0.03) = $51.52. If forward is $53, cash-and-carry locks $1.48 free profit."
          },
          visual: {
            kind: "quiz",
            data: {
              question: "A stock trades at $50. The risk-free interest rate is 6% per annum continuous. What is the 6-month forward price?",
              options: [
                "A) $53.00",
                "B) $51.52",
                "C) $50.75",
                "D) $52.25"
              ],
              selectedOption: 1,
              isCorrect: true,
              answer: "B) $51.52",
              showThinkingSpinner: false
            },
            semantics: {
              teachingObjective: "Confirm solution and explain economic no-arbitrage boundary",
              sourceFactIds: ["fact-03", "fact-04"]
            }
          }
        }
      ]
    },

    // Scene 10: Raju Understands Cost of Carry (chat_story)
    {
      segmentIndex: 10,
      title: "Raju Understands Cost of Carry",
      template: "chat_story",
      badge: "Trading Desk Synthesis",
      beats: [
        {
          id: "b34",
          hindi_tts: "शर्मा जी! अब मैं समझ गया कि फॉरवर्ड भाव कोई जादुई शीशा नहीं, बल्कि सिर्फ फाइनेंसिंग और डिविडेंड का हिसाब है।",
          en_subtitle: "Sharma ji, I now understand that forward prices reflect carry financing, not crystal balls.",
          en_narration: "Sharma ji, I now understand that forward prices reflect carry financing, not crystal balls.",
          pauseAfterMs: 400,
          ui_state: {
            stageDirections: ["— Raju masters spot-forward fundamentals —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! I now realize forward prices reflect financing and dividend carry, not market forecasts.",
                theme: "amber",
                align: "left"
              }
            ]
          },
          visual: {
            kind: "conversation",
            data: {
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "Sharma ji! I now realize forward prices reflect financing and dividend carry, not market forecasts.",
                  theme: "amber",
                  align: "left"
                }
              ]
            },
            semantics: {
              teachingObjective: "Show trader understanding of cost of carry fundamentals",
              sourceFactIds: ["fact-03", "fact-06"]
            }
          }
        },
        {
          id: "b35",
          hindi_tts: "शाबाश राजू! और किडर पीबॉडी का सबक याद रखना: डेरिवेटिव्स में डिस्काउंटिंग का समय भूलना सबसे बड़ा अपराध है।",
          en_subtitle: "Well done, Raju! Remember Kidder Peabody: Never ignore time value discounting.",
          en_narration: "Well done Raju! Remember Kidder Peabody: Never ignore time value discounting in derivative trades.",
          pauseAfterMs: 400,
          ui_state: {
            stageDirections: ["— Sharma ji emphasizes accounting discipline —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! I now realize forward prices reflect financing and dividend carry, not market forecasts.",
                theme: "amber",
                align: "left"
              },
              {
                sender: "Sharma ji",
                avatar: "S",
                text: "Spot on Raju! And remember Kidder Peabody: discounting timing is paramount in all forward contracts.",
                theme: "teal",
                align: "right"
              }
            ]
          },
          visual: {
            kind: "conversation",
            data: {
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "Sharma ji! I now realize forward prices reflect financing and dividend carry, not market forecasts.",
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "Spot on Raju! And remember Kidder Peabody: discounting timing is paramount in all forward contracts.",
                  theme: "teal",
                  align: "right"
                }
              ]
            },
            semantics: {
              teachingObjective: "Reinforce accounting integrity and present value discounting rigor",
              sourceFactIds: ["fact-07"]
            }
          }
        },
        {
          id: "b36",
          hindi_tts: "बिल्कुल शर्मा जी! चाहे शेयर हो या सोना, नो-आर्बिट्राज के नियम हमेशा लागू होते हैं।",
          en_subtitle: "Understood! Whether stocks or gold, the laws of no-arbitrage always prevail.",
          en_narration: "Understood! Whether stocks or gold, the immutable laws of no-arbitrage always prevail.",
          pauseAfterMs: 500,
          ui_state: {
            stageDirections: ["— Raju commits to disciplined pricing —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! I now realize forward prices reflect financing and dividend carry, not market forecasts.",
                theme: "amber",
                align: "left"
              },
              {
                sender: "Sharma ji",
                avatar: "S",
                text: "Spot on Raju! And remember Kidder Peabody: discounting timing is paramount in all forward contracts.",
                theme: "teal",
                align: "right"
              },
              {
                sender: "Raju",
                avatar: "R",
                text: "Understood Sharma ji! Cash-and-carry bounds guarantee no-arbitrage discipline across all assets.",
                theme: "amber",
                align: "left"
              }
            ]
          },
          visual: {
            kind: "conversation",
            data: {
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "Sharma ji! I now realize forward prices reflect financing and dividend carry, not market forecasts.",
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "Spot on Raju! And remember Kidder Peabody: discounting timing is paramount in all forward contracts.",
                  theme: "teal",
                  align: "right"
                },
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "Understood Sharma ji! Cash-and-carry bounds guarantee no-arbitrage discipline across all assets.",
                  theme: "amber",
                  align: "left"
                }
              ]
            },
            semantics: {
              teachingObjective: "Solidify synthesis of no-arbitrage discipline and risk control",
              sourceFactIds: ["fact-03", "fact-04"]
            }
          }
        }
      ]
    },

    // Scene 11: The Whole Picture: 8 Core Forward Pricing Rules (summary_thread)
    {
      segmentIndex: 11,
      title: "The Whole Picture: 8 Core Forward Pricing Rules",
      template: "summary_thread",
      badge: "Master Chapter Synthesis",
      beats: [
        {
          id: "b37",
          hindi_tts: "पूरा चैप्टर एक नजर में: फॉरवर्ड प्राइसिंग, आर्बिट्राज, और डिविडेंड यील्ड के आठ बुनियादी नियम।",
          en_subtitle: "The entire chapter at a glance: Eight core principles of forward and futures pricing.",
          en_narration: "The complete chapter at a glance: Eight foundational principles governing forward and futures pricing.",
          pauseAfterMs: 400,
          ui_state: {
            headerBadge: "CHAPTER 5 · PART 1 · SUMMARY",
            heading: "Forward & Futures Pricing Master Thread",
            activeStepIndex: 0,
            activeStepRange: [0, 0],
            steps: summarySteps,
            bottomTakeaway: "Forward prices represent the no-arbitrage cost of carry, not market forecasts; dividend income reduces carry costs, and proper discounting is vital.",
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [0, 0],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Present executive overview of all 8 forward pricing rules",
              sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"]
            }
          }
        },
        {
          id: "b38",
          hindi_tts: "पहला नियम: इन्वेस्टमेंट एसेट्स में दो तरफा आर्बिट्राज होता है। दूसरा नियम: शॉर्ट सेलर को सारे डिविडेंड्स लौटाने पड़ते हैं।",
          en_subtitle: "First and second: Investment assets obey exact parity; short sellers must remit dividends.",
          en_narration: "First and second: Investment assets obey exact arbitrage parity, while short sellers must remit all dividends.",
          pauseAfterMs: 400,
          ui_state: {
            headerBadge: "CHAPTER 5 · PART 1 · SUMMARY",
            heading: "Forward & Futures Pricing Master Thread",
            activeStepIndex: 1,
            activeStepRange: [1, 2],
            steps: summarySteps,
            bottomTakeaway: "Forward prices represent the no-arbitrage cost of carry, not market forecasts; dividend income reduces carry costs, and proper discounting is vital.",
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [1, 2],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Focus on Rules 1 and 2: asset classification and short selling rules",
              sourceFactIds: ["fact-01", "fact-02"]
            }
          }
        },
        {
          id: "b39",
          hindi_tts: "तीसरा नियम: फॉरवर्ड भाव F-0 बराबर S-0 गुणा e की पावर rT। चौथा नियम: कैश-एंड-कैरी से आर्बिट्राज का मुनाफा पक्का होता है।",
          en_subtitle: "Third and fourth: Formula F_0 = S_0*e^(rT) defines parity, enforced by cash-and-carry.",
          en_narration: "Third and fourth: Formula F zero equals S zero times e to the power rT, enforced by cash-and-carry.",
          pauseAfterMs: 400,
          ui_state: {
            headerBadge: "CHAPTER 5 · PART 1 · SUMMARY",
            heading: "Forward & Futures Pricing Master Thread",
            activeStepIndex: 3,
            activeStepRange: [3, 4],
            steps: summarySteps,
            bottomTakeaway: "Forward prices represent the no-arbitrage cost of carry, not market forecasts; dividend income reduces carry costs, and proper discounting is vital.",
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [3, 4],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Focus on Rules 3 and 4: no-income forward formula and cash-and-carry bounds",
              sourceFactIds: ["fact-03", "fact-04"]
            }
          }
        },
        {
          id: "b40",
          hindi_tts: "पांचवां नियम: कैश डिविडेंड फॉरवर्ड भाव घटाता है। छठा नियम: डिविडेंड यील्ड q से नेट कैरी r माइनस q बनता है।",
          en_subtitle: "Fifth and sixth: Cash income reduces forwards; dividend yield creates net carry (r - q).",
          en_narration: "Fifth and sixth: Cash income reduces forwards, while dividend yield creates net carry r minus q.",
          pauseAfterMs: 400,
          ui_state: {
            headerBadge: "CHAPTER 5 · PART 1 · SUMMARY",
            heading: "Forward & Futures Pricing Master Thread",
            activeStepIndex: 5,
            activeStepRange: [5, 6],
            steps: summarySteps,
            bottomTakeaway: "Forward prices represent the no-arbitrage cost of carry, not market forecasts; dividend income reduces carry costs, and proper discounting is vital.",
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [5, 6],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Focus on Rules 5 and 6: discrete cash income deduction and continuous dividend yield",
              sourceFactIds: ["fact-05", "fact-06"]
            }
          }
        },
        {
          id: "b41",
          hindi_tts: "सातवां नियम: किडर पीबॉडी ने डिस्काउंटिंग भूलकर 350 मिलियन का फर्जी मुनाफा बनाया। और आठवां नियम: भारी शॉर्टिंग से रेपो नेगेटिव होकर शॉर्ट स्क्वीज लाती है।",
          en_subtitle: "Seventh and eighth: Kidder Peabody booked phantom profits; repo specials cause short squeezes.",
          en_narration: "Seventh and eighth: Kidder Peabody booked phantom profits, while repo specials cause violent short squeezes.",
          pauseAfterMs: 450,
          ui_state: {
            headerBadge: "CHAPTER 5 · PART 1 · SUMMARY",
            heading: "Forward & Futures Pricing Master Thread",
            activeStepIndex: 7,
            activeStepRange: [7, 8],
            steps: summarySteps,
            bottomTakeaway: "Forward prices represent the no-arbitrage cost of carry, not market forecasts; dividend income reduces carry costs, and proper discounting is vital.",
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [7, 8],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Provide dedicated focus on Rule 8: repo on special and short squeeze risks",
              sourceFactIds: ["fact-07", "fact-08"]
            }
          }
        },
        {
          id: "b42",
          hindi_tts: "यह है फॉरवर्ड प्राइसिंग का पूरा विज्ञान! सही कैरिंग कॉस्ट ही डेरिवेटिव्स में मुनाफे की चाबी है।",
          en_subtitle: "Complete master summary: Diligent cost of carry valuation is the key to derivative mastery.",
          en_narration: "That is the complete forward pricing framework! Diligent cost of carry valuation unlocks derivative mastery.",
          pauseAfterMs: 600,
          ui_state: {
            headerBadge: "CHAPTER 5 · PART 1 · COMPLETE OVERVIEW",
            heading: "Master Forward & Futures Pricing Architecture",
            activeStepIndex: 0,
            activeStepRange: [1, 8],
            steps: summarySteps,
            bottomTakeaway: "Forward prices represent the no-arbitrage cost of carry, not market forecasts; dividend income reduces carry costs, and proper discounting is vital.",
            compactOverview: true
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [1, 8],
              compactOverview: true
            },
            semantics: {
              teachingObjective: "Display complete 2-column whole-chapter reference matrix",
              sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"]
            }
          }
        }
      ]
    }
  ]
};

// Write to hull_derivatives
const hindiTarget = path.resolve('src/data/chapters/hull_derivatives/ch05_part1');
fs.mkdirSync(hindiTarget, { recursive: true });
fs.writeFileSync(path.join(hindiTarget, 'episode_raw.json'), JSON.stringify(episode, null, 2), 'utf8');

// Construct English episode
const englishEpisode = JSON.parse(JSON.stringify(episode));
englishEpisode.meta.course = "hull_derivatives_en";
englishEpisode.meta.narrationLanguage = "en-US";

for (const scene of englishEpisode.scenes) {
  for (const beat of scene.beats) {
    beat.hindi_tts = beat.en_narration;
    if (beat.ui_state?.messages) {
      for (const msg of beat.ui_state.messages) {
        if (msg.sender === "Raju") {
          msg.sender = "Alex";
          msg.avatar = "A";
        } else if (msg.sender === "Sharma ji") {
          msg.sender = "Marcus";
          msg.avatar = "M";
        }
      }
    }
    if (beat.visual?.data?.messages) {
      for (const msg of beat.visual.data.messages) {
        if (msg.sender === "Raju") {
          msg.sender = "Alex";
          msg.avatar = "A";
        } else if (msg.sender === "Sharma ji") {
          msg.sender = "Marcus";
          msg.avatar = "M";
        }
      }
    }
  }
}

const englishTarget = path.resolve('src/data/chapters/hull_derivatives_en/ch05_part1');
fs.mkdirSync(englishTarget, { recursive: true });
fs.writeFileSync(path.join(englishTarget, 'episode_raw.json'), JSON.stringify(englishEpisode, null, 2), 'utf8');

console.log('✅ Successfully generated compliant episode_raw.json for ch05_part1 (Hindi & English)!');

