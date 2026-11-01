/**
 * Phonetic Sanitizer for Hindi TTS (Edge-TTS & Gemini TTS)
 * Converts currencies, percentages, number ranges, symbols, and English
 * financial/technical acronyms into natural Devanagari phonetic pronunciations.
 */
export function sanitizeForHindiTTS(text: string): string {
  if (!text) return '';
  let sanitized = text;

  // 1. Strip commas inside numbers FIRST (e.g. ₹2,160 -> ₹2160, 21,800 -> 21800)
  // Prevents ₹2,160 from becoming "2 रुपये, 160"!
  sanitized = sanitized.replace(/(\d),(\d)/g, '$1$2');
  sanitized = sanitized.replace(/(\d),(\d)/g, '$1$2');

  // 2. Convert numeric ranges BEFORE negative sign rule (e.g. 15-20% -> 15 से 20 परसेंट)
  // Prevents "15-20%" from being spoken as "15 माइनस 20 परसेंट"!
  sanitized = sanitized.replace(/(\d+)\s*[-–—]\s*(\d+)\s*%/g, '$1 से $2 परसेंट');
  sanitized = sanitized.replace(/(\d+)\s*[-–—]\s*(\d+)/g, '$1 से $2');

  // 3. Fix Microsoft hi-IN-MadhurNeural slurring half-la (ल्) in रिज़ल्ट / रिजल्ट into "रिज़िट"
  sanitized = sanitized.replace(/रि[ज़जज़]ल्ट्स/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]ल्ट/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]िट/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]ट/gi, 'नतीजे');

  // 4. Fix slurred English loanwords in Devanagari
  sanitized = sanitized.replace(/एकसपायरी/g, 'एक्सपायरी');
  sanitized = sanitized.replace(/वॉल्क|वाल्क/g, 'वॉक');
  sanitized = sanitized.replace(/सेल्[फ़फ][\s-]*अ[\s-]*फुलफिलिंग/g, 'सेल्फ-फुलफिलिंग');
  sanitized = sanitized.replace(/लेवरेज्ड/g, 'लीवरेज्ड');

  // 5. Smooth out awkward regulatory & English clusters
  sanitized = sanitized.replace(/दवा रेगुलेटर\s*\(?FDA\)?/gi, 'दवा रेगुलेटर');
  sanitized = sanitized.replace(/\bUSFDA\b/gi, 'एफ डी ए');
  sanitized = sanitized.replace(/\bFDA\b/gi, 'एफ डी ए');
  sanitized = sanitized.replace(/यू\s*एस\s*एफ\s*डी\s*ए/g, 'एफ डी ए');

  // 6. Currency & Mathematical Symbols (handles decimals & negative numbers only when preceded by space/start)
  sanitized = sanitized.replace(/₹\s*(\d+(?:\.\d+)?)/g, '$1 रुपये');
  sanitized = sanitized.replace(/(\d+(?:\.\d+)?)%/g, '$1 परसेंट');
  sanitized = sanitized.replace(/(^|\s)\+(\d+(?:\.\d+)?)/g, '$1प्लस $2');
  sanitized = sanitized.replace(/(^|\s)-(\d+(?:\.\d+)?)/g, '$1माइनस $2');

  // 7. Finance & Regulatory Acronyms
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
  sanitized = sanitized.replace(/\bCMT\b/gi, 'सी एम टी');
  sanitized = sanitized.replace(/\bQ1\b/gi, 'क्यू वन');
  sanitized = sanitized.replace(/\bQ2\b/gi, 'क्यू टू');
  sanitized = sanitized.replace(/\bQ3\b/gi, 'क्यू थ्री');
  sanitized = sanitized.replace(/\bQ4\b/gi, 'क्यू फोर');

  // 8. Tech & Systems Acronyms
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