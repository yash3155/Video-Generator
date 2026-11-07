import fs from 'fs';
import path from 'path';

const episode = {
  schemaVersion: "1.0.0",
  meta: {
    course: "hull_derivatives",
    chapter: "CHAPTER 3 · PART 2",
    chapterTitle: "Cross Hedging, Minimum Variance Hedge Ratio, Stock Index Hedging, and Metallgesellschaft Disaster",
    domain: "finance",
    primaryColor: "#0F766E",
    accentColor: "#F59E0B",
    narrationLanguage: "hi-IN-devanagari"
  },
  scenes: [
    // Scene 0: Jet Fuel Hedging Puzzle (chat_story)
    {
      segmentIndex: 0,
      title: "The Jet Fuel Hedging Puzzle",
      template: "chat_story",
      badge: "Airline Treasury Desk",
      beats: [
        {
          id: "b01",
          hindi_tts: "शर्मा जी! हमारी एयरलाइन को बीस लाख गैलन जेट फ्यूल खरीदना है। लेकिन बाजार में जेट फ्यूल का कोई लिक्विड फ्यूचर्स कॉन्ट्रैक्ट नहीं है। क्या हम हीटिंग ऑयल फ्यूचर्स में बिल्कुल बराबर मात्रा खरीदकर हेज कर सकते हैं?",
          en_narration: "Sharma ji! Our airline needs to purchase 2 million gallons of jet fuel. Since there is no liquid jet fuel futures contract, can we simply buy an equal volume of heating oil futures 1-for-1?",
          en_subtitle: "Can an airline hedge 2M gallons of jet fuel 1-for-1 with heating oil futures?",
          pauseAfterMs: 450,
          ui_state: {
            stageDirections: ["— Raju examines cross-hedging commodity risk —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! Our airline needs 2M gallons of jet fuel. With no jet fuel futures, should we buy 2M gallons of heating oil futures 1-for-1?",
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
                  text: "Sharma ji! Our airline needs 2M gallons of jet fuel. With no jet fuel futures, should we buy 2M gallons of heating oil futures 1-for-1?",
                  theme: "amber",
                  align: "left"
                }
              ]
            },
            semantics: {
              teachingObjective: "Introduce cross-hedging challenge when no exact futures contract exists",
              sourceFactIds: ["fact-01"]
            }
          }
        },
        {
          id: "b02",
          hindi_tts: "कभी नहीं, राजू! क्रॉस हेजिंग में एक के बदले एक हेज करना एक बड़ी गलती है। जेट फ्यूल और हीटिंग ऑयल की वोलैटिलिटी अलग होती है। हमें मिनिमम वेरियंस हेज रेशियो एच स्टार निकालना होगा ताकि पोर्टफोलियो का कुल रिस्क सबसे कम हो सके।",
          en_narration: "Never hedge 1-for-1 in cross hedging, Raju! Jet fuel and heating oil have different volatilities. We must calculate the minimum variance hedge ratio h* to minimize total portfolio risk.",
          en_subtitle: "Never hedge 1-for-1 in cross hedging; compute the minimum variance ratio h*!",
          pauseAfterMs: 450,
          ui_state: {
            stageDirections: ["— Sharma ji warns against naive 1:1 cross hedging —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! Our airline needs 2M gallons of jet fuel. With no jet fuel futures, should we buy 2M gallons of heating oil futures 1-for-1?",
                theme: "amber",
                align: "left"
              },
              {
                sender: "Sharma ji",
                avatar: "S",
                text: "Never hedge 1-for-1, Raju! Jet fuel and heating oil have different volatilities. You must compute minimum variance ratio h* to minimize risk.",
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
                  text: "Sharma ji! Our airline needs 2M gallons of jet fuel. With no jet fuel futures, should we buy 2M gallons of heating oil futures 1-for-1?",
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "Never hedge 1-for-1, Raju! Jet fuel and heating oil have different volatilities. You must compute minimum variance ratio h* to minimize risk.",
                  theme: "teal",
                  align: "right"
                }
              ]
            },
            semantics: {
              teachingObjective: "Establish why naive 1:1 hedging increases variance in cross-hedging",
              sourceFactIds: ["fact-01", "fact-02"]
            }
          }
        },
        {
          id: "b03",
          hindi_tts: "समझ गया! क्योंकि हीटिंग ऑयल जेट फ्यूल से ज्यादा वोलेटाइल है, बराबर खरीदने से हम ओवर-हेज हो जाएंगे और रिस्क घटने के बजाय उल्टा बढ़ जाएगा!",
          en_narration: "Understood! Because heating oil is more volatile than jet fuel, buying equal volumes overhedges and increases portfolio variance!",
          en_subtitle: "Higher futures volatility means 1-for-1 hedging overhedges and adds risk!",
          pauseAfterMs: 500,
          ui_state: {
            stageDirections: ["— Raju grasps the danger of overhedging —"],
            messages: [
              {
                sender: "Raju",
                avatar: "R",
                text: "Sharma ji! Our airline needs 2M gallons of jet fuel. With no jet fuel futures, should we buy 2M gallons of heating oil futures 1-for-1?",
                theme: "amber",
                align: "left"
              },
              {
                sender: "Sharma ji",
                avatar: "S",
                text: "Never hedge 1-for-1, Raju! Jet fuel and heating oil have different volatilities. You must compute minimum variance ratio h* to minimize risk.",
                theme: "teal",
                align: "right"
              },
              {
                sender: "Raju",
                avatar: "R",
                text: "Understood! Since heating oil fluctuates more, buying 1-for-1 overhedges and actually magnifies portfolio variance!",
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
                  text: "Sharma ji! Our airline needs 2M gallons of jet fuel. With no jet fuel futures, should we buy 2M gallons of heating oil futures 1-for-1?",
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "Never hedge 1-for-1, Raju! Jet fuel and heating oil have different volatilities. You must compute minimum variance ratio h* to minimize risk.",
                  theme: "teal",
                  align: "right"
                },
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "Understood! Since heating oil fluctuates more, buying 1-for-1 overhedges and actually magnifies portfolio variance!",
                  theme: "amber",
                  align: "left"
                }
              ]
            },
            semantics: {
              teachingObjective: "Highlight variance minimization intuition in cross-hedging",
              sourceFactIds: ["fact-01", "fact-02"]
            }
          }
        }
      ]
    },

    // Scene 1: Curriculum Roadmap (progressive_cards)
    {
      segmentIndex: 1,
      title: "Curriculum Roadmap",
      template: "progressive_cards",
      badge: "Chapter 3 Part 2 Roadmap",
      beats: [
        {
          id: "b04",
          hindi_tts: "इस अध्याय में हम उन्नत हेजिंग के तीन गणितीय स्तंभों को समझेंगे। पहला: क्रॉस हेजिंग और मिनिमम वेरियंस हेज रेशियो एच स्टार का फॉर्मूला।",
          en_narration: "In this lesson we master three quantitative pillars of institutional risk management. First: Cross Hedging and the minimum variance hedge ratio formula.",
          en_subtitle: "Module 1: Cross Hedging and Minimum Variance Hedge Ratio h*.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Advanced Hedging Curriculum",
            cards: [
              {
                title: "1. Cross Hedging & Minimum Variance",
                details: "Optimal hedge ratio h* = ρ · (σ_S / σ_F) and contract sizing N*.",
                active: true,
                badge: "Quantitative Hedging"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "1. Cross Hedging & Minimum Variance",
                  details: "Optimal hedge ratio h* = ρ · (σ_S / σ_F) and contract sizing N*.",
                  active: true,
                  badge: "Quantitative Hedging"
                }
              ]
            },
            semantics: {
              teachingObjective: "Introduce first pillar: cross-hedging and minimum variance math",
              sourceFactIds: ["fact-01", "fact-02", "fact-03"]
            }
          }
        },
        {
          id: "b05",
          hindi_tts: "दूसरा स्तंभ: स्टॉक इंडेक्स फ्यूचर्स हेजिंग—इक्विटी पोर्टफोलियो के सिस्टमैटिक रिस्क को कैसे हेज करें और पोर्टफोलियो बीटा को कैसे नियंत्रित करें।",
          en_narration: "Second pillar: Stock Index Futures hedging—how to hedge equity portfolio systematic market risk and tactically adjust portfolio beta.",
          en_subtitle: "Module 2: Stock Index Futures and Tactical Portfolio Beta Adjustment.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Advanced Hedging Curriculum",
            cards: [
              {
                title: "1. Cross Hedging & Minimum Variance",
                details: "Optimal hedge ratio h* = ρ · (σ_S / σ_F) and contract sizing N*.",
                active: false,
                badge: "Quantitative Hedging"
              },
              {
                title: "2. Stock Index Hedging & Beta Tuning",
                details: "Hedging systematic market risk and adjusting portfolio beta N* = (β - β*) · (V_A / V_F).",
                active: true,
                badge: "Equity Derivatives"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "1. Cross Hedging & Minimum Variance",
                  details: "Optimal hedge ratio h* = ρ · (σ_S / σ_F) and contract sizing N*.",
                  active: false,
                  badge: "Quantitative Hedging"
                },
                {
                  title: "2. Stock Index Hedging & Beta Tuning",
                  details: "Hedging systematic market risk and adjusting portfolio beta N* = (β - β*) · (V_A / V_F).",
                  active: true,
                  badge: "Equity Derivatives"
                }
              ]
            },
            semantics: {
              teachingObjective: "Introduce second pillar: equity beta adjustment",
              sourceFactIds: ["fact-05", "fact-06"]
            }
          }
        },
        {
          id: "b06",
          hindi_tts: "तीसरा स्तंभ: स्टैक एंड रोल स्ट्रेटेजी, रोल रिस्क, और उन्नीस सौ तिरानवे में मेटालगेसेलशाफ्ट का एक दशमलव तीन अरब डॉलर का ऐतिहासिक नुकसान।",
          en_narration: "Third pillar: Stack-and-roll maturity transformation, contango roll bleed, and Metallgesellschaft's $1.3 billion disaster in Snapshot 3.2.",
          en_subtitle: "Module 3: Stack and Roll Traps and Metallgesellschaft's $1.3B Disaster.",
          pauseAfterMs: 500,
          ui_state: {
            title: "Advanced Hedging Curriculum",
            cards: [
              {
                title: "1. Cross Hedging & Minimum Variance",
                details: "Optimal hedge ratio h* = ρ · (σ_S / σ_F) and contract sizing N*.",
                active: false,
                badge: "Quantitative Hedging"
              },
              {
                title: "2. Stock Index Hedging & Beta Tuning",
                details: "Hedging systematic market risk and adjusting portfolio beta N* = (β - β*) · (V_A / V_F).",
                active: false,
                badge: "Equity Derivatives"
              },
              {
                title: "3. Stack & Roll Liquidity Traps",
                details: "Maturity transformation, roll bleed in contango, and Snapshot 3.2 Metallgesellschaft.",
                active: true,
                badge: "Liquidity Crisis"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "1. Cross Hedging & Minimum Variance",
                  details: "Optimal hedge ratio h* = ρ · (σ_S / σ_F) and contract sizing N*.",
                  active: false,
                  badge: "Quantitative Hedging"
                },
                {
                  title: "2. Stock Index Hedging & Beta Tuning",
                  details: "Hedging systematic market risk and adjusting portfolio beta N* = (β - β*) · (V_A / V_F).",
                  active: false,
                  badge: "Equity Derivatives"
                },
                {
                  title: "3. Stack & Roll Liquidity Traps",
                  details: "Maturity transformation, roll bleed in contango, and Snapshot 3.2 Metallgesellschaft.",
                  active: true,
                  badge: "Liquidity Crisis"
                }
              ]
            },
            semantics: {
              teachingObjective: "Introduce third pillar: stack-and-roll liquidity traps",
              sourceFactIds: ["fact-08", "fact-10"]
            }
          }
        }
      ]
    },

    // Scene 2: Minimum Variance Hedge Ratio Formula (formula_breakdown)
    {
      segmentIndex: 2,
      title: "Minimum Variance Hedge Ratio Formula",
      template: "formula_breakdown",
      badge: "Core Quantitative Model",
      beats: [
        {
          id: "b07",
          hindi_tts: "आइये मिनिमम वेरियंस हेज रेशियो के फॉर्मूले को देखें। जॉन हल के अनुसार: एच स्टार बराबर रो गुना सिग्मा एस बटे सिग्मा एफ।",
          en_narration: "Let us examine the minimum variance hedge ratio formula. According to John Hull: h* equals rho times sigma_S divided by sigma_F.",
          en_subtitle: "Minimum variance hedge ratio formula: h* = ρ · (σ_S / σ_F).",
          pauseAfterMs: 400,
          ui_state: {
            title: "Minimum Variance Hedge Ratio",
            expression: "h^* = \\rho \\frac{\\sigma_S}{\\sigma_F}",
            variables: [
              { symbol: "h^*", label: "Optimal Hedge Ratio", description: "Ratio minimizing hedged portfolio variance", unit: "ratio" },
              { symbol: "\\rho", label: "Correlation Coefficient", description: "Correlation between ΔS and ΔF", unit: "dimensionless" },
              { symbol: "\\sigma_S", label: "Spot Volatility", description: "Standard deviation of ΔS", unit: "$ / unit" },
              { symbol: "\\sigma_F", label: "Futures Volatility", description: "Standard deviation of ΔF", unit: "$ / unit" }
            ],
            steps: [
              { stepIndex: 0, label: "Core Ratio", equation: "h^* = \\rho \\frac{\\sigma_S}{\\sigma_F}", note: "Balances spot and futures volatilities" }
            ],
            assumptions: ["Historical covariance and correlation remain stable during hedge period."],
            interpretation: "Hedge ratio scales with correlation and relative price volatility."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Minimum Variance Hedge Ratio",
              expression: "h^* = \\rho \\frac{\\sigma_S}{\\sigma_F}",
              variables: [
                { symbol: "h^*", label: "Optimal Hedge Ratio", description: "Ratio minimizing hedged portfolio variance", unit: "ratio" },
                { symbol: "\\rho", label: "Correlation Coefficient", description: "Correlation between ΔS and ΔF", unit: "dimensionless" },
                { symbol: "\\sigma_S", label: "Spot Volatility", description: "Standard deviation of ΔS", unit: "$ / unit" },
                { symbol: "\\sigma_F", label: "Futures Volatility", description: "Standard deviation of ΔF", unit: "$ / unit" }
              ],
              steps: [
                { stepIndex: 0, label: "Core Ratio", equation: "h^* = \\rho \\frac{\\sigma_S}{\\sigma_F}", note: "Balances spot and futures volatilities" }
              ],
              assumptions: ["Historical covariance and correlation remain stable during hedge period."],
              interpretation: "Hedge ratio scales with correlation and relative price volatility."
            },
            semantics: {
              teachingObjective: "Present the minimum variance hedge ratio formula",
              sourceFactIds: ["fact-02"]
            }
          }
        },
        {
          id: "b08",
          hindi_tts: "यह फॉर्मूला कहां से आया? हेज किए गए पोर्टफोलियो का वेरियंस होता है: सिग्मा एस स्क्वायर प्लस एच स्क्वायर सिग्मा एफ स्क्वायर माइनस दो एच रो सिग्मा एस सिग्मा एफ। इसका डेरिवेटिव शून्य रखने पर एच स्टार प्राप्त होता है।",
          en_narration: "Where does this formula come from? The variance of the hedged position is minimized by setting the first derivative with respect to h to zero, yielding h* = rho * (sigma_S / sigma_F).",
          en_subtitle: "Setting the derivative of portfolio variance to zero derives h*.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Minimum Variance Derivation",
            expression: "h^* = \\rho \\cdot (\\sigma_S / \\sigma_F)",
            variables: [
              { symbol: "\\text{Var}", label: "Hedged Position Variance", description: "σ_S² + h²σ_F² - 2hρσ_Sσ_F", unit: "$² / unit²" },
              { symbol: "h^*", label: "Optimal Ratio", description: "Critical minimum point", unit: "ratio" }
            ],
            steps: [
              { stepIndex: 0, label: "Position Variance", equation: "v = \\sigma_S^2 + h^2\\sigma_F^2 - 2h\\rho\\sigma_S\\sigma_F", note: "Total variance of hedged change" },
              { stepIndex: 1, label: "First Order Condition", equation: "2h\\sigma_F^2 - 2\\rho\\sigma_S\\sigma_F = 0 \\implies h^* = \\rho \\frac{\\sigma_S}{\\sigma_F}", note: "Global variance minimum" }
            ],
            assumptions: ["Quadratic loss function with linear relationship between spot and futures."],
            interpretation: "The minimum variance ratio mathematically guarantees lowest possible portfolio volatility."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Minimum Variance Derivation",
              expression: "h^* = \\rho \\cdot (\\sigma_S / \\sigma_F)",
              variables: [
                { symbol: "\\text{Var}", label: "Hedged Position Variance", description: "σ_S² + h²σ_F² - 2hρσ_Sσ_F", unit: "$² / unit²" },
                { symbol: "h^*", label: "Optimal Ratio", description: "Critical minimum point", unit: "ratio" }
              ],
              steps: [
                { stepIndex: 0, label: "Position Variance", equation: "v = \\sigma_S^2 + h^2\\sigma_F^2 - 2h\\rho\\sigma_S\\sigma_F", note: "Total variance of hedged change" },
                { stepIndex: 1, label: "First Order Condition", equation: "2h\\sigma_F^2 - 2\\rho\\sigma_S\\sigma_F = 0 \\implies h^* = \\rho \\frac{\\sigma_S}{\\sigma_F}", note: "Global variance minimum" }
              ],
              assumptions: ["Quadratic loss function with linear relationship between spot and futures."],
              interpretation: "The minimum variance ratio mathematically guarantees lowest possible portfolio volatility."
            },
            semantics: {
              teachingObjective: "Show calculus derivation of the minimum variance ratio",
              sourceFactIds: ["fact-02"]
            }
          }
        },
        {
          id: "b09",
          hindi_tts: "और आवश्यक फ्यूचर्स कॉन्ट्रैक्ट्स की संख्या एन स्टार निकालने का सूत्र है: एच स्टार गुना क्यू ए बटे क्यू एफ—यानी हेज की जाने वाली कुल मात्रा को कॉन्ट्रैक्ट साइज से विभाजित करके एच स्टार से गुणा करें।",
          en_narration: "And the optimal number of futures contracts N* to trade is h* times Q_A divided by Q_F—the asset exposure divided by contract size, scaled by h*.",
          en_subtitle: "Optimal contract quantity formula: N* = h* · (Q_A / Q_F).",
          pauseAfterMs: 500,
          ui_state: {
            title: "Optimal Contract Quantity",
            expression: "N^* = h^* \\frac{Q_A}{Q_F}",
            variables: [
              { symbol: "N^*", label: "Optimal Contracts", description: "Number of futures contracts to trade", unit: "contracts" },
              { symbol: "h^*", label: "Hedge Ratio", description: "Minimum variance hedge ratio", unit: "ratio" },
              { symbol: "Q_A", label: "Asset Size", description: "Total physical asset exposure", unit: "units" },
              { symbol: "Q_F", label: "Contract Size", description: "Units in one futures contract", unit: "units" }
            ],
            steps: [
              { stepIndex: 0, label: "Position Sizing", equation: "N^* = h^* \\frac{Q_A}{Q_F}", note: "Always round to nearest integer contract" }
            ],
            assumptions: ["Fractional contracts cannot be traded on standard exchanges."],
            interpretation: "For a short hedge sell N* contracts; for a long hedge buy N* contracts."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Optimal Contract Quantity",
              expression: "N^* = h^* \\frac{Q_A}{Q_F}",
              variables: [
                { symbol: "N^*", label: "Optimal Contracts", description: "Number of futures contracts to trade", unit: "contracts" },
                { symbol: "h^*", label: "Hedge Ratio", description: "Minimum variance hedge ratio", unit: "ratio" },
                { symbol: "Q_A", label: "Asset Size", description: "Total physical asset exposure", unit: "units" },
                { symbol: "Q_F", label: "Contract Size", description: "Units in one futures contract", unit: "units" }
              ],
              steps: [
                { stepIndex: 0, label: "Position Sizing", equation: "N^* = h^* \\frac{Q_A}{Q_F}", note: "Always round to nearest integer contract" }
              ],
              assumptions: ["Fractional contracts cannot be traded on standard exchanges."],
              interpretation: "For a short hedge sell N* contracts; for a long hedge buy N* contracts."
            },
            semantics: {
              teachingObjective: "Formulate contract quantity calculation N*",
              sourceFactIds: ["fact-03"]
            }
          }
        }
      ]
    },

    // Scene 3: Worked Example: Airline Jet Fuel Cross Hedge (cards)
    {
      segmentIndex: 3,
      title: "Worked Example: Airline Jet Fuel Cross Hedge",
      template: "progressive_cards",
      badge: "John Hull Example 3.2",
      beats: [
        {
          id: "b10",
          hindi_tts: "आइये जॉन हल की किताब का उदाहरण तीन दशमलव दो देखें: एक एयरलाइन को बीस लाख गैलन जेट फ्यूल खरीदना है। वह हीटिंग ऑयल फ्यूचर्स का उपयोग करती है, जिसका कॉन्ट्रैक्ट साइज बयालीस हजार गैलन है।",
          en_narration: "Let us examine John Hull's Example 3.2: An airline needs 2,000,000 gallons of jet fuel. It hedges using heating oil futures with a 42,000 gallon contract size.",
          en_subtitle: "Hull Example 3.2: Airline hedging 2,000,000 gallons with 42,000-gal futures.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Airline Jet Fuel Cross Hedge",
            cards: [
              {
                title: "Asset Exposure & Contract Size",
                details: "Jet Fuel Needed (Q_A) = 2,000,000 gallons. Heating Oil Contract (Q_F) = 42,000 gallons.",
                active: true,
                badge: "John Hull Example 3.2"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "Asset Exposure & Contract Size",
                  details: "Jet Fuel Needed (Q_A) = 2,000,000 gallons. Heating Oil Contract (Q_F) = 42,000 gallons.",
                  active: true,
                  badge: "John Hull Example 3.2"
                }
              ]
            },
            semantics: {
              teachingObjective: "Present airline jet fuel parameters from Hull Example 3.2",
              sourceFactIds: ["fact-04"]
            }
          }
        },
        {
          id: "b11",
          hindi_tts: "ऐतिहासिक डेटा से पता चलता है: जेट फ्यूल का सिग्मा एस शून्य दशमलव शून्य दो छह तीन है, हीटिंग ऑयल का सिग्मा एफ शून्य दशमलव शून्य तीन एक तीन है, और कोरिलेशन रो शून्य दशमलव नौ दो आठ है। अतः एच स्टार शून्य दशमलव सात सात सात सात, यानी लगभग शून्य दशमलव सात आठ निकलता है।",
          en_narration: "Historical statistics show: sigma_S = 0.0263, sigma_F = 0.0313, and rho = 0.928. Thus, h* = 0.928 * (0.0263 / 0.0313) = 0.7777, or approximately 0.78.",
          en_subtitle: "h* = 0.928 · (0.0263 / 0.0313) = 0.7777 ≈ 0.78.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Airline Jet Fuel Cross Hedge",
            cards: [
              {
                title: "Asset Exposure & Contract Size",
                details: "Jet Fuel Needed (Q_A) = 2,000,000 gallons. Heating Oil Contract (Q_F) = 42,000 gallons.",
                active: false,
                badge: "John Hull Example 3.2"
              },
              {
                title: "Hedge Ratio Calculation",
                details: "σ_S = 0.0263, σ_F = 0.0313, ρ = 0.928 -> h* = 0.928 · (0.0263 / 0.0313) = 0.7777 ≈ 0.78.",
                active: true,
                badge: "Optimal Ratio h*"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "Asset Exposure & Contract Size",
                  details: "Jet Fuel Needed (Q_A) = 2,000,000 gallons. Heating Oil Contract (Q_F) = 42,000 gallons.",
                  active: false,
                  badge: "John Hull Example 3.2"
                },
                {
                  title: "Hedge Ratio Calculation",
                  details: "σ_S = 0.0263, σ_F = 0.0313, ρ = 0.928 -> h* = 0.928 · (0.0263 / 0.0313) = 0.7777 ≈ 0.78.",
                  active: true,
                  badge: "Optimal Ratio h*"
                }
              ]
            },
            semantics: {
              teachingObjective: "Compute minimum variance ratio with real numbers",
              sourceFactIds: ["fact-04"]
            }
          }
        },
        {
          id: "b12",
          hindi_tts: "अब कॉन्ट्रैक्ट संख्या निकालें: शून्य दशमलव सात सात सात सात गुना बीस लाख बटे बयालीस हजार बराबर सैंतीस दशमलव शून्य तीन। यानी एयरलाइन को हीटिंग ऑयल के सैंतीस फ्यूचर्स कॉन्ट्रैक्ट्स खरीदने चाहिए। हेजिंग से छियासी प्रतिशत वेरियंस समाप्त हो जाता है!",
          en_narration: "Now calculate contract count: 0.7777 * (2,000,000 / 42,000) = 37.03. The airline should buy 37 heating oil futures contracts, eliminating 86.1% of price variance!",
          en_subtitle: "N* = 0.7777 · (2,000,000 / 42,000) = 37 contracts. R² = 86.1% variance reduction!",
          pauseAfterMs: 500,
          ui_state: {
            title: "Airline Jet Fuel Cross Hedge",
            cards: [
              {
                title: "Asset Exposure & Contract Size",
                details: "Jet Fuel Needed (Q_A) = 2,000,000 gallons. Heating Oil Contract (Q_F) = 42,000 gallons.",
                active: false,
                badge: "John Hull Example 3.2"
              },
              {
                title: "Hedge Ratio Calculation",
                details: "σ_S = 0.0263, σ_F = 0.0313, ρ = 0.928 -> h* = 0.7777 ≈ 0.78.",
                active: false,
                badge: "Optimal Ratio h*"
              },
              {
                title: "Optimal Contracts & Effectiveness",
                details: "N* = 0.7777 · (2,000,000 / 42,000) = 37.03 -> Buy 37 contracts. R² = ρ² = 86.1% variance eliminated.",
                active: true,
                badge: "Result: 37 Contracts"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "Asset Exposure & Contract Size",
                  details: "Jet Fuel Needed (Q_A) = 2,000,000 gallons. Heating Oil Contract (Q_F) = 42,000 gallons.",
                  active: false,
                  badge: "John Hull Example 3.2"
                },
                {
                  title: "Hedge Ratio Calculation",
                  details: "σ_S = 0.0263, σ_F = 0.0313, ρ = 0.928 -> h* = 0.7777 ≈ 0.78.",
                  active: false,
                  badge: "Optimal Ratio h*"
                },
                {
                  title: "Optimal Contracts & Effectiveness",
                  details: "N* = 0.7777 · (2,000,000 / 42,000) = 37.03 -> Buy 37 contracts. R² = ρ² = 86.1% variance eliminated.",
                  active: true,
                  badge: "Result: 37 Contracts"
                }
              ]
            },
            semantics: {
              teachingObjective: "Conclude sizing of 37 contracts and R² variance reduction",
              sourceFactIds: ["fact-04"]
            }
          }
        }
      ]
    },

    // Scene 4: Stock Index Futures: Hedging Systematic Risk (formula_breakdown)
    {
      segmentIndex: 4,
      title: "Stock Index Futures: Hedging Systematic Risk",
      template: "formula_breakdown",
      badge: "Equity Portfolio Hedging",
      beats: [
        {
          id: "b13",
          hindi_tts: "अब इक्विटी मार्केट्स की बात करते हैं। विविधीकरण से कंपनियों का व्यक्तिगत रिस्क तो खत्म हो जाता है, लेकिन पूरे बाजार में होने वाली गिरावट यानी सिस्टमैटिक रिस्क पूरे पोर्टफोलियो को प्रभावित करता है।",
          en_narration: "Now let us turn to equity markets. Diversification eliminates company-specific idiosyncratic risk, but broad market selloffs—systematic risk—impact all stocks through beta.",
          en_subtitle: "Diversification removes company risk; index futures hedge systematic market risk.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Stock Index Hedging Principles",
            expression: "N^* = \\beta \\frac{V_A}{V_F}",
            variables: [
              { symbol: "N^*", label: "Index Contracts to Short", description: "Contracts needed to neutralize market beta", unit: "contracts" },
              { symbol: "\\beta", label: "Portfolio Beta", description: "Sensitivity of stock portfolio to market index", unit: "dimensionless" },
              { symbol: "V_A", label: "Portfolio Value", description: "Total current market value of equity holdings", unit: "$" },
              { symbol: "V_F", label: "Futures Value", description: "Index Futures Price × Multiplier", unit: "$" }
            ],
            steps: [
              { stepIndex: 0, label: "Index Contract Sizing", equation: "N^* = \\beta \\frac{V_A}{V_F}", note: "Shorting N* contracts reduces portfolio beta to zero" }
            ],
            assumptions: ["Portfolio tracks index with stable CAPM beta."],
            interpretation: "Hedge neutralizes systematic market exposure without selling individual stocks."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Stock Index Hedging Principles",
              expression: "N^* = \\beta \\frac{V_A}{V_F}",
              variables: [
                { symbol: "N^*", label: "Index Contracts to Short", description: "Contracts needed to neutralize market beta", unit: "contracts" },
                { symbol: "\\beta", label: "Portfolio Beta", description: "Sensitivity of stock portfolio to market index", unit: "dimensionless" },
                { symbol: "V_A", label: "Portfolio Value", description: "Total current market value of equity holdings", unit: "$" },
                { symbol: "V_F", label: "Futures Value", description: "Index Futures Price × Multiplier", unit: "$" }
              ],
              steps: [
                { stepIndex: 0, label: "Index Contract Sizing", equation: "N^* = \\beta \\frac{V_A}{V_F}", note: "Shorting N* contracts reduces portfolio beta to zero" }
              ],
              assumptions: ["Portfolio tracks index with stable CAPM beta."],
              interpretation: "Hedge neutralizes systematic market exposure without selling individual stocks."
            },
            semantics: {
              teachingObjective: "Define index futures hedging formula N* = beta * (V_A / V_F)",
              sourceFactIds: ["fact-05"]
            }
          }
        },
        {
          id: "b14",
          hindi_tts: "अगर कोई फंड मैनेजर पोर्टफोलियो के बीटा को पूरी तरह खत्म करना चाहता है, तो उसे एन स्टार कॉन्ट्रैक्ट्स बेचने होंगे, जहां एन स्टार बराबर बीटा गुना वी ए बटे वी एफ है।",
          en_narration: "To completely immunize the portfolio from broad market fluctuations, the manager shorts N* index futures contracts, where N* equals beta times V_A divided by V_F.",
          en_subtitle: "Shorting N* = β · (V_A / V_F) contracts immunizes the portfolio against market drops.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Full Market Immunization (β* = 0)",
            expression: "\\beta_{\\text{hedged}} = \\beta - \\frac{N^* V_F}{V_A} = 0",
            variables: [
              { symbol: "\\beta_{\\text{hedged}}", label: "Target Hedged Beta", description: "Post-hedge systematic exposure", unit: "0.0" },
              { symbol: "N^*", label: "Optimal Short Contracts", description: "Number of short futures positions", unit: "contracts" }
            ],
            steps: [
              { stepIndex: 0, label: "Beta Neutralization", equation: "N^* = \\beta \\frac{V_A}{V_F}", note: "Portfolio earns the risk-free rate plus stock picking alpha" }
            ],
            assumptions: ["Futures contract basis convergence holds at expiry."],
            interpretation: "The portfolio behaves as a synthetic risk-free deposit with excess alpha."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Full Market Immunization (β* = 0)",
              expression: "\\beta_{\\text{hedged}} = \\beta - \\frac{N^* V_F}{V_A} = 0",
              variables: [
                { symbol: "\\beta_{\\text{hedged}}", label: "Target Hedged Beta", description: "Post-hedge systematic exposure", unit: "0.0" },
                { symbol: "N^*", label: "Optimal Short Contracts", description: "Number of short futures positions", unit: "contracts" }
              ],
              steps: [
                { stepIndex: 0, label: "Beta Neutralization", equation: "N^* = \\beta \\frac{V_A}{V_F}", note: "Portfolio earns the risk-free rate plus stock picking alpha" }
              ],
              assumptions: ["Futures contract basis convergence holds at expiry."],
              interpretation: "The portfolio behaves as a synthetic risk-free deposit with excess alpha."
            },
            semantics: {
              teachingObjective: "Explain full immunization beta = 0 mechanics",
              sourceFactIds: ["fact-05"]
            }
          }
        },
        {
          id: "b15",
          hindi_tts: "इसका सबसे बड़ा लाभ यह है कि फंड मैनेजर को अपने चुने हुए मजबूत शेयर्स बेचने की जरूरत नहीं पड़ती। बाजार की गिरावट फ्यूचर्स शॉर्ट से संभल जाती है और उसका स्टॉक सिलेक्शन अल्फा सुरक्षित रहता है।",
          en_narration: "The primary advantage is preserving stock-picking alpha: the manager does not liquidate high-conviction stocks, yet protects capital during market panics.",
          en_subtitle: "Preserves high-conviction stock alpha while hedging market tail risk.",
          pauseAfterMs: 500,
          ui_state: {
            title: "Alpha Preservation Principle",
            expression: "R_{\\text{net}} = r_f + \\alpha_{\\text{selection}}",
            variables: [
              { symbol: "r_f", label: "Risk-Free Return", description: "Return earned on hedged equity value", unit: "% / year" },
              { symbol: "\\alpha", label: "Manager Alpha", description: "Excess stock selection return over market", unit: "%" }
            ],
            steps: [
              { stepIndex: 0, label: "Return Decomposition", equation: "\\text{Return} = r_f + \\alpha", note: "Market beta is eliminated, idiosyncratic alpha remains" }
            ],
            assumptions: ["Transaction costs of futures are significantly lower than selling physical shares."],
            interpretation: "Derivatives enable pure active management without systemic beta exposure."
          },
          visual: {
            kind: "formula",
            data: {
              title: "Alpha Preservation Principle",
              expression: "R_{\\text{net}} = r_f + \\alpha_{\\text{selection}}",
              variables: [
                { symbol: "r_f", label: "Risk-Free Return", description: "Return earned on hedged equity value", unit: "% / year" },
                { symbol: "\\alpha", label: "Manager Alpha", description: "Excess stock selection return over market", unit: "%" }
              ],
              steps: [
                { stepIndex: 0, label: "Return Decomposition", equation: "\\text{Return} = r_f + \\alpha", note: "Market beta is eliminated, idiosyncratic alpha remains" }
              ],
              assumptions: ["Transaction costs of futures are significantly lower than selling physical shares."],
              interpretation: "Derivatives enable pure active management without systemic beta exposure."
            },
            semantics: {
              teachingObjective: "Explain alpha preservation advantage of futures hedging",
              sourceFactIds: ["fact-05"]
            }
          }
        }
      ]
    },

    // Scene 5: Tuning Portfolio Beta: Synthetic Cash Allocation (progressive_cards)
    {
      segmentIndex: 5,
      title: "Tuning Portfolio Beta: Synthetic Cash Allocation",
      template: "progressive_cards",
      badge: "John Hull Example 3.4",
      beats: [
        {
          id: "b16",
          hindi_tts: "यदि मैनेजर बीटा को शून्य नहीं करना चाहता, बल्कि केवल घटाना या बढ़ाना चाहता है, तो फॉर्मूला है: एन स्टार बराबर बीटा माइनस बीटा स्टार, गुना वी ए बटे वी एफ।",
          en_narration: "If a manager wishes to tactically adjust beta rather than zero it, the formula is: N* = (beta - beta*) * (V_A / V_F). If beta > beta*, short futures; if beta < beta*, go long.",
          en_subtitle: "Dynamic beta adjustment formula: N* = (β - β*) · (V_A / V_F).",
          pauseAfterMs: 400,
          ui_state: {
            title: "Dynamic Beta Adjustment",
            cards: [
              {
                title: "Tactical Beta Formula",
                details: "N* = (β - β*) · (V_A / V_F). Short futures if β > β*; Long futures if β < β*.",
                active: true,
                badge: "Formula 3.6"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "Tactical Beta Formula",
                  details: "N* = (β - β*) · (V_A / V_F). Short futures if β > β*; Long futures if β < β*.",
                  active: true,
                  badge: "Formula 3.6"
                }
              ]
            },
            semantics: {
              teachingObjective: "Present generalized beta adjustment formula",
              sourceFactIds: ["fact-06"]
            }
          }
        },
        {
          id: "b17",
          hindi_tts: "आइये जॉन हल का उदाहरण तीन दशमलव चार देखें: एक फंड के पास पचास लाख पचास हजार डॉलर का पोर्टफोलियो है जिसका बीटा एक दशमलव पांच है। इंडेक्स फ्यूचर्स का भाव एक हजार और मल्टीप्लायर ढाई सौ है, यानी वी एफ ढाई लाख डॉलर है।",
          en_narration: "Consider John Hull's Example 3.4: A fund holds a $5,050,000 equity portfolio with beta = 1.5. Index futures price is 1,000 with a $250 multiplier, making V_F = $250,000.",
          en_subtitle: "Hull Example 3.4: $5,050,000 portfolio, β = 1.5, futures value V_F = $250,000.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Dynamic Beta Adjustment",
            cards: [
              {
                title: "Tactical Beta Formula",
                details: "N* = (β - β*) · (V_A / V_F). Short futures if β > β*; Long futures if β < β*.",
                active: false,
                badge: "Formula 3.6"
              },
              {
                title: "Example 3.4 Baseline Parameters",
                details: "Portfolio Value V_A = $5,050,000. Beta β = 1.5. Futures Value V_F = 1,000 · $250 = $250,000.",
                active: true,
                badge: "John Hull Example 3.4"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "Tactical Beta Formula",
                  details: "N* = (β - β*) · (V_A / V_F). Short futures if β > β*; Long futures if β < β*.",
                  active: false,
                  badge: "Formula 3.6"
                },
                {
                  title: "Example 3.4 Baseline Parameters",
                  details: "Portfolio Value V_A = $5,050,000. Beta β = 1.5. Futures Value V_F = 1,000 · $250 = $250,000.",
                  active: true,
                  badge: "John Hull Example 3.4"
                }
              ]
            },
            semantics: {
              teachingObjective: "Set up Hull Example 3.4 parameters",
              sourceFactIds: ["fact-07"]
            }
          }
        },
        {
          id: "b18",
          hindi_tts: "मार्केट रिस्क शून्य करने के लिए तीस कॉन्ट्रैक्ट्स बेचने होंगे। लेकिन अगर मैनेजर केवल रिस्क आधा करके बीटा शून्य दशमलव सात पांच करना चाहता है, तो उसे सिर्फ पंद्रह कॉन्ट्रैक्ट्स शॉर्ट करने की आवश्यकता होगी!",
          en_narration: "To completely eliminate market risk (beta* = 0), short 30 contracts. To halve market risk to beta* = 0.75, the manager shorts exactly 15 contracts!",
          en_subtitle: "Short 30 contracts for zero beta, or 15 contracts to halve beta to 0.75.",
          pauseAfterMs: 500,
          ui_state: {
            title: "Dynamic Beta Adjustment",
            cards: [
              {
                title: "Tactical Beta Formula",
                details: "N* = (β - β*) · (V_A / V_F). Short futures if β > β*; Long futures if β < β*.",
                active: false,
                badge: "Formula 3.6"
              },
              {
                title: "Example 3.4 Baseline Parameters",
                details: "Portfolio Value V_A = $5,050,000. Beta β = 1.5. Futures Value V_F = $250,000.",
                active: false,
                badge: "John Hull Example 3.4"
              },
              {
                title: "Target Outcomes",
                details: "Full Hedge (β* = 0): Short 30 contracts. Half Hedge (β* = 0.75): Short 15 contracts.",
                active: true,
                badge: "Tactical Results"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "Tactical Beta Formula",
                  details: "N* = (β - β*) · (V_A / V_F). Short futures if β > β*; Long futures if β < β*.",
                  active: false,
                  badge: "Formula 3.6"
                },
                {
                  title: "Example 3.4 Baseline Parameters",
                  details: "Portfolio Value V_A = $5,050,000. Beta β = 1.5. Futures Value V_F = $250,000.",
                  active: false,
                  badge: "John Hull Example 3.4"
                },
                {
                  title: "Target Outcomes",
                  details: "Full Hedge (β* = 0): Short 30 contracts. Half Hedge (β* = 0.75): Short 15 contracts.",
                  active: true,
                  badge: "Tactical Results"
                }
              ]
            },
            semantics: {
              teachingObjective: "Show numerical comparison between full and partial beta hedging",
              sourceFactIds: ["fact-07"]
            }
          }
        }
      ]
    },

    // Scene 6: Stack and Roll: Rolling Futures Forward (cards)
    {
      segmentIndex: 6,
      title: "Stack and Roll: Rolling Futures Forward",
      template: "progressive_cards",
      badge: "Maturity Transformation",
      beats: [
        {
          id: "b19",
          hindi_tts: "व्यवसाय में एक बड़ी समस्या यह है कि कंपनियां पांच से दस साल के दीर्घकालिक फॉरवर्ड सौदे करती हैं, लेकिन फ्यूचर्स मार्केट में गहरी लिक्विडिटी केवल एक से तीन महीने के कॉन्ट्रैक्ट्स में ही होती है।",
          en_narration: "In commercial markets, firms often enter 5-to-10 year supply commitments, but deep exchange liquidity exists only in short-dated 1-to-3 month futures.",
          en_subtitle: "Long-term supply commitments face liquidity mismatch against short-term futures.",
          pauseAfterMs: 400,
          ui_state: {
            title: "The Stack and Roll Mechanism",
            cards: [
              {
                title: "Maturity Mismatch Challenge",
                details: "Commercial obligations last 5-10 years; liquid futures contracts expire in 1-3 months.",
                active: true,
                badge: "Liquidity Constraint"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "Maturity Mismatch Challenge",
                  details: "Commercial obligations last 5-10 years; liquid futures contracts expire in 1-3 months.",
                  active: true,
                  badge: "Liquidity Constraint"
                }
              ]
            },
            semantics: {
              teachingObjective: "Explain maturity mismatch motivating stack and roll",
              sourceFactIds: ["fact-08"]
            }
          }
        },
        {
          id: "b20",
          hindi_tts: "कंपनियां 'स्टैक एंड रोल' तकनीक अपनाती हैं: पूरी दीर्घकालिक मात्रा के फ्यूचर्स पहले महीने में ही खरीद लिए जाते हैं, और एक्सपायरी से ठीक पहले उन्हें बंद करके अगले महीने के नए कॉन्ट्रैक्ट्स में रोल कर दिया जाता है।",
          en_narration: "Firms deploy 'stack and roll': they stack the entire multi-year exposure in front-month contracts, then continuously roll them forward prior to expiry into subsequent contracts.",
          en_subtitle: "Stack full volume in front month, then continuously roll into next cycle.",
          pauseAfterMs: 400,
          ui_state: {
            title: "The Stack and Roll Mechanism",
            cards: [
              {
                title: "Maturity Mismatch Challenge",
                details: "Commercial obligations last 5-10 years; liquid futures contracts expire in 1-3 months.",
                active: false,
                badge: "Liquidity Constraint"
              },
              {
                title: "Rolling Mechanism",
                details: "Stack total volume into short-dated contracts; close and roll into next cycle before delivery.",
                active: true,
                badge: "Stack & Roll Cycle"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "Maturity Mismatch Challenge",
                  details: "Commercial obligations last 5-10 years; liquid futures contracts expire in 1-3 months.",
                  active: false,
                  badge: "Liquidity Constraint"
                },
                {
                  title: "Rolling Mechanism",
                  details: "Stack total volume into short-dated contracts; close and roll into next cycle before delivery.",
                  active: true,
                  badge: "Stack & Roll Cycle"
                }
              ]
            },
            semantics: {
              teachingObjective: "Illustrate the stack and roll operational cycle",
              sourceFactIds: ["fact-08"]
            }
          }
        },
        {
          id: "b21",
          hindi_tts: "लेकिन इसमें भारी रोल रिस्क होता है: यदि बाजार बैकवर्डेशन में है तो रोल करने पर मुनाफा होता है। लेकिन यदि बाजार कॉन्टैंगो में चला जाए, तो हर बार महंगा फ्यूचर्स खरीदने पर भारी कैश नुकसान यानी रोल ब्लीड होता है!",
          en_narration: "This exposes the hedger to severe roll risk: backwardation generates roll profits, but contango forces buying higher-priced futures, causing continuous cash bleed!",
          en_subtitle: "Backwardation yields roll profits; contango triggers severe cash bleed!",
          pauseAfterMs: 500,
          ui_state: {
            title: "The Stack and Roll Mechanism",
            cards: [
              {
                title: "Maturity Mismatch Challenge",
                details: "Commercial obligations last 5-10 years; liquid futures contracts expire in 1-3 months.",
                active: false,
                badge: "Liquidity Constraint"
              },
              {
                title: "Rolling Mechanism",
                details: "Stack total volume into short-dated contracts; close and roll into next cycle before delivery.",
                active: false,
                badge: "Stack & Roll Cycle"
              },
              {
                title: "Roll Risk: Backwardation vs Contango",
                details: "Backwardation (F < S) -> Roll Profit. Contango (F > S) -> Severe Roll Bleed and margin drain.",
                active: true,
                badge: "Curve Dynamics"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "Maturity Mismatch Challenge",
                  details: "Commercial obligations last 5-10 years; liquid futures contracts expire in 1-3 months.",
                  active: false,
                  badge: "Liquidity Constraint"
                },
                {
                  title: "Rolling Mechanism",
                  details: "Stack total volume into short-dated contracts; close and roll into next cycle before delivery.",
                  active: false,
                  badge: "Stack & Roll Cycle"
                },
                {
                  title: "Roll Risk: Backwardation vs Contango",
                  details: "Backwardation (F < S) -> Roll Profit. Contango (F > S) -> Severe Roll Bleed and margin drain.",
                  active: true,
                  badge: "Curve Dynamics"
                }
              ]
            },
            semantics: {
              teachingObjective: "Contrast backwardation roll gain with contango roll bleed",
              sourceFactIds: ["fact-09"]
            }
          }
        }
      ]
    },

    // Scene 7: Snapshot 3.2: Metallgesellschaft's $1.3B Disaster (progressive_cards)
    {
      segmentIndex: 7,
      title: "Snapshot 3.2: Metallgesellschaft's $1.3B Disaster",
      template: "progressive_cards",
      badge: "Business Snapshot 3.2",
      beats: [
        {
          id: "b22",
          hindi_tts: "केस स्टडी तीन दशमलव दो: उन्नीस सौ तिरानवे में जर्मन कंपनी मेटालगेसेलशाफ्ट की अमेरिकी यूनिट ने ग्राहकों को दस साल के फिक्स्ड भाव पर सोलह करोड़ बैरल तेल बेचने के सौदे किए।",
          en_narration: "Business Snapshot 3.2: In 1993, German conglomerate Metallgesellschaft's US subsidiary sold 160 million barrels of fuel under 5-to-10 year fixed-price contracts.",
          en_subtitle: "1993: Metallgesellschaft committed to deliver 160M barrels over 10 years.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Metallgesellschaft's $1.3B Disaster",
            cards: [
              {
                title: "The Massive Commitment",
                details: "160 million barrels sold forward under 10-year fixed-price customer agreements.",
                active: true,
                badge: "Snapshot 3.2"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "The Massive Commitment",
                  details: "160 million barrels sold forward under 10-year fixed-price customer agreements.",
                  active: true,
                  badge: "Snapshot 3.2"
                }
              ]
            },
            semantics: {
              teachingObjective: "Introduce Metallgesellschaft commitment scale",
              sourceFactIds: ["fact-10"]
            }
          }
        },
        {
          id: "b23",
          hindi_tts: "कंपनी ने इसे स्टैक एंड रोल तकनीक से हेज किया। लेकिन उन्नीस सौ तिरानवे के अंत में कच्चे तेल के भाव अचानक गिर गए, और बाजार बैकवर्डेशन से बदलकर भारी कॉन्टैंगो में चला गया।",
          en_narration: "MGRM hedged with a massive stack-and-roll using short-dated NYMEX futures. But in late 1993 oil prices collapsed, flipping the market into steep contango.",
          en_subtitle: "Oil prices crashed in late 1993, shifting the market into steep contango.",
          pauseAfterMs: 400,
          ui_state: {
            title: "Metallgesellschaft's $1.3B Disaster",
            cards: [
              {
                title: "The Massive Commitment",
                details: "160 million barrels sold forward under 10-year fixed-price customer agreements.",
                active: false,
                badge: "Snapshot 3.2"
              },
              {
                title: "The Contango Trap",
                details: "Oil prices collapsed in late 1993; market flipped into steep contango causing massive roll losses.",
                active: true,
                badge: "Curve Inversion"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "The Massive Commitment",
                  details: "160 million barrels sold forward under 10-year fixed-price customer agreements.",
                  active: false,
                  badge: "Snapshot 3.2"
                },
                {
                  title: "The Contango Trap",
                  details: "Oil prices collapsed in late 1993; market flipped into steep contango causing massive roll losses.",
                  active: true,
                  badge: "Curve Inversion"
                }
              ]
            },
            semantics: {
              teachingObjective: "Explain contango flip causing massive roll bleed",
              sourceFactIds: ["fact-09", "fact-10"]
            }
          }
        },
        {
          id: "b24",
          hindi_tts: "डेली मार्जिन कॉल्स ने कंपनी से एक दशमलव तीन तीन अरब डॉलर का कैश खींच लिया। घबराए हुए बोर्ड ने सबसे निचले भाव पर सौदे काट दिए, जिससे एक दशमलव तीन अरब डॉलर का वास्तविक नुकसान दर्ज हो गया!",
          en_narration: "Daily MTM margin calls drained $1.33 billion in liquidity. Panicked management liquidated the hedges at market bottoms, cementing a catastrophic $1.3 billion realized loss!",
          en_subtitle: "Margin calls drained $1.33B in cash; panicked liquidation locked in $1.3B loss!",
          pauseAfterMs: 500,
          ui_state: {
            title: "Metallgesellschaft's $1.3B Disaster",
            cards: [
              {
                title: "The Massive Commitment",
                details: "160 million barrels sold forward under 10-year fixed-price customer agreements.",
                active: false,
                badge: "Snapshot 3.2"
              },
              {
                title: "The Contango Trap",
                details: "Oil prices collapsed in late 1993; market flipped into steep contango causing massive roll losses.",
                active: false,
                badge: "Curve Inversion"
              },
              {
                title: "Liquidity Drain & Forced Liquidation",
                details: "$1.33B cash margin drain; supervisory board panicked and liquidated at bottom, realizing $1.3B loss.",
                active: true,
                badge: "Fatal Outcome"
              }
            ]
          },
          visual: {
            kind: "cards",
            data: {
              cards: [
                {
                  title: "The Massive Commitment",
                  details: "160 million barrels sold forward under 10-year fixed-price customer agreements.",
                  active: false,
                  badge: "Snapshot 3.2"
                },
                {
                  title: "The Contango Trap",
                  details: "Oil prices collapsed in late 1993; market flipped into steep contango causing massive roll losses.",
                  active: false,
                  badge: "Curve Inversion"
                },
                {
                  title: "Liquidity Drain & Forced Liquidation",
                  details: "$1.33B cash margin drain; supervisory board panicked and liquidated at bottom, realizing $1.3B loss.",
                  active: true,
                  badge: "Fatal Outcome"
                }
              ]
            },
            semantics: {
              teachingObjective: "Conclude Metallgesellschaft liquidity crisis analysis",
              sourceFactIds: ["fact-10"]
            }
          }
        }
      ]
    },

    // Scene 8: Active Recall: Portfolio Beta Adjustment Calculation (interactive_quiz)
    {
      segmentIndex: 8,
      title: "Active Recall: Portfolio Beta Adjustment Calculation",
      template: "interactive_quiz",
      badge: "Active Recall Challenge",
      beats: [
        {
          id: "b25",
          hindi_tts: "आइये आपकी समझ की परीक्षा लें: एक इक्विटी मैनेजर के पास एक करोड़ डॉलर का पोर्टफोलियो है जिसका बीटा एक दशमलव दो है। इंडेक्स फ्यूचर्स की वैल्यू पांच लाख डॉलर है। पोर्टफोलियो बीटा घटाकर शून्य दशमलव छह करने के लिए क्या ट्रेड करना होगा?",
          en_narration: "Test your understanding: An equity manager holds a $10,000,000 portfolio with beta = 1.2. The index futures contract value is $500,000. To reduce portfolio beta to 0.6, what trade is required?",
          en_subtitle: "Portfolio $10M, β = 1.2, futures $500k. Trade needed to reduce beta to 0.6?",
          pauseAfterMs: 400,
          ui_state: {
            scenario: "An equity manager holds a $10,000,000 portfolio with beta = 1.2. S&P 500 index futures trade at 2,000 with a $250 multiplier ($500,000 contract value).",
            question: "Given a $10,000,000 equity portfolio with beta 1.2 and $500,000 index futures, what specific transaction reduces the total portfolio beta to 0.6?",
            options: [
              "A) Long 12 contracts",
              "B) Short 12 contracts",
              "C) Short 24 contracts",
              "D) Short 6 contracts"
            ],
            correctOptionIndex: 1,
            answer: "B) Short 12 contracts",
            showThinkingSpinner: false
          },
          visual: {
            kind: "quiz",
            data: {
              scenario: "An equity manager holds a $10,000,000 portfolio with beta = 1.2. S&P 500 index futures trade at 2,000 with a $250 multiplier ($500,000 contract value).",
              question: "Given a $10,000,000 equity portfolio with beta 1.2 and $500,000 index futures, what specific transaction reduces the total portfolio beta to 0.6?",
              options: [
                "A) Long 12 contracts",
                "B) Short 12 contracts",
                "C) Short 24 contracts",
                "D) Short 6 contracts"
              ],
              correctOptionIndex: 1,
              answer: "B) Short 12 contracts",
              showThinkingSpinner: false
            },
            semantics: {
              teachingObjective: "Active recall on beta reduction formula",
              sourceFactIds: ["fact-06", "fact-07"]
            }
          }
        },
        {
          id: "b26",
          hindi_tts: "राजू सोचता है: बीटा का अंतर है एक दशमलव दो माइनस शून्य दशमलव छह यानी शून्य दशमलव छह। अब इसे एक करोड़ बटे पांच लाख यानी बीस से गुणा करें। शून्य दशमलव छह गुना बीस बराबर बारह!",
          en_narration: "Raju computes: Beta difference is 1.2 minus 0.6 = 0.6. Multiply by ($10,000,000 / $500,000) = 20. 0.6 times 20 equals 12!",
          en_subtitle: "Delta beta is 0.6; multiplying by 20 requires shorting 12 futures contracts.",
          pauseAfterMs: 400,
          ui_state: {
            scenario: "An equity manager holds a $10,000,000 portfolio with beta = 1.2. S&P 500 index futures trade at 2,000 with a $250 multiplier ($500,000 contract value).",
            question: "Given a $10,000,000 equity portfolio with beta 1.2 and $500,000 index futures, what specific transaction reduces the total portfolio beta to 0.6?",
            options: [
              "A) Long 12 contracts",
              "B) Short 12 contracts",
              "C) Short 24 contracts",
              "D) Short 6 contracts"
            ],
            correctOptionIndex: 1,
            answer: "B) Short 12 contracts",
            showThinkingSpinner: true
          },
          visual: {
            kind: "quiz",
            data: {
              scenario: "An equity manager holds a $10,000,000 portfolio with beta = 1.2. S&P 500 index futures trade at 2,000 with a $250 multiplier ($500,000 contract value).",
              question: "Given a $10,000,000 equity portfolio with beta 1.2 and $500,000 index futures, what specific transaction reduces the total portfolio beta to 0.6?",
              options: [
                "A) Long 12 contracts",
                "B) Short 12 contracts",
                "C) Short 24 contracts",
                "D) Short 6 contracts"
              ],
              correctOptionIndex: 1,
              answer: "B) Short 12 contracts",
              showThinkingSpinner: true
            },
            semantics: {
              teachingObjective: "Show intermediate step: N* = (1.2 - 0.6) * 20 = 12",
              sourceFactIds: ["fact-06", "fact-07"]
            }
          }
        },
        {
          id: "b27",
          hindi_tts: "ऑप्शन बी बिल्कुल सही है! क्योंकि हम बीटा घटाना चाहते हैं, इसलिए बारह इंडेक्स फ्यूचर्स कॉन्ट्रैक्ट्स शॉर्ट करने होंगे। अगर बीटा बढ़ाना होता तो लॉन्ग करते।",
          en_narration: "Option B is correct! Because we are reducing beta, the manager must short 12 index futures contracts. If increasing beta, the manager would go long.",
          en_subtitle: "Option B is correct! Short 12 contracts to reduce systematic risk.",
          pauseAfterMs: 500,
          ui_state: {
            scenario: "An equity manager holds a $10,000,000 portfolio with beta = 1.2. S&P 500 index futures trade at 2,000 with a $250 multiplier ($500,000 contract value).",
            question: "Given a $10,000,000 equity portfolio with beta 1.2 and $500,000 index futures, what specific transaction reduces the total portfolio beta to 0.6?",
            options: [
              "A) Long 12 contracts",
              "B) Short 12 contracts",
              "C) Short 24 contracts",
              "D) Short 6 contracts"
            ],
            correctOptionIndex: 1,
            answer: "B) Short 12 contracts",
            showThinkingSpinner: false,
            feedback: "Correct! N* = (1.2 - 0.6) · ($10,000,000 / $500,000) = 0.6 · 20 = 12 contracts short."
          },
          visual: {
            kind: "quiz",
            data: {
              scenario: "An equity manager holds a $10,000,000 portfolio with beta = 1.2. S&P 500 index futures trade at 2,000 with a $250 multiplier ($500,000 contract value).",
              question: "Given a $10,000,000 equity portfolio with beta 1.2 and $500,000 index futures, what specific transaction reduces the total portfolio beta to 0.6?",
              options: [
                "A) Long 12 contracts",
                "B) Short 12 contracts",
                "C) Short 24 contracts",
                "D) Short 6 contracts"
              ],
              correctOptionIndex: 1,
              answer: "B) Short 12 contracts",
              showThinkingSpinner: false,
              feedback: "Correct! N* = (1.2 - 0.6) · ($10,000,000 / $500,000) = 0.6 · 20 = 12 contracts short."
            },
            semantics: {
              teachingObjective: "Validate understanding of shorting to lower beta",
              sourceFactIds: ["fact-06", "fact-07"]
            }
          }
        }
      ]
    },

    // Scene 9: Executive Summary: 8 Advanced Hedging Principles (summary_thread)
    {
      segmentIndex: 9,
      title: "Executive Summary: 8 Advanced Hedging Principles",
      template: "summary_thread",
      badge: "Core Chapter Takeaways",
      beats: [
        {
          id: "b28",
          hindi_tts: "आइए आज के पूरे सबक को इस समरी थ्रेड में समेटते हैं। क्रॉस हेजिंग और इक्विटी इंडेक्स हेजिंग के ये आठ नियम हर ट्रेडर के लिए अनिवार्य हैं।",
          en_narration: "Let us synthesize today's complete lesson into an executive summary thread. These eight rules of cross hedging and index hedging are vital for every trader.",
          en_subtitle: "Executive synthesis: eight vital rules of cross hedging and index risk management.",
          pauseAfterMs: 400,
          ui_state: {
            activeStepRange: [0, 0],
            steps: [
              "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
              "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
              "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
              "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
              "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
              "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
              "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
              "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
            ],
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [0, 0],
              steps: [
                "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
                "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
                "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
                "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
                "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
                "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
                "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
                "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
              ],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Executive roadmap overview across all 8 rules",
              sourceFactIds: ["fact-01", "fact-02"]
            }
          }
        },
        {
          id: "b29",
          hindi_tts: "पहला और दूसरा: क्रॉस हेजिंग में कभी एक के बदले एक हेज न करें। हमेशा मिनिमम वेरियंस रेशियो एच स्टार और एन स्टार साइजिंग लागू करें, जो रो स्क्वायर वेरियंस घटाती है।",
          en_narration: "First and second: never hedge 1-to-1 in cross hedging. Always apply the minimum variance hedge ratio h* and optimal contract sizing N*, eliminating rho-squared variance.",
          en_subtitle: "1 & 2: Apply h* and size N* to eliminate rho-squared portfolio variance.",
          pauseAfterMs: 400,
          ui_state: {
            activeStepRange: [1, 2],
            steps: [
              "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
              "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
              "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
              "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
              "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
              "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
              "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
              "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
            ],
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [1, 2],
              steps: [
                "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
                "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
                "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
                "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
                "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
                "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
                "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
                "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
              ],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Recap rules 1 & 2: minimum variance ratio and variance reduction",
              sourceFactIds: ["fact-02", "fact-03", "fact-04"]
            }
          }
        },
        {
          id: "b30",
          hindi_tts: "तीसरा और चौथा: स्टॉक इंडेक्स फ्यूचर्स बेचकर सिस्टमैटिक मार्केट रिस्क को हेज करें, और शेयर बेचे बिना पोर्टफोलियो बीटा को मनचाहे स्तर पर ट्यून करें।",
          en_narration: "Third and fourth: short stock index futures to hedge systematic market risk, and tactically fine-tune portfolio beta without selling underlying shares.",
          en_subtitle: "3 & 4: Short index futures to hedge beta and tune systematic exposure without selling stock.",
          pauseAfterMs: 400,
          ui_state: {
            activeStepRange: [3, 4],
            steps: [
              "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
              "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
              "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
              "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
              "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
              "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
              "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
              "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
            ],
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [3, 4],
              steps: [
                "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
                "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
                "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
                "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
                "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
                "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
                "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
                "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
              ],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Recap rules 3 & 4: equity index hedging and alpha preservation",
              sourceFactIds: ["fact-05", "fact-06"]
            }
          }
        },
        {
          id: "b31",
          hindi_tts: "पांचवां और छठा: हेजिंग होराइजन से मैचिंग कॉन्ट्रैक्ट्स चुनें, और स्टैक एंड रोल में कॉन्टैंगो रोल रिस्क से सावधान रहें।",
          en_narration: "Fifth and sixth: match contract delivery horizons to minimize basis risk, and beware of contango roll bleed during stack and roll strategies.",
          en_subtitle: "5 & 6: Match contract horizons and manage contango roll bleed during stack and roll.",
          pauseAfterMs: 400,
          ui_state: {
            activeStepRange: [5, 6],
            steps: [
              "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
              "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
              "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
              "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
              "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
              "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
              "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
              "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
            ],
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [5, 6],
              steps: [
                "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
                "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
                "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
                "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
                "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
                "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
                "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
                "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
              ],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Recap rules 5 & 6: delivery horizons and stack & roll mechanics",
              sourceFactIds: ["fact-08", "fact-09"]
            }
          }
        },
        {
          id: "b32",
          hindi_tts: "सातवां और आठवां: मेटालगेसेलशाफ्ट साबित करता है कि डेली मार्जिन ड्रेन हेजर्स को दिवालिया कर सकता है, इसलिए सिंथेटिक हेजेस के लिए लिक्विड कैश बफर अनिवार्य है।",
          en_narration: "Seventh and eighth: Metallgesellschaft proves daily variation margin drains can bankrupt hedgers, making liquid cash buffers mandatory for synthetic hedges.",
          en_subtitle: "7 & 8: Margin drains can trigger insolvency; maintaining cash buffers is mandatory.",
          pauseAfterMs: 400,
          ui_state: {
            activeStepRange: [7, 8],
            steps: [
              "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
              "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
              "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
              "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
              "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
              "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
              "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
              "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
            ],
            compactOverview: false
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [7, 8],
              steps: [
                "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
                "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
                "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
                "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
                "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
                "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
                "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
                "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
              ],
              compactOverview: false
            },
            semantics: {
              teachingObjective: "Recap rules 7 & 8: dedicated spotlight on liquidity crisis and cash buffer discipline",
              sourceFactIds: ["fact-10"]
            }
          }
        },
        {
          id: "b33",
          hindi_tts: "यह रहा चैप्टर तीन पार्ट दो का पूरा समरी ग्रिड। अगले अध्याय चार में हम समझेंगे इंटरेस्ट रेट्स, जीरो कर्व्स और बॉन्ड प्राइसिंग!",
          en_narration: "Here is the comprehensive summary grid for Chapter 3 Part 2. Next up in Chapter 4: Risk-Free Rates, Zero Curves, and Bond Valuation!",
          en_subtitle: "Complete Chapter 3 Part 2 summary grid. Next: Interest Rates in Chapter 4!",
          pauseAfterMs: 600,
          ui_state: {
            activeStepRange: [1, 8],
            steps: [
              "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
              "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
              "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
              "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
              "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
              "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
              "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
              "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
            ],
            compactOverview: true
          },
          visual: {
            kind: "summary",
            data: {
              activeStepRange: [1, 8],
              steps: [
                "1. Cross Hedging: Apply h* = ρ · (σ_S / σ_F) when the asset has no direct futures contract; never hedge 1:1.",
                "2. Contract Sizing: Optimal contract quantity is N* = h* · (Q_A / Q_F), which eliminates ρ² of asset variance.",
                "3. Index Futures Hedging: Shorting N* = β · (V_A / V_F) contracts immunizes equity portfolios from systematic crashes.",
                "4. Tactical Beta Tuning: Adjust portfolio beta with N* = (β - β*) · (V_A / V_F) without selling underlying stocks.",
                "5. Hedging Horizon: Match contract maturity close to hedging expiration to minimize basis risk.",
                "6. Stack & Roll: Rolling short-dated futures transforms maturity, but creates severe roll risk in contango markets.",
                "7. Liquidity Risk: Metallgesellschaft proves daily cash margin drains can bankrupt hedgers before maturity.",
                "8. Strategic Discipline: Maintaining liquid cash buffers is essential when utilizing synthetic derivative hedges."
              ],
              compactOverview: true
            },
            semantics: {
              teachingObjective: "Present complete 2-column executive summary grid",
              sourceFactIds: ["fact-02", "fact-03", "fact-05", "fact-06", "fact-10"]
            }
          }
        }
      ]
    }
  ]
};

