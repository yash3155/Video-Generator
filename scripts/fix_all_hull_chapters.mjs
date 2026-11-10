// scripts/fix_all_hull_chapters.mjs
import fs from 'node:fs';
import path from 'node:path';

const chaptersData = {
  ch09_part2: {
    scene1: {
      title: "Option Writer Premium Greed vs Margin Liquidation Shock",
      badge: "Risk Tension · Premium vs Collateral",
      leftLabel: "Premium Collection (Greed)",
      rightLabel: "Exchange Margin Call (Liquidation Fear)",
      centerTitle: "The Option Writer Dilemma"
    },
    scene2: {
      title: "The 4 Core Mechanics of Option Margining",
      badge: "Roadmap · 4 Margin Pillars",
      cards: [
        {
          title: "Market Maker Liquidity",
          desc: "Quoting continuous two-sided bid-ask spreads while bearing inventory risk.",
          badge: "Liquidity Provision"
        },
        {
          title: "Naked Call Margin Rule",
          desc: "Requires max(C + 0.20*S - OTM, C + 0.10*S) per contract to protect against upside spikes.",
          badge: "Call Risk Cap"
        },
        {
          title: "Naked Put Protection",
          desc: "Collateralized by max(P + 0.20*S - OTM, P + 0.10*K) to buffer sudden price collapses.",
          badge: "Put Floor Buffer"
        },
        {
          title: "OCC Central Novation",
          desc: "Options Clearing Corporation acts as guarantor and enforces daily mark-to-market margin.",
          badge: "Clearing Security"
        }
      ]
    }
  },

  ch10_part1: {
    scene1: {
      title: "Intrinsic Value Forces vs Time Decay & Volatility",
      badge: "Valuation Tension · Intrinsic vs Extrinsic",
      leftLabel: "Spot & Strike Moneyness (Intrinsic)",
      rightLabel: "Volatility & Time Decay (Extrinsic)",
      centerTitle: "The Option Valuation Balance"
    },
    scene2: {
      title: "The 4 Main Drivers of Option Prices",
      badge: "Roadmap · 4 Pricing Pillars",
      cards: [
        {
          title: "Spot Price & Strike (S0, K)",
          desc: "Stock price increases call value (+) and lowers puts (-); strike works inversely.",
          badge: "Moneyness Drivers"
        },
        {
          title: "Time to Expiration (T)",
          desc: "Longer time until expiration expands option value; calendar days burn premium continuously.",
          badge: "Theta Decay"
        },
        {
          title: "Implied Volatility (sigma)",
          desc: "Higher volatility expands option price convexity for both calls and puts.",
          badge: "Vega Convexity"
        },
        {
          title: "Interest Rates & Dividends (r, q)",
          desc: "Risk-free rates increase call values; continuous dividends drain call premiums.",
          badge: "Carry Adjustments"
        }
      ]
    }
  },

  ch10_part2: {
    scene1: {
      title: "Fiduciary Call Replication vs Synthetic Put-Call Parity",
      badge: "Arbitrage Tension · Mispricing vs Parity",
      leftLabel: "Fiduciary Call (Call + Zero-Coupon Bond)",
      rightLabel: "Protective Put (Stock + Put Option)",
      centerTitle: "The No-Arbitrage Law"
    },
    scene2: {
      title: "The 4 Pillars of Put-Call Parity",
      badge: "Roadmap · 4 Parity Pillars",
      cards: [
        {
          title: "The Parity Invariant",
          desc: "European options must satisfy c + K*e^(-rT) = p + S0 to prevent riskless cash arbitrage.",
          badge: "Equilibrium Law"
        },
        {
          title: "Fiduciary Call Strategy",
          desc: "Long call combined with cash bond K*e^(-rT) replicates identical terminal cashflow as stock.",
          badge: "Synthetic Asset"
        },
        {
          title: "Conversion Arbitrage",
          desc: "When call side is overpriced, sell call, buy put, buy stock, and lock in risk-free profit.",
          badge: "Cash & Carry"
        },
        {
          title: "Reverse Conversion",
          desc: "When put side is overpriced, buy call, sell put, short stock, and bank riskless interest.",
          badge: "Reverse Arbitrage"
        }
      ]
    }
  },

  ch12_part2: {
    scene1: {
      title: "Node Expansion vs Dynamic Delta Rebalancing",
      badge: "Tree Dynamics · Lattice vs Hedge",
      leftLabel: "Two-Step Price Dispersion (Lattice)",
      rightLabel: "Continuous Delta Neutrality (Rebalance)",
      centerTitle: "The Binomial Hedging Tension"
    },
    scene2: {
      title: "The 4 Pillars of Multi-Step Binomial Valuation",
      badge: "Roadmap · 4 Tree Pillars",
      cards: [
        {
          title: "Multi-Period Tree Lattice",
          desc: "Models price paths across two discrete steps of length dt with upward (u) and downward (d) moves.",
          badge: "Discrete Geometry"
        },
        {
          title: "Backward Induction Valuation",
          desc: "Recursively discounts node values: f = e^(-r*dt) * [p*f_u + (1-p)*f_d] back to t=0.",
          badge: "Recursive Pricing"
        },
        {
          title: "Node-by-Node Delta Hedging",
          desc: "Dynamic hedge ratio Delta = (f_u - f_d) / (S0*u - S0*d) rebalances across each tree node.",
          badge: "Delta Calibration"
        },
        {
          title: "American Early Exercise Check",
          desc: "At intermediate nodes, checks whether immediate exercise intrinsic value exceeds continuation value.",
          badge: "Early Exercise"
        }
      ]
    }
  },

  ch13_part1: {
    scene1: {
      title: "Normal Short-Term Returns vs Lognormal Price Distribution",
      badge: "Statistical Tension · Normal vs Lognormal",
      leftLabel: "Normal Compounded Return (Arithmetic)",
      rightLabel: "Lognormal Terminal Price (Geometric)",
      centerTitle: "The Distributional Reality"
    },
    scene2: {
      title: "The 4 Pillars of Lognormal Price Dynamics",
      badge: "Roadmap · 4 Statistical Pillars",
      cards: [
        {
          title: "Lognormal Distribution Law",
          desc: "While stock returns over dt are normal, terminal price S_T is strictly lognormally distributed.",
          badge: "Lognormal Bound"
        },
        {
          title: "Continuous Return Formula",
          desc: "Log returns follow ln(S_T/S0) ~ N((mu - sigma^2/2)*T, sigma^2*T), accounting for volatility drag.",
          badge: "Volatility Drag"
        },
        {
          title: "Expected Value Equilibrium",
          desc: "Future expected stock price is E[S_T] = S0 * e^(mu*T), with variance expanding with maturity.",
          badge: "Expectation Drift"
        },
        {
          title: "Geometric vs Arithmetic Trap",
          desc: "Arithmetic average returns mislead investors; true compounding follows geometric drift.",
          badge: "Compounding Truth"
        }
      ]
    }
  },

  ch13_part2: {
    scene1: {
      title: "Stock Received Value vs Discounted Cash Strike Paid",
      badge: "Formula Equilibrium · Stock vs Strike",
      leftLabel: "Expected Share Value Received: S0 * N(d1)",
      rightLabel: "Discounted Strike Paid: K * e^(-rT) * N(d2)",
      centerTitle: "The BSM Analytical Balance"
    },
    scene2: {
      title: "The 4 Core Foundations of the BSM Model",
      badge: "Roadmap · 4 BSM Pillars",
      cards: [
        {
          title: "European Call Closed-Form",
          desc: "Call price c = S0 * N(d1) - K * e^(-rT) * N(d2), balancing expected share against strike.",
          badge: "Analytical Equation"
        },
        {
          title: "Standardized Parameters d1 & d2",
          desc: "Dimensionless variables scaling moneyness against volatility: d2 = d1 - sigma*sqrt(T).",
          badge: "Moneyness Scale"
        },
        {
          title: "Probabilistic Meaning of N(d2)",
          desc: "N(d2) represents the exact risk-neutral probability that the option expires in-the-money.",
          badge: "Risk-Neutral Prob"
        },
        {
          title: "Delta Replication Weight N(d1)",
          desc: "N(d1) is the continuous delta hedging weight required to maintain local risk neutrality.",
          badge: "Dynamic Weight"
        }
      ]
    }
  },

  ch14_part1: {
    scene1: {
      title: "Executive Incentive Alignment vs Asymmetric Risk-Taking",
      badge: "Corporate Governance · Alignment vs Moral Hazard",
      leftLabel: "Long-Term Shareholder Value (Alignment)",
      rightLabel: "Asymmetric Option Call Convexity (Moral Hazard)",
      centerTitle: "The Principal-Agent Conflict"
    },
    scene2: {
      title: "The 4 Pillars of Employee Stock Option (ESO) Mechanics",
      badge: "Roadmap · 4 ESO Pillars",
      cards: [
        {
          title: "Non-Transferable Call Structure",
          desc: "ESOs are non-tradable call options with 10-year maturities granted to align executive incentives.",
          badge: "Option Grant"
        },
        {
          title: "Vesting Mechanics (Cliff vs Graded)",
          desc: "Cliff vesting requires continuous service until milestone; graded vesting unlocks in annual tranches.",
          badge: "Vesting Schedule"
        },
        {
          title: "Principal-Agent Convexity Risk",
          desc: "Asymmetric option payoffs can incentivize excessive risk-taking because downside is capped at zero.",
          badge: "Moral Hazard"
        },
        {
          title: "Accounting & Expensing (ASC 718)",
          desc: "FAS 123R mandates fair-value expensing of ESOs on the corporate income statement at grant date.",
          badge: "Fair Value GAAP"
        }
      ]
    }
  }
};

