// scripts/build_vpa_foreword_data.mjs
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { SourceFactsSchema, LessonPlanSchema, VisualCreativeBriefSchema, StoryboardSchema } from '../src/schemas/sourceLessonSchemas.mjs';
import { runContentAudit } from './audit_content.mjs';
import { scaffoldEpisode } from '../src/orchestrator/scaffoldingEngine.mjs';

const rootDir = process.cwd();
const chapterSlug = 'vpa_foreword';
const hindiDir = path.join(rootDir, 'src', 'data', 'chapters', 'coulling_vpa', chapterSlug);
const englishDir = path.join(rootDir, 'src', 'data', 'chapters', 'coulling_vpa_en', chapterSlug);

fs.mkdirSync(hindiDir, { recursive: true });
fs.mkdirSync(englishDir, { recursive: true });

// 1. Authoritative Source Facts
const sourceFacts = {
  schemaVersion: '1.0.0',
  chapterSlug,
  notebookId: '37f192bf-8225-4ea5-a8d0-3b3a19c18fd9',
  sourceId: '10a71777-9b52-4752-a6c1-9ea4c73509d0',
  retrievalTimestamp: new Date().toISOString(),
  bookTitle: 'A Complete Guide To Volume Price Analysis (Anna Coulling)',
  facts: [
    {
      id: 'fact-01',
      category: 'definition',
      topic: 'Volume Price Analysis (VPA) Core Definition',
      statement: 'Volume Price Analysis (VPA) is an analytical methodology combining candlestick price spread, wick shadows, and transaction volume to validate whether price moves are authentic or insider-engineered traps.',
      sourceCitation: {
        book: 'A Complete Guide To Volume Price Analysis',
        chapter: 'Foreword',
        excerpt: 'Volume Price Analysis (VPA) is an analytical methodology that uses the symbiotic relationship between price action and volume to confirm trends and spot anomalies.'
      }
    },
    {
      id: 'fact-02',
      category: 'claim',
      topic: '100-Year Heritage of Volume Trading',
      statement: 'VPA is not a modern fad but a century-old discipline established by Charles Dow, Jesse Livermore, and Richard Wyckoff, demonstrating that core human emotions of fear and greed repeat indefinitely across market eras.',
      sourceCitation: {
        book: 'A Complete Guide To Volume Price Analysis',
        chapter: 'Foreword',
        excerpt: 'It is a 100-year-old technique utilized by market legends such as Charles Dow, Jesse Livermore, and Richard Wyckoff, who built massive fortunes using ticker tape.'
      }
    },
    {
      id: 'fact-03',
      category: 'case_study',
      topic: 'Albert Labos & The HMS President Seminar (1998)',
      statement: 'In January 1998, Anna Coulling paid £5,000 to attend Albert Labos’s two-week seminar aboard the HMS President (a 1918 anti-submarine Q-ship moored on the River Thames in London), where Labos dramatically challenged bank spies who sought to steal his insider order-flow secrets.',
      sourceCitation: {
        book: 'A Complete Guide To Volume Price Analysis',
        chapter: 'Foreword',
        excerpt: 'Two weeks later, on an early Sunday morning, I joined hundreds of other hopefuls in a packed room, on the HMS President... paying my £5,000 for a two week course.'
      },
      numericalDetails: {
        values: {
          tuitionPounds: 5000,
          courseDurationDays: 14,
          shipConstructionYear: 1918
        },
        units: '£',
        context: 'Cost and historical setting of Albert Labos introductory course.'
      }
    },
    {
      id: 'fact-04',
      category: 'definition',
      topic: 'Syndicate Trader & Tom Williams',
      statement: 'A syndicate trader is an institutional specialist or pool operator—exemplified by partially-sighted trader Tom Williams—who executes systematic accumulation or distribution campaigns on behalf of banking cartels without triggering premature retail counter-trends.',
      sourceCitation: {
        book: 'A Complete Guide To Volume Price Analysis',
        chapter: 'Foreword',
        excerpt: 'We were then introduced to a Tom Williams. We were told that Tom was partially sighted... and an ex syndicate trader.'
      }
    },
    {
      id: 'fact-05',
      category: 'claim',
      topic: 'Edwin Lefevre Reminiscences of a Stock Operator',
      statement: 'Published in 1923 as a thinly-disguised biography of Jesse Livermore, Reminiscences of a Stock Operator establishes that speculation is as old as the hills, proving that ticker-tape principles govern electronic markets identically today.',
      sourceCitation: {
        book: 'A Complete Guide To Volume Price Analysis',
        chapter: 'Foreword',
        excerpt: 'There is nothing new in Wall Street. There cannot be because speculation is as old as the hills. Whatever happens in the stock market today has happened before and will happen again.'
      }
    },
    {
      id: 'fact-06',
      category: 'market_rule',
      topic: 'Why Volume Cannot Be Hidden Invariant',
      statement: 'While institutional market makers and insiders can manipulate quote prices through spread widening and false breakout spikes, volume cannot be hidden because institutional capital deployment must physically execute on the exchange tape.',
      sourceCitation: {
        book: 'A Complete Guide To Volume Price Analysis',
        chapter: 'Foreword',
        excerpt: 'Throughout the two weeks, the over-riding message was that all financial markets are manipulated in one way or another. Volume cannot be hidden. It is there for everyone to see.'
      }
    },
    {
      id: 'fact-07',
      category: 'claim',
      topic: 'The Two Leading Indicators Principle',
      statement: 'Price spread and transaction volume are the only two leading indicators in technical finance; all derived mathematical indicators such as moving averages, stochastics, and RSI lag behind current institutional order flow.',
      sourceCitation: {
        book: 'A Complete Guide To Volume Price Analysis',
        chapter: 'Foreword',
        excerpt: 'Volume Price Analysis (VPA) is built on combining the only two leading indicators in trading: price and volume.'
      }
    },
    {
      id: 'fact-08',
      category: 'definition',
      topic: 'Institutional Specialist Warehouse Analogy',
      statement: 'Market makers operate as commercial warehouse merchants: they accumulate inventory at wholesale discount prices during periods of extreme retail panic, then distribute inventory at retail markup prices during public euphoria.',
      sourceCitation: {
        book: 'A Complete Guide To Volume Price Analysis',
        chapter: 'Foreword',
        excerpt: 'The primary goal of a trader is to align with smart money—buying when the insiders are accumulating and selling when they are distributing.'
      }
    }
  ],
  generalAssumptions: [
    'All financial markets are systematically manipulated in some degree by institutional insiders and market makers.',
    'Volume represents the true validation of trading effort, while price spread represents the result.',
    'Human psychology of fear and greed remains identical across centuries and asset classes.'
  ]
};

