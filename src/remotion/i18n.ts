/* Fixed on-screen labels of the layout and templates, per display language. */

export interface UiStrings {
  pointsToRemember: string;
  whereWeAre: string;
  simpleMeaning: string;
  roleHere: string;
  connectsTo: string;
  example: string;
  given: string;
  steps: string;
  result: string;
  illustrative: string;
  thinkTime: string;
  answer: string;
  vs: string;
  roles: Record<"condition" | "action" | "mechanism" | "result" | "consequence", string>;
  status: Record<"done" | "current" | "next", string>;
}

const en: UiStrings = {
  pointsToRemember: "POINTS TO REMEMBER",
  whereWeAre: "WHERE WE ARE",
  simpleMeaning: "Simple meaning",
  roleHere: "Role here",
  connectsTo: "Connects to",
  example: "Example",
  given: "Given",
  steps: "Steps",
  result: "Result",
  illustrative: "ILLUSTRATIVE MODEL",
  thinkTime: "Think",
  answer: "Answer",
  vs: "vs",
  roles: { condition: "Condition", action: "Action", mechanism: "Mechanism", result: "Result", consequence: "Consequence" },
  status: { done: "Done", current: "Now", next: "Next" },
};

const hi: UiStrings = {
  pointsToRemember: "याद रखने योग्य बातें",
  whereWeAre: "हम कहाँ हैं",
  simpleMeaning: "सरल अर्थ",
  roleHere: "यहाँ भूमिका",
  connectsTo: "किससे जुड़ा है",
  example: "उदाहरण",
  given: "दिया है",
  steps: "चरण",
  result: "परिणाम",
  illustrative: "उदाहरण मॉडल",
  thinkTime: "सोचिए",
  answer: "उत्तर",
  vs: "बनाम",
  roles: { condition: "स्थिति", action: "क्रिया", mechanism: "तंत्र", result: "परिणाम", consequence: "असर" },
  status: { done: "पूरा", current: "अभी", next: "आगे" },
};

const TABLE: Record<string, UiStrings> = { en, hi };

export function ui(lang: string): UiStrings {
  return TABLE[lang.split("-")[0]] ?? en;
}
