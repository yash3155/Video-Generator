import fs from 'fs';
import path from 'path';

const srcDir = 'src/data/chapters/hull_derivatives/ch01_part2';
const targetDir = 'src/data/chapters/hull_derivatives_en/ch01_part2';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy Phase 1 artifacts
['source_facts.json', 'content_audit.json', 'lesson_plan.json', 'storyboard.json'].forEach(f => {
  const sPath = path.join(srcDir, f);
  const tPath = path.join(targetDir, f);
  if (fs.existsSync(sPath)) {
    fs.copyFileSync(sPath, tPath);
    console.log(`Copied ${f} to ${targetDir}`);
  }
});

// Load raw Hindi episode
const hindiEp = JSON.parse(fs.readFileSync(path.join(srcDir, 'episode_raw.json'), 'utf8'));

// High-fidelity spoken English narrations for all 41 beats
const enNarrations = {
  // Scene 0: Riskless Arbitrage Illusion
  b01: "Raju excitedly tells Sharma ji that selling a Google $525 put option gives him $2,240 instant upfront cash, believing it's free money just like big bank arbitrage desks.",
  b02: "Sharma ji cautions him immediately: if Google's stock drops to $480, Raju is obligated to buy at $525, suffering an immediate net loss of $2,260 after accounting for the premium.",
  b03: "Sharma ji reminds him of Jerome Kerviel at Societe Generale, who started on an arbitrage desk but ended up hiding massive unhedged directional bets.",

  // Scene 1: Kerviel's €4.9B Rogue Unwind
  b04: "In January 2008, unwinding Jerome Kerviel's unauthorized €50 Billion futures position over three market days cost Societe Generale an unprecedented €4.9 Billion.",
  b05: "This echoed earlier disasters: Nick Leeson losing over $1 Billion at Barings Bank in 1995, and John Rusnak losing $700 Million at Allied Irish Bank in 2002.",
  b06: "The universal lesson for every trader and institution is clear: enforce unambiguous risk limits and monitor daily mark-to-market positions without exception.",

  // Scene 2: 4-Pillar Chapter Roadmap
  b07: "In this lesson, we explore four foundational pillars. Pillar 1: Call and Put options mechanics, strike prices, expiration dates, premiums, and exercise styles.",
  b08: "Pillar 2: The three market participants—Hedgers eliminating commercial risk, Speculators taking calculated directional bets, and Arbitrageurs exploiting mispricings.",
  b09: "Pillar 3: The crucial difference in leverage—futures margin accounts carry unlimited loss potential, whereas option buyers strictly cap risk at the upfront premium.",
  b10: "And Pillar 4: The $2 Trillion hedge fund industry, the two-and-twenty fee structure, six major trading strategies, and essential rogue-trading risk controls.",

  // Scene 3: Options vs Futures & Strike Dynamics
  b11: "A futures contract is an obligation for both buyer and seller entered with zero upfront cost. An option contract grants the buyer a right without obligation, purchased with an upfront premium.",
  b12: "A call option gives the right to buy; a put option gives the right to sell. European options can only be exercised at maturity, whereas American options can be exercised at any time up to expiration.",
  b13: "For call options, a higher strike price decreases value, while for put options, a higher strike increases value. For both types, longer expiration periods provide more time value and increase the premium.",

  // Scene 4: CBOE Google Options: Payoff vs Profit
  b14: "Let us examine John Hull's Google example from the Chicago Board Options Exchange. Buying one December $550 Call at $29 per share costs $2,900 upfront, completely capping your maximum loss.",
  b15: "If Google rises to $650 at expiration, the 100-share call delivers a $10,000 gross payoff. Subtracting the $2,900 upfront premium leaves a clean net profit of $7,100.",
  b16: "Conversely, writing a September $525 Put collects $2,240 immediately. But if Google drops to $480, you must buy shares worth $48,000 for $52,500, suffering a severe $2,260 net loss.",

  // Scene 5: Hedgers: Forwards vs Option Insurance
  b17: "Commercial hedgers choose between forwards and options based on cost and flexibility. Recall ImportCo locking £10 Million forward at $15.742 Million, and ExportCo locking £30 Million at $47.208 Million.",
  b18: "Forward contracts eliminate exchange rate risk entirely: they guarantee the final transaction price, but also eliminate any benefit from favorable market moves.",
  b19: "In contrast, buying 10 July $27.50 puts on a $28 stock for $1,000 locks in a minimum floor of $26,500, preserving complete upside if the stock rallies.",

  // Scene 6: Speculators: Futures vs Options Leverage
  b20: "Speculators use leverage to amplify capital returns. Buying £250,000 spot requires $386,750 in cash, whereas controlling the same exposure requires just $20,000 margin across 4 CME futures.",
  b21: "Consider John Hull's Table 1.5: investing $2,000 in two-month $22.50 calls nets $7,000 profit if the stock rises to $27—ten times the $700 return from buying 100 shares directly!",
  b22: "However, leverage cuts both ways. If the stock falls to $15, stock investors lose $500 or 25%, while option holders lose 100% of their $2,000 capital as options expire worthless.",

  // Scene 7: Arbitrageurs: Cross-Border Equilibrium
  b23: "Arbitrageurs lock in riskless profit by exploiting price discrepancies across segmented markets. Consider a dual-listed stock trading at $152 in New York and £100 in London with FX at $1.5500 per pound.",
  b24: "Converting £100 at $1.55 gives $155. Buying 100 shares in New York for $15,200 and simultaneously selling in London for $15,500 locks in an instant risk-free profit of $300.",
  b25: "Because arbitrageurs aggressively exploit these price differences, simultaneous buying in New York and selling in London rapidly restores cross-border price equilibrium.",

  // Scene 8: Hedge Fund '2-and-20' & 6 Strategies
  b26: "Hedge funds manage over $2 Trillion globally without public mutual fund investment limits. They traditionally charge a 2% management fee on assets and 20% incentive fee on net profits.",
  b27: "Core strategies include Long-Short Equity, pairing undervalued long stocks with short overvalued peers, and Convertible Arbitrage, taking long positions in convertible bonds hedged by short equity.",
  b28: "Distressed Securities funds buy deeply discounted debt of troubled companies restructuring out of bankruptcy, while Merger Arbitrage buys target shares while shorting the acquirer.",
  b29: "Emerging Markets funds target debt and equities in developing economies, while Global Macro funds take multi-billion dollar directional bets on interest rates, currencies, and global trade flows.",

  // Scene 9: Active Recall: Options Leverage Math
  b30: "Test your mastery: A trader with $2,000 capital can either buy 100 shares at $20 or 2,000 two-month $22.50 call options at $1. What are the net profits if the stock finishes at $27 or falls to $15?",
  b31: "Raju reasons: At $27, the call option payoff is $4.50. Multiplying 2,000 options gives $9,000 gross payoff. Subtracting the $2,000 premium leaves $7,000 net profit!",
  b32: "Spot on! At $27, call options return $7,000 net profit—ten times the $700 profit on shares. But at $15, the calls expire worthless for a total 100% loss of $2,000, while shares lose only $500.",

  // Scene 10: Trader's Execution & Risk Checklist
  b33: "Raju realizes that collecting upfront cash on short options carries dangerous tail risk: selling the $525 put still produced a $2,260 loss when Google dropped to $480.",
  b34: "For absolute price certainty, choose forward contracts to fix exact cash flows; for price insurance with upside potential, purchase put options.",
  b35: "Sharma ji concludes with the golden rule of Wall Street: always enforce independent risk controls and verify trading positions daily to prevent catastrophic rogue-trading losses.",

  // Scene 11: Master Blueprint: 8 Core Principles
  b36: "Let us review the eight core principles and market mechanisms mastered in Chapter 1 Part 2.",
  b37: "First and second: Options confer rights for an upfront premium, and higher strikes lower call prices while raising put values.",
  b38: "Third and fourth: Google option payoffs highlight capped buyer downside, while forwards fix payments and puts act as price insurance.",
  b39: "Fifth and sixth: Options leverage multiplies upside ten-fold but risks total capital loss, while arbitrageurs rapidly enforce price equilibrium.",
  b40: "Seventh and eighth: Hedge funds employ specialized 2-and-20 strategies, and strict daily risk limits are non-negotiable to prevent rogue collapses.",
  b41: "This concludes Chapter 1. Master option premiums, balance leverage risks, and maintain strict trading discipline. See you in Chapter 2!"
};