const outDir = path.resolve('src/data/chapters/hull_derivatives/ch03_part2');
fs.writeFileSync(path.join(outDir, 'episode_raw.json'), JSON.stringify(episode, null, 2), 'utf8');

// Also generate English version
const enEpisode = JSON.parse(JSON.stringify(episode));
enEpisode.meta.course = 'hull_derivatives_en';
enEpisode.meta.narrationLanguage = 'en-US';

// Use en_narration for hindi_tts in English version
enEpisode.scenes.forEach(scene => {
  scene.beats.forEach(beat => {
    beat.hindi_tts = beat.en_narration;
  });
});

// Update Scene 0 personas for English (Alex & Marcus)
enEpisode.scenes[0].beats[0].ui_state.stageDirections = ["— Alex examines cross-hedging commodity risk —"];
enEpisode.scenes[0].beats[0].ui_state.messages = [
  {
    sender: "Alex",
    avatar: "A",
    text: "Marcus! Our airline needs 2M gallons of jet fuel. With no jet fuel futures, should we buy 2M gallons of heating oil futures 1-for-1?",
    theme: "amber",
    align: "left"
  }
];
enEpisode.scenes[0].beats[0].visual.data.messages = enEpisode.scenes[0].beats[0].ui_state.messages;

enEpisode.scenes[0].beats[1].ui_state.stageDirections = ["— Marcus warns against naive 1:1 cross hedging —"];
enEpisode.scenes[0].beats[1].ui_state.messages = [
  {
    sender: "Alex",
    avatar: "A",
    text: "Marcus! Our airline needs 2M gallons of jet fuel. With no jet fuel futures, should we buy 2M gallons of heating oil futures 1-for-1?",
    theme: "amber",
    align: "left"
  },
  {
    sender: "Marcus",
    avatar: "M",
    text: "Never hedge 1-for-1, Alex! Jet fuel and heating oil have different volatilities. You must compute minimum variance ratio h* to minimize risk.",
    theme: "teal",
    align: "right"
  }
];
enEpisode.scenes[0].beats[1].visual.data.messages = enEpisode.scenes[0].beats[1].ui_state.messages;

