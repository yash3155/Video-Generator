import fs from 'fs';
import path from 'path';

const episode = {
  schemaVersion: "1.0.0",
  meta: {
    course: "hull_derivatives",
    chapter: "CHAPTER 4 · PART 2",
    chapterTitle: "Forward Interest Rates, FRAs, and Term Structure Theories",
    domain: "finance",
    primaryColor: "#0F766E",
    accentColor: "#F59E0B",
    narrationLanguage: "hi-IN-devanagari"
  },
  scenes: [
    // Scene 0: The Future Borrowing Dilemma (chat_story)
    {
      segmentIndex: 0,
      title: "The Future Borrowing Dilemma",
      template: "chat_story",
      badge: "Corporate Treasury Desk",
      beats: [
        {
          id: "b01",
          hindi_tts: "शर्मा जी! अगले साल हमारी कंपनी को पांच करोड़ रुपये के लोन की जरूरत है। अगर तब तक इंटरेस्ट रेट बढ़ गए तो क्या होगा?",
          en_subtitle: "Sharma ji, our company needs a loan next year. What if rates spike before then?",
          en_narration: "Sharma ji, our company needs a five crore loan next year. What if interest rates spike before then?",
          pauseAfterMs: 400,
          ui_state: {
            stageDirections: ["— Raju contemplates future funding risk —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! Our firm needs a ₹5 Crore loan 1 year from now. What if the central bank raises rates?",
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
                  text: "Sharma ji! Our firm needs a ₹5 Crore loan 1 year from now. What if the central bank raises rates?",
                  theme: "amber",
                  align: "left"
                }
              ]
            },
            semantics: {
              teachingObjective: "Introduce future borrowing risk and necessity of forward rate hedging",
              sourceFactIds: ["fact-01", "fact-03"]
            }
          }
        },
        {
          id: "b02",
          hindi_tts: "घबराने की जरूरत नहीं राजू! आज की यील्ड कर्व हमें फ्यूचर का फॉरवर्ड रेट पहले ही बता देती है, जिसे हम आज ही लॉक कर सकते हैं।",
          en_subtitle: "Don't worry, Raju! Today's yield curve already determines the forward rate we can lock.",
          en_narration: "Don't panic Raju! Today's yield curve already implies the forward rate, which we can lock right now.",
          pauseAfterMs: 400,
          ui_state: {
            stageDirections: ["— Sharma ji introduces implied forward rates —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! Our firm needs a ₹5 Crore loan 1 year from now. What if the central bank raises rates?",
                theme: "amber",
                align: "left"
              },
              {
                sender: "Sharma ji",
                avatar: "S",
                text: "Don't worry Raju! Current zero curves imply future rates. We can lock our borrowing cost today using an FRA.",
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
                  text: "Sharma ji! Our firm needs a ₹5 Crore loan 1 year from now. What if the central bank raises rates?",
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "Don't worry Raju! Current zero curves imply future rates. We can lock our borrowing cost today using an FRA.",
                  theme: "teal",
                  align: "right"
                }
              ]
            },
            semantics: {
              teachingObjective: "Present forward rates and OTC Forward Rate Agreements as hedging solutions",
              sourceFactIds: ["fact-01", "fact-03"]
            }
          }
        },
        {
          id: "b03",
          hindi_tts: "क्या हम बिना एक रुपया दिए, एक साल बाद के लोन का ब्याज आज ही पक्का कर सकते हैं?",
          en_subtitle: "Can we lock next year's borrowing cost today without paying cash upfront?",
          en_narration: "Can we truly lock next year's interest rate today without paying cash upfront?",
          pauseAfterMs: 500,
          ui_state: {
            stageDirections: ["— Raju discovers forward contract leverage —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! Our firm needs a ₹5 Crore loan 1 year from now. What if the central bank raises rates?",
                theme: "amber",
                align: "left"
              },
              {
                sender: "Sharma ji",
                avatar: "S",
                text: "Don't worry Raju! Current zero curves imply future rates. We can lock our borrowing cost today using an FRA.",
                theme: "teal",
                align: "right"
              },
              {
                sender: "Raju",
                avatar: "R",
                text: "Can we lock future borrowing costs today without an upfront cash premium?",
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
                  text: "Sharma ji! Our firm needs a ₹5 Crore loan 1 year from now. What if the central bank raises rates?",
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "Don't worry Raju! Current zero curves imply future rates. We can lock our borrowing cost today using an FRA.",
                  theme: "teal",
                  align: "right"
                },
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "Can we lock future borrowing costs today without an upfront cash premium?",
                  theme: "amber",
                  align: "left"
                }
              ]
            },
            semantics: {
              teachingObjective: "Highlight zero initial cash value of OTC forward contracts",
              sourceFactIds: ["fact-03", "fact-05"]
            }
          }
        }
      ]
    },

    // Scene 1: Expectations vs Liquidity Preference (tug_of_war)
    {
      segmentIndex: 1,
      title: "Expectations vs Liquidity Preference",
      template: "tug_of_war",
      badge: "Term Structure Theory",
      beats: [
        {
          id: "b04",
          hindi_tts: "एक्सपेक्टेशंस थ्योरी का मानना है कि फॉरवर्ड रेट्स भविष्य के इंटरेस्ट रेट्स का निष्पक्ष अनुमान होते हैं।",
          en_subtitle: "Expectations Theory asserts that forward rates are unbiased forecasts of future spot rates.",
          en_narration: "Expectations Theory asserts that forward interest rates are unbiased forecasts of future spot interest rates.",
          pauseAfterMs: 400,
          ui_state: {
            leftLabel: "Expectations Theory",
            rightLabel: "Liquidity Preference",
            leftValue: "R_F = E[R]",
            rightValue: "R_F > E[R]",
            tensionRatio: 0.7,
            centerMessage: "Are forward rates unbiased market forecasts or risk premiums?",
            leftDetails: [
              "Pure market consensus of future spot interest rates",
              "Investors are completely risk-neutral across maturities",
              "Assumes zero term premium required by long-term lenders"
            ],
            rightDetails: [
              "Lenders demand a premium to lock capital for long horizons",
              "Borrowers prefer long-term debt to eliminate rollover risk",
              "Forward rates systematically exceed expected spot rates"
            ]
          },
          visual: {
            kind: "diagram",
            data: {
              tensionRatio: 0.7,
              focusSide: "left",
              leftLabel: "Expectations Theory",
              rightLabel: "Liquidity Preference"
            },
            semantics: {
              teachingObjective: "Present Expectations Theory hypothesis R_F = E[R]",
              sourceFactIds: ["fact-06"]
            }
          }
        },
        {
          id: "b05",
          hindi_tts: "लेकिन हकीकत में, लेंडर्स अपने पैसे को लंबे समय तक फंसाने के लिए लिक्विडिटी प्रीमियम मांगते हैं।",
          en_subtitle: "In reality, investors demand a liquidity premium to lock money up for long periods.",
          en_narration: "However, Liquidity Preference Theory proves investors demand a premium to lock money up for long periods.",
          pauseAfterMs: 400,
          ui_state: {
            leftLabel: "Expectations Theory",
            rightLabel: "Liquidity Preference",
            leftValue: "R_F = E[R]",
            rightValue: "R_F > E[R]",
            tensionRatio: 0.3,
            centerMessage: "Liquidity preference creates positive maturity premiums",
            leftDetails: [
              "Pure market consensus of future spot interest rates",
              "Investors are completely risk-neutral across maturities",
              "Assumes zero term premium required by long-term lenders"
            ],
            rightDetails: [
              "Lenders demand a premium to lock capital for long horizons",
              "Borrowers prefer long-term debt to eliminate rollover risk",
              "Forward rates systematically exceed expected spot rates"
            ]
          },
          visual: {
            kind: "diagram",
            data: {
              tensionRatio: 0.3,
              focusSide: "right",
              leftLabel: "Expectations Theory",
              rightLabel: "Liquidity Preference"
            },
            semantics: {
              teachingObjective: "Demonstrate why investors require positive term liquidity premiums",
              sourceFactIds: ["fact-06"]
            }
          }
        },
        {
          id: "b06",
          hindi_tts: "इसलिए, नॉर्मल यील्ड कर्व हमेशा ऊपर की तरफ झुकती है, क्योंकि फॉरवर्ड रेट्स में रिस्क प्रीमियम शामिल होता है।",
          en_subtitle: "Yield curves normally slope upward because forward rates include a term liquidity premium.",
          en_narration: "Thus, yield curves normally slope upward because forward rates contain an embedded liquidity premium.",
          pauseAfterMs: 500,
          ui_state: {
            leftLabel: "Expectations Theory",
            rightLabel: "Liquidity Preference",
            leftValue: "R_F = E[R]",
            rightValue: "R_F > E[R]",
            tensionRatio: 0.15,
            centerMessage: "Normal upward yield curve driven by Liquidity Preference",
            leftDetails: [
              "Fails to explain why yield curves slope upward most of the time",
              "Ignores natural asymmetry between lenders and corporate borrowers"
            ],
            rightDetails: [
              "John C. Hull's authoritative term structure conclusion",
              "Upward slope persists even when rate expectations are flat"
            ]
          },
          visual: {
            kind: "diagram",
            data: {
              tensionRatio: 0.15,
              focusSide: "right",
              leftLabel: "Expectations Theory",
              rightLabel: "Liquidity Preference"
            },
            semantics: {
              teachingObjective: "Establish Liquidity Preference as the primary driver of upward-sloping yield curves",
              sourceFactIds: ["fact-06"]
            }
          }
        }
      ]
    },

    // Scene 2: Continuous Forward Rate Formula (formula_breakdown)
    {
      segmentIndex: 2,
      title: "Continuous Forward Rate Formula",
      template: "formula_breakdown",
      badge: "Mathematical Foundation",
      beats: [
        {
          id: "b07",
          hindi_tts: "फॉरवर्ड रेट वह ब्याज दर है जो आज की दो अलग-अलग मैच्योरिटीज के बीच छिपी होती है।",
          en_subtitle: "A forward rate is the interest rate implied between two future spot maturities.",
          en_narration: "A forward rate is the interest rate implied between two future spot maturities.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Continuous Forward Interest Rate",
            expression: "R_F = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}",
            variables: [
              { symbol: "R_F", label: "Forward Rate", description: "Continuous forward rate between T1 and T2", unit: "%" },
              { symbol: "R_1", label: "Zero Rate 1", description: "Continuous zero rate for maturity T1", unit: "%" },
              { symbol: "R_2", label: "Zero Rate 2", description: "Continuous zero rate for maturity T2", unit: "%" },
              { symbol: "T_1, T_2", label: "Maturities", description: "Start and end times of the forward borrowing period", unit: "years" }
            ],
            steps: [
              { stepIndex: 0, label: "Compound Growth Identity", equation: "e^{R_1 T_1} \\cdot e^{R_F (T_2 - T_1)} = e^{R_2 T_2}", note: "Total growth over T2 must equal growth over T1 multiplied by forward growth" }
            ],
            assumptions: ["Rates are continuously compounded with frictionless zero-coupon markets."],
            interpretation: "Forward rate is the break-even rate equating short rolling with long investing."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Continuous Forward Interest Rate",
              expression: "R_F = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}",
              variables: [
                { symbol: "R_F", label: "Forward Rate", description: "Continuous forward rate between T1 and T2", unit: "%" },
                { symbol: "R_1", label: "Zero Rate 1", description: "Continuous zero rate for maturity T1", unit: "%" },
                { symbol: "R_2", label: "Zero Rate 2", description: "Continuous zero rate for maturity T2", unit: "%" },
                { symbol: "T_1, T_2", label: "Maturities", description: "Start and end times of the forward borrowing period", unit: "years" }
              ],
              steps: [
                { stepIndex: 0, label: "Compound Growth Identity", equation: "e^{R_1 T_1} \\cdot e^{R_F (T_2 - T_1)} = e^{R_2 T_2}", note: "Total growth over T2 must equal growth over T1 multiplied by forward growth" }
              ],
              assumptions: ["Rates are continuously compounded with frictionless zero-coupon markets."],
              interpretation: "Forward rate is the break-even rate equating short rolling with long investing."
            },
            semantics: {
              teachingObjective: "Present the foundational no-arbitrage continuous forward rate formula",
              sourceFactIds: ["fact-01"]
            }
          }
        },
        {
          id: "b08",
          hindi_tts: "कंटीन्यूअस कंपाउंडिंग में, फॉरवर्ड रेट निकालने का फार्मूला है: R-टू गुणा T-टू माइनस R-वन गुणा T-वन, बटे T-टू माइनस T-वन।",
          en_subtitle: "Under continuous compounding: R_F = (R2*T2 - R1*T1) / (T2 - T1).",
          en_narration: "Under continuous compounding, the forward rate is R2 times T2 minus R1 times T1, divided by T2 minus T1.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Continuous Forward Interest Rate",
            expression: "R_F = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}",
            variables: [
              { symbol: "R_F", label: "Forward Rate", description: "Continuous forward rate between T1 and T2", unit: "%" },
              { symbol: "R_1", label: "Zero Rate 1", description: "Continuous zero rate for maturity T1", unit: "%" },
              { symbol: "R_2", label: "Zero Rate 2", description: "Continuous zero rate for maturity T2", unit: "%" },
              { symbol: "T_1, T_2", label: "Maturities", description: "Start and end times of the forward borrowing period", unit: "years" }
            ],
            steps: [
              { stepIndex: 0, label: "Compound Growth Identity", equation: "e^{R_1 T_1} \\cdot e^{R_F (T_2 - T_1)} = e^{R_2 T_2}", note: "Take natural logarithm of both sides" },
              { stepIndex: 1, label: "Isolate Forward Rate", equation: "R_F (T_2 - T_1) = R_2 T_2 - R_1 T_1", note: "Solve algebraically for R_F" }
            ],
            assumptions: ["Rates are continuously compounded with frictionless zero-coupon markets."],
            interpretation: "Forward rate represents the incremental interest earned in period T1 to T2."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Continuous Forward Interest Rate",
              expression: "R_F = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}",
              variables: [
                { symbol: "R_F", label: "Forward Rate", description: "Continuous forward rate between T1 and T2", unit: "%" },
                { symbol: "R_1", label: "Zero Rate 1", description: "Continuous zero rate for maturity T1", unit: "%" },
                { symbol: "R_2", label: "Zero Rate 2", description: "Continuous zero rate for maturity T2", unit: "%" },
                { symbol: "T_1, T_2", label: "Maturities", description: "Start and end times of the forward borrowing period", unit: "years" }
              ],
              steps: [
                { stepIndex: 0, label: "Compound Growth Identity", equation: "e^{R_1 T_1} \\cdot e^{R_F (T_2 - T_1)} = e^{R_2 T_2}", note: "Take natural logarithm of both sides" },
                { stepIndex: 1, label: "Isolate Forward Rate", equation: "R_F (T_2 - T_1) = R_2 T_2 - R_1 T_1", note: "Solve algebraically for R_F" }
              ],
              assumptions: ["Rates are continuously compounded with frictionless zero-coupon markets."],
              interpretation: "Forward rate represents the incremental interest earned in period T1 to T2."
            },
            semantics: {
              teachingObjective: "Derive the mathematical isolation of forward rate from spot rates",
              sourceFactIds: ["fact-01"]
            }
          }
        },
        {
          id: "b09",
          hindi_tts: "अगर एक साल का रेट तीन परसेंट और दो साल का रेट चार परसेंट है, तो दूसरे साल का फॉरवर्ड रेट ठीक पांच परसेंट होगा!",
          en_subtitle: "If 1-year rate is 3% and 2-year is 4%, year-2 forward rate is exactly 5.0%.",
          en_narration: "If the 1-year rate is 3% and the 2-year rate is 4%, the year-2 forward rate is exactly 5.0%.",
          pauseAfterMs: 500,
          ui_state: {
            title: "Continuous Forward Interest Rate",
            expression: "R_F = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}",
            variables: [
              { symbol: "R_1 = 3\\%", label: "1-Year Rate", description: "Spot continuous rate for year 1", unit: "%" },
              { symbol: "R_2 = 4\\%", label: "2-Year Rate", description: "Spot continuous rate for 2 years", unit: "%" },
              { symbol: "R_F = 5\\%", label: "Year 2 Forward", description: "Implied forward rate for year 2", unit: "%" }
            ],
            steps: [
              { stepIndex: 0, label: "Substitute Hull Numerical Values", equation: "R_F = \\frac{0.04 \\times 2 - 0.03 \\times 1}{2 - 1}", note: "Total 2-year return is 8%, 1st year is 3%" },
              { stepIndex: 1, label: "Calculate Break-Even Rate", equation: "R_F = 0.08 - 0.03 = 0.050 \\implies 5.0\\%", note: "Forward rate lies strictly above zero rates in upward curve" }
            ],
            assumptions: ["Rates are continuously compounded with frictionless zero-coupon markets."],
            interpretation: "When zero rates rise with maturity, forward rates always sit above zero rates."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Continuous Forward Interest Rate",
              expression: "R_F = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}",
              variables: [
                { symbol: "R_1 = 3\\%", label: "1-Year Rate", description: "Spot continuous rate for year 1", unit: "%" },
                { symbol: "R_2 = 4\\%", label: "2-Year Rate", description: "Spot continuous rate for 2 years", unit: "%" },
                { symbol: "R_F = 5\\%", label: "Year 2 Forward", description: "Implied forward rate for year 2", unit: "%" }
              ],
              steps: [
                { stepIndex: 0, label: "Substitute Hull Numerical Values", equation: "R_F = \\frac{0.04 \\times 2 - 0.03 \\times 1}{2 - 1}", note: "Total 2-year return is 8%, 1st year is 3%" },
                { stepIndex: 1, label: "Calculate Break-Even Rate", equation: "R_F = 0.08 - 0.03 = 0.050 \\implies 5.0\\%", note: "Forward rate lies strictly above zero rates in upward curve" }
              ],
              assumptions: ["Rates are continuously compounded with frictionless zero-coupon markets."],
              interpretation: "When zero rates rise with maturity, forward rates always sit above zero rates."
            },
            semantics: {
              teachingObjective: "Execute worked numerical example proving forward rates exceed rising zero rates",
              sourceFactIds: ["fact-01"]
            }
          }
        }
      ]
    },

    // Scene 3: Synthetic Forward Rate Replication (split_comparison)
    {
      segmentIndex: 3,
      title: "Synthetic Forward Rate Replication",
      template: "split_comparison",
      badge: "No-Arbitrage Mechanism",
      beats: [
        {
          id: "b10",
          hindi_tts: "हम बिना किसी डेरिवेटिव कॉन्ट्रैक्ट के भी, कैश मार्केट में फॉरवर्ड लोन खुद बना सकते हैं।",
          en_subtitle: "We can synthesize a forward loan directly in the cash market via replication.",
          en_narration: "We can synthetically construct a forward loan directly in the cash market using spot bonds.",
          pauseAfterMs: 400,
          ui_state: {
            leftTitle: "Strategy A: Borrow Period T1",
            rightTitle: "Strategy B: Invest Period T2",
            leftBadge: "Short-Term Cash Inflow",
            rightBadge: "Long-Term Guaranteed Outflow",
            leftSubtitle: "Borrow $1,000 for 1 year at 3%",
            rightSubtitle: "Invest $1,000 for 2 years at 4%",
            comparisonPoints: [
              "Time 0: Borrow $1,000 at 3% for 1 year",
              "Time 0: Invest the $1,000 at 4% for 2 years",
              "Net cash flow at Time 0 is exactly zero dollars",
              "At Year 1: Repay loan of $1,000 * e^(0.03 * 1) = $1,030.45",
              "At Year 2: Receive investment proceeds $1,000 * e^(0.04 * 2) = $1,083.29",
              "Effective return in Year 2: $1,083.29 / $1,030.45 = e^(0.05 * 1) -> 5.0%"
            ],
            winnerBanner: "Synthetic Borrowing Locks Forward Rate Without Basis Risk"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "Strategy A: Borrow Period T1",
              rightTitle: "Strategy B: Invest Period T2",
              comparisonPoints: [
                "Time 0: Borrow $1,000 at 3% for 1 year",
                "Time 0: Invest the $1,000 at 4% for 2 years",
                "Net cash flow at Time 0 is exactly zero dollars"
              ]
            },
            semantics: {
              teachingObjective: "Present cash-and-carry synthetic forward loan replication",
              sourceFactIds: ["fact-02"]
            }
          }
        },
        {
          id: "b11",
          hindi_tts: "तरीका यह है: एक साल के लिए पैसा उधार लो, और उसी पैसे को दो साल के लिए इनवेस्ट कर दो।",
          en_subtitle: "Borrow for 1 year, and simultaneously invest the proceeds for 2 years.",
          en_narration: "Borrow cash for 1 year, and simultaneously invest the funds for 2 years.",
          pauseAfterMs: 400,
          ui_state: {
            leftTitle: "Strategy A: Borrow Period T1",
            rightTitle: "Strategy B: Invest Period T2",
            leftBadge: "Short-Term Cash Inflow",
            rightBadge: "Long-Term Guaranteed Outflow",
            leftSubtitle: "Borrow $1,000 for 1 year at 3%",
            rightSubtitle: "Invest $1,000 for 2 years at 4%",
            comparisonPoints: [
              "Time 0: Borrow $1,000 at 3% for 1 year",
              "Time 0: Invest the $1,000 at 4% for 2 years",
              "Net cash flow at Time 0 is exactly zero dollars",
              "At Year 1: Must repay $1,030.45 (cash needed in Year 1)",
              "At Year 2: Receives $1,083.29 (guaranteed cash payoff)",
              "Replicates an investment of $1,030.45 growing to $1,083.29 in Year 2"
            ],
            winnerBanner: "Synthetic Borrowing Locks Forward Rate Without Basis Risk"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "Strategy A: Borrow Period T1",
              rightTitle: "Strategy B: Invest Period T2",
              comparisonPoints: [
                "At Year 1: Repay short loan at R1",
                "At Year 2: Receive long investment at R2",
                "Locks incremental Year 2 return precisely at RF"
              ]
            },
            semantics: {
              teachingObjective: "Explain cash flow timing of synthetic forward commitment",
              sourceFactIds: ["fact-02"]
            }
          }
        },
        {
          id: "b12",
          hindi_tts: "आज कोई पैसा नहीं लगा, लेकिन दूसरे साल का रिटर्न ठीक पांच परसेंट पर लॉक हो गया। इसे नो-आर्बिट्राज कहते हैं!",
          en_subtitle: "Zero initial cash outlay locks year-2 borrowing cost at 5.0% through no-arbitrage.",
          en_narration: "Zero cash was invested today, yet the second-year return was locked at 5.0% by no-arbitrage.",
          pauseAfterMs: 500,
          ui_state: {
            leftTitle: "Strategy A: Borrow Period T1",
            rightTitle: "Strategy B: Invest Period T2",
            leftBadge: "Short-Term Cash Inflow",
            rightBadge: "Long-Term Guaranteed Outflow",
            leftSubtitle: "Borrow $1,000 for 1 year at 3%",
            rightSubtitle: "Invest $1,000 for 2 years at 4%",
            comparisonPoints: [
              "No-Arbitrage Condition: Market forward rate MUST equal RF",
              "If market forward rate > 5.0%: Borrow spot long, invest forward -> Free Profit",
              "If market forward rate < 5.0%: Borrow forward, invest spot long -> Free Profit",
              "Arbitrage forces forward contracts to trade exactly at continuous RF"
            ],
            winnerBanner: "Arbitrage Forces Forward Price to Obey Theoretical RF"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "Synthetic Replication",
              rightTitle: "Market Arbitrage Pressure",
              comparisonPoints: [
                "Arbitrage bounds eliminate pricing misalignments",
                "Zero net capital required at inception",
                "Guarantees that market forward rate equals theoretical formula"
              ]
            },
            semantics: {
              teachingObjective: "Demonstrate why arbitrage forces forward rates to match formula",
              sourceFactIds: ["fact-02"]
            }
          }
        }
      ]
    },

    // Scene 4: Forward Rate Agreement (FRA) Architecture (progressive_cards)
    {
      segmentIndex: 4,
      title: "Forward Rate Agreement (FRA) Architecture",
      template: "progressive_cards",
      badge: "OTC Derivatives Market",
      beats: [
        {
          id: "b13",
          hindi_tts: "फॉरवर्ड रेट एग्रीमेंट यानी FRA, भविष्य की ब्याज दर को पहले से तय करने का एक ओवर-द-काउंटर कॉन्ट्रैक्ट है।",
          en_subtitle: "A Forward Rate Agreement is an OTC derivative locking in a future interest rate.",
          en_narration: "A Forward Rate Agreement is an over-the-counter derivative designed to fix a future interest rate.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "Card 1: OTC Interest Rate Lock",
                subtitle: "Bilateral Forward Agreement",
                value: "Contract Rate R_K",
                badge: "Custom Terms",
                state: "active_teal",
                bulletPoints: [
                  "Bilateral contract traded between corporations and investment banks",
                  "Specifies borrowing period from time T1 to time T2 (e.g., 3x6 or 1x2 FRA)",
                  "Fixes borrowing cost at agreed contract rate R_K"
                ]
              },
              {
                title: "Card 2: Fixed Rate Payer",
                subtitle: "The Corporate Borrower Hedge",
                value: "Receives Floating R_M",
                badge: "Hedges Rate Hikes",
                state: "muted",
                bulletPoints: [
                  "Pays agreed fixed contract rate R_K",
                  "Receives realized market floating rate R_M",
                  "Perfect hedge for borrowers needing floating debt protection"
                ]
              },
              {
                title: "Card 3: Floating Rate Payer",
                subtitle: "The Institutional Lender Hedge",
                value: "Receives Fixed R_K",
                badge: "Hedges Rate Cuts",
                state: "muted",
                bulletPoints: [
                  "Pays realized market floating rate R_M",
                  "Receives agreed fixed contract rate R_K",
                  "Protects bond funds and lenders from declining reinvestment yields"
                ]
              },
              {
                title: "Card 4: Notional Cash Settlement",
                subtitle: "Pure Interest Differential",
                value: "Advance Settlement at T1",
                badge: "Zero Principal Risk",
                state: "muted",
                bulletPoints: [
                  "Principal L is purely notional and never changes hands",
                  "Cash settlement occurs at time T1 discounted back from T2",
                  "Eliminates counterparty credit risk during the borrowing period"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 0,
              cardCount: 4,
              focusTopic: "Card 1: OTC Interest Rate Lock"
            },
            semantics: {
              teachingObjective: "Introduce FRA contract specifications and OTC nature",
              sourceFactIds: ["fact-03"]
            }
          }
        },
        {
          id: "b14",
          hindi_tts: "फिक्स रेट पेयर वह कंपनी होती है जो ब्याज बढ़ने के डर से फिक्स रेट R-के देकर फ्लोटिंग रेट R-एम लेती है।",
          en_subtitle: "The fixed rate payer receives floating R_M and pays fixed R_K to cap borrowing costs.",
          en_narration: "The fixed rate payer receives floating rate R_M and pays fixed rate R_K to hedge against rate hikes.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "Card 1: OTC Interest Rate Lock",
                subtitle: "Bilateral Forward Agreement",
                value: "Contract Rate R_K",
                badge: "Custom Terms",
                state: "muted",
                bulletPoints: [
                  "Bilateral contract traded between corporations and investment banks",
                  "Specifies borrowing period from time T1 to time T2 (e.g., 3x6 or 1x2 FRA)",
                  "Fixes borrowing cost at agreed contract rate R_K"
                ]
              },
              {
                title: "Card 2: Fixed Rate Payer",
                subtitle: "The Corporate Borrower Hedge",
                value: "Receives Floating R_M",
                badge: "Hedges Rate Hikes",
                state: "active_teal",
                bulletPoints: [
                  "Pays agreed fixed contract rate R_K",
                  "Receives realized market floating rate R_M",
                  "If market rate spikes to 7%, the FRA pays the 2% difference to the company"
                ]
              },
              {
                title: "Card 3: Floating Rate Payer",
                subtitle: "The Institutional Lender Hedge",
                value: "Receives Fixed R_K",
                badge: "Hedges Rate Cuts",
                state: "muted",
                bulletPoints: [
                  "Pays realized market floating rate R_M",
                  "Receives agreed fixed contract rate R_K",
                  "Protects bond funds and lenders from declining reinvestment yields"
                ]
              },
              {
                title: "Card 4: Notional Cash Settlement",
                subtitle: "Pure Interest Differential",
                value: "Advance Settlement at T1",
                badge: "Zero Principal Risk",
                state: "muted",
                bulletPoints: [
                  "Principal L is purely notional and never changes hands",
                  "Cash settlement occurs at time T1 discounted back from T2",
                  "Eliminates counterparty credit risk during the borrowing period"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 1,
              cardCount: 4,
              focusTopic: "Card 2: Fixed Rate Payer"
            },
            semantics: {
              teachingObjective: "Explain borrower hedging mechanism using fixed-rate payer position",
              sourceFactIds: ["fact-03"]
            }
          }
        },
        {
          id: "b15",
          hindi_tts: "वहीं फ्लोटिंग रेट पेयर, ब्याज गिरने से बचने के लिए फ्लोटिंग देकर फिक्स रिटर्न पक्का करता है।",
          en_subtitle: "The floating rate payer pays floating R_M and receives fixed R_K to lock lending income.",
          en_narration: "The floating rate payer pays floating rate R_M and receives fixed rate R_K to protect lending returns.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "Card 1: OTC Interest Rate Lock",
                subtitle: "Bilateral Forward Agreement",
                value: "Contract Rate R_K",
                badge: "Custom Terms",
                state: "muted",
                bulletPoints: [
                  "Bilateral contract traded between corporations and investment banks",
                  "Specifies borrowing period from time T1 to time T2",
                  "Fixes borrowing cost at agreed contract rate R_K"
                ]
              },
              {
                title: "Card 2: Fixed Rate Payer",
                subtitle: "The Corporate Borrower Hedge",
                value: "Receives Floating R_M",
                badge: "Hedges Rate Hikes",
                state: "muted",
                bulletPoints: [
                  "Pays agreed fixed contract rate R_K",
                  "Receives realized market floating rate R_M",
                  "If market rate spikes to 7%, FRA pays the difference"
                ]
              },
              {
                title: "Card 3: Floating Rate Payer",
                subtitle: "The Institutional Lender Hedge",
                value: "Receives Fixed R_K",
                badge: "Hedges Rate Cuts",
                state: "active_teal",
                bulletPoints: [
                  "Pays realized market floating rate R_M",
                  "Receives agreed fixed contract rate R_K",
                  "If central bank slashes rates to 2%, FRA locks 5% lending yield"
                ]
              },
              {
                title: "Card 4: Notional Cash Settlement",
                subtitle: "Pure Interest Differential",
                value: "Advance Settlement at T1",
                badge: "Zero Principal Risk",
                state: "muted",
                bulletPoints: [
                  "Principal L is purely notional and never changes hands",
                  "Cash settlement occurs at time T1 discounted back from T2",
                  "Eliminates counterparty credit risk during the borrowing period"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 2,
              cardCount: 4,
              focusTopic: "Card 3: Floating Rate Payer"
            },
            semantics: {
              teachingObjective: "Explain lender hedging mechanism using floating-rate payer position",
              sourceFactIds: ["fact-03"]
            }
          }
        },
        {
          id: "b16",
          hindi_tts: "सबसे अच्छी बात यह है कि प्रिंसिपल कभी ट्रांसफर नहीं होता; केवल ब्याज का अंतर ही सेटल किया जाता है।",
          en_subtitle: "Principal is purely notional; only the net interest spread is settled in cash.",
          en_narration: "Best of all, principal is purely notional; only the net interest spread is settled in cash.",
          pauseAfterMs: 500,
          ui_state: {
            cards: [
              {
                title: "Card 1: OTC Interest Rate Lock",
                subtitle: "Bilateral Forward Agreement",
                value: "Contract Rate R_K",
                badge: "Custom Terms",
                state: "muted",
                bulletPoints: [
                  "Bilateral contract traded between corporations and investment banks",
                  "Specifies borrowing period from time T1 to time T2",
                  "Fixes borrowing cost at agreed contract rate R_K"
                ]
              },
              {
                title: "Card 2: Fixed Rate Payer",
                subtitle: "The Corporate Borrower Hedge",
                value: "Receives Floating R_M",
                badge: "Hedges Rate Hikes",
                state: "muted",
                bulletPoints: [
                  "Pays agreed fixed contract rate R_K",
                  "Receives realized market floating rate R_M"
                ]
              },
              {
                title: "Card 3: Floating Rate Payer",
                subtitle: "The Institutional Lender Hedge",
                value: "Receives Fixed R_K",
                badge: "Hedges Rate Cuts",
                state: "muted",
                bulletPoints: [
                  "Pays realized market floating rate R_M",
                  "Receives agreed fixed contract rate R_K"
                ]
              },
              {
                title: "Card 4: Notional Cash Settlement",
                subtitle: "Pure Interest Differential",
                value: "Advance Settlement at T1",
                badge: "Zero Principal Risk",
                state: "active_amber",
                bulletPoints: [
                  "Principal L is purely notional ($100M is never exchanged)",
                  "Only interest difference |R_M - R_K| is paid between parties",
                  "Settlement at T1 eliminates default exposure over the loan lifecycle"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 3,
              cardCount: 4,
              focusTopic: "Card 4: Notional Cash Settlement"
            },
            semantics: {
              teachingObjective: "Clarify notional principal concept and net interest settlement",
              sourceFactIds: ["fact-03", "fact-04"]
            }
          }
        }
      ]
    },

    // Scene 5: FRA Discounted Settlement at Time T1 (formula_breakdown)
    {
      segmentIndex: 5,
      title: "FRA Settlement at Time T1",
      template: "formula_breakdown",
      badge: "Advance Cash Settlement",
      beats: [
        {
          id: "b17",
          hindi_tts: "साधारण लोन में ब्याज हमेशा पीरियड के अंत में यानी T-टू पर दिया जाता है।",
          en_subtitle: "Under standard loans, interest is paid in arrears at loan maturity T2.",
          en_narration: "Under standard loans, interest payments are made in arrears at loan maturity T2.",
          pauseAfterMs: 400,
          ui_state: {
            title: "FRA Discounted Settlement at Time T1",
            expression: "S_{T_1} = \\frac{L (R_M - R_K) \\tau}{1 + R_M \\tau}",
            variables: [
              { symbol: "L", label: "Notional Principal", description: "Contract principal amount", unit: "$" },
              { symbol: "R_M", label: "Market Floating Rate", description: "Observed spot benchmark rate at time T1", unit: "%" },
              { symbol: "R_K", label: "Fixed Contract Rate", description: "Agreed fixed FRA interest rate", unit: "%" },
              { symbol: "\\tau", label: "Accrual Fraction", description: "Length of borrowing period T2 - T1 in years", unit: "years" }
            ],
            steps: [
              { stepIndex: 0, label: "Arrears Payoff at Maturity T2", equation: "\\text{Payoff}_{T_2} = L (R_M - R_K) \\tau", note: "Undiscounted interest cash flow due at end of borrowing period" }
            ],
            assumptions: ["Rates in FRA contracts are discretely compounded money market rates."],
            interpretation: "Payoff compensates the borrower for market rates exceeding contract rate RK."
          },
          visual: {
            kind: "formula",
            data: {
              title: "FRA Discounted Settlement at Time T1",
              expression: "S_{T_1} = \\frac{L (R_M - R_K) \\tau}{1 + R_M \\tau}",
              variables: [
                { symbol: "L", label: "Notional Principal", description: "Contract principal amount", unit: "$" },
                { symbol: "R_M", label: "Market Floating Rate", description: "Observed spot benchmark rate at time T1", unit: "%" },
                { symbol: "R_K", label: "Fixed Contract Rate", description: "Agreed fixed FRA interest rate", unit: "%" },
                { symbol: "\\tau", label: "Accrual Fraction", description: "Length of borrowing period T2 - T1 in years", unit: "years" }
              ],
              steps: [
                { stepIndex: 0, label: "Arrears Payoff at Maturity T2", equation: "\\text{Payoff}_{T_2} = L (R_M - R_K) \\tau", note: "Undiscounted interest cash flow due at end of borrowing period" }
              ],
              assumptions: ["Rates in FRA contracts are discretely compounded money market rates."],
              interpretation: "Payoff compensates the borrower for market rates exceeding contract rate RK."
            },
            semantics: {
              teachingObjective: "Present standard undiscounted arrears interest payoff at maturity T2",
              sourceFactIds: ["fact-04"]
            }
          }
        },
        {
          id: "b18",
          hindi_tts: "लेकिन FRA में सेटलमेंट लोन शुरू होते ही यानी T-वन पर हो जाता है, इसलिए इसे डिस्काउंट करना जरूरी है।",
          en_subtitle: "Because FRAs settle in advance at T1, the payoff must be discounted back by R_M.",
          en_narration: "Because FRAs settle in advance at time T1, the payoff must be discounted back by the market rate.",
          pauseAfterMs: 400,
          ui_state: {
            title: "FRA Discounted Settlement at Time T1",
            expression: "S_{T_1} = \\frac{L (R_M - R_K) \\tau}{1 + R_M \\tau}",
            variables: [
              { symbol: "L", label: "Notional Principal", description: "Contract principal amount", unit: "$" },
              { symbol: "R_M", label: "Market Floating Rate", description: "Observed spot benchmark rate at time T1", unit: "%" },
              { symbol: "R_K", label: "Fixed Contract Rate", description: "Agreed fixed FRA interest rate", unit: "%" },
              { symbol: "\\tau", label: "Accrual Fraction", description: "Length of borrowing period T2 - T1 in years", unit: "years" }
            ],
            steps: [
              { stepIndex: 0, label: "Arrears Payoff at Maturity T2", equation: "\\text{Payoff}_{T_2} = L (R_M - R_K) \\tau", note: "Undiscounted interest difference at loan maturity" },
              { stepIndex: 1, label: "Discount Back to Time T1", equation: "S_{T_1} = \\frac{\\text{Payoff}_{T_2}}{1 + R_M \\tau}", note: "Divide by money market discount factor" }
            ],
            assumptions: ["Rates in FRA contracts are discretely compounded money market rates."],
            interpretation: "Discounting ensures the advance payment equals the economic value of the loan interest savings."
          },
          visual: {
            kind: "formula",
            data: {
              title: "FRA Discounted Settlement at Time T1",
              expression: "S_{T_1} = \\frac{L (R_M - R_K) \\tau}{1 + R_M \\tau}",
              variables: [
                { symbol: "L", label: "Notional Principal", description: "Contract principal amount", unit: "$" },
                { symbol: "R_M", label: "Market Floating Rate", description: "Observed spot benchmark rate at time T1", unit: "%" },
                { symbol: "R_K", label: "Fixed Contract Rate", description: "Agreed fixed FRA interest rate", unit: "%" },
                { symbol: "\\tau", label: "Accrual Fraction", description: "Length of borrowing period T2 - T1 in years", unit: "years" }
              ],
              steps: [
                { stepIndex: 0, label: "Arrears Payoff at Maturity T2", equation: "\\text{Payoff}_{T_2} = L (R_M - R_K) \\tau", note: "Undiscounted interest difference at loan maturity" },
                { stepIndex: 1, label: "Discount Back to Time T1", equation: "S_{T_1} = \\frac{\\text{Payoff}_{T_2}}{1 + R_M \\tau}", note: "Divide by money market discount factor" }
              ],
              assumptions: ["Rates in FRA contracts are discretely compounded money market rates."],
              interpretation: "Discounting ensures the advance payment equals the economic value of the loan interest savings."
            },
            semantics: {
              teachingObjective: "Derive the exact discounted advance settlement formula at time T1",
              sourceFactIds: ["fact-04"]
            }
          }
        },
        {
          id: "b19",
          hindi_tts: "एडवांस सेटलमेंट से दोनों पार्टियों का काउंटरपार्टी रिस्क खत्म हो जाता है, क्योंकि लोन चलने के दौरान कोई पैसा बाकी नहीं रहता।",
          en_subtitle: "Advance settlement removes counterparty credit risk during the subsequent borrowing period.",
          en_narration: "Advance settlement eliminates counterparty credit risk during the subsequent borrowing period.",
          pauseAfterMs: 500,
          ui_state: {
            title: "FRA Discounted Settlement at Time T1",
            expression: "S_{T_1} = \\frac{L (R_M - R_K) \\tau}{1 + R_M \\tau}",
            variables: [
              { symbol: "L = \\$100\\text{M}", label: "Example Notional", description: "$100 Million notional", unit: "$" },
              { symbol: "R_M = 6\\%", label: "Market Rate", description: "Realized floating rate at T1", unit: "%" },
              { symbol: "R_K = 5\\%", label: "Fixed Rate", description: "Agreed FRA contract rate", unit: "%" },
              { symbol: "\\tau = 0.5\\text{y}", label: "Period", description: "6-month borrowing duration", unit: "years" }
            ],
            steps: [
              { stepIndex: 0, label: "Calculate Arrears Spread", equation: "\\$100\\text{M} \\times (0.06 - 0.05) \\times 0.5 = \\$500,000", note: "Gross interest savings paid at T2" },
              { stepIndex: 1, label: "Apply T1 Discounting", equation: "\\frac{\\$500,000}{1 + (0.06 \\times 0.5)} = \\frac{\\$500,000}{1.03} = \\$485,437", note: "Fixed payer receives $485,437 cash upfront at T1" }
            ],
            assumptions: ["Rates in FRA contracts are discretely compounded money market rates."],
            interpretation: "The borrower invests $485,437 at 6% for 6 months to generate the exact $500,000 needed to offset interest."
          },
          visual: {
            kind: "formula",
            data: {
              title: "FRA Discounted Settlement at Time T1",
              expression: "S_{T_1} = \\frac{L (R_M - R_K) \\tau}{1 + R_M \\tau}",
              variables: [
                { symbol: "L = \\$100\\text{M}", label: "Example Notional", description: "$100 Million notional", unit: "$" },
                { symbol: "R_M = 6\\%", label: "Market Rate", description: "Realized floating rate at T1", unit: "%" },
                { symbol: "R_K = 5\\%", label: "Fixed Rate", description: "Agreed FRA contract rate", unit: "%" },
                { symbol: "\\tau = 0.5\\text{y}", label: "Period", description: "6-month borrowing duration", unit: "years" }
              ],
              steps: [
                { stepIndex: 0, label: "Calculate Arrears Spread", equation: "\\$100\\text{M} \\times (0.06 - 0.05) \\times 0.5 = \\$500,000", note: "Gross interest savings paid at T2" },
                { stepIndex: 1, label: "Apply T1 Discounting", equation: "\\frac{\\$500,000}{1 + (0.06 \\times 0.5)} = \\frac{\\$500,000}{1.03} = \\$485,437", note: "Fixed payer receives $485,437 cash upfront at T1" }
              ],
              assumptions: ["Rates in FRA contracts are discretely compounded money market rates."],
              interpretation: "The borrower invests $485,437 at 6% for 6 months to generate the exact $500,000 needed to offset interest."
            },
            semantics: {
              teachingObjective: "Walk through complete numerical settlement calculation showing $485,437 payout",
              sourceFactIds: ["fact-04"]
            }
          }
        }
      ]
    },

    // Scene 6: Valuation of an Existing FRA (split_comparison)
    {
      segmentIndex: 6,
      title: "FRA Inception vs Mid-Life Valuation",
      template: "split_comparison",
      badge: "Mark-to-Market Accounting",
      beats: [
        {
          id: "b20",
          hindi_tts: "कॉन्ट्रैक्ट शुरू होते समय FRA की वैल्यू जीरो होती है, क्योंकि फिक्स रेट R-के को फॉरवर्ड रेट के बराबर रखा जाता है।",
          en_subtitle: "At contract inception, an FRA has zero value because R_K equals market forward rate R_F.",
          en_narration: "At contract inception, an FRA has zero value because contract rate R_K equals current forward rate R_F.",
          pauseAfterMs: 400,
          ui_state: {
            leftTitle: "Inception Valuation (Time 0)",
            rightTitle: "Mid-Life Mark-to-Market (Time t)",
            leftBadge: "Fair Value Inception",
            rightBadge: "Balance Sheet P&L",
            leftSubtitle: "V_FRA = $0 at Trade Date",
            rightSubtitle: "V_FRA = L(R_F - R_K)(T2 - T1) * e^(-R2*T2)",
            comparisonPoints: [
              "Contract rate R_K is set exactly equal to market forward rate R_F",
              "Net economic value at inception is precisely zero",
              "Zero cash changes hands between corporate borrower and dealer bank",
              "As spot zero curves shift, new forward rates R_F diverge from R_K",
              "Mid-life value equals discounted spread between new R_F and fixed R_K",
              "Changes in value are recognized daily under IFRS 9 / ASC 815 hedge accounting"
            ],
            winnerBanner: "Forward Rate Shifts Create Immediate Balance Sheet P&L"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "Inception: V_FRA = 0",
              rightTitle: "Mid-Life: V_FRA = P&L",
              comparisonPoints: [
                "Trade Date: R_K = R_F implies zero fair value",
                "Mid-Life: Shift in R_F generates asset or liability",
                "Discounted using zero rate R_2 to maturity T2"
              ]
            },
            semantics: {
              teachingObjective: "Contrast initial zero-value contract with mid-life mark-to-market valuation",
              sourceFactIds: ["fact-05"]
            }
          }
        },
        {
          id: "b21",
          hindi_tts: "जैसे ही मार्केट में ब्याज दरें बदलती हैं, FRA की वैल्यू नए फॉरवर्ड रेट और पुराने रेट के अंतर से तय होती है।",
          en_subtitle: "As market curves shift, FRA value reflects the spread between new forward rates and R_K.",
          en_narration: "As market curves shift, FRA value reflects the discounted spread between new forward rates and R_K.",
          pauseAfterMs: 400,
          ui_state: {
            leftTitle: "Inception Valuation (Time 0)",
            rightTitle: "Mid-Life Mark-to-Market (Time t)",
            leftBadge: "Fair Value Inception",
            rightBadge: "Balance Sheet P&L",
            leftSubtitle: "V_FRA = $0 at Trade Date",
            rightSubtitle: "V_FRA = L(R_F - R_K)(T2 - T1) * e^(-R2*T2)",
            comparisonPoints: [
              "If market forward rate R_F rises above R_K:",
              "Fixed rate payer has a positive asset on balance sheet",
              "The contract can be closed out or assigned for immediate cash profit",
              "If market forward rate R_F falls below R_K:",
              "Fixed rate payer has an unrealized liability requiring cash reserves"
            ],
            winnerBanner: "Forward Rate Shifts Create Immediate Balance Sheet P&L"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "Rising Forward Rates",
              rightTitle: "Falling Forward Rates",
              comparisonPoints: [
                "R_F > R_K: Asset for fixed payer / Liability for dealer",
                "R_F < R_K: Liability for fixed payer / Asset for dealer",
                "Perfect hedge offsetting underlying floating loan expense"
              ]
            },
            semantics: {
              teachingObjective: "Explain directional mark-to-market sensitivity for FRA hedgers",
              sourceFactIds: ["fact-05"]
            }
          }
        },
        {
          id: "b22",
          hindi_tts: "इस तरह, कंपनी के लोन का खर्च पूरी तरह सुरक्षित रहता है और ब्याज बढ़ने पर डेरिवेटिव से मुनाफा मिलता है।",
          en_subtitle: "Corporate loan expenses remain capped as derivative gains offset rising debt interest.",
          en_narration: "Corporate loan expenses remain strictly capped because derivative gains offset rising debt interest.",
          pauseAfterMs: 500,
          ui_state: {
            leftTitle: "Loan Interest Expense",
            rightTitle: "FRA Derivative Cash Inflow",
            leftBadge: "Higher Bank Debt Rate",
            rightBadge: "Compensating Derivative Gain",
            leftSubtitle: "Company pays floating R_M to bank",
            rightSubtitle: "Company receives (R_M - R_K) from dealer",
            comparisonPoints: [
              "Gross borrowing cost at bank: R_M floating rate",
              "Cash received from FRA settlement: (R_M - R_K)",
              "Net effective interest paid: R_M - (R_M - R_K) = R_K exactly",
              "Total corporate borrowing cost is locked with 100% certainty"
            ],
            winnerBanner: "Synthetic Fixed Rate Achieved: Net Cost Equals R_K"
          },
          visual: {
            kind: "comparison",
            data: {
              leftTitle: "Loan Interest",
              rightTitle: "FRA Inflow",
              comparisonPoints: [
                "Floating loan expense: R_M",
                "FRA settlement gain: R_M - R_K",
                "Net locked interest expense: R_K"
              ]
            },
            semantics: {
              teachingObjective: "Prove that FRA combined with floating debt locks fixed interest rate R_K",
              sourceFactIds: ["fact-03", "fact-04", "fact-05"]
            }
          }
        }
      ]
    },

    // Scene 7: Orange County's Yield Curve Disaster (progressive_cards)
    {
      segmentIndex: 7,
      title: "Orange County Bankruptcy: Repo Leverage Trap",
      template: "progressive_cards",
      badge: "Historical Case Study (Snapshot 4.1)",
      beats: [
        {
          id: "b23",
          hindi_tts: "1994 में, ऑरेंज काउंटी के ट्रेजरार बॉब सिट्रॉन ने यील्ड कर्व पर एक खतरनाक दांव खेला।",
          en_subtitle: "In 1994, Orange County treasurer Bob Citron made a catastrophic leveraged yield curve bet.",
          en_narration: "In 1994, Orange County treasurer Bob Citron made a catastrophic leveraged yield curve bet.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Repo Leverage Machine",
                subtitle: "Financing $20.5B on $7.5B Equity",
                value: "Leverage ~ 3:1",
                badge: "$13B Short Repo",
                state: "active_amber",
                bulletPoints: [
                  "Orange County had $7.5B in tax and municipal funds",
                  "Borrowed $13B in short-term reverse repo agreements",
                  "Built a massive $20.5B leveraged fixed income portfolio"
                ]
              },
              {
                title: "2. The Inverse Floater Bet",
                subtitle: "Betting Interest Rates Would Never Rise",
                value: "High Yield Carry",
                badge: "Medium-Term Notes",
                state: "muted",
                bulletPoints: [
                  "Invested heavily in inverse floating-rate notes",
                  "Yields rose when interest rates fell, but collapsed if rates rose",
                  "Funded entirely by rolling overnight and short-term repo debt"
                ]
              },
              {
                title: "3. Fed Tightening Shock",
                subtitle: "Six Rate Hikes in 1994 (+250 bps)",
                value: "Inverted Carry",
                badge: "Funding Spread Inverts",
                state: "muted",
                bulletPoints: [
                  "Federal Reserve raised rates 6 consecutive times from 3% to 5.5%",
                  "Short repo borrowing costs surged far above inverse floater yields",
                  "Portfolio suffered catastrophic negative carry every single day"
                ]
              },
              {
                title: "4. Margin Collapse & Bankruptcy",
                subtitle: "$1.6 Billion Municipal Liquidation",
                value: "Chapter 9 Bankruptcy",
                badge: "Catastrophic Failure",
                state: "muted",
                bulletPoints: [
                  "Wall Street lenders demanded $1B+ in immediate cash margin calls",
                  "County could not meet margin; dealers seized and liquidated collateral",
                  "Suffered $1.6B loss and filed largest municipal bankruptcy in US history"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 0,
              cardCount: 4,
              focusTopic: "1. Repo Leverage Machine"
            },
            semantics: {
              teachingObjective: "Present Orange County's $13B repo leverage mechanism and scale",
              sourceFactIds: ["fact-07"]
            }
          }
        },
        {
          id: "b24",
          hindi_tts: "उन्होंने साढ़े सात अरब डॉलर के फंड्स को तेरह अरब डॉलर के रेपो लोन से लीवरेज कर के बीस अरब डॉलर बना दिया।",
          en_subtitle: "Citron used $13B in short repo loans to expand $7.5B of county equity into $20.5B.",
          en_narration: "Citron leveraged seven point five billion of county equity into a twenty billion portfolio via repo.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Repo Leverage Machine",
                subtitle: "Financing $20.5B on $7.5B Equity",
                value: "Leverage ~ 3:1",
                badge: "$13B Short Repo",
                state: "muted",
                bulletPoints: [
                  "Orange County had $7.5B in tax and municipal funds",
                  "Borrowed $13B in short-term reverse repo agreements",
                  "Built a massive $20.5B leveraged fixed income portfolio"
                ]
              },
              {
                title: "2. The Inverse Floater Bet",
                subtitle: "Betting Interest Rates Would Never Rise",
                value: "High Yield Carry",
                badge: "Medium-Term Notes",
                state: "active_amber",
                bulletPoints: [
                  "Invested heavily in inverse floating-rate notes",
                  "Yield formula: Coupon = 10% - 2 * LIBOR",
                  "High yields lured municipal officials into ignoring term risk"
                ]
              },
              {
                title: "3. Fed Tightening Shock",
                subtitle: "Six Rate Hikes in 1994 (+250 bps)",
                value: "Inverted Carry",
                badge: "Funding Spread Inverts",
                state: "muted",
                bulletPoints: [
                  "Federal Reserve raised rates 6 consecutive times from 3% to 5.5%",
                  "Short repo borrowing costs surged far above inverse floater yields",
                  "Portfolio suffered catastrophic negative carry every single day"
                ]
              },
              {
                title: "4. Margin Collapse & Bankruptcy",
                subtitle: "$1.6 Billion Municipal Liquidation",
                value: "Chapter 9 Bankruptcy",
                badge: "Catastrophic Failure",
                state: "muted",
                bulletPoints: [
                  "Wall Street lenders demanded $1B+ in immediate cash margin calls",
                  "County could not meet margin; dealers seized and liquidated collateral",
                  "Suffered $1.6B loss and filed largest municipal bankruptcy in US history"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 1,
              cardCount: 4,
              focusTopic: "2. The Inverse Floater Bet"
            },
            semantics: {
              teachingObjective: "Explain inverse floater structure and dependence on low interest rates",
              sourceFactIds: ["fact-07"]
            }
          }
        },
        {
          id: "b25",
          hindi_tts: "लेकिन जब 1994 में फेड ने छह बार ब्याज दरें बढ़ाईं, तो शॉर्ट-टर्म रेपो का खर्च इन्वेस्टमेंट्स की कमाई से ज्यादा हो गया!",
          en_subtitle: "When the Fed hiked rates 6 times in 1994, repo borrowing costs exceeded asset yields.",
          en_narration: "When the Federal Reserve hiked rates six times in 1994, repo funding costs soared above asset yields.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Repo Leverage Machine",
                subtitle: "Financing $20.5B on $7.5B Equity",
                value: "Leverage ~ 3:1",
                badge: "$13B Short Repo",
                state: "muted",
                bulletPoints: [
                  "Orange County had $7.5B in tax and municipal funds",
                  "Borrowed $13B in short-term reverse repo agreements"
                ]
              },
              {
                title: "2. The Inverse Floater Bet",
                subtitle: "Betting Interest Rates Would Never Rise",
                value: "High Yield Carry",
                badge: "Medium-Term Notes",
                state: "muted",
                bulletPoints: [
                  "Invested heavily in inverse floating-rate notes",
                  "Yield formula: Coupon = 10% - 2 * LIBOR"
                ]
              },
              {
                title: "3. Fed Tightening Shock",
                subtitle: "Six Rate Hikes in 1994 (+250 bps)",
                value: "Inverted Carry",
                badge: "Funding Spread Inverts",
                state: "active_teal",
                bulletPoints: [
                  "Short repo funding rate rose from 3% to 5.5%+",
                  "Inverse floater coupons dropped toward 0%",
                  "Double whammy: collateral plunged while financing exploded"
                ]
              },
              {
                title: "4. Margin Collapse & Bankruptcy",
                subtitle: "$1.6 Billion Municipal Liquidation",
                value: "Chapter 9 Bankruptcy",
                badge: "Catastrophic Failure",
                state: "muted",
                bulletPoints: [
                  "Wall Street lenders demanded $1B+ in immediate cash margin calls",
                  "County could not meet margin; dealers seized and liquidated collateral",
                  "Suffered $1.6B loss and filed largest municipal bankruptcy in US history"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 2,
              cardCount: 4,
              focusTopic: "3. Fed Tightening Shock"
            },
            semantics: {
              teachingObjective: "Analyze inverted carry and yield curve sensitivity under rapid rate hikes",
              sourceFactIds: ["fact-07"]
            }
          }
        },
        {
          id: "b26",
          hindi_tts: "नतीजा यह हुआ कि काउंटी को 1.6 बिलियन डॉलर का भारी नुकसान हुआ और उन्होंने दिवालियापन घोषित कर दिया।",
          en_subtitle: "The county suffered a 1.6 billion dollar loss and filed for municipal bankruptcy.",
          en_narration: "Consequently, Orange County lost one point six billion dollars and declared municipal bankruptcy.",
          pauseAfterMs: 500,
          ui_state: {
            cards: [
              {
                title: "1. Repo Leverage Machine",
                subtitle: "Financing $20.5B on $7.5B Equity",
                value: "Leverage ~ 3:1",
                badge: "$13B Short Repo",
                state: "muted",
                bulletPoints: [
                  "Orange County had $7.5B in tax and municipal funds"
                ]
              },
              {
                title: "2. The Inverse Floater Bet",
                subtitle: "Betting Interest Rates Would Never Rise",
                value: "High Yield Carry",
                badge: "Medium-Term Notes",
                state: "muted",
                bulletPoints: [
                  "Invested heavily in inverse floating-rate notes"
                ]
              },
              {
                title: "3. Fed Tightening Shock",
                subtitle: "Six Rate Hikes in 1994 (+250 bps)",
                value: "Inverted Carry",
                badge: "Funding Spread Inverts",
                state: "muted",
                bulletPoints: [
                  "Short repo funding rate rose from 3% to 5.5%+"
                ]
              },
              {
                title: "4. Margin Collapse & Bankruptcy",
                subtitle: "$1.6 Billion Municipal Liquidation",
                value: "Chapter 9 Bankruptcy",
                badge: "Catastrophic Failure",
                state: "active_amber",
                bulletPoints: [
                  "County filed for Chapter 9 municipal bankruptcy in December 1994",
                  "Treasurer Bob Citron resigned and pleaded guilty to felony counts",
                  "Core lesson: Never fund long risky assets with short unhedged repo leverage"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 3,
              cardCount: 4,
              focusTopic: "4. Margin Collapse & Bankruptcy"
            },
            semantics: {
              teachingObjective: "Highlight the ultimate $1.6B bankruptcy and risk management moral",
              sourceFactIds: ["fact-07"]
            }
          }
        }
      ]
    },

    // Scene 8: The 2007-2009 Interbank Liquidity Freeze (progressive_cards)
    {
      segmentIndex: 8,
      title: "The 2007-2009 Interbank Liquidity Freeze",
      template: "progressive_cards",
      badge: "Systemic Risk (Snapshot 4.2)",
      beats: [
        {
          id: "b27",
          hindi_tts: "2007 के संकट में, सबप्राइम मॉर्गेज के नुकसानों ने बैंकों के बीच आपसी विश्वास को पूरी तरह खत्म कर दिया।",
          en_subtitle: "During the 2007 crisis, subprime mortgage contagion destroyed interbank lending trust.",
          en_narration: "During the 2007 crisis, subprime mortgage defaults destroyed interbank lending trust.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Collapse of Trust",
                subtitle: "Subprime Uncertainty Contagion",
                value: "Counterparty Paranoia",
                badge: "Interbank Freeze",
                state: "active_teal",
                bulletPoints: [
                  "Banks could not assess which counterparties held toxic subprime debt",
                  "Institutions refused to lend unsecured funds to peer banks",
                  "Cash hoarding caused liquidity to vanish overnight"
                ]
              },
              {
                title: "2. Commercial Paper Freezes",
                subtitle: "Conduit Refinancing Paralyzed",
                value: "ABCP Disruption",
                badge: "Rollover Failure",
                state: "muted",
                bulletPoints: [
                  "Asset-Backed Commercial Paper (ABCP) market ground to a complete halt",
                  "Money market funds refused to roll over short-dated bank paper",
                  "Banks were forced to bring off-balance-sheet vehicles back onto balance sheets"
                ]
              },
              {
                title: "3. The 364 bps Spread Spike",
                subtitle: "LIBOR-OIS Explodes",
                value: "Historic 364 bps",
                badge: "Credit Risk Surge",
                state: "muted",
                bulletPoints: [
                  "3-month LIBOR-OIS spread, historically 10 bps, blew out to 364 bps",
                  "Reflected massive counterparty credit default and liquidity risks",
                  "Proved LIBOR was no longer a viable proxy for risk-free discounting"
                ]
              },
              {
                title: "4. Central Bank Bailout",
                subtitle: "Emergency Term Lending Facilities",
                value: "Global Liquidity Injection",
                badge: "TAF & Swap Lines",
                state: "muted",
                bulletPoints: [
                  "Federal Reserve created Term Auction Facility (TAF) to lend directly to banks",
                  "Central bank currency swap lines restored dollar funding globally",
                  "Catalyzed the structural transition from LIBOR to OIS and SOFR"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 0,
              cardCount: 4,
              focusTopic: "1. Collapse of Trust"
            },
            semantics: {
              teachingObjective: "Present subprime mortgage contagion and interbank distrust",
              sourceFactIds: ["fact-08"]
            }
          }
        },
        {
          id: "b28",
          hindi_tts: "कमर्शियल पेपर मार्केट पूरी तरह जम गया, और बैंक अपने छोटे-अवधि के पेपर्स को रोलओवर नहीं कर पाए।",
          en_subtitle: "Commercial paper markets froze as institutional investors refused short paper rollovers.",
          en_narration: "Commercial paper markets froze solid as institutional investors refused to roll over short debt.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Collapse of Trust",
                subtitle: "Subprime Uncertainty Contagion",
                value: "Counterparty Paranoia",
                badge: "Interbank Freeze",
                state: "muted",
                bulletPoints: [
                  "Banks could not assess which counterparties held toxic subprime debt",
                  "Institutions refused to lend unsecured funds to peer banks"
                ]
              },
              {
                title: "2. Commercial Paper Freezes",
                subtitle: "Conduit Refinancing Paralyzed",
                value: "ABCP Disruption",
                badge: "Rollover Failure",
                state: "active_teal",
                bulletPoints: [
                  "Asset-Backed Commercial Paper (ABCP) market ground to a complete halt",
                  "Money market funds refused to roll over short-dated bank paper",
                  "Structured investment vehicles (SIVs) suffered fatal liquidity runs"
                ]
              },
              {
                title: "3. The 364 bps Spread Spike",
                subtitle: "LIBOR-OIS Explodes",
                value: "Historic 364 bps",
                badge: "Credit Risk Surge",
                state: "muted",
                bulletPoints: [
                  "3-month LIBOR-OIS spread, historically 10 bps, blew out to 364 bps",
                  "Reflected massive counterparty credit default and liquidity risks",
                  "Proved LIBOR was no longer a viable proxy for risk-free discounting"
                ]
              },
              {
                title: "4. Central Bank Bailout",
                subtitle: "Emergency Term Lending Facilities",
                value: "Global Liquidity Injection",
                badge: "TAF & Swap Lines",
                state: "muted",
                bulletPoints: [
                  "Federal Reserve created Term Auction Facility (TAF) to lend directly to banks",
                  "Central bank currency swap lines restored dollar funding globally"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 1,
              cardCount: 4,
              focusTopic: "2. Commercial Paper Freezes"
            },
            semantics: {
              teachingObjective: "Examine commercial paper market freeze and maturity mismatch traps",
              sourceFactIds: ["fact-08"]
            }
          }
        },
        {
          id: "b29",
          hindi_tts: "लाइबोर और ओआईएस का स्प्रेड, जो हमेशा 10 बेसिस पॉइंट रहता था, उछलकर 364 बेसिस पॉइंट तक पहुंच गया!",
          en_subtitle: "The LIBOR-OIS spread, normally 10 bps, exploded to a record 364 bps.",
          en_narration: "The LIBOR-OIS spread, historically ten basis points, exploded to an unprecedented 364 basis points.",
          pauseAfterMs: 400,
          ui_state: {
            cards: [
              {
                title: "1. Collapse of Trust",
                subtitle: "Subprime Uncertainty Contagion",
                value: "Counterparty Paranoia",
                badge: "Interbank Freeze",
                state: "muted",
                bulletPoints: [
                  "Banks could not assess which counterparties held toxic subprime debt"
                ]
              },
              {
                title: "2. Commercial Paper Freezes",
                subtitle: "Conduit Refinancing Paralyzed",
                value: "ABCP Disruption",
                badge: "Rollover Failure",
                state: "muted",
                bulletPoints: [
                  "Asset-Backed Commercial Paper market ground to a halt"
                ]
              },
              {
                title: "3. The 364 bps Spread Spike",
                subtitle: "LIBOR-OIS Explodes",
                value: "Historic 364 bps",
                badge: "Credit Risk Surge",
                state: "active_amber",
                bulletPoints: [
                  "Spread widened from 10 bps to 364 bps in October 2008",
                  "Quantified the exact fear premium charged for unsecured bank loans",
                  "Forced market makers to acknowledge unsecured funding risks"
                ]
              },
              {
                title: "4. Central Bank Bailout",
                subtitle: "Emergency Term Lending Facilities",
                value: "Global Liquidity Injection",
                badge: "TAF & Swap Lines",
                state: "muted",
                bulletPoints: [
                  "Federal Reserve created Term Auction Facility (TAF) to lend directly to banks"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 2,
              cardCount: 4,
              focusTopic: "3. The 364 bps Spread Spike"
            },
            semantics: {
              teachingObjective: "Analyze the 364 bps LIBOR-OIS spread explosion during peak crisis",
              sourceFactIds: ["fact-08"]
            }
          }
        },
        {
          id: "b30",
          hindi_tts: "सेंट्रल बैंक्स को इमर्जेंसी लिक्विडिटी देनी पड़ी, जिसने हमेशा के लिए साबित किया कि डेरिवेटिव्स में सिर्फ OIS डिस्काउंटिंग ही सही है।",
          en_subtitle: "Central banks injected emergency liquidity, cementing OIS as the true risk-free benchmark.",
          en_narration: "Central banks had to inject massive liquidity, permanently establishing OIS as the true risk-free discount rate.",
          pauseAfterMs: 500,
          ui_state: {
            cards: [
              {
                title: "1. Collapse of Trust",
                subtitle: "Subprime Uncertainty Contagion",
                value: "Counterparty Paranoia",
                badge: "Interbank Freeze",
                state: "muted",
                bulletPoints: [
                  "Banks could not assess counterparty solvency"
                ]
              },
              {
                title: "2. Commercial Paper Freezes",
                subtitle: "Conduit Refinancing Paralyzed",
                value: "ABCP Disruption",
                badge: "Rollover Failure",
                state: "muted",
                bulletPoints: [
                  "Commercial paper rollovers failed"
                ]
              },
              {
                title: "3. The 364 bps Spread Spike",
                subtitle: "LIBOR-OIS Explodes",
                value: "Historic 364 bps",
                badge: "Credit Risk Surge",
                state: "muted",
                bulletPoints: [
                  "LIBOR-OIS reached 364 bps"
                ]
              },
              {
                title: "4. Central Bank Bailout",
                subtitle: "Emergency Term Lending Facilities",
                value: "Global Liquidity Injection",
                badge: "TAF & Swap Lines",
                state: "active_teal",
                bulletPoints: [
                  "Unprecedented central bank intervention saved the financial system",
                  "Regulators mandated clearinghouses and daily cash margin",
                  "Daily collateral earns the overnight rate, confirming OIS as the discount curve"
                ]
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              activeCardIndex: 3,
              cardCount: 4,
              focusTopic: "4. Central Bank Bailout"
            },
            semantics: {
              teachingObjective: "Connect central bank liquidity measures to modern OIS discounting doctrine",
              sourceFactIds: ["fact-08"]
            }
          }
        }
      ]
    },

    // Scene 9: Active Recall: Implied Forward Rate Calculation (interactive_quiz)
    {
      segmentIndex: 9,
      title: "Active Recall: Implied Forward Rate Calculation",
      template: "interactive_quiz",
      badge: "Knowledge Verification",
      beats: [
        {
          id: "b31",
          hindi_tts: "राजू के लिए एक सवाल: अगर एक साल का रेट 4.0% और दो साल का रेट 4.5% है, तो दूसरे साल का फॉरवर्ड रेट क्या होगा?",
          en_subtitle: "Test question: If 1-year is 4.0% and 2-year is 4.5%, what is year-2 forward rate?",
          en_narration: "A question for Raju: If the 1-year rate is 4.0% and the 2-year rate is 4.5%, what is the forward rate for Year 2?",
          pauseAfterMs: 400,
          ui_state: {
            question: "Given a 1-year continuous rate of 4.0% and a 2-year continuous rate of 4.5%, calculate the forward rate for Year 2.",
            options: [
              "A) 4.25% per annum continuous",
              "B) 5.0% per annum continuous",
              "C) 4.75% per annum continuous",
              "D) 5.5% per annum continuous"
            ],
            selectedOption: null,
            isCorrect: null,
            answer: "B) 5.0% per annum continuous",
            showThinkingSpinner: false,
            feedback: "Raju evaluates the forward formula: R_F = (R2*T2 - R1*T1) / (T2 - T1)..."
          },
          visual: {
            kind: "quiz",
            data: {
              question: "Given a 1-year continuous rate of 4.0% and a 2-year continuous rate of 4.5%, calculate the forward rate for Year 2.",
              options: [
                "A) 4.25% per annum continuous",
                "B) 5.0% per annum continuous",
                "C) 4.75% per annum continuous",
                "D) 5.5% per annum continuous"
              ],
              selectedOption: null,
              isCorrect: null,
              answer: "B) 5.0% per annum continuous",
              showThinkingSpinner: false
            },
            semantics: {
              teachingObjective: "Present the active recall forward rate calculation question",
              sourceFactIds: ["fact-01"]
            }
          }
        },
        {
          id: "b32",
          hindi_tts: "रुकिए! राजू ने फार्मूला लगाया: दो साल का कुल 9.0% माइनस पहला साल 4.0%, यानी दूसरे साल का रेट ठीक 5.0% है!",
          en_subtitle: "Raju computes: 0.045*2 - 0.040*1 = 0.090 - 0.040 = 5.0% per annum.",
          en_narration: "Hold on! Raju applies the formula: total two-year 9.0% minus first-year 4.0% gives exactly 5.0%!",
          pauseAfterMs: 3200,
          ui_state: {
            question: "Given a 1-year continuous rate of 4.0% and a 2-year continuous rate of 4.5%, calculate the forward rate for Year 2.",
            options: [
              "A) 4.25% per annum continuous",
              "B) 5.0% per annum continuous",
              "C) 4.75% per annum continuous",
              "D) 5.5% per annum continuous"
            ],
            selectedOption: 1,
            isCorrect: true,
            answer: "B) 5.0% per annum continuous",
            showThinkingSpinner: true,
            feedback: "Raju calculates: (0.045 * 2 - 0.040 * 1) / (2 - 1) = 0.090 - 0.040 = 0.050 (5.0%)."
          },
          visual: {
            kind: "quiz",
            data: {
              question: "Given a 1-year continuous rate of 4.0% and a 2-year continuous rate of 4.5%, calculate the forward rate for Year 2.",
              options: [
                "A) 4.25% per annum continuous",
                "B) 5.0% per annum continuous",
                "C) 4.75% per annum continuous",
                "D) 5.5% per annum continuous"
              ],
              selectedOption: 1,
              isCorrect: true,
              answer: "B) 5.0% per annum continuous",
              showThinkingSpinner: true
            },
            semantics: {
              teachingObjective: "Show user thinking pause and selection of correct answer B",
              sourceFactIds: ["fact-01"]
            }
          }
        },
        {
          id: "b33",
          hindi_tts: "शानदार राजू! 5.0% सही जवाब है। ऊपर उठती यील्ड कर्व में फॉरवर्ड रेट हमेशा जीरो रेट से ऊपर बैठता है!",
          en_subtitle: "Correct! Option B is verified: In upward-sloping yield curves, forward rates exceed zero rates.",
          en_narration: "Brilliant Raju! Option B is correct. In an upward-sloping yield curve, forward rates always lie above zero rates!",
          pauseAfterMs: 500,
          ui_state: {
            question: "Given a 1-year continuous rate of 4.0% and a 2-year continuous rate of 4.5%, calculate the forward rate for Year 2.",
            options: [
              "A) 4.25% per annum continuous",
              "B) 5.0% per annum continuous",
              "C) 4.75% per annum continuous",
              "D) 5.5% per annum continuous"
            ],
            selectedOption: 1,
            isCorrect: true,
            answer: "B) 5.0% per annum continuous",
            showThinkingSpinner: false,
            feedback: "Verified! R_F = (0.090 - 0.040)/1 = 5.0%. To achieve a 4.5% average over 2 years, the 2nd year must earn 5.0%."
          },
          visual: {
            kind: "quiz",
            data: {
              question: "Given a 1-year continuous rate of 4.0% and a 2-year continuous rate of 4.5%, calculate the forward rate for Year 2.",
              options: [
                "A) 4.25% per annum continuous",
                "B) 5.0% per annum continuous",
                "C) 4.75% per annum continuous",
                "D) 5.5% per annum continuous"
              ],
              selectedOption: 1,
              isCorrect: true,
              answer: "B) 5.0% per annum continuous",
              showThinkingSpinner: false
            },
            semantics: {
              teachingObjective: "Validate correct solution and pedagogical intuition behind 5.0% forward rate",
              sourceFactIds: ["fact-01"]
            }
          }
        }
      ]
    },

    // Scene 10: Raju Masters the Yield Curve Horizon (chat_story)
    {
      segmentIndex: 10,
      title: "Raju Masters the Yield Curve Horizon",
      template: "chat_story",
      badge: "Risk Management Desk",
      beats: [
        {
          id: "b34",
          hindi_tts: "शर्मा जी! हमने अपनी कंपनी के लोन को 5.0% के FRA से हेज कर दिया है। अब हमारी फैक्ट्री का बजट पूरी तरह सुरक्षित है!",
          en_subtitle: "Sharma ji, our loan is hedged at 5.0% with an FRA. Our factory expansion is safe!",
          en_narration: "Sharma ji, we locked our loan at 5.0% with an FRA. Our factory expansion budget is safe!",
          pauseAfterMs: 400,
          ui_state: {
            stageDirections: ["— Raju implements corporate FRA hedge —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! We executed an FRA locking our borrowing at 5.0%. Our company's budget is safe!",
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
                  text: "Sharma ji! We executed an FRA locking our borrowing at 5.0%. Our company's budget is safe!",
                  theme: "amber",
                  align: "left"
                }
              ]
            },
            semantics: {
              teachingObjective: "Show successful execution of corporate FRA hedge",
              sourceFactIds: ["fact-03", "fact-04"]
            }
          }
        },
        {
          id: "b35",
          hindi_tts: "बहुत बढ़िया राजू! ऑरेंज काउंटी का सबक हमेशा याद रखना: कभी भी शॉर्ट रेपो के भरोसे लॉन्ग एसेट्स को बिना हेज किए मत छोड़ना।",
          en_subtitle: "Excellent, Raju! Never fund long-term assets with short unhedged repo borrowing.",
          en_narration: "Excellent Raju! Remember Orange County: never use short unhedged repo debt to fund long investments.",
          pauseAfterMs: 400,
          ui_state: {
            stageDirections: ["— Sharma ji reiterates asset-liability discipline —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! We executed an FRA locking our borrowing at 5.0%. Our company's budget is safe!",
                theme: "amber",
                align: "left"
              },
              {
                sender: "Sharma ji",
                avatar: "S",
                text: "Outstanding Raju! Always remember Orange County: funding long assets with short repo leverage is suicide without hedging.",
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
                  text: "Sharma ji! We executed an FRA locking our borrowing at 5.0%. Our company's budget is safe!",
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "Outstanding Raju! Always remember Orange County: funding long assets with short repo leverage is suicide without hedging.",
                  theme: "teal",
                  align: "right"
                }
              ]
            },
            semantics: {
              teachingObjective: "Reinforce duration matching and asset-liability management lessons",
              sourceFactIds: ["fact-07"]
            }
          }
        },
        {
          id: "b36",
          hindi_tts: "बिल्कुल शर्मा जी! यील्ड कर्व का बढ़ना सिर्फ उम्मीदें नहीं, लिक्विडिटी का नियम है। रिस्क मैनेजमेंट हमेशा सबसे पहले!",
          en_subtitle: "Understood! An upward curve reflects liquidity premiums. Risk management comes first!",
          en_narration: "Understood! An upward curve reflects liquidity premiums. Risk management always comes first!",
          pauseAfterMs: 500,
          ui_state: {
            stageDirections: ["— Raju internalizes liquidity preference doctrine —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! We executed an FRA locking our borrowing at 5.0%. Our company's budget is safe!",
                theme: "amber",
                align: "left"
              },
              {
                sender: "Sharma ji",
                avatar: "S",
                text: "Outstanding Raju! Always remember Orange County: funding long assets with short repo leverage is suicide without hedging.",
                theme: "teal",
                align: "right"
              },
              {
                sender: "Raju",
                avatar: "R",
                text: "Understood Sharma ji! Upward yield curves reflect liquidity preference premiums, not guaranteed rate hikes. Risk control first!",
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
                  text: "Sharma ji! We executed an FRA locking our borrowing at 5.0%. Our company's budget is safe!",
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "Outstanding Raju! Always remember Orange County: funding long assets with short repo leverage is suicide without hedging.",
                  theme: "teal",
                  align: "right"
                },
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "Understood Sharma ji! Upward yield curves reflect liquidity preference premiums, not guaranteed rate hikes. Risk control first!",
                  theme: "amber",
                  align: "left"
                }
              ]
            },
            semantics: {
              teachingObjective: "Solidify synthesis of Liquidity Preference Theory and hedge accounting",
              sourceFactIds: ["fact-06", "fact-07"]
            }
          }
        }
      ]
    },

    // Scene 11: The Whole Picture: 8 Core Term Structure Rules (summary_thread)
    {
      segmentIndex: 11,
      title: "The Whole Picture: 8 Core Term Structure Rules",
      template: "summary_thread",
      badge: "Master Chapter Synthesis",
      beats: [
        {
          id: "b37",
          hindi_tts: "पूरा चैप्टर एक नजर में: फॉरवर्ड रेट्स, FRA हेजिंग, और यील्ड कर्व के आठ बुनियादी नियम।",
          en_subtitle: "The entire chapter at a glance: Eight core principles of forward rates and term structure.",
          en_narration: "The complete chapter at a glance: Eight foundational principles governing forward rates and term structure.",
          pauseAfterMs: 400,
          ui_state: {
            headerBadge: "CHAPTER 4 · PART 2 · SUMMARY",
            heading: "Forward Rates & Term Structure Master Thread",
            activeStepIndex: 0,
            activeStepRange: [0, 0],
            steps: [
              "1. Implied Forward Formula: Continuous forward rate R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1) is determined by zero rates.",
              "2. No-Arbitrage Replication: Borrowing for T1 and investing for T2 synthetically replicates a forward loan.",
              "3. FRA Hedging Architecture: Fixed payers receive floating R_M and pay fixed R_K to cap borrowing costs.",
              "4. Advance Settlement Discount: FRAs settling at time T_1 discount payoffs by [1 + R_M*(T_2 - T_1)].",
              "5. Pre-Maturity Valuation: Existing FRAs are valued by discounting the spread between current R_F and contract R_K.",
              "6. Liquidity Preference Reality: Forward rates exceed expected spot rates (R_F > E[R]) by a positive liquidity buffer.",
              "7. Orange County Lesson: Funding long assets with $13B short repo leverage destroyed $1.6B during Fed rate hikes.",
              "8. Interbank Liquidity Freeze: In 2008, commercial paper froze and LIBOR-OIS spread exploded to a record 364 bps."
            ],
            bottomTakeaway: "Forward rates represent no-arbitrage break-evens; liquidity preference creates normal upward slope, and FRAs lock future borrowing costs.",
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [0, 0],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Present executive overview of all 8 term structure rules",
              sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"]
            }
          }
        },
        {
          id: "b38",
          hindi_tts: "पहला नियम: फॉरवर्ड रेट्स जीरो रेट्स से निकाले जाते हैं। दूसरा नियम: बिना डेरिवेटिव्स के कैश बॉन्ड्स से भी फॉरवर्ड रेट बन सकता है।",
          en_subtitle: "First and second: Forward rates are derived from zero rates and replicated synthetically.",
          en_narration: "First and second: Forward rates are implied by zero rates and can be synthetically replicated with spot bonds.",
          pauseAfterMs: 400,
          ui_state: {
            headerBadge: "CHAPTER 4 · PART 2 · SUMMARY",
            heading: "Forward Rates & Term Structure Master Thread",
            activeStepIndex: 1,
            activeStepRange: [1, 2],
            steps: [
              "1. Implied Forward Formula: Continuous forward rate R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1) is determined by zero rates.",
              "2. No-Arbitrage Replication: Borrowing for T1 and investing for T2 synthetically replicates a forward loan.",
              "3. FRA Hedging Architecture: Fixed payers receive floating R_M and pay fixed R_K to cap borrowing costs.",
              "4. Advance Settlement Discount: FRAs settling at time T_1 discount payoffs by [1 + R_M*(T_2 - T_1)].",
              "5. Pre-Maturity Valuation: Existing FRAs are valued by discounting the spread between current R_F and contract R_K.",
              "6. Liquidity Preference Reality: Forward rates exceed expected spot rates (R_F > E[R]) by a positive liquidity buffer.",
              "7. Orange County Lesson: Funding long assets with $13B short repo leverage destroyed $1.6B during Fed rate hikes.",
              "8. Interbank Liquidity Freeze: In 2008, commercial paper froze and LIBOR-OIS spread exploded to a record 364 bps."
            ],
            bottomTakeaway: "Forward rates represent no-arbitrage break-evens; liquidity preference creates normal upward slope, and FRAs lock future borrowing costs.",
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [1, 2],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Focus on Rules 1 and 2: forward rate formula and synthetic replication",
              sourceFactIds: ["fact-01", "fact-02"]
            }
          }
        },
        {
          id: "b39",
          hindi_tts: "तीसरा नियम: FRA से बॉरोअर और लेंडर अपनी दरें लॉक करते हैं। चौथा नियम: T-वन पर एडवांस पेमेंट को डिस्काउंट किया जाता है।",
          en_subtitle: "Third and fourth: FRAs lock borrowing costs, with advance settlement discounted at T1.",
          en_narration: "Third and fourth: FRAs lock future borrowing costs, and advance cash settlement at T1 is strictly discounted.",
          pauseAfterMs: 400,
          ui_state: {
            headerBadge: "CHAPTER 4 · PART 2 · SUMMARY",
            heading: "Forward Rates & Term Structure Master Thread",
            activeStepIndex: 3,
            activeStepRange: [3, 4],
            steps: [
              "1. Implied Forward Formula: Continuous forward rate R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1) is determined by zero rates.",
              "2. No-Arbitrage Replication: Borrowing for T1 and investing for T2 synthetically replicates a forward loan.",
              "3. FRA Hedging Architecture: Fixed payers receive floating R_M and pay fixed R_K to cap borrowing costs.",
              "4. Advance Settlement Discount: FRAs settling at time T_1 discount payoffs by [1 + R_M*(T_2 - T_1)].",
              "5. Pre-Maturity Valuation: Existing FRAs are valued by discounting the spread between current R_F and contract R_K.",
              "6. Liquidity Preference Reality: Forward rates exceed expected spot rates (R_F > E[R]) by a positive liquidity buffer.",
              "7. Orange County Lesson: Funding long assets with $13B short repo leverage destroyed $1.6B during Fed rate hikes.",
              "8. Interbank Liquidity Freeze: In 2008, commercial paper froze and LIBOR-OIS spread exploded to a record 364 bps."
            ],
            bottomTakeaway: "Forward rates represent no-arbitrage break-evens; liquidity preference creates normal upward slope, and FRAs lock future borrowing costs.",
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [3, 4],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Focus on Rules 3 and 4: FRA architecture and advance discounted settlement",
              sourceFactIds: ["fact-03", "fact-04"]
            }
          }
        },
        {
          id: "b40",
          hindi_tts: "पांचवां नियम: FRA की वैल्यू नए फॉरवर्ड रेट्स से तय होती है। छठा नियम: लिक्विडिटी प्रेफरेंस से यील्ड कर्व ऊपर झुकती है।",
          en_subtitle: "Fifth and sixth: FRA value reflects forward rate shifts; liquidity preference drives curves.",
          en_narration: "Fifth and sixth: Pre-maturity FRA value reflects forward shifts, while liquidity preference drives curve slopes.",
          pauseAfterMs: 400,
          ui_state: {
            headerBadge: "CHAPTER 4 · PART 2 · SUMMARY",
            heading: "Forward Rates & Term Structure Master Thread",
            activeStepIndex: 5,
            activeStepRange: [5, 6],
            steps: [
              "1. Implied Forward Formula: Continuous forward rate R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1) is determined by zero rates.",
              "2. No-Arbitrage Replication: Borrowing for T1 and investing for T2 synthetically replicates a forward loan.",
              "3. FRA Hedging Architecture: Fixed payers receive floating R_M and pay fixed R_K to cap borrowing costs.",
              "4. Advance Settlement Discount: FRAs settling at time T_1 discount payoffs by [1 + R_M*(T_2 - T_1)].",
              "5. Pre-Maturity Valuation: Existing FRAs are valued by discounting the spread between current R_F and contract R_K.",
              "6. Liquidity Preference Reality: Forward rates exceed expected spot rates (R_F > E[R]) by a positive liquidity buffer.",
              "7. Orange County Lesson: Funding long assets with $13B short repo leverage destroyed $1.6B during Fed rate hikes.",
              "8. Interbank Liquidity Freeze: In 2008, commercial paper froze and LIBOR-OIS spread exploded to a record 364 bps."
            ],
            bottomTakeaway: "Forward rates represent no-arbitrage break-evens; liquidity preference creates normal upward slope, and FRAs lock future borrowing costs.",
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [5, 6],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Focus on Rules 5 and 6: FRA mark-to-market and Liquidity Preference Theory",
              sourceFactIds: ["fact-05", "fact-06"]
            }
          }
        },
        {
          id: "b41",
          hindi_tts: "सातवां नियम: ऑरेंज काउंटी ने दिखाया कि शॉर्ट रेपो से लॉन्ग एसेट्स खरीदना खतरनाक है। और आठवां नियम: 2008 के लिक्विडिटी फ्रीज ने 364 बेसिस पॉइंट का स्प्रेड पैदा किया।",
          en_subtitle: "Seventh and eighth: Orange County proved repo leverage traps; 2008 freeze blew out spreads.",
          en_narration: "Seventh and eighth: Orange County exposed repo leverage dangers, while the 2008 freeze blew out spreads to 364 bps.",
          pauseAfterMs: 450,
          ui_state: {
            headerBadge: "CHAPTER 4 · PART 2 · SUMMARY",
            heading: "Forward Rates & Term Structure Master Thread",
            activeStepIndex: 7,
            activeStepRange: [7, 8],
            steps: [
              "1. Implied Forward Formula: Continuous forward rate R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1) is determined by zero rates.",
              "2. No-Arbitrage Replication: Borrowing for T1 and investing for T2 synthetically replicates a forward loan.",
              "3. FRA Hedging Architecture: Fixed payers receive floating R_M and pay fixed R_K to cap borrowing costs.",
              "4. Advance Settlement Discount: FRAs settling at time T_1 discount payoffs by [1 + R_M*(T_2 - T_1)].",
              "5. Pre-Maturity Valuation: Existing FRAs are valued by discounting the spread between current R_F and contract R_K.",
              "6. Liquidity Preference Reality: Forward rates exceed expected spot rates (R_F > E[R]) by a positive liquidity buffer.",
              "7. Orange County Lesson: Funding long assets with $13B short repo leverage destroyed $1.6B during Fed rate hikes.",
              "8. Interbank Liquidity Freeze: In 2008, commercial paper froze and LIBOR-OIS spread exploded to a record 364 bps."
            ],
            bottomTakeaway: "Forward rates represent no-arbitrage break-evens; liquidity preference creates normal upward slope, and FRAs lock future borrowing costs.",
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [7, 8],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Provide dedicated focus on Rule 8: 2008 liquidity freeze and systemic crisis lessons",
              sourceFactIds: ["fact-07", "fact-08"]
            }
          }
        },
        {
          id: "b42",
          hindi_tts: "यह है फॉरवर्ड रेट्स और टर्म स्ट्रक्चर का पूरा गणित! सही हेजिंग ही बाजार के उतार-चढ़ाव से आपकी रक्षा करती है।",
          en_subtitle: "Complete master summary: Diligent forward hedging protects balance sheets from interest volatility.",
          en_narration: "That is the complete term structure framework! Diligent forward hedging shields balance sheets from rate shocks.",
          pauseAfterMs: 600,
          ui_state: {
            headerBadge: "CHAPTER 4 · PART 2 · COMPLETE OVERVIEW",
            heading: "Master Forward Rates & Term Structure Architecture",
            activeStepIndex: 0,
            activeStepRange: [1, 8],
            steps: [
              "1. Implied Forward Formula: Continuous forward rate R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1) is determined by zero rates.",
              "2. No-Arbitrage Replication: Borrowing for T1 and investing for T2 synthetically replicates a forward loan.",
              "3. FRA Hedging Architecture: Fixed payers receive floating R_M and pay fixed R_K to cap borrowing costs.",
              "4. Advance Settlement Discount: FRAs settling at time T_1 discount payoffs by [1 + R_M*(T_2 - T_1)].",
              "5. Pre-Maturity Valuation: Existing FRAs are valued by discounting the spread between current R_F and contract R_K.",
              "6. Liquidity Preference Reality: Forward rates exceed expected spot rates (R_F > E[R]) by a positive liquidity buffer.",
              "7. Orange County Lesson: Funding long assets with $13B short repo leverage destroyed $1.6B during Fed rate hikes.",
              "8. Interbank Liquidity Freeze: In 2008, commercial paper froze and LIBOR-OIS spread exploded to a record 364 bps."
            ],
            bottomTakeaway: "Forward rates represent no-arbitrage break-evens; liquidity preference creates normal upward slope, and FRAs lock future borrowing costs.",
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
const hindiTarget = path.resolve('src/data/chapters/hull_derivatives/ch04_part2');
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

const englishTarget = path.resolve('src/data/chapters/hull_derivatives_en/ch04_part2');
fs.mkdirSync(englishTarget, { recursive: true });
fs.writeFileSync(path.join(englishTarget, 'episode_raw.json'), JSON.stringify(englishEpisode, null, 2), 'utf8');

console.log('✅ Successfully generated compliant episode_raw.json for ch04_part2 (Hindi & English)!');