// Subtitles <= 16 words
const enSubtitles = {
  b01: "Raju boasts selling a $525 put gives $2,240 instant cash, like riskless arbitrage desks.",
  b02: "Sharma ji warns if Google drops to $480, buying at $525 causes a $2,260 net loss.",
  b03: "Sharma ji recalls Jerome Kerviel faking hedges on Societe Generale's arbitrage desk.",
  b04: "Unwinding Kerviel's unhedged positions over 3 days in Jan 2008 cost €4.9B ($7.2B).",
  b05: "Earlier rogue losses: Nick Leeson ($1B at Barings, 1995) and John Rusnak ($700M, 2002).",
  b06: "Core lesson: enforce unambiguous risk limits and monitor trading activity daily.",
  b07: "Pillar 1: Call and Put mechanics, strike, expiry, premium, and exercise styles.",
  b08: "Pillar 2: Hedgers eliminate risk, Speculators bet on direction, Arbitrageurs lock profit.",
  b09: "Pillar 3: Futures margin carries unlimited risk; option buyers cap loss at premium.",
  b10: "Pillar 4: $2T+ hedge fund 2-and-20 model, 6 strategies, and rogue risk controls.",
  b11: "Futures obligate both sides at zero upfront fee; options grant rights for a premium.",
  b12: "Calls buy, puts sell; European exercises at maturity, American exercises anytime.",
  b13: "Higher strike lowers call value and raises put value; longer maturity raises both.",
  b14: "Buying 1 Google Dec $550 Call at $29 costs $2,900 upfront, capping max loss at $2,900.",
  b15: "At $650 stock price, $10,000 gross payoff minus $2,900 premium yields $7,100 net profit.",
  b16: "Writing Sept $525 Put brings $2,240 cash, but dropping to $480 causes a $2,260 net loss.",
  b17: "ImportCo locks £10M forward at $15.742M; ExportCo locks £30M forward at $47.208M.",
  b18: "Forward hedging neutralizes risk completely, removing both downside loss and upside gain.",
  b19: "Buying 10 July $27.50 puts for $1,000 locks a $26,500 net floor while keeping all upside.",
  b20: "Buying £250k spot takes $386,750 cash vs only $20,000 margin for 4 CME futures.",
  b21: "On $2,000 capital, 2,000 calls ($22.50 strike) net $7,000 at $27 vs $700 on 100 shares.",
  b22: "If the stock drops to $15, shares lose $500 (25%) while options lose $2,000 (100%).",
  b23: "A stock trades at $152 in NY and £100 in London at $1.5500/£ ($155 equivalent).",
  b24: "Buying 100 shares in NY ($15,200) and selling in London ($15,500) locks in $300 risk-free.",
  b25: "Buying in NY and selling in London pushes prices rapidly toward cross-border parity.",
  b26: "Hedge funds manage over $2T outside mutual fund rules, charging 2% AUM and 20% profit fees.",
  b27: "Long/Short Equities and Convertible Arbitrage pair long and short positions.",
  b28: "Distressed Securities targets near-bankrupt firms; Merger Arbitrage trades takeover deals.",
  b29: "Emerging Markets invests in developing nations; Global Macro bets on macro trends.",
  b30: "Compare $2,000 in stock ($20) versus 2,000 calls ($22.50 strike at $1) at $27 and $15.",
  b31: "Think carefully and subtract the $2,000 initial premium from the gross payoff.",
  b32: "At $27, calls return $7,000 (10x stock); at $15, the entire $2,000 premium is lost.",
  b33: "Raju realizes collecting $2,240 on the $525 put still risks a $2,260 net loss at $480.",
  b34: "Use forwards to fix exact payments ($15.74M) and puts for a floor ($26.5k) with upside.",
  b35: "Sharma ji adds Rule 3: verify hedges and enforce risk limits daily to prevent €4.9B disasters.",
  b36: "Executive Summary: Eight core principles mastered in Chapter 1 Part 2.",
  b37: "1 & 2: Option rights vs obligations, and strike price effects on call/put value.",
  b38: "3 & 4: CBOE option payoff mathematics, and forward fixing versus put option insurance.",
  b39: "5 & 6: 10x option leverage magnification, and cross-border cash-and-carry arbitrage.",
  b40: "7 & 8: $2T hedge fund 2-and-20 strategies, and mandatory controls against rogue losses.",
  b41: "Complete Chapter 1 Part 2 summary grid. Next: Mechanics of Futures in Chapter 2!"
};

