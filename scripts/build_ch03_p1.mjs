import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch03/p1';
fs.mkdirSync(targetDir, { recursive: true });

const script = {
  languages: ['en', 'hi'],
  scenes: [
    {
      index: 0,
      title: "The Corporate Dilemma: Why Companies Hedge",
      purpose: "Problem-first hook: why firms trade futures without seeking profits",
      beats: [
        {
          id: "s00b1",
          speaker: "novice",
          narration: {
            en: {
              display: "Why do commercial enterprises trade millions in futures contracts if they never intend to take physical delivery or seek trading profits? Is hedging really worth the effort?"
            },
            hi: {
              display: "कमर्शियल कंपनियाँ फ्यूचर्स में करोड़ों का ट्रेड क्यों करती हैं जब उन्हें डिलीवरी भी नहीं लेनी होती? क्या हेजिंग सच में कंपनियों के लिए फायदेमंद है?"
            }
          },
          onScreenIntent: "Opening dilemma question on corporate hedging motivations",
          sourceFactIds: ["F01"],
          newTerms: ["hedging"],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "Commercial enterprises do not enter futures markets to speculate. They deploy futures to neutralize severe price risks and safeguard enterprise solvency."
            },
            hi: {
              display: "कंपनियाँ सट्टा लगाने के लिए नहीं, बल्कि प्राइस रिस्क को खत्म करने और अपनी सॉल्वेंसी बचाने के लिए फ्यूचर्स मार्केट में आती हैं।"
            }
          },
          onScreenIntent: "The mentor sets the corporate risk stakes",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s00b3",
          speaker: "mentor",
          narration: {
            en: {
              display: "The foundational philosophy of corporate hedging is straightforward: its sole objective is to minimize the variance and unpredictability of corporate cash flows."
            },
            hi: {
              display: "कॉर्पोरेट हेजिंग का मकसद सट्टे से मुनाफा कमाना नहीं, बल्कि कैश फ्लो की अनिश्चितता और वेरियंस को कम करना है ताकि कंपनी सुरक्षित रहे।"
            }
          },
          onScreenIntent: "Variance minimization as the core principle",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: {
            en: {
              display: "In Section 3.1, John Hull establishes the two core categories: the Short Hedge, protecting physical inventory, and the Long Hedge, securing raw material purchase costs."
            },
            hi: {
              display: "जॉन हल ने हेजिंग को दो श्रेणियों में बाँटा है: शॉर्ट हेज जो इन्वेंट्री को गिरने से बचाता है, और लॉन्ग हेज जो कच्चे माल की खरीद लागत को लॉक करता है।"
            }
          },
          onScreenIntent: "Classification into Short Hedge and Long Hedge",
          sourceFactIds: ["F01"],
          newTerms: ["short hedge", "long hedge"],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    },
    {
      index: 1,
      title: "Short Hedge vs Long Hedge",
      purpose: "Contrasting natural commercial exposure with offsetting futures positions",
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: {
            en: {
              display: "A Short Hedger holds a natural long position in the physical market—they own inventory or expect future production—and short sells futures to lock in a minimum selling price."
            },
            hi: {
              display: "शॉर्ट हेजर के पास स्पॉट मार्केट में नेचुरल लॉन्ग पोजीशन होती है, और वह फ्यूचर्स बेचकर सेलिंग प्राइस लॉक कर लेता है।"
            }
          },
          onScreenIntent: "Short hedger commercial profile",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "In contrast, a Long Hedger is a future commercial buyer with a natural short liability, taking a long futures position to cap potential upside raw material cost surges."
            },
            hi: {
              display: "इसके विपरीत, लॉन्ग हेजर को भविष्य में माल खरीदना होता है, इसलिए वह फ्यूचर्स खरीदकर अपनी लागत पर सीलिंग लगा देता है।"
            }
          },
          onScreenIntent: "Long hedger commercial profile",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: {
            en: {
              display: "In both cases, physical market losses and financial futures gains move in opposite directions, creating a balanced, risk-neutral corporate posture."
            },
            hi: {
              display: "दोनों स्थितियों में फिजिकल मार्केट का नुकसान और फ्यूचर्स का मुनाफा एक-दूसरे को संतुलित कर देते हैं।"
            }
          },
          onScreenIntent: "Offsetting resolution card",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    },
    {
      index: 2,
      title: "Four Pillars of Corporate Hedging",
      purpose: "Establishing the architectural foundations of futures hedging",
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: {
            en: {
              display: "Our First Pillar is position duality: Short hedges protect sellers and producers, while long hedges protect buyers and fabricators."
            },
            hi: {
              display: "पहला पिलर है पोजीशन डुएलिटी: शॉर्ट हेज बेचने वालों की सुरक्षा करता है, और लॉन्ग हेज खरीदने वालों की।"
            }
          },
          onScreenIntent: "Pillar 1 revealed",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "Our Second Pillar is Basis: defined as Spot Price minus Futures Price. Hedging substitutes outright price risk with smaller, manageable basis risk."
            },
            hi: {
              display: "दूसरा पिलर है बेसिस: यानी स्पॉट प्राइस माइनस फ्यूचर्स प्राइस। हेजिंग बड़े प्राइस रिस्क को छोटे बेसिस रिस्क में बदल देती है।"
            }
          },
          onScreenIntent: "Pillar 2 revealed",
          sourceFactIds: ["F04"],
          newTerms: ["basis", "basis risk"],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: {
            en: {
              display: "Our Third Pillar is directional basis dynamics: a strengthening basis benefits short hedgers, while a weakening basis benefits long hedgers."
            },
            hi: {
              display: "तीसरा पिलर है डायरेक्शनल बेसिस: मजबूत होता बेसिस शॉर्ट हेजर को फायदा देता है, और कमजोर होता बेसिस लॉन्ग हेजर को।"
            }
          },
          onScreenIntent: "Pillar 3 revealed",
          sourceFactIds: ["F06"],
          newTerms: ["strengthening of the basis", "weakening of the basis"],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s02b4",
          speaker: "mentor",
          narration: {
            en: {
              display: "Our Fourth Pillar is the delivery month rule: always choose a contract month that is later than the hedge closeout date to avoid delivery hazards."
            },
            hi: {
              display: "चौथा पिलर है डिलीवरी मंथ रूल: हमेशा डिलीवरी के बाद का महीना चुनें ताकि डिलीवरी के झंझट और लिक्विडिटी की कमी से बचा जा सके।"
            }
          },
          onScreenIntent: "Pillar 4 revealed",
          sourceFactIds: ["F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    },
    {
      index: 3,
      title: "The Mathematical Definition of Basis",
      purpose: "Deconstructing the formula b = S - F and Net Realized Price",
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: {
            en: {
              display: "In quantitative analysis, Basis b at time t equals the Spot Price S minus the Futures Price F. When S equals F at maturity, basis converges to zero."
            },
            hi: {
              display: "मैथमैटिक्स में बेसिस बी बराबर होता है स्पॉट प्राइस एस माइनस फ्यूचर्स प्राइस एफ। मैच्योरिटी पर बेसिस जीरो पर कन्वर्ज हो जाता है।"
            }
          },
          onScreenIntent: "KaTeX formula hero card for b = S - F",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "For a short hedger, the net realized selling price per unit is exactly F1 plus b2, where F1 is initial futures price and b2 is terminal basis."
            },
            hi: {
              display: "शॉर्ट हेजर के लिए नेट सेलिंग प्राइस होती है एफ वन प्लस बी टू, जहाँ एफ वन इनिशियल फ्यूचर्स प्राइस है और बी टू टर्मिनल बेसिस है।"
            }
          },
          onScreenIntent: "Formula for Net Price = F1 + b2",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: {
            en: {
              display: "This identity proves that corporate hedging does not extinguish risk entirely; rather, it substitutes outright spot price volatility with much smaller basis risk."
            },
            hi: {
              display: "यह फॉर्मूला साबित करता है कि हेजिंग रिस्क को पूरी तरह मिटाती नहीं, बल्कि बड़े स्पॉट प्राइस रिस्क को छोटे बेसिस रिस्क से रिप्लेस कर देती है।"
            }
          },
          onScreenIntent: "Risk substitution conclusion",
          sourceFactIds: ["F04", "F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    },
    {
      index: 4,
      title: "How Hedging Operates Step by Step",
      purpose: "Causal chain of commercial risk neutralization",
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: {
            en: {
              display: "The chain starts when an unhedged enterprise holds physical inventory vulnerable to catastrophic global market price collapse."
            },
            hi: {
              display: "चेन तब शुरू होती है जब कंपनी के पास फिजिकल इन्वेंट्री होती है और उसे ग्लोबल मार्केट क्रैश का खतरा रहता है।"
            }
          },
          onScreenIntent: "Condition: Unhedged physical inventory exposure",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "The firm takes action by short selling exchange-traded futures contracts sized exactly to its deliverable commodity volume."
            },
            hi: {
              display: "कंपनी तुरंत एक्सचेंज पर अपनी कमोडिटी के बराबर साइज के फ्यूचर्स कॉन्ट्रैक्ट्स शॉर्ट सेल कर देती है।"
            }
          },
          onScreenIntent: "Action: Short selling matching futures contracts",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: {
            en: {
              display: "When physical spot prices collapse, financial futures positions generate cash profits that directly offset physical revenue deficits."
            },
            hi: {
              display: "जब स्पॉट प्राइस गिरती है, तो फ्यूचर्स में होने वाला कैश प्रॉफिट फिजिकल मार्केट के घाटे की पूरी भरपाई कर देता है।"
            }
          },
          onScreenIntent: "Mechanism & Result: Futures profits absorb spot loss",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: {
            en: {
              display: "As a final consequence, net corporate revenue is stabilized, protecting credit ratings, operating budgets, and business solvency."
            },
            hi: {
              display: "नतीजतन, कंपनी का रेवेन्यू स्थिर हो जाता है और बिज़नेस सॉल्वेंसी व क्रेडिट रेटिंग सुरक्षित रहती है।"
            }
          },
          onScreenIntent: "Consequence: Operating solvency guaranteed",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    },
    {
      index: 5,
      title: "Worked Example: NYMEX Crude Oil Short Hedge",
      purpose: "Numerical calculation of crude oil hedge from Hull Section 3.1",
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: {
            en: {
              display: "In May, an oil producer has one million barrels of crude oil to sell in August. Spot is $80 per barrel, and August NYMEX futures trades at $79."
            },
            hi: {
              display: "मई में एक ऑयल प्रोड्यूसर के पास अगस्त में बेचने के लिए दस लाख बैरल क्रूड ऑयल है। स्पॉट अस्सी डॉलर है, और फ्यूचर्स उनासी डॉलर।"
            }
          },
          onScreenIntent: "Given parameters for the oil hedge",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "If spot oil plunges to $75 by August, does the producer lose money? Predict the outcome before we calculate the combined total."
            },
            hi: {
              display: "अगर अगस्त में स्पॉट गिरकर पिचहत्तर डॉलर हो जाए, तो क्या प्रोड्यूसर को नुकसान होगा? आइए कैलकुलेट करके देखते हैं।"
            }
          },
          onScreenIntent: "Prediction prompt and market shock scenario",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: {
            en: {
              display: "Physical oil sells for $75 million, but the short futures gains $4 million. The locked net revenue is exactly $79 million, matching the hedge target perfectly."
            },
            hi: {
              display: "फिजिकल ऑयल पिचहत्तर मिलियन में बिका, और फ्यूचर्स में चार मिलियन का मुनाफा हुआ। नेट रेवेन्यू ठीक उनासी मिलियन डॉलर पर लॉक हो गया।"
            }
          },
          onScreenIntent: "Net cash flow calculation and verification",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    },
    {
      index: 6,
      title: "Common Novice Trap vs Corporate Reality",
      purpose: "Contrasting the speculation myth with enterprise risk management reality",
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: {
            en: {
              display: "Novice market observers believe hedging is meant to generate speculative trading profits or beat the prevailing spot market."
            },
            hi: {
              display: "नए लोग सोचते हैं कि हेजिंग का मकसद बाजार से आगे निकलकर सट्टे से ज्यादा मुनाफा कमाना है।"
            }
          },
          onScreenIntent: "The novice trap card",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "Professional reality treats hedging as variance minimization. A hedge succeeds when cash flows are deterministic, even if unhedged rivals made windfall gains."
            },
            hi: {
              display: "प्रोफेशनल सच यह है कि हेजिंग वेरियंस को कम करती है। अगर कैश फ्लो फिक्स हो गया, तो हेज पूरी तरह सफल माना जाता है।"
            }
          },
          onScreenIntent: "Professional reality card and verdict",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    },
    {
      index: 7,
      title: "Strengthening vs Weakening Basis",
      purpose: "Analyzing directional impact on short and long hedges",
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: {
            en: {
              display: "A Strengthening Basis means basis increases over time. Because a short hedger receives F1 plus b2, a strengthening basis directly increases net realized revenue."
            },
            hi: {
              display: "मजबूत बेसिस का मतलब है कि बेसिस बढ़ रहा है। शॉर्ट हेजर को एफ वन प्लस बी टू मिलता है, इसलिए बढ़ता बेसिस उसकी कमाई बढ़ा देता है।"
            }
          },
          onScreenIntent: "Strengthening basis analysis",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "Conversely, a Weakening Basis means basis decreases over time, lowering the net purchase outlay for a long hedger acquiring physical inputs."
            },
            hi: {
              display: "इसके विपरीत, कमजोर होता बेसिस लॉन्ग हेजर को फायदा देता है और कच्चे माल की खरीद लागत को कम कर देता है।"
            }
          },
          onScreenIntent: "Weakening basis analysis",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    },
    {
      index: 8,
      title: "Limitations & The Bull Market Trap",
      purpose: "Case study of American Barrick and gold hedgers in the 2000s",
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: {
            en: {
              display: "In Business Snapshot 3.1, John Hull chronicles gold miners who short hedged in bear markets, but faced catastrophic futures margin calls during the 2000s bull market."
            },
            hi: {
              display: "बिजनेस स्नैपशॉट 3.1 में जॉन हल बताते हैं कि कैसे गोल्ड माइनर्स ने हेजिंग की, लेकिन 2000 के बुलरन में भारी मार्जिन कॉल्स ने उन्हें फंसा दिया।"
            }
          },
          onScreenIntent: "Gold mining case study",
          sourceFactIds: ["F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "Management criticized treasurers for isolated futures trading losses, ignoring record physical gold profits and forcing companies to buy back hedges at massive cost."
            },
            hi: {
              display: "मैनेजमेंट ने फ्यूचर्स के नुकसान को अलग से देखा और फिजिकल मुनाफे को नजरअंदाज कर दिया, जिससे भारी नुकसान में हेज बंद करने पड़े।"
            }
          },
          onScreenIntent: "The worse outcome dilemma",
          sourceFactIds: ["F08", "F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    },
    {
      index: 9,
      title: "Active Recall: Short Hedge Calculation",
      purpose: "Independent active recall quiz calculating net realized selling price",
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: {
            en: {
              display: "An oil producer enters a Short Hedge at F1 = $90 per barrel. At closeout, spot is S2 = $85 and futures is F2 = $87. What is the net realized price per barrel?"
            },
            hi: {
              display: "एक ऑयल प्रोड्यूसर नब्बे डॉलर पर शॉर्ट हेज करता है। क्लोजआउट पर स्पॉट पचासी और फ्यूचर्स सतासी डॉलर है। नेट सेलिंग प्राइस क्या होगी?"
            }
          },
          onScreenIntent: "Quiz question presented",
          sourceFactIds: ["F04", "F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "Take a few seconds to calculate: terminal basis b2 is S2 minus F2, and the net realized price for a short hedger equals F1 plus b2."
            },
            hi: {
              display: "कैलकुलेट करने के लिए कुछ सेकंड का समय लें: टर्मिनल बेसिस बी टू निकालें और एफ वन में जोड़ें।"
            }
          },
          onScreenIntent: "Silent cognitive thinking interval",
          sourceFactIds: [],
          newTerms: [],
          pauseAfterMs: 3500,
          transition: false
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: {
            en: {
              display: "The correct answer is Option B: $88 per barrel. Terminal basis is $85 minus $87, or -$2. Realized price is $90 plus -$2, or $88. The basis weakened by $2."
            },
            hi: {
              display: "सही जवाब है ऑप्शन बी: अठासी डॉलर। टर्मिनल बेसिस माइनस दो डॉलर है, इसलिए नब्बे में से दो घटकर अठासी डॉलर नेट मिलता है।"
            }
          },
          onScreenIntent: "Option B revealed in green with full explanation",
          sourceFactIds: ["F05", "F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    },
    {
      index: 10,
      title: "Synthesis & The Road to Part 2",
      purpose: "Reflecting on hedging principles and previewing Minimum Variance Hedge Ratio",
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: {
            en: {
              display: "In real-world risk management, corporate hedging never extinguishes risk completely—it transforms outright price volatility into smaller, manageable Basis Risk."
            },
            hi: {
              display: "रियल वर्ल्ड में हेजिंग रिस्क को मिटाती नहीं, बल्कि बड़े प्राइस रिस्क को छोटे, मैनेज करने लायक बेसिस रिस्क में बदल देती है।"
            }
          },
          onScreenIntent: "Core lesson synthesis",
          sourceFactIds: ["F01", "F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "When the asset being hedged differs from the futures contract, we face Cross Hedging. In Part 2, we will master the Minimum Variance Hedge Ratio and Metallgesellschaft."
            },
            hi: {
              display: "जब कमोडिटी और फ्यूचर्स अलग हों तो क्रॉस हेजिंग होती है। पार्ट टू में हम मिनिमम वेरियंस हेज रेश्यो और मेटलगेसेलशाफ्ट केस स्टडी समझेंगे।"
            }
          },
          onScreenIntent: "Preview of Part 2 cross hedging topics",
          sourceFactIds: [],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    },
    {
      index: 11,
      title: "Eight Rules to Remember",
      purpose: "Institutional rules codifying hedging strategies and basis mechanics",
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: {
            en: {
              display: "Let us review eight fundamental rules of corporate hedging that every finance professional must remember."
            },
            hi: {
              display: "आइए कॉर्पोरेट हेजिंग के आठ बुनियादी नियमों को एक बार फिर से दोहरा लेते हैं।"
            }
          },
          onScreenIntent: "Overview of the 8 rules",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s11b2",
          speaker: "mentor",
          narration: {
            en: {
              display: "Rule 1: Hedging reduces cash flow variance, not to speculate. Rule 2: Short hedges protect sellers and physical inventory."
            },
            hi: {
              display: "रूल 1: हेजिंग वेरियंस कम करती है, सट्टा नहीं लगाती। रूल 2: शॉर्ट हेज बेचने वालों और इन्वेंट्री की सुरक्षा करता है।"
            }
          },
          onScreenIntent: "Rules 1 and 2 highlighted",
          sourceFactIds: ["F01", "F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s11b3",
          speaker: "mentor",
          narration: {
            en: {
              display: "Rule 3: Long hedges protect buyers and raw material costs. Rule 4: Basis equals Spot Price minus Futures Price."
            },
            hi: {
              display: "रूल 3: लॉन्ग हेज खरीदारों और लागत को सुरक्षित करता है। रूल 4: बेसिस बराबर स्पॉट प्राइस माइनस फ्यूचर्स प्राइस होता है।"
            }
          },
          onScreenIntent: "Rules 3 and 4 highlighted",
          sourceFactIds: ["F03", "F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s11b4",
          speaker: "mentor",
          narration: {
            en: {
              display: "Rule 5: Net price realized by a short hedger is F1 plus b2. Rule 6: A strengthening basis increases net realized selling prices."
            },
            hi: {
              display: "रूल 5: शॉर्ट हेजर की नेट प्राइस एफ वन प्लस बी टू होती है। रूल 6: मजबूत बेसिस सेलिंग प्राइस को बढ़ा देता है।"
            }
          },
          onScreenIntent: "Rules 5 and 6 highlighted",
          sourceFactIds: ["F05", "F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s11b5",
          speaker: "mentor",
          narration: {
            en: {
              display: "Rule 7: A weakening basis reduces net acquisition outlay for buyers. Rule 8: Always choose a delivery month later than the closeout date."
            },
            hi: {
              display: "रूल 7: कमजोर बेसिस खरीद लागत घटा देता है। रूल 8: हमेशा क्लोजआउट के बाद का डिलीवरी महीना चुनें।"
            }
          },
          onScreenIntent: "Rules 7 and 8 highlighted",
          sourceFactIds: ["F06", "F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        },
        {
          id: "s11b6",
          speaker: "mentor",
          narration: {
            en: {
              display: "Remember rule 1 through 8 as the foundational pillars of futures risk management. You are now fully prepared for Part 2."
            },
            hi: {
              display: "रूल 1 से 8 को रिस्क मैनेजमेंट की नींव के तौर पर याद रखें। अब आप पार्ट 2 के लिए तैयार हैं।"
            }
          },
          onScreenIntent: "Compact summary overview of all 8 rules",
          sourceFactIds: [],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(targetDir, '05_teaching_script.json'), JSON.stringify(script, null, 2));
console.log('05_teaching_script.json written successfully');