enEpisode.scenes[0].beats[2].ui_state.stageDirections = ["— Alex grasps the danger of overhedging —"];
enEpisode.scenes[0].beats[2].ui_state.messages = [
  {
    sender: "Alex",
    avatar: "A",
    text: "Marcus! Our airline needs 2M gallons of jet fuel. With no jet fuel futures, should we buy 2M gallons of heating oil futures 1-for-1?",
    theme: "amber",
    align: "left"
  },
  {
    sender: "Marcus",
    avatar: "M",
    text: "Never hedge 1-for-1, Alex! Jet fuel and heating oil have different volatilities. You must compute minimum variance ratio h* to minimize risk.",
    theme: "teal",
    align: "right"
  },
  {
    sender: "Alex",
    avatar: "A",
    text: "Understood! Since heating oil fluctuates more, buying 1-for-1 overhedges and actually magnifies portfolio variance!",
    theme: "amber",
    align: "left"
  }
];
enEpisode.scenes[0].beats[2].visual.data.messages = enEpisode.scenes[0].beats[2].ui_state.messages;

const enDir = path.resolve('src/data/chapters/hull_derivatives_en/ch03_part2');
fs.writeFileSync(path.join(enDir, 'episode_raw.json'), JSON.stringify(enEpisode, null, 2), 'utf8');

console.log('✅ Generated episode_raw.json for ch03_part2 Hindi & English!');
