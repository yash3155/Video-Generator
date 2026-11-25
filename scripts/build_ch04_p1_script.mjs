import fs from 'node:fs';

const input = JSON.parse(fs.readFileSync('workspace/.tasks/ch04-p1-teaching_script-c81d54ad/input.json', 'utf8'));

// Build scenes
const scenes = [
  // Scene 0: Hook (chat_story, 4 beats)
  {
    index: 0,
    title: "The Single Rate Trap",
    purpose: "Hook: The single-rate discount trap and the real-world demand for zero curves",
    beats: [
      {
        id: "s00b1",
        speaker: "novice",
        narration: {
          en: {
            display: "How can a bank price a multi-year corporate derivative contract when cash flows stretch across ten years? Can we simply discount every cash flow using a single yield to maturity?"
          },
          hi: {
            display: "जब किसी बैंक को दस साल में फैले कैश फ्लो वाले कॉर्पोरेट डेरिवेटिव की कीमत तय करनी हो, तो क्या हम सभी कैश फ्लो को केवल एक ही यील्ड टू मैच्योरिटी से डिस्काउंट कर सकते हैं?"
          }
        },
        onScreenIntent: "Opening novice struggle: pricing 10-year cash flows with single flat yield",
        sourceFactIds: ["F01", "F06"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s00b2",
        speaker: "mentor",
        narration: {
          en: {
            display: "A novice analyst might use a single yield to maturity, but that is a dangerous trap. Yield to maturity is a single internal rate that assumes flat interest rates across all maturities."
          },
          hi: {
            display: "एक नौसिखिया विश्लेषक एकल यील्ड टू मैच्योरिटी का उपयोग कर सकता है, लेकिन यह एक खतरनाक जाल है। यील्ड टू मैच्योरिटी वह एकल आंतरिक दर है जो सभी मैच्योरिटी पर फ्लैट ब्याज दरें मानती है।"
          }
        },
        onScreenIntent: "Mentor response: flat yield to maturity assumption causes severe pricing distortion",
        sourceFactIds: ["F06"],
        newTerms: ["yield to maturity"],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s00b3",
        speaker: "novice",
        narration: {
          en: {
            display: "What goes wrong when yield curves slope upward? Do arbitrage traders exploit the pricing mismatch and create severe trading losses for the bank?"
          },
          hi: {
            display: "जब यील्ड कर्व ऊपर की ओर ढलान वाला होता है तो क्या गलत होता है? क्या आर्बिट्राज ट्रेडर कीमत के इस अंतर का फायदा उठाकर बैंक को भारी नुकसान पहुंचाते हैं?"
          }
        },
        onScreenIntent: "Novice question: arbitrage exploitation and trading losses on upward curves",
        sourceFactIds: ["F06"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s00b4",
        speaker: "mentor",
        narration: {
          en: {
            display: "Yes, severe losses occur. A Treasury rate is the interest rate a government pays to borrow its currency without default. Desks construct the spot zero curve using sovereign Treasury rates and recursive bootstrapping techniques."
          },
          hi: {
            display: "हाँ, भारी नुकसान होता है। ट्रेजरी रेट वह ब्याज दर है जो सरकार बिना डिफॉल्ट के अपनी मुद्रा उधार लेने के लिए चुकाती है। डेस्क सॉवरेन ट्रेजरी रेट्स और रिकर्सिव बूटस्ट्रैपिंग से स्पॉट जीरो कर्व बनाते हैं।"
          }
        },
        onScreenIntent: "Show resolution: constructing sovereign zero curve from Treasury rates",
        sourceFactIds: ["F01", "F08"],
        newTerms: ["Treasury rate", "zero curve"],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  },

  // Scene 1: Tension (tug_of_war, 3 beats)
  {
    index: 1,
    title: "Discrete vs Continuous Compounding",
    purpose: "Tension: Discrete compounding conventions versus continuous compounding mathematical reality",
    beats: [
      {
        id: "s01b1",
        speaker: "narrator",
        narration: {
          en: {
            display: "Commercial banks quote interest on a discrete compounding basis. Discrete compounding means interest is calculated and added at fixed calendar intervals like semiannually or monthly."
          },
          hi: {
            display: "कमर्शियल बैंक डिस्क्रीट कंपाउंडिंग के आधार पर ब्याज कोट करते हैं। डिस्क्रीट कंपाउंडिंग का मतलब है कि ब्याज अर्धवार्षिक या मासिक जैसे निश्चित कैलेंडर अंतरालों पर जोड़ा जाता है।"
          }
        },
        onScreenIntent: "Show commercial banking discrete compounding intervals on a calendar timeline",
        sourceFactIds: ["F02"],
        newTerms: ["discrete compounding"],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s01b2",
        speaker: "narrator",
        narration: {
          en: {
            display: "In derivatives modeling, financial economists require continuous compounding. Continuous compounding means interest is added continuously at every infinitesimal fraction of a second."
          },
          hi: {
            display: "डेरिवेटिव्स मॉडलिंग में वित्तीय अर्थशास्त्रियों को कंटीन्यूअस कंपाउंडिंग की आवश्यकता होती है। कंटीन्यूअस कंपाउंडिंग का मतलब है कि ब्याज हर पल लगातार जुड़ता रहता है।"
          }
        },
        onScreenIntent: "Show analytical continuous compounding curve smoothly expanding terminal value",
        sourceFactIds: ["F02"],
        newTerms: ["continuous compounding"],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s01b3",
        speaker: "narrator",
        narration: {
          en: {
            display: "Can we switch seamlessly between discrete banking quotes and continuous quantitative formulas? The natural logarithm provides an exact mathematical bridge between both worlds."
          },
          hi: {
            display: "क्या हम डिस्क्रीट बैंकिंग कोट्स और कंटीन्यूअस क्वांटिटेटिव फॉर्मूलों के बीच आसानी से स्विच कर सकते हैं? नेचुरल लॉगरिदम दोनों दुनिया के बीच एक सटीक गणितीय पुल प्रदान करता है।"
          }
        },
        onScreenIntent: "Show mathematical conversion bridge linking discrete rates to continuous rates",
        sourceFactIds: ["F03"],
        newTerms: [],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  },

  // Scene 2: Pillars (progressive_cards, 4 beats)
  {
    index: 2,
    title: "Four Pillars of Interest Rate Mechanics",
    purpose: "Pillars: The Four Pillars of Interest Rate Mechanics: Rates, Compounding, Zero Curve, and Forward Rates",
    beats: [
      {
        id: "s02b1",
        speaker: "narrator",
        narration: {
          en: {
            display: "Pillar 1 establishes benchmark rates. Sovereign Treasury rates reflect default-free borrowing, while the repo rate is collateralized borrowing secured by government debt securities."
          },
          hi: {
            display: "पहला पिलर बेंचमार्क दरों को स्थापित करता है। सॉवरेन ट्रेजरी दरें डिफॉल्ट-मुक्त उधार को दर्शाती हैं, जबकि रेपो रेट सरकारी ऋण प्रतिभूतियों द्वारा सुरक्षित उधार दर है।"
          }
        },
        onScreenIntent: "Card 1: Benchmark Rates showing Treasury rates and repo rate collateralization",
        sourceFactIds: ["F01"],
        newTerms: ["repo rate"],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s02b2",
        speaker: "narrator",
        narration: {
          en: {
            display: "Pillar 2 defines continuous discounting. A discount factor is the current value today of one dollar received at a future date. Present cash flow values multiply future payments by exponential discount factor e to the power minus R T."
          },
          hi: {
            display: "दूसरा पिलर कंटीन्यूअस डिस्काउंटिंग को परिभाषित करता है। डिस्काउंट फैक्टर भविष्य की तारीख पर मिलने वाले एक डॉलर का आज का वर्तमान मूल्य है। वर्तमान कैश फ्लो मूल्य भविष्य के भुगतानों को घातीय डिस्काउंट फैक्टर e की घात माइनस R T से गुणा करते हैं।"
          }
        },
        onScreenIntent: "Card 2: Continuous Discounting showing exponential discount factor PV = B * e^(-RT)",
        sourceFactIds: ["F04"],
        newTerms: ["discount factor"],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s02b3",
        speaker: "narrator",
        narration: {
          en: {
            display: "Pillar 3 constructs the zero curve. A zero rate is the return on an investment with no intermediate coupons, extracted recursively from coupon bonds using bootstrapping."
          },
          hi: {
            display: "तीसरा पिलर जीरो कर्व का निर्माण करता है। जीरो रेट बिना किसी मध्यवर्ती कूपन के निवेश पर रिटर्न है, जिसे बूटस्ट्रैपिंग का उपयोग करके कूपन बॉन्ड से निकाला जाता है।"
          }
        },
        onScreenIntent: "Card 3: Zero Curve showing zero rate spot yields stripped from bond prices",
        sourceFactIds: ["F05", "F08"],
        newTerms: ["zero rate", "Bootstrap method"],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s02b4",
        speaker: "narrator",
        narration: {
          en: {
            display: "Pillar 4 derives forward rates. A forward rate is the future interest rate implied today by zero rates for borrowing between two upcoming dates."
          },
          hi: {
            display: "चौथा पिलर फॉरवर्ड दरों को प्राप्त करता है। फॉरवर्ड रेट दो आने वाली तारीखों के बीच उधार लेने के लिए आज जीरो दरों द्वारा निहित भविष्य की ब्याज दर है।"
          }
        },
        onScreenIntent: "Card 4: Forward Rates showing future implied interest rate extraction",
        sourceFactIds: ["F09"],
        newTerms: ["forward rate"],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  },

  // Scene 3: Continuous Compounding Formula (formula_breakdown, 3 beats)
  {
    index: 3,
    title: "Continuous Compounding Mechanics",
    purpose: "Formula: Continuous compounding and present value discount factors",
    beats: [
      {
        id: "s03b1",
        speaker: "narrator",
        narration: {
          en: {
            display: "Let us examine the conversion formula. To transform a rate R m compounded m times into continuous rate R c, we calculate m times the natural logarithm of one plus R m over m."
          },
          hi: {
            display: "आइए रूपांतरण सूत्र की जांच करें। m बार कंपाउंड की गई दर R m को कंटीन्यूअस दर R c में बदलने के लिए, हम m गुना एक प्लस R m बटे m के नेचुरल लॉग की गणना करते हैं।"
          }
        },
        onScreenIntent: "Show formula breakdown for continuous rate conversion R_c = m * ln(1 + R_m / m)",
        sourceFactIds: ["F03"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s03b2",
        speaker: "narrator",
        narration: {
          en: {
            display: "Consider a concrete numerical example. A bank quotes an annual rate of 10% compounded semiannually, meaning frequency m equals 2. The periodic six-month rate is 5%."
          },
          hi: {
            display: "एक ठोस संख्यात्मक उदाहरण पर विचार करें। एक बैंक अर्धवार्षिक रूप से 10% वार्षिक दर कोट करता है, जिसका अर्थ है आवृत्ति m 2 के बराबर है। छह महीने की दर 5% है।"
          }
        },
        onScreenIntent: "Display given numbers: R_m = 0.10, compounding frequency m = 2, periodic rate 1.05",
        sourceFactIds: ["F11"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s03b3",
        speaker: "narrator",
        narration: {
          en: {
            display: "Taking 2 times the natural logarithm of 1.05 gives 0.09758, or 9.758%. Compounding continuously requires a lower stated interest rate to achieve the exact same final balance."
          },
          hi: {
            display: "1.05 का नेचुरल लॉग लेकर 2 से गुणा करने पर 0.09758, यानी 9.758% प्राप्त होता है। समान अंतिम बैलेंस प्राप्त करने के लिए कंटीन्यूअस कंपाउंडिंग में कम दर की आवश्यकता होती है।"
          }
        },
        onScreenIntent: "Show calculated result: R_c = 0.09758 (9.758%) with terminal value equality",
        sourceFactIds: ["F02", "F11"],
        newTerms: [],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  },

  // Scene 4: Causal Chain (causal_chain, 3 beats)
  {
    index: 4,
    title: "Causal Architecture of the Bootstrap",
    purpose: "Causal Chain: The recursive Bootstrap method for stripping coupons",
    beats: [
      {
        id: "s04b1",
        speaker: "narrator",
        narration: {
          en: {
            display: "The market presents coupon bond prices across maturities. Because each bond pays periodic coupons, market prices bundle multiple maturities into one package."
          },
          hi: {
            display: "बाजार विभिन्न मैच्योरिटी के कूपन बॉन्ड की कीमतें पेश करता है। चूंकि प्रत्येक बॉन्ड समय-समय पर कूपन का भुगतान करता है, बाजार कीमतें कई मैच्योरिटी को एक पैकेज में बंडल करती हैं।"
          }
        },
        onScreenIntent: "Node 1: Market bond prices observed containing bundled periodic cash flows",
        sourceFactIds: ["F06"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s04b2",
        speaker: "narrator",
        narration: {
          en: {
            display: "The bootstrap algorithm strips prior known coupon cash flows recursively. Each intermediate coupon is discounted using the previously solved zero rates."
          },
          hi: {
            display: "बूटस्ट्रैप एल्गोरिदम पहले से ज्ञात कूपन कैश फ्लो को रिकर्सिव तरीके से अलग करता है। प्रत्येक मध्यवर्ती कूपन को पहले हल किए गए जीरो रेट्स का उपयोग करके डिस्काउंट किया जाता है।"
          }
        },
        onScreenIntent: "Node 2: Recursive coupon stripping discounting earlier payments with known zero rates",
        sourceFactIds: ["F08"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s04b3",
        speaker: "narrator",
        narration: {
          en: {
            display: "Subtracting discounted coupons isolates the final principal and interest. We solve directly for the next zero rate, unlocking accurate pricing across all corporate derivatives."
          },
          hi: {
            display: "डिस्काउंटेड कूपन घटाने से अंतिम मूलधन और ब्याज अलग हो जाता है। हम सीधे अगले जीरो रेट को हल करते हैं, जिससे सभी कॉर्पोरेट डेरिवेटिव्स की सटीक कीमत संभव हो जाती है।"
          }
        },
        onScreenIntent: "Node 3: Final cash flow isolated to solve next zero rate and complete spot curve",
        sourceFactIds: ["F06", "F08"],
        newTerms: [],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  },

  // Scene 5: Worked Example (worked_example, 3 beats)
  {
    index: 5,
    title: "Bootstrapping Treasury Zero Rates",
    purpose: "Worked Example: Bootstrapping Treasury zero rates from bill and coupon bond prices",
    beats: [
      {
        id: "s05b1",
        speaker: "narrator",
        narration: {
          en: {
            display: "Let us bootstrap the six-month zero rate from a Treasury bill. A Treasury bill is a short-term government debt security that pays no regular coupon. A bill with face value 100 dollars and maturity 0.5 years trades at 97.50 dollars."
          },
          hi: {
            display: "आइए ट्रेजरी बिल से छह महीने के जीरो रेट को बूटस्ट्रैप करें। ट्रेजरी बिल एक शॉर्ट-टर्म सरकारी ऋण प्रतिभूति है जो कोई नियमित कूपन नहीं देती है। 100 डॉलर फेस वैल्यू और 0.5 वर्ष मैच्योरिटी वाला बिल 97.50 डॉलर पर ट्रेड करता है।"
          }
        },
        onScreenIntent: "Show given bill parameters: Price = 97.50, Face = 100, Maturity T = 0.5 years",
        sourceFactIds: ["F08", "F12"],
        newTerms: ["Treasury bill"],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s05b2",
        speaker: "narrator",
        narration: {
          en: {
            display: "Setting price 97.50 equal to 100 times e to the power minus 0.5 R yields discount ratio 0.975. Taking natural logarithm and dividing by minus 0.5 solves for rate R."
          },
          hi: {
            display: "कीमत 97.50 को 100 गुना e की घात माइनस 0.5 R के बराबर रखने पर डिस्काउंट रेश्यो 0.975 प्राप्त होता है। नेचुरल लॉग लेकर माइनस 0.5 से भाग देने पर दर R प्राप्त होती है।"
          }
        },
        onScreenIntent: "Step 1: Compute ratio 0.975 and apply continuous rate formula -ln(0.975) / 0.5",
        sourceFactIds: ["F04", "F12"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s05b3",
        speaker: "narrator",
        narration: {
          en: {
            display: "The continuously compounded six-month zero rate equals 0.05064, or 5.064%. This exact rate now discounts six-month coupons on all longer-dated coupon bonds."
          },
          hi: {
            display: "कंटीन्यूअसली कंपाउंडेड छह महीने की जीरो दर 0.05064, यानी 5.064% के बराबर है। यह सटीक दर अब लंबी अवधि के कूपन बॉन्ड पर छह महीने के कूपन को डिस्काउंट करती है।"
          }
        },
        onScreenIntent: "Result: 6-month zero rate = 0.05064 (5.064%) used to discount subsequent coupons",
        sourceFactIds: ["F05", "F12"],
        newTerms: [],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  },

  // Scene 6: Misconception Split (split_comparison, 3 beats)
  {
    index: 6,
    title: "Flat YTM vs Spot Zero Curve",
    purpose: "Misconception: Flat Yield to Maturity versus the true zero curve",
    beats: [
      {
        id: "s06b1",
        speaker: "narrator",
        narration: {
          en: {
            display: "A common novice misconception assumes that discounting all cash flows with a single flat yield to maturity accurately prices fixed income instruments."
          },
          hi: {
            display: "एक आम नौसिखिया गलत धारणा यह मानती है कि सभी कैश फ्लो को एक ही फ्लैट यील्ड टू मैच्योरिटी से डिस्काउंट करने से सही कीमत मिलती है।"
          }
        },
        onScreenIntent: "Novice trap panel: Flat Yield to Maturity assumption applied across all tenors",
        sourceFactIds: ["F06"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s06b2",
        speaker: "narrator",
        narration: {
          en: {
            display: "In reality, each coupon cash flow must be discounted at the unique spot zero rate matching its exact maturity. Yield to maturity is merely a weighted average."
          },
          hi: {
            display: "वास्तव में प्रत्येक कूपन कैश फ्लो को उसकी सटीक मैच्योरिटी से मेल खाने वाले अद्वितीय स्पॉट जीरो रेट पर डिस्काउंट किया जाना चाहिए। यील्ड टू मैच्योरिटी केवल एक भारित औसत है।"
          }
        },
        onScreenIntent: "Professional reality panel: Unique zero rates discounting each cash flow independently",
        sourceFactIds: ["F05", "F06"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s06b3",
        speaker: "narrator",
        narration: {
          en: {
            display: "The par yield is the coupon rate that makes the bond price equal to face value. Par yields reflect the shape of the zero curve without replacing spot rates."
          },
          hi: {
            display: "पार यील्ड वह कूपन दर है जो बॉन्ड की कीमत को फेस वैल्यू के बराबर बनाती है। पार यील्ड स्पॉट दरों की जगह लिए बिना जीरो कर्व के आकार को दर्शाती है।"
          }
        },
        onScreenIntent: "Show Par Yield definition F07 and comparison with spot zero curve",
        sourceFactIds: ["F07"],
        newTerms: ["par yield"],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  },

  // Scene 7: Forward Rate Breakdown (formula_breakdown, 3 beats)
  {
    index: 7,
    title: "Extracting Implied Forward Rates",
    purpose: "Formula Breakdown: Implied forward interest rate calculation",
    beats: [
      {
        id: "s07b1",
        speaker: "narrator",
        narration: {
          en: {
            display: "Forward rates represent borrowing costs implied between future dates T 1 and T 2. The formula calculates R 2 times T 2 minus R 1 times T 1, divided by T 2 minus T 1."
          },
          hi: {
            display: "फॉरवर्ड दरें भविष्य की तारीखों T 1 और T 2 के बीच निहित उधार लागत का प्रतिनिधित्व करती हैं। फॉर्मूला R 2 गुना T 2 माइनस R 1 गुना T 1, बटे T 2 माइनस T 1 की गणना करता है।"
          }
        },
        onScreenIntent: "Formula breakdown: R_F = (R_2*T_2 - R_1*T_1) / (T_2 - T_1)",
        sourceFactIds: ["F09"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s07b2",
        speaker: "narrator",
        narration: {
          en: {
            display: "If the 1-year zero rate is 3% and the 2-year zero rate is 4%, what must the 1-year forward rate starting at year 1 be? The numerator is 0.04 times 2 minus 0.03 times 1."
          },
          hi: {
            display: "यदि 1-वर्ष की जीरो दर 3% है और 2-वर्ष की जीरो दर 4% है, तो वर्ष 1 से शुरू होने वाली 1-वर्षीय फॉरवर्ड दर क्या होनी चाहिए? अंश 0.04 गुना 2 माइनस 0.03 गुना 1 है।"
          }
        },
        onScreenIntent: "Prediction Question: Calculate forward rate with R_1 = 3%, T_1 = 1, R_2 = 4%, T_2 = 2",
        sourceFactIds: ["F09", "F10"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s07b3",
        speaker: "narrator",
        narration: {
          en: {
            display: "Subtracting 0.03 from 0.04 times 2 leaves 0.05, and dividing by 1 year gives exactly 5.0%. The forward rate must be 5.0% to prevent profitable multi-year borrowing arbitrage."
          },
          hi: {
            display: "0.04 गुना 2 में से 0.03 घटाने पर 0.05 बचता है, और 1 वर्ष से भाग देने पर ठीक 5.0% प्राप्त होता है। बहु-वर्षीय आर्बिट्राज को रोकने के लिए फॉरवर्ड दर 5.0% होनी चाहिए।"
          }
        },
        onScreenIntent: "Show reveal: Forward rate R_F = 5.0% with no-arbitrage proof",
        sourceFactIds: ["F10"],
        newTerms: [],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  },

  // Scene 8: Term Structure Chart (data_chart, 3 beats)
  {
    index: 8,
    title: "Zero Rates vs Forward Curve",
    purpose: "Data Chart: The term structure relationship between forward rates and zero rates",
    beats: [
      {
        id: "s08b1",
        speaker: "narrator",
        narration: {
          en: {
            display: "When the zero curve slopes upward, implied forward rates must lie strictly above the zero curve. Each incremental year pulls up the cumulative average rate."
          },
          hi: {
            display: "जब जीरो कर्व ऊपर की ओर ढलान वाला होता है, तो निहित फॉरवर्ड दरें निश्चित रूप से जीरो कर्व के ऊपर स्थित होनी चाहिए। प्रत्येक अतिरिक्त वर्ष संचयी औसत दर को ऊपर खींचता है।"
          }
        },
        onScreenIntent: "Display chart: Upward sloping zero curve with forward curve plotted strictly above it",
        sourceFactIds: ["F05", "F09"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s08b2",
        speaker: "narrator",
        narration: {
          en: {
            display: "At year 1 the zero rate is 3.0%, while at year 2 the zero rate rises to 4.0%. The implied forward rate for that second year reaches 5.0%."
          },
          hi: {
            display: "वर्ष 1 पर जीरो दर 3.0% है, जबकि वर्ष 2 पर जीरो दर बढ़कर 4.0% हो जाती है। उस दूसरे वर्ष के लिए निहित फॉरवर्ड दर 5.0% तक पहुंच जाती है।"
          }
        },
        onScreenIntent: "Highlight data points: Year 1 at 3%, Year 2 at 4%, Forward rate Year 2 at 5%",
        sourceFactIds: ["F10"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s08b3",
        speaker: "narrator",
        narration: {
          en: {
            display: "Conversely, if the zero curve slopes downward, forward rates lie below zero rates. Understanding this geometric relationship is essential for bond portfolio management."
          },
          hi: {
            display: "इसके विपरीत यदि जीरो कर्व नीचे की ओर ढलान वाला है, तो फॉरवर्ड दरें जीरो दरों से नीचे होती हैं। इस ज्यामितीय संबंध को समझना बॉन्ड पोर्टफोलियो प्रबंधन के लिए आवश्यक है।"
          }
        },
        onScreenIntent: "Contrast with inverted zero curve showing forward rate below spot rate",
        sourceFactIds: ["F09"],
        newTerms: [],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  },

  // Scene 9: Interactive Quiz (interactive_quiz, 3 beats)
  {
    index: 9,
    title: "Interactive Assessment",
    purpose: "Interactive Quiz: Testing forward rate calculation and compounding mechanics",
    beats: [
      {
        id: "s09b1",
        speaker: "narrator",
        narration: {
          en: {
            display: "Suppose a sovereign zero curve quotes a 1-year zero rate of 3.0% and a 2-year zero rate of 4.0%. What is the implied 1-year forward rate starting at year 1?"
          },
          hi: {
            display: "मान लीजिए कि एक सॉवरेन जीरो कर्व 1-वर्षीय जीरो दर 3.0% और 2-वर्षीय जीरो दर 4.0% कोट करता है। वर्ष 1 से शुरू होने वाली निहित 1-वर्षीय फॉरवर्ड दर क्या है?"
          }
        },
        onScreenIntent: "Quiz question presented with four options A to D in 2x2 grid",
        sourceFactIds: ["F09", "F10"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s09b2",
        speaker: "narrator",
        narration: {
          en: {
            display: "Pause and calculate the forward rate using the continuous formula. Multiply 4% by 2 years, subtract 3% times 1 year, and divide by the 1-year time difference."
          },
          hi: {
            display: "रुकें और कंटीन्यूअस फॉर्मूले का उपयोग करके फॉरवर्ड दर की गणना करें। 4% को 2 साल से गुणा करें, 3% गुना 1 साल घटाएं, और 1 साल के अंतर से भाग दें।"
          }
        },
        onScreenIntent: "Thinking pause with countdown timer and visible formula hint",
        sourceFactIds: ["F09"],
        newTerms: [],
        pauseAfterMs: 3200,
        transition: false
      },
      {
        id: "s09b3",
        speaker: "narrator",
        narration: {
          en: {
            display: "The correct answer is Option C: 5.0%. Subtracting 0.03 from 0.04 times 2 leaves 0.05, and dividing by 1 year yields exactly 5.0%, preventing arbitrage between consecutive investments."
          },
          hi: {
            display: "सही उत्तर Option C: 5.0% है। 0.04 गुना 2 में से 0.03 घटाकर 1 से भाग देने पर ठीक 5.0% प्राप्त होता है, जो आर्बिट्राज को रोकता है।"
          }
        },
        onScreenIntent: "Reveal correct option: Option C (5.0%) highlights green with explanation",
        sourceFactIds: ["F10"],
        newTerms: [],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  },

  // Scene 10: Roadmap (roadmap, 3 beats)
  {
    index: 10,
    title: "Where We Are on the Journey",
    purpose: "Roadmap: Where we are on the interest rate mastery journey",
    beats: [
      {
        id: "s10b1",
        speaker: "narrator",
        narration: {
          en: {
            display: "We have mastered the foundational mechanics of interest rates. We progressed from Treasury benchmark rates to continuous discounting and recursive zero curve bootstrapping."
          },
          hi: {
            display: "हमने ब्याज दरों के बुनियादी तंत्र में महारत हासिल कर ली है। हम ट्रेजरी बेंचमार्क दरों से कंटीन्यूअस डिस्काउंटिंग और रिकर्सिव जीरो कर्व बूटस्ट्रैपिंग की ओर बढ़े हैं।"
          }
        },
        onScreenIntent: "Roadmap step 1 to 3 completed: Benchmarks, Compounding, and Zero Curve Bootstrap",
        sourceFactIds: ["F01", "F08"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s10b2",
        speaker: "narrator",
        narration: {
          en: {
            display: "We also extracted forward interest rates from spot zero curves. These implied forward rates dictate fair pricing for forward rate agreements and multi-period interest rate swaps."
          },
          hi: {
            display: "हमने स्पॉट जीरो कर्व्स से फॉरवर्ड ब्याज दरें भी निकाली हैं। ये निहित फॉरवर्ड दरें फॉरवर्ड रेट एग्रीमेंट्स और मल्टी-पीरियड इंटरेस्ट रेट स्वैप के लिए उचित मूल्य तय करती हैं।"
          }
        },
        onScreenIntent: "Roadmap step 4: Forward Rates unlocked for derivative pricing",
        sourceFactIds: ["F09"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s10b3",
        speaker: "narrator",
        narration: {
          en: {
            display: "In Part 2, we will apply these zero curves to Forward Rate Agreements, bond portfolio duration, convexity hedging, and theories of the term structure."
          },
          hi: {
            display: "भाग 2 में, हम इन जीरो कर्व्स को फॉरवर्ड रेट एग्रीमेंट्स, बॉन्ड पोर्टफोलियो ड्यूरेशन, कन्वेक्सिटी हेजिंग और टर्म स्ट्रक्चर के सिद्धांतों पर लागू करेंगे।"
          }
        },
        onScreenIntent: "Bridge to Part 2: FRAs, Duration, Convexity, and Term Structure Theories",
        sourceFactIds: ["F01"],
        newTerms: [],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  },

  // Scene 11: Summary Thread (summary_thread, 6 beats)
  {
    index: 11,
    title: "The 8 Golden Rules",
    purpose: "Summary Thread: The 8 Golden Rules of Interest Rates and Zero Curves",
    beats: [
      {
        id: "s11b1",
        speaker: "narrator",
        narration: {
          en: {
            display: "Here are the eight golden rules that govern interest rate mechanics, zero curves, and forward rate calculations in fixed income markets."
          },
          hi: {
            display: "यहाँ आठ सुनहरे नियम हैं जो निश्चित आय बाजारों में ब्याज दर तंत्र, जीरो कर्व्स और फॉरवर्ड दर गणनाओं को नियंत्रित करते हैं।"
          }
        },
        onScreenIntent: "Summary header: The 8 Golden Rules of Interest Rates and Zero Curves",
        sourceFactIds: ["F01"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s11b2",
        speaker: "narrator",
        narration: {
          en: {
            display: "Rule 1: Treasury rates represent default-free sovereign borrowing. Rule 2: Continuous compounding provides terminal value A times e to the power R n."
          },
          hi: {
            display: "नियम 1: ट्रेजरी दरें डिफॉल्ट-मुक्त सॉवरेन उधार का प्रतिनिधित्व करती हैं। नियम 2: कंटीन्यूअस कंपाउंडिंग टर्मिनल मूल्य A गुना e की घात R n प्रदान करती है।"
          }
        },
        onScreenIntent: "Show Rule 1 (Treasury Rates) and Rule 2 (Continuous Compounding)",
        sourceFactIds: ["F01", "F02"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s11b3",
        speaker: "narrator",
        narration: {
          en: {
            display: "Rule 3: Converting discrete rate R m to continuous rate R c uses m times natural logarithm of one plus R m over m. Rule 4: Present value discount factor is e to the power minus R T."
          },
          hi: {
            display: "नियम 3: डिस्क्रीट दर को कंटीन्यूअस दर में बदलने के लिए m गुना नेचुरल लॉग का उपयोग किया जाता है। नियम 4: वर्तमान मूल्य डिस्काउंट फैक्टर e की घात माइनस R T है।"
          }
        },
        onScreenIntent: "Show Rule 3 (Rate Conversion) and Rule 4 (Discount Factors)",
        sourceFactIds: ["F03", "F04"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s11b4",
        speaker: "narrator",
        narration: {
          en: {
            display: "Rule 5: Zero rates discount single cash flows with zero intermediate coupons. Rule 6: Par yield is the coupon rate causing bond price to equal face value."
          },
          hi: {
            display: "नियम 5: जीरो दरें बिना किसी मध्यवर्ती कूपन के एकल कैश फ्लो को डिस्काउंट करती हैं। नियम 6: पार यील्ड वह कूपन दर है जिससे बॉन्ड की कीमत फेस वैल्यू के बराबर होती है।"
          }
        },
        onScreenIntent: "Show Rule 5 (Zero-Coupon Rates) and Rule 6 (Par Yields)",
        sourceFactIds: ["F05", "F07"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s11b5",
        speaker: "narrator",
        narration: {
          en: {
            display: "Rule 7: The Bootstrap method strips prior coupons recursively to build the spot curve. Rule 8: Implied forward rates equal the difference in rate-time products over time difference."
          },
          hi: {
            display: "नियम 7: बूटस्ट्रैप विधि स्पॉट कर्व बनाने के लिए पहले के कूपनों को रिकर्सिव तरीके से अलग करती है। नियम 8: निहित फॉरवर्ड दरें समय अंतर पर दर-समय उत्पादों के अंतर के बराबर होती हैं।"
          }
        },
        onScreenIntent: "Show Rule 7 (Bootstrap Stripping) and Rule 8 (Forward Rate Formula)",
        sourceFactIds: ["F08", "F09"],
        newTerms: [],
        pauseAfterMs: 260,
        transition: false
      },
      {
        id: "s11b6",
        speaker: "narrator",
        narration: {
          en: {
            display: "Review all eight rules from Rule 1 through Rule 8. Mastering these foundations prepares you to price complex derivatives, swaps, and manage interest rate risk."
          },
          hi: {
            display: "नियम 1 से नियम 8 तक सभी आठ नियमों की समीक्षा करें। इन बुनियादी बातों में महारत हासिल करने से आप जटिल डेरिवेटिव्स और स्वैप्स की सही कीमत तय कर सकते हैं।"
          }
        },
        onScreenIntent: "Show full 8-rule summary grid from Rule 1 to Rule 8",
        sourceFactIds: ["F01", "F08", "F09"],
        newTerms: [],
        pauseAfterMs: 450,
        transition: true
      }
    ]
  }
];

const script = {
  languages: ["en", "hi"],
  scenes
};

fs.writeFileSync('workspace/.tasks/ch04-p1-teaching_script-c81d54ad/output.json', JSON.stringify(script, null, 2));
console.log('Script written to output.json');