// Build the English episode object
const enEp = JSON.parse(JSON.stringify(hindiEp));
enEp.meta.course = "FUTURES & OPTIONS · JOHN C. HULL";
enEp.meta.narrationLanguage = "en-US";

enEp.scenes.forEach((s) => {
  s.beats.forEach((b) => {
    if (enNarrations[b.id]) {
      b.en_narration = enNarrations[b.id];
    }
    if (enSubtitles[b.id]) {
      b.en_subtitle = enSubtitles[b.id];
    }
    // Remove hindi_tts so edge-tts uses en_narration
    delete b.hindi_tts;
  });
});

// Enforce strict 8-rule sequence in Scene 11
const s11 = enEp.scenes[11];
if (s11 && s11.template === 'summary_thread') {
  s11.beats[0].ui_state.activeStepRange = [0, 0];
  s11.beats[1].ui_state.activeStepRange = [1, 2];
  s11.beats[2].ui_state.activeStepRange = [3, 4];
  s11.beats[3].ui_state.activeStepRange = [5, 6];
  s11.beats[4].ui_state.activeStepRange = [7, 8];
  s11.beats[5].ui_state.activeStepRange = [1, 8];
  s11.beats[5].ui_state.compactOverview = true;

  if (s11.beats[0].visual?.data) s11.beats[0].visual.data.activeStepRange = [0, 0];
  if (s11.beats[1].visual?.data) s11.beats[1].visual.data.activeStepRange = [1, 2];
  if (s11.beats[2].visual?.data) s11.beats[2].visual.data.activeStepRange = [3, 4];
  if (s11.beats[3].visual?.data) s11.beats[3].visual.data.activeStepRange = [5, 6];
  if (s11.beats[4].visual?.data) s11.beats[4].visual.data.activeStepRange = [7, 8];
  if (s11.beats[5].visual?.data) {
    s11.beats[5].visual.data.activeStepRange = [1, 8];
    s11.beats[5].visual.data.compactOverview = true;
  }
}

fs.writeFileSync(path.join(targetDir, 'episode_raw.json'), JSON.stringify(enEp, null, 2), 'utf8');
console.log(`✅ Successfully generated ${path.join(targetDir, 'episode_raw.json')}`);

