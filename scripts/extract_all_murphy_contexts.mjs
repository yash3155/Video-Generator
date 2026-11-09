// scripts/extract_all_murphy_contexts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const notebookId = '37f192bf-8225-4ea5-a8d0-3b3a19c18fd9'; // Technical Analysis - Murphy notebook
const sourceId = 'b65495a2-bb39-47a7-98ce-00b7ce1096bf';   // Murphy Technical analysis book.pdf

export const murphyChapters = [
  {
    key: 'ch01_part1',
    cleanTitle: 'Philosophy of Technical Analysis: The Three Premises & Timing',
    directive: 'Market Action Discounts Everything, Prices Move in Trends, History Repeats Itself, and Technical vs. Fundamental Forecasting and Timing'
  },
  {
    key: 'ch01_part2',
    cleanTitle: 'Philosophy: Flexibility, Chartist vs. Technician & Criticisms',
    directive: 'Flexibility Across Markets and Timeframes, Chartist vs. Statistical Technician, Stocks vs. Futures (Leverage & Timing), Self-Fulfilling Prophecy, and Random Walk Theory'
  },
  {
    key: 'ch02_part1',
    cleanTitle: 'Dow Theory: The 6 Basic Tenets & 3 Trend Classifications',
    directive: "Charles Dow's background, the 6 Basic Tenets of Dow Theory, Tide/Wave/Ripple (Primary, Secondary, Minor trends), and the 3 Phases of Major Trends (Accumulation, Public Participation, Distribution)"
  },
  {
    key: 'ch02_part2',
    cleanTitle: 'Dow Theory: Confirmation, Failure Swings & Criticisms',
    directive: 'Averages Confirming Each Other, Volume Confirmation, Failure Swings vs. Nonfailure Swings, Closing Prices, and Criticisms of Dow Theory (capturing the middle 68% of moves)'
  },
  {
    key: 'ch03_part1',
    cleanTitle: 'Chart Construction: Chart Types, Scales, Volume & Open Interest',
    directive: 'Bar, Line, Point & Figure, and Candlestick charts, Arithmetic vs. Logarithmic Scaling, Daily/Weekly/Monthly Bar Charts, and plotting Volume and Futures Open Interest'
  },
  {
    key: 'ch04_part1',
    cleanTitle: 'Basic Concepts of Trend: Directions, Support & Resistance Psychology',
    directive: 'Definition of Trend, Three Directions (Up, Down, Sideways/Trendless), Three Classifications, Support and Resistance Psychology, Role Reversal (Support becoming Resistance), and Round Numbers'
  },
  {
    key: 'ch04_part2',
    cleanTitle: 'Trendlines, Channels & The Fan Principle',
    directive: 'Drawing Tentative vs. Valid Trendlines, Price and Time Filters (3% and 2-Day Rule), Trendline Role Reversal, The Fan Principle, Importance of Number Three, 45-Degree Steepness, and Channel Lines'
  },
  {
    key: 'ch04_part3',
    cleanTitle: 'Retracements, Speedlines, Reversal Days & Price Gaps',
    directive: 'Percentage Retracements (50%, 33%, 66% and Fibonacci 38%/62%), Speed Resistance Lines, Gann/Fibonacci Fan Lines, Key Reversal Days (Selling Climaxes), and the 3 Types of Price Gaps (Breakaway, Runaway, Exhaustion, and Island Reversals)'
  },
  {
    key: 'ch05_part1',
    cleanTitle: 'Major Reversal Patterns: Rules & Head and Shoulders',
    directive: 'Reversal vs. Continuation Patterns, 6 Preliminary Rules Common to All Reversals, Head and Shoulders Top, Neckline Breaks, Return Moves, Volume Sequence, Price Objectives, and Inverse Head and Shoulders Bottoms'
  },
  {
    key: 'ch05_part2',
    cleanTitle: 'Reversal Patterns: Triple/Double Tops & Bottoms, Saucers & Spikes',
    directive: 'Complex and Failed Head and Shoulders, Triple Tops and Bottoms, Double Tops (M) and Double Bottoms (W), Bull Traps/False Breakouts, Normal Pullbacks vs. Double Tops, Saucers, and V-Spike Reversals'
  },
  {
    key: 'ch06_part1',
    cleanTitle: 'Continuation Patterns: Triangles & Broadening Formations',
    directive: 'Symmetrical, Ascending, and Descending Triangles, the 2/3 to 3/4 Apex Time Limit Rule, Volume Contraction and Breakout Expansion, Measuring Techniques, and the Broadening (Megaphone) Formation'
  },
  {
    key: 'ch06_part2',
    cleanTitle: 'Continuation Patterns: Flags, Pennants, Wedges & Rectangles',
    directive: "Flags and Pennants ('flying at half-mast'), Rising and Falling Wedges, Rectangle Trading Ranges, the Measured Move (Swing Measurement), Continuation Head and Shoulders, and Confirmation vs. Divergence"
  },
  {
    key: 'ch07_part1',
    cleanTitle: 'Volume and Open Interest: Rules, OBV & Divergences',
    directive: "Price, Volume, and Open Interest hierarchy, Volume Confirming Price Trends, 'Volume Precedes Price', On Balance Volume (OBV), OBV Divergences, and OBV variations"
  },
  {
    key: 'ch07_part2',
    cleanTitle: 'Open Interest Mechanics: COT Report & Put/Call Ratios',
    directive: 'How Changes in Open Interest Occur (4 Buyer/Seller scenarios), the 4 Rules of Price + Open Interest (New Buying vs. Short Covering), Blowoffs and Selling Climaxes, Commitments of Traders (COT) Report, Watching the Commercials, and Options Put/Call Ratios'
  },
  {
    key: 'ch08_part1',
    cleanTitle: 'Long Term Charts: Weekly/Monthly Perspective & Continuation Charts',
    directive: 'the Importance of Longer Range Perspective, Constructing Continuation Charts for Futures, Weekly and Monthly Reversals, Top-Down Chart Analysis (Long Term to Short Term), and Inflation Adjustments'
  },
  {
    key: 'ch09_part1',
    cleanTitle: 'Moving Averages: SMA, EMA, Crossover Systems & Time Lag',
    directive: 'Moving Averages as a Smoothing Device with Time Lag, Simple vs. Exponential Moving Averages, Single and Double Crossover Systems, the 50 and 200-Day Averages, and Price/Time Filters'
  },
  {
    key: 'ch09_part2',
    cleanTitle: 'Envelopes, Bollinger Bands & The Weekly Rule',
    directive: "Moving Average Envelopes, Bollinger Bands (Using Bands as Targets and Band Width for Volatility), Fibonacci Moving Averages, Donchian's 4-Week Rule, Optimization pitfalls, and the Adaptive Moving Average (KAMA)"
  },
  {
    key: 'ch10_part1',
    cleanTitle: 'Oscillators: Momentum, ROC, CCI & RSI',
    directive: 'Oscillator Usage in Conjunction with Trend, Measuring Momentum and Rate of Change (ROC), Commodity Channel Index (CCI), Relative Strength Index (RSI), 70/30 Overbought-Oversold Lines, Failure Swings, and RSI Divergences'
  },
  {
    key: 'ch10_part2',
    cleanTitle: 'Oscillators: Stochastics, MACD & Contrary Opinion',
    directive: 'Stochastics (%K and %D), Larry Williams %R, When Oscillators are Most Useful, MACD and MACD Histogram, Combining Weeklies and Dailies, and the Principle of Contrary Opinion & Investor Sentiment Readings'
  },
  {
    key: 'ch11_part1',
    cleanTitle: 'Point and Figure Charting: X and O Columns, Box Size & 3-Box Reversal',
    directive: 'Point and Figure vs. Bar Charts, Constructing Intraday P&F Charts (X and O columns), The Horizontal Count for Price Targets, P&F Price Patterns, and 3-Box Reversal Charting with 45-Degree Trendlines'
  },
  {
    key: 'ch12_part1',
    cleanTitle: 'Japanese Candlesticks: Candle Lines, Reversal & Continuation Patterns',
    directive: 'Basic Candlesticks (Real Body and Shadows), Doji, Hammer, Hanging Man, Bullish/Bearish Engulfing, Dark Cloud Cover, Piercing Line, Morning/Evening Star, and Filtered Candle Patterns combined with Western indicators'
  },
  {
    key: 'ch13_part1',
    cleanTitle: 'Elliott Wave Theory: 5-Wave Impulse, 3-Wave Corrections & Alternation',
    directive: 'Basic Tenets of the Elliott Wave Principle (5 Impulse Waves and 3 Corrective A-B-C Waves), Connection Between Elliott Wave and Dow Theory, Corrective Wave Types (Zigzags, Flats, Triangles), Rule of Alternation, Channeling, and Wave 4 as Support'
  },
  {
    key: 'ch13_part2',
    cleanTitle: 'Elliott Wave: Fibonacci Numbers, Ratios & Time Targets',
    directive: 'Fibonacci Numbers as the Basis of Elliott Wave, Golden Ratio Retracements (38.2%, 50%, 61.8%), Fibonacci Wave Targets, Fibonacci Time Targets, and Combining Pattern, Ratio, and Time'
  },
  {
    key: 'ch14_part1',
    cleanTitle: 'Time Cycles: Cycle Principles, Dominant Cycles & Translation',
    directive: 'Basic Cycle Concepts (Amplitude, Period, Phase), Principles of Summation, Harmonicity, Synchronicity, and Proportionality, Dominant Cycles, Left and Right Translation, and Seasonal/Stock Market Cycles (January Barometer & Presidential Cycle)'
  },
  {
    key: 'ch15_part1',
    cleanTitle: 'Computers and Trading Systems: Parabolic SAR, ADX & Mechanical Models',
    directive: "Grouping Technical Tools, Welles Wilder's Parabolic SAR and Directional Movement System (ADX, +DI, -DI), Pros and Cons of Mechanical System Trading, and Designing/Testing Systems"
  },
  {
    key: 'ch16_part1',
    cleanTitle: 'Money Management: Risk Rules, Reward-to-Risk & Preservation',
    directive: 'the Three Elements of Successful Trading (Price Forecasting, Timing, Money Management), Capital Preservation Rules, Reward-to-Risk Ratios (minimum 3-to-1), Trending vs. Trading Units, and Handling Winning/Losing Streaks'
  },
  {
    key: 'ch16_part2',
    cleanTitle: 'Trading Tactics: Order Types, Stop Losses & Intraday Pivot Points',
    directive: 'Trading Tactics (Anticipating vs. Waiting for Breakouts), Placing Protective Stops, Types of Trading Orders (Market, Limit, Stop, Stop-Limit, M.I.T.), Intraday Pivot Points, and Summary of Money Management Guidelines'
  },
  {
    key: 'ch17_part1',
    cleanTitle: 'Intermarket Analysis: Bonds, Stocks, Commodities & Currencies',
    directive: 'Intermarket Analysis principles, the Link Between Bonds and Stocks, the Inverse Link Between Commodities and Bonds, the Link Between the Dollar and Commodities/Gold, and Deflation Scenarios'
  },
  {
    key: 'ch17_part2',
    cleanTitle: 'Intermarket Analysis: Relative Strength & Top-Down Sector Rotation',
    directive: 'Stock Sectors and Industry Groups, Relative Strength Analysis (Ratio Charts), Top-Down Market Approach (Market -> Sector -> Individual Stock), and Intermarket Correlation'
  },
  {
    key: 'ch18_part1',
    cleanTitle: 'Stock Market Indicators: Market Breadth, AD Line, McClellan & TRIN',
    directive: 'Measuring Market Breadth, Advance-Decline (AD) Line and AD Divergence, McClellan Oscillator and Summation Index, New Highs vs. New Lows Index, Upside vs. Downside Volume, Arms Index (TRIN), and Equivolume/Candlepower Charting'
  },
  {
    key: 'ch19_part1',
    cleanTitle: "Technical Checklist: Murphy's 20-Point Rules & Coordination",
    directive: "Murphy's 20-Point Technical Checklist, How to Coordinate Technical and Fundamental Analysis, Chartered Market Technician (CMT), and Final Course Summary"
  },
  {
    key: 'appendix_ab',
    cleanTitle: 'Advanced Indicators & Market Profile (Appendices A & B)',
    directive: 'Demand Index (DI), Herrick Payoff Index (HPI), STARC Bands, Keltner Channels, and Market Profile (Bell Curve Value Area and Time Price Opportunities)'
  },
  {
    key: 'appendix_cd',
    cleanTitle: 'Trading System Design & Continuous Futures (Appendices C & D)',
    directive: 'the 5-Step Plan for Building and Testing an Objective Trading System and Continuous Futures Contracts'
  }
];

