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
 * @param {object} [params.sceneOverrides] - Optional custom scene specifications from Argon
 * @returns {object} Full episode_raw data object
 */
export function scaffoldEpisode({
  chapterKey,
  courseSlug = 'hull_derivatives',
  chapterTitle = 'Foundational Market Mechanics',
  facts = [],
  courseConfig = {},
  sceneOverrides = null
}) {
  const isEnglish = courseSlug.includes('_en');
  const isHull = /hull|futures|options/i.test(courseSlug);
  
  // Format Chapter display string, e.g. "CHAPTER 1 · PART 1"
  const match = chapterKey.match(/ch0?(\d+)[_.-]*(?:part|p)0?(\d+)/i);
  const chapterDisplay = match
    ? `CHAPTER ${parseInt(match[1], 10)} · PART ${parseInt(match[2], 10)}`
    : (chapterKey.toLowerCase().includes('foreword') ? 'FOREWORD' : chapterKey.toUpperCase().replace(/_/g, ' '));

  const primaryColor = courseConfig.visualTheme?.primaryColor || courseConfig.theme?.primaryColor || (isHull ? '#0F766E' : '#B45309');
  const accentColor = courseConfig.visualTheme?.accentColor || courseConfig.theme?.accentColor || (isHull ? '#F59E0B' : '#2563EB');

  // Extract core facts or supply principled domain-specific defaults
  const f1 = facts[0] || (isHull
    ? { id: 'fact-01', statement: 'Derivatives derive value from an underlying market asset.' }
    : { id: 'fact-01', statement: 'Market action discounts fundamental news before public dissemination.' });
  const f2 = facts[1] || (isHull
    ? { id: 'fact-02', statement: 'Futures are standardized contracts traded on an exchange.' }
    : { id: 'fact-02', statement: 'Prices move in persistent trends until definitive reversal signals emerge.' });
  const f3 = facts[2] || (isHull
    ? { id: 'fact-03', statement: 'Bilateral OTC contracts carry counterparty credit default risk.' }
    : { id: 'fact-03', statement: 'Chart geometry and price patterns reflect repetitive collective human psychology.' });
  const f4 = facts[3] || (isHull
    ? { id: 'fact-04', statement: 'Terminal payoff for long call is max(S_T - K, 0).' }
    : { id: 'fact-04', statement: 'Volume must expand in the direction of the prevailing trend to confirm price.' });
  const f5 = facts[4] || (isHull
    ? { id: 'fact-05', statement: 'Clearinghouses require initial margin and daily variation margin.' }
    : { id: 'fact-05', statement: 'Breakouts require closing penetration filters beyond established boundaries.' });
  const f6 = facts[5] || (isHull
    ? { id: 'fact-06', statement: 'High leverage accelerates balance-sheet capital depletion.' }
    : { id: 'fact-06', statement: 'Prematurely anticipating patterns before completion risks severe whipsaw losses.' });

  // Helper to get scene overrides or fallbacks
  const so = sceneOverrides || {};

  // 8 Chapter Rules for the Progressive Summary Thread (Scene 11)
  const steps = so.scene11?.rules || [
    `1. ${f1.statement.slice(0, 105)}`,
    `2. ${f2.statement.slice(0, 105)}`,
    `3. ${f3.statement.slice(0, 105)}`,
    `4. ${f4.statement.slice(0, 105)}`,
    `5. ${f5.statement.slice(0, 105)}`,
    `6. ${f6.statement.slice(0, 105)}`,
    `7. ${facts[6] ? facts[6].statement.slice(0, 105) : (isHull ? 'Bilateral counterparty exposure demands rigorous collateralization.' : 'Always await verified price confirmation before committing trading capital.')}`,
    `8. ${facts[7] ? facts[7].statement.slice(0, 105) : (isHull ? 'Always distinguish gross terminal payoff from net trading profit.' : 'Disciplined risk control and stop losses supersede subjective market conviction.')}`
  ];

  // Build Scene 0 UI Data (The Motivating Front Dilemma: 4 Beats)
  const sc0 = so.scene0 || (isHull ? {
    title: "Origins & The Human Dilemma",
    badge: "Historical Origins · 1848 CBOT",
    b01_raju: "Sharma ji, how did futures and forwards actually originate in financial history?",
    b02_sharma: "In the 1800s, Midwest farmers planted corn in June, with harvest arriving in September.",
    b03_sharma: "A bumper crop crashed prices, bankrupting farmers; drought caused price spikes, bankrupting millers!",
    b04_sharma: "In 1848, CBOT standardized 5,000-bushel contracts to lock delivery prices in advance!",
    b01_tts: "राजू पूछता है, शर्मा जी, वित्तीय बाजारों में यह फ्यूचर्स और फॉरवर्ड्स की शुरुआत आखिर कैसे हुई?",
    b02_tts: "शर्मा जी समझाते हैं, उन्नीसवीं सदी में अमेरिकी किसान जून में मक्के की बुआई करते थे और सितंबर में फसल कटती थी।",
    b03_tts: "अगर बंपर पैदावार होती तो भाव धड़ाम से गिर जाते और किसान बर्बाद हो जाता, और सूखा पड़ता तो अनाज व्यापारी के लिए लागत आसमान छू जाती।",
    b04_tts: "इसलिए अठारह सौ अड़तालीस में शिकागो बोर्ड ऑफ ट्रेड ने पांच हजार बुशल के मानकीकृत सौदों से भाव पहले ही तय करना शुरू किया, ताकि दोनों का जीवन सुरक्षित हो सके।",
    b01_en: "Raju asks: Sharma ji, how did futures and forwards actually originate in financial markets?",
    b02_en: "Sharma ji explains: In the 19th century, American Midwest farmers planted corn in June for September harvest.",
    b03_en: "A bumper crop caused harvest prices to collapse, ruining farmers; while a drought caused prices to surge, bankrupting flour merchants.",
    b04_en: "Thus in 1848, the Chicago Board of Trade created standardized 5,000-bushel contracts to fix prices ahead of delivery, protecting both livelihoods."
  } : {
    title: `Origins & The Market Dilemma: ${chapterTitle}`,
    badge: "Market Reality · Problem & Solution",
    b01_raju: "Sharma ji, why do investors buy on record earnings reports only to suffer heavy losses?",
    b02_sharma: "An investor bought XYZ stock after quarterly reports showed a 25% profit surge.",
    b03_sharma: "Public reports lag by 3 months; smart money already dumped 30% on insider selling!",
    b04_sharma: "John Murphy proves: Price action discounts all news in advance, protecting you from the lag trap!",
    b01_tts: "राजू पूछता है, शर्मा जी! कई ट्रेडर्स किसी कंपनी की शानदार अर्निंग्स रिपोर्ट देखकर शेयर खरीदते हैं, फिर भी भारी नुकसान क्यों उठाते हैं?",
    b02_tts: "शर्मा जी समझाते हैं, कल्पना करो एक निवेशक विजय की, जिसने तिमाही नतीजों में पच्चीस परसेंट मुनाफा देखकर एक्स वाई जेड कंपनी के शेयर खरीदे।",
    b03_tts: "लेकिन वित्तीय रिपोर्ट तीन महीने पुरानी थी, जबकि स्मार्ट मनी को पहले ही जानकारी थी और उन्होंने खबर आते ही तीस परसेंट डंप कर दिया!",
    b04_tts: "इसलिए जॉन मर्फी समझाते हैं कि भाव सभी खबरों को पहले ही समाहित कर लेता है, और चार्ट देखकर ही आप इस ट्रैप से बच सकते हैं!",
    b01_en: "Raju asks: Sharma ji, why do investors buy on record earnings reports only to suffer heavy losses?",
    b02_en: "Sharma ji explains: An investor bought XYZ shares after seeing quarterly filings show a 25% profit surge.",
    b03_en: "However, public earnings reports lagged by three months, while smart money had already dumped 30% of their holdings.",
    b04_en: "Thus, John Murphy proves market action discounts all information in advance, protecting disciplined chartists from the news lag trap."
  });

  // Build Scene 1 UI Data (Opposing Forces: 3 Beats)
  const sc1 = so.scene1 || (isHull ? {
    title: "Conflicting Market Interests",
    badge: "Structural Conflict · Hedger vs Speculator",
    leftLabel: "Farmer / Producer (Downside Fear)",
    rightLabel: "Processor / Miller (Price Spike Fear)",
    b05_tts: "फ्यूचर्स की शुरुआत शिकागो में मक्का किसानों और मिल मालिकों के बीच मूल्य जोखिम को संतुलित करने के लिए हुई थी।",
    b06_tts: "किसान को बंपर फसल पर भाव गिरने का डर था, और मिल मालिक को फसल खराब होने पर आटा बनाने की लागत बढ़ने का खौफ था।",
    b07_tts: "फॉरवर्ड कांट्रैक्ट ने दोनों पक्षों को डिलीवरी से पहले एक निश्चित भाव पर बांधकर इस अनिश्चितता को समाप्त कर दिया।",
    b05_en: "Futures originated in Chicago to balance price uncertainty between corn farmers and flour millers.",
    b06_en: "The farmer feared price collapse from oversupply, while the miller dreaded price spikes wiping out operating margins.",
    b07_en: "The forward contract eliminated existential uncertainty by locking in delivery prices ahead of time."
  } : {
    title: "The Information Lag Conflict",
    badge: "Market Friction · News Lag vs Leading Price",
    leftLabel: "Fundamental News Lag (Trapped Crowd)",
    rightLabel: "Leading Price Action (Disciplined Chartist)",
    b05_tts: "बाजार में एक तरफ पुरानी खबरों पर निर्भर आम जनता होती है, जबकि दूसरी तरफ भाव के रुझान को पढ़ने वाले अनुशासित चार्टिस्ट होते हैं।",
    b06_tts: "खबर आने तक भाव पहले ही गिर चुका होता है, जिससे देर से आने वाले खरीदार ऊपरी स्तरों पर बुरी तरह फंस जाते हैं।",
    b07_tts: "तकनीकी विश्लेषण का पहला नियम यही सिखाता है कि भाव की चाल को समझकर ही समय पर सही निर्णय लिया जा सकता है।",
    b05_en: "On one side is the retail crowd relying on stale quarterly reports; on the other are disciplined chartists acting on real-time price action.",
    b06_en: "By the time public news breaks, prices have already tumbled, leaving late fundamental buyers completely trapped at the highs.",
    b07_en: "The foundational premise of technical analysis proves that understanding price action provides the vital timing that fundamentals lack."
  });

  // Build Scene 2 UI Data (4 Structural Pillars: 4 Beats)
  const sc2 = so.scene2 || (isHull ? {
    title: "The Core Architecture Roadmap",
    badge: "Roadmap · 4 Structural Pillars",
    cards: [
      { title: "Market Architecture", desc: "Exchange vs Over-The-Counter mechanisms" },
      { title: "Payoff Math", desc: "Terminal gross payoff versus net profit" },
      { title: "Liquidity & Margining", desc: "Daily settlement and capital buffers" },
      { title: "Systemic Risk", desc: "Counterparty exposure and clearinghouse reforms" }
    ],
    b08_tts: "पहला स्तंभ है बाजार संरचना: एक्सचेंज ट्रेडेड फ्यूचर्स और ओटीसी फॉरवर्ड्स के बीच बुनियादी अंतर।",
    b09_tts: "दूसरा स्तंभ है पेऑफ का गणित: मैच्योरिटी पर टर्मिनल ग्रॉस पेऑफ और शुद्ध लाभ के बीच स्पष्ट रेखा।",
    b10_tts: "तीसरा स्तंभ है लिक्विडिटी और मार्जिन: डेली सेटलमेंट और कैपिटल बफर कैसे दिवालिया होने से बचाते हैं।",
    b11_tts: "चौथा स्तंभ है सिस्टमिक जोखिम: बायलेटरल काउंटरपार्टी रिस्क और क्लीयरिंगहाउस की केंद्रीय भूमिका।",
    b08_en: "Pillar one is market architecture: the structural divide between centralized futures and OTC forwards.",
    b09_en: "Pillar two is payoff mathematics: distinguishing gross terminal cashflows from net economic trading profit.",
    b10_en: "Pillar three is liquidity and margining: daily variation settlement buffering against rapid capital depletion.",
    b11_en: "Pillar four is systemic risk: managing bilateral counterparty exposures through central clearinghouses."
  } : {
    title: "The 4 Core Analytical Pillars",
    badge: "Roadmap · 4 Methodological Pillars",
    cards: [
      { title: facts[0]?.topic || "Market Premise", desc: (facts[0]?.statement || "Price action discounts fundamental information.").slice(0, 70) },
      { title: facts[1]?.topic || "Trend Mechanics", desc: (facts[1]?.statement || "Trends persist until verified reversal signals.").slice(0, 70) },
      { title: facts[2]?.topic || "Chart Geometry", desc: (facts[2]?.statement || "Geometric boundaries and confirmation filters.").slice(0, 70) },
      { title: facts[3]?.topic || "Risk Management", desc: (facts[3]?.statement || "Objective stop loss and position sizing rules.").slice(0, 70) }
    ],
    b08_tts: "पहला स्तंभ है प्राइस डिस्काउंटिंग: बाजार का भाव सभी बुनियादी, राजनीतिक और मनोवैज्ञानिक खबरों को समाहित कर लेता है।",
    b09_tts: "दूसरा स्तंभ है ट्रेंड की निरंतरता: बाजार में एक बार शुरू हुआ रुझान तब तक जारी रहता है जब तक निश्चित उलटने के संकेत न मिलें।",
    b10_tts: "तीसरा स्तंभ है चार्ट पैटर्न्स: मानवीय मनोविज्ञान स्थिर रहता है, जिससे चार्ट पर वही आकृतियां बार-बार दोहराई जाती हैं।",
    b11_tts: "चौथा स्तंभ है टाइमिंग और अनुशासन: सही समय पर ट्रेड में प्रवेश और स्टॉप लॉस से पूंजी की रक्षा करना।",
    b08_en: "Pillar one is market discounting: current price reflects all fundamental, political, and psychological information.",
    b09_en: "Pillar two is trend persistence: an established trend is far more likely to continue than to reverse.",
    b10_en: "Pillar three is chart geometry: repetitive human crowd psychology generates invariant recurring patterns.",
    b11_en: "Pillar four is execution timing: identifying the precise moment to deploy capital while enforcing strict stop losses."
  });

  // Build Scene 3 UI Data (Comparison)
  const sc3 = so.scene3 || (isHull ? {
    title: "Exchange Standardization vs OTC Flexibility",
    badge: "Market Structure · Bilateral vs Centralized",
    leftTitle: "Exchange-Traded Futures",
    rightTitle: "Over-the-Counter (OTC)",
    leftPoints: ["Standardized contract sizes", "Central clearinghouse (CCP)", "Zero bilateral default risk"],
    rightPoints: ["Tailored specifications", "Bilateral counterparty risk", "Direct negotiation"]
  } : {
    title: "Lagging Fundamentals versus Leading Price Action",
    badge: "Analytical Edge · Lags vs Leading Signals",
    leftTitle: "Lagging Fundamentals",
    rightTitle: "Price Action (Technicals)",
    leftPoints: ["Quarterly reporting publication delay", "Subjective balance sheet interpretation", "Insiders discount news weeks before release"],
    rightPoints: ["Immediate discounting of all market forces", "Objective visual geometry and boundaries", "Direct evidence of real institutional supply & demand"]
  });

  // Build Scene 4 UI Data (Empirical Evidence / Volume)
  const sc4 = so.scene4 || (isHull ? {
    title: "Global Derivatives Notional Scale",
    badge: "Global Volume · BIS Market Data",
    cards: [
      { title: "OTC Market Notional", desc: "$630+ Trillion global bilateral outstanding" },
      { title: "Exchange Market Notional", desc: "$65 Trillion centralized standardized volume" }
    ]
  } : {
    title: "Empirical Reliability & Volume Confirmation",
    badge: "Market Evidence · Volume & Liquidity",
    cards: [
      { title: "Empirical Repetition", desc: "Decades of multi-market data confirm invariant human crowd psychology." },
      { title: "Volume Commitment", desc: "Institutional volume must expand to confirm genuine breakout validity." }
    ]
  });

  // Build Scene 5 UI Data (Quantitative Proof / Formula)
  const formulaFact = facts.find(f => f.category === 'formula' && f.formulaDetails?.name);
  const sc5 = so.scene5 || (isHull ? {
    title: "Terminal Payoff Mechanics",
    badge: "Quantitative Proof · Terminal Payoff",
    expression: "S_t - K",
    variables: [
      { symbol: "S_t", label: "Spot asset price at expiration", unit: "₹" },
      { symbol: "K", label: "Agreed delivery strike price", unit: "₹" }
    ]
  } : (formulaFact ? {
    title: formulaFact.formulaDetails.name,
    badge: "Quantitative Rule · Formula",
    expression: formulaFact.formulaDetails.latex || formulaFact.statement.slice(0, 30),
    variables: (formulaFact.formulaDetails.variables || []).slice(0, 2).map(v => ({
      symbol: v.symbol || "P",
      label: v.definition || v.label || "Market variable",
      unit: v.unit || "pts"
    }))
  } : {
    title: "Objective Breakout Confirmation Filter",
    badge: "Quantitative Rule · Confirmation Threshold",
    expression: "\\text{Breakout Confirmation} = \\text{Boundary} \\times (1 + \\text{Filter})",
    variables: [
      { symbol: "\\text{Boundary}", label: "Established support or resistance level", unit: "pts" },
      { symbol: "\\text{Filter}", label: "Standard 3% price penetration rule", unit: "%" }
    ]
  }));

  // Build Scene 6 UI Data (Validation / Payoff vs Profit)
  const sc6 = so.scene6 || (isHull ? {
    title: "Gross Payoff versus Net Trading Profit",
    badge: "Core Invariant · Payoff vs Profit",
    leftTitle: "Gross Payoff",
    rightTitle: "Net Trading Profit",
    leftPoints: ["Terminal cashflow at expiration", "Ignores upfront premium paid", "Always >= 0 for options"],
    rightPoints: ["Terminal payoff minus initial premium", "Accounts for capital outlay", "Negative if price stays flat"]
  } : {
    title: "Confirmed Breakout versus False Breakout (Whipsaw)",
    badge: "Validation Invariant · Authentic vs False Signal",
    leftTitle: "Confirmed Breakout",
    rightTitle: "False Breakout (Bull/Bear Trap)",
    leftPoints: ["Decisive close beyond price threshold", "Significant companion volume expansion", "Two-day penetration follow-through"],
    rightPoints: ["Intraday piercing without daily close", "Drying or declining volume during probe", "Immediate sharp reversal trapping breakout traders"]
  });

  // Build Scene 7 UI Data (Case Study / Crisis)
  const sc7 = so.scene7 || (isHull ? {
    title: "Systemic Risk & Bilateral Contagion",
    badge: "Case Study · Lehman Brothers 2008",
    cards: [
      { title: "Bilateral Gridlock", desc: "No central clearing meant counterparties could not assess exposures" },
      { title: "Post-Crisis Reform", desc: "G20 mandate required standardized OTC clearing through CCPs" }
    ]
  } : {
    title: "Case Study · The Premature Anticipation Trap",
    badge: "Case Study · Trader Pitfall",
    cards: [
      { title: "The Anticipation Error", desc: "Traders jumping into positions before the chart pattern completes or neckline breaks." },
      { title: "The Disciplined Rule", desc: "Awaiting objective closing price confirmation prevents devastating whipsaw losses." }
    ]
  });

  // Build Scene 8 UI Data (Risk Math / Leverage)
  const sc8 = so.scene8 || (isHull ? {
    title: "Leverage Multipliers & Equity Depletion",
    badge: "Balance Sheet Risk · Leverage Math",
    expression: "L = \\text{Assets} / \\text{Equity}",
    variables: [
      { symbol: "L", label: "Balance sheet leverage ratio (31:1)", unit: "ratio" },
      { symbol: "\\Delta Equity", label: "\\Delta Assets \\times L", unit: "%" }
    ]
  } : {
    title: "Risk-to-Reward Ratio & Position Sizing",
    badge: "Capital Preservation · Risk Math",
    expression: "R = \\text{Target Profit Potential} / \\text{Maximum Stop Risk}",
    variables: [
      { symbol: "R", label: "Minimum required 3:1 Reward-to-Risk ratio", unit: "ratio" },
      { symbol: "\\text{Risk}", label: "Total capital placed at risk per trade", unit: "₹" }
    ]
  });

  // Build Scene 9 UI Data (Interactive Quiz Scenario >= 18 words)
  const sc9 = so.scene9 || (isHull ? {
    question: "What is the primary risk of holding high leverage without adequate variation margin?",
    options: [
      "A) Guaranteed price recovery at expiration",
      "B) Immediate margin call and total equity liquidation",
      "C) Elimination of counterparty default risk",
      "D) Automatic contract conversion to equity"
    ],
    correctIndex: 1,
    answer: "B) Immediate margin call and total equity liquidation. Clearinghouses mandate daily variation margin to prevent systemic default."
  } : {
    question: `In this Technical Analysis scenario based on ${chapterTitle}: An investor spots a glowing fundamental report, but the chart breaks below support on heavy volume. Should the investor buy the news or respect the price breakdown?`,
    options: [
      "A) Buy aggressively believing quarterly news supersedes technical price action",
      "B) Respect the chart breakdown because market action discounts all information in advance",
      "C) Disregard both price and volume as meaningless short-term fluctuations",
      "D) Average down heavily assuming public media news is never priced in"
    ],
    correctIndex: 1,
    answer: "B) Respect the chart breakdown because market action discounts all fundamental information in advance. Technical breakdowns on volume signal informed institutional distribution."
  });

  // Build Scene 10 UI Data (Mentor Wisdom)
  const sc10 = so.scene10 || (isHull ? {
    rajuText: "So margin buffer and settlement discipline matter more than aggressive positioning!",
    sharmaText: "Disciplined market participants protect capital buffers before guessing price direction."
  } : {
    rajuText: "So objective price confirmation and volume matter far more than subjective market opinions!",
    sharmaText: "Exactly! Disciplined chartists trade what they objectively see on the chart, not what they hope or think."
  });

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
      // Scene 0: Origin Dilemma (chat_story: 4 progressive beats)
      {
        segmentIndex: 0,
        title: sc0.title,
        template: "chat_story",
        badge: sc0.badge,
        beats: [
          // Beat 1: Raju asks hook question
          {
            id: "b01",
            hindi_tts: sc0.b01_tts,
            en_subtitle: sc0.b01_en,
            en_narration: sc0.b01_en,
            pauseAfterMs: 400,
            ui_state: {
              stageDirections: [`— Raju asks about the core dilemma of ${chapterTitle} —`],
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: sc0.b01_raju,
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
                    text: sc0.b01_raju,
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
          // Beat 2: Sharma ji introduces concrete real-world setting & actors
          {
            id: "b02",
            hindi_tts: sc0.b02_tts,
            en_subtitle: sc0.b02_en,
            en_narration: sc0.b02_en,
            pauseAfterMs: 450,
            ui_state: {
              stageDirections: ["— Sharma ji introduces the concrete real-world situation —"],
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: sc0.b01_raju,
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: sc0.b02_sharma,
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
                    text: sc0.b01_raju,
                    theme: "amber",
                    align: "left"
                  },
                  {
                    sender: "Sharma ji",
                    avatar: "S",
                    text: sc0.b02_sharma,
                    theme: "teal",
                    align: "right"
                  }
                ]
              },
              semantics: {
                teachingObjective: "Establish concrete real-world setting and characters.",
                sourceFactIds: [f1.id]
              }
            }
          },
          // Beat 3: Sharma ji reveals the trap / existential crisis
          {
            id: "b03",
            hindi_tts: sc0.b03_tts,
            en_subtitle: sc0.b03_en,
            en_narration: sc0.b03_en,
            pauseAfterMs: 450,
            ui_state: {
              stageDirections: ["— Sharma ji reveals the market trap and why conventional methods failed —"],
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: sc0.b01_raju,
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: sc0.b02_sharma,
                  theme: "teal",
                  align: "right"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: sc0.b03_sharma,
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
                    text: sc0.b01_raju,
                    theme: "amber",
                    align: "left"
                  },
                  {
                    sender: "Sharma ji",
                    avatar: "S",
                    text: sc0.b02_sharma,
                    theme: "teal",
                    align: "right"
                  },
                  {
                    sender: "Sharma ji",
                    avatar: "S",
                    text: sc0.b03_sharma,
                    theme: "teal",
                    align: "right"
                  }
                ]
              },
              semantics: {
                teachingObjective: "Demonstrate why conventional methods fail and create devastating market traps.",
                sourceFactIds: [f1.id]
              }
            }
          },
          // Beat 4: Sharma ji introduces conceptual invention & solution
          {
            id: "b04",
            hindi_tts: sc0.b04_tts,
            en_subtitle: sc0.b04_en,
            en_narration: sc0.b04_en,
            pauseAfterMs: 450,
            ui_state: {
              stageDirections: ["— Sharma ji introduces the conceptual breakthrough and solution —"],
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: sc0.b01_raju,
                  theme: "amber",
                  align: "left"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: sc0.b02_sharma,
                  theme: "teal",
                  align: "right"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: sc0.b03_sharma,
                  theme: "teal",
                  align: "right"
                },
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: sc0.b04_sharma,
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
                    text: sc0.b01_raju,
                    theme: "amber",
                    align: "left"
                  },
                  {
                    sender: "Sharma ji",
                    avatar: "S",
                    text: sc0.b02_sharma,
                    theme: "teal",
                    align: "right"
                  },
                  {
                    sender: "Sharma ji",
                    avatar: "S",
                    text: sc0.b03_sharma,
                    theme: "teal",
                    align: "right"
                  },
                  {
                    sender: "Sharma ji",
                    avatar: "S",
                    text: sc0.b04_sharma,
                    theme: "teal",
                    align: "right"
                  }
                ]
              },
              semantics: {
                teachingObjective: "Establish the author's conceptual breakthrough solving the dilemma.",
                sourceFactIds: [f1.id, f2.id]
              }
            }
          }
        ]
      },

      // Scene 1: Conflicting Interests (tug_of_war: 3 Beats)
      {
        segmentIndex: 1,
        title: sc1.title,
        template: "tug_of_war",
        badge: sc1.badge,
        beats: [
          {
            id: "b05",
            hindi_tts: sc1.b05_tts,
            en_subtitle: sc1.b05_en,
            en_narration: sc1.b05_en,
            pauseAfterMs: 400,
            ui_state: {
              leftLabel: sc1.leftLabel,
              rightLabel: sc1.rightLabel,
              currentTension: 50
            },
            visual: {
              kind: "comparison",
              data: {
                leftLabel: sc1.leftLabel,
                rightLabel: sc1.rightLabel,
                tension: 50
              },
              semantics: {
                teachingObjective: "Demonstrate opposing economic motivations meeting in a forward contract.",
                sourceFactIds: [f1.id]
              }
            }
          },
          {
            id: "b06",
            hindi_tts: sc1.b06_tts,
            en_subtitle: sc1.b06_en,
            en_narration: sc1.b06_en,
            pauseAfterMs: 400,
            ui_state: {
              leftLabel: sc1.leftLabel,
              rightLabel: sc1.rightLabel,
              currentTension: 40
            },
            visual: {
              kind: "comparison",
              data: {
                leftLabel: sc1.leftLabel,
                rightLabel: sc1.rightLabel,
                tension: 40
              },
              semantics: {
                teachingObjective: "Illustrate the pressure of the information lag on trapped traders.",
                sourceFactIds: [f1.id]
              }
            }
          },
          {
            id: "b07",
            hindi_tts: sc1.b07_tts,
            en_subtitle: sc1.b07_en,
            en_narration: sc1.b07_en,
            pauseAfterMs: 400,
            ui_state: {
              leftLabel: sc1.leftLabel,
              rightLabel: sc1.rightLabel,
              currentTension: 50
            },
            visual: {
              kind: "comparison",
              data: {
                leftLabel: sc1.leftLabel,
                rightLabel: sc1.rightLabel,
                tension: 50
              },
              semantics: {
                teachingObjective: "Show how price action resolves the dilemma and provides objective timing.",
                sourceFactIds: [f1.id, f2.id]
              }
            }
          }
        ]
      },

      // Act 2: Market Architecture & Scale
      // Scene 2: The Chapter Roadmap (progressive_cards: 4 Beats)
      {
        segmentIndex: 2,
        title: sc2.title,
        template: "progressive_cards",
        badge: sc2.badge,
        beats: [
          {
            id: "b08",
            hindi_tts: sc2.b08_tts,
            en_subtitle: sc2.b08_en,
            en_narration: sc2.b08_en,
            pauseAfterMs: 400,
            ui_state: {
              activeCardIndex: 0,
              cards: sc2.cards
            },
            visual: {
              kind: "cards",
              data: {
                activeCardIndex: 0,
                cards: sc2.cards
              },
              semantics: {
                teachingObjective: "Present structural roadmap pillar 1.",
                sourceFactIds: [f1.id]
              }
            }
          },
          {
            id: "b09",
            hindi_tts: sc2.b09_tts,
            en_subtitle: sc2.b09_en,
            en_narration: sc2.b09_en,
            pauseAfterMs: 400,
            ui_state: {
              activeCardIndex: 1,
              cards: sc2.cards
            },
            visual: {
              kind: "cards",
              data: {
                activeCardIndex: 1,
                cards: sc2.cards
              },
              semantics: {
                teachingObjective: "Present structural roadmap pillar 2.",
                sourceFactIds: [f2.id]
              }
            }
          },
          {
            id: "b10",
            hindi_tts: sc2.b10_tts,
            en_subtitle: sc2.b10_en,
            en_narration: sc2.b10_en,
            pauseAfterMs: 400,
            ui_state: {
              activeCardIndex: 2,
              cards: sc2.cards
            },
            visual: {
              kind: "cards",
              data: {
                activeCardIndex: 2,
                cards: sc2.cards
              },
              semantics: {
                teachingObjective: "Present structural roadmap pillar 3.",
                sourceFactIds: [f3.id]
              }
            }
          },
          {
            id: "b11",
            hindi_tts: sc2.b11_tts,
            en_subtitle: sc2.b11_en,
            en_narration: sc2.b11_en,
            pauseAfterMs: 400,
            ui_state: {
              activeCardIndex: 3,
              cards: sc2.cards
            },
            visual: {
              kind: "cards",
              data: {
                activeCardIndex: 3,
                cards: sc2.cards
              },
              semantics: {
                teachingObjective: "Present structural roadmap pillar 4.",
                sourceFactIds: [f4.id]
              }
            }
          }
        ]
      },

      // Scene 3: Structural Comparison (split_comparison)
      {
        segmentIndex: 3,
        title: sc3.title,
        template: "split_comparison",
        badge: sc3.badge,
        beats: [
          {
            id: "b12",
            hindi_tts: isHull
              ? "एक्सचेंज ट्रेडेड फ्यूचर्स पूरी तरह से मानकीकृत होते हैं, जबकि ओटीसी फॉरवर्ड्स दोनों पक्षों की आवश्यकतानुसार कस्टमाइज किए जाते हैं।"
              : "मूलभूत विश्लेषण वित्तीय रिपोर्टों की देरी से ग्रस्त रहता है, जबकि तकनीकी विश्लेषण तुरंत वास्तविक मांग और आपूर्ति को दर्शाता है।",
            en_subtitle: isHull
              ? "Exchange futures are strictly standardized, while OTC contracts are bilaterally customized."
              : "Fundamental analysis suffers reporting lags, while technical analysis reflects real supply and demand.",
            en_narration: isHull
              ? "Exchange futures are standardized while OTC contracts are customized."
              : "Fundamental reports suffer publication lags, while price action reflects instant supply and demand.",
            pauseAfterMs: 420,
            ui_state: {
              leftTitle: sc3.leftTitle,
              rightTitle: sc3.rightTitle,
              leftPoints: sc3.leftPoints,
              rightPoints: sc3.rightPoints
            },
            visual: {
              kind: "comparison",
              data: {
                leftColumn: { title: sc3.leftTitle, points: sc3.leftPoints.slice(0, 2) },
                rightColumn: { title: sc3.rightTitle, points: sc3.rightPoints.slice(0, 2) }
              },
              semantics: {
                teachingObjective: "Contrast opposing market mechanisms or analytical approaches.",
                sourceFactIds: [f2.id, f3.id]
              }
            }
          }
        ]
      },

      // Scene 4: Empirical Data / Scale (progressive_cards)
      {
        segmentIndex: 4,
        title: sc4.title,
        template: "progressive_cards",
        badge: sc4.badge,
        beats: [
          {
            id: "b13",
            hindi_tts: isHull
              ? "वैश्विक स्तर पर ओटीसी बाजार का आकार छह सौ तीस ट्रिलियन डॉलर से अधिक है, जो एक्सचेंज बाजार से लगभग दस गुना बड़ा है।"
              : "दशकों के बाजार इतिहास और संस्थागत वॉल्यूम डेटा ने साबित किया है कि मानवीय मनोविज्ञान चार्ट पैटर्न्स को बार-बार दोहराता है।",
            en_subtitle: isHull
              ? "Globally, the OTC market exceeds $630 trillion in notional principal, dwarfing exchange volumes."
              : "Decades of empirical data show repetitive human psychology drives recurring chart patterns.",
            en_narration: isHull
              ? "The global OTC market exceeds $630 trillion, dwarfing exchange volumes."
              : "Decades of market data demonstrate recurring patterns driven by human psychology.",
            pauseAfterMs: 400,
            ui_state: {
              activeCardIndex: 0,
              cards: sc4.cards
            },
            visual: {
              kind: "cards",
              data: {
                cards: sc4.cards
              },
              semantics: {
                teachingObjective: "Demonstrate immense empirical scale and validation evidence.",
                sourceFactIds: [f3.id]
              }
            }
          }
        ]
      },

      // Act 3: Quantitative Rigor
      // Scene 5: Formula / Technical Proof (formula_breakdown)
      {
        segmentIndex: 5,
        title: sc5.title,
        template: "formula_breakdown",
        badge: sc5.badge,
        beats: [
          {
            id: "b14",
            hindi_tts: isHull
              ? "मैच्योरिटी पर लॉन्ग पोजीशन का ग्रॉस पेऑफ वर्तमान स्पॉट प्राइस और स्ट्राइक प्राइस का अंतर होता है।"
              : "जॉन मर्फी के अनुसार, किसी भी ब्रेकआउट की प्रामाणिकता जांचने के लिए तीन प्रतिशत का प्राइस फिल्टर नियम लागू होता है।",
            en_subtitle: isHull
              ? "At terminal maturity, gross payoff is defined as the spot price minus strike price."
              : "Under Murphy rules, an objective price penetration filter validates authentic breakouts.",
            en_narration: isHull
              ? "At expiration, long payoff equals spot price minus the delivery strike price."
              : "Murphy rules apply an objective percentage penetration filter to confirm authentic breakouts.",
            pauseAfterMs: 400,
            ui_state: {
              title: sc5.title,
              expression: sc5.expression,
              variables: sc5.variables
            },
            visual: {
              kind: "formula",
              data: {
                title: sc5.title,
                expression: sc5.expression,
                variables: sc5.variables
              },
              semantics: {
                teachingObjective: "Define quantitative calculation or threshold formula.",
                sourceFactIds: [f4.id]
              }
            }
          }
        ]
      },

      // Scene 6: Invariant Distinction / Trap vs Authentic (split_comparison)
      {
        segmentIndex: 6,
        title: sc6.title,
        template: "split_comparison",
        badge: sc6.badge,
        beats: [
          {
            id: "b15",
            hindi_tts: isHull
              ? "हमेशा याद रखें, पेऑफ केवल टर्मिनल कैशफ्लो है, जबकि नेट प्रॉफिट में शुरुआत में चुकाया गया प्रीमियम घटाया जाता है।"
              : "हमेशा याद रखें, प्रामाणिक ब्रेकआउट में वॉल्यूम का भारी विस्तार होता है, जबकि बिना वॉल्यूम के ब्रेकआउट केवल एक ट्रैप होता है।",
            en_subtitle: isHull
              ? "Always distinguish: Payoff is terminal cashflow; Profit deducts initial premium paid."
              : "Always distinguish: Confirmed breakouts expand volume, while low-volume moves are traps.",
            en_narration: isHull
              ? "Payoff is gross terminal cashflow, while profit subtracts initial premium paid."
              : "Genuine breakouts require expanding volume, whereas low-volume moves signal deceptive traps.",
            pauseAfterMs: 420,
            ui_state: {
              leftTitle: sc6.leftTitle,
              rightTitle: sc6.rightTitle,
              leftPoints: sc6.leftPoints,
              rightPoints: sc6.rightPoints
            },
            visual: {
              kind: "comparison",
              data: {
                leftColumn: { title: sc6.leftTitle, points: sc6.leftPoints.slice(0, 2) },
                rightColumn: { title: sc6.rightTitle, points: sc6.rightPoints.slice(0, 2) }
              },
              semantics: {
                teachingObjective: "Strictly enforce the core conceptual distinction.",
                sourceFactIds: [f4.id]
              }
            }
          }
        ]
      },

      // Act 4: Real-World Pitfall & Risk
      // Scene 7: Case Study / Pitfall (progressive_cards)
      {
        segmentIndex: 7,
        title: sc7.title,
        template: "progressive_cards",
        badge: sc7.badge,
        beats: [
          {
            id: "b16",
            hindi_tts: isHull
              ? "दो हजार आठ में लेहमैन ब्रदर्स के पास छह सौ बिलियन डॉलर के अनक्लेयर्ड ओटीसी डेरिवेटिव्स थे, जिससे पूरी वित्तीय प्रणाली फ्रीज हो गई।"
              : "पैटर्न पूरा होने से पहले ही जल्दबाजी में ट्रेड लेने वाले ट्रेडर्स अक्सर अचानक आने वाले व्हिपसॉ और फॉल्स ब्रेकआउट्स में फंस जाते हैं।",
            en_subtitle: isHull
              ? "In 2008, Lehman held over $600 billion in uncollateralized OTC positions, freezing the banking system."
              : "Traders who jump into trades before patterns complete suffer catastrophic whipsaw traps.",
            en_narration: isHull
              ? "In 2008, Lehman held $600 billion in OTC positions, triggering systemic contagion."
              : "Entering positions prematurely before patterns finish frequently causes severe whipsaw losses.",
            pauseAfterMs: 420,
            ui_state: {
              activeCardIndex: 0,
              cards: sc7.cards
            },
            visual: {
              kind: "cards",
              data: {
                cards: sc7.cards
              },
              semantics: {
                teachingObjective: "Illustrate real-world risk, contagion, or trader failure mode.",
                sourceFactIds: [f3.id, f5.id]
              }
            }
          }
        ]
      },

      // Scene 8: Risk Math / Position Sizing (formula_breakdown)
      {
        segmentIndex: 8,
        title: sc8.title,
        template: "formula_breakdown",
        badge: sc8.badge,
        beats: [
          {
            id: "b17",
            hindi_tts: isHull
              ? "इकतीस गुना लेवरेज पर एसेट्स में केवल सवा तीन परसेंट की गिरावट पूरे शेयरहोल्डर इक्विटी को शून्य कर देती है।"
              : "अनुशासित ट्रेडर्स हमेशा कम से कम तीन अनुपात एक के रिवॉर्ड-टू-रिस्क रेशियो पर ही पोजीशन का आकार तय करते हैं।",
            en_subtitle: isHull
              ? "At thirty-one to one leverage, just a 3.2% decline in assets completely wipes out shareholder equity."
              : "Disciplined traders mandate at least a three-to-one reward-to-risk ratio on every trade.",
            en_narration: isHull
              ? "At 31 to 1 leverage, a 3.2% decline in assets wipes out shareholder equity."
              : "Disciplined traders mandate a minimum three-to-one reward-to-risk ratio for position sizing.",
            pauseAfterMs: 400,
            ui_state: {
              title: sc8.title,
              expression: sc8.expression,
              variables: sc8.variables
            },
            visual: {
              kind: "formula",
              data: {
                title: sc8.title,
                expression: sc8.expression,
                variables: sc8.variables
              },
              semantics: {
                teachingObjective: "Prove mathematically how risk discipline and sizing preserve capital.",
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
            id: "b18",
            hindi_tts: isHull
              ? "यदि एक ट्रेडर बिना हेजिंग के अत्यधिक लेवरेज पोजीशन लेता है और बाजार विपरीत दिशा में जाता है, तो सबसे बड़ा प्राथमिक जोखिम क्या है?"
              : "यदि एक निवेशक कंपनी की अच्छी अर्निंग्स रिपोर्ट देखकर शेयर खरीदता है, लेकिन चार्ट वॉल्यूम के साथ सपोर्ट तोड़ रहा हो, तो सही निर्णय क्या है?",
            en_subtitle: isHull
              ? "If a trader takes an unhedged leveraged position, what is the immediate structural risk?"
              : "If a company reports great earnings but the chart breaks support on volume, what is the correct action?",
            en_narration: sc9.question,
            pauseAfterMs: 400,
            ui_state: {
              question: sc9.question,
              options: sc9.options,
              showThinkingSpinner: false,
              answer: ""
            },
            visual: {
              kind: "quiz",
              data: {
                question: sc9.question,
                options: sc9.options
              },
              semantics: {
                teachingObjective: "Test active scenario comprehension and disciplined execution.",
                sourceFactIds: [f5.id, f6.id]
              }
            }
          },
          // Beat 1: Thinking Pause with spinner
          {
            id: "b19",
            hindi_tts: isHull
              ? "सोचिए... क्या मार्जिन बफर के बिना पोजीशन सर्वाइव कर सकती है?"
              : "सोचिए... क्या चार्ट ब्रेकडाउन के बावजूद सिर्फ पुरानी खबरों के भरोसे ट्रेड लेना सुरक्षित है?",
            en_subtitle: isHull
              ? "Think carefully... Can a leveraged position survive without adequate margin capital?"
              : "Think carefully... Can a trade be justified on news when the price chart is breaking down?",
            en_narration: "Pause and carefully evaluate the market confirmation rules.",
            pauseAfterMs: 3200,
            ui_state: {
              question: sc9.question,
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
            id: "b20",
            hindi_tts: isHull
              ? "सही उत्तर बी है! अपर्याप्त मार्जिन पर ब्रोकर या एक्सचेंज तुरंत पोजीशन को लिक्विडेट कर देता है।"
              : "सही उत्तर बी है! भाव हमेशा खबरों से आगे चलता है, इसलिए चार्ट ब्रेकडाउन का सम्मान करना ही पूंजी बचाता है।",
            en_subtitle: isHull
              ? "Correct answer is B! Insufficient margin triggers immediate forced liquidation."
              : "Correct answer is B! Price action leads fundamentals; respecting breakdowns preserves capital.",
            en_narration: `Correct answer is B: ${sc9.answer}`,
            pauseAfterMs: 450,
            ui_state: {
              question: sc9.question,
              showThinkingSpinner: false,
              answer: sc9.answer,
              correctIndex: sc9.correctIndex ?? 1
            },
            visual: {
              kind: "quiz",
              data: {
                answer: sc9.answer,
                correctIndex: sc9.correctIndex ?? 1
              },
              semantics: {
                teachingObjective: "Reinforce correct understanding and risk mitigation rules.",
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
        badge: "Practical Synthesis · Senior Analyst Desk",
        beats: [
          {
            id: "b21",
            hindi_tts: isHull
              ? "राजू कहता है, इसका अर्थ यह है कि बाजार में टिके रहने के लिए लेवरेज से पहले मार्जिन और सेटलमेंट को समझना अनिवार्य है।"
              : "राजू कहता है, इसका मतलब यह हुआ कि बाजार में अटकलों और खबरों के बजाय वस्तुनिष्ठ चार्ट पुष्टि ही सफलता का असली रहस्य है!",
            en_subtitle: isHull
              ? "Raju notes: To survive, understanding margin and settlement rules comes before taking leverage."
              : "Raju realizes: Objective chart confirmation matters far more than subjective market rumors!",
            en_narration: isHull
              ? "Raju realizes that understanding settlement rules precedes taking leverage."
              : "Raju notes that objective chart confirmation precedes directional positioning.",
            pauseAfterMs: 400,
            ui_state: {
              stageDirections: ["— Raju summarizes analytical discipline —"],
              messages: [
                {
                  sender: "Raju",
                  avatar: "R",
                  text: sc10.rajuText,
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
                    text: sc10.rajuText,
                    theme: "amber",
                    align: "left"
                  }
                ]
              },
              semantics: {
                teachingObjective: "Synthesize operational discipline before directional speculation.",
                sourceFactIds: [f5.id, f6.id]
              }
            }
          },
          {
            id: "b22",
            hindi_tts: isHull
              ? "शर्मा जी पुष्टि करते हैं, बिल्कुल! सफल ट्रेडर्स दिशा का अनुमान लगाने से पहले अपनी पूंजी की सुरक्षा सुनिश्चित करते हैं।"
              : "शर्मा जी पुष्टि करते हैं, बिल्कुल! अनुशासित चार्टिस्ट वही ट्रेड करते हैं जो चार्ट पर दिखता है, न कि वह जो वे चाहते हैं!",
            en_subtitle: isHull
              ? "Sharma ji confirms: Exactly! Disciplined traders protect capital before predicting market direction."
              : "Sharma ji confirms: Exactly! Disciplined chartists trade what they see, not what they think!",
            en_narration: isHull
              ? "Sharma ji confirms that capital protection precedes directional bets."
              : "Sharma ji emphasizes that chartists must trade what they see rather than subjective opinions.",
            pauseAfterMs: 450,
            ui_state: {
              stageDirections: ["— Sharma ji delivers core trading maxim —"],
              messages: [
                {
                  sender: "Sharma ji",
                  avatar: "S",
                  text: sc10.sharmaText,
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
                    text: sc10.sharmaText,
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
            id: "b23",
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
            id: "b24",
            hindi_tts: isHull
              ? "पहले और दूसरे नियम के अनुसार, डेरिवेटिव्स अंतर्निहित संपत्ति से मूल्य लेते हैं और फ्यूचर्स एक्सचेंज पर मानकीकृत होते हैं।"
              : "पहले और दूसरे नियम के अनुसार, भाव सभी मूलभूत कारणों को डिस्काउंट करता है और ट्रेंड्स लगातार जारी रहते हैं।",
            en_subtitle: isHull
              ? "First and second: Derivatives derive value from underlyings, and futures are standardized on exchanges."
              : "Rules 1 and 2: Market action discounts all fundamentals, and prices move in persistent trends.",
            en_narration: isHull
              ? "Rules 1 and 2: Derivatives derive value from underlyings, and futures are standardized."
              : "Rules 1 and 2: Market action discounts fundamentals, and prices move in trends.",
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
            id: "b25",
            hindi_tts: isHull
              ? "तीसरे और चौथे नियम के अनुसार, ओटीसी में काउंटरपार्टी रिस्क रहता है और पेऑफ में हमेशा स्ट्राइक प्राइस का महत्व होता है।"
              : "तीसरे और चौथे नियम के अनुसार, चार्ट पैटर्न्स मानवीय मनोविज्ञान दोहराते हैं और वॉल्यूम से ट्रेंड की पुष्टि आवश्यक है।",
            en_subtitle: isHull
              ? "Third and fourth: OTC contracts carry bilateral counterparty risk, and payoff is defined by the strike price."
              : "Rules 3 and 4: Chart patterns repeat human psychology, and volume must confirm the price trend.",
            en_narration: isHull
              ? "Rules 3 and 4: OTC carries counterparty risk, and payoff depends on strike."
              : "Rules 3 and 4: Geometry repeats psychology, and volume confirms price action.",
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
            id: "b26",
            hindi_tts: isHull
              ? "पांचवें और छठे नियम के तहत, क्लीयरिंगहाउस वेरिएशन मार्जिन से रिस्क कम करता है और लेवरेज इक्विटी को तेजी से घटा सकता है।"
              : "पांचवें और छठे नियम के तहत, ब्रेकआउट पुष्टि के लिए क्लोजिंग फिल्टर का उपयोग करें और जल्दबाजी में ट्रैप से बचें।",
            en_subtitle: isHull
              ? "Fifth and sixth: Clearinghouses enforce variation margin, and high leverage rapidly depletes equity."
              : "Rules 5 and 6: Apply closing filters for breakouts and avoid jumping in prematurely.",
            en_narration: isHull
              ? "Rules 5 and 6: Margin protects clearinghouses, while leverage depletes equity."
              : "Rules 5 and 6: Use penetration filters and never anticipate patterns prematurely.",
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
            id: "b27",
            hindi_tts: isHull
              ? "सातवें और आठवें नियम के अनुसार, बायलेटरल पोजीशन में कोलेटरल अनिवार्य है और ग्रॉस पेऑफ को कभी नेट प्रॉफिट न समझें।"
              : "सातवें और आठवें नियम के अनुसार, केवल पुष्टि पर ट्रेड करें और व्यक्तिगत राय से पहले स्टॉप लॉस अनुशासन का पालन करें।",
            en_subtitle: isHull
              ? "Seventh and eighth: Bilateral exposure requires collateral, and never confuse gross payoff with net profit."
              : "Rules 7 and 8: Trade only on verified confirmation and obey strict stop loss risk limits.",
            en_narration: isHull
              ? "Rules 7 and 8: Collateralize bilateral risk, and never confuse payoff with profit."
              : "Rules 7 and 8: Trade on confirmation, and enforce stop loss discipline over opinions.",
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
            id: "b28",
            hindi_tts: "यह आठ नियम किसी भी तकनीकी और वित्तीय बाजार में अनुशासन और सफलता की वास्तविक नींव हैं।",
            en_subtitle: "These eight principles form the enduring foundation for trading discipline across global markets.",
            en_narration: "These eight rules form the enduring foundation of trading discipline across markets.",
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