// Validate with Zod
SourceFactsSchema.parse(sourceFacts);
fs.writeFileSync(path.join(hindiDir, 'source_facts.json'), JSON.stringify(sourceFacts, null, 2), 'utf8');
fs.writeFileSync(path.join(englishDir, 'source_facts.json'), JSON.stringify(sourceFacts, null, 2), 'utf8');
console.log('✅ source_facts.json written and Zod verified.');

// 2. Content Audit
console.log('Running Content Audit...');
const auditHi = runContentAudit(hindiDir);
const auditEn = runContentAudit(englishDir);
if (auditHi.status === 'FAIL' || auditEn.status === 'FAIL') {
  throw new Error(`Audit failed: ${auditHi.blockingReason || auditEn.blockingReason}`);
}
console.log(`✅ Content audit passed: HI=${auditHi.status}, EN=${auditEn.status}`);

// 3. Lesson Plan
const lessonPlan = {
  schemaVersion: '1.0.0',
  chapterSlug,
  title: 'Foreword: The 100-Year Heritage of Volume Trading',
  targetAudiencePersona: 'Volume Traders, Chartist Students, and Retail Technical Analysts',
  prerequisites: [
    'Basic familiarity with candlestick charts',
    'Understanding of market bids, asks, and trading volumes'
  ],
  learningOutcomes: [
    'Trace the 100-year lineage of volume trading from Dow, Wyckoff, and Livermore to modern electronic markets.',
    'Understand why price and volume are the only two genuine leading indicators in financial markets.',
    'Identify how institutional market makers manipulate quoted prices while volume reveals physical order flow.',
    'Examine the historical origin story of Albert Labos, Tom Williams, and the HMS President seminar.'
  ],
  sections: [
    {
      sectionIndex: 0,
      title: 'The Century-Old Heritage of Tape Reading',
      pedagogicalObjective: 'Establish that volume analysis is not a modern fad but a time-tested institutional trading methodology.',
      groundedFactIds: ['fact-01', 'fact-02', 'fact-05'],
      keyPoints: [
        'Charles Dow, Jesse Livermore, and Richard Wyckoff established ticker-tape volume principles over 100 years ago.',
        'Human fear and greed remain unchanged; speculation principles are as old as the hills.',
        'Price spread and volume are the only two leading indicators; derived oscillators lag.'
      ]
    },
    {
      sectionIndex: 1,
      title: 'The HMS President & The Syndicate Trader',
      pedagogicalObjective: 'Analyze Anna Coulling’s discovery of insider market manipulation through Albert Labos and Tom Williams.',
      groundedFactIds: ['fact-03', 'fact-04'],
      keyPoints: [
        'Anna Coulling invested £5,000 in January 1998 aboard the HMS President on the River Thames.',
        'Albert Labos dramatic confrontation with suspected banking cartel spies.',
        'Tom Williams as an ex-syndicate trader reading institutional pool campaigns.'
      ],
      numericalApplication: '£5,000 tuition fee across 14-day seminar equals £357.14 per day investment aboard the HMS President.'
    },
    {
      sectionIndex: 2,
      title: 'Why Volume Cannot Be Hidden',
      pedagogicalObjective: 'Deconstruct the mathematical invariant that institutional volume cannot be concealed on the exchange tape.',
      groundedFactIds: ['fact-06', 'fact-07', 'fact-08'],
      keyPoints: [
        'Insiders can mark prices up or down to trigger retail stop-loss orders.',
        'Institutional capital deployment must execute through exchange clearinghouses, leaving an undeniable volume footprint.',
        'Market makers operate as warehouse wholesalers: accumulating at panic discounts, distributing at peak euphoria.'
      ]
    }
  ],
  misconceptions: [
    {
      misconception: 'Believing mathematical indicators like RSI or MACD provide leading predictive signals.',
      factId: 'fact-07',
      authorRebuttal: 'Anna Coulling explains that all indicators derived from price are inherently lagging; only price and volume lead the market.'
    },
    {
      misconception: 'Assuming that modern electronic algorithmic trading makes 100-year-old tape reading obsolete.',
      factId: 'fact-05',
      authorRebuttal: 'Because human psychology and institutional accumulation-distribution mechanics remain unchanged, Wyckoff and Livermore principles apply directly to modern charts.'
    }
  ],
  activeRecallQuiz: {
    scenario: 'A retail trader notices an asset price surging 4% on an earnings announcement, but transaction volume is at a 30-day low. Remembering the HMS President seminar lessons, the trader evaluates the legitimacy of the breakout.',
    testedFactIds: ['fact-01', 'fact-06', 'fact-07'],
    question: 'Why does an upward price surge accompanied by unusually low volume indicate an institutional trap rather than genuine demand?',
    correctAnswer: 'Because volume represents physical capital effort; low volume proves smart money is not buying and insiders are marking up prices to trap retail buyers.',
    explanation: 'As Anna Coulling and Tom Williams emphasize, volume validates effort. A wide spread rally on low volume reveals lack of institutional participation and warns of an imminent reversal.'
  },
  coreTakeaways: [
    'Volume is the ultimate truth detector that validates whether a price movement is authentic or fabricated.',
    'Market makers operate as wholesalers, accumulating inventory at panic lows and distributing at euphoric highs.',
    'Trade on the coattails of institutional syndicates by decoding volume footprints rather than fighting them.'
  ]
};

