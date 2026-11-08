import fs from 'fs';
import path from 'path';

function robustParseJson(raw) {
  if (!raw) return {};
  let text = String(raw).trim();
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(text);
  } catch {}
  // Sanitize trailing commas
  text = text.replace(/,\s*([}\]])/g, '$1');
  try {
    return JSON.parse(text);
  } catch {}
  // Sanitize unescaped backslashes in LaTeX strings (handling \u that are not \uXXXX)
  text = text.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');
  try {
    return JSON.parse(text);
  } catch {}
  // Clean unescaped newlines in JSON strings
  text = text.replace(/:\s*"([^"]*)"/g, (m, p1) => ': "' + p1.replace(/\r?\n/g, '\\n') + '"');
  return JSON.parse(text);
}

async function generateCh19Facts() {
  const prompt = `You are a quantitative finance expert and lead instructional designer specializing in John C. Hull's "Options, Futures, and Other Derivatives".
We need to generate exactly 11 source facts for Chapter 19: "Volatility Smiles and Skew".

Cover:
1. Implied Volatility & Inversion of Black-Scholes-Merton: The definition of implied volatility as the parameter that equates market option price to BSM theoretical price.
2. The Empirical Volatility Smile vs BSM Flat Line: Black-Scholes assumes lognormal distribution and constant volatility across all strikes K and maturities T. Real markets exhibit non-flat volatility smiles and skews.
3. Foreign Currency Options and U-Shaped Smile: Why foreign exchange currency options exhibit a symmetric U-shaped smile (higher implied vol for both deep OTM puts and deep OTM calls), reflecting leptokurtic exchange rate distributions with fat tails and excess kurtosis compared to the normal distribution.
4. Equity Options and Downward Volatility Skew (Smirk): Why equity and stock index options display a downward sloping volatility skew where out-of-the-money puts (low strikes) trade at significantly higher implied volatilities than out-of-the-money calls (high strikes).
5. The Leverage Effect Explanation: As a firm's equity value drops, its leverage (debt-to-equity ratio) increases, making the equity riskier and increasing its volatility.
6. "Crashophobia" & Post-1987 Structural Regime Shift (Business Snapshot 19.2): Prior to the October 19, 1987 crash, equity smiles were relatively flat. Post-crash, institutional investors and market makers permanently bid up deep OTM put options as catastrophic downside insurance, cementing the permanent downward skew.
7. Put-Call Parity Invariant for Implied Volatility: By Put-Call Parity (c + K*exp(-rT) = p + S0), a European call and European put with the identical strike K and maturity T must have the exact same implied volatility to prevent arbitrage.
8. Calculating the Implied Risk-Neutral Probability Density Function: Formula by Breeden-Litzenberger showing how second derivative of call price with respect to strike yields the risk-neutral density: g(K) = exp(rT) * d^2c / dK^2.
9. Volatility Surfaces: Combining volatility smile across strike dimension with volatility term structure across expiration maturities into a 3D volatility surface sigma(K, T).
10. Hull Numerical Example or Snapshot 19.1: Making Options Fair: Market quotes vs BSM prices when volatility smile is incorporated.
11. Local Volatility and Stochastic Volatility Extensions: Dupire's local volatility model sigma(S, t) and Heston's stochastic volatility model as modern answers to smile dynamics.

Return ONLY a valid JSON object matching the SourceFactsSchema:
{
  "courseId": "hull_derivatives",
  "chapterId": "ch19_part1",
  "bookTitle": "Options, Futures, and Other Derivatives",
  "chapterTitle": "Chapter 19: Volatility Smiles & Skew",
  "facts": [
    {
      "id": "fact-01",
      "category": "core_principle",
      "claim": "...",
      "sourceCitation": "Hull Ch. 19, Section ...",
      "pedagogicalRole": "foundation",
      "importance": "CRITICAL",
      "technicalDetails": {
        "statement": "...",
        "formula": "...",
        "keyVariables": ["..."]
      }
    }
  ]
}

Ensure all formulas have proper formulaDetails.variables.
Ensure JSON is strictly valid, escaping all backslashes properly!`;

  console.log("Querying Gemini 4 Argon for Chapter 19 source facts...");
  const resp = await fetch("http://127.0.0.1:8001/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gemini-4-argon",
      messages: [
        { role: "system", content: "You are an elite quantitative finance author. Output strictly valid JSON without markdown fences." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1
    })
  });

  const data = await resp.json();
  const candidate = data.choices[0].message.content;
  const parsed = robustParseJson(candidate);

  const outDirHindi = "src/data/chapters/hull_derivatives/ch19_part1";
  const outDirEn = "src/data/chapters/hull_derivatives_en/ch19_part1";
  fs.mkdirSync(outDirHindi, { recursive: true });
  fs.mkdirSync(outDirEn, { recursive: true });

  fs.writeFileSync(path.join(outDirHindi, "source_facts.json"), JSON.stringify(parsed, null, 2));
  fs.writeFileSync(path.join(outDirEn, "source_facts.json"), JSON.stringify(parsed, null, 2));
  console.log(`Successfully generated and wrote source_facts.json for ch19_part1 (${parsed.facts ? parsed.facts.length : 0} facts)!`);
}

generateCh19Facts().catch(console.error);
