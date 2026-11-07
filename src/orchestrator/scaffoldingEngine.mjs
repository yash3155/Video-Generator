// src/orchestrator/scaffoldingEngine.mjs
/**
 * Scaffolding Engine for Token-Efficient Microkernel
 * Deterministically synthesizes a 12-scene Cognitive Micro-Kernel episode structure
 * adhering strictly to the Master Chapter 1 Part 1 baseline and all validation rules.
 * 
 * Generates the full UI state, segment indices, template kinds, colors, and the 8-rule summary sequence
 * with ZERO LLM TOKENS.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * Builds a deterministic 12-scene episode skeleton.
 * @param {object} params
 * @param {string} params.chapterKey - e.g. "ch01_part1"
 * @param {string} params.courseSlug - e.g. "hull_derivatives" or "murphy_technical_analysis"
 * @param {string} params.chapterTitle - Formatted chapter title
 * @param {object[]} params.facts - Array of facts from source_facts.json
 * @param {object} params.courseConfig - Loaded course JSON config
 * @returns {object} Full episode_raw data object
 */
export function scaffoldEpisode({
  chapterKey,
  courseSlug = 'hull_derivatives',
  chapterTitle = 'Foundational Market Mechanics',
  facts = [],
  courseConfig = {}
}) {
  const isEnglish = courseSlug.includes('_en');
  const isHull = /hull|futures|options/i.test(courseSlug);
  
  // Format Chapter display string, e.g. "CHAPTER 1 · PART 1"
  const match = chapterKey.match(/ch0?(\d+)[_.-]*(?:part|p)0?(\d+)/i);
  const chapterDisplay = match
    ? `CHAPTER ${parseInt(match[1], 10)} · PART ${parseInt(match[2], 10)}`
    : chapterKey.toUpperCase();

  const primaryColor = courseConfig.visualTheme?.primaryColor || courseConfig.theme?.primaryColor || '#0F766E';
  const accentColor = courseConfig.visualTheme?.accentColor || courseConfig.theme?.accentColor || '#F59E0B';

  // Extract core facts or supply principled defaults
  const f1 = facts[0] || { id: 'fact-01', statement: 'Derivatives derive value from an underlying market asset.' };
  const f2 = facts[1] || { id: 'fact-02', statement: 'Futures are standardized contracts traded on an exchange.' };
  const f3 = facts[2] || { id: 'fact-03', statement: 'Bilateral OTC contracts carry counterparty credit default risk.' };
  const f4 = facts[3] || { id: 'fact-04', statement: 'Terminal payoff for long call is max(S_T - K, 0).' };
  const f5 = facts[4] || { id: 'fact-05', statement: 'Clearinghouses require initial margin and daily variation margin.' };
  const f6 = facts[5] || { id: 'fact-06', statement: 'High leverage accelerates balance-sheet capital depletion.' };

  // 8 Chapter Rules for the Progressive Summary Thread (Scene 11)
  const steps = [
    `1. ${f1.statement.slice(0, 110)}`,
    `2. ${f2.statement.slice(0, 110)}`,
    `3. ${f3.statement.slice(0, 110)}`,
    `4. ${f4.statement.slice(0, 110)}`,
    `5. ${f5.statement.slice(0, 110)}`,
    `6. ${f6.statement.slice(0, 110)}`,
    `7. Bilateral counterparty exposure demands rigorous collateralization.`,
    `8. Always distinguish gross terminal payoff from net trading profit.`
  ];

  const episode = {
    schemaVersion: "1.0.0",
    meta: {
      course: courseSlug,
      chapter: chapterDisplay,
      chapterTitle,
      domain: isHull ? "finance" : "technical_analysis",
      primaryColor,
      accentColor,
      narrationLanguage: isEnglish ? "en-US" : "hi-IN-devanagari"
    },
    scenes: [
      // Act 1: Narrative Origin Hook
      // Scene 0: Origin Dilemma (chat_story)
      {
        segmentIndex: 0,
        title: "Origins & The Human Dilemma",
        template: "chat_story",
        badge: "Market Desk · Historical Origins",
        beats: [
          {
            id: "b01",
            hindi_tts: "राजू पूछता है, शर्मा जी! इस वित्तीय बाजार में कांट्रैक्ट्स और रिस्क मैनेजमेंट की वास्तविक शुरुआत कैसे हुई?",
            en_subtitle: "Raju asks: Sharma ji, how did derivative contracts and risk management actually begin?",
            en_narration: "Raju asks how derivative contracts and risk management originated.",
            pauseAfterMs: 400,
            ui_state: {
              stageDirections: ["— Raju examines the origin of price risk —"],
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "Sharma ji, how did derivatives and risk transfer begin in market history?",
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
                    text: "Sharma ji, how did derivatives and risk transfer begin in market history?",
                    theme: "amber",
                    align: "left"
                  }
                ]
              },
              semantics: {
                teachingObjective: "Present the core human survival and price uncertainty dilemma.",
                sourceFactIds: [f1.id]
              }
            }
          },
          {
            id: "b02",
            hindi_tts: "शर्मा जी समझाते हैं, जब उत्पादक और खरीदार भविष्य के मूल्य उतार-चढ़ाव से बचना चाहते हैं, तब फॉरवर्ड कांट्रैक्ट्स जन्म लेते हैं।",
            en_subtitle: "Sharma ji explains: When producers and buyers face price uncertainty, forward contracts are born.",
            en_narration: "Sharma ji explains that price uncertainty gave rise to forward contracts.",
            pauseAfterMs: 450,
            ui_state: {
              stageDirections: ["— Sharma ji explains bilateral commitments —"],
              messages: [
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "When producers and buyers need price certainty, bilateral forward commitments are born.",
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
                    sender: "Sharma ji",
                    avatar: "S",
                    text: "When producers and buyers need price certainty, bilateral forward commitments are born.",
                    theme: "teal",
                    align: "right"
                  }
                ]
              },
              semantics: {
                teachingObjective: "Establish forward commitments as mutual price risk hedges.",
                sourceFactIds: [f1.id]
              }
            }
          }
        ]
      },

      // Scene 1: Conflicting Interests (tug_of_war)
      {
        segmentIndex: 1,
        title: "Conflicting Market Interests",
        template: "tug_of_war",
        badge: "Structural Conflict · Hedger vs Speculator",
        beats: [
          {
            id: "b03",
            hindi_tts: "बाजार में एक पक्ष मूल्य में गिरावट से सुरक्षा चाहता है, जबकि दूसरा पक्ष मूल्य वृद्धि के जोखिम को सीमित करना चाहता है।",
            en_subtitle: "One party hedges downside price drop, while the other protects against rising procurement costs.",
            en_narration: "One side hedges falling prices while the counterparty hedges rising costs.",
            pauseAfterMs: 400,
            ui_state: {
              leftLabel: "Farmer / Producer (Downside Protection)",
              rightLabel: "Processor / Miller (Upside Ceiling)",
              currentTension: 50
            },
            visual: {
              kind: "comparison",
              data: {
                leftLabel: "Downside Protection",
                rightLabel: "Upside Ceiling",
                tension: 50
              },
              semantics: {
                teachingObjective: "Demonstrate opposing economic motivations meeting in a forward contract.",
                sourceFactIds: [f1.id]
              }
            }
          }
        ]
      },

      // Act 2: Market Architecture & Scale
      // Scene 2: The Chapter Roadmap (progressive_cards)
      {
        segmentIndex: 2,
        title: "The Core Architecture Roadmap",
        template: "progressive_cards",
        badge: "Roadmap · 4 Structural Pillars",
        beats: [
          {
            id: "b04",
            hindi_tts: "इस अध्याय में हम चार महत्वपूर्ण स्तंभों को समझेंगे: बाजार संरचना, गणितीय पेऑफ, लिक्विडिटी और सिस्टमिक जोखिम।",
            en_subtitle: "In this chapter, we master four structural pillars: architecture, payoff math, liquidity, and systemic risk.",
            en_narration: "We explore architecture, mathematical payoffs, liquidity, and systemic risk.",
            pauseAfterMs: 400,
            ui_state: {
              activeCardIndex: 0,
              cards: [
                { title: "Market Architecture", desc: "Exchange vs Over-The-Counter mechanisms" },
                { title: "Payoff Math", desc: "Terminal gross payoff versus net profit" },
                { title: "Liquidity & Margining", desc: "Daily settlement and capital buffers" },
                { title: "Systemic Risk", desc: "Counterparty exposure and clearinghouse reforms" }
              ]
            },
            visual: {
              kind: "cards",
              data: {
                activeCardIndex: 0,
                cards: [
                  { title: "Market Architecture", desc: "Exchange vs OTC mechanisms" },
                  { title: "Payoff Math", desc: "Gross payoff versus net profit" },
                  { title: "Liquidity & Margining", desc: "Daily settlement buffers" },
                  { title: "Systemic Risk", desc: "Counterparty default mitigation" }
                ]
              },
              semantics: {
                teachingObjective: "Present structural roadmap of four learning pillars.",
                sourceFactIds: [f1.id, f2.id]
              }
            }
          }
        ]
      },

      // Scene 3: Exchange vs OTC (split_comparison)
      {
        segmentIndex: 3,
        title: "Exchange Standardization vs OTC Flexibility",
        template: "split_comparison",
        badge: "Market Structure · Bilateral vs Centralized",
        beats: [
          {
            id: "b05",
            hindi_tts: "एक्सचेंज ट्रेडेड फ्यूचर्स पूरी तरह से मानकीकृत होते हैं, जबकि ओटीसी फॉरवर्ड्स दोनों पक्षों की आवश्यकतानुसार कस्टमाइज किए जाते हैं।",
            en_subtitle: "Exchange futures are strictly standardized, while OTC contracts are bilaterally customized.",
            en_narration: "Exchange futures are standardized while OTC contracts are customized.",
            pauseAfterMs: 420,
            ui_state: {
              leftTitle: "Exchange-Traded Futures",
              rightTitle: "Over-the-Counter (OTC)",
              leftPoints: ["Standardized contract sizes", "Central clearinghouse (CCP)", "Zero bilateral default risk"],
              rightPoints: ["Tailored specifications", "Bilateral counterparty risk", "Direct negotiation"]
            },
            visual: {
              kind: "comparison",
              data: {
                leftColumn: { title: "Futures", points: ["Standardized", "CCP Cleared"] },
                rightColumn: { title: "OTC Forwards", points: ["Customized", "Bilateral Risk"] }
              },
              semantics: {
                teachingObjective: "Contrast exchange standardization with OTC customization.",
                sourceFactIds: [f2.id, f3.id]
              }
            }
          }
        ]
      },

      // Scene 4: Global Scale Comparison (progressive_cards)
      {
        segmentIndex: 4,
        title: "Global Derivatives Notional Scale",
        template: "progressive_cards",
        badge: "Global Volume · BIS Market Data",
        beats: [
          {
            id: "b06",
            hindi_tts: "वैश्विक स्तर पर ओटीसी बाजार का आकार छह सौ तीस ट्रिलियन डॉलर से अधिक है, जो एक्सचेंज बाजार से लगभग दस गुना बड़ा है।",
            en_subtitle: "Globally, the OTC market exceeds $630 trillion in notional principal, dwarfing exchange volumes.",
            en_narration: "The global OTC market exceeds $630 trillion, dwarfing exchange volumes.",
            pauseAfterMs: 400,
            ui_state: {
              activeCardIndex: 0,
              cards: [
                { title: "OTC Market Notional", desc: "$630+ Trillion global bilateral outstanding" },
                { title: "Exchange Market Notional", desc: "$65 Trillion centralized standardized volume" }
              ]
            },
            visual: {
              kind: "cards",
              data: {
                cards: [
                  { title: "OTC Market", desc: "$630T Notional" },
                  { title: "Exchange Market", desc: "$65T Notional" }
                ]
              },
              semantics: {
                teachingObjective: "Demonstrate immense macroeconomic scale of OTC markets.",
                sourceFactIds: [f3.id]
              }
            }
          }
        ]
      },

      // Act 3: Mathematical Payoff Rigor
      // Scene 5: Long Payoff Derivation (formula_breakdown)
      {
        segmentIndex: 5,
        title: "Terminal Payoff Mechanics",
        template: "formula_breakdown",
        badge: "Quantitative Proof · Terminal Payoff",
        beats: [
          {
            id: "b07",
            hindi_tts: "मैच्योरिटी पर लॉन्ग पोजीशन का ग्रॉस पेऑफ वर्तमान स्पॉट प्राइस और स्ट्राइक प्राइस का अंतर होता है।",
            en_subtitle: "At terminal maturity, gross payoff is defined as the spot price minus strike price.",
            en_narration: "At expiration, long payoff equals spot price minus the delivery strike price.",
            pauseAfterMs: 400,
            ui_state: {
              title: "Terminal Long Payoff",
              expression: "S_t - K",
              variables: [
                { symbol: "S_t", label: "Spot asset price at expiration", unit: "₹" },
                { symbol: "K", label: "Agreed delivery strike price", unit: "₹" }
              ]
            },
            visual: {
              kind: "formula",
              data: {
                title: "Terminal Long Payoff",
                expression: "S_t - K",
                variables: [
                  { symbol: "S_t", label: "Spot asset price at expiration", unit: "₹" },
                  { symbol: "K", label: "Agreed delivery strike price", unit: "₹" }
                ]
              },
              semantics: {
                teachingObjective: "Define terminal long linear payoff formula.",
                sourceFactIds: [f4.id]
              }
            }
          }
        ]
      },

      // Scene 6: Payoff vs Profit Distinction (split_comparison)
      {
        segmentIndex: 6,
        title: "Gross Payoff versus Net Trading Profit",
        template: "split_comparison",
        badge: "Core Invariant · Payoff vs Profit",
        beats: [
          {
            id: "b08",
            hindi_tts: "हमेशा याद रखें, पेऑफ केवल टर्मिनल कैशफ्लो है, जबकि नेट प्रॉफिट में शुरुआत में चुकाया गया प्रीमियम घटाया जाता है।",
            en_subtitle: "Always distinguish: Payoff is terminal cashflow; Profit deducts initial premium paid.",
            en_narration: "Payoff is gross terminal cashflow, while profit subtracts initial premium paid.",
            pauseAfterMs: 420,
            ui_state: {
              leftTitle: "Gross Payoff",
              rightTitle: "Net Trading Profit",
              leftPoints: ["Terminal cashflow at expiration", "Ignores upfront premium paid", "Always >= 0 for options"],
              rightPoints: ["Terminal payoff minus initial premium", "Accounts for capital outlay", "Negative if price stays flat"]
            },
            visual: {
              kind: "comparison",
              data: {
                leftColumn: { title: "Gross Payoff", points: ["Terminal Cashflow", "Ignores Premium"] },
                rightColumn: { title: "Net Profit", points: ["Payoff - Premium", "True Economic P&L"] }
              },
              semantics: {
                teachingObjective: "Strictly enforce the Payoff vs Profit distinction.",
                sourceFactIds: [f4.id]
              }
            }
          }
        ]
      },

      // Act 4: Real-World Crisis & Systemic Risk
      // Scene 7: Lehman Brothers 2008 Insolvency (progressive_cards)
      {
        segmentIndex: 7,
        title: "Systemic Risk & Bilateral Contagion",
        template: "progressive_cards",
        badge: "Case Study · Lehman Brothers 2008",
        beats: [
          {
            id: "b09",
            hindi_tts: "दो हजार आठ में लेहमैन ब्रदर्स के पास छह सौ बिलियन डॉलर के अनक्लेयर्ड ओटीसी डेरिवेटिव्स थे, जिससे पूरी वित्तीय प्रणाली फ्रीज हो गई।",
            en_subtitle: "In 2008, Lehman held over $600 billion in uncollateralized OTC positions, freezing the banking system.",
            en_narration: "In 2008, Lehman held $600 billion in OTC positions, triggering systemic contagion.",
            pauseAfterMs: 420,
            ui_state: {
              activeCardIndex: 0,
              cards: [
                { title: "Bilateral Gridlock", desc: "No central clearing meant counterparties could not assess exposures" },
                { title: "Post-Crisis Reform", desc: "G20 mandate required standardized OTC clearing through CCPs" }
              ]
            },
            visual: {
              kind: "cards",
              data: {
                cards: [
                  { title: "Lehman Collapse", desc: "$600B OTC Network" },
                  { title: "Regulatory Response", desc: "Mandatory Central Clearing" }
                ]
              },
              semantics: {
                teachingObjective: "Illustrate systemic counterparty contagion in uncollateralized OTC markets.",
                sourceFactIds: [f3.id, f5.id]
              }
            }
          }
        ]
      },

      // Scene 8: The Leverage Wipeout Threshold (formula_breakdown)
      {
        segmentIndex: 8,
        title: "Leverage Multipliers & Equity Depletion",
        template: "formula_breakdown",
        badge: "Balance Sheet Risk · Leverage Math",
        beats: [
          {
            id: "b10",
            hindi_tts: "इकतीस गुना लेवरेज पर एसेट्स में केवल सवा तीन परसेंट की गिरावट पूरे शेयरहोल्डर इक्विटी को शून्य कर देती है।",
            en_subtitle: "At thirty-one to one leverage, just a 3.2% decline in assets completely wipes out shareholder equity.",
            en_narration: "At 31 to 1 leverage, a 3.2% decline in assets wipes out shareholder equity.",
            pauseAfterMs: 400,
            ui_state: {
              title: "Leverage Multipliers & Equity Wipeout",
              expression: "L = \\text{Assets} / \\text{Equity}",
              variables: [
                { symbol: "L", label: "Balance sheet leverage ratio (31:1)", unit: "ratio" },
                { symbol: "\\Delta Equity", label: "\\Delta Assets \\times L", unit: "%" }
              ]
            },
            visual: {
              kind: "formula",
              data: {
                title: "Leverage Multipliers & Equity Wipeout",
                expression: "L = \\text{Assets} / \\text{Equity}",
                variables: [
                  { symbol: "L", label: "Leverage ratio", unit: "ratio" },
                  { symbol: "\\Delta Equity", label: "Change in equity", unit: "%" }
                ]
              },
              semantics: {
                teachingObjective: "Prove mathematically how high leverage accelerates balance-sheet bankruptcy.",
                sourceFactIds: [f6.id]
              }
            }
          }
        ]
      },

      // Act 5: Active Recall & Master Progressive Summary
      // Scene 9: Interactive Quiz (interactive_quiz) - STRICTLY 3 BEATS
      {
        segmentIndex: 9,
        title: "Active Recall Scenario",
        template: "interactive_quiz",
        badge: "Concept Verification · Active Recall",
        beats: [
          // Beat 0: Question Presentation
          {
            id: "b11",
            hindi_tts: "यदि एक ट्रेडर बिना हेजिंग के अत्यधिक लेवरेज पोजीशन लेता है और बाजार विपरीत दिशा में जाता है, तो सबसे बड़ा प्राथमिक जोखिम क्या है?",
            en_subtitle: "If a trader takes an unhedged leveraged position, what is the immediate structural risk?",
            en_narration: "What is the primary risk of an unhedged highly leveraged market position?",
            pauseAfterMs: 400,
            ui_state: {
              question: "What is the primary risk of holding high leverage without adequate variation margin?",
              options: [
                "A) Guaranteed price recovery at expiration",
                "B) Immediate margin call and total equity liquidation",
                "C) Elimination of counterparty default risk",
                "D) Automatic contract conversion to equity"
              ],
              showThinkingSpinner: false,
              answer: ""
            },
            visual: {
              kind: "quiz",
              data: {
                question: "What is the primary risk of holding high leverage without adequate variation margin?",
                options: [
                  "A) Guaranteed price recovery at expiration",
                  "B) Immediate margin call and total equity liquidation",
                  "C) Elimination of counterparty default risk",
                  "D) Automatic contract conversion to equity"
                ]
              },
              semantics: {
                teachingObjective: "Test understanding of leverage depletion and margin call dynamics.",
                sourceFactIds: [f5.id, f6.id]
              }
            }
          },
          // Beat 1: Thinking Pause with spinner
          {
            id: "b12",
            hindi_tts: "सोचिए... क्या मार्जिन बफर के बिना पोजीशन सर्वाइव कर सकती है?",
            en_subtitle: "Think carefully... Can a leveraged position survive without adequate margin capital?",
            en_narration: "Pause and consider the margin mechanics.",
            pauseAfterMs: 3200,
            ui_state: {
              question: "What is the primary risk of holding high leverage without adequate variation margin?",
              showThinkingSpinner: true,
              answer: ""
            },
            visual: {
              kind: "quiz",
              data: {
                showThinkingSpinner: true
              },
              semantics: {
                teachingObjective: "Engage active recall cognitive processing pause.",
                sourceFactIds: [f6.id]
              }
            }
          },
          // Beat 2: Answer Reveal & Verification
          {
            id: "b13",
            hindi_tts: "सही उत्तर बी है! अपर्याप्त मार्जिन पर ब्रोकर या एक्सचेंज तुरंत पोजीशन को लिक्विडेट कर देता है।",
            en_subtitle: "Correct answer is B! Insufficient margin triggers immediate forced liquidation.",
            en_narration: "Correct answer is B: Insufficient margin triggers immediate forced liquidation.",
            pauseAfterMs: 450,
            ui_state: {
              question: "What is the primary risk of holding high leverage without adequate variation margin?",
              showThinkingSpinner: false,
              answer: "B) Immediate margin call and total equity liquidation. Clearinghouses mandate daily variation margin to prevent systemic default.",
              correctIndex: 1
            },
            visual: {
              kind: "quiz",
              data: {
                answer: "B) Immediate margin call and total equity liquidation.",
                correctIndex: 1
              },
              semantics: {
                teachingObjective: "Reinforce correct understanding of daily variation settlement.",
                sourceFactIds: [f5.id, f6.id]
              }
            }
          }
        ]
      },

      // Scene 10: Practical Application Dialogue (chat_story)
      {
        segmentIndex: 10,
        title: "Trading Desk Execution Rules",
        template: "chat_story",
        badge: "Practical Synthesis · Senior Trader Desk",
        beats: [
          {
            id: "b14",
            hindi_tts: "राजू कहता है, इसका अर्थ यह है कि बाजार में टिके रहने के लिए लेवरेज से पहले मार्जिन और सेटलमेंट को समझना अनिवार्य है।",
            en_subtitle: "Raju notes: To survive, understanding margin and settlement rules comes before taking leverage.",
            en_narration: "Raju realizes that understanding settlement rules precedes taking leverage.",
            pauseAfterMs: 400,
            ui_state: {
              stageDirections: ["— Raju summarizes risk discipline —"],
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: "So margin buffer and settlement discipline matter more than aggressive positioning!",
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
                    text: "Margin buffer and settlement discipline matter more than aggressive positioning!",
                    theme: "amber",
                    align: "left"
                  }
                ]
              },
              semantics: {
                teachingObjective: "Synthesize operational risk discipline before directional speculation.",
                sourceFactIds: [f5.id, f6.id]
              }
            }
          },
          {
            id: "b15",
            hindi_tts: "शर्मा जी पुष्टि करते हैं, बिल्कुल! सफल ट्रेडर्स दिशा का अनुमान लगाने से पहले अपनी पूंजी की सुरक्षा सुनिश्चित करते हैं।",
            en_subtitle: "Sharma ji confirms: Exactly! Disciplined traders protect capital before predicting market direction.",
            en_narration: "Sharma ji confirms that capital protection precedes directional bets.",
            pauseAfterMs: 450,
            ui_state: {
              stageDirections: ["— Sharma ji delivers core trading maxim —"],
              messages: [
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: "Disciplined market participants protect capital buffers before guessing price direction.",
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
                    sender: "Sharma ji",
                    avatar: "S",
                    text: "Disciplined market participants protect capital buffers before guessing price direction.",
                    theme: "teal",
                    align: "right"
                  }
                ]
              },
              semantics: {
                teachingObjective: "Affirm risk management as the paramount prerequisite for trading longevity.",
                sourceFactIds: [f6.id]
              }
            }
          }
        ]
      },

      // Scene 11: The Whole Picture (summary_thread) - STRICT 6 BEATS: [0,0], [1,2], [3,4], [5,6], [7,8], compactOverview
      {
        segmentIndex: 11,
        title: "The Whole Picture: 8 Core Principles",
        template: "summary_thread",
        badge: "Master Review · 8 Inviolable Rules",
        beats: [
          // Beat 0: [0, 0] Roadmap Overview
          {
            id: "b16",
            hindi_tts: "आइए पूरे अध्याय के आठ बुनियादी सिद्धांतों की एक व्यवस्थित समीक्षा करें।",
            en_subtitle: "Let us review the eight foundational principles established in this lesson.",
            en_narration: "Let us review the eight foundational principles of this lesson.",
            pauseAfterMs: 400,
            ui_state: {
              steps,
              activeStepRange: [0, 0],
              compactOverview: false
            },
            visual: {
              kind: "summary",
              data: {
                steps,
                activeStepRange: [0, 0]
              },
              semantics: {
                teachingObjective: "Present executive overview of the 8 chapter rules.",
                sourceFactIds: [f1.id, f2.id]
              }
            }
          },
          // Beat 1: [1, 2] Rules 1 & 2
          {
            id: "b17",
            hindi_tts: "पहले और दूसरे नियम के अनुसार, डेरिवेटिव्स अंतर्निहित संपत्ति से मूल्य लेते हैं और फ्यूचर्स एक्सचेंज पर मानकीकृत होते हैं।",
            en_subtitle: "First and second: Derivatives derive value from underlyings, and futures are standardized on exchanges.",
            en_narration: "Rules 1 and 2: Derivatives derive value from underlyings, and futures are standardized.",
            pauseAfterMs: 400,
            ui_state: {
              steps,
              activeStepRange: [1, 2],
              compactOverview: false
            },
            visual: {
              kind: "summary",
              data: {
                steps,
                activeStepRange: [1, 2]
              },
              semantics: {
                teachingObjective: "Reinforce rules 1 and 2.",
                sourceFactIds: [f1.id, f2.id]
              }
            }
          },
          // Beat 2: [3, 4] Rules 3 & 4
          {
            id: "b18",
            hindi_tts: "तीसरे और चौथे नियम के अनुसार, ओटीसी में काउंटरपार्टी रिस्क रहता है और पेऑफ में हमेशा स्ट्राइक प्राइस का महत्व होता है।",
            en_subtitle: "Third and fourth: OTC contracts carry bilateral counterparty risk, and payoff is defined by the strike price.",
            en_narration: "Rules 3 and 4: OTC carries counterparty risk, and payoff depends on strike.",
            pauseAfterMs: 400,
            ui_state: {
              steps,
              activeStepRange: [3, 4],
              compactOverview: false
            },
            visual: {
              kind: "summary",
              data: {
                steps,
                activeStepRange: [3, 4]
              },
              semantics: {
                teachingObjective: "Reinforce rules 3 and 4.",
                sourceFactIds: [f3.id, f4.id]
              }
            }
          },
          // Beat 3: [5, 6] Rules 5 & 6
          {
            id: "b19",
            hindi_tts: "पांचवें और छठे नियम के तहत, क्लीयरिंगहाउस वेरिएशन मार्जिन से रिस्क कम करता है और लेवरेज इक्विटी को तेजी से घटा सकता है।",
            en_subtitle: "Fifth and sixth: Clearinghouses enforce variation margin, and high leverage rapidly depletes equity.",
            en_narration: "Rules 5 and 6: Margin protects clearinghouses, while leverage depletes equity.",
            pauseAfterMs: 400,
            ui_state: {
              steps,
              activeStepRange: [5, 6],
              compactOverview: false
            },
            visual: {
              kind: "summary",
              data: {
                steps,
                activeStepRange: [5, 6]
              },
              semantics: {
                teachingObjective: "Reinforce rules 5 and 6.",
                sourceFactIds: [f5.id, f6.id]
              }
            }
          },
          // Beat 4: [7, 8] Rules 7 & 8 (Rule 8 has dedicated focus)
          {
            id: "b20",
            hindi_tts: "सातवें और आठवें नियम के अनुसार, बायलेटरल पोजीशन में कोलेटरल अनिवार्य है और ग्रॉस पेऑफ को कभी नेट प्रॉफिट न समझें।",
            en_subtitle: "Seventh and eighth: Bilateral exposure requires collateral, and never confuse gross payoff with net profit.",
            en_narration: "Rules 7 and 8: Collateralize bilateral risk, and never confuse payoff with profit.",
            pauseAfterMs: 450,
            ui_state: {
              steps,
              activeStepRange: [7, 8],
              compactOverview: false
            },
            visual: {
              kind: "summary",
              data: {
                steps,
                activeStepRange: [7, 8]
              },
              semantics: {
                teachingObjective: "Reinforce rules 7 and 8 with dedicated focus.",
                sourceFactIds: [f3.id, f4.id]
              }
            }
          },
          // Beat 5: compactOverview: true (Whole-chapter 2-column grid)
          {
            id: "b21",
            hindi_tts: "यह आठ नियम किसी भी डेरिवेटिव्स और फाइनेंशियल मार्केट में अनुशासन और सफलता की वास्तविक नींव हैं।",
            en_subtitle: "These eight principles form the enduring foundation for trading discipline across global markets.",
            en_narration: "These eight rules form the foundation of trading discipline.",
            pauseAfterMs: 500,
            ui_state: {
              steps,
              activeStepRange: [1, 8],
              compactOverview: true
            },
            visual: {
              kind: "summary",
              data: {
                steps,
                activeStepRange: [1, 8],
                compactOverview: true
              },
              semantics: {
                teachingObjective: "Display comprehensive whole-chapter synthesis overview.",
                sourceFactIds: [f1.id, f2.id, f3.id, f4.id, f5.id, f6.id]
              }
            }
          }
        ]
      }
    ]
  };

  return episode;
}