const courses = ['hull_derivatives', 'hull_derivatives_en'];

for (const course of courses) {
  for (const [ch, data] of Object.entries(chaptersData)) {
    const rawPath = path.resolve('src/data/chapters', course, ch, 'episode_raw.json');
    if (!fs.existsSync(rawPath)) {
      console.warn(`File not found: ${rawPath}`);
      continue;
    }

    const ep = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

    // 1. Update Scene 1 (tug_of_war)
    if (ep.scenes[1] && ep.scenes[1].template === 'tug_of_war') {
      ep.scenes[1].title = data.scene1.title;
      ep.scenes[1].badge = data.scene1.badge;
      for (const beat of ep.scenes[1].beats) {
        if (!beat.ui_state) beat.ui_state = {};
        beat.ui_state.leftLabel = data.scene1.leftLabel;
        beat.ui_state.rightLabel = data.scene1.rightLabel;
        beat.ui_state.centerTitle = data.scene1.centerTitle;
        if (beat.visual && beat.visual.data) {
          beat.visual.data.leftLabel = data.scene1.leftLabel;
          beat.visual.data.rightLabel = data.scene1.rightLabel;
        }
      }
    }

    // 2. Update Scene 2 (progressive_cards)
    if (ep.scenes[2] && ep.scenes[2].template === 'progressive_cards') {
      ep.scenes[2].title = data.scene2.title;
      ep.scenes[2].badge = data.scene2.badge;
      for (let bIdx = 0; bIdx < ep.scenes[2].beats.length; bIdx++) {
        const beat = ep.scenes[2].beats[bIdx];
        if (!beat.ui_state) beat.ui_state = {};
        beat.ui_state.cards = data.scene2.cards.map((c, cIdx) => ({
          title: c.title,
          desc: c.desc,
          badge: c.badge,
          state: cIdx === (beat.ui_state.activeCardIndex ?? bIdx) ? 'active_amber' : 'muted'
        }));
        if (beat.visual && beat.visual.data) {
          beat.visual.data.cards = beat.ui_state.cards;
        }
      }
    }

    fs.writeFileSync(rawPath, JSON.stringify(ep, null, 2), 'utf8');
    console.log(`✅ Corrected Scene 1 & 2 for ${course}/${ch}`);

    // Update compiled file if it exists
    const compiledPath = path.resolve('src/data/chapters', course, ch, 'episode_compiled.json');
    if (fs.existsSync(compiledPath)) {
      const compiled = JSON.parse(fs.readFileSync(compiledPath, 'utf8'));
      if (compiled.scenes[1] && compiled.scenes[1].template === 'tug_of_war') {
        compiled.scenes[1].title = data.scene1.title;
        compiled.scenes[1].badge = data.scene1.badge;
        for (const beat of compiled.scenes[1].beats) {
          if (!beat.ui_state) beat.ui_state = {};
          beat.ui_state.leftLabel = data.scene1.leftLabel;
          beat.ui_state.rightLabel = data.scene1.rightLabel;
          beat.ui_state.centerTitle = data.scene1.centerTitle;
          if (beat.visual && beat.visual.data) {
            beat.visual.data.leftLabel = data.scene1.leftLabel;
            beat.visual.data.rightLabel = data.scene1.rightLabel;
          }
        }
      }
      if (compiled.scenes[2] && compiled.scenes[2].template === 'progressive_cards') {
        compiled.scenes[2].title = data.scene2.title;
        compiled.scenes[2].badge = data.scene2.badge;
        for (let bIdx = 0; bIdx < compiled.scenes[2].beats.length; bIdx++) {
          const beat = compiled.scenes[2].beats[bIdx];
          if (!beat.ui_state) beat.ui_state = {};
          beat.ui_state.cards = data.scene2.cards.map((c, cIdx) => ({
            title: c.title,
            desc: c.desc,
            badge: c.badge,
            state: cIdx === (beat.ui_state.activeCardIndex ?? bIdx) ? 'active_amber' : 'muted'
          }));
          if (beat.visual && beat.visual.data) {
            beat.visual.data.cards = beat.ui_state.cards;
          }
        }
      }
      fs.writeFileSync(compiledPath, JSON.stringify(compiled, null, 2), 'utf8');
      console.log(`  -> Synced compiled episode for ${course}/${ch}`);
    }
  }
}