export async function extractOneMurphy(item, index, total) {
  const { key, directive } = item;
  const hiDir = path.join(rootDir, 'src', 'data', 'chapters', 'murphy_technical_analysis', key);
  const enDir = path.join(rootDir, 'src', 'data', 'chapters', 'murphy_technical_analysis_en', key);

  fs.mkdirSync(hiDir, { recursive: true });
  fs.mkdirSync(enDir, { recursive: true });

  const hiContextPath = path.join(hiDir, 'notebook_context.txt');
  const enContextPath = path.join(enDir, 'notebook_context.txt');

  if (fs.existsSync(hiContextPath) && fs.statSync(hiContextPath).size > 300) {
    console.log(`[${index + 1}/${total}] ⏩ Existing authoritative context found for ${key} (${fs.statSync(hiContextPath).size} bytes)`);
    if (!fs.existsSync(enContextPath)) {
      fs.copyFileSync(hiContextPath, enContextPath);
    }
    return;
  }

  console.log(`[${index + 1}/${total}] 📖 Querying NotebookLM for Murphy ${key}...`);
  console.log(`   Directive: ${directive}`);

  const queryPrompt = `Extract from John J. Murphy's Technical Analysis of the Financial Markets: all core concepts, definitions, mathematical formulas (with variables and definitions), chart patterns, confirmation rules, trading rules, and author case studies for: ${directive}`;
  const queryCmd = `nlm query notebook ${notebookId} "${queryPrompt.replace(/"/g, '\\"')}" --source-ids ${sourceId} --new-conversation --json`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      if (attempt > 1) console.log(`   🔄 Retry attempt ${attempt}/3 for ${key}...`);
      const rawOut = execSync(queryCmd, {
        encoding: 'utf8',
        maxBuffer: 25 * 1024 * 1024,
        timeout: 240000
      });

      let contextText = '';
      try {
        const parsed = JSON.parse(rawOut);
        contextText = parsed.answer || rawOut;
        if (parsed.references && Array.isArray(parsed.references)) {
          contextText += '\n\n### Direct Citations from Book Sources:\n';
          for (const ref of parsed.references) {
            if (ref.cited_text) {
              contextText += `- "${ref.cited_text}"\n`;
            }
          }
        }
      } catch {
        contextText = rawOut;
      }

      fs.writeFileSync(hiContextPath, contextText, 'utf8');
      fs.writeFileSync(enContextPath, contextText, 'utf8');
      console.log(`   ✅ Saved ${contextText.length} chars to ${key}/notebook_context.txt\n`);
      return;
    } catch (err) {
      console.error(`   ⚠️ Attempt ${attempt} failed for ${key}:`, err.message);
      if (attempt === 3) {
        console.error(`   ❌ Failed after 3 attempts on ${key}`);
      } else {
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  let targets = murphyChapters;
  if (args.length > 0 && !args[0].startsWith('--')) {
    targets = murphyChapters.filter(c => args.includes(c.key));
  }

  console.log(`\n======================================================`);
  console.log(`📚 EXTRACTING ALL NOTEBOOKLM CONTEXTS FOR MURPHY`);
  console.log(`   Total Chapters: ${targets.length}`);
  console.log(`   Notebook ID: ${notebookId}`);
  console.log(`   Source ID: ${sourceId}`);
  console.log(`======================================================\n`);

  for (let i = 0; i < targets.length; i++) {
    await extractOneMurphy(targets[i], i, targets.length);
  }

  console.log(`\n🎉 ALL ${targets.length} MURPHY NOTEBOOK CONTEXTS PROCESSED!\n`);
}

if (process.argv[1] === import.meta.filename) {
  main().catch(console.error);
}

