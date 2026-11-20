/* Spoken-text normalization (S10), word folding for cue anchors (A-06) and caption phrasing (E.7). */
import type { CaptionPhrase, WordTiming } from "../schemas/compiled";

const base = (lang: string) => lang.split("-")[0];

const WORDS: Record<string, { percent: string; rupees: string; dollars: string; times: string; equals: string; minus: string; plus: string; divided: string; approx: string }> = {
  en: { percent: "percent", rupees: "rupees", dollars: "dollars", times: "times", equals: "equals", minus: "minus", plus: "plus", divided: "divided by", approx: "about" },
  hi: { percent: "प्रतिशत", rupees: "रुपये", dollars: "डॉलर", times: "गुणा", equals: "बराबर", minus: "घटा", plus: "जोड़", divided: "भाग", approx: "लगभग" },
};

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Apply a pronunciation lexicon: whole-token, case-sensitive, longest keys first. */
export function applyLexicon(text: string, lexicon: Record<string, string> = {}): string {
  let out = text;
  for (const key of Object.keys(lexicon).sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(key)}(?=$|[^\\p{L}\\p{N}])`, "gu");
    out = out.replace(re, (_m, pre: string) => pre + lexicon[key]);
  }
  return out;
}

/** The text a TTS voice should read for a display string: lexicon, symbols and currency spelled out, markdown stripped. */
export function normalizeSpoken(display: string, lang: string, lexicon: Record<string, string> = {}): string {
  const w = WORDS[base(lang)] ?? WORDS.en;
  let t = display.replace(/[*_`#]/g, "");
  t = applyLexicon(t, lexicon);
  t = t.replace(/₹\s?(\d[\d,]*(?:\.\d+)?)/g, `$1 ${w.rupees}`);
  t = t.replace(/\$\s?(\d[\d,]*(?:\.\d+)?)/g, `$1 ${w.dollars}`);
  t = t.replace(/(\d)\s?%/g, `$1 ${w.percent}`);
  t = t.replace(/(\d)\s?[×x]\s?(\d)/g, `$1 ${w.times} $2`);
  t = t.replace(/\s[×]\s/g, ` ${w.times} `);
  t = t.replace(/\s=\s/g, ` ${w.equals} `);
  t = t.replace(/\s[−-]\s/g, ` ${w.minus} `);
  t = t.replace(/\s\+\s/g, ` ${w.plus} `);
  t = t.replace(/\s[÷]\s/g, ` ${w.divided} `);
  t = t.replace(/[≈~]\s?/g, `${w.approx} `);
  t = t.replace(/[–—]/g, ", ");
  return t.replace(/\s+/g, " ").trim();
}

/** The spoken form of one beat: the script's explicit `spoken` text wins, otherwise the normalized display text. */
export function spokenText(n: { display: string; spoken?: string }, lang: string, lexicon: Record<string, string> = {}): string {
  return n.spoken?.trim() ? applyLexicon(n.spoken.trim(), lexicon) : normalizeSpoken(n.display, lang, lexicon);
}

/** Folds a word for matching: NFD, nukta removed, Latin accents removed, punctuation stripped, lowercased. */
export function foldWord(w: string): string {
  return w
    .normalize("NFD")
    .replace(/\u093C/g, "")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\p{P}\p{S}]/gu, "")
    .toLowerCase()
    .normalize("NFC");
}

export function foldText(t: string): string {
  return t
    .split(/\s+/)
    .map(foldWord)
    .filter(Boolean)
    .join(" ");
}

/** Finds the time an anchor phrase is spoken: the first word sequence that matches its folded tokens. */
export function matchAnchor(words: WordTiming[], anchor: string, lang: string, lexicon: Record<string, string> = {}): number | null {
  const tokens = foldText(normalizeSpoken(anchor, lang, lexicon)).split(" ").filter(Boolean);
  if (!tokens.length) return null;
  const folded = words.map((w) => foldWord(w.text));
  for (let i = 0; i + tokens.length <= folded.length; i++) {
    let ok = true;
    for (let k = 0; k < tokens.length && ok; k++) {
      const a = folded[i + k];
      const b = tokens[k];
      ok = a === b || (k === tokens.length - 1 && a.startsWith(b) && b.length >= 3) || (k === 0 && tokens.length === 1 && a.endsWith(b) && b.length >= 4);
    }
    if (ok) return words[i].startMs;
  }
  // Some voices merge or split tokens: fall back to searching the joined text.
  const joined = folded.join(" ");
  const needle = tokens.join(" ");
  const at = joined.indexOf(needle);
  if (at < 0) return null;
  const idx = joined.slice(0, at).split(" ").filter(Boolean).length;
  return words[Math.min(idx, words.length - 1)]?.startMs ?? null;
}

/**
 * Caption phrases of at most `max` words, broken after sentence ends and clause marks when possible.
 * When the display text has as many tokens as the spoken words, captions show the display form ("5%" not "5 percent").
 */
export function buildCaptions(words: WordTiming[], display?: string, max = 16): CaptionPhrase[] {
  if (!words.length) return [];
  const disp = display ? display.split(/\s+/).filter(Boolean) : [];
  const shown = disp.length === words.length ? words.map((w, i) => ({ ...w, text: disp[i] })) : words;
  const out: CaptionPhrase[] = [];
  let cur: WordTiming[] = [];
  const flush = () => {
    if (cur.length) out.push({ startMs: cur[0].startMs, endMs: cur[cur.length - 1].endMs, words: cur });
    cur = [];
  };
  for (let i = 0; i < shown.length; i++) {
    cur.push(shown[i]);
    const w = shown[i].text;
    const sentenceEnd = /[.!?।]["')]?$/.test(w);
    const clause = /[,;:]$/.test(w) && cur.length >= 8;
    if (cur.length >= max || (sentenceEnd && cur.length >= 3) || clause) {
      // Avoid a one-word orphan phrase at the end.
      if (cur.length >= max && shown.length - i - 1 === 1) continue;
      flush();
    }
  }
  flush();
  // Ensure the 16-word limit even after orphan merging.
  return out.flatMap((p) => {
    if (p.words.length <= max) return [p];
    const parts: CaptionPhrase[] = [];
    for (let i = 0; i < p.words.length; i += max) {
      const ws = p.words.slice(i, i + max);
      parts.push({ startMs: ws[0].startMs, endMs: ws[ws.length - 1].endMs, words: ws });
    }
    return parts;
  });
}