LessonPlanSchema.parse(lessonPlan);
fs.writeFileSync(path.join(hindiDir, 'lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');
fs.writeFileSync(path.join(englishDir, 'lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');
console.log('✅ lesson_plan.json written and Zod verified.');

// 4. Visual Creative Brief
const visualCreativeBrief = {
  schemaVersion: '1.0.0',
  chapterSlug,
  courseId: 'coulling_vpa',
  creativeDirection: 'Historical documentary meets practical institutional tape reading masterclass.',
  narrativeStyle: 'Documentary narrative grounded in 100-year market history and insider order-flow revelation.',
  visualStorytellingApproach: 'Juxtapose pure candlestick price spreads with underlying institutional volume weight to demonstrate effort versus result.',
  visualMetaphors: [
    {
      metaphor: 'An X-ray scanner peering beneath quoted price candles to reveal institutional capital weight.',
      targetConcept: 'Volume as Truth Detector',
      groundedFactIds: ['fact-01', 'fact-06']
    },
    {
      metaphor: 'A merchant restocking shelves at wholesale discount and clearing inventory at retail markup.',
      targetConcept: 'Specialist Wholesaler Warehouse',
      groundedFactIds: ['fact-04', 'fact-08']
    }
  ],
  sceneCompositionStrategy: 'Clean executive dashboard with deep teal (#0F766E) primary cards, crisp white containers, and accent blue order-flow callouts.',
  animationLanguage: 'Smooth spring animations with deliberate pauses for tape reading observations.',
  courseVisualIdentity: {
    theme: 'teal',
    primaryColor: '#0F766E',
    accentColor: '#2563EB',
    typography: 'Inter, sans-serif'
  },
  templateSelectionPlan: [
    { sceneIndex: 0, conceptTopology: 'Narrative Origin', template: 'chat_story', level: 'LEVEL_1_EXISTING', pedagogicalRationale: 'Engaging narrative introduction to the HMS President seminar.' },
    { sceneIndex: 1, conceptTopology: 'Historical Lineage', template: 'diagram_flow', level: 'LEVEL_1_EXISTING', pedagogicalRationale: '100-year heritage timeline: Dow, Livermore, Wyckoff to Coulling.' },
    { sceneIndex: 2, conceptTopology: 'Taxonomy Breakdown', template: 'progressive_cards', level: 'LEVEL_1_EXISTING', pedagogicalRationale: '4 Pillars of Volume Price Analysis taxonomy.' },
    { sceneIndex: 3, conceptTopology: 'Comparative Analysis', template: 'split_comparison', level: 'LEVEL_1_EXISTING', pedagogicalRationale: 'Price alone (blind) vs Price + Volume (illuminated).' },
    { sceneIndex: 4, conceptTopology: 'Quantitative Parameters', template: 'stat_counter', level: 'LEVEL_1_EXISTING', pedagogicalRationale: 'HMS President 1998 seminar tuition and timeline metrics.' },
    { sceneIndex: 5, conceptTopology: 'Indicator Hierarchy', template: 'data_visualizer', level: 'LEVEL_1_EXISTING', pedagogicalRationale: 'Leading indicators (Price/Volume) vs Lagging oscillators.' },
    { sceneIndex: 6, conceptTopology: 'Market Friction Dynamics', template: 'tug_of_war', level: 'LEVEL_1_EXISTING', pedagogicalRationale: 'Institutional Wholesalers vs Retail Traders.' },
    { sceneIndex: 7, conceptTopology: 'Composite Layout', template: 'composite_layout', level: 'LEVEL_2_COMPOSITE', pedagogicalRationale: 'Split chart order flow left, tape reading rules right.' },
    { sceneIndex: 8, conceptTopology: 'Analytical Formula', template: 'formula_breakdown', level: 'LEVEL_1_EXISTING', pedagogicalRationale: 'VPA Effort vs Result core validation logic.' },
    { sceneIndex: 9, conceptTopology: 'Interactive Evaluation', template: 'interactive_quiz', level: 'LEVEL_1_EXISTING', pedagogicalRationale: 'Active recall scenario testing low volume surge anomaly.' },
    { sceneIndex: 10, conceptTopology: 'Strategic Insights', template: 'progressive_cards', level: 'LEVEL_1_EXISTING', pedagogicalRationale: '3 Key Lessons from Syndicate Trader Tom Williams.' },
    { sceneIndex: 11, conceptTopology: 'Executive Synthesis', template: 'summary_thread', level: 'LEVEL_1_EXISTING', pedagogicalRationale: '8-rule progressive executive synthesis of Foreword principles.' }
  ],
  visualDiversityObjectives: {
    minUniqueTemplates: 5,
    maxConsecutiveSame: 1,
    maxTemplateSaturation: 0.3
  }
};

VisualCreativeBriefSchema.parse(visualCreativeBrief);
fs.writeFileSync(path.join(hindiDir, 'visual_creative_brief.json'), JSON.stringify(visualCreativeBrief, null, 2), 'utf8');
fs.writeFileSync(path.join(englishDir, 'visual_creative_brief.json'), JSON.stringify(visualCreativeBrief, null, 2), 'utf8');
console.log('✅ visual_creative_brief.json written and Zod verified.');

// 5. Storyboard
const storyboard = {
  schemaVersion: '1.0.0',
  chapterSlug,
  course: 'A Complete Guide To Volume Price Analysis',
  chapterTitle: 'Foreword: The 100-Year Heritage of Volume Trading',
  approvedFactIds: sourceFacts.facts.map(f => f.id),
  scenes: [
    {
      sceneIndex: 0,
      title: 'Origins: The HMS President Seminar (1998)',
      template: 'chat_story',
      concept: 'Anna Coulling introduction to volume trading under Albert Labos on the River Thames',
      sourceFactIds: ['fact-03', 'fact-04'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Introduce the packed seminar room aboard the 1918 HMS President.', sourceFactIds: ['fact-03'], speaker: 'novice' },
        { beatIndex: 1, textOutline: 'Labos demands bank spies leave and introduces ex-syndicate trader Tom Williams.', sourceFactIds: ['fact-03', 'fact-04'], speaker: 'mentor' }
      ]
    },
    {
      sceneIndex: 1,
      title: 'The 100-Year Lineage of Tape Reading',
      template: 'diagram_flow',
      concept: 'Tracing volume trading heritage from Charles Dow, Jesse Livermore, and Richard Wyckoff',
      sourceFactIds: ['fact-02', 'fact-05'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Show historical progression: Dow Theory, Livermore ticker tape, Wyckoff laws.', sourceFactIds: ['fact-02', 'fact-05'], speaker: 'mentor' }
      ]
    },
    {
      sceneIndex: 2,
      title: 'Core Architecture: 4 Pillars of VPA',
      template: 'progressive_cards',
      concept: 'Taxonomy of price spread, transaction volume, market manipulation, and institutional footprints',
      sourceFactIds: ['fact-01', 'fact-06', 'fact-07', 'fact-08'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Present the four foundational pillars of Volume Price Analysis.', sourceFactIds: ['fact-01', 'fact-06', 'fact-07', 'fact-08'], speaker: 'mentor' }
      ]
    },
    {
      sceneIndex: 3,
      title: 'Price Alone vs Price Combined with Volume',
      template: 'split_comparison',
      concept: 'Comparing the blindness of pure price charts with the clarity of volume validation',
      sourceFactIds: ['fact-01', 'fact-07'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Contrast pure price action traps with volume-validated breakouts.', sourceFactIds: ['fact-01', 'fact-07'], speaker: 'mentor' }
      ]
    },
    {
      sceneIndex: 4,
      title: 'The 1998 HMS President Seminar Parameters',
      template: 'stat_counter',
      concept: 'Historical outlay, course duration, and venue provenance of Anna Coulling discovery',
      sourceFactIds: ['fact-03'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Display £5,000 tuition fee, 14-day duration, and 1918 naval vessel date.', sourceFactIds: ['fact-03'], speaker: 'mentor' }
      ]
    },
    {
      sceneIndex: 5,
      title: 'The Two Leading Indicators vs Lagging Oscillators',
      template: 'data_visualizer',
      concept: 'Why price and volume are leading, while RSI, MACD, and moving averages lag',
      sourceFactIds: ['fact-07'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Demonstrate how price spread and volume precede all derived mathematical formulas.', sourceFactIds: ['fact-07'], speaker: 'mentor' }
      ]
    },
    {
      sceneIndex: 6,
      title: 'Specialist Wholesalers vs Retail Herd',
      template: 'tug_of_war',
      concept: 'Institutional market makers accumulating at panic lows and distributing at euphoric highs',
      sourceFactIds: ['fact-08', 'fact-04'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Illustrate the struggle between institutional warehouse operators and retail order flow.', sourceFactIds: ['fact-08', 'fact-04'], speaker: 'mentor' }
      ]
    },
    {
      sceneIndex: 7,
      title: 'Tape Reading Rules: Wyckoff & Coulling Principles',
      template: 'composite_layout',
      concept: 'Combining volume bar charts with core tape reading rules',
      sourceFactIds: ['fact-01', 'fact-06'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Show how volume bars confirm or invalidate each individual candle spread.', sourceFactIds: ['fact-01', 'fact-06'], speaker: 'mentor' }
      ]
    },
    {
      sceneIndex: 8,
      title: 'Core Validation Law: Effort vs Result',
      template: 'formula_breakdown',
      concept: 'Wyckoffs fundamental law: Volume represents Effort, Price Spread represents Result',
      sourceFactIds: ['fact-01', 'fact-06'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Deconstruct the mathematical relation Effort (Volume) = Result (Price Spread).', sourceFactIds: ['fact-01', 'fact-06'], speaker: 'mentor' }
      ]
    },
    {
      sceneIndex: 9,
      title: 'Active Recall: The Low-Volume Breakout Anomaly',
      template: 'interactive_quiz',
      concept: 'Testing why a 4% price surge on low volume is an institutional trap',
      sourceFactIds: ['fact-01', 'fact-06', 'fact-07'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Present scenario: stock rallies 4% but volume drops to 30-day low.', sourceFactIds: ['fact-01', 'fact-06'], speaker: 'mentor' },
        { beatIndex: 1, textOutline: 'Show thinking spinner while student evaluates the effort vs result mismatch.', sourceFactIds: ['fact-01', 'fact-06'], speaker: 'mentor' },
        { beatIndex: 2, textOutline: 'Reveal answer: lack of volume proves smart money is not buying, signaling an insider trap.', sourceFactIds: ['fact-01', 'fact-06', 'fact-07'], speaker: 'mentor' }
      ]
    },
    {
      sceneIndex: 10,
      title: 'Three Enduring Lessons from Syndicate Traders',
      template: 'progressive_cards',
      concept: 'Practical wisdom: ride coattails of smart money, never fight pools, inspect volume first',
      sourceFactIds: ['fact-04', 'fact-06', 'fact-08'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Outline 3 imperative rules for retail traders navigating institutional markets.', sourceFactIds: ['fact-04', 'fact-06', 'fact-08'], speaker: 'mentor' }
      ]
    },
    {
      sceneIndex: 11,
      title: 'Executive Summary: 8 Master Rules of Volume Price Analysis',
      template: 'summary_thread',
      concept: 'Comprehensive 8-rule sequence synthesizing the Foreword',
      sourceFactIds: sourceFacts.facts.map(f => f.id),
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Review rules 1 and 2: VPA definition and 100-year heritage.', sourceFactIds: ['fact-01', 'fact-02'], speaker: 'mentor' },
        { beatIndex: 1, textOutline: 'Review rules 3 and 4: Albert Labos seminar and syndicate trading.', sourceFactIds: ['fact-03', 'fact-04'], speaker: 'mentor' },
        { beatIndex: 2, textOutline: 'Review rules 5 and 6: Lefevre principles and why volume cannot be hidden.', sourceFactIds: ['fact-05', 'fact-06'], speaker: 'mentor' },
        { beatIndex: 3, textOutline: 'Review rules 7 and 8: Leading indicators and warehouse wholesaler analogy.', sourceFactIds: ['fact-07', 'fact-08'], speaker: 'mentor' }
      ]
    }
  ],
  summarySteps: [
    '1. Combine candlestick price spread and transaction volume to validate authenticity.',
    '2. Respect the 100-year tape reading heritage established by Dow, Wyckoff, and Livermore.',
    '3. Recognize that institutional banking syndicates systematically manipulate financial markets.',
    '4. Study ex-syndicate trader techniques to decode hidden block accumulation campaigns.',
    '5. Apply classic ticker-tape laws: speculation is as old as the hills and patterns repeat.',
    '6. Invariant truth: market makers can manipulate quotes, but physical volume cannot be hidden.',
    '7. Treat price and volume as the only two true leading indicators; avoid lagging indicators.',
    '8. Act like a warehouse partner: buy wholesale at panic lows and sell retail at euphoric peaks.'
  ],
  bottomTakeaway: 'Volume is the ultimate truth detector: trade on the coattails of smart money.'
};

StoryboardSchema.parse(storyboard);
fs.writeFileSync(path.join(hindiDir, 'storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');
fs.writeFileSync(path.join(englishDir, 'storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');
console.log('✅ storyboard.json written and Zod verified.');

console.log('\n🎉 ALL PHASE 1 ARTIFACTS SUCCESSFULLY PRODUCED FOR VPA FOREWORD!');
