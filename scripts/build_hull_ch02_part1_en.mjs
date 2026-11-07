import fs from 'fs';
import path from 'path';

const srcDir = 'src/data/chapters/hull_derivatives/ch02_part1';
const targetDir = 'src/data/chapters/hull_derivatives_en/ch02_part1';

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
  // Scene 0: Live Cattle Button Blunder
  b01: "Raju sits at his trading desk assuming futures contracts are just abstract numbers on a screen that simply disappear into thin air when the expiration date arrives.",
  b02: "Meera stops him immediately and recounts John Hull's true Snapshot 2.1 story: a junior clerk who wanted to close one live cattle contract accidentally hit the buy button instead.",
  b03: "Raju laughs and asks whether holding two open long contracts into the delivery period merely caused a small digital accounting penalty on the broker's terminal.",

  // Scene 1: 80,000 Pounds of Unwanted Cattle
  b04: "Far from a digital penalty, failing to close those two open long contracts meant the firm was legally obligated to take physical delivery of eighty thousand pounds of live cattle!",
  b05: "The short seller acquired cattle at a local livestock auction two thousand miles away and immediately issued a delivery notice through the exchange clearinghouse.",
  b06: "Because no local auction was scheduled until Tuesday, the brokerage firm had to locate commercial feedlots, housing and feeding eighty thousand pounds of cattle for an entire week!",

  // Scene 2: 4 Pillars of Futures Mechanics
  b07: "In this lesson, we master the four core pillars of futures market mechanics. Pillar 1: Opening positions and executing timely offset trades before delivery notices arrive.",
  b08: "Pillar 2: Exchange contract specifications—standardizing deliverable grades, contract sizes, pricing units, and licensed delivery warehouses.",
  b09: "Pillar 3: Exchange safety rails—daily price limits that halt trading during extreme volatility, and speculative position limits preventing supply corners.",
  b10: "And Pillar 4: Spot-futures convergence—how delivery arbitrage mathematically pulls futures prices into exact alignment with spot prices at contract maturity.",

  // Scene 3: Closing Out vs Riding to Delivery
  b11: "In modern financial markets, over 99% of all futures contracts are closed out prior to the delivery month through an opposite trade on the exchange.",
  b12: "Failing to execute an offsetting trade transfers binding delivery notices under exchange rules, forcing physical delivery of commodities or cash settlement for financial indices.",
  b13: "The golden rule of futures trading is clear: to close a position, you must execute the exact opposite trade in the identical contract and delivery month before delivery begins.",

  // Scene 4: Calculating Futures Gain & Loss
  b14: "Calculating cumulative futures gain or loss is straightforward: for a long position, profit equals the contract size multiplied by the exit futures price minus the entry futures price.",
  b15: "Conversely, for a short position, profit equals the contract size multiplied by the initial entry price minus the final exit price.",
  b16: "Whether you offset your position early in the open market or hold to physical delivery, your net financial gain or loss matches this exact price difference.",

  // Scene 5: Inside Exchange Contract Specifications
  b17: "First: Deliverable grades. For CME Corn, the standard grade is Number 2 Yellow corn; delivering superior Number 1 earns a premium, while delivering Number 3 incurs a discount.",
  b18: "Second: Contract size. One CME Live Cattle contract is 40,000 pounds, Corn is 5,000 bushels, and the E-mini S&P 500 is 50 dollars times the index value.",
  b19: "Third: Delivery locations. Frozen concentrated orange juice futures must be delivered to licensed exchange warehouses in Florida, New Jersey, or Delaware.",
  b20: "And fourth: Delivery months and price quotes. WTI crude oil trades for every calendar month, quoted in dollars and cents, while Treasury bond futures quote in 32nds of a dollar.",

  // Scene 6: Exchange Guardrails: Price & Position Limits
  b21: "Daily price limits establish maximum allowable price movements in a single trading session, halting trading when panic creates limit-up or limit-down conditions.",
  b22: "Simultaneously, exchanges enforce speculative position limits, capping the maximum number of contracts a single speculative trader or institution can control.",
  b23: "Together, price limits dampen artificial day-to-day panic, while position limits prevent predatory speculators from cornering the deliverable market supply.",

  // Scene 7: Spot-Futures Convergence Arbitrage
  b24: "What guarantees that paper futures prices reflect real cash asset values? The answer is delivery arbitrage. If futures trade above the spot price at maturity, arbitrageurs sell futures, buy spot, and deliver for profit.",
  b25: "Conversely, if futures trade below the spot price, traders buy the undervalued futures contracts, take delivery at maturity, and sell the underlying asset in the cash spot market.",
  b26: "This dual arbitrage pressure continually pulls both prices together, guaranteeing that the futures price mathematically converges to the spot price on expiration day.",

  // Scene 8: Visualizing Convergence & Arbitrage Profit
  b27: "During the delivery window, any gap between the futures price F_T and spot price S_T represents pure riskless arbitrage profit.",
  b28: "As arbitrageurs short the expensive futures and buy the cheaper physical commodity, selling pressure on futures and buying pressure on spot force F_T down to S_T.",
  b29: "Even though fewer than 1% of contracts ever reach physical delivery, the legal threat of delivery is the invisible anchor tethering financial futures to the physical economy.",

  // Scene 9: Active Recall Challenge
  b30: "Test your understanding: During the July delivery period, CME Corn spot trades at 400 cents per bushel while July Corn futures trade at 412 cents. How do arbitrageurs exploit this price difference?",
  b31: "Raju reasons: Futures are trading 12 cents above spot during the delivery window. Arbitrageurs should sell futures and buy cash corn to lock in the 12 cent spread!",
  b32: "Option B is correct! Arbitrageurs buy spot corn at 400 cents, short July futures at 412 cents, and make immediate physical delivery, locking in 12 cents per bushel risk-free.",

  // Scene 10: Raju's Pre-Expiry Execution Checklist
  b33: "Raju reviews his execution checklist, resolving never to confuse the buy and sell buttons on expiration day to avoid taking delivery of live cattle or grain.",
  b34: "Meera reminds him: always verify the contract size multiplier, grade adjustment rules, and exchange-approved delivery warehouses before trading.",
  b35: "Raju concludes that delivery arbitrage ensures paper futures contracts remain strictly disciplined by supply and demand in the physical commodity market.",

  // Scene 11: Master Blueprint: 8 Core Principles
  b36: "Let us review the eight core principles and market mechanisms mastered in Chapter 2 Part 1.",
  b37: "First and second: Futures are standardized exchange contracts, and over 99% are closed out early via offsetting trades.",
  b38: "Third and fourth: Execution errors trigger physical delivery obligations, while cumulative PnL scales with contract size and price delta.",
  b39: "Fifth and sixth: Exchanges define grades and licensed warehouses, while price and position limits prevent market corners.",
  b40: "Seventh and eighth: During delivery, arbitrage forces futures prices to converge with spot prices, anchoring financial markets to the physical economy.",
  b41: "This concludes Chapter 2 Part 1. Verify contract specifications, respect expiration dates, and trade with discipline. See you in Part 2!"
};

