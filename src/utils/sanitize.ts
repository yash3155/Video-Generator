// src/utils/sanitize.ts
export function sanitizeForHindiTTS(text: string): string {
  if (!text) return '';
  let sanitized = text;

  // 1. Strip commas inside numbers FIRST (e.g. ₹2,160 -> ₹2160)
  sanitized = sanitized.replace(/(\d),(\d)/g, '$1$2');
  sanitized = sanitized.replace(/(\d),(\d)/g, '$1$2');

  // 2. Convert numeric ranges BEFORE negative sign rule (e.g. 15-20% -> 15 से 20 परसेंट)
  sanitized = sanitized.replace(/(\d+)\s*[-–—]\s*(\d+)\s*%/g, '$1 से $2 परसेंट');
  sanitized = sanitized.replace(/(\d+)\s*[-–—]\s*(\d+)/g, '$1 से $2');

  // 3. Fix Microsoft hi-IN-MadhurNeural slurring half-la (ल्) in रिज़ल्ट / रिजल्ट into "रिज़िट"
  sanitized = sanitized.replace(/रि[ज़जज़]ल्ट्स/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]ल्ट/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]िट/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]ट/gi, 'नतीजे');

  // 4. Fix slurred English loanwords & technical terms in Devanagari
  sanitized = sanitized.replace(/एकसपायरी/g, 'एक्सपायरी');
  sanitized = sanitized.replace(/वॉल्क|वाल्क/g, 'वॉक');
  sanitized = sanitized.replace(/सेल्[फ़फ][\s-]*अ[\s-]*फुलफिलिंग/g, 'सेल्फ-फुलफिलिंग');
  sanitized = sanitized.replace(/लेवरेज्ड/g, 'लीवरेज्ड');
  sanitized = sanitized.replace(/व्हिपसॉ/g, 'विप-सॉ');
  sanitized = sanitized.replace(/ब्लोफ/g, 'ब्लो-ऑफ');
  sanitized = sanitized.replace(/ओआई/g, 'ओपन इंटरेस्ट');
  sanitized = sanitized.replace(/ईएमए/g, 'ई एम ए');
  sanitized = sanitized.replace(/एसएमए/g, 'एस एम ए');

  // 5. Smooth out awkward regulatory & English clusters
  sanitized = sanitized.replace(/दवा रेगुलेटर\s*\(?FDA\)?/gi, 'दवा रेगुलेटर');
  sanitized = sanitized.replace(/\bUSFDA\b/gi, 'एफ डी ए');
  sanitized = sanitized.replace(/\bFDA\b/gi, 'एफ डी ए');
  sanitized = sanitized.replace(/यू\s*एस\s*एफ\s*डी\s*ए/g, 'एफ डी ए');

  // 6. Stochastic & Williams % symbols BEFORE generic % rule
  sanitized = sanitized.replace(/%K/gi, 'परसेंट के');
  sanitized = sanitized.replace(/%D/gi, 'परसेंट डी');
  sanitized = sanitized.replace(/%R/gi, 'परसेंट आर');

  // 7. Currency & Mathematical Symbols
  sanitized = sanitized.replace(/₹\s*(\d+(?:\.\d+)?)/g, '$1 रुपये');
  sanitized = sanitized.replace(/(\d+(?:\.\d+)?)%/g, '$1 परसेंट');
  sanitized = sanitized.replace(/(^|\s)\+(\d+(?:\.\d+)?)/g, '$1प्लस $2');
  sanitized = sanitized.replace(/(^|\s)-(\d+(?:\.\d+)?)/g, '$1माइनस $2');

  // 8. Finance & Technical Analysis Acronyms
  sanitized = sanitized.replace(/[()]/g, '');
  sanitized = sanitized.replace(/\bETF\b/gi, 'ई टी एफ');
  sanitized = sanitized.replace(/\bETFs\b/gi, 'ई टी एफ');
  sanitized = sanitized.replace(/\bIPO\b/gi, 'आई पी ओ');
  sanitized = sanitized.replace(/\bFII\b/gi, 'एफ आई आई');
  sanitized = sanitized.replace(/\bDII\b/gi, 'डी आई आई');
  sanitized = sanitized.replace(/\bOHLC\b/gi, 'ओ एच एल सी');
  sanitized = sanitized.replace(/\bNSE\b/gi, 'एन एस ई');
  sanitized = sanitized.replace(/\bBSE\b/gi, 'बी एस ई');
  sanitized = sanitized.replace(/\bSEBI\b/gi, 'सेबी');
  sanitized = sanitized.replace(/\bPE\b/gi, 'पी ई');
  sanitized = sanitized.replace(/\bRSI\b/gi, 'आर एस आई');
  sanitized = sanitized.replace(/\bMACD\b/gi, 'मैक डी');
  sanitized = sanitized.replace(/\bEMA\b/gi, 'ई एम ए');
  sanitized = sanitized.replace(/\bEMAs\b/gi, 'ई एम ए');
  sanitized = sanitized.replace(/\bSMA\b/gi, 'एस एम ए');
  sanitized = sanitized.replace(/\bSMAs\b/gi, 'एस एम ए');
  sanitized = sanitized.replace(/\bOI\b/gi, 'ओपन इंटरेस्ट');
  sanitized = sanitized.replace(/\bOBV\b/gi, 'ओ बी वी');
  sanitized = sanitized.replace(/\bVPT\b/gi, 'वी पी टी');
  sanitized = sanitized.replace(/\bCOT\b/gi, 'सी ओ टी');
  sanitized = sanitized.replace(/\bPCR\b/gi, 'पी सी आर');
  sanitized = sanitized.replace(/\bROC\b/gi, 'आर ओ सी');
  sanitized = sanitized.replace(/\bCCI\b/gi, 'सी सी आई');
  sanitized = sanitized.replace(/\bKAMA\b/gi, 'कामा');
  sanitized = sanitized.replace(/\bATR\b/gi, 'ए टी आर');
  sanitized = sanitized.replace(/\bADX\b/gi, 'ए डी एक्स');
  sanitized = sanitized.replace(/\bSAR\b/gi, 'एस ए आर');
  sanitized = sanitized.replace(/\bCMT\b/gi, 'सी एम टी');
  sanitized = sanitized.replace(/\bQ1\b/gi, 'क्यू वन');
  sanitized = sanitized.replace(/\bQ2\b/gi, 'क्यू टू');
  sanitized = sanitized.replace(/\bQ3\b/gi, 'क्यू थ्री');
  sanitized = sanitized.replace(/\bQ4\b/gi, 'क्यू फोर');

  // 9. Tech & Systems Acronyms
  sanitized = sanitized.replace(/\bAPI\b/gi, 'ए पी आई');
  sanitized = sanitized.replace(/\bSQL\b/gi, 'सीक्वल');
  sanitized = sanitized.replace(/\bCPU\b/gi, 'सी पी यू');
  sanitized = sanitized.replace(/\bRAM\b/gi, 'रैम');
  sanitized = sanitized.replace(/\bJSON\b/gi, 'जेसन');
  sanitized = sanitized.replace(/\bP99\b/gi, 'पी नाइनटी नाइन');
  sanitized = sanitized.replace(/\bAWS\b/gi, 'ए डब्ल्यू एस');
  sanitized = sanitized.replace(/\bDNS\b/gi, 'डी एन एस');
  sanitized = sanitized.replace(/\bHTTP\b/gi, 'एच टी टी पी');
  sanitized = sanitized.replace(/\bms\b/gi, 'मिलीसेकंड');

  return sanitized;
}