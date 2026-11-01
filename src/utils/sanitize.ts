/**
 * Phonetic Sanitizer for Hindi TTS (Edge-TTS & Gemini TTS)
 * Converts currencies, percentages, symbols, and English financial/technical
 * acronyms into natural Devanagari phonetic pronunciations.
 */
export function sanitizeForHindiTTS(text: string): string {
  if (!text) return '';
  let sanitized = text;

  // Fix Microsoft hi-IN-MadhurNeural slurring half-la (ल्) in रिज़ल्ट / रिजल्ट into "रिज़िट"
  sanitized = sanitized.replace(/रि[ज़जज़]ल्ट्स/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]ल्ट/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]िट/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]ट/gi, 'नतीजे');

  // Fix slurred English loanwords in Devanagari (Expiry, Walk, Self-fulfilling, Leverage)
  sanitized = sanitized.replace(/एकसपायरी/g, 'एक्सपायरी');
  sanitized = sanitized.replace(/वॉल्क|वाल्क/g, 'वॉक');
  sanitized = sanitized.replace(/सेल्[फ़फ][\s-]*अ[\s-]*फुलफिलिंग/g, 'सेल्फ-फुलफिलिंग');
  sanitized = sanitized.replace(/लेवरेज्ड/g, 'लीवरेज्ड');

  // Smooth out awkward regulatory & English clusters
  sanitized = sanitized.replace(/दवा रेगुलेटर\s*\(?FDA\)?/gi, 'दवा रेगुलेटर');
  sanitized = sanitized.replace(/\bUSFDA\b/gi, 'एफ डी ए');
  sanitized = sanitized.replace(/\bFDA\b/gi, 'एफ डी ए');
  sanitized = sanitized.replace(/यू\s*एस\s*एफ\s*डी\s*ए/g, 'एफ डी ए');

  // Currency & Mathematical Symbols
  sanitized = sanitized.replace(/₹(\d+)/g, '$1 रुपये');
  sanitized = sanitized.replace(/(\d+)%/g, '$1 परसेंट');
  sanitized = sanitized.replace(/\+(\d+)/g, 'प्लस $1');
  sanitized = sanitized.replace(/-(\d+)/g, 'माइनस $1');

  // Finance & Regulatory Acronyms
  sanitized = sanitized.replace(/[()]/g, '');
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

  // Tech & Systems Acronyms
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