// Subtitles <= 16 words
const enSubtitles = {
  b01: "Raju assumes futures are mere screen numbers that simply vanish upon contract expiry.",
  b02: "Meera recalls a clerk who meant to sell one cattle contract, but accidentally bought another.",
  b03: "Raju asks if holding two open long contracts merely triggered a minor digital penalty.",
  b04: "Failing to close two open long contracts triggered delivery of 80,000 pounds of live cattle.",
  b05: "The short seller acquired cattle at a local auction 2,000 miles away and assigned delivery.",
  b06: "With no nearby auction until Tuesday, the firm housed and fed 80,000 pounds for a week.",
  b07: "The first pillar is opening positions and closing them out before delivery arrives.",
  b08: "The second pillar establishes standardized asset grades, contract sizes, and delivery locations.",
  b09: "The third pillar enforces daily price boundaries and limits to prevent market manipulation.",
  b10: "The fourth pillar forces futures prices to converge with spot prices at contract maturity.",
  b11: "Over 99% of futures positions are closed out prior to the delivery month via opposite trades.",
  b12: "Failing to offset triggers binding delivery notices under exchange warehouse rules.",
  b13: "The golden rule: close positions by executing the precise opposite side in the identical delivery month.",
  b14: "Long position PnL equals Contract Size multiplied by exit futures price minus entry futures price.",
  b15: "For Short positions, PnL equals Contract Size multiplied by entry price minus exit price.",
  b16: "Whether offsetting early or holding to expiry, your net cash flow mirrors this price delta.",
  b17: "Exchanges standardise grades: CME Corn sets No. 2 Yellow standard, giving No. 1 a premium.",
  b18: "Contract sizes are standardized: CME Cattle is 40,000 lbs, and E-mini Nasdaq is 20 times index.",
  b19: "Locations are restricted: Orange juice must be delivered to licensed ports in FL, NJ, or DE.",
  b20: "Cycles and quotes are defined: Crude oil quotes in cents, while US T-Bonds quote in 1/32nds.",
  b21: "Daily price limits halt trading when prices surge or collapse beyond allowed daily bands.",
  b22: "Meanwhile, speculative position limits prevent large players from cornering commodity supply.",
  b23: "Price limits tame day-to-day fluctuations, while position limits curb excessive trader dominance.",
  b24: "When futures exceed spot at maturity, arbitrageurs sell futures, buy spot, and deliver for profit.",
  b25: "When futures trade below spot, buyers scoop up cheap futures contracts and demand delivery.",
  b26: "This arbitrage pressure pulls both prices into balance, forcing futures to equal spot at expiry.",
  b27: "During the delivery window, riskless arbitrage profit equals futures price minus spot price.",
  b28: "As arbitrageurs short futures and buy cash goods, price pressure forces F_T down to S_T.",
  b29: "Even though deliveries are rare, the legal right to deliver anchors paper futures to physical reality.",
  b30: "Carefully read this scenario to determine how traders exploit the futures-spot price gap.",
  b31: "Raju reasons: Futures trade 12 cents above spot. Arbitrageurs sell futures and buy cash corn.",
  b32: "Traders short futures at 412 and buy spot at 400, pocketing 12 cents risk-free.",
  b33: "Raju insists he will never mistake the buy and sell buttons on rollover day again.",
  b34: "Meera advises him to always review contract specs, multipliers, and grade rules first.",
  b35: "Raju realizes that delivery arbitrage keeps paper futures prices anchored to the spot market.",
  b36: "Executive Summary: Eight core principles of futures mechanics mastered in Chapter 2 Part 1.",
  b37: "1 & 2: Standardized exchange contracts, and 99% early offset through opposite trades.",
  b38: "3 & 4: Live cattle delivery obligations, and PnL scaling with contract size and price delta.",
  b39: "5 & 6: Deliverable grade adjustments, and daily price and speculative position limits.",
  b40: "7 & 8: Spot-futures convergence arbitrage, and anchoring paper futures to physical cash assets.",
  b41: "Complete Chapter 2 Part 1 summary grid. Next: Margin Accounts & MTM in Part 2!"
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